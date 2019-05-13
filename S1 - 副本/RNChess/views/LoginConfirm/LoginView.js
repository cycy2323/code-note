import React, {Component} from 'react'
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    Linking,
    AsyncStorage,
    DeviceEventEmitter
} from 'react-native'
import CheckBox from 'react-native-checkbox'
import GBNetWorkService from '../../core/GBNetWorkService'
import GBServiceParam from "../../core/GBServiceParam";
import UserInfo from '../../core/UserInfo' ;
import Toast from '../../common/ToastView' ;
import UIMacro from "../../core/UIMacro";
import JPushModule from 'jpush-react-native';
import TouchableBounce from '../../common/TouchableBounce'
import SkinsColor from "../../core/SkinsColor";
import FastImage from 'react-native-fast-image'

export default class LoginView extends Component {
    state = {
        userName: '',
        userPwd: '',
        yzm:'',
        isChecked: true,
        checkedStatus:'',
        modalVisible: false,
        isOpenCaptcha: false,
        checkName: '',
        checkPwd: '',
        data: '',
        imgUrl: '',
        isOpenCha: false,
        isSuccess: false,
        showLoading: false,
        userNameChange:false,
        isShowBindPhone:false,
        regCode:'',
    };

    /*登录接口*/
    passportLogin = () => {
        let url = 'passport/login.html';
        let params;
        if (this.props.isRegSuccess) {
            params = {'username': this.props.userName, 'password': this.props.userPwd};
        } else {
            // this.loadingView.showAnimation(); //执行loading
            params = {'username': this.state.userName, 'password': this.state.userPwd,'captcha':this.state.yzm};
        }
        this.props.showLoading1();
        GBNetWorkService.post(url, params, null, this._successBack, this._failBack)
    };
    _successBack = (json, headers) => {
        console.log('loginsuccess', json);
        this.props.resetSuccess();
        if (json.success === false) {
            //关闭loading
            // this.loadingView.dismissAnimation();
            this.props.showloading2();
            this._deakLoginFailResult(json);
            if (this.state.isOpenCha) {
                //开启验证码
                // //登录输错密码之后获取登录验证码
                this._getVerificationCode()
            }

        } else {
            GBServiceParam.currentCookie = headers["Set-Cookie"];
            JPushModule.setAlias(this.state.userName,success => {});

            //获取用户信息
            GBNetWorkService.get('mobile-api/userInfoOrigin/getUserInfo.html', null, null, this.successGetUserInfo,
                this.failGetUserInfo);
            //记住密码
            if(this.state.isChecked) {
                let keyValuePairs = [['userName', this.state.userName], ['userPwd', this.state.userPwd]];
                AsyncStorage.multiSet(keyValuePairs, (errs) => {
                    if (errs) {
                        return
                    }
                })
            }else{
                let keyValuePairs = [['userName', ''], ['userPwd', '']];
                AsyncStorage.multiSet(keyValuePairs, (errs) => {
                    if (errs) {
                        return
                    }
                })
            }
        }
    };
    //处理登录失败的情况
    _deakLoginFailResult=(result)=>{
        if (result.message != null){
            if (result.message == "账号被冻结"){
                this.showToast("您的账号已被冻结,请联系客服")
            } else if (result.message == "账号被停用"){
                this.showToast("您账户已被停用,暂不支持登录")
            }else {
                this.showToast(result.message+'用户名或密码错误')
            }
        }else if (result.propMessages != null) {
            if (result.propMessages.captcha.length>0){
                this.showToast(result.propMessages.captcha);
            }
        }
        this.setState({isOpenCha: result.isOpenCaptcha})
    }
    //清除本地储存
    clear = () => {
        let _that = this;
        AsyncStorage.clear(function(err){
            if(!err){
                _that.setState({
                    userName: "",
                    userPwd: ""
                });
            }
        });
    }

