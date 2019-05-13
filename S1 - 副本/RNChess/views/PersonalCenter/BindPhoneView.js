/**
 * @author
 *  Chester
 * @remark 安全中心 三级菜单 绑定手机
 */

import React, {Component} from 'react'
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    ImageBackground,
} from 'react-native'
import GBNetWorkService from "../../core/GBNetWorkService";
import Toast from '../../common/ToastView' ;
import UIMacro from "../../core/UIMacro";
import TouchableBounce from "../../common/TouchableBounce";
import SkinsColor from "../../core/SkinsColor";
import FastImage from 'react-native-fast-image';

const BORDER_WIDTH = 2;

export default class BindPhoneView extends Component {
    state = {
        oldPhone: '',
        newPhone: '',
        code: '',
        changeBindPhoneNum: false,//是否绑定新的手机号
        isBindPhone: false,//之前是否绑定有号码（切换）
        verificationCode: '',
        second: 60,
        text: '获取验证码',

    };

    //获取短信验证码
    getVerificationCode = () => {
        //正则校验
        let regPhone = /^(((13[0-9])|(14[579])|(15([0-3]|[5-9]))|(16[6])|(17[0135678])|(18[0-9])|(19[89]))\d{8})$/;
        if (this.state.isBindPhone) {
            //绑定过手机，要更换手机
            if (this.state.changeBindPhoneNum) {
                if (this.state.newPhone.length == 0) {
                    this.refs.toast.show("新手机号不能为空")
                    return
                } else if (!regPhone.test(this.state.newPhone)) {
                    this.refs.toast.show("新手机号格式不正确")
                    return
                }
            }
        } else {
            //没有绑定过手机
            if (this.state.oldPhone.length === 0) {
                this.refs.toast.show("手机号不能为空")
                return
            } else if (!regPhone.test(this.state.oldPhone)) {
                this.refs.toast.show("手机号格式不正确")
                return
            }
        }
        let params = {'phone': this.state.changeBindPhoneNum ? this.state.newPhone : this.state.oldPhone};
        let url = 'mobile-api/origin/sendPhoneCode.html';
        GBNetWorkService.post(url, params, null, this.successPhone, this.failPhone)
    };
    successPhone = (json) => {
        if (parseInt(json.code) === 0) {
            let that = this;
            this.myTimer = setInterval(() => {
                let nowSecond = this.state.second;
                nowSecond--;
                if (that._isMounted) {
                    if (nowSecond > 0) {
                        this.setState({
                            second: nowSecond,
                            text: nowSecond + '秒后重试'
                        });
                    } else {
                        this.setState({
                            text: '重新获取',
                            second: 60
                        })
                        this.myTimer && clearInterval(this.myTimer);
                    }
                }
            }, 1000);
            this.refs.toast.show("发送成功")
        } else {
            this.refs.toast.show(json.message)
        }

    };
    failPhone = (json) => {

    };

    /*提交绑定手机号*/
    updateUserPhone = () => { // 1.未绑定过手机 提示完成 2.已经绑定过手机 提示完成 3.已绑定但处于禁用状态 提示完成
        //正则校验
        let regPhone = /^(((13[0-9])|(14[579])|(15([0-3]|[5-9]))|(16[6])|(17[0135678])|(18[0-9])|(19[89]))\d{8})$/;
        if (this.state.isBindPhone) {
            //绑定过手机，要更换手机
            if (this.state.changeBindPhoneNum) {
                if (!this.state.oldPhone) {
                    this.refs.toast.show("旧手机号不能为空")
                    return
                } else if (!regPhone.test(this.state.oldPhone)) {
                    this.refs.toast.show("旧手机号格式不正确")
                    return
                } else if (this.state.newPhone.length == 0) {
                    this.refs.toast.show("新手机号不能为空")
                    return
                } else if (!regPhone.test(this.state.newPhone)) {
                    this.refs.toast.show("新手机号格式不正确")
                    return
                } else if (this.state.verificationCode.length == 0) {
                    this.refs.toast.show("请输入验证码")
                    return
                }
            }
        } else {
            //没有绑定过手机
            if (this.state.oldPhone.length === 0) {
                this.refs.toast.show("手机号不能为空")
                return
            } else if (!regPhone.test(this.state.oldPhone)) {
                this.refs.toast.show("手机号格式不正确")
                return
            } else if (this.state.verificationCode.length === 0) {
                this.refs.toast.show("请输入验证码")
                return
            }
        }

        let param = this.state.newPhone.length > 0 ? {
            "search.contactValue": this.state.newPhone,
            "oldPhone": this.state.oldPhone,
            "code": this.state.verificationCode
        } : {
            "search.contactValue": this.state.oldPhone,//这里要注意，一定要用search.contactValue这个参数
            "oldPhone": "",
            "code": this.state.verificationCode
        };
        GBNetWorkService.post("mobile-api/mineOrigin/updateUserPhone.html", param, null, this._updateSuccessBack, this._updateFailBack)
    };
    _updateSuccessBack = (json) => {

        if (parseInt(json.code) === 0) {
            this.refs.toast.show("绑定成功")
            this.timer = setTimeout(() => {
                this.props.closeSecurityView()
            }, 500);
        } else {
            this.refs.toast.show(json.message)
        }

    };
    _updateFailBack = (json) => {
        console.log("update失败！" + JSON.stringify(json));
    };

