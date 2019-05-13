/**
 * @author
 *  Chester
 * @remark 安全中心 三级菜单 银行卡
 */

import React, {Component} from 'react'
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    ImageBackground, Image
} from 'react-native'
import GBNetWorkService from "../../core/GBNetWorkService";
import ModalDropdown from "react-native-modal-dropdown";
import UserInfo from "../../core/UserInfo";
import UIMacro from "../../core/UIMacro";
import Toast from "../../common/ToastView";
import SkinsColor from "../../core/SkinsColor";
import TouchableBounce from '../../common/TouchableBounce'
import FastImage from 'react-native-fast-image';
const BORDER_WIDTH = 2;

export default class BindBankCardView extends Component {
    state = {
        realName: UserInfo.realName,
        bankName: '',
        bankcardNumber: '',
        bankDeposit: '',
        bankList: [],
        bankCodeList:[],
        callMessage: '',
        hasRealName:null,
        bankCode:'',//绑定银行卡要bankcode
    };

    /*调用绑定银行卡的API接口*/
    submitBankCard = () => {
        let restName = /^[\u4e00-\u9fa5A-Za-z_\.]{2,30}$/;
        console.log("选择的银行"+this.state.bankName)
        // 1.输入验证
        if(!restName.test(this.state.realName)){
            // 提示
            this.showToast('请输入2-30个字符（由汉字、大小写英文字母、“.”组成）')
            return
        }
        if (!this.state.realName) {
            // 提示
            this.showToast('真实姓名不能为空')
            return
        }
        if (!this.state.bankName) {
            // 提示
            this.showToast('银行选项不能为空')
            return
        }
        if (!this.state.bankcardNumber) {
            // 提示
            this.showToast('卡号不能为空')
            return
        }
        if (this.state.bankcardNumber.length<12){
            this.showToast('卡号至少12位数')
            return
        }

        if (this.state.bankName == "其它银行"){
            if (!this.state.bankDeposit) {
                this.showToast('开户银行不能为空')
                return
            }
        }


        // 2.提交，请求 //TODO 1.未绑定有银行卡的账号绑定页面 提示完成   2.已经有银行卡的情况的修改页面，未做提示弹框
        let param = {
            'result.bankcardMasterName': this.state.realName,
            'result.bankName': this.state.bankCode,
            'result.bankcardNumber': this.state.bankcardNumber,
            'result.bankDeposit': this.state.bankDeposit
        };
        GBNetWorkService.post("mobile-api/userInfoOrigin/submitBankCard.html", param, null, this._submitSuccessBack, this._submitFailBack)
    };
    _submitSuccessBack = (json) => {
        console.log("submit成功:(银行卡)" + JSON.stringify(json));
        //如果成功则更新保存的用户银行卡数据
        if (json.code === 0 || json.code === '0') {
            let userBank = {
                "bankcardMasterName": this.state.realName,
                "realName": this.state.realName,
                "bankName": this.state.bankName,
                "bankcardNumber": this.state.bankcardNumber,
                "bankDeposit": this.state.bankDeposit
            };
            UserInfo.bankcard = userBank;
            UserInfo.realName = this.state.realName ;
            UserInfo.hasRealName = true ;
        }
        this.setState({
            callMessage: json.message,
        }, () => this.showToast(this.state.callMessage === '请求成功' ? '绑定成功' : this.state.callMessage));
        // this.tipsModal();
    };
    _submitFailBack = (json) => {
        console.log("submit失败:" + JSON.stringify(json));
    };
    // 提示框
    showToast = (msg) => {
        let tip = msg || this.state.callMessage
        this.refs.toast.show(tip)
    };

    //失去焦点
    loadBlur=(input)=> {
        input.blur()
    }

