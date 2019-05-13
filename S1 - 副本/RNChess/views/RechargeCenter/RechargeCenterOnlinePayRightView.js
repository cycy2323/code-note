/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
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
    Linking
} from 'react-native';
import UIMacro from "../../core/UIMacro";
import RechargeDetailHeadView from './RechargeDetailHeadView'
import GBNetWorkService from "../../core/GBNetWorkService";
import RechargePreferentialView from './RechargePreferentialView'
import RechargeSuccessPopView from './RechargeSuccessPopView'
import ModalDropdown from 'react-native-modal-dropdown'
import Toast from '../../common/ToastView' ;
import SkinsColor from "../../core/SkinsColor";
import TouchableBounce from "../../common/TouchableBounce";
import FastImage from 'react-native-fast-image'


type Props = {};
export default class RechargeCenterOnlinePayRightView extends Component<Props> {
    constructor(pros) {
        super(pros);
        this.state = {
            inputString: "",
            payWayData: {},
            bankName: "请选择银行",
            payTypeSelectedIndex: 0,
            feePopViewShow:false,
            successPopViewShow:false,
        }
    }

    componentDidMount() {
        //后台数据第一个数据是在线支付就会最先创建这个页面，payType从""变成online 会走componentWillReceiveProps方法，不是第一个的话会从QQ，或者微信支付，或者支付宝切换到这个页面，这个页面会被重新创建会走componentDidMount
        if (this.props.payType) {
            GBNetWorkService.post("mobile-api/depositOrigin/" + this.props.payType + ".html", null, null, this._rechargeGetOnlineSuccess, this._rechargeGetOnlineFail)
        }

    }

    componentWillReceiveProps(nextProps) {
        GBNetWorkService.post("mobile-api/depositOrigin/" + this.props.payType + ".html", null, null, this._rechargeGetOnlineSuccess, this._rechargeGetOnlineFail)
    }

    _rechargeGetOnlineSuccess = (json) => {
        if (json.code === "0") {
            this.setState({
                payWayData: json.data,
            })

        }
    }
    _rechargeGetOnlineFail = (json) => {

    }

    render() {
        return (
            <View style={styles.container}>
                <View style={{width:'100%',height:'100%'}}>
                    <ScrollView>
                        <RechargeDetailHeadView/>
                        <Text style={{marginLeft: 6, marginTop: 12.5, color: 'white', fontSize: 11}}
                              key={"chooseMoneyTitle"}>存款金额</Text>
                        <View style={styles.moneyViewStyle}>{this._moneyView()}</View>
                        {this._inputView()}
                        {this._chooseBankView()}
                        <View style={{justifyContent: 'center', alignItems: 'center'}}>
                            <TouchableBounce onPress={() => {
                                this._submitBtnClick()
                            }}>
                                <FastImage source={(require("../../static/images/2.1.0/btn_menu.webp"))}
                                                 style={styles.submitBtnStyle}>
                                    <Text style={{fontSize: 18, color: 'white'}}>提交</Text>
                                </FastImage>
                            </TouchableBounce>
                        </View>
                        <View style={styles.messageViewStyle}>
                            <View style={styles.lineStyle}>
                            </View>
                            <Text style={styles.messageTextStyle}
                                  numberOfLines={0}>{"温馨提示：\n• 如果有任何疑问，请联系在线客服获取帮助。"}
                            </Text>
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

    //选择金额视图
    _moneyView = () => {
        let array = [];
        if (Object.keys(this.state.payWayData).length > 0) {
            let moneyArray = Array.from(this.state.payWayData.quickMoneys);
            for (let i = 0; i < moneyArray.length; i++) {
                array.push(<TouchableBounce onPress={() => {
                    this._moneyBtnClick(moneyArray[i])
                }} key={i}>
                    <FastImage source={require("../../static/images/2.1.0/btn_blue_short.webp")} style={{
                        width: 40 * UIMacro.WIDTH_PERCENT,
                        height: 30 * UIMacro.WIDTH_PERCENT,
                        marginLeft: 7,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <Text style={{fontSize: 11, color: 'white'}}>{moneyArray[i]}</Text>
                    </FastImage>
                </TouchableBounce>)
            }
        }
        return array;
    }

    //失去焦点
    loadBlur=(input)=> {
        input.blur()
    }

    //输入视图
    _inputView = () => {
        let placeHolderStr = "请输入金额"
        if (Object.keys(this.state.payWayData).length > 0) {
            let array = Array.from(this.state.payWayData.arrayList);
            let payWatData = array[this.state.payTypeSelectedIndex];
            placeHolderStr = payWatData.singleDepositMin ? payWatData.singleDepositMin + "~" + payWatData.singleDepositMax : "请输入金额";
        }
        return <View style={{flexDirection: 'row', marginTop: 8}}>
            <TextInput
                ref={(textF) => {
                    this.textField = textF
                }}
                placeholder={placeHolderStr}
                placeholderTextColor={'rgb(170,170,170)'}
                keyboardType={'numeric'}
                defaultValue={this.state.inputString}
                onChangeText={(amount) => {
                    let newText = amount.replace(/[^\d]+/, '');
                    this.setState({inputString: newText})
                }}
                style={styles.inputViewStyle}
                onEndEditing={()=>{this.loadBlur(this.textField)}}
            />
            <TouchableBounce onPress={() => {
                this._inputCleanBtnClick()
            }}>
                <FastImage source={(require("../../static/images/2.1.0/btn_green2.webp"))} style={styles.cleanBtnStyle}>
                    <Text style={{fontSize: 12, color: 'white',fontWeight:'bold',}}>清除</Text>
                </FastImage>
            </TouchableBounce>
        </View>
    }
    //选择银行视图
    _chooseBankView = () => {
        let bankArray = []
        if (Object.keys(this.state.payWayData).length > 0) {
            let array = Array.from(this.state.payWayData.arrayList)
            for (let i = 0; i < array.length; i++) {
                bankArray.push(array[i].payName)
            }
        }

        return <View style={styles.chooseBankViewStyle}>
            <ModalDropdown
                           dropdownStyle={styles.dropdownStyle}
                           animated={true}
                           options={bankArray}
                           renderSeparator={this._separator}
                           onSelect={(index, value) => this._dropDownSelect(index, value)}
                           dropdownTextStyle={styles.dropdownTextStyle}
            >
                <View style={{ width: 315 * UIMacro.HEIGHT_PERCENT, flexDirection: 'row',justifyContent:'space-between'}}>
                    <Text style={{fontSize: 12, color: 'white', marginLeft: 5}}>{this.state.bankName}</Text>
                    <FastImage source={require("../../static/images/2.1.0/drop_down.webp")}
                           resizeMode='stretch'
                           style={{marginRight: 5 * UIMacro.HEIGHT_PERCENT,
                               width: 14 * UIMacro.HEIGHT_PERCENT,
                               height: 8 * UIMacro.HEIGHT_PERCENT,marginTop:5*UIMacro.HEIGHT_PERCENT}}/>
                </View>

            </ModalDropdown>
        </View>
    }
    _dropDownSelect = (index, value) => {
        this.setState({
            bankName: value,
            payTypeSelectedIndex: index,
        })
    }

    _moneyBtnClick = (i) => {
        this.setState(preState=>({
            inputString:(parseFloat(preState.inputString.length===0?"0":preState.inputString)+parseFloat(i)).toString()
        }))
    }
    _inputCleanBtnClick = () => {
        this.setState({
            inputString:""
        })

    }

    /*渲染显示手续费等视图*/
    _showFeeView=()=>{
        let viewArray=[]
        if (Object.keys(this.state.payWayData).length>0){
            let array=Array.from(this.state.payWayData.arrayList);
            let payWatDetailData=array[this.state.payTypeSelectedIndex];
            if (this.state.feePopViewShow) {
                viewArray.push(<RechargePreferentialView
                    money={this.state.inputString}
                    payWay={payWatDetailData.depositWay}
                    accountId={payWatDetailData.searchId}
                    txid={""}
                    key={"feeView"}
                    preferentialSubmitBtnCllick={this._preferentialSubmitBtnCllick}
                    setModalVisible={this.setFeeModalVisible}
                    modalVisible={this.state.feePopViewShow}
                />)
            }
        }
        return viewArray
    }

    /*改变手续费弹窗是否显示的BOOL值*/
    setFeeModalVisible = (visible) => {
        this.setState({feePopViewShow:visible});
    };
    _submitBtnClick = () => {
        let array=Array.from(this.state.payWayData.arrayList);
        let payWatDetailData=array[this.state.payTypeSelectedIndex];
        if (this.state.inputString.length === 0) {
            this.refs.toast.show('请输入金额')
        } else if(this.state.inputString.substr(0,1)==='0'||
            this.state.inputString.substr(this.state.inputString.length-1,1)==='.'){
            this.refs.toast.show('请输入正确的金额格式')
        }
        else if (parseFloat(this.state.inputString) < parseFloat(payWatDetailData.singleDepositMin) || parseFloat(this.state.inputString) > parseFloat(payWatDetailData.singleDepositMax)) {
            this.refs.toast.show('请输入' + payWatDetailData.singleDepositMin + "~" + payWatDetailData.singleDepositMax)
        } else if (this.state.bankName === '请选择银行') {
            this.refs.toast.show('请选择银行')
        } else {
            this.state.inputString =  this.state.inputString.substr(this.state.inputString.length-1,1)==='.'?
                this.state.inputString.substr(0,this.state.inputString.length-1):this.state.inputString;
            this.props.callBack("onlinePay")
            this.setFeeModalVisible(true)

        }
    }
    _preferentialSubmitBtnCllick=(visible)=>{
        this.setState({
            feePopViewShow:visible,

        });
        if (Object.keys(this.state.payWayData).length>0){
            let array=Array.from(this.state.payWayData.arrayList);
            let payWatDetailData=array[this.state.payTypeSelectedIndex];
            let paramDic={"result.rechargeAmount":this.state.inputString,"result.rechargeType":payWatDetailData.depositWay,"account":payWatDetailData.searchId};
            //这里的是扫码支付
            GBNetWorkService.post("mobile-api/depositOrigin/onlinePay.html",paramDic,null,this._depositeSuccess,this._depositeFail)
        }

    }
    _depositeSuccess=(json)=>{
        if (json.data===null){
            this.refs.toast.show(json.message)
        } else {
            this.setState({
                successPopViewShow:true,

            });
            //这里要用 json.data.payLink 跳转到浏览器
            Linking.openURL(json.data.payLink)
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
    moneyViewStyle:{
        flexDirection:'row',
        height:30*UIMacro.HEIGHT_PERCENT,
        marginTop:7,
    },
    inputViewStyle:{
        height:33*UIMacro.WIDTH_PERCENT,
        width:250*UIMacro.HEIGHT_PERCENT,
        backgroundColor:SkinsColor.shadowColor,
        marginLeft:7,
        borderColor:'rgba(255,255,255,0.36)',
        borderWidth: 1,
        borderRadius:5,
        shadowColor: SkinsColor.shadowColor,
        shadowOffset: {h:3,w:3},
        color:'white',
        fontSize:12,
        padding:0,
        paddingLeft: 10
    },
    cleanBtnStyle:{
        justifyContent:'center',
        alignItems:'center',
        width: 56.5 * UIMacro.WIDTH_PERCENT,
        height: 33.5 * UIMacro.HEIGHT_PERCENT,
        marginLeft:3,
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
    },
    chooseBankViewStyle:{
        height:33*UIMacro.HEIGHT_PERCENT,
        marginTop:5,
        marginLeft:7,
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
        width:315*UIMacro.WIDTH_PERCENT,
        height: 120*UIMacro.WIDTH_PERCENT,
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
