/**
 * @lemon
 */

import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    ImageBackground,
    ScrollView,
    Dimensions,
    Image,
    WebView,
    Platform, AsyncStorage
} from 'react-native';
import GBNetWorkService from "../../core/GBNetWorkService";
import GBServiceParam from "../../core/GBServiceParam";
import BigPopPage from "../../common/BigPopPage";
import MessageCenterView from "./MessageCenterView";
import ApplySuccess from "../ApplyResult/ApplySuccess";
import ApplyFailed2 from "../ApplyResult/ApplyFailed2";
import UIMacro from '../../core/UIMacro'
import ImageUrlManager from '../../core/ImageUrlManager'
import LoadingView from "../Loading/LoadingView";
import FastImage from 'react-native-fast-image';
import MessageDetailView from "./MessageDetailView";
import TouchableBounce from '../../common/TouchableBounce'

const BORDER_WIDTH = 2;

//webView注入js
const BaseScript =
    // 检测web端总元素高度
    `
     (async function () {        let height = null;
        //重置图片宽高 —— 所有表格样式初始化
        await (function changePicWH() {
            //遍历所有图片宽高比例——判断宽度——分别重置宽高
            let arr=document.getElementsByTagName('img')
            for(let i=0;i<arr.length;i++){
                let item=arr[i];
                let image = new Image()
                image.src = item.src
                let naturalWidth =''
                let naturalHeight =''
                //标签是否有宽高属性
                if(!item.style.width){
                    //没有,查src宽高
                    naturalWidth = image.width
                    naturalHeight = image.height
                    // item.click=alert('图片宽度'+naturalWidth)
                    // item.click=alert('图片高度'+naturalHeight)
                    percent=naturalWidth/naturalHeight
                    // item.click=alert('比例-----'+percent)
                    
                    item.style.width =naturalWidth<300*`+UIMacro.WIDTH_PERCENT+`?naturalWidth:300*`+UIMacro.WIDTH_PERCENT+`
                    let With1=parseFloat(item.style.width)
                    //webView不能检测web端的自动按比例缩放图片机制
                    item.style.height =With1/percent+'px'
                    // item.click=alert('图片宽度1-----'+item.style.width)
                    // item.click=alert('图片高度1-----'+item.style.height)
                    // item.click=alert('比例1-----'+(parseFloat(item.style.width)/parseFloat(item.style.height)))
                }else{
                    //有,按照标签属性宽高
                    naturalWidth = item.style.width
                    naturalHeight = item.style.height
                    // item.click=alert('图片宽度-'+naturalWidth)
                    // item.click=alert('图片高度-'+naturalHeight)
                    percent=parseFloat(naturalWidth)/parseFloat(naturalHeight)
                    // item.click=alert('比例-----'+percent)
                    
                    item.style.width =parseFloat(naturalWidth)<parseFloat(300*`+UIMacro.WIDTH_PERCENT+`)?naturalWidth:300*`+UIMacro.WIDTH_PERCENT+`
                    let With1=parseFloat(item.style.width)
                    //webView不能检测web端的自动按比例缩放图片机制
                    item.style.height =With1/percent+'px'
                    // item.click=alert('图片宽度1-----'+item.style.width)
                    // item.click=alert('图片高度1-----'+item.style.height)
                    // item.click=alert('比例1-----'+(parseFloat(item.style.width)/parseFloat(item.style.height)))
                }
            }
            // 遍历所有表格
            let arr2=document.getElementsByTagName('table')
            for(let i=0;i<arr2.length;i++){
                let item=arr2[i];
                item.style.borderCollapse="collapse";
            }
            let arr1=document.getElementsByTagName('td')
            for(let i=0;i<arr1.length;i++){
                let item=arr1[i];
                item.style.border="1px solid";
            }
        })()
        //文本高度
        function changeHeight() {
          if (document.body.scrollHeight != height) {
            height = document.body.scrollHeight;
            if (window.postMessage) {
              window.postMessage(JSON.stringify({
                type: 'setHeight',
                height: height,
              }))
            }
          }
        }
        setTimeout(changeHeight, 300);
    } )()
    `;