    /*没有绑定过银行卡*/
    noBindBank = () => {
        return (
                <View style={styles.container}>
                    <View style={styles.content}>
                        <View style={styles.row}>
                            <Text style={styles.text}>真实姓名</Text>
                            <TextInput placeholder='请输入真实姓名' placeholderTextColor='#AAAAA8'
                                           style={styles.textInputBind}
                                           editable={!UserInfo.hasRealName}
                                           value={this.state.realName} onChangeText={this.handleChangeName}
                                       ref={(c)=>this.hasRealName=c}
                                       onEndEditing={()=>{this.loadBlur(this.hasRealName)}}
                            />

                        </View>
                        <View>
                            <Text style={styles.tipText}>银行卡户名和真实姓名一致才能取款成功</Text>
                        </View>

                        <View style={styles.row}>
                            <Text style={styles.text}>银行</Text>
                            <TextInput placeholder='请选择' placeholderTextColor='#AAAAA8'
                                       style={styles.textInput}
                                       value={this.state.bankName}
                                       editable={false}
                                       onChangeText={this.handleChangeBankName}/>
                            <View style={styles.dropDownImg}>
                                <View style={styles.modal}>
                                    <ModalDropdown dropdownStyle={styles.dropDownStyle}
                                                   animated={true}
                                                   textStyle={styles.dropDownText}
                                                   options={Array.from(this.state.bankList)}
                                                   onSelect={(index, value) => this._selectBank(index,value)}
                                                   dropdownTextStyle={styles.dropDownTextStyle}
                                                   disabled={this.state.disabled}
                                                   dropdownTextHighlightStyle={styles.wcSearchBarDropDownTextHighlightStyle}
                                    >
                                        <View style={styles.imageDrop}>
                                            <FastImage source={require('../../static/images/2.1.0/drop_down1.webp')}
                                                   style={styles.imgDropDown}/>
                                        </View>
                                    </ModalDropdown>
                                </View>

                            </View>
                        </View>

                        <View style={styles.row}>
                            <Text style={styles.text}>卡号</Text>
                            <TextInput placeholder='请输入卡号' placeholderTextColor='#AAAAA8'
                                       style={styles.textInput}
                                       value={this.state.bankcardNumber}
                                       keyboardType='numeric'
                                       onChangeText={this.handleChangeBankcardNumber}
                                       ref={(c)=>this.bankcardNumber=c}
                                       onEndEditing={()=>{this.loadBlur(this.bankcardNumber)}}
                            />
                        </View>

                        <View style={styles.row}>
                            <Text style={styles.text}>开户银行</Text>
                            <TextInput placeholder='如：河北唐山建设银行' placeholderTextColor='#AAAAA8'
                                       style={styles.textInput} value={this.state.bankDeposit}
                                       onChangeText={this.handleChangeBankDeposit}
                                       ref={(c)=>this.bankDeposit=c}
                                       onEndEditing={()=>{this.loadBlur(this.bankDeposit)}}
                            />
                        </View>
                        <View>
                            <Text style={styles.tipText}>选择“其他”银行必填</Text>
                        </View>

                        <View style={{justifyContent: 'center',alignItems:'center',width:333*UIMacro.WIDTH_PERCENT,height:47*UIMacro.HEIGHT_PERCENT,marginTop: (16 - 8) * UIMacro.HEIGHT_PERCENT,}}>
                        <TouchableBounce onPress={this.submitBankCard} style={styles.btnLog}>
                            <FastImage style={{height: 41.5 * UIMacro.HEIGHT_PERCENT, width: 117.5 * UIMacro.WIDTH_PERCENT}}
                                             resizeMode='contain'
                                             source={require('../../static/images/2.1.0/btn_general.webp')}>
                                <Text style={styles.log}>修改</Text>
                            </FastImage>
                        </TouchableBounce>
                        </View>
                    </View>
                </View>
        )
    };
    _selectBank=(index,value)=>{
        console.log("选择的index=="+index+"银行数组"+JSON.stringify(this.state.bankCodeList))
        this.setState({
            bankName: value,
            bankCode:this.state.bankCodeList[index]
        })
    }


