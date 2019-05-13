/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 *
 *
 *
 * 此页面是柜员机存款详情页
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
    Clipboard, Linking
} from 'react-native';
import UIMacro from "../../core/UIMacro";
import RechargeDetailHeadView from './RechargeDetailHeadView'
import GBServiceParam from "../../core/GBServiceParam";
import Toast from '../../common/ToastView' ;
import ModalDropdown from 'react-native-modal-dropdown'
import RechargePreferentialView from './RechargePreferentialView'
import RechargeSuccessPopView from './RechargeSuccessPopView'
import GBNetWorkService from "../../core/GBNetWorkService";
import FastImage from 'react-native-fast-image'
import ImageUrlManager from '../../core/ImageUrlManager'
import SkinsColor from "../../core/SkinsColor";
import TouchableBounce from "../../common/TouchableBounce";


type Props = {};
export default class RechargeDetailATMView extends Component<Props> {
    constructor(pros){
        super(pros);
        this.state={
            payTypeName:"请选择存款方式",
            payCode:"",
            personName:"",
            depositeAddress:"",
            feePopViewShow:false,
            successPopViewShow:false,
        }
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
                            <Text  style={styles.messageTextStyle} numberOfLines={0}>{"温馨提示\n• 先查看要入款的银行账号信息，然后通过网上银行或手机银行进行转账，" +
                            "转账成功后再如实提交转账信息，财务专员查收到信息后会及时添加您的款项。\n• 请尽可能选择同行办理转账，可快速到账。\n• 存款完成后，保留单据以利核对并确保您的权益。" +
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
        let {payWayDetailData,payWayAllData}=this.props;
        let array=[]
        let accountStr=payWayAllData.hide===false?"账号:"+payWayDetailData.account:"账号代码:"+payWayDetailData.code;
        let accountStr1=payWayAllData.hide===false?payWayDetailData.account:payWayDetailData.code;
        let title=[accountStr,"银行开户名:"+payWayDetailData.fullName,"开户行:"+payWayDetailData.openAcountName];
        let title1=[accountStr1,payWayDetailData.fullName,payWayDetailData.openAcountName]
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
    _inputView=()=>{
        let array=[]
        let {payWayAllData}=this.props;
        let accountArray=Array.from(payWayAllData.counterRechargeTypes);
        let titles=[];
        if (accountArray.length>0) {
            for (let i = 0; i < accountArray.length; i++) {
                titles.push(accountArray[i].name?accountArray[i].name:"")
            }
        }
        array.push(<View style={styles.choosePayTypeViewStyle} key={'text1'}>
            <Text style={{fontSize:12,color:'white',marginLeft:5}}>存款方式</Text>
                <ModalDropdown
                               dropdownStyle={styles.dropdownStyle}
                               animated={true}
                               options={titles}
                               renderSeparator={this._separator}
                               onSelect={(index, value) => this._dropDownSelect(index, value)}
                               dropdownTextStyle={styles.dropdownTextStyle}
                ><View style={{flexDirection:'row',justifyContent:'flex-end',alignItems:'center'}}>
                    <Text style={{fontSize:12,color:'rgb(170,170,170)',marginRight:10}}>{this.state.payTypeName}</Text>
                    <FastImage source={require("../../static/images/2.1.0/drop_down.webp")} style={{marginRight:10,width:16,height:9}}/>
                </View>

                </ModalDropdown>
        </View>)
        array.push(<View style={styles.inputViewStyle} key={'text2'}>
            <Text style={{fontSize:12,color:'white',marginLeft:5}}>存款人</Text>
            <TextInput
                placeholder={"转账账号对应的姓名"}
                placeholderTextColor={'rgb(170,170,170)'}
                style={styles.inputTextStyle}
                value={this.state.personName}
                onChangeText={this._onChangePersonName}
                ref={(c)=>this.personName=c}
                onEndEditing={()=>{this.loadBlur(this.personName)}}
            />
        </View>)
        array.push(<View style={styles.inputViewStyle} key={'text3'}>
            <Text style={{fontSize:12,color:'white',marginLeft:5}}>存款地点</Text>
            <TextInput
                placeholder={"请输入存款地点"}
                placeholderTextColor={'rgb(170,170,170)'}
                style={styles.inputTextStyle}
                value={this.state.depositeAddress}
                onChangeText={this._onChangeDepositeAddress}
                ref={(c)=>this.depositeAddress=c}
                onEndEditing={()=>{this.loadBlur(this.depositeAddress)}}
            />

        </View>)
        return array
    }

    //失去焦点
    loadBlur=(input)=> {
        input.blur()
    }

    _separator=()=>{
        return <Text style={{height: 0}}></Text>
    }

    _copyBtnClick=(str)=>{
        this.refs.toast.show("复制成功")
        Clipboard.setString(str)
    }
    _submitBtnClick=()=>{
        if (this.state.payCode.length===0){
            this.refs.toast.show("请选择存款方式")
        } else if (this.state.personName.length===0){
            this.refs.toast.show("请填写存款人姓名")
        }else if (this.state.depositeAddress.length===0){
            this.refs.toast.show("请填写存款地点")
        }else {
            this.setFeeModalVisible(true)
        }
    }

    _dropDownSelect = (index, value) => {
        let {payWayAllData}=this.props;
        let accountArray=Array.from(payWayAllData.counterRechargeTypes);
        this.setState({
            payCode: accountArray[index].code,
            payTypeName:value,
        })
    }
    _onChangePersonName=(inputString)=>{
        this.setState({
            personName:inputString,
        })
    }
    _onChangeDepositeAddress=(inputString)=>{
        this.setState({
            depositeAddress:inputString,
        })
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
        let paramDic={"result.rechargeAmount":money,"result.rechargeType":this.state.payCode,
            "account":payWayDetailData.searchId,"result.payerName":this.state.personName,"result.rechargeAddress":this.state.depositeAddress};
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
        height:85,
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
    },
    choosePayTypeViewStyle:{
        height:30,
        marginTop:5,
        marginLeft:10,
        marginRight:10,
        backgroundColor:SkinsColor.shadowColor,
        borderColor:'rgba(255,255,255,0.36)',
        borderWidth: 1,
        borderRadius:5,
        shadowColor: SkinsColor.shadowColor,
        shadowOffset: {h:3,w:3},
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between'
    },
    dropdownStyle:{
        flex:1,
        width:150*UIMacro.WIDTH_PERCENT,
        height: 80,
        borderWidth:1,
        borderColor:SkinsColor.bgTextViewStyle_border,
        marginTop:10,
        backgroundColor:SkinsColor.WelfareRecordDropDownNormalText,
    },
    dropdownTextStyle:{
        fontSize: 12,
        color: 'white',
        backgroundColor:SkinsColor.WelfareRecordDropDownNormalText,
        height:25,
        paddingTop: 0,
        paddingBottom: 0,
        lineHeight:25,
    },


});
