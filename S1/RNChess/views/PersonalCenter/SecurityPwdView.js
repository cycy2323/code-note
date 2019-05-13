/**
 * @author
 *  Chester
 * @remark 安全中心 三级菜单 修改安全密码
 */

import React, {Component} from 'react'
import {
    View,
    Text,
    Image,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    ImageBackground, Keyboard
} from 'react-native'
import GBNetWorkService from "../../core/GBNetWorkService";
import UserInfo from "../../core/UserInfo";
import Toast from '../../common/ToastView' ;
import UIMacro from "../../core/UIMacro";
import TouchableBounce from "../../common/TouchableBounce";
import SkinsColor from "../../core/SkinsColor";
import FastImage from 'react-native-fast-image';

const BORDER_WIDTH = 2;

export default class SecurityPwdView extends Component {
    state = {
        userName: '',
        oldPwd: '',
        newPwd: '',
        againPwd: '',
        imgUrl: '',
        verificationCode: '',
        realNameModalVisible: false,
        realName: '',
        YZMShow:false,
    };

    /*调用修改安全密码的API接口*/
    changeSecurityPwd = () => {
        if(!UserInfo.hasRealName){
            this.props.setRealNameVisible(true)
            return
        }
        /*正则校验*/
        // let regPwd = /^[a-zA-Z0-9_]{6,20}$/;
        if (!this.state.oldPwd && UserInfo.hasPermissionPwd) {
            this.refs.toast.show('请输入当前密码');
            return
        }
        if (!this.state.newPwd) {
            this.refs.toast.show('请输入新密码');
            return
        }
        if (!this.state.againPwd) {
            this.refs.toast.show('请再次输入新密码');
            return
        }
        if (this.state.newPwd !== this.state.againPwd ) {
            this.refs.toast.show('两次密码输入不一致');
            return
        }
        if (this.state.YZMShow){
            if (!this.state.verificationCode && UserInfo.hasPermissionPwd) {
                this.refs.toast.show('验证码不能为空');
                return
            }
        }

        console.log('UserInfo.realName', UserInfo.realName);
        let param = {
            'realName': UserInfo.realName,
            'originPwd': this.state.oldPwd,
            'pwd1': this.state.newPwd,
            'pwd2': this.state.againPwd,
            'code': this.state.verificationCode
        };

        GBNetWorkService.post("mobile-api/mineOrigin/updateSafePassword.html", param, null, this._successBack, this._failBack)
    };
    _successBack = (json) => {
        if (parseInt(json.code)!=0){
            //设置不成功
            this.refs.toast.show(json.message);
            if (json.data.isOpenCaptcha){
                this.getSecurityPwd();
            }
            this.setState({
                YZMShow:json.data.isOpenCaptcha,
            })

        }else {
            this.refs.toast.show("设置成功");
            UserInfo.hasPermissionPwd = true ;
            this.timer = setTimeout(() => {
                this.props.closeSecurityView()
            }, 500);

        }
    };
    _failBack = (json) => {
        this.getSecurityPwd()
        console.log("securityPwd设置失败！" + JSON.stringify(json));
    };

    /*获取安全密码验证码*/
    getSecurityPwd = () => {
        let date = new Date().getTime();
        let param = {'timeStr': date};
        GBNetWorkService.post("captcha/securityPwd.html", param, null, this._getSecurityPwdSuccessBack, this._getSecurityPwdFailBack)
    };
    _getSecurityPwdSuccessBack = (json) => {
        this.setState({imgUrl: json})
    };
    _getSecurityPwdFailBack = (json) => {
        console.log("获取验证码图片失败:" + JSON.stringify(json));
    };
    handleYzm = (YzmMsg) => {
        this.setState({verificationCode: YzmMsg})
    };

    handleChangeName = (msg) => {
        this.setState({userName: msg});
    };
    handleChangeOldPwd = (msg) => {
        this.setState({oldPwd: msg});
    };
    handleChangeNewPwd = (msg) => {
        this.setState({newPwd: msg});
    };
    handleChangeAgainPwd = (msg) => {
        this.setState({againPwd: msg});
    };


