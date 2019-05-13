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
    Platform, CameraRoll,
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
import moment from 'moment';
import FastImage from 'react-native-fast-image'
import ImageUrlManager from '../../core/ImageUrlManager'
import SkinsColor from "../../core/SkinsColor";
import TouchableBounce from "../../common/TouchableBounce";


type Props = {};
export default class RechargeDetailBitCoinView extends Component<Props> {
    constructor(pros){
        super(pros);
        this.state={
            payWayDetailData:{},
            bitCoinAdress:"",
            TXID:"",
            nums:"",
            dealTime:"",
            feePopViewShow:false,
            successPopViewShow:false,
        }
    }

    componentDidMount(){
        //后台数据第一个数据是在线支付就会最先创建这个页面，payType从""变成online 会走componentWillReceiveProps方法，不是第一个的话会从QQ，或者微信支付，或者支付宝切换到这个页面，这个页面会被重新创建会走componentDidMount
        if (this.props.payType) {
            GBNetWorkService.post("mobile-api/depositOrigin/"+this.props.payType+".html",null,null,this._rechargeGetPayWaySuccess,this._rechargeGetPayWayFail)
        }
        Platform.OS === 'android' && this.requestReadPermission();
    }

    componentWillReceiveProps(nextProps){
        GBNetWorkService.post("mobile-api/depositOrigin/"+nextProps.payType+".html",null,null,this._rechargeGetPayWaySuccess,this._rechargeGetPayWayFail)
    }
    _rechargeGetPayWaySuccess=(json)=>{
        if (json.code === "0"){
            if (json.data.arrayList.length>0){
                this.setState({
                    payWayDetailData:json.data.arrayList[0],
                })
            }
        }
    }
    _rechargeGetPayWayFail=(json)=>{

    }

    render(){
        let url=Object.keys(this.state.payWayDetailData).length>0?this.state.payWayDetailData.imgUrl:"null";
        let aliasName=Object.keys(this.state.payWayDetailData).length>0?this.state.payWayDetailData.aliasName:"";
        let customBankName=Object.keys(this.state.payWayDetailData).length>0?this.state.payWayDetailData.customBankName:"";
        let imageUrl=url.replace("null","2x")
        return (
            <View style={styles.container}>
                <View style={{width:'100%',height:'100%'}}>
                    <ScrollView>
                        <RechargeDetailHeadView/>
                        <Text style={{marginLeft:6,marginTop: 12.5,color:'white',fontSize:11}} key={"chooseMoneyTitle"}>账户信息</Text>
                        <View style={{marginTop:8,marginLeft:10,height:20,flexDirection: 'row',alignItems: 'center'}}>
                            <FastImage style={{width:18,height:18}} source={{uri:ImageUrlManager.dealURI(imageUrl),headers: {Host: GBServiceParam.currentHost},
                                priority: FastImage.priority.normal}}/>
                            <Text style={{marginLeft:3,color:'white',fontSize:12}}>{aliasName+"  "+customBankName}</Text>
                        </View>
                        {this._infoView()}
                        {this._qrCodeView()}
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
                            <Text  style={styles.messageTextStyle} numberOfLines={0}>{"温馨提示：\n• 为了方便系统快速完成转账，请输入正确的txId、交易时间，以加快系统入款速度。" +
                            "\n• 建议您使用Internet Explorer 9以上、360浏览器、Firefox或Google Chrome等浏览器浏览。\n• 如出现充值失败或充值后未到账等情况，请联系在线客服获取帮助。"}</Text>
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
        let array=[]
        let account=Object.keys(this.state.payWayDetailData).length>0?this.state.payWayDetailData.account:"";
        let fullName=Object.keys(this.state.payWayDetailData).length>0?this.state.payWayDetailData.fullName:""
        let title=["账号:"+account,"姓名:"+fullName]
        let title1=[account,fullName]
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
        if (this.state.payWayDetailData.qrCodeUrl&&this.state.payWayDetailData.qrCodeUrl.length>0){
            let imageUrl=Object.keys(this.state.payWayDetailData).length>0?this.state.payWayDetailData.qrCodeUrl:"";
            return <View style={styles.qrCodeViewStyle}>
                <FastImage source={{uri:ImageUrlManager.dealURI(imageUrl),headers: {Host: GBServiceParam.currentHost},
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
        }else
        {
            return <View/>
        }


    }

    //失去焦点
    loadBlur=(input)=> {
        input.blur()
    }

    _inputView=()=>{
        let  array=[];
        array.push(<View style={styles.inputViewStyle} key={"bitcoinAdreess"}>
            <Text style={{fontSize:12,color:'white',marginLeft:5}}>您的比特币地址</Text>
            <TextInput
                placeholder={"请输入比特币地址"}
                placeholderTextColor={'rgb(170,170,170)'}
                style={styles.inputTextStyle}
                value={this.state.bitCoinAdress}
                onChangeText={this._changeAddress}
                ref={(c)=>this.bitCoinAdress=c}
                onEndEditing={()=>{this.loadBlur(this.bitCoinAdress)}}
            />
        </View>)
        array.push(<View style={styles.inputViewStyle} key={"TXID"}>
            <Text style={{fontSize:12,color:'white',marginLeft:5}}>TXID</Text>
            <TextInput
                placeholder={"请输入交易时产生的TXID"}
                placeholderTextColor={'rgb(170,170,170)'}
                style={styles.inputTextStyle}
                value={this.state.TXID}
                onChangeText={this._changeTXID}
                ref={(c)=>this.TXID=c}
                onEndEditing={()=>{this.loadBlur(this.TXID)}}
            />
        </View>)
        array.push(<View style={styles.inputViewStyle} key={"bitcoinNum"}>
            <Text style={{fontSize:12,color:'white',marginLeft:5}}>比特币数量</Text>
            <TextInput
                placeholder={"请输入比特币数量"}
                placeholderTextColor={'rgb(170,170,170)'}
                style={styles.inputTextStyle}
                value={this.state.nums}
                keyboardType={'number-pad'}
                onChangeText={this._changeNums}
                ref={(c)=>this.nums=c}
                onEndEditing={()=>{this.loadBlur(this.nums)}}
            />
        </View>)
        array.push(<View style={styles.inputViewStyle} key={"dealDate"}>
            <Text style={{fontSize:12,color:'white',marginLeft:5}}>交易时间</Text>
            <TextInput
                placeholder={"请输入交易时间"}
                placeholderTextColor={'rgb(170,170,170)'}
                style={styles.inputTextStyle}
                value={this.state.dealTime}
                onChangeText={this._changeDealDate}
                ref={(c)=>this.dealTime=c}
                onEndEditing={()=>{this.loadBlur(this.dealTime)}}
            />
        </View>)

        return array;
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
        let  urlStr =  ImageUrlManager.dealURI(this.state.payWayDetailData.qrCodeUrl);
        if (!this.state.payWayDetailData.qrCodeUrl) return;
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

                },
            };
            try {
                const ret = RNFS.downloadFile(options);
                ret.promise.then(res => {
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
        if (this.state.bitCoinAdress.length<26||this.state.bitCoinAdress.length>34){
            this.refs.toast.show("请输入26到34位比特币地址")

        } else if (this.state.TXID.length==0){
            this.refs.toast.show("请输入交易时产生的TXID")

        }else if (this.state.nums.length==0){
            this.refs.toast.show("请输入比特币数量")

        }else if (this.state.dealTime.length==0){
            this.refs.toast.show("请输入交易时间")

        }else if (moment(this.state.dealTime).format('YYYY-MM-DD HH:mm:ss')==="Invalid date"){
            this.refs.toast.show("请输入YYYY-MM-DD HH:mm:ss格式时间",2000)
        }
        else {
            this.setFeeModalVisible(true)
        }
    }
    _dealTimeString=(str)=>{
        //判断字符串是否符合时间
    }
    _changeAddress=(str)=>{
        this.setState({
            bitCoinAdress:str,
        })

    }
    _changeTXID=(str)=>{
        this.setState({
            TXID:str,
        })
    }
    _changeNums=(str)=>{
        this.setState({
            nums:str,
        })
    }
    _changeDealDate=(str)=>{
        this.setState({
            dealTime:str,
        })
    }
    /*渲染显示手续费等视图*/
    _showFeeView=()=>{
        let viewArray=[];
        if (this.state.feePopViewShow) {
            viewArray.push(<RechargePreferentialView
                money={this.state.nums}
                payWay={this.state.payWayDetailData.depositWay}
                accountId={this.state.payWayDetailData.searchId}
                txid={this.state.TXID}
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
        let paramDic={"result.rechargeType":this.state.payWayDetailData.rechargeType,
            "account":this.state.payWayDetailData.searchId,
            "result.returnTime":moment(this.state.dealTime).format('YYYY-MM-DD HH:mm:ss'),
            "result.payerBankcard":this.state.bitCoinAdress,
            "result.bitAmount":this.state.nums,
            "result.bankOrder":this.state.TXID};
        GBNetWorkService.post("mobile-api/depositOrigin/bitcoinPay.html",paramDic,null,this._depositeSuccess,this._depositeFail)

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
        color:'white',
        textAlign: 'right',
        fontSize:12,
        padding:0,
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
        marginRight:10,
        marginLeft:10,
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