export default class PromotionsView extends BigPopPage {
    constructor(pros) {
        super(pros);
        this.state = {
            ...this.state,
            selectStatus:true,  //false:消息中心 true：活动中心 first_deposit：首存送 relief_fund：救援金
            modalVisible: false,
            data: 0,
            content: {},
            itemSelectIndex: 0,
            childSelectedIndex: 0,
            applyRes: false,
            height: 0,
            picWidth:0,
            picHeight:0,
            detail:null,
        }
    }

    // 打开优惠活动与消息中心弹框
    pageDidShow = ()=>{
        this.setState({
            data:0,
            selectStatus:this.props.selectStatus,
        },this.showPromotionView)
    }
    showPromotionView  = () =>{
        if(this.state.selectStatus){
            this.loadingView.showAnimation();
            // 请求优惠活动
            GBNetWorkService.post("mobile-api/chessActivity/getActivityTypes.html", null, null, this._DataSucessBack, this._DataFailBack)
        }
    }
    _DataSucessBack = (json) => {
        console.log('点击优惠活动', json);
        this.setState({
            data: json.data,
        }, this.initSelect)
    };
    _DataFailBack = () => {
        this.loadingView.dismissAnimation();
        console.log('请求失败！111')
    };
    //数据分析 初始化选择状态
    initSelect = () => {
        this.loadingView.dismissAnimation();
        this.setState({
            height: 0,
            picWidth:0,
            picHeight:0,
        });
        let searchId=false;
        if(this.state.selectStatus===true){  //true  活动中心0
            this.initIndex(0,0);
        }else
        {
            this.searchPromotions(this.state.selectStatus)
        }
    };
    // 遍历数据,查找对应活动位置
    searchPromotions = (searchId) =>{
        let itemSelectIndex=0,childSelectedIndex=0
        // 遍历数据位置 有：定位  无：data变空 该活动暂未开放
        if (this.state.data && this.state.data.length > 0) {
            for(let i=0;i<this.state.data.length;i++){
                if (this.state.data[i].activityList.length > 0) {
                    for (let a = 0; a < this.state.data[i].activityList.length; a++) {
                        if(this.state.data[i].activityList[a].searchId===searchId){
                            itemSelectIndex=i;
                            childSelectedIndex=a;
                            this.initIndex(itemSelectIndex,childSelectedIndex)
                            break;
                        }
                    }
                }
            }
        }
    }
    // 选择初始化函数
    initIndex = (itemSelectIndex,childSelectedIndex) =>{
        this.setState({
            itemSelectIndex: itemSelectIndex,
            childSelectedIndex: childSelectedIndex,
        },this.askForContent);
    }
    //请求三级内容
    askForContent  = () => {
        // 请求
        if (this.state.data.length > 0) {
            // 保存图片宽高
            let uri= ImageUrlManager.dealURI(this.state.data[this.state.itemSelectIndex].activityList[this.state.childSelectedIndex].photo);
            this.measureWidth(uri)

            let searchId = this.state.data[this.state.itemSelectIndex].activityList[this.state.childSelectedIndex].searchId;
            let sId = {'searchId': searchId};
            GBNetWorkService.post("mobile-api/chessActivity/getActivityById.html", sId, null, this._ContentSucessBack, this._ContentFailBack)
        }
    };
    _ContentSucessBack = (json) => {
        this.loadingView && this.loadingView.dismissAnimation();
        this.scrollView &&
        this.oneTitleScroll()
        console.log('请求三级内容',json)
        this.setState({
            content: json.data,
        })
    };
    _ContentFailBack = (json) => {
        this.loadingView && this.loadingView.dismissAnimation();
        console.log('三级详细内容请求失败！')
    };
    // 一级标题滚动到相应位置
    oneTitleScroll = () =>{
        let index=this.state.itemSelectIndex,lengths=this.state.data.length;
        // scroll最大滑动总长
        let maxScroll=(lengths-3.5)*88* UIMacro.HEIGHT_PERCENT;
        //1: <3  靠左   2: >3 <m-3 动到一个视图位置   3: >-3 靠右 (滚靠右)
        if(index<2){
            this.scrollView.scrollTo({x:0,y:0,animated:true});
        }
        if(index>1 && index<lengths-2){
            this.scrollView.scrollTo({
                x:((index-1)*88* UIMacro.HEIGHT_PERCENT<maxScroll?(index-1)*88* UIMacro.HEIGHT_PERCENT:maxScroll)>0?
                    ((index-1)*88* UIMacro.HEIGHT_PERCENT<maxScroll?(index-1)*88* UIMacro.HEIGHT_PERCENT:maxScroll):0,
                y:0,
                animated:true});
        }
        if(index>lengths-3){
            this.scrollView.scrollTo({
                x:((lengths-3)*88* UIMacro.HEIGHT_PERCENT<maxScroll?(lengths-3)*88* UIMacro.HEIGHT_PERCENT:maxScroll)>0?
                    (lengths-3)*88* UIMacro.HEIGHT_PERCENT<maxScroll?(lengths-3)*88* UIMacro.HEIGHT_PERCENT:maxScroll:0,
                y:0,
                animated:true});
        }
    }
    // 测内容图片宽高
    measureWidth = (uri) =>{
        // 图片uri错误防守，报黄处理
        let str=/\w(\.gif|\.jpeg|\.webp|\.jpg|\.bmp|\.ico|\.png)/i;
        if(!(uri.search(str)===-1)){
            Image.getSize(uri, (width, height) => {
                this.setState({picWidth:width,picHeight:height});
            });
        }
    }