    /*获取用户信息*/
    successGetUserInfo = (json) => {
        this.props.showloading2();
        this.props.closeLoginConfirm()
        console.log('rn_login_success',json);
        //发送登录成功的通知
        DeviceEventEmitter.emit('rn_login_success', json.data.user.username, json.data.user.walletBalance,json.data.user.avatarUrl,
            json.data.user.userSex);
        //发送通知刷新底部数据
        DeviceEventEmitter.emit('rn_login_success_refreshHomeBottom');
        //获取用户名和密码 =》 checkName,checkPwd
        if(json.data && json.data.user){
            UserInfo.autoPay = json.data.user.autoPay;
            UserInfo.isBit = json.data.user.isBit;
            UserInfo.isCash = json.data.user.isCash;
            UserInfo.totalAssets = json.data.user.totalAssets;
            UserInfo.walletBalance = json.data.user.walletBalance;
            UserInfo.withdrawAmount = json.data.user.withdrawAmount;
            UserInfo.transferAmount = json.data.user.transferAmount;
            UserInfo.preferentialAmount = json.data.user.preferentialAmount;
            UserInfo.btc = json.data.user.btc;
            UserInfo.bankcard = json.data.user.bankcard;
            UserInfo.recomdAmount = json.data.user.recomdAmount;
            UserInfo.username = json.data.user.username;
            UserInfo.avatarUrl = {uri:json.data.user.avatarUrl};
            UserInfo.lastLoginTime = json.data.user.lastLoginTime;
            UserInfo.loginTime = json.data.user.loginTime;
            UserInfo.currency = json.data.user.currency;
            UserInfo.realName = json.data.user.realName;
            if (json.data.user.realName !== null && json.data.user.realName.length > 0) {
                UserInfo.hasRealName = true;
            }
            UserInfo.userSex = json.data.user.userSex;
            UserInfo.bankList = json.data.bankList;
        }
        UserInfo.isLogin = json.success;

        if (this.state.isChecked) {
            let keyValuePairs = [['userName', this.state.userName], ['userPwd', this.state.userPwd]];
            AsyncStorage.multiSet(keyValuePairs, (errs) => {
                if (errs) {
                    return
                }
            });
        } else {
            let keyValuePairs = [['userName', ''], ['userPwd', '']]
            AsyncStorage.multiSet(keyValuePairs, (errs) => {
                if (errs) {
                    return
                }
            })
        }

        //用户信息获取成功后获取用户是否设置安全密码及真实姓名
        this.initSafePassword();
    };

    /*判断是否设置过安全密码*/
    initSafePassword = () => {
        GBNetWorkService.get("mobile-api/mineOrigin/initSafePassword.html", null, null, this._initSafeSuccessBack, this._initSafeFailBack)
    };
    _initSafeSuccessBack = (json) => {
        if (json.success && json.data) {
            UserInfo.hasPermissionPwd = json.data.hasPermissionPwd;
            UserInfo.hasRealName = json.data.hasRealName;
        }
        console.log("initSafeFailBack成功:" + JSON.stringify(json));
    };
    _initSafeFailBack = (json) => {
        console.log("initSafeFailBack失败:" + JSON.stringify(json))
    };
    failGetUserInfo = (json) => {
        //登录成功关闭整个弹窗
        this.props.closeLoginConfirm()
    };
    _failBack = (json) => {
        this.props.showloading2();
    };

    /*登录输错密码之后获取登录验证码*/
    _getVerificationCode = () => {
        let timeStr = new Date().getTime();
        let params = {timeStr: timeStr};
        GBNetWorkService.post('captcha/code.html', params, null, this.successCapCha, this.failCapCha)
    };
    successCapCha = (json) => {
        this._isMounted&&this.setState({imgUrl: json})
    };
    failCapCha = (json) => {
        console.log(json);
    };

