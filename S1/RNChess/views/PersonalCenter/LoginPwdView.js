/**
 * @author
 *  Chester
 * @remark 安全中心 三级菜单 修改登录密码
 */

import React, {Component} from 'react'
import {
    View,
    Text,
    Image,
    TextInput,
    StyleSheet,
    ImageBackground,
} from 'react-native'
import GBNetWorkService from "../../core/GBNetWorkService";
import Toast from '../../common/ToastView' ;
import UIMacro from "../../core/UIMacro";
import TouchableBounce from "../../common/TouchableBounce";
import SkinsColor from "../../core/SkinsColor";
import UserInfo from "../../core/UserInfo";
import FastImage from 'react-native-fast-image';

const BORDER_WIDTH = 2;

export default class LoginPwdView extends Component {
    state = {
        password: '',
        newPassword: '',
        againPwd: '',
        code: '',
        imgUrl: '',
        callMessage: '',
        verificationCode:'',
        isOpenCaptcha:UserInfo.isSuccessChaCode,  //是否需要验证码
        changePwdStatusCode:'',
    };

    componentDidMount(){
        this.is_Mounted = true
        this.getSecurityPwd()
    }
    componentWillUnmount(){
        this.is_Mounted = false
    }

    /*修改登录密码*/
    updateLoginPassword = () => {
        /*正则校验*/
        // let regPwd = /^[a-zA-Z0-9_]{6,20}$/;
        if (!this.state.password) {
            this.setState({
                callMessage: '请输入当前密码',
            },this.showToast);
            return
        }
        if (!this.state.newPassword) {
            this.setState({
                callMessage: '请输入新密码',
            },this.showToast);
            return
        }
        if (!this.state.againPwd) {
            this.setState({
                callMessage: '请再次输入新密码',
            },this.showToast);
            return
        }
        if (this.state.newPassword !== this.state.againPwd) {
            this.setState({
                callMessage: '两次密码输入不一致',
            },this.showToast);
            return
        }
        if (this.state.isOpenCaptcha) {
            if (!this.state.verificationCode) {
                this.setState({
                    callMessage: '验证码不能为空',
                },this.showToast);
                return
            }
        }

        let param = {'password': this.state.password, 'newPassword': this.state.newPassword, 'code': this.state.verificationCode};
        console.log('3密码参数',param)
        GBNetWorkService.post("mobile-api/mineOrigin/updateLoginPassword.html", param, null, this._updateLoginPwdSuccessBack, this._updateLoginPwdFailBack)
    };
    _updateLoginPwdSuccessBack = (json) => {
        console.log("updateLoginPwd请求成功返回数据:" + JSON.stringify(json));
        this.setState({
            changePwdStatusCode: json.code,
        });
        if (parseInt(json.code) !==0) {
            this.setState({
                callMessage: json.message,
            }, this.showToast);
            json.data &&
            this.setState({isOpenCaptcha: json.data.isOpenCaptcha},()=>{UserInfo.isSuccessChaCode=json.data.isOpenCaptcha})
            json.data && json.data.isOpenCaptcha &&
            this.getSecurityPwd();
        }else{
            this.setState({
                callMessage: '修改成功',
            }, this.showToast);
            setTimeout(this.CloseModals,500)
        }
        console.log('isSuccessChaCode:',UserInfo.isSuccessChaCode);
    };
    // 关闭多个弹框
    CloseModals = () => {
        this.props.closeSecurityView()
    };
    _updateLoginPwdFailBack = (json) => {
        this.getSecurityPwd()
        console.log("updateLoginPwd失败:" + JSON.stringify(json));
    };
    // 提示框
    showToast = () =>{
        this.refs.toast.show(this.state.callMessage);
    };
    /*获取安全密码验证码*/
    getSecurityPwd = () => {
        let date = new Date().getTime();
        let param = {'timeStr': date};
        GBNetWorkService.post("captcha/code.html", param, null, this._getSecurityPwdSuccessBack, this._getSecurityPwdFailBack)
    };
    _getSecurityPwdSuccessBack = (json) => {
        // console.log("getSecurityPwd成功:" + JSON.stringify(json));
        this.setState({imgUrl: json})
    };
    _getSecurityPwdFailBack = (json) => {
        console.log("getSecurityPwd失败:" + JSON.stringify(json));
    };
    handleYzm = (YzmMsg) => {
        this.setState({verificationCode: YzmMsg})
    };

    handleChangeOldPwd = (msg) => {
        this.setState({password: msg});
    };
    handleChangeNewPwd = (msg) => {
        this.setState({newPassword: msg});
    };
    handleChangeAgainPwd = (msg) => {
        this.setState({againPwd: msg});
    };