    // 一级标题容器
    showOneTitle = () => {
        return <View style={styles.childTitle0}>
            <ScrollView ref={(scrollView) => {
                this.scrollView = scrollView
            }}
                        horizontal={true} showsHorizontalScrollIndicator={true}>
                {
                    this.showOneTitle1()
                }
            </ScrollView>
        </View>
    };
    //判断是否有优惠活动
    showPromotions = () => {
        if (this.state.data.length > 0) {
            return <View style={styles.modalMiddleView}>
                <View style={styles.modalLeftView}>
                    <View style={styles.modalLeftImage}>
                        <View style={{paddingBottom: 3 * UIMacro.HEIGHT_PERCENT, alignItems: 'center'}}>
                            <ScrollView showsVerticalScrollIndicator={false} alwaysBounceVertical={true}
                                        overScrollMode='always' bounces={true}>
                                {/*左边*/}
                                {
                                    this.showTwoTitle()
                                }
                            </ScrollView>
                        </View>
                    </View>
                </View>
                <View style={styles.modalRightView}>
                    {/*右上*/}
                    {
                        this.showOneTitle()
                    }
                    <View style={styles.promotionsContainer}>
                        {/*内容*/}
                        <ScrollView alwaysBounceVertical={true} overScrollMode='always' bounces={true}>
                            {
                                this.showContent()
                            }
                        </ScrollView>
                    </View>
                </View>
            </View>
        } else if (this.state.data.length===0) {
            return <View style={styles.noPromotions}>
                <FastImage style={styles.noPromotionsPic} source={require('../../static/images/2.1.0/nodata.webp')}>
                    <Text style={styles.noPromotionsTips}>当前没有活动可参与</Text>
                </FastImage>
            </View>
        }
    };
    // 一级标题点击
    ItemPress = (index) => {
        this.loadingView.showAnimation();
        this.setState({
            itemSelectIndex: index,
            childSelectedIndex: 0,
            content: {},
            height: 0,
            picWidth:0,
            picHeight:0,
        }, this.askForContent)
    };
    // 渲染优惠活动一级标题
    showOneTitle1 = () => {
        if (this.state.data.length > 0) {
            let arr = [];
            this.state.data.map((item, index) => {
                arr.push(
                    <View key={index}>
                        <TouchableBounce onPress={() => this.ItemPress(index)}
                        >
                            <FastImage style={styles.childTitle}
                                             source={index === this.state.itemSelectIndex ? require('../../static/images/2.1.0/bg_deposited_activity.webp') : require('../../static/images/2.1.0/bg_deposit_activity.webp')}>
                                <Text numberOfLines={1} style={styles.childTitleText}>{item.activityTypeName}</Text>
                            </FastImage>
                        </TouchableBounce>
                    </View>
                )
            });
            return arr
        }
    };
    // 二级选择
    childSelect = (index) => {
        this.loadingView.showAnimation();
        this.setState({
            childSelectedIndex: index,
            content: {},
            height: 0,
            picWidth:0,
            picHeight:0,
        }, this.askForContent)
    };
    //二级标题遍历渲染
    showTwoTitle = () => {
        if (this.state.data.length > 0) {
            let arr = [];
            if (this.state.data[this.state.itemSelectIndex]) {
                this.state.data[this.state.itemSelectIndex].activityList.map((item, index) => {
                    arr.push(
                        <TouchableBounce key={index} onPress={() => {
                            this.childSelect(index)
                        }} style={styles.denglu}>
                            <FastImage style={styles.btnClick}
                                             source={index === this.state.childSelectedIndex ? require('../../static/images/2.1.0/btn_click.webp') : require('../../static/images/2.1.0/btn_general_click.webp')}>
                                <Text numberOfLines={2} style={styles.itemText}>{item.name}</Text>
                            </FastImage>
                        </TouchableBounce>
                    )
                });
            }
            return arr
        }
    };
    //3级内容
    showContent = () => {
        return <View style={styles.detailAll}>
            <ScrollView alwaysBounceVertical={true} overScrollMode='always' bounces={true}>
                {/*内容标题*/}
                <View style={styles.detailTitle}>
                    {/*<Image source={require('../../static/images/2.1.0/title.webp')}/>*/}
                    <Text
                        style={styles.detailTitleText}>{this.state.data[this.state.itemSelectIndex].activityList[this.state.childSelectedIndex].name}</Text>
                </View>
                {/*内容图片*/}
                <View style={styles.detailPhoto}>
                    <FastImage source={{
                        uri: ImageUrlManager.dealURI(this.state.data[this.state.itemSelectIndex].activityList[this.state.childSelectedIndex].photo),
                        headers: {Host: GBServiceParam.currentHost},
                        priority: FastImage.priority.normal,
                    }}
                        resizeMode='contain'
                               style={{
                                   width:this.state.picWidth>312* UIMacro.WIDTH_PERCENT?
                                       312 * UIMacro.WIDTH_PERCENT:this.state.picWidth* UIMacro.WIDTH_PERCENT,
                                   height: (this.state.picWidth>312* UIMacro.WIDTH_PERCENT?
                                       312:this.state.picWidth)*(this.state.picHeight/this.state.picWidth)* UIMacro.WIDTH_PERCENT
                               }}
                    />
                </View>
                {/*活动时间*/}
                <View>
                    <FastImage style={styles.validTime}
                                     source={require('../../static/images/2.1.0/bg_activity_title.webp')}>
                        <Text style={styles.commonText}>活动时间</Text>
                    </FastImage>
                    <Text style={[styles.commonText, styles.commonTextContent]}>{
                        this.state.data[this.state.itemSelectIndex].activityList[this.state.childSelectedIndex].time ?
                            this.state.data[this.state.itemSelectIndex].activityList[this.state.childSelectedIndex].time :
                            '长期有效'}
                    </Text>
                </View>
                {/*活动说明*/}
                <View>
                    {/*活动说明标题*/}
                    <FastImage style={styles.validTime}
                                     source={require('../../static/images/2.1.0/bg_activity_title.webp')}>
                        <Text style={styles.commonText}>活动说明</Text>
                    </FastImage>
                    {/* WebView设置自适应高度*/}
                    {
                        this.webViewShow()
                    }
                </View>
            </ScrollView>
            {/*是否有申请按钮*/}
            {
                this.applyBtn()
            }
        </View>
    };
    webViewShow = () => {
        if (this.state.content && !(JSON.stringify(this.state.content) == "{}") && this.state.content.code) {
            // console.log("vebView渲染",this.state.content.code)
            return <WebView
                useWebKit={false}
                injectedJavaScript={BaseScript}
                style={{
                    width: 312 * UIMacro.WIDTH_PERCENT,
                    height: this.state.height,
                    backgroundColor: 'rgba(0,0,0,0)'
                }}
                mixedContentMode='compatibility'
                automaticallyAdjustContentInsets
                source={this.webViewContent()}
                decelerationRate='normal'
                scalesPageToFit={Platform.OS === 'ios' ? false : true}
                javaScriptEnabled // 仅限Android平台。iOS平台JavaScript是默认开启的。s
                domStorageEnabled // 适用于安卓
                scrollEnabled={false}
                onMessage={(event) => this.onMessage(event)}
            />
        }
    }