    showRealName=()=>{
        if(!UserInfo.hasRealName){
            this.dissmissKeyboard();
            this.props.setRealNameVisible(true);
        }
    }

    componentDidMount(){
        this.getSecurityPwd()
    }

    componentWillMount() {
        //监听键盘弹出事件
        this.keyboardDidShowListener = Keyboard.addListener(
            "keyboardDidShow",
            this.keyboardDidShowHandler.bind(this)
        );
        //监听键盘隐藏事件
        this.keyboardDidHideListener = Keyboard.addListener(
            "keyboardDidHide",
            this.keyboardDidHideHandler.bind(this)
        );
    }

    componentWillUnmount() {
        //卸载键盘弹出事件监听
        if (this.keyboardDidShowListener != null) {
            this.keyboardDidShowListener.remove();
        }
        //卸载键盘隐藏事件监听
        if (this.keyboardDidHideListener != null) {
            this.keyboardDidHideListener.remove();
        }
        this.timer && clearTimeout(this.timer);
    }

    //键盘弹出事件响应
    keyboardDidShowHandler=(event)=> {
        this.setState({ KeyboardShown: true });
    }

    //键盘隐藏事件响应
    keyboardDidHideHandler=(event)=> {
        this.setState({ KeyboardShown: false });
    }

    //强制隐藏键盘
    dissmissKeyboard=()=> {
        Keyboard.dismiss();
    }

    //失去焦点
    loadBlur=(input)=> {
        input.blur()
    }

