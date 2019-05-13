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
    DeviceEventEmitter
} from 'react-native';

import GBNetWorkService from "../../core/GBNetWorkService";
import MessageDetailView from "./MessageDetailView";
import CheckBox from 'react-native-checkbox';
import TimeZoneManager from "../../core/TimeZoneManager";
import RechargeCenterView from "../RechargeCenter/RechargeCenterView";
import UIMacro from '../../core/UIMacro'
import LoadingView from "../Loading/LoadingView";
import SkinsColor from "../../core/SkinsColor";
import TouchableBounce from '../../common/TouchableBounce'
import FastImage from 'react-native-fast-image';


export default class MessageCenterView extends Component {
    state = {
        messageList:[
            {father: '游戏公告'},
            {father: '系统公告'},
            {father: '收件箱'},
        ],
        listData:{},
        itemSelectIndex:0,
        detailData:0,
        unreadNews:0,
        listIndex:0,
    };

    // 请求消息中心信息
    componentDidMount(){
        this.loadingView.showAnimation();
        this._isMounted=true
        // 请求第一项消息内容（游戏公告）
        GBNetWorkService.post("mobile-api/mineOrigin/getGameNotice.html",null,null,this._DataSucessBack,this._DataFailBack )
        // 未读消息
        GBNetWorkService.post("mobile-api/mineOrigin/getUnReadCount.html",null,null,this._UnreadSucessBack,this._UnreadFailBack )
    }
    componentWillUnmount(){
        this._isMounted = false
    }
    _DataSucessBack = (json)=>{
        this.loadingView && this.loadingView.dismissAnimation();
        console.log('消息中心',json);
        // 手机端转义字符'"'无法转义——手工转
        let nowListData=json.data
        let str=/\w*&quot;\w*/ig
        nowListData &&
        nowListData.list.map((item)=>{
            item.context=item.context.replace(str,"\"")
        });
        console.log('消息中心1',nowListData);
        this._isMounted && this.setState({
            listData:nowListData,
        })
    };
    _DataFailBack= (json)=>{
        this.loadingView && this.loadingView.dismissAnimation();
        console.log('请求失败！')
        
    };
    _UnreadSucessBack = (json)=>{
        console.log('未读信息',json);
        this._isMounted && this.setState({
            unreadNews:json.data,
        })
    };
    _UnreadFailBack= (json)=>{
        console.log('请求失败！')
        
    };
    // 左列表点击
    ItemPress= (index) => {
        this.setState({
            itemSelectIndex:index,
            listIndex:0,
            detailData:0,
        },this.getChangeList)
    };
    //请求信息列表
    getChangeList= ()=>{
        this.loadingView.showAnimation();
        this.setState({
            listData:{},
        })
        let url='';
        if(this.state.itemSelectIndex===0){
            url="mobile-api/mineOrigin/getGameNotice.html?paging.pageSize=5000&paging.pageNumber=1";
        }else if(this.state.itemSelectIndex===1){
            url="mobile-api/mineOrigin/getSysNotice.html?paging.pageSize=5000&paging.pageNumber=1";
        }else{
            url="mobile-api/mineOrigin/getSiteSysNotice.html?paging.pageSize=5000&paging.pageNumber=1";
        }
        console.log('进入get请求');
        GBNetWorkService.get(url,null,null,this._ListSucessBack,this._ListFailBack )
    };
    _ListSucessBack = (json)=>{
        this.loadingView && this.loadingView.dismissAnimation();
        // 给每条信息加属性isSelect
        console.log('请求Liebiao！',json);
        if(json.data && !(JSON.stringify(json) == "{}")){
            console.log('防不住',json.data);
            for(let i=0;i<json.data.list.length;i++){
                json.data.list[i].isSelect=false;
            }
            console.log('信息列表'+this.state.itemSelectIndex+'(加isSelect)',json);
            this.setState({
                listData:json.data,
            })
        }
    };
    _ListFailBack= (json)=>{
        this.loadingView && this.loadingView.dismissAnimation();
        console.log('请求失败！')
    };
    // 点击详情
    listClick= (index) => {
        this.loadingView.showAnimation();
        this.setState({
            listIndex:index,
        },() =>this.getDetail(index))
    };
    // 请求详情
    getDetail= (index) => {
        // 点击到未读时 新信息--
        let nowUnread=this.state.unreadNews;
        if(this.state.itemSelectIndex===2 && nowUnread && this.state.listData.list[this.state.listIndex].read===false){
            nowUnread.sysMessageUnReadCount--;
        }
        this.setState({
            listIndex:index,
            unreadNews:nowUnread,
        });
        let params=''
        if(this.state.itemSelectIndex===0){
            let id=this.state.listData.list[index].id
            params={'searchId':id}
            // console.log('id:',params)
        }else{
            let searchId=this.state.listData.list[index].searchId
            params={'searchId':searchId}
            // console.log('searchId:',params)
        }
        let url='';
        if(this.state.itemSelectIndex===0){
            url="mobile-api/mineOrigin/getGameNoticeDetail.html";
        }else if(this.state.itemSelectIndex===1){
            url="mobile-api/mineOrigin/getSysNoticeDetail.html";
        }else{
            url="mobile-api/mineOrigin/getSiteSysNoticeDetail.html";
        }
        GBNetWorkService.post(url,params,null,this._DetailSucessBack,this._DetailFailBack )
    };