    webViewContent = () => {

        return (
            Platform.OS === 'ios' ?
                {html: "<div style=\"font-size: 11px;color: #fff; word-wrap:break-word;\">" + this.state.content.code + "</div>"} :
                {html: "<div style=\"font-size: 11px;color: #fff;word-wrap:break-word;\">" + this.state.content.code + "</div>", baseUrl: ''}
        )

    }

    // 接收web端交互消息
    onMessage(event) {
        try {
            const action = JSON.parse(event.nativeEvent.data)
            if (action.type === 'setHeight' && action.height > 0) {
                this.setState({height: action.height}, () => {
                    console.log('onMessage', this.state.height)
                })
            }
        //    关闭loding
            this.loadingView.dismissAnimation();
        } catch (error) {
            // pass
        }
    }

    //判断什么时候要有申请按钮
    applyBtn = () => {
        if (this.state.content && !(JSON.stringify(this.state.content) == "{}") && this.state.content.status === false) {//true=不可申请
            return <View style={styles.apply}>
                <TouchableBounce onPress={this.applyFor}>
                    <FastImage resizeMode='contain' style={styles.applyBg}
                                     source={require('../../static/images/2.1.0/btn_blue_small.webp')}>
                        <Text style={styles.btnText}>立即申请</Text>
                    </FastImage>
                </TouchableBounce>
            </View>
        }
    };
    // 申请返回数据
    applyFor = () => {
        this.loadingView.showAnimation();
        // 根据玩家条件或活动条件判断——返回申请结果---再回调弹出框
        let searchId = this.state.data[this.state.itemSelectIndex].activityList[this.state.childSelectedIndex].searchId;
        let sId = {'searchId': searchId};
        console.log('申请的活动id', sId);
        GBNetWorkService.post("mobile-api/chessActivity/toApplyActivity.html", sId, null, this._ApplySucessBack, this._ApplyFailBack)
    };
    _ApplySucessBack = (json) => {
        this.loadingView.dismissAnimation();
        console.log("申请结果", json)
        this.setState({
            applyRes: json.data,
        }, this.applyForRes)
    };
    _ApplyFailBack = (json) => {
        this.loadingView.dismissAnimation();
        console.log('申请请求失败！222')
    };
    // 根据活动申请结果——>分情况弹出申请结果
    applyForRes = () => {
        if(this.state.applyRes && !(JSON.stringify(this.state.applyRes) == "{}")) {
            let res = this.state.applyRes.status;
            if (res === 1) {
                this.ApplySuccess.showPopView()
            }else if (res === 2||res === 3) {
                this.ApplyFailed2.showPopView()
            }
        }
    };
    // 分情况渲染申请结果
    renderPage = ()=>{
        let result=<View key='1'></View>;
        if(this.state.data!==0 && this.state.data.length>0 && this.state.applyRes && !(JSON.stringify(this.state.applyRes) == "{}")){
            let searchId= this.state.data[this.state.itemSelectIndex].activityList[this.state.childSelectedIndex].searchId;
            let res = this.state.applyRes.status;
            if (res === 1) {
                result= <ApplySuccess
                    searchId={searchId}
                    applyRes={this.state.applyRes}
                    ref={(c)=>this.ApplySuccess = c}
                    key='2'
                />
            }else if ( res === 2||res === 3) {
                result= <ApplyFailed2
                    searchId={searchId}
                    applyRes={this.state.applyRes}
                    ref={(c)=>this.ApplyFailed2 = c}
                    key='4'
                />
            }
        }
        // 弹框
        return [<LoadingView ref={(c) => this.loadingView = c} key={"loading"}/>, result,<MessageDetailView key={"Detail"} detail={this.state.detail} ref={(c) => this.MessageDetail = c}/>]
    }
    // 消息详情数据
    saveDetail = (detail)=>{
        this.setState({
            detail:detail,
        })
    }
    //背景图片
    popPageBackground=()=>{
        return  require('../../static/images/2.1.0/popups_activity.webp')
    }
    //标题自定义视图
    titleView = ()=>{
        return <View style={styles.topTitleView}>
            <FastImage style={styles.topTitleImage}
                             source={require('../../static/images/2.1.0/classify_main.webp')}>
                <TouchableBounce onPress={() => {
                    this.selectPromotion(true)
                }}>
                    <FastImage style={styles.titleTextImage0} source={this.state.selectStatus?require('../../static/images/2.1.0/btn_activity.webp'):require('../../static/images/2.1.0/btn_activity2.webp')}/>
                </TouchableBounce>
                <TouchableBounce onPress={() => {
                    this.selectPromotion(false)
                }}>
                    <FastImage style={styles.titleTextImage1} source={this.state.selectStatus?require('../../static/images/2.1.0/btn_news2.webp'):require('../../static/images/2.1.0/btn_news.webp')}/>
                </TouchableBounce>
            </FastImage>
        </View>
    }
    //true 显示优惠活动 false显示消息中心
    selectPromotion = (bool) => {
        // 状态初始化
        this.setState({
            selectStatus: bool,
            itemSelectIndex: 0,
            childSelectedIndex: 0,
            content: {},
            height: 0,
            picWidth:0,
            picHeight:0,
        }, ()=>this.selectTrue(bool))
    }
    selectTrue = (bool) => {
        if(bool){
            this.loadingView.showAnimation()
            console.log('请求！111')
            GBNetWorkService.post("mobile-api/chessActivity/getActivityTypes.html", null, null, this._DataSucessBack, this._DataFailBack)
        }
    }