    render() {
        return (
            <View style={styles.modalRightView}>
                    <View style={styles.container}>
                        {/*判断是否设置过安全密码*/}
                        {
                            UserInfo.hasPermissionPwd
                            &&
                            <View style={styles.content}>

                                <View style={styles.row}>
                                    <Text style={styles.text}>当前密码</Text>
                                    <TextInput placeholder='请输入当前密码' placeholderTextColor='#AAAAA8'
                                               style={styles.textInput}
                                               value={this.state.oldPwd} secureTextEntry={true}
                                               onChangeText={this.handleChangeOldPwd}
                                               ref={(c)=>this.oldPwd=c}
                                               onEndEditing={()=>{this.loadBlur(this.oldPwd)}}
                                    />
                                </View>

                                <View style={styles.row}>
                                    <Text style={styles.text}>新密码</Text>
                                    <TextInput placeholder='请输入新密码' placeholderTextColor='#AAAAA8'
                                               style={styles.textInput}
                                               value={this.state.newPwd} secureTextEntry={true}
                                               onChangeText={this.handleChangeNewPwd}
                                               ref={(c)=>this.newPwd=c}
                                               onEndEditing={()=>{this.loadBlur(this.newPwd)}}
                                    />
                                </View>

                                <View style={styles.row}>
                                    <Text style={styles.text}>确认密码</Text>
                                    <TextInput placeholder='请再次输入新密码' placeholderTextColor='#AAAAA8'
                                               style={styles.textInput} value={this.state.againPwd}
                                               secureTextEntry={true}
                                               onChangeText={this.handleChangeAgainPwd}
                                               ref={(c)=>this.againPwd=c}
                                               onEndEditing={()=>{this.loadBlur(this.againPwd)}}
                                    />
                                </View>
                                {this._YZMView()}
                                <View style={{justifyContent: 'center',alignItems:'center',width:333*UIMacro.WIDTH_PERCENT,height:47*UIMacro.HEIGHT_PERCENT,marginTop: (16 - 8) * UIMacro.HEIGHT_PERCENT,}}>
                                <TouchableBounce onPress={this.changeSecurityPwd} style={styles.btnLog}>
                                    <FastImage style={{height: 47 * UIMacro.HEIGHT_PERCENT, width: 145 * UIMacro.WIDTH_PERCENT,}}
                                                     resizeMode='stretch'
                                                     source={require('../../static/images/2.1.0/btn_general.webp')}>
                                        <Text style={styles.log}>修改</Text>
                                    </FastImage>
                                </TouchableBounce>
                                </View>
                            </View>
                        }
                        {
                            !UserInfo.hasPermissionPwd
                            &&
                            <View style={styles.content}>
                                <View style={styles.row}>
                                    <Text style={styles.text}>密码</Text>
                                    <TextInput placeholder='请输入新密码' placeholderTextColor='#AAAAA8'
                                               style={styles.textInput}
                                               value={this.state.newPwd} secureTextEntry={true}
                                               onChangeText={this.handleChangeNewPwd}
                                               ref={(c)=>this.newPwd1=c}
                                               onEndEditing={()=>{this.loadBlur(this.newPwd1)}}
                                               onFocus={()=>this.showRealName()}
                                    />
                                </View>

                                <View style={styles.row}>
                                    <Text style={styles.text}>确认密码</Text>
                                    <TextInput placeholder='请再次输入新密码' placeholderTextColor='#AAAAA8'
                                               style={styles.textInput} value={this.state.againPwd}
                                               secureTextEntry={true}
                                               onChangeText={this.handleChangeAgainPwd}
                                               onFocus={()=>this.showRealName()}
                                               ref={(c)=>this.againPwd1=c}
                                               onEndEditing={()=>{this.loadBlur(this.againPwd1)}}
                                    />
                                </View>

                                <View style={{justifyContent: 'center',alignItems:'center',width:333*UIMacro.WIDTH_PERCENT,height:47*UIMacro.HEIGHT_PERCENT,marginTop: (16 - 8) * UIMacro.HEIGHT_PERCENT,}}>
                                <TouchableBounce onPress={this.changeSecurityPwd} style={styles.btnLog}>
                                    <FastImage style={{height: 41.5 * UIMacro.HEIGHT_PERCENT, width: 117.5 * UIMacro.WIDTH_PERCENT,}}
                                                     resizeMode='contain'
                                                     source={require('../../static/images/2.1.0/btn_general.webp')}>
                                        <Text style={styles.log}>确认</Text>
                                    </FastImage>
                                </TouchableBounce>
                                </View>
                            </View>
                        }
                    </View>
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
    _YZMView=()=>{
        let  array=[];
        console.log("获取到的验证码东西："+this.state.YZMShow)
        if (this.state.YZMShow){
            array.push(<View style={styles.row} key={'yzmView'}>
                <Text style={styles.text}>验证码</Text>
                <TextInput style={styles.textInputYzm}
                           placeholder='请输入验证码' placeholderTextColor='#AAAAA8'
                           value={this.state.verificationCode}
                           onChangeText={this.handleYzm}
                           ref={(c)=>this.verificationCode=c}
                           onEndEditing={()=>{this.loadBlur(this.verificationCode)}}
                />
                <TouchableOpacity onPress={this.getSecurityPwd}>
                    <FastImage source={{uri: 'data:image/png;base64,' + this.state.imgUrl}}
                           style={{
                               width: 78 * UIMacro.WIDTH_PERCENT,
                               height: 33 * UIMacro.HEIGHT_PERCENT,
                               marginLeft: 11 * UIMacro.WIDTH_PERCENT
                           }}/>
                </TouchableOpacity>
            </View>)
        }
        return array;

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
        backgroundColor: SkinsColor.bgTextViewStyle_bg,
        height: 33 * UIMacro.HEIGHT_PERCENT,
        width: 119 * UIMacro.WIDTH_PERCENT,
        borderRadius: 5,
        color: '#fff',
        padding: 0,
        paddingLeft: 10,
        borderWidth: 1,
        fontSize: 12,
        borderColor: SkinsColor.bgTextViewStyle_border
    },
    btnLog: {
        width: 145 * UIMacro.WIDTH_PERCENT,
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