    _DetailSucessBack = (json)=>{
        this.loadingView && this.loadingView.dismissAnimation();
        console.log('详情',json);
        let nowListData=this.state.listData;
        nowListData.list[this.state.listIndex].read=true
        this.setState({
            detailData:json.data,
            listData:nowListData
        },this.showMessageDetail)
    };
    _DetailFailBack= ()=>{
        this.loadingView && this.loadingView.dismissAnimation();
        console.log('请求失败！')
    };
    showMessageDetail= ()=>{
        //确定detail-回调弹框
        if(this.state.listData && !(JSON.stringify(this.state.listData) == "{}") &&
            this.state.listData.list.length>0 &&
            !(JSON.stringify(this.state.detailData) == "{}")){
            let detail=this.state.itemSelectIndex===0?
                this.state.detailData.context:
                this.state.detailData.content
            this.props.saveDetail(detail)
            this.props.showMessageDetail()
        }
    };

    //左列表遍历渲染
    messageItem = () => {
        let arr=[];
        this.state.messageList.map((item,index)=>{
            arr.push(
                <TouchableBounce key={index} onPress={()=>{this.ItemPress(index)}}>
                    <FastImage style={styles.btnClick}
                                     source={index===this.state.itemSelectIndex ? require('../../static/images/2.1.0/btn_click.webp') : require('../../static/images/2.1.0/btn_general.webp')}>
                        <Text numberOfLines={2} style={styles.itemText}>{item.father}</Text>
                    </FastImage>
                    {/*新消息红标记*/}
                    {this.redMark(item,index)}
                </TouchableBounce>
            )
        });
        return arr
    };
    //新消息条数
    redMark = (item,index) =>{
        if(item.father==="收件箱" && this.state.unreadNews && this.state.unreadNews.sysMessageUnReadCount>0){
            return <View style={styles.redMark} key={index+'i'}>
                <FastImage source={require('../../static/images/2.1.0/prompt.webp')} style={{ width:16,height:16 }} />
                <View style={styles.redMarkNum}>
                    <Text style={styles.redMarkNumText}>{this.state.unreadNews.sysMessageUnReadCount}</Text>
                </View>
            </View>
        }
    };
    //右列表容器
    showContent=()=>{
        //有数据返回后再做判断
        if(this.state.listData && !(JSON.stringify(this.state.listData) == "{}")){
            if(this.state.listData.list.length>0){
                let arr=[];
                this.state.listData.list.map((item,index)=>{
                    if(this.state.itemSelectIndex===0){
                        arr.push(
                            <View style={styles.messageList} key={index}>
                                <TouchableBounce style={styles.messageListTouchable} onPress={()=>this.listClick(index)}>
                                    <Text style={styles.listItem} numberOfLines={2}>{item.context}</Text>
                                    <Text style={styles.itemDate} >{TimeZoneManager.getInstance().stringFromTimestamp(item.publishTime)}</Text>
                                </TouchableBounce>
                            </View>
                        )
                    }else if(this.state.itemSelectIndex===1){
                        arr.push(
                            <View style={styles.messageList} key={index}>
                                <TouchableBounce style={styles.messageListTouchable} onPress={()=>this.listClick(index)}>
                                    <Text style={styles.listItem} numberOfLines={2}>{item.content}</Text>
                                    <Text style={styles.itemDate} >{TimeZoneManager.getInstance().stringFromTimestamp(item.publishTime)}</Text>
                                </TouchableBounce>
                            </View>
                        )
                    }else{
                        arr.push(
                            // item.read===true?styles.messageListUnread:
                            <View style={styles.messageList}
                                  key={index}>
                                <TouchableBounce style={styles.messageListTouchable} onPress={()=>this.listClick(index)}>
                                    <Text style={styles.listItem} numberOfLines={2}>{item.title}</Text>
                                    <Text style={styles.itemDate} >{TimeZoneManager.getInstance().stringFromTimestamp(item.publishTime)}</Text>
                                </TouchableBounce>
                                {/*复选框*/}
                                {this.checkBox(item,index)}
                                {/*新消息标记*/}
                                {this.newMark(item,index)}
                            </View>
                        )
                    }

                });
                return arr
            }else if(this.state.listData.list.length===0){
                return <View style={styles.noData}>
                    <FastImage style={styles.noPromotionsPic} source={require('../../static/images/2.1.0/nodata.webp')}>
                        <Text style={styles.noPromotionsTips}>当前暂无消息</Text>
                    </FastImage>
                </View>
            }
        }
    };
    //信息的已读按钮
    showReadMark = () =>{
        let arr=[];
        if(this.state.itemSelectIndex===2 && this.state.listData && !(JSON.stringify(this.state.listData) == "{}")){
            arr.push(
                <View style={styles.emailToDo} key={'end'}>
                    <TouchableBounce onPress={this.allSelect}>
                        <FastImage style={styles.emailMark} source={require('../../static/images/2.1.0/btn_blue_small.webp')}>
                            <Text style={styles.ToDoBtn}>全选</Text>
                        </FastImage>
                    </TouchableBounce>
                    <TouchableBounce onPress={this.markAlreadyRead}>
                        <FastImage style={styles.emailMark} source={require('../../static/images/2.1.0/btn_blue_small.webp')}>
                            <Text style={styles.ToDoBtn}>标记已读</Text>
                        </FastImage>
                    </TouchableBounce>
                    <TouchableBounce onPress={this.deleteAlreadyRead}>
                        <FastImage style={styles.emailMark} source={require('../../static/images/2.1.0/btn_blue_small.webp')}>
                            <Text style={styles.ToDoBtn}>删除已读</Text>
                        </FastImage>
                    </TouchableBounce>
                </View>
            )
        }
        return arr
    }
    checkBox = (item,index) =>{
        if(this.state.itemSelectIndex===2){
            return <View style={styles.messageCheckBox}>
                <CheckBox checked={item.isSelect} label={''}
                          checkedImage={require('../../static/images/2.1.0/select2.png')}
                          uncheckedImage={require('../../static/images/2.1.0/unselect2.png')}
                          checkboxStyle={{borderColor:'#fff',width:14,height:14,}}
                          onChange={() => this.handleChecked(index,item.isSelect)}/>
            </View>
        }
    };
    newMark = (item,index) =>{
        if(this.state.itemSelectIndex===2 && item.read === false){
            return <FastImage style={styles.newMessageMark} key={index+'i'} source={require('../../static/images/2.1.0/update.webp')} />
        }
    };
    //复选按钮绑定状态数据
    handleChecked = (index,isSelect) =>{
        let nowListData=this.state.listData;
        nowListData.list[index].isSelect=!isSelect;
        this.setState({listData:nowListData})
    };
    // 全选消息
    allSelect = () =>{
        if(!(JSON.stringify(this.state.listData) == "{}")) {
            let nowListData = this.state.listData;
            let i = 0;
            for (; i < nowListData.list.length; i++) {
                // 有未选中->全选
                if (nowListData.list[i].isSelect === false) {
                    nowListData.list.map((item, index) => {
                        nowListData.list[index].isSelect = true;
                    });
                    this.setState({listData: nowListData})
                    break;
                }
            }
            if (i === nowListData.list.length) {
                nowListData.list.map((item, index) => {
                    nowListData.list[index].isSelect = false;
                });
                this.setState({listData: nowListData})
            }
        }
    };
    // 标记已读
    markAlreadyRead = () =>{
        if(this.state.unreadNews && !(JSON.stringify(this.state.listData) == "{}")) {
            //找到对应选项 ids
            let ids = '', i = 0;
            this.state.listData.list.map((item, index) => {
                if (item.isSelect === true) {
                    if(item.read===false){
                        if (i === 0) {
                            ids = ids + item.id
                        } else {
                            ids = ids + ',' + item.id
                        }
                        i++
                    }
                }
            });
            // 改变新消息状态数据
            let nowUnread = this.state.unreadNews;
            nowUnread.sysMessageUnReadCount = this.state.unreadNews.sysMessageUnReadCount - i;
            this.setState({
                unreadNews: nowUnread,
            });
            //标记已读请求->不做重新请求，直接改状态数据
            let params = {'ids': ids};
            // console.log('标记已读的ids',ids)
            GBNetWorkService.post("mobile-api/mineOrigin/setSiteSysNoticeStatus.html", params, null, this._MarkReadSucessBack, this._MarkReadFailBack)
        }
    };
    _MarkReadSucessBack = (json)=>{
        // console.log('标记已读接口返回的数据:',json);
        let nowListData=this.state.listData;
        nowListData.list.map((item,index) => {
            if(item.isSelect===true){
                nowListData.list[index].read=true
            }
        });
        this.setState({
            listData:nowListData
        })
    };
    _MarkReadFailBack= (json)=>{
        console.log('请求失败！')
    };
    // 删除已读
    deleteAlreadyRead = () =>{
        if(!(JSON.stringify(this.state.listData) == "{}")) {
            //找到对应选项 ids
            let ids = '', i = 0;
            this.state.listData.list.map((item) => {
                if (item.read === true) {
                    if (i === 0) {
                        ids = ids + item.id
                    } else {
                        ids = ids + ',' + item.id
                    }
                    i++;
                }
            });
            let params = {'ids': ids};
            // console.log('删除的ids',params)
            //删除->不做重新请求，改状态数据
            GBNetWorkService.post("mobile-api/mineOrigin/deleteSiteSysNotice.html", params, null, this._DeleteReadSucessBack, this._DeleteReadFailBack)
        }
    };
    _DeleteReadSucessBack = (json)=>{
        // console.log('删除已读接口返回的数据：',json);
        let nowListData=this.state.listData;
        let newList=[];
        for(let i = 0;i<nowListData.list.length; i++){
            if(nowListData.list[i].read===false){
                newList.push(nowListData.list[i])
            }
        }
        nowListData.list=newList;
        this.setState({
            listData:nowListData
        })
    };
    _DeleteReadFailBack= (json)=>{
        console.log('请求失败！')
    };
    // 传递详细内容
    saveDetail  = () => {
    };
    render() {
        return (
            <View style={styles.modalMiddleView}>
                <View style={styles.modalLeftView}>
                    <View style={styles.modalLeftImage}>
                        <View style={{paddingBottom: 3*UIMacro.HEIGHT_PERCENT,alignItems:'center'}}>
                            {/*左 消息类型*/}
                            {
                                this.messageItem()
                            }
                        </View>
                    </View>
                </View>
                <View style={styles.modalRightView}>
                    <View style={styles.promotionsContainer}>
                        {/*右 内容列表*/}
                        <View style={this.state.itemSelectIndex===0?styles.promotionsContainer0:(this.state.itemSelectIndex===1?styles.promotionsContainer1:styles.promotionsContainer2)}>
                            <ScrollView  alwaysBounceVertical={true} overScrollMode='always' bounces={true}>
                                {
                                    this.showContent()
                                }
                            </ScrollView>
                        </View>
                        {/*右标记已读未读*/}
                        <View style={styles.promotionsContainer3}>
                            {
                                this.showReadMark()
                            }
                        </View>
                    </View>
                </View>
                {/*loading*/}
                <LoadingView ref={(c) => this.loadingView = c} key={"loading"}/>
            </View>
        );
    }
}