    componentWillMount() {
        //
        // this.getSecurityPwd();
    }

    //失去焦点
    loadBlur=(input)=> {
        input.blur()
    }

    render() {
        return (
            <View style={styles.modalRightView}>
                    <View style={styles.container}>
                        <View style={styles.content}>
                            <View style={styles.row}>
                                <Text style={styles.text}>当前密码</Text>
                                <TextInput placeholder='请输入当前密码' placeholderTextColor='#AAAAA8'
                                           style={styles.textInput}
                                           value={this.state.password} secureTextEntry={true}
                                           onChangeText={this.handleChangeOldPwd}
                                           ref={(c)=>this.password=c}
                                           onEndEditing={()=>{this.loadBlur(this.password)}}
                                />
                            </View>

                            <View style={styles.row}>
                                <Text style={styles.text}>新密码</Text>
                                <TextInput placeholder='请输入新密码' placeholderTextColor='#AAAAA8' style={styles.textInput}
                                           value={this.state.newPassword} secureTextEntry={true}
                                           onChangeText={this.handleChangeNewPwd}
                                           ref={(c)=>this.newPassword=c}
                                           onEndEditing={()=>{this.loadBlur(this.newPassword)}}
                                />
                            </View>

                            <View style={styles.row}>
                                <Text style={styles.text}>确认密码</Text>
                                <TextInput placeholder='请再次输入新密码' placeholderTextColor='#AAAAA8'
                                           style={styles.textInput} value={this.state.againPwd} secureTextEntry={true}
                                           onChangeText={this.handleChangeAgainPwd}
                                           ref={(c)=>this.againPwd=c}
                                           onEndEditing={()=>{this.loadBlur(this.againPwd)}}
                                />
                            </View>


                            {
                                this.state.isOpenCaptcha
                                    &&
                                <View style={styles.row}>
                                    <Text style={styles.text}>验证码</Text>
                                    <TextInput style={styles.textInputYzm}
                                               placeholder='请输入验证码' placeholderTextColor='#AAAAA8'
                                               value={this.state.verificationCode}
                                               onChangeText={this.handleYzm}
                                               ref={(c)=>this.verificationCode=c}
                                               onEndEditing={()=>{this.loadBlur(this.verificationCode)}}
                                    />
                                    <TouchableBounce onPress={this.getSecurityPwd}>
                                        <FastImage source={{uri: 'data:image/png;base64,' + this.state.imgUrl}}
                                               style={{
                                                   width: 78 * UIMacro.WIDTH_PERCENT,
                                                   height: 33 * UIMacro.HEIGHT_PERCENT,
                                                   marginLeft: 11 * UIMacro.WIDTH_PERCENT
                                               }}/>
                                    </TouchableBounce>
                                </View>
                            }


                            <View style={{justifyContent: 'center',alignItems:'center',width:333*UIMacro.WIDTH_PERCENT,height:47*UIMacro.HEIGHT_PERCENT,marginTop: (16 - 8) * UIMacro.HEIGHT_PERCENT,}}>
                            <TouchableBounce onPress={this.updateLoginPassword} style={styles.btnLog}>
                                <FastImage style={{height: 41.5 * UIMacro.HEIGHT_PERCENT, width: 117.5 * UIMacro.WIDTH_PERCENT}}
                                                 resizeMode='contain'
                                                 source={require('../../static/images/2.1.0/btn_general.webp')}>
                                    <Text style={styles.log}>修改</Text>
                                </FastImage>
                            </TouchableBounce>
                            </View>
                        </View>
                    </View>
                {/*提示框*/}
                <Toast
                    ref="toast"
                    style={{backgroundColor:
                            'white',marginTop:230*UIMacro.HEIGHT_PERCENT,}}
                    fadeInDuration={0}
                    fadeOutDuration={500}
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
        marginTop: 35 * UIMacro.HEIGHT_PERCENT,
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
        fontSize: 14,
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
    textInputYzm: {
        fontSize: 12,
        backgroundColor: SkinsColor.bgTextViewStyle_bg,
        height: 33 * UIMacro.HEIGHT_PERCENT,
        width: 119 * UIMacro.WIDTH_PERCENT,
        borderRadius: 5,
        padding: 0,
        paddingLeft: 10 * UIMacro.WIDTH_PERCENT,
        color: '#fff',
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
    modalRightView: {
        width: 335 * UIMacro.WIDTH_PERCENT,
        height: 285 * UIMacro.HEIGHT_PERCENT,
        borderRadius: 5,
        borderWidth:1,
        borderColor:SkinsColor.bgTextViewStyle_border,
        backgroundColor: 'rgba(0, 0, 0, .2)',
        marginTop: 10 * UIMacro.HEIGHT_PERCENT,
    },

});