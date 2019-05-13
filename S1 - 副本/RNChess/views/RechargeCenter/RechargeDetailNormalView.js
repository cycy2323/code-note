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
    TextInput,
    Clipboard,
    Platform,
    CameraRoll,
    Linking,
    PermissionsAndroid
} from 'react-native';
import UIMacro from "../../core/UIMacro";
import RechargeDetailHeadView from './RechargeDetailHeadView'
import GBServiceParam from "../../core/GBServiceParam";
import Toast from '../../common/ToastView' ;
import RechargePreferentialView from './RechargePreferentialView'
import RechargeSuccessPopView from './RechargeSuccessPopView'
import RNFS from 'react-native-fs';
import GBNetWorkService from "../../core/GBNetWorkService";
import FastImage from 'react-native-fast-image'
import ImageUrlManager from '../../core/ImageUrlManager'
import SkinsColor from "../../core/SkinsColor";
import TouchableBounce from "../../common/TouchableBounce";


type Props = {};
export default class RechargeDetailNormalView extends Component<Props> {
    constructor(pros){
        super(pros);
        this.state={
            inputString1:"",
            inputString2:"",
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
                        {payWayDetailData.remark&&payWayDetailData.remark.length>0?
                            <Text style={{marginLeft:12,marginTop:5,color:'#fff',fontSize:10}}>{payWayDetailData.remark}</Text>:null}

                        {this._inputView()}
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
                            {this._contenMessage()}
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
        let title=["账号:"+payWayDetailData.account,"姓名:"+payWayDetailData.fullName];
        let title1 =[payWayDetailData.account,payWayDetailData.fullName];
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
        let title=""
        if (payWayDetailData.bankCode==='qqwallet') {
            title="启动QQ支付"
        }else if (payWayDetailData.bankCode==='bdwallet') {
            title="启动百度支付"
        }else if (payWayDetailData.bankCode==='alipay') {
            title="启动支付宝支付"
        }else if (payWayDetailData.bankCode==='wechatpay') {
            title="启动微信支付"
        }else if (payWayDetailData.bankCode==='jdwallet') {
            title="启动京东支付"
        }

        if (payWayDetailData.qrCodeUrl&&payWayDetailData.qrCodeUrl.length>0){
            return (<View style={styles.qrCodeViewStyle}>
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
                    {
                        title.length>0?<TouchableBounce onPress={()=>{this._callUpApp()}}>
                            <FastImage source={require('../../static/images/2.1.0/btn_green3_click.webp')} style={styles.saveBtnStyle}>
                                {this._imageType}
                                <Text style={{fontSize:12,color:'white'}}>{title}</Text>
                            </FastImage>
                        </TouchableBounce>:null
                    }
                </View>
            </View>)
        } else
        {
            return(<View></View>)
        }


    }
    _imageType=()=>{
        let {payWayDetailData}=this.props;
        if (payWayDetailData.bankCode==='qqwallet') {
            return  <FastImage source={require('../../static/images/2.1.0/qq1.webp')} style={{width:30,height:27}}/>
        }else if (payWayDetailData.bankCode==='bdwallet') {
            return  <FastImage source={require('../../static/images/2.1.0/icon_baifubao.webp')} style={{width:30,height:27}}/>
        }else if (payWayDetailData.bankCode==='alipay') {
            return  <FastImage source={require('../../static/images/2.1.0/alipay1.webp')} style={{width:30,height:27}}/>
        }else if (payWayDetailData.bankCode==='wechatpay') {
            return  <FastImage source={require('../../static/images/2.1.0/icon_weixin.webp')} style={{width:30,height:27}}/>
        }else if (payWayDetailData.bankCode==='jdwallet') {
            return  <FastImage source={require('../../static/images/2.1.0/jdpay1.webp')} style={{width:30,height:27}}/>
        }

    }

    //失去焦点
    loadBlur=(input)=> {
        input.blur()
    }

    _inputView=()=>{
        let {payWayDetailData}=this.props;
        let array=[]
        if (payWayDetailData.bankCode==='alipay') {
            array.push(<View style={styles.inputViewStyle} key={'alipayText'}>
                <Text style={{fontSize:12,color:'white',marginLeft:5}}>您的支付宝名</Text>
                <TextInput
                    placeholder={"请输入存款时的真实姓名"}
                    placeholderTextColor={'rgb(170,170,170)'}
                    style={styles.inputTextStyle}
                    value={this.state.inputString1}
                    onChangeText={this._onChangeString1}
                    ref={(c)=>this.inputString1=c}
                    onEndEditing={()=>{this.loadBlur(this.inputString1)}}
                />

            </View>)
            array.push(<View style={styles.inputViewStyle} key={'normalText'}>
                <Text style={{fontSize:12,color:'white',marginLeft:5}}>{this._dealTitle(payWayDetailData.accountInformation)}</Text>
                <TextInput
                    placeholder={this._dealPalceHolder(payWayDetailData.accountPrompt)}
                    placeholderTextColor={'rgb(170,170,170)'}
                    style={styles.inputTextStyle}
                    value={this.state.inputString2}
                    onChangeText={this._onChangeString2}
                    ref={(c)=>this.inputString2=c}
                    onEndEditing={()=>{this.loadBlur(this.inputString2)}}
                />
            </View>)
        }
       else if (payWayDetailData.bankCode==='qqwallet') {
            array.push(<View style={styles.inputViewStyle} key={'normalText'}>
                <Text style={{fontSize:12,color:'white',marginLeft:5}}>{this._dealTitle(payWayDetailData.accountInformation)}</Text>
                <TextInput
                    placeholder={this._dealPalceHolder(payWayDetailData.accountPrompt)}
                    placeholderTextColor={'rgb(170,170,170)'}
                    style={styles.inputTextStyle}
                    value={this.state.inputString2}
                    onChangeText={this._onChangeString2}
                    keyboardType={'number-pad'}
                    ref={(c)=>this.inputString3=c}
                    onEndEditing={()=>{this.loadBlur(this.inputString3)}}
                />
            </View>)
        }else if (payWayDetailData.bankCode==='bdwallet') {
            array.push(<View style={styles.inputViewStyle} key={'normalText'}>
                <Text style={{fontSize:12,color:'white',marginLeft:5}}>您的百度账号</Text>
                <TextInput
                    placeholder={'请填写百度账号'}
                    placeholderTextColor={'rgb(170,170,170)'}
                    style={styles.inputTextStyle}
                    value={this.state.inputString2}
                    onChangeText={this._onChangeString2}
                    ref={(c)=>this.inputString4=c}
                    onEndEditing={()=>{this.loadBlur(this.inputString4)}}
                />
            </View>)
        }
        else {
            array.push(<View style={styles.inputViewStyle} key={'normalText'}>
                <Text style={{fontSize:12,color:'white',marginLeft:5}}>{this._dealTitle(payWayDetailData.accountInformation)}</Text>
                <TextInput
                    placeholder={this._dealPalceHolder(payWayDetailData.accountPrompt)}
                    placeholderTextColor={'rgb(170,170,170)'}
                    style={styles.inputTextStyle}
                    value={this.state.inputString2}
                    onChangeText={this._onChangeString2}
                    ref={(c)=>this.inputString5=c}
                    onEndEditing={()=>{this.loadBlur(this.inputString5)}}
                />
            </View>)
        }

        return array;
    }

    _dealTitle=(title)=>{
        let {payWayDetailData}=this.props;
        let string=""
        if (title.length===0||title==null){
            if (payWayDetailData.bankCode==='wechatpay') {
                string="您的微信号"
            }else if (payWayDetailData.bankCode==='alipay') {
                string="您的支付宝账号"
            }else if (payWayDetailData.bankCode==='qqwallet') {
                string="您的QQ钱包账号"
            }else if (payWayDetailData.bankCode==='jdwallet') {
                string="您的京东账号"
            }
        } else {
            string=title;
        }
        return string;

    }
    _dealPalceHolder=(holder)=>{
        let {payWayDetailData}=this.props;
        let string=""
        if (holder.length===0||holder==null){
            if (payWayDetailData.bankCode==='wechatpay') {
                string="请输入您的微信号"
            }else if (payWayDetailData.bankCode==='alipay') {
                string="请输入您的支付宝账号"
            }else if (payWayDetailData.bankCode==='qqwallet') {
                string="请输入您的QQ钱包账号"
            }else if (payWayDetailData.bankCode==='jdwallet') {
                string="请输入您的京东账号"
            }
        } else {
            string=holder;
        }
        return string;
    }

    _contenMessage=()=>{
        let content="";
        let {payWayDetailData}=this.props;
            if (payWayDetailData.bankCode==='alipay'){
                    content = "温馨提示：\n• 请先查看入款账号信息或扫描二维码。\n• 支付成功后，请等待几秒钟，提示「支付成功」按确认键后再关闭支付窗口。\n• 如出现充值失败或充值后未到账等情况，请联系在线客服获取帮助。";

            }else {
                content = "温馨提示：\n• 请先查看入款账号信息或扫描二维码。\n• 支付成功后，请等待几秒钟，提示「支付成功」按确认键后再关闭支付窗口。\n• 如出现充值失败或充值后未到账等情况，请联系在线客服获取帮助。";
            }
        return <Text  style={styles.messageTextStyle} numberOfLines={0}>{content}</Text>
    }
    _onChangeString1=(inputString)=>{
        this.setState({
            inputString1:inputString
        })
    }
    _onChangeString2=(inputString)=>{
        this.setState({
            inputString2:inputString
        })
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
    _callUpApp=()=>{
        let {payWayDetailData}=this.props;
        let openUrl='';
        let tipStr="";
        if (payWayDetailData.bankCode==='qqwallet') {
           openUrl='mqq://';
           tipStr="QQ";
        }else if (payWayDetailData.bankCode==='bdwallet') {
            openUrl='baidu://'
            tipStr="百度钱包";
        }else if (payWayDetailData.bankCode==='alipay') {
            openUrl=Platform.OS==='ios'?'alipay://':'alipays://platformapi';
            tipStr="支付宝";
        }else if (payWayDetailData.bankCode==='wechatpay') {
            openUrl='weixin://'
            tipStr="微信";
        }else if (payWayDetailData.bankCode==='jdwallet') {
            openUrl='openapp.jdmoble://'
            tipStr="京东钱包";
        }
        // alert('1=='+payWayDetailData.bankCode+"2="+openUrl)
        Linking.canOpenURL(openUrl).then(supported => { // weixin://  alipay://
               if (supported) {
                     Linking.openURL(openUrl);
                   } else {
                   this.refs.toast.show(`请先安装`+tipStr);
                   }
             });
    }

    //提交
    _submitBtnClick=()=>{
        let {payWayDetailData}=this.props;
        if (payWayDetailData.bankCode==='alipay') {
            if (this.state.inputString1.length===0) {
                this.refs.toast.show("请填写支付宝用户名")
            }
            else if (this.state.inputString2.length===0){
                this.refs.toast.show(this._dealPalceHolder(payWayDetailData.accountPrompt))
            }else {
                this.setFeeModalVisible(true)
            }
        }
        else if (payWayDetailData.bankCode==='bdwallet') {
            if (this.state.inputString2.length===0) {
                this.refs.toast.show("请填写百度账号")
            }else {
                this.setFeeModalVisible(true)
            }
        }
        else {
             if (this.state.inputString2.length===0){
                this.refs.toast.show(this._dealPalceHolder(payWayDetailData.accountPrompt))
            }else {
                 this.setFeeModalVisible(true)
            }
        }
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
            let paramDic={"result.rechargeAmount":money,
                "result.rechargeType":payWayDetailData.depositWay,
                "account":payWayDetailData.searchId,
                "result.payerName":this.state.inputString1,
                "result.payerBankcard":this.state.inputString2};
            GBNetWorkService.post("mobile-api/depositOrigin/electronicPay.html",paramDic,null,
                this._depositeSuccess,this._depositeFail)

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
        marginTop:10,
        height:60,
        justifyContent:'center',
        borderRadius:5,
    },
    infoSubViewStyle:{
        flexDirection: 'row',
        alignItems:'center',
        backgroundColor:SkinsColor.infoSubViewStyle_bg,
        marginLeft:10,
        marginRight:10,
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
        color:'white',
        fontSize:12,
        padding:0,
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
        marginLeft:5,
    }


});