    //重写弹窗内容
    contentView = () => {
        if(this.state.selectStatus){
            return (
                <View>
                    { this.showPromotions() }
                </View>
            );
        }else{
            return <MessageCenterView saveDetail={this.saveDetail} showMessageDetail={this.MessageDetail.showPopView}/>
        }
    }

    pageDidClose = ()=>{
        // 选择状态为显示优惠活动
        this.setState({
            selectStatus:true,
            itemSelectIndex: 0,
            childSelectedIndex: 0,
        })
        this.timer && clearTimeout(this.timer);
    }
}

const styles = StyleSheet.create({
    noPromotions: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    noPromotionsPic: {
        marginTop:20* UIMacro.WIDTH_PERCENT,
        justifyContent: 'flex-end',
        alignItems: 'center',
        width:152* UIMacro.WIDTH_PERCENT,
        height:152* UIMacro.WIDTH_PERCENT,
    },
    noPromotionsTips: {
        fontSize:11,
        color:'white',
        fontWeight:"bold",
    },
    topTitleView: {
        marginTop: 12* UIMacro.HEIGHT_PERCENT,
        alignItems: 'center',
    },
    topTitleImage: {
        width:165* UIMacro.HEIGHT_PERCENT,
        height:165*(46/340)* UIMacro.HEIGHT_PERCENT,
        flexDirection:'row',
        alignItems: 'center',
    },
    titleTextImage0: {
        width:80*UIMacro.HEIGHT_PERCENT,
        height:80*(55/210)*UIMacro.HEIGHT_PERCENT,
    },
    titleTextImage1: {
        width:85*UIMacro.HEIGHT_PERCENT,
        height:85*(55/210)*UIMacro.HEIGHT_PERCENT,
    },
    btnClick: {
        width: 41 * (235 / 82) * UIMacro.HEIGHT_PERCENT,
        height: 41 * UIMacro.HEIGHT_PERCENT,
        marginTop: 5 * UIMacro.HEIGHT_PERCENT,
        justifyContent: 'center',
        alignItems: 'center',
    },
    childTitle0: {
        height: 40 * UIMacro.HEIGHT_PERCENT,
        justifyContent: 'flex-start'
    },
    childTitle: {
        width: 25 * (170 / 50) * UIMacro.HEIGHT_PERCENT,
        height: 25 * UIMacro.HEIGHT_PERCENT,
        marginLeft: 3 * UIMacro.WIDTH_PERCENT,
        justifyContent: 'center',
        alignItems: 'center'
    },
    itemText: {
        color: '#fff',
        fontSize: 11,
        fontWeight: 'bold',
        margin: 10 * UIMacro.WIDTH_PERCENT, textAlign: 'center',
    },
    childTitleText: {
        color: '#fff',
        fontSize: 11,
        fontWeight: 'bold',
        marginLeft: 10 * UIMacro.WIDTH_PERCENT,
        marginRight: 10 * UIMacro.WIDTH_PERCENT,
    },
    modalLeftImage: {
        width: 300 * (270 / 605) * UIMacro.WIDTH_PERCENT,
        height: 300 * UIMacro.HEIGHT_PERCENT,

    },
    modalLeftView: {},
    modalRightView: {
        backgroundColor: 'rgba(0,0,0,0.2)',
        padding: 5*UIMacro.WIDTH_PERCENT,
        width: 330* UIMacro.WIDTH_PERCENT,
        height: 293 * UIMacro.HEIGHT_PERCENT,
        borderRadius: 5,
    },
    promotionsContainer: {
        height: 244 * UIMacro.HEIGHT_PERCENT,
    },
    modalMiddleView: {
        flexDirection: 'row',
    },
    apply: {
        width: 322 * UIMacro.WIDTH_PERCENT,
        justifyContent: 'center',
        alignItems: 'flex-end',
        marginBottom: 30* UIMacro.WIDTH_PERCENT,
    },
    applyBg: {
        width: 29 * (111 / 48) * UIMacro.HEIGHT_PERCENT,
        height: 29 * UIMacro.HEIGHT_PERCENT,
        marginTop: 15 * UIMacro.HEIGHT_PERCENT,
        marginRight: 30 * UIMacro.HEIGHT_PERCENT,
        justifyContent: 'center',
    },
    btnText: {
        textAlign: 'center',
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 12,
    },
    // 详细内容标题
    detailAll: {
        marginLeft: 5 * UIMacro.WIDTH_PERCENT,
    },
    detailTitle: {
        alignItems: 'center',
        flexDirection: 'row',
    },
    detailTitleText: {
        fontSize: 14,
        color: 'rgba(212, 219, 255, 1)',
        fontWeight: 'bold',
        marginLeft: 14 * UIMacro.WIDTH_PERCENT,
    },
    detailPhoto: {
        // alignItems: 'center',
        marginTop: 5 * UIMacro.HEIGHT_PERCENT,
        marginRight: 5 * UIMacro.WIDTH_PERCENT,
    },
    validTime: {
        marginTop: 10 * UIMacro.HEIGHT_PERCENT,
        marginBottom: 5 * UIMacro.HEIGHT_PERCENT,
        width: 74 * UIMacro.WIDTH_PERCENT,
        height: 74*(45/147) * UIMacro.HEIGHT_PERCENT,
        justifyContent: 'center',
        alignItems: 'center',
    },
    commonText: {
        fontWeight:'bold',
        fontSize: 11,
        color: 'rgba(212, 219, 255, 1)',
    },
    commonTextContent: {
        marginLeft: 14 * UIMacro.WIDTH_PERCENT,
    },
});