    handleYzm = (YzmMsg) => {
        if (this._isMounted) {
            this.setState({verificationCode: YzmMsg})
        }

    };

    //失去焦点
    loadBlur = (input) => {
        input.blur()
    }

    /*手机是否已绑定*/
    phoneBind = () => {
        if (!this.state.isBindPhone) {
            return<View>
            <View style={styles.content}>
                <View style={styles.row}>
                    <Text style={styles.text}>手机号码</Text>
                    <TextInput style={styles.textInputTwo} value={this.state.oldPhone}
                               onChangeText=    {this.handleChangeOldPhone}
                               ref={(c) => this.oldPhone = c}
                               onEndEditing={() => {
                                   this.loadBlur(this.oldPhone)
                               }}
                    />

                </View>
                <View style={{position:'absolute',right:40*UIMacro.WIDTH_PERCENT,top:7*UIMacro.HEIGHT_PERCENT}}>
                    <TouchableOpacity onPress={this.getVerificationCode}>
                        <Text style={styles.textTip}>{this.state.text}</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.row}>
                    <Text style={styles.text}>短信验证码</Text>
                    <TextInput style={styles.textInputTwo}
                               value={this.state.verificationCode}
                               onChangeText={this.handleYzm}
                               ref={(c) => this.verificationCode = c}
                               onEndEditing={() => {
                                   this.loadBlur(this.verificationCode)
                               }}
                    />
                </View>
            </View>
                <View style={styles.contentButton}>
                    <TouchableBounce onPress={this.updateUserPhone} style={styles.btnLog}>
                        <FastImage style={{height: 41.5 * UIMacro.HEIGHT_PERCENT, width: 117.5 * UIMacro.WIDTH_PERCENT}}
                                         resizeMode='contain'
                                         source={require('../../static/images/2.1.0/btn_general.webp')}>
                            <Text style={styles.log}>立即绑定</Text>
                        </FastImage>
                    </TouchableBounce>
                </View>
            </View>
        } else {
            // 手机号码可用 或 禁用且点击了替换按钮
            if (this.state.changeBindPhoneNum) {
                return <View style={styles.updateContent}>
                    <View style={styles.con}>
                        <View style={styles.row1}>
                            <Text style={styles.text}>旧手机号码</Text>
                            <TextInput style={styles.phoneInput}
                                       value={this.state.oldPhone}
                                       onChangeText={this.handleChangeOldPhone}
                                       ref={(c) => this.oldPhone1 = c}
                                       onEndEditing={() => {
                                           this.loadBlur(this.oldPhone1)
                                       }}
                            />
                        </View>
                        <View style={styles.row1}>
                            <Text style={styles.text}>新手机号码</Text>
                            <TextInput style={styles.updateTextInput}
                                       value={this.state.newPhone}
                                       onChangeText={this.handleChangeNewPhone}
                                       ref={(c) => this.newPhone = c}
                                       onEndEditing={() => {
                                           this.loadBlur(this.newPhone)
                                       }}
                            />
                            <TouchableBounce onPress={this.getVerificationCode}>
                                <FastImage
                                    style={{height: 33 * UIMacro.HEIGHT_PERCENT, width: 89 * UIMacro.WIDTH_PERCENT,justifyContent:'center',alignItems:'center'}}
                                    resizeMode='contain'
                                    source={require('../../static/images/2.1.0/btn_green_action2.webp')}>
                                    <Text style={styles.updateTextTip}>{this.state.text}</Text>
                                </FastImage>
                            </TouchableBounce>
                        </View>
                    </View>
                    <View style={styles.updateRow}>
                        <Text style={styles.text}>短信验证码</Text>
                        <TextInput style={styles.updateTextInputTwo}
                                   value={this.state.verificationCode}
                                   onChangeText={this.handleYzm}
                                   ref={(c) => this.verificationCode1 = c}
                                   onEndEditing={() => {
                                       this.loadBlur(this.verificationCode1)
                                   }}
                        />
                    </View>
                    <View style={{justifyContent:'center',alignItems:'center',marginTop:10}}>
                    <TouchableBounce onPress={this.updateUserPhone} style={styles.btnLog}>
                        <FastImage
                            style={{height: 41.5 * UIMacro.HEIGHT_PERCENT, width: 117.5 * UIMacro.WIDTH_PERCENT}}
                            resizeMode='contain'
                            source={require('../../static/images/2.1.0/btn_general.webp')}>
                            <Text style={styles.log}>立即绑定</Text>
                        </FastImage>
                    </TouchableBounce>
                    </View>
                </View>
            } else {
                return <View style={styles.disableContent}>
                    <View style={styles.disablePhoneNum}>
                        <Text style={styles.text}>手机号码</Text>
                        <TextInput editable={false} style={styles.disablePhone} value={this.state.oldPhone}/>
                    </View>
                    <TouchableBounce onPress={this._changeBindPhoneNum} style={styles.changeBtn}>
                        <FastImage
                            style={{height: 41.5 * UIMacro.HEIGHT_PERCENT, width: 117.5 * UIMacro.WIDTH_PERCENT}}
                            resizeMode='contain'
                            source={require('../../static/images/2.1.0/btn_general.webp')}>
                            <Text style={styles.log}>更换绑定号码</Text>
                        </FastImage>
                    </TouchableBounce>
                </View>
            }
        }
    };
    _changeBindPhoneNum = () => {
        this.setState({
            oldPhone: '',
            changeBindPhoneNum: true,
        })
    }

    handleChangeOldPhone = (msg) => {
        this.setState({oldPhone: msg});
    };
    handleChangeNewPhone = (msg) => {
        this.setState({newPhone: msg});
    };

    componentWillMount() {
        /*渲染完成前调用接口判断是否绑定过手机号*/
        GBNetWorkService.get("mobile-api/mineOrigin/getUserPhone.html", null, null, this._isBindSuccessBack, this._isBindFailBack)
    };

    _isBindSuccessBack = (json) => {
        console.log("getUser成功！" + JSON.stringify(json));
        if (json.data != null && json.data !== "") {
            if (this._isMounted) {
                this.setState({
                    isBindPhone: true,
                    oldPhone: json.data,
                });
            }
        }
    };
    _isBindFailBack = (json) => {
        console.log("getUser失败！" + JSON.stringify(json));
    };

    componentDidMount() {
        this._isMounted = true
    }

    componentWillUnmount() {
        this._isMounted = false;
        this.myTimer && clearInterval(this.myTimer);
        this.timer && clearTimeout(this.timer);
    }

    render() {
        return (
            <View style={styles.modalRightView}>
                <View style={styles.container}>
                    {/*手机是否已绑定 @lemon*/}
                    {
                        this.phoneBind()
                    }
                </View>
                <View style={styles.bottomTips}>
                    <Text style={styles.bottomTipsText}>温馨提示：</Text>
                    <Text style={styles.bottomTipsText}>●忘记密码时可以通过手机号码找回。</Text>
                    <Text style={styles.bottomTipsText}>●短信送达可能存在延迟，请耐心等待。</Text>
                    <Text style={styles.bottomTipsText}>●若规定时间内仍未收到短信，请您重新获取或联系在线客服。</Text>
                </View>

                <Toast
                    ref="toast"
                    style={{
                        backgroundColor:
                            'white', marginTop: 230 * UIMacro.HEIGHT_PERCENT,
                    }}
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
        height: UIMacro.HEIGHT_PERCENT * 208,
    },
    content: {
        marginTop:50*UIMacro.WIDTH_PERCENT,
    },
    contentButton: {
        marginTop:10*UIMacro.WIDTH_PERCENT,
        alignItems:'center',
        justifyContent:'center'
    },
    updateContent: {
        marginTop:38*UIMacro.WIDTH_PERCENT,
        width:335*UIMacro.WIDTH_PERCENT
    },
    disableContent: {
        marginTop: 50 * UIMacro.HEIGHT_PERCENT,
        alignItems: 'center',
    },
    disablePhoneNum: {
        flexDirection: 'row',
        marginBottom: 33 * UIMacro.HEIGHT_PERCENT,
        alignItems: 'center',
    },
    disablePhone: {
        backgroundColor: 'rgba(153, 153, 153, 1)',
        height: 33 * UIMacro.HEIGHT_PERCENT,
        width: 138 * UIMacro.WIDTH_PERCENT,
        borderRadius: 5,
        marginLeft: 11 * UIMacro.WIDTH_PERCENT,
        color: '#fff',
        padding: 0,
        paddingLeft: 10,
        borderWidth: BORDER_WIDTH / 2,
        borderColor: '#5b6061',
    },
    changeBtn: {
        height: 47 * UIMacro.HEIGHT_PERCENT,
        width: 145 * UIMacro.WIDTH_PERCENT,
    },
    row: {
        flexDirection: 'row',
        marginBottom: 8 * UIMacro.HEIGHT_PERCENT,
        alignItems: 'center',
        justifyContent:'flex-end'
    },
    updateRow: {
        flexDirection: 'row',
        alignItems: 'center',
        width:335*UIMacro.WIDTH_PERCENT,
        marginLeft:22*UIMacro.WIDTH_PERCENT
    },
    con: {
        alignItems: 'center',
    },
    row1: {
        flexDirection: 'row',
        marginBottom: 8 * UIMacro.HEIGHT_PERCENT,
        alignItems: 'center',
    },
    text: {
        color: '#fff',
        fontSize: 14,
        marginRight: 5 * UIMacro.WIDTH_PERCENT
    },
    textTip: {
        color: 'rgba(255, 234, 0, 1)',
        fontSize: 12,
        textAlign: 'left'
    },
    updateTextTip: {
        color: '#FFFFFF',
        fontSize: 13,
        height:33*UIMacro.HEIGHT_PERCENT,
        lineHeight:33*UIMacro.HEIGHT_PERCENT,
        fontWeight:'bold'
    },
    textInput: {
        backgroundColor: SkinsColor.bgTextViewStyle_bg,
        height: 33 * UIMacro.HEIGHT_PERCENT,
        width: 114 * UIMacro.WIDTH_PERCENT,
        borderRadius: 5,
        color: '#fff',
        padding: 0,
        paddingLeft: 10,
        borderWidth: 1,
        borderColor: SkinsColor.bgTextViewStyle_border,
        marginRight: 5 * UIMacro.WIDTH_PERCENT
    },
    updateTextInput: {
        backgroundColor: SkinsColor.bgTextViewStyle_bg,
        height: 33 * UIMacro.HEIGHT_PERCENT,
        width: 114 * UIMacro.WIDTH_PERCENT,
        borderRadius: 5,
        color: '#fff',
        padding: 0,
        paddingLeft: 10,
        borderWidth: 1,
        borderColor: SkinsColor.bgTextViewStyle_border,
        marginLeft:6*UIMacro.WIDTH_PERCENT,
        marginRight:5*UIMacro.WIDTH_PERCENT
    },
    phoneInput: {
        backgroundColor: SkinsColor.bgTextViewStyle_bg,
        height: 33 * UIMacro.HEIGHT_PERCENT,
        width: 208 * UIMacro.WIDTH_PERCENT,
        borderRadius: 5,
        color: '#fff',
        padding: 0,
        paddingLeft: 10,
        marginLeft:6*UIMacro.WIDTH_PERCENT,
        borderColor:SkinsColor.bgTextViewStyle_border,
        borderWidth:1
    },
    textInputTwo: {
        backgroundColor: SkinsColor.bgTextViewStyle_bg,
        height: 33 * UIMacro.HEIGHT_PERCENT,
        width: 114 * UIMacro.WIDTH_PERCENT,
        borderRadius: 5,
        color: '#fff',
        padding: 0,
        paddingLeft: 10,
        borderWidth: 1,
        borderColor: SkinsColor.bgTextViewStyle_border,
        marginRight: 107 * UIMacro.WIDTH_PERCENT
    },
    updateTextInputTwo: {
        backgroundColor: SkinsColor.bgTextViewStyle_bg,
        height: 33 * UIMacro.HEIGHT_PERCENT,
        width: 114 * UIMacro.WIDTH_PERCENT,
        borderRadius: 5,
        color: '#fff',
        padding: 0,
        paddingLeft: 10,
        borderWidth: 1,
        borderColor: SkinsColor.bgTextViewStyle_border,
        marginLeft:6*UIMacro.WIDTH_PERCENT,
        marginRight:120*UIMacro.WIDTH_PERCENT
    },
    btnLog: {
    },
    log: {
        fontSize: 15,
        textAlign: 'center',
        color: '#fff',
        fontWeight: 'bold',
        height: 41.5 * UIMacro.HEIGHT_PERCENT,
        lineHeight: 41.5 * UIMacro.HEIGHT_PERCENT
    },
    modalRightView: {
        width: 335 * UIMacro.WIDTH_PERCENT,
        height: 285 * UIMacro.HEIGHT_PERCENT,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: SkinsColor.bgTextViewStyle_border,
        backgroundColor: 'rgba(0, 0, 0, .2)',
        marginTop: 10 * UIMacro.HEIGHT_PERCENT,
    },
    bottomTips: {
        marginTop: 8 * UIMacro.HEIGHT_PERCENT,
        paddingTop: 9 * UIMacro.HEIGHT_PERCENT,
        marginLeft: 16 * UIMacro.WIDTH_PERCENT
    },
    bottomTipsText: {
        color: SkinsColor.IDText,
        fontSize: 10,
        width: 333 * UIMacro.WIDTH_PERCENT,
    },
});