    componentWillMount() {
        //注册成功跳登录
        if (this.props.isRegSuccess) {
            this._isMounted&&this.setState({
                userName:this.props.userName,
                userPwd:this.props.userPwd,
            });
            if(this.state.isChecked){
                let keyValuePairs = [['userName', this.props.userName], ['userPwd', this.props.userPwd]];
                AsyncStorage.multiSet(keyValuePairs, (errs) => {
                    if (errs) {
                        return
                    }

                })
            }else{
                let keyValuePairs = [['userName', ''], ['userPwd', '']]
                AsyncStorage.multiSet(keyValuePairs, (errs) => {
                    if (errs) {
                        return
                    }

                })
            }
            this.passportLogin()
        }
    }

    componentWillUnmount() {
        this._isMounted = false
    }

    componentDidMount() {
        this._isMounted = true;

        //用户登录是否开启验证码
        let url = 'mobile-api/mineOrigin/loginIsOpenVerify.html';
        GBNetWorkService.get(url, null, null, this.successIsOpenVerify, this.failIsOpenVerify);

        // 取存储的记住密码状态 并保存data
        AsyncStorage.getItem('isChecked').then((value) => {
            const jsonValue = JSON.parse(value);
            this._isMounted&&this.setState({
                isChecked: jsonValue,
            },this.getLocal)
        })
        if(this.props.isRegSuccess){
            this.setState({isOpenCha:false,isOpenCaptcha:false})
        }
        // //登录失败后关闭弹窗再次打开重新获取验证码
        // this._getVerificationCode()
    };

    // 获取本地账号密码
    getLocal = () => {
        let that = this;
        if(this.state.isChecked){
            // AsyncStorage本地存储  记住密码
            let keys = ['userName', 'userPwd'];
            AsyncStorage.multiGet(keys, (errs, result) => {
                if (errs) {
                    return
                }
                that.setState({
                    userName: (result[0][1] != null) ? result[0][1] : '',
                    userPwd: (result[1][1] != null) ? result[1][1] : ''
                })
            })
        }
    };
    successIsOpenVerify = (json) => {
        console.log('是否开户验证码', json);
        this._isMounted&&this.setState({
            isOpenCaptcha: json.data.isOpenCaptcha
        })
        this.state.isOpenCaptcha && this._getVerificationCode()
    };
    failIsOpenVerify = (json) => {
        console.log('失败' + JSON.stringify(json))
    };

    //保存用户名
    handleChangeName = (msg) => {
        this._isMounted&&this.setState({userName: msg});
    };
    handleChangeYzm = (msg) => {
        this._isMounted&&this.setState({yzm: msg});
    };
    //保存密码
    handleChangePwd = (msg) => {
        this._isMounted&&this.setState({userPwd: msg});
    };
    changeChecked = () =>{
        if (this.state.isChecked === true) {
            this._isMounted&&this.setState({isChecked: false})
        } else {
            this._isMounted&&this.setState({isChecked: true})
        }
    }
    //记住密码
    handleValueChange = () => {
        (async ()=>{
            await this.changeChecked()
            // 保存记住密码状态
            AsyncStorage.setItem('isChecked', JSON.stringify(this.state.isChecked));

        })()
    };
    //找回密码
    handleRetrievePassword = () => {
        /*判断是否显示绑定手机*/
        GBNetWorkService.get("mobile-api/findPasswordOrigin/openFindByPhone.html", null, null, this.successShowBindPhone, this.failShowBindPhone)
        this.props.showLoading1();
    };
    successShowBindPhone=(json)=> {
        console.log('是否显示绑定手机',json);
        this.props.showloading2();
        if(json.code==='0'){
            this.setState({
                isShowBindPhone:json.data==='1' ? true : false,
            },()=>{
                if (this.state.isShowBindPhone){
                    // this.props.setFindPword()
                    this.props.isShowBindPhoneNum(this.state.isShowBindPhone)
                    this.props.getUsername(this.state.userName)
                } else {
                    this.props.setNoBindPhone()
                }
            })
        }
    }

    failShowBindPhone=(json)=>{
        console.log('failShowBindPhone'+JSON.stringify(json))
        this.props.showloading2();
    }

    showToast = (msg) =>{
        let tip=msg || this.state.data;
        this.refs.toast.show(tip)
    }
    handleLoginGo = () => {
        if (!this.state.userName) {
            this.showToast('请输入用户名')
            return
        }
        if (!this.state.userPwd) {
            this.showToast('请输入密码')
            return
        }
        if (!this.state.yzm && (this.state.isOpenCaptcha || this.state.isOpenCha)) {
            this.showToast('请输入验证码')
            return
        }
        this.passportLogin()
    };
    //失去焦点
    loadBlur=(inputAccount)=> {
        inputAccount.blur();
    }

    /*联系客服：跳转到外部浏览器*/
    customerService = () => {
        if (UserInfo.customerUrl&&UserInfo.customerUrl.length>0){
            Linking.openURL(UserInfo.customerUrl);
        } else
        {
            GBNetWorkService.get("mobile-api/origin/getCustomerService.html", null, null, this._customerServiceSuccessBack,
                this._customerServiceFailBack)
        }
    };
    _customerServiceSuccessBack = (json) => {
        console.log("成功:" + JSON.stringify(json));
        if(json.data && json.data.customerUrl){
            Linking.openURL(json.data.customerUrl)
        }
    };
    _customerServiceFailBack = (json) => {
        console.log("失败:" + JSON.stringify(json))
    };

    render() {
        return <View style={styles.container}>
            <View style={styles.content}>
                <View style={styles.row}>
                    <Text style={styles.text}>用户名</Text>
                    <TextInput placeholder="请输入用户名" style={styles.textInput} value={this.state.userName} placeholderTextColor='#ccc'
                               onChangeText={this.handleChangeName}
                               ref={(c)=>this.inputAccount=c}
                               onEndEditing={()=>{this.loadBlur(this.inputAccount)}}
                    />
                </View>
                <View style={styles.row}>
                    <Text style={styles.text}>密码</Text>
                    <TextInput placeholder="请输入密码" style={styles.textInput} value={this.state.userPwd} placeholderTextColor='#ccc'
                               secureTextEntry={true} onChangeText={this.handleChangePwd}
                               ref={(c)=>this.passwordAccount=c}
                               onEndEditing={()=>{this.loadBlur(this.passwordAccount)}}
                    />
                </View>
                {
                    (this.state.isOpenCaptcha || this.state.isOpenCha)
                    &&
                    <View style={styles.row}>
                        <Text style={styles.text}>验证码</Text>
                        <TextInput style={styles.textInputYzm} onChangeText={this.handleChangeYzm}
                                   value={this.state.yzm} placeholderTextColor='#ccc' placeholder="请输入验证码"
                                   ref={(c)=>this.yzmAccount=c}
                                   onEndEditing={()=>{this.loadBlur(this.yzmAccount)}}
                        />
                        <TouchableBounce onPress={this._getVerificationCode}>
                            <FastImage
                                source={{
                                    uri:
                                        'data:image/png;base64,' + this.state.imgUrl
                                }}
                                style={{height: 33 * UIMacro.HEIGHT_PERCENT, width: 78 * UIMacro.WIDTH_PERCENT,}}/>
                        </TouchableBounce>
                    </View>
                }
                <View style={styles.bottomPassword}>
                    <CheckBox checked={this.state.isChecked} label={''}
                              checkedImage={require('../../static/images/2.1.0/select2.png')}
                              uncheckedImage={require('../../static/images/2.1.0/unselect2.png')}
                              checkboxStyle={{width: 14, height: 14, marginLeft: 10, marginTop: 4, marginRight: 5}}
                              onChange={this.handleValueChange}
                    />
                    <Text style={styles.remember}>记住密码</Text>
                    <TouchableBounce onPress={this.handleRetrievePassword} style={{marginLeft: 28 * UIMacro.WIDTH_PERCENT}}>
                        <Text style={styles.remember}>找回密码</Text>
                    </TouchableBounce>
                </View>
                <TouchableBounce onPress={this.handleLoginGo} style={styles.btnLog}>
                        <FastImage style={{height: 41 * UIMacro.HEIGHT_PERCENT, width: 118 * UIMacro.WIDTH_PERCENT,}}
                                         resizeMode='stretch'
                                         source={require('../../static/images/2.1.0/btn_general.webp')}>
                            <Text style={styles.log}>登录</Text>
                        </FastImage>
                </TouchableBounce>
                <View style={styles.kefuView}>
                    <Text style={styles.kefuText}>如有任何问题疑问, 请联系</Text>
                    <TouchableBounce onPress={this.customerService}>
                        <Text style={styles.zxkefu}>在线客服</Text>
                    </TouchableBounce>
                </View>
            </View>
            <Toast
                ref="toast"
                style={{backgroundColor: 'white',marginTop:200*UIMacro.HEIGHT_PERCENT}}
                fadeInDuration={300}
                fadeOutDuration={1000}
                opacity={0.8}
                textStyle={{color: 'black'}}
            />
        </View>
    }
}

const styles = StyleSheet.create({
    container: {
        width: UIMacro.WIDTH_PERCENT * 335,
        height: UIMacro.HEIGHT_PERCENT * 285,
    },
    content: {
        alignItems: 'flex-end',
        marginTop: 18 * UIMacro.HEIGHT_PERCENT,
    },
    row: {
        flexDirection: 'row',
        marginBottom: 8 * UIMacro.HEIGHT_PERCENT,
        alignItems: 'center',
        marginRight: 38 * UIMacro.WIDTH_PERCENT,
    },
    text: {
        color: '#fff',
        fontSize: 14,
        textAlign: 'right',
    },
    textInput: {
        marginLeft: 10 * UIMacro.WIDTH_PERCENT,
        backgroundColor: SkinsColor.textInput_bg,
        height: 33 * UIMacro.HEIGHT_PERCENT,
        width: 208 * UIMacro.WIDTH_PERCENT,
        borderRadius: 5,
        fontSize: 12,
        color: '#fff',
        padding: 0,
        paddingLeft: 10,
        borderWidth: 1,
        borderColor: SkinsColor.textInput_border,
    },
    textInputYzm: {
        marginLeft: 10 * UIMacro.WIDTH_PERCENT,
        fontSize: 12,
        backgroundColor: SkinsColor.textInput_bg,
        height: 33 * UIMacro.HEIGHT_PERCENT,
        width: 125 * UIMacro.WIDTH_PERCENT,
        borderRadius: 5,
        padding: 0,
        paddingLeft: 10 * UIMacro.WIDTH_PERCENT,
        color: '#fff',
        borderWidth: 1,
        borderColor: SkinsColor.textInput_border,
        marginRight: 5 * UIMacro.WIDTH_PERCENT
    },
    bottomPassword: {
        flexDirection: 'row',
        paddingLeft: 80 * UIMacro.WIDTH_PERCENT,
        width: UIMacro.WIDTH_PERCENT * 333,
        alignItems: 'center'
    },
    remember: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    btnLog: {
        marginTop: 11 * UIMacro.HEIGHT_PERCENT,
        width: UIMacro.WIDTH_PERCENT * 333,
        alignItems: 'center',
    },
    log: {
        fontSize: 15,
        textAlign: 'center',
        color: '#fff',
        fontWeight: 'bold',
        height: 41 * UIMacro.HEIGHT_PERCENT,
        lineHeight: 41 * UIMacro.HEIGHT_PERCENT
    },
    kefuView:{
        flexDirection: 'row',
       width:174*UIMacro.WIDTH_PERCENT,
       height:15*UIMacro.HEIGHT_PERCENT,
        position:'absolute',
        right:10 * UIMacro.HEIGHT_PERCENT,
        top:240* UIMacro.WIDTH_PERCENT,
    },
    kefuText:{
        fontSize:11,
        color:'#fff',
    },
    zxkefu:{
        fontSize:11,
        color:'#FFEA00',
        borderBottomWidth: 1,
        borderBottomColor:'#FFEA00',
    },
});