    /*绑定过银行卡*/
    hasBoundBank = () => {
        return (
                <View style={styles.container}>
                    <View style={styles.content}>
                        <View style={styles.row}>
                            <Text style={styles.text}>真实姓名</Text>
                            <TextInput style={styles.textInputBind}
                                       editable={false}
                                       value={UserInfo.bankcard.bankcardMasterName}/>
                        </View>
                        <View>
                            <Text style={styles.tipText}>银行卡户名和真实姓名一致才能取款成功</Text>
                        </View>

                        <View style={styles.row}>
                            <Text style={styles.text}>银行</Text>
                            <TextInput
                                style={styles.textInputBind}
                                value={UserInfo.bankcard.bankName}
                                editable={false}
                            />
                        </View>

                        <View style={styles.row}>
                            <Text style={styles.text}>卡号</Text>
                            <TextInput
                                style={styles.textInputBind}
                                value={UserInfo.bankcard.bankcardNumber}
                                editable={false}
                            />
                        </View>

                        <View style={styles.row}>
                            <Text style={styles.text}>开户银行</Text>
                            <TextInput
                                style={styles.textInputBind} value={UserInfo.bankcard.bankDeposit}
                                editable={false}/>
                        </View>
                        <View>
                            <Text style={styles.tipText}>选择“其他”银行必填</Text>
                        </View>
                    </View>
                </View>
        )
    };


    handleChangeName = (msg) => {
        this.setState({realName: msg});
    };
    handleChangeBankName = (msg) => {
        this.setState({bankName: msg});
    };
    handleChangeBankcardNumber = (msg) => {
        this.setState({bankcardNumber: msg});
    };
    handleChangeBankDeposit = (msg) => {
        this.setState({bankDeposit: msg});
    };

    componentWillMount() {

        let paramsArray = [];
        let bankCodeArray=[];
        let data = UserInfo.bankList;
        data.map(item=>{
            paramsArray.push(item.text)
            bankCodeArray.push(item.value)
        })
        this.setState({
            bankList: paramsArray,
            bankCodeList:bankCodeArray,
        })
    }

    render() {
        return (
            <View style={styles.modalRightView}>
                {UserInfo.bankcard != null && UserInfo.bankcard.bankcardNumber != null
                &&
                this.hasBoundBank()
                }
                {UserInfo.bankcard === null
                &&
                this.noBindBank()
                }

                <Toast
                    ref="toast"
                    style={{backgroundColor:
                            'white',marginTop:230*UIMacro.HEIGHT_PERCENT,}}
                    fadeInDuration={300}
                    fadeOutDuration={300}
                    opacity={1}
                    textStyle={{color: 'black'}}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        width: UIMacro.WIDTH_PERCENT * 333,
        height: UIMacro.HEIGHT_PERCENT * 284,
    },
    content: {
        marginTop: 15 * UIMacro.HEIGHT_PERCENT,
        alignItems: 'flex-end',
    },
    row: {
        flexDirection: 'row',
        marginBottom: 8 * UIMacro.HEIGHT_PERCENT,
        marginRight: 34 * UIMacro.WIDTH_PERCENT,
        alignItems: 'center'
    },
    text: {
        color: '#fff',
        fontSize: 12,
        textAlign: 'right',
        marginRight: 8 * UIMacro.WIDTH_PERCENT
    },
    textInput: {
        backgroundColor: SkinsColor.bgTextViewStyle_bg,
        height: 33 * UIMacro.HEIGHT_PERCENT,
        width: 208 * UIMacro.WIDTH_PERCENT,
        borderRadius: 5,
        fontSize: 12,
        color: '#fff',
        padding: 0,
        paddingLeft: 10,
        borderWidth: 1,
        borderColor: SkinsColor.bgTextViewStyle_border
    },
    textInputBind: {
        backgroundColor: SkinsColor.bgTextViewStyle_bg,
        height: 33 * UIMacro.HEIGHT_PERCENT,
        width: 208 * UIMacro.WIDTH_PERCENT,
        borderRadius: 5,
        fontSize: 12,
        color: '#919191',
        padding: 0,
        paddingLeft: 10,
        borderWidth: 1,
        borderColor: SkinsColor.bgTextViewStyle_border
    },
    btnLog: {
        height: 47 * UIMacro.HEIGHT_PERCENT,
        alignItems: 'center',
    },
    log: {
        fontSize: 15,
        textAlign: 'center',
        color: '#fff',
        fontWeight: 'bold',
        height: 41.5 * UIMacro.HEIGHT_PERCENT,
        lineHeight: 41.5 * UIMacro.HEIGHT_PERCENT
    },
    tipText: {
        color: '#FFEA00',
        fontSize: 10,
        paddingLeft: 92 * UIMacro.WIDTH_PERCENT,
        marginTop: -5,
        marginBottom: 5,
        width: UIMacro.WIDTH_PERCENT * 333,
    },
    modalRightView: {
        width: 335 * UIMacro.WIDTH_PERCENT,
        height: 285 * UIMacro.HEIGHT_PERCENT,
        borderRadius: 5,
        borderWidth:1,
        borderColor:SkinsColor.bgTextViewStyle_border,
        backgroundColor: 'rgba(0, 0, 0, .2)',
        marginTop: 10 * UIMacro.HEIGHT_PERCENT,
    },
    dropDownStyle: {
        // width: 250,
        flex: 1,
        height: 150 * UIMacro.HEIGHT_PERCENT,
        // borderColor: '#4854A9',
        borderWidth: 1,
    },
    dropDownText: {
        fontSize: 11,
        color: '#a5d2f2',
        paddingLeft: 10
    },
    dropDownTextStyle: {
        color: '#FFFFFF',
        backgroundColor: SkinsColor.bgTextViewStyle_bg,
        fontSize: 12,
        height: 25 * UIMacro.HEIGHT_PERCENT,
        width: 124 * UIMacro.WIDTH_PERCENT,
        paddingTop: 0,
        paddingBottom: 0,
        lineHeight:25 * UIMacro.HEIGHT_PERCENT,
    },
    wcSearchBarDropDownTextHighlightStyle: {
        color: '#FFFFFF',
        backgroundColor: SkinsColor.WelfareRecordDropDownHighLight_bg,
        fontSize: 12,
        height: 25 * UIMacro.HEIGHT_PERCENT,
        width: 124 * UIMacro.WIDTH_PERCENT,
        paddingTop: 0,
        paddingBottom: 0,
    },
    imgDropDown: {
        width: 16 * UIMacro.WIDTH_PERCENT,
        height: 9 * UIMacro.HEIGHT_PERCENT,
        marginBottom: 3 * UIMacro.HEIGHT_PERCENT,
    },
    imageDrop: {
        width: 50 * UIMacro.WIDTH_PERCENT,
        // marginTop: 68,
        height: 40 * UIMacro.HEIGHT_PERCENT,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: -6 * UIMacro.WIDTH_PERCENT
    },
    dropDownImg: {
        position: 'absolute',
        right: 0,
    },
    modal: {
        height: 40 * UIMacro.HEIGHT_PERCENT,
        alignItems: 'center',
        justifyContent: 'center',
    },
    messageView: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    mesText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 14,
        marginLeft: 10 * UIMacro.WIDTH_PERCENT
    },
    btnClick: {
        width: 121 * UIMacro.WIDTH_PERCENT,
        height: 45 * UIMacro.HEIGHT_PERCENT,
        marginTop: 8 * UIMacro.HEIGHT_PERCENT,
    },
    logText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        height: 45 * UIMacro.HEIGHT_PERCENT,
        lineHeight: 45 * UIMacro.HEIGHT_PERCENT
    },
    btn: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
});