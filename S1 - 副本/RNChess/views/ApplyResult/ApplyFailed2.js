/**
 * @lemon
 */
import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    ImageBackground,
    ScrollView, Linking
} from 'react-native';
import GBNetWorkService from "../../core/GBNetWorkService";
import UserInfo from "../../core/UserInfo";
import BigPopPage from "../../common/BigPopPage";
import UIMacro from "../../core/UIMacro";
import ApplyFailed from "./ApplyFailed";
import ApplySuccess from "./ApplySuccess";
import LoadingView from "../Loading/LoadingView";
import SkinsColor from "../../core/SkinsColor";
import TouchableBounce from "../../common/TouchableBounce";
import FastImage from 'react-native-fast-image'

export default class ApplyFailed2 extends BigPopPage {

    constructor(pros) {
        super(pros);
        this.state = {
            ...this.state,
            TwiceApplyRes:{},
        }
    }
    //标题
    titleImage = ()=> {
        if(this.props.applyRes.status===3){
            return require('../../static/images/2.1.0/title03.webp')
        }else{
            return require('../../static/images/2.1.0/title21.webp')
        }
    }
    renderResult = () =>{
            let {applyDetails}=this.props.applyRes;
            // console.log('列表',applyDetails)
            let arr = [];
            if(applyDetails){
                applyDetails.map((item, index) => {
                    if(item.satisfy){//满足条件，绿色
                        if(item.showSchedule){
                            // 有绿条
                            arr.push(<View key={index} style={{flexDirection:'row',alignItems: 'flex-end'}}>
                                    <View>
                                        <View style={styles.continue}>
                                            <View style={styles.continue1}>
                                                <FastImage source={require('../../static/images/2.1.0/success.webp')} style={styles.successImg}/>
                                                <Text style={styles.touzhu}>{item.condition}</Text>
                                            </View>

                                            {/*显示右边的百分比*/}
                                            {
                                                this.showPrecent(item)
                                            }
                                        </View>
                                        <ImageBackground style={styles.bar_empty}
                                                         imageStyle={{
                                                             backgroundColor:'#1E7571',marginLeft:20*UIMacro.WIDTH_PERCENT,
                                                             width: 249.5*UIMacro.WIDTH_PERCENT, height: 9*UIMacro.HEIGHT_PERCENT,
                                                             borderColor: "#42b6b0",
                                                             borderWidth: 2,
                                                             borderRadius: 5
                                                         }}>
                                            <ImageBackground style={{ marginTop:1 }}
                                                             imageStyle={{
                                                                 backgroundColor:'rgba(97, 208, 23, 1)',marginLeft:20*UIMacro.WIDTH_PERCENT,
                                                                 width: 249.5*UIMacro.WIDTH_PERCENT, height: 7*UIMacro.HEIGHT_PERCENT,
                                                                 borderRadius: 5
                                                             }}/>
                                        </ImageBackground>
                                    </View>
                                    {/*显示申请按钮*/}
                                    {
                                        this.showApplyBtn(item)
                                    }
                                </View>
                            )
                        }else{
                            arr.push( <View  key={index} style={{justifyContent:'space-between',flexDirection:'row'}}>
                                    <View style={styles.continueNoShowBar}>
                                        <FastImage source={require('../../static/images/2.1.0/success.webp')} style={styles.successImg}/>
                                        <Text style={styles.bindCard}>{item.condition}</Text>
                                    </View>
                                    {/*/!*显示申请按钮*!/*/}
                                    {/*{*/}
                                        {/*this.showApplyBtn(item)*/}
                                    {/*}*/}
                                </View>
                            )
                        }
                    }else{//不满足条件，红色
                        if(item.showSchedule){
                            // 红条
                            let RedValueWidth=(item.reached/item.standard)*249.5*UIMacro.WIDTH_PERCENT
                            arr.push(<View key={index} style={{flexDirection:'row',alignItems: 'flex-end'}}>
                                    <View>
                                        <View style={styles.continue}>
                                            <View style={styles.continue1}>
                                                <FastImage source={require('../../static/images/2.1.0/error.webp')} style={styles.successImg}/>
                                                <Text style={styles.touzhu}>{item.condition}</Text>
                                            </View>
                                            {/*显示右边的百分比*/}
                                            {
                                                this.showPrecent(item)
                                            }
                                        </View>
                                        <ImageBackground style={styles.bar_empty}
                                                         imageStyle={{
                                                             backgroundColor:'#E7356C',
                                                             marginLeft:20*UIMacro.WIDTH_PERCENT,
                                                             width: 249.5*UIMacro.WIDTH_PERCENT, height: 9*UIMacro.HEIGHT_PERCENT,
                                                             borderColor: "#FF6191",
                                                             borderWidth: 2,
                                                             borderRadius: 5
                                                         }}>
                                            <ImageBackground style={{ marginTop:1 }}
                                                             imageStyle={{
                                                                 backgroundColor:'#C60B0B',marginLeft:20*UIMacro.WIDTH_PERCENT,
                                                                 width: RedValueWidth, height: 7*UIMacro.HEIGHT_PERCENT,
                                                                 borderRadius: 5
                                                             }}/>
                                        </ImageBackground>
                                    </View>
                                    {/*显示申请按钮*/}
                                    {
                                        this.showApplyBtn(item)
                                    }
                                </View>
                            )
                        }else{
                            arr.push( <View  key={index} style={{justifyContent:'space-between',flexDirection:'row'}}>
                                    <View style={styles.continueNoShowBar}>
                                        <FastImage source={require('../../static/images/2.1.0/error.webp')} style={styles.successImg}/>
                                        <Text style={styles.ipAdd}>{item.condition}</Text>
                                    </View>
                                    {/*显示申请按钮*/}
                                    {/*{*/}
                                        {/*this.showApplyBtn(item)*/}
                                    {/*}*/}
                                </View>

                            )
                        }
                    }
                });
            }
            return arr
    };
    //显示进度百分比
    showPrecent = (item) =>{
        if(item.showSchedule){
            return <View style={styles.nums}>
                <Text style={item.satisfy?styles.num:styles.numRed}>{item.reached}</Text>
                <Text style={styles.touzhu}>/{item.standard}</Text>
            </View>
        }
    };
    /*跳转到外部浏览器*/
    customerService = () => {
        if (UserInfo.customerUrl&&UserInfo.customerUrl.length>0){
            Linking.openURL(UserInfo.customerUrl)
        } else
        {
            GBNetWorkService.get("mobile-api/origin/getCustomerService.html", null, null, this._customerServiceSuccessBack, this._customerServiceFailBack)

        }
    };
    _customerServiceSuccessBack = (json) => {
        console.log("成功:" + JSON.stringify(json));
        if(json.data && json.data.customerUrl){
            Linking.openURL(json.data.customerUrl)
        }
    };
    _customerServiceFailBack = (json) => {
        console.log("失败:" + JSON.stringify(json))
    };
    // 显示申请按钮
    showApplyBtn = (item) => {
        if(item.mayApply){
            return <View style={styles.applyBgContain}>
                    <TouchableBounce onPress={()=>this.applyFor(item)}>
                        <FastImage resizeMode='contain' style={styles.applyBg}
                                         source={require('../../static/images/2.1.0/btn_blue2.webp')}>
                            <Text style={styles.btnText}>立即申请</Text>
                        </FastImage>
                    </TouchableBounce>
                </View>
        }
    };
    // 二次申请返回数据
    applyFor = (item) => {
        this.loadingView.showAnimation();
        // 返回申请结果---再回调弹出框
        let searchId = this.props.searchId;
        let params = {'searchId': searchId,'search.code':item.transactionNo};
        GBNetWorkService.post("mobile-api/chessActivity/toApplyActivity.html", params, null, this._ApplySucessBack, this._ApplyFailBack)
    };
    _ApplySucessBack = (json) => {
        this.loadingView.dismissAnimation();
        console.log("二次申请结果", json)
        this.setState({
            TwiceApplyRes: json.data,
        }, this.applyForRes)
    };
    _ApplyFailBack = (json) => {
        console.log('申请请求失败！')
        this.loadingView.dismissAnimation();
    };
    // 根据活动二次申请结果——>分情况弹出申请结果
    applyForRes = () => {
        let res = this.state.TwiceApplyRes.status;
        if (res === 1) {
            this.ApplySuccess.showPopView()
        } else if (res === 2 ) {
            this.ApplyFailed.showPopView()
        }
    };
    // 分情况渲染二次申请结果
    renderPage = ()=>{
        let result=<View key='1'></View>;
        let res = this.state.TwiceApplyRes.status;
        if (res === 1) {
            result= <ApplySuccess
                applyRes={this.state.TwiceApplyRes}
                ref={(c)=>this.ApplySuccess = c}
                key='2'
            />
        } else if (res === 2 ) {
            result= <ApplyFailed
                applyRes={this.state.TwiceApplyRes}
                ref={(c)=>this.ApplyFailed = c}
                key='3'
            />
        }
        return [<LoadingView ref={(c) => this.loadingView = c} key={"loading"}/>, result]
    }
    //重写弹窗内容
    contentView = () => {
        if(this.props.applyRes && !(JSON.stringify(this.state.content) == "{}")){
            return (
                <View style={styles.container}>
                    <View style={styles.content}>
                        <FastImage source={this.props.applyRes.status===3?require('../../static/images/2.1.0/warn.webp'):require('../../static/images/2.1.0/error.webp')} style={styles.success}/>
                        <View style={styles.successText}>
                            <ScrollView showsVerticalScrollIndicator={false} >
                                <Text style={styles.text1}>《{this.props.applyRes.actibityTitle}》 </Text>
                                <Text style={styles.text2}>{this.props.applyRes.applyResult}</Text>
                                {/*遍历数据*/}
                                {
                                    this.renderResult()
                                }
                            </ScrollView>
                        </View>

                    </View>
                    <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                        <TouchableBounce onPress={this.customerService} style={styles.kefu}>
                            <Text style={styles.text4}>联系客服</Text>
                        </TouchableBounce>
                        {/*<Text style={{color:'#fff'}}>{this.props.applyRes.tips}</Text>*/}
                        <View style={styles.kefu1}>
                        </View>
                    </View>

                </View>
            );
        }
    }
}

const styles = StyleSheet.create({
    container: {
        marginTop:8*UIMacro.WIDTH_PERCENT,
        borderRadius: 5,
        height: 293 * UIMacro.HEIGHT_PERCENT,
        backgroundColor: 'rgba(0,0,0,0.2)',
        width: 450 * UIMacro.WIDTH_PERCENT,
    },
    content:{
        height:245*UIMacro.HEIGHT_PERCENT,
        marginLeft:6* UIMacro.HEIGHT_PERCENT,
        flexDirection:'row',
        width: (485-16)* UIMacro.HEIGHT_PERCENT,
    },
    success:{
        width:50*UIMacro.HEIGHT_PERCENT,
        height:50*UIMacro.HEIGHT_PERCENT,
        marginTop: 24*UIMacro.HEIGHT_PERCENT,
        marginLeft: 24*UIMacro.HEIGHT_PERCENT,
        opacity: 1
    },
    successText:{
        width:355*UIMacro.HEIGHT_PERCENT,
        marginTop: 20*UIMacro.HEIGHT_PERCENT,
        marginLeft: 16*UIMacro.HEIGHT_PERCENT,
        textAlign: 'center',
    },
    text1:{
        color:'#fff',
        fontSize:16,
        marginLeft:-4*UIMacro.HEIGHT_PERCENT,
    },
    text2:{
        color:'#fff',
        fontSize:13,
        marginTop:5*UIMacro.HEIGHT_PERCENT,
    },
    text3:{
        color:'#2DE614',
        fontSize: 16,
        marginTop:18*UIMacro.HEIGHT_PERCENT,
    },
    continue:{
        width:269.5*UIMacro.HEIGHT_PERCENT,
        flexDirection: 'row',
        justifyContent:'space-between',
        marginTop:20*UIMacro.HEIGHT_PERCENT,
    },
    continueNoShowBar:{
        width:200.5*UIMacro.WIDTH_PERCENT,
        flexDirection: 'row',
        marginTop:20*UIMacro.HEIGHT_PERCENT,
    },
    continue1:{
        flexDirection: 'row',
    },
    successImg:{
        width:17*UIMacro.HEIGHT_PERCENT,
        height:17*UIMacro.HEIGHT_PERCENT,
        marginRight:8*UIMacro.WIDTH_PERCENT,
    },
    touzhu:{
        height:16*UIMacro.HEIGHT_PERCENT,
        color:'#fff',
        fontSize:13,
    },
    nums:{
        width:70*UIMacro.WIDTH_PERCENT,
        height:16*UIMacro.HEIGHT_PERCENT,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginRight: 10,
    },
    num:{
        color:'#2DE614',
        fontSize:13,
    },
    numRed:{
        color:'red',
        fontSize:13,
    },
    num1:{
        color:'#CE0101',
        fontSize:13,
    },
    bar_empty:{
        width:269.5*UIMacro.WIDTH_PERCENT,
        height:10*UIMacro.HEIGHT_PERCENT,
        marginTop:10*UIMacro.HEIGHT_PERCENT,
    },
    bindCard:{
        color:'#2DE614',
        fontSize:14,
    },
    ipAdd:{
        color:'#CE0101',
        fontSize:14,
    },
    kefu:{
        width:93*UIMacro.WIDTH_PERCENT,
        height:30*UIMacro.HEIGHT_PERCENT,
        backgroundColor: SkinsColor.shadowColor,
        borderWidth:0.4,borderColor: SkinsColor.bgTextViewStyle_border,
        marginTop:5*UIMacro.HEIGHT_PERCENT,
        borderRadius:15,
        marginLeft:10*UIMacro.WIDTH_PERCENT,
        marginRight:10*UIMacro.WIDTH_PERCENT,
        color:'#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    kefu1:{
        width:93*UIMacro.WIDTH_PERCENT,
    },
    text4:{
        color:'#fff',
        textAlign: 'center',
        fontWeight:'bold',
        fontSize:15,
    },
    applyBgContain:{
        marginLeft:5*UIMacro.HEIGHT_PERCENT,
    },
    applyBg: {
        width: 28 * (161 / 66) * UIMacro.HEIGHT_PERCENT,
        height: 28 * UIMacro.HEIGHT_PERCENT,
        marginTop: 15 * UIMacro.HEIGHT_PERCENT,
        marginRight: 15 * UIMacro.HEIGHT_PERCENT,
        justifyContent: 'center',
    },
    btnText: {
        textAlign: 'center',
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 15,
    },
});