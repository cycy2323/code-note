/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 *
 *
 *
 * 此页面主要是QQ,微信，京东，百度支付共同的页面
 */

import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    ImageBackground,
    ScrollView,
    Clipboard,
    CameraRoll,
    Platform,
    PermissionsAndroid
} from 'react-native';
import UIMacro from "../../core/UIMacro";
import RechargeDetailHeadView from './RechargeDetailHeadView'
import GBServiceParam from "../../core/GBServiceParam";
import Toast from '../../common/ToastView' ;
import RNFS from 'react-native-fs'; //文件处理
import RechargePreferentialView from './RechargePreferentialView'
import RechargeSuccessPopView from './RechargeSuccessPopView'
import GBNetWorkService from "../../core/GBNetWorkService";
import FastImage from 'react-native-fast-image'
import ImageUrlManager from '../../core/ImageUrlManager'
import SkinsColor from "../../core/SkinsColor";
import TouchableBounce from "../../common/TouchableBounce";


type Props = {};
export default class RechargeDetailOneCodePayView extends Component<Props> {
    constructor(pros){
        super(pros);
        this.state={
            feePopViewShow:false,
            successPopViewShow:false,
        }
    }

    componentDidMount(){
        Platform.OS === 'android' && this.requestReadPermission();
    }

    render(){
        let {payWayDetailData}=this.props;
        let imageUrl=payWayDetailData.imgUrl.replace("null","2x")
        return (
            <View style={styles.container}>
                <View style={{width:'100%',height:'100%'}}>
                    <ScrollView>
                        <RechargeDetailHeadView/>
                        <Text style={{marginLeft:6,marginTop: 12.5,color:'white',fontSize:11}} key={"chooseMoneyTitle"}>账户信息</Text>
                        <View style={{marginTop:8,marginLeft:10,height:20,flexDirection: 'row',alignItems: 'center'}}>
                            <FastImage style={{width:18,height:18}} source={{uri:ImageUrlManager.dealURI(imageUrl),headers: {Host: GBServiceParam.currentHost},
                                priority: FastImage.priority.normal,}}/>
                            <Text style={{marginLeft:3,color:'white',fontSize:12}}>{payWayDetailData.aliasName+"  "+payWayDetailData.customBankName}</Text>
                        </View>
                        {this._infoView()}
                        {this._qrCodeView()}
                        <View style={{justifyContent:'center',alignItems:'center'}}>
                            <TouchableBounce onPress={()=>{this._submitBtnClick()}}>
                                <FastImage source={(require("../../static/images/2.1.0/btn_menu.webp"))} style={styles.submitBtnStyle} >
                                    <Text style={{fontSize:18,color:'white'}}>提交</Text>
                                </FastImage>
                            </TouchableBounce>
                        </View>
                        <View style={styles.messageViewStyle}>
                            <View style={styles.lineStyle}>
                            </View>
                            <Text  style={styles.messageTextStyle} numberOfLines={0}>{"温馨提示：\n• 五码合一，使用网银，支付宝，微信，QQ钱包，京东钱包均可扫描二维码进行转账存款。" +
                            "\n• 支付成功后，请等待几秒钟，提示「支付成功」按确认键后再关闭支付窗口。" +
                            "\n• 如出现充值失败或充值后未到账等情况，请联系在线客服获取帮助。"}</Text>
                        </View>
                    </ScrollView>
                    <Toast
                        ref="toast"
                        style={{backgroundColor: 'white',marginTop:0.6*UIMacro.SCREEN_HEIGHT,marginLeft:-50*UIMacro.WIDTH_PERCENT}}
                        fadeInDuration={300}
                        fadeOutDuration={300}
                        opacity={1}
                        textStyle={{color: 'black'}}
                    />
                    {this._showFeeView()}
                    <RechargeSuccessPopView
                        setModalVisible={this._setSuccessViewModalVisible}
                        modalVisible={this.state.successPopViewShow}
                    />
                </View>
            </View>
        );
    }
    _infoView=()=>{
        let {payWayDetailData}=this.props;
        let array=[]
        let title=["账号:"+payWayDetailData.account,"姓名:"+payWayDetailData.fullName]
        let title1=[payWayDetailData.account,payWayDetailData.fullName]
        for (let i = 0; i < title.length; i++) {
            array.push(<View style={styles.infoSubViewStyle} key={i}>
                <Text style={{color:SkinsColor.IDText,fontSize:12}}>{title[i]}</Text>
                <TouchableBounce onPress={()=>{this._copyBtnClick(title1[i])}}>
                    <FastImage style={styles.copyBtnStyle} source={require("../../static/images/2.1.0/btn_blue_small.webp")}>
                        <Text style={{color:'white',fontSize:11}}>复制</Text>
                    </FastImage>
                </TouchableBounce>

            </View>)
        }
        return <View style={styles.infoViewStyle}>
            {array}
        </View>
    }
    _qrCodeView=()=>{
        let {payWayDetailData}=this.props;
        if (payWayDetailData.qrCodeUrl&&payWayDetailData.qrCodeUrl.length>0){
            return <View style={styles.qrCodeViewStyle}>
                <FastImage source={{uri:ImageUrlManager.dealURI(payWayDetailData.qrCodeUrl),headers: {Host: GBServiceParam.currentHost},
                    priority: FastImage.priority.normal,}} style={{width:85,height:85,marginRight:5}}/>
                <View style={{flexDirection:'column',justifyContent:'center',alignItems:'center'}}>
                    <TouchableBounce onPress={()=>{this._saveToPhone()}}>
                        <FastImage source={require('../../static/images/2.1.0/btn_purple.webp')} style={styles.saveBtnStyle}>
                            <FastImage source={require('../../static/images/2.1.0/icon_phone.webp')} style={{width:25/1.5*UIMacro.WIDTH_PERCENT,
                                height:40/1.5*UIMacro.WIDTH_PERCENT}}/>
                            <Text style={{fontSize:12,color:'white'}}>保存到手机</Text>

                        </FastImage>
                    </TouchableBounce>
                </View>
            </View>
        } else
        {
            return <View/>
        }

    }

    _copyBtnClick=(str)=>{
        this.refs.toast.show("复制成功")
        Clipboard.setString(str)
    }

    async requestReadPermission() {
        try {
            //返回string类型
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                {
                    //第一次请求拒绝后提示用户你为什么要这个权限
                    'title': '我要读写权限',
                    'message': '没权限我不能工作，同意就好了'
                }
            )
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                return true;
            } else {
                return false;
            }
        } catch (err) {
            return false;
        }
    }

    _saveToPhone=()=>{
        let th = this ;
        let {payWayDetailData}=this.props;
        if (!payWayDetailData.qrCodeUrl) return;
        let  urlStr = ImageUrlManager.dealURI(payWayDetailData.qrCodeUrl);
        return new Promise((resolve, reject) => {
            let timestamp = (new Date()).getTime();//获取当前时间戳
            let random = String(((Math.random() * 1000000) | 0))//六位随机数
            let dirs = Platform.OS === 'ios' ? RNFS.LibraryDirectoryPath : RNFS.ExternalDirectoryPath; //外部文件，共享目录的绝对路径（仅限android）
            const downloadDest = `${dirs}/${timestamp + random}.jpg`;
            const options = {
                fromUrl: urlStr,
                toFile: downloadDest,
                background: true,
                begin: (res) => {
                    // console.log('begin', res);
                    // console.log('contentLength:', res.contentLength / 1024 / 1024, 'M');
                },
            };
            try {
                const ret = RNFS.downloadFile(options);
                ret.promise.then(res => {
                    // console.log('success', res);
                    // console.log('file://' + downloadDest)
                    let promise = CameraRoll.saveToCameraRoll(downloadDest);
                    promise.then(function (result) {
                        th.refs.toast.show('保存成功');
                    }).catch(function (error) {
                        th.refs.toast.show('保存失败');
                    });
                    resolve(res);
                }).catch(err => {
                    reject(new Error(err))
                });
            } catch (e) {
                reject(new Error(e))
            }
        })
    }
    _submitBtnClick=()=>{
        this.setFeeModalVisible(true)
    }
    /*渲染显示手续费等视图*/
    _showFeeView=()=>{
        let viewArray=[];
        let {payWayDetailData,money}=this.props;
        if (this.state.feePopViewShow) {
            viewArray.push(<RechargePreferentialView
                money={money}
                payWay={payWayDetailData.depositWay}
                accountId={payWayDetailData.searchId}
                txid={""}
                key={"feeView"}
                preferentialSubmitBtnCllick={this._preferentialSubmitBtnCllick}
                setModalVisible={this.setFeeModalVisible}
                modalVisible={this.state.feePopViewShow}
            />)
        }
        return viewArray
    }

    /*改变手续费弹窗是否显示的BOOL值*/
    setFeeModalVisible = (visible) => {
        this.setState({feePopViewShow:visible});
    };
    _preferentialSubmitBtnCllick=(visible)=>{
        this.setState({
            feePopViewShow:visible,

        });
        let {payWayDetailData,money}=this.props;
        let paramDic={"result.rechargeAmount":money,"result.rechargeType":payWayDetailData.rechargeType,
            "account":payWayDetailData.searchId};
        GBNetWorkService.post("mobile-api/depositOrigin/electronicPay.html",paramDic,null,this._depositeSuccess,this._depositeFail)

    }
    _depositeSuccess=(json)=>{
        if (json.data===null){
            this.refs.toast.show(json.message)
        } else {
            this.setState({
                successPopViewShow:true,

            });
        }

    }
    _depositeFail=(json)=>{
        this.refs.toast.show("存款失败")
    }
    _setSuccessViewModalVisible = (visible) => {
        this.setState({successPopViewShow: visible});
    };


}
const styles = StyleSheet.create({
    container: {
        width: 335 * UIMacro.WIDTH_PERCENT,
        backgroundColor: SkinsColor.containerStyle_bg,
        marginRight: 6*UIMacro.WIDTH_PERCENT,
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
    },
    infoViewStyle:{
        flexDirection: 'column',
        backgroundColor:SkinsColor.infoSubViewStyle_bg,
        marginLeft:10,
        marginRight:10,
        marginTop:8,
        height:60,
        justifyContent:'center',
        borderRadius:5,
    },
    infoSubViewStyle:{
        flexDirection: 'row',
        alignItems:'center',
        backgroundColor:SkinsColor.infoSubViewStyle_bg,
        marginLeft:20,
        marginRight:23,
        marginTop:5,
        justifyContent:'space-between',
    },
    copyBtnStyle:{
        justifyContent:'center',
        alignItems:'center',
        width:50,
        height:20
    },
    qrCodeViewStyle:{
        flexDirection: 'row',
        backgroundColor:SkinsColor.infoSubViewStyle_bg,
        marginLeft:10,
        marginRight:10,
        height:110* UIMacro.WIDTH_PERCENT,
        justifyContent:'center',
        alignItems:'center',
        marginTop:5,
        borderRadius:5,
    },
    saveBtnStyle:{
        width:110*UIMacro.WIDTH_PERCENT,
        height:37*UIMacro.WIDTH_PERCENT,
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        marginTop:5,
    },
    inputViewStyle:{
        marginLeft:10,
        marginRight:10,
        marginTop:5,
        backgroundColor:SkinsColor.shadowColor,
        borderColor:'rgba(255,255,255,0.36)',
        borderWidth: 1,
        borderRadius:5,
        shadowColor: SkinsColor.shadowColor,
        shadowOffset: {h:3,w:3},
        height:30,
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
    },
    inputTextStyle:{
        marginRight:5,
        fontSize:12,
        color:'white',
        textAlign: 'right',
    },
    submitBtnStyle:{
        width:118* UIMacro.WIDTH_PERCENT,
        height:40* UIMacro.WIDTH_PERCENT,
        justifyContent:'center',
        alignItems:'center',
        marginTop:8,
    },
    messageViewStyle:{
        flexDirection:'column',
        marginTop:10,
        marginLeft:10,
        marginRight:10,
    },
    lineStyle:{
        height:0.5,
        marginLeft:10,
        marginRight:10,
        marginBottom:10,
        backgroundColor:SkinsColor.bgTextViewStyle_border
    },
    messageTextStyle:{
        fontSize:11,
        color:SkinsColor.IDText,
    }


});
