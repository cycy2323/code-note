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
import UIMacro from "../../core/UIMacro"
import RechargeDetailHeadView from './RechargeDetailHeadView'
import RechargePreferentialView from './RechargePreferentialView'
import RechargeSuccessPopView from './RechargeSuccessPopView'
import GBServiceParam from "../../core/GBServiceParam";
import GBNetWorkService from "../../core/GBNetWorkService";
import Toast from '../../common/ToastView' ;
import FastImage from 'react-native-fast-image'
import SkinsColor from "../../core/SkinsColor";
import TouchableBounce from "../../common/TouchableBounce";


type Props = {};
export default class RechargeCenterNormalRightView extends Component<Props> {
    constructor(pros) {
        super(pros);
        this.state = {
            payTypeSelectedIndex: 0,//标记选中哪一个支付方式
            inputString: "",
            payWayData: {},
            feePopViewShow: false,
            successPopViewShow: false,

        }
    }


    componentDidMount() {
        this._isMounted = true;
        //后台数据第一个数据是QQ，微信，支付宝就会最先创建这个页面，payType从""变成online 会走componentWillReceiveProps方法，不是第一个的话会从在线支付切换到这个页面，这个页面会被重新创建会走componentDidMount
        if (this.props.payType) {
            GBNetWorkService.post("mobile-api/depositOrigin/" + this.props.payType + ".html", null, null, this._rechargeGetPayWaySuccess, this._rechargeGetPayWayFail)
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            //切换平台的时候要重置支付方式的index
            payTypeSelectedIndex:0,
        })
        GBNetWorkService.post("mobile-api/depositOrigin/" + nextProps.payType + ".html", null, null, this._rechargeGetPayWaySuccess, this._rechargeGetPayWayFail)
    }

    componentWillUnmount() {
        this._isMounted = false;

    }

    _rechargeGetPayWaySuccess = (json) => {
        if (json.code === "0") {
                this._isMounted&&this.setState({
                    payWayData: json.data,
                })

        }
    }
    _rechargeGetPayWayFail = (json) => {

    }

    render() {
        return (
            <View style={styles.containerStyle}>
                <View style={{width:'100%',height:'100%'}}>
                    <ScrollView>
                        <RechargeDetailHeadView/>
                        <Text style={{marginLeft: 6, marginTop: 12.5, color: 'white', fontSize: 11}}
                              key={"payTypeTitle"}>存款方式</Text>
                        <View style={{flexDirection: 'row', flexWrap: 'wrap', marginTop: 4, marginLeft: 7}}
                              key={"payTypeView"}>{this._payTypeView()}</View>
                        <Text style={{marginLeft: 6, marginTop: 12.5, color: 'white', fontSize: 11}}
                              key={"chooseMoneyTitle"}>存款金额</Text>
                        <View style={styles.moneyViewStyle}>{this._moneyView()}</View>
                        {this._inputView()}
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
                            {this._contenMessageView()}
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

    //存款方式视图
    _payTypeView = () => {
        let array = [];
        if (Object.keys(this.state.payWayData).length > 0) {
            let payWayArray = Array.from(this.state.payWayData.arrayList);
            for (let i = 0; i < payWayArray.length; i++) {
                let item = payWayArray[i];
                if (i === this.state.payTypeSelectedIndex) {
                    array.push(<TouchableBounce onPress={() => {
                        this._payTypeBtnClick(i)
                    }} key={i}>
                        <FastImage resizeMode='stretch'
                                         style={styles.payTypeItemViewStyle}
                                         source={require("../../static/images/2.1.0/bg_deposited.webp")}>
                            <FastImage source={{
                                uri: "http://" + GBServiceParam.currentIP + item.imgUrl,
                                headers: {Host: GBServiceParam.currentHost},
                                priority: FastImage.priority.normal,
                            }} style={{width: 18, height: 18, marginLeft: 10, marginTop: 3, marginBottom: 3}}/>
                            <Text style={{fontSize: 11, color: 'rgb(255,234,0)', marginRight: 10, marginLeft: 5}}>
                                {item.aliasName && item.aliasName.length > 0 ? item.aliasName : item.payName}
                            </Text>
                        </FastImage>
                    </TouchableBounce>)
                } else {
                    array.push(<TouchableBounce onPress={() => {
                        this._payTypeBtnClick(i)
                    }} key={i}>
                        <FastImage resizeMode='stretch'
                                         style={styles.payTypeItemViewStyle}
                                         source={require("../../static/images/2.1.0/bg_deposit.webp")}>
                            <FastImage source={{
                                uri: "http://" + GBServiceParam.currentIP + item.imgUrl,
                                headers: {Host: GBServiceParam.currentHost},
                                priority: FastImage.priority.normal,
                            }} style={{width: 18, height: 18, marginLeft: 10, marginTop: 3, marginBottom: 3}}/>
                            <Text style={{fontSize: 11, color: 'white', marginRight: 10, marginLeft: 5}}>
                                {item.aliasName && item.aliasName.length > 0 ? item.aliasName : item.payName}
                            </Text>
                        </FastImage>
                    </TouchableBounce>)
                }
            }

        }
        return array;
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
                    <FastImage source={require("../../static/images/2.1.0/btn_blue_click.webp")}
                                     style={{width: 40 * UIMacro.WIDTH_PERCENT,
                                         height: 30 * UIMacro.HEIGHT_PERCENT,
                                         marginLeft: 7,
                                         justifyContent: 'center',
                                         alignItems: 'center'}}
                                     resizeMode='stretch'
                    >
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
            placeHolderStr = payWatData.singleDepositMin == null ? "请输入金额" : payWatData.singleDepositMin + "~" + payWatData.singleDepositMax;
        }
        return <View style={{flexDirection: 'row', marginTop: 8, marginLeft: 7,}}>
            <TextInput
                ref={(textF) => {
                    this.textField = textF
                }}
                placeholder={placeHolderStr}
                placeholderTextColor={'rgb(170,170,170)'}
                keyboardType={'numeric'}
                value={this.state.inputString}
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
    _contenMessageView = () => {
        let content = ""
        if (Object.keys(this.state.payWayData).length > 0) {
            let array = Array.from(this.state.payWayData.arrayList);
            let payWatData = array[this.state.payTypeSelectedIndex];
            if (this.props.type === 'wechat' || this.props.type === 'alipay' || this.props.type === 'qq' || this.props.type === 'jd' || this.props.type === 'bd' || this.props.type === 'unionpay') {
                if (payWatData.type === '1') {
                    content = "温馨提示：\n• 存款金额请加以小数点或尾数，以便区别。如充值200元，请输入201元或200.1之类小数。\n• 如有任何疑问，请联系在线客服获取帮助。";
                } else if (payWatData.type === '2') {
                    content = "温馨提示：\n• 为了提高对账速度及成功率，当前支付方式已开随机额度，请输入整数存款金额，将随机增加0.01~0.99元！\n• 支付成功后，请等待几秒钟，提示「支付成功」按确认键后再关闭支付窗口。\n• 如出现充值失败或充值后未到账等情况，请联系在线客服获取帮助。 ";
                }

            } else if (this.props.type === 'easy') {
                content = "温馨提示：\n• 当前支付额度必须精确到小数点，请严格核对您的转账金额精确到分，如：100.51，否则无法提高对账速度及成功率，谢谢您的配合。\n• 如有任何疑问，请联系在线客服获取帮助。";

            } else {
                content = "温馨提示：\n• 存款金额请加以小数点或尾数，以便区别。如充值200元，请输入201元或200.1之类小数。\n• 如有任何疑问，请联系在线客服获取帮助。";
            }

        }
        return <Text style={styles.messageTextStyle} numberOfLines={0}>{content}</Text>
    }


    _payTypeBtnClick = (index) => {
        this.setState({
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
    _submitBtnClick = () => {
        if (this.state.payWayData&&this.state.payWayData.arrayList&&this.state.payWayData.arrayList.length>0){
            let array = Array.from(this.state.payWayData.arrayList);
            let payWayDetailData = array[this.state.payTypeSelectedIndex];
            if (this.state.inputString.length === 0) {
                this.refs.toast.show('请输入金额')
            }  else if(this.state.inputString.substr(0,1)==='0'||
                this.state.inputString.substr(this.state.inputString.length-1,1)==='.'){
                this.refs.toast.show('请输入正确的金额格式')
            }else if (parseFloat(this.state.inputString) < parseFloat(payWayDetailData.singleDepositMin) || parseFloat(this.state.inputString) > parseFloat(payWayDetailData.singleDepositMax)) {
                this.refs.toast.show('请输入' + payWayDetailData.singleDepositMin + "~" + payWayDetailData.singleDepositMax)
            } else {
                if (this.props.payType === 'counter') {
                    this.props.callBack("counterDetail", payWayDetailData, this.state.payWayData, this.state.inputString)
                } else if (this.props.payType === 'onecodepay') {
                    this.props.callBack("oneCodePayDetail", payWayDetailData,this.state.payWayData, this.state.inputString)
                } else if (this.props.payType === 'company') {
                    this.props.callBack("onlineBankDetail", payWayDetailData,this.state.payWayData, this.state.inputString)
                } else if (this.props.payType === 'other') {
                    this.props.callBack("otherPayDetail", payWayDetailData,this.state.payWayData, this.state.inputString)
                }
                else {
                    if (payWayDetailData.type === '1') {
                        this.props.callBack("normalDetail", payWayDetailData,this.state.payWayData, this.state.inputString)
                    } else {
                        //2表示是扫码支付，要先请求一个优惠接口然后再弹窗
                        this.setFeeModalVisible(true)
                    }

                }
            }
        }
    }

    /*渲染显示手续费等视图*/
    _showFeeView = () => {
        let viewArray = []
        if (Object.keys(this.state.payWayData).length > 0) {
            let array = Array.from(this.state.payWayData.arrayList);
            let payWatDetailData = array[this.state.payTypeSelectedIndex];
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
        this.setState({feePopViewShow: visible});
    };
    _preferentialSubmitBtnCllick = (visible) => {
        this.setState({
            feePopViewShow: visible,
        });
        if (Object.keys(this.state.payWayData).length > 0) {
            let array = Array.from(this.state.payWayData.arrayList);
            let payWatDetailData = array[this.state.payTypeSelectedIndex];
            let paramDic = {
                "result.rechargeAmount": this.state.inputString,
                "result.rechargeType": payWatDetailData.depositWay,
                "account": payWatDetailData.searchId
            };
            //这里的是扫码支付
            GBNetWorkService.post("mobile-api/depositOrigin/onlinePay.html", paramDic, null, this._depositeSuccess, this._depositeFail)
        }
    }
    _depositeSuccess = (json) => {
        if (json.data === null) {
            this.refs.toast.show(json.message)
        } else {
            this.setState({
                successPopViewShow: true,

            });
            //这里要用 json.data.payLink 跳转到浏览器
            Linking.openURL(json.data.payLink)
        }

    }
    _depositeFail = (json) => {
        this.refs.toast.show("存款失败")
    }
    _setSuccessViewModalVisible = (visible) => {
        this.setState({successPopViewShow: visible});
    };


}
const styles = StyleSheet.create({

    containerStyle: {
        width: 335 * UIMacro.WIDTH_PERCENT,
        backgroundColor: SkinsColor.containerStyle_bg,
        marginRight: 6*UIMacro.WIDTH_PERCENT,
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
    },
    payTypeItemViewStyle: {
        width:315/2** UIMacro.HEIGHT_PERCENT,
        height:50/2** UIMacro.HEIGHT_PERCENT,
        flexDirection: 'row',
        marginLeft: 5,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop:6,
    },
    moneyViewStyle: {
        flexDirection: 'row',
        height: 30 * UIMacro.HEIGHT_PERCENT,
        marginTop: 7,
        marginLeft: 7,
    },
    inputViewStyle: {
        height: 33 * UIMacro.HEIGHT_PERCENT,
        width: 250 * UIMacro.WIDTH_PERCENT,
        backgroundColor: SkinsColor.shadowColor,
        borderColor: 'rgba(255,255,255,0.36)',
        borderWidth: 1,
        borderRadius: 5,
        shadowColor: SkinsColor.shadowColor,
        shadowOffset: {h: 3, w: 3},
        color: 'white',
        fontSize: 12,
        marginLeft: 5,
        padding: 0,
        paddingLeft: 10
    },
    cleanBtnStyle: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 56.5 * UIMacro.WIDTH_PERCENT,
        height: 33.5 * UIMacro.HEIGHT_PERCENT,
        marginLeft:3,
    },
    submitBtnStyle: {
        width: 118* UIMacro.WIDTH_PERCENT,
        height: 40* UIMacro.WIDTH_PERCENT,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 8,
    },
    messageViewStyle: {
        flexDirection: 'column',
        marginTop: 10,
        marginRight: 10,
        marginLeft: 10,

    },
    lineStyle: {
        height: 0.5,
        marginLeft: 10,
        marginRight: 10,
        marginBottom: 10,
        backgroundColor: SkinsColor.bgTextViewStyle_border
    },
    messageTextStyle: {
        fontSize: 11,
        color: SkinsColor.IDText,
    }

});