const BORDER_WIDTH = 2;

const styles = StyleSheet.create({
    btnClick: {
        width: 41 * (235 / 82) * UIMacro.HEIGHT_PERCENT,
        height: 41 * UIMacro.HEIGHT_PERCENT,
        marginTop: 5 * UIMacro.HEIGHT_PERCENT,
        justifyContent: 'center',
        alignItems: 'center',
    },
    itemText: {
        color: '#fff',
        fontSize: 15,
        fontWeight: 'bold',
        margin:10* UIMacro.WIDTH_PERCENT,
    },
    modalLeftImage: {
        width: 135 * UIMacro.WIDTH_PERCENT,
        height: 303 * UIMacro.HEIGHT_PERCENT,
        marginLeft: -BORDER_WIDTH
    },
    noData: {
        justifyContent:'center',
        alignItems:'center',
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
    modalLeftView: {
    },
    modalRightView: {
        padding: 10*UIMacro.WIDTH_PERCENT,
        backgroundColor: 'rgba(0,0,0,0.2)',
        width: 330* UIMacro.WIDTH_PERCENT,
        height: 293 * UIMacro.HEIGHT_PERCENT,
        borderRadius: 5,
    },
    promotionsContainer: {
        height: 282*UIMacro.HEIGHT_PERCENT,
    },
    promotionsContainer1: {
        height: (282)*UIMacro.HEIGHT_PERCENT,
    },
    promotionsContainer0: {
        height: (282)*UIMacro.HEIGHT_PERCENT,
    },
    promotionsContainer2: {
        height: (282-43)*UIMacro.HEIGHT_PERCENT,
    },
    promotionsContainer3: {
        height: 43*UIMacro.HEIGHT_PERCENT,
    },
    modalMiddleView: {
        flexDirection: 'row',
    },
    messageList: {
        width:332*UIMacro.WIDTH_PERCENT,
        height:72*UIMacro.HEIGHT_PERCENT,
        backgroundColor: 'rgba(0,0,0,.2)',
        marginBottom: 5*UIMacro.HEIGHT_PERCENT,
        borderRadius: 3*UIMacro.HEIGHT_PERCENT,
    },
    //已读样式
    messageListUnread: {
        width:332*UIMacro.WIDTH_PERCENT,
        height:72*UIMacro.HEIGHT_PERCENT,
        backgroundColor: SkinsColor.bgTextViewStyle_bg,
        marginBottom: 5*UIMacro.HEIGHT_PERCENT,
        borderRadius: 3*UIMacro.HEIGHT_PERCENT,
    },
    messageListTouchable: {
        justifyContent:'space-between',
    },
    emailToDo: {
        width:322*UIMacro.WIDTH_PERCENT,
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
    },
    emailMark: {
        width:33*(161/66)*UIMacro.HEIGHT_PERCENT,
        height:33*UIMacro.HEIGHT_PERCENT,
        marginTop: 9*UIMacro.HEIGHT_PERCENT,
        margin:5*UIMacro.HEIGHT_PERCENT,
        justifyContent:'center',
    },
    ToDoBtn: {
        textAlign: 'center',
        color:'#fff',
        fontWeight: 'bold',
        fontSize:15,
    },
    listItem: {
        color: SkinsColor.listItem,
        fontSize: 12,
        height:29*UIMacro.HEIGHT_PERCENT,
        marginLeft: 12*UIMacro.WIDTH_PERCENT,
        paddingRight:50*UIMacro.WIDTH_PERCENT,
        marginTop: 13*UIMacro.HEIGHT_PERCENT,
    },
    itemDate: {
        textAlign:'right',
        color: SkinsColor.itemDate,
        fontSize: 12,
        marginRight:32*UIMacro.WIDTH_PERCENT,
    },
    messageCheckBox: {
        position:'absolute',
        right: 30*UIMacro.WIDTH_PERCENT,
        top:6,
    },
    newMessageMark: {
        position:'absolute',
        width:27**UIMacro.HEIGHT_PERCENT,
        height:24.5*UIMacro.HEIGHT_PERCENT,
    },
    redMark: {
        position:'absolute',
        right:0,
        top:0,
    },
    redMarkNum: {
        position:'absolute',
        justifyContent:'center',
        alignItems:'center',
        width:16,
        height:16,
    },
    redMarkNumText: {
        fontSize:8,
        color:'#fff',
    },
});