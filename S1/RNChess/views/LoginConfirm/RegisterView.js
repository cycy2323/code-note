import React, {Component} from 'react'
import {
    View, Text, StyleSheet, FlatList,
     TextInput, DeviceEventEmitter
} from 'react-native'

import ModalDropdown from 'react-native-modal-dropdown'
import CheckBox from 'react-native-checkbox'
import GBNetWorkService from '../../core/GBNetWorkService'
import Toast from "../../common/ToastView";
import GBServiceParam from "../../core/GBServiceParam";
import DatePicker from 'react-native-datepicker';
import UIMacro from "../../core/UIMacro";
import UserInfo from "../../core/UserInfo";
import TouchableBounce from '../../common/TouchableBounce'
import SkinsColor from "../../core/SkinsColor";
import FastImage from 'react-native-fast-image'

export default class RegisterView extends Component {
    state = {
        field: '',   //list
        securityIssues: '',
        sex: '',
        regCode: '', username: '', userPwd: '', configPwd: '', realName: '', phone: '', qq: '',
        answer: '', weChart: '', verificationCode: '', email: '', paymentPassword: '', againpassword: '',
        phoneCode: '', recommendRegisterCode: null,
        dataResult: '',
        msg: '请选择安全问题', msgValue: '', data: [],
        agree: '',
        isChecked: true,
        isShow: true,
        isBlock: true,
        isNone: true,
        isPwdBlock: true,
        isPwdNone: true,
        disabled: false,
        modalVisible: false,
        agreeModalVisible: false,
        imgUrl: '',
        requiredJson: [],
        isLogin: false,
        isRegister: false,
        message: '',
        msgModalVisible: false,
        language: '简体中文', languageData: '', languageArr: [], languageValue: 'zh_CN',
        mainCurrency: '人民币', mainCurrencyValue: 'CNY', mainCurrencyData: '', mainCurrencyArr: [],
        sexItem: '请选择性别', sexData: '', sexArr: [], sexValue: '',
        timezone: '', timezoneData: [],
        date: '',//生日
        second: 60,
        text: '获取验证码',
        stateCode: '',
        requiredJsonArr: [],
        isPhone: false,
    };

    /*注册*/
    handleRegister = () => {
        //正则
        let resetUname = /^[a-zA-Z0-9]{4,15}$/
        let resetPwd = /^([a-z0-9\.\@\!\#\$\%\^\&\*\(\)]){6,20}$/i
        let resetPayment = /^\d{6}$/
        if ('username' in this.state.requiredJsonArr && !this.state.username) {
            this.refs.toast.show('请输入用户名');
            return
        } else if (!resetUname.test(this.state.username)) {
            this.refs.toast.show('4-15位数字和字母');
            return
        }
        if ('password' in this.state.requiredJsonArr && !this.state.userPwd) {
            this.refs.toast.show('请输入密码');
            return
        } else if (!resetPwd.test(this.state.userPwd)) {
            this.refs.toast.show("6-20位数字、字符及特殊符号")
            return
        }
        if ('password' in this.state.requiredJsonArr && !this.state.configPwd) {
            this.refs.toast.show('请再次输入密码');
            return
        } else if (this.state.configPwd !== this.state.userPwd) {
            this.refs.toast.show('两次密码输入不一致！');
            return
        }
        if ("regCode" in this.state.requiredJsonArr && !this.state.regCode) {
            this.refs.toast.show('请输入推荐码');
            return
        }
        if ("realName" in this.state.requiredJsonArr && !this.state.realName) {
            this.refs.toast.show('请输入真实姓名')
            return
        }
        if ("110" in this.state.requiredJsonArr && !this.state.phone) {
            this.refs.toast.show('请输入手机号码')
            return
        }
        if (this.state.isPhone === true && "110" in this.state.requiredJsonArr && !this.state.phoneCode) {
            this.refs.toast.show('请输入手机验证码')
            return
        }
        if ("201" in this.state.requiredJsonArr && !this.state.email) {
            this.refs.toast.show('请输入邮箱')
            return
        }
        if ("301" in this.state.requiredJsonArr && !this.state.qq) {
            this.refs.toast.show('请输入qq号码')
            return
        }
        if ("paymentPassword" in this.state.requiredJsonArr && !this.state.paymentPassword) {
            this.refs.toast.show('请输入6位数字安全密码')
            return
        } else if ("paymentPassword" in this.state.requiredJsonArr && !resetPayment.test(this.state.paymentPassword)) {
            this.refs.toast.show('安全密码必须是6位数字');
            return
        }
        if ("againPassword" in this.state.requiredJsonArr && !this.state.againpassword) {
            this.refs.toast.show('请再次输入安全密码')
            return
        } else if (this.state.paymentPassword !== this.state.againpassword) {
            this.refs.toast.show('两次安全密码输入不一致！');
            return
        }
        if ("sex" in this.state.requiredJsonArr && !this.state.sexValue) {
            this.refs.toast.show('请选择性别')
            return
        }
        if ("birthday" in this.state.requiredJsonArr && !this.state.date) {
            this.refs.toast.show('请选择生日')
            return
        }
        if("securityIssues" in this.state.requiredJsonArr && !this.state.msgValue){
            this.refs.toast.show('请选择安全问题')
            return
        }
        if("securityIssues" in this.state.requiredJsonArr && !this.state.answer){
            this.refs.toast.show('请输入安全问题答案')
            return
        }
        if ("304" in this.state.requiredJsonArr && !this.state.weChart) {
            this.refs.toast.show('请输入微信号码')
            return
        }
        if ("verificationCode" in this.state.requiredJsonArr && !this.state.verificationCode) {
            this.refs.toast.show('请输入验证码');
            return
        }
        if (this.state.isChecked === true) {
            let url = 'mobile-api/registerOrigin/save.html';
            let params = {
                'recommendUserInputCode': GBServiceParam.siteRecommendUserInputCode.length !== 0 ? GBServiceParam.siteRecommendUserInputCode : this.state.regCode,
                'sysUser.username': this.state.username,
                'sysUser.password': this.state.userPwd,
                'confirmPassword': this.state.configPwd,
                'sysUser.birthday': this.state.date,
                'sysUser.sex': this.state.sexItem,
                'sysUser.permissionPwd': this.state.paymentPassword,
                'sysUser.realName': this.state.realName,
                'phone.contactValue': this.state.phone,
                'sysUserProtection.question1': this.state.msgValue,
                'sysUserProtection.answer1': this.state.answer,
                'sysUser.defaultCurrency': this.state.mainCurrencyValue,
                'sysUser.defaultTimezone': this.state.timezone,
                'sysUser.defaultLocale': this.state.languageValue,
                'email.contactValue': this.state.email,
                'qq.contactValue': this.state.qq,
                'weixin.contactValue': this.state.weChart,
                'captchaCode': this.state.verificationCode,
                'confirmPermissionPwd': this.state.againpassword,
                'phoneCode': this.state.phoneCode,
                'editType': '',
                'checkPhone': 'checkPhone',
                'recommendRegisterCode': this.state.recommendRegisterCode,
                'requiredJson': JSON.stringify(this.state.requiredJson),
                'termsOfService': '11',
            };
            console.log("注册参数===", JSON.stringify(params));
            GBNetWorkService.post(url, params, null, this._successBack, this._failBack)
            this.props.showLoading1();
        } else {
            this.refs.toast.show('请选中及已阅读开户条约')
        }
    };
    _successBack = (json) => {
        console.log("获取到的注册数据" + JSON.stringify(json));
        //注册失败信息message
        this.setState({
            isLogin: true,
            isRegister: false
        });
        if (json.success === true) {
            //发送通知
            DeviceEventEmitter.emit('rn_register_success', this.state.isLogin, this.state.isRegister,
                this.state.username, this.state.userPwd, json.success
            );
            this.props.showLoading2();
            console.log('注册成功发送监听:', this.state.username, this.state.userPwd, json.success);
        } else {
            // 提示框 //注册失败信息message
            this.refs.toast.show(json.message)
            //关闭loading
            this.props.showLoading2();
        }
    };
    _failBack = (json) => {
        alert("失败" + JSON.stringify(json))
    };

    /*注册验证码*/
    _getVerificationCode = () => {
        let timeStr = new Date().getTime();
        let params = {timeStr: timeStr};
        GBNetWorkService.post('captcha/pmregister.html', params, null, this._successRegCodeBack, this._failRegCodeBack)
    };
    _successRegCodeBack = (json) => {
        this.setState({imgUrl: json})
    };
    _failRegCodeBack = (json) => {
        console.log("失败" + json)
    };

    //倒计时
    runTimer = () => {
        const codeTime = this.state.second;
        const now = Date.now()
        const overTimeStamp = now + codeTime * 1000 + 100
        /*过期时间戳（毫秒） +100 毫秒容错*/
        this.interval = setInterval(() => {
            /* 切换到后台不受影响*/
            const nowStamp = Date.now()
            if (nowStamp >= overTimeStamp) {
                /* 倒计时结束*/
                this.interval && clearInterval(this.interval);
                this.setState({
                    second: codeTime,
                    text: '获取验证码',
                })
            } else {
                const leftTime = parseInt((overTimeStamp - nowStamp) / 1000, 10)
                this.setState({
                    second: leftTime,
                    text: `${leftTime}s`,
                })
            }
        }, 1000)
    }

    //获取手机验证码
    getPhoneCode = () => {
        let params = {phone: this.state.phone}
        GBNetWorkService.post('mobile-api/origin/sendPhoneCode.html', params, null,
            this.successPhoneCode, this.failPhoneCode)
    }
    successPhoneCode = (json) => {
        if (parseInt(json.code) === 0) {
            this.refs.toast.show('发送成功')
            this.runTimer();
        } else {
            this.refs.toast.show(json.message)
        }
        console.log("手机验证码成功" + JSON.stringify(json))
    }
    failPhoneCode = (json) => {
        console.log("失败" + json)
    }
    /*同意条款*/
    handleAgree = () => {
        this.props.showLoading1()
        let url = 'mobile-api/origin/terms.html';
        GBNetWorkService.post(url, null, null, this._successAgreeBack, this._failAgreeBack);
    };
    _successAgreeBack = (json) => {
        console.log('同意条款', json.data.value)
        this.setState({
            agree: json.data.value
        })
        if (this.state.isChecked === true) {
            this.props.showLoading2()
            this.props.setAgreeItem()
            this.props.setAgreeValue(json.data.value)
        }
    };
    _failAgreeBack = (json) => {
        this.props.showLoading2()
        console.log("失败" + json)
    };

    // 保存输入框内容
    handleChangeTjm = (tjmMsg) => {
        this.setState({regCode: tjmMsg})
    };
    handleChangeUsername = (unameMsg) => {
        this.setState({username: unameMsg})
    };
    handleChangeUserPwd = (upwdMsg) => {
        this.setState({userPwd: upwdMsg})
    };
    handleChangeConfigPwd = (configPwdMsg) => {
        this.setState({configPwd: configPwdMsg})
    };
    handleChangeRealName = (realNameMsg) => {
        this.setState({realName: realNameMsg})
    };
    handleChangePhone = (phoneMsg) => {
        this.setState({phone: phoneMsg})
    };
    handleChangePhoneCode = (phonecode) => {
        this.setState({phoneCode: phonecode})
    };
    handleChangeqq = (qqMsg) => {
        this.setState({qq: qqMsg})
    };
    handleChangeAnswer = (answerMsg) => {
        this.setState({answer: answerMsg})
    };
    handleChangeWeChart = (wechartMsg) => {
        this.setState({weChart: wechartMsg})
    };
    handleChangeEmail = (emailMsg) => {
        this.setState({email: emailMsg})
    }
    handleChangePayment = (paymentPassword) => {
        this.setState({paymentPassword: paymentPassword})
    }
    handleChangeAgainpassword = (againpassword) => {
        this.setState({againpassword: againpassword})
    }
    handleYzm = (YzmMsg) => {
        this.setState({verificationCode: YzmMsg})
    };

    setModalVisible(visible) {
        this.setState({modalVisible: visible})
    }

    handleChangeSafe = () => {
        this.setState({msg: this.state.data})
    };
    handleChangeLanguage = () => {
        this.setState({language: this.state.languageArr})
    }
    handleChangeMainCurrency = () => {
        this.setState({mainCurrency: this.state.mainCurrencyArr})
    }
    handleChangeSex = () => {
        this.setState({sexItem: this.state.sexArr})
    }
    handleBirthday = (date) => {
        this.setState({date: date})
    }
    handleChangeTimezone = () => {
        this.setState({timezone: this.state.timezone})
    }
    //密码框睁眼闭眼
    passwordBlock = () => {
        if (!this.state.isBlock) {
            this.setState({isBlock: true})
        } else {
            this.setState({isBlock: false})
        }
    };
    passwordNone = () => {
        if (!this.state.isNone) {
            this.setState({isNone: true})
        } else {
            this.setState({isNone: false})
        }
    };
    // 确认安全密码眼睛闭眼
    passwordBlock1 = () => {
        if (!this.state.isPwdBlock) {
            this.setState({isPwdBlock: true})
        } else {
            this.setState({isPwdBlock: false})
        }
    };
    passwordNone1 = () => {
        if (!this.state.isPwdNone) {
            this.setState({isPwdNone: true})
        } else {
            this.setState({isPwdNone: false})
        }
    };
    //复选按钮
    handleChecked = () => {
        if (this.state.isChecked === true) {
            this.setState({isChecked: false})
        } else {
            this.setState({isChecked: true})
        }
    };
    // 安全密码眼睛闭眼
    showPwdBlockOrNone1 = (state) => {
        let arr = [], index = 0;
        if (state === true) {
            arr.push(<FastImage key={index} style={{width: 20, height: 20,}}
                            source={require('../../static/images/2.1.0/icon_closed.webp')}/>)
        } else {
            arr.push(<FastImage key={index + 1} style={{width: 20, height: 20}}
                            source={require('../../static/images/2.1.0/icon_show.webp')}/>)
        }
        return arr
    };
    showPwdBlockOrNone2 = (state) => {
        let arr = [], index = 0;
        if (state === true) {
            arr.push(<FastImage key={index} style={{width: 20, height: 20,}}
                            source={require('../../static/images/2.1.0/icon_closed.webp')}/>)
        } else {
            arr.push(<FastImage key={index + 1} style={{width: 20, height: 20}}
                            source={require('../../static/images/2.1.0/icon_show.webp')}/>)
        }
        return arr
    };

    //失去焦点
    loadBlur = (input) => {
        input.blur()
    }

    showList = ({item}) => {
        if (item.name === 'regCode') {
            return <View style={styles.row}>
                <View style={styles.text}>
                    {
                        !('regCode' in this.state.requiredJsonArr) ?
                            <FastImage style={{width: 11 * UIMacro.WIDTH_PERCENT, height: 11 * UIMacro.HEIGHT_PERCENT}}/> :
                            <FastImage source={require('../../static/images/2.1.0/required.webp')}
                                       style={{width: 11 * UIMacro.WIDTH_PERCENT, height: 11 * UIMacro.HEIGHT_PERCENT}}
                            />
                    }
                    <Text style={styles.content}>推荐码</Text>
                </View>
                <TextInput placeholder='请输入推荐邀请码' onChangeText={this.handleChangeTjm} value={this.state.regCode}
                           placeholderTextColor='#AAAAA8' style={styles.textInput}
                           ref={(c) => this.TjmAccount = c}
                           onEndEditing={() => {
                               this.loadBlur(this.TjmAccount)
                           }}
                />
            </View>
        }
        if (item.name === 'username') {
            return <View style={styles.row}>
                <View style={styles.text}>
                    {
                        !('username' in this.state.requiredJsonArr) ?
                            <FastImage style={{width: 11 * UIMacro.WIDTH_PERCENT, height: 11 * UIMacro.HEIGHT_PERCENT}}/> :
                            <FastImage source={require('../../static/images/2.1.0/required.webp')}
                                       style={{width: 11 * UIMacro.WIDTH_PERCENT, height: 11 * UIMacro.HEIGHT_PERCENT}}
                            />
                    }
                    <Text style={styles.content}>用户名</Text>
                </View>
                <TextInput placeholder='4-15位数字和字母' onChangeText={this.handleChangeUsername} value={this.state.username}
                           placeholderTextColor='#AAAAA8' style={styles.textInput}
                           ref={(c) => this.userAccount = c}
                           onEndEditing={() => {
                               this.loadBlur(this.userAccount)
                           }}
                />
            </View>
        }
        if (item.name === 'password') {
            return <View style={styles.row}>
                <View style={styles.text}>
                    {
                        !('password' in this.state.requiredJsonArr) ?
                            <FastImage style={{width: 11 * UIMacro.WIDTH_PERCENT, height: 11 * UIMacro.HEIGHT_PERCENT}}/> :
                            <FastImage source={require('../../static/images/2.1.0/required.webp')}
                                       style={{width: 11 * UIMacro.WIDTH_PERCENT, height: 11 * UIMacro.HEIGHT_PERCENT}}
                            />
                    }
                    <Text style={styles.content}>密码</Text>
                </View>
                <TextInput placeholder='6-20位数字、字符及特殊符号' secureTextEntry={this.state.isBlock}
                           onChangeText={this.handleChangeUserPwd} value={this.state.userPwd}
                           placeholderTextColor='#AAAAA8' style={styles.textInput}
                           ref={(c) => this.passwordAccount = c}
                           onEndEditing={() => {
                               this.loadBlur(this.passwordAccount)
                           }}
                />
                <TouchableBounce style={styles.eyeImage} onPress={this.passwordBlock}>
                    <View>
                        {this.showPwdBlockOrNone1(this.state.isBlock)}
                    </View>
                </TouchableBounce>
            </View>
        }
        if ((item.name === 'configPwd')) {
            return <View style={styles.row}>
                <View style={styles.text}>
                    {
                        !('password' in this.state.requiredJsonArr) ?
                            <FastImage style={{width: 11 * UIMacro.WIDTH_PERCENT, height: 11 * UIMacro.HEIGHT_PERCENT}}/> :
                            <FastImage source={require('../../static/images/2.1.0/required.webp')}
                                       style={{width: 11 * UIMacro.WIDTH_PERCENT, height: 11 * UIMacro.HEIGHT_PERCENT}}
                            />
                    }
                    <Text style={styles.content}>确认密码</Text>
                </View>
                <TextInput placeholder='请再次输入登录密码' secureTextEntry={this.state.isNone}
                           onChangeText={this.handleChangeConfigPwd} value={this.state.configPwd}
                           placeholderTextColor='#AAAAA8' style={styles.textInput}
                           ref={(c) => this.configPwdAccount = c}
                           onEndEditing={() => {
                               this.loadBlur(this.configPwdAccount)
                           }}
                />
                <TouchableBounce style={styles.eyeImage} onPress={this.passwordNone}>
                    {this.showPwdBlockOrNone2(this.state.isNone)}
                </TouchableBounce>
            </View>
        }
        if (item.name === 'realName') {
            return <View style={styles.row}>
                <View style={styles.text}>
                    {
                        !('realName' in this.state.requiredJsonArr) ?
                            <FastImage style={{width: 11 * UIMacro.WIDTH_PERCENT, height: 11 * UIMacro.HEIGHT_PERCENT}}/> :
                            <FastImage source={require('../../static/images/2.1.0/required.webp')}
                                       style={{width: 11 * UIMacro.WIDTH_PERCENT, height: 11 * UIMacro.HEIGHT_PERCENT}}
                            />
                    }
                    <Text style={styles.content}>真实姓名</Text>
                </View>
                <TextInput placeholder='必须与您的银行账户名称相同' placeholderTextColor='#AAAAA8' value={this.state.realName}
                           onChangeText={this.handleChangeRealName} style={styles.textInput}
                           ref={(c) => this.realNameAccount = c}
                           onEndEditing={() => {
                               this.loadBlur(this.realNameAccount)
                           }}
                />
            </View>
        }
        if (item.name === '110') {
            return <View style={styles.row}>
                <View style={styles.text}>
                    {
                        !('110' in this.state.requiredJsonArr) ?
                            <FastImage style={{width: 11 * UIMacro.WIDTH_PERCENT, height: 11 * UIMacro.HEIGHT_PERCENT}}/> :
                            <FastImage source={require('../../static/images/2.1.0/required.webp')}
                                       style={{width: 11 * UIMacro.WIDTH_PERCENT, height: 11 * UIMacro.HEIGHT_PERCENT}}
                            />
                    }
                    <Text style={styles.content}>手机号</Text>
                </View>
                <TextInput placeholder='请输入手机号码' placeholderTextColor='#AAAAA8' value={this.state.phone}
                           onChangeText={this.handleChangePhone} style={styles.textInput}
                           ref={(c) => this.phoneAccount = c}
                           onEndEditing={() => {
                               this.loadBlur(this.phoneAccount)
                           }}
                />
            </View>
        }
        if (item.name === 'phonecode') {
            if (this.state.isPhone === true) {
                return <View style={styles.row}>
                    <View style={styles.text}>
                        {
                            !("110" in this.state.requiredJsonArr) ? <FastImage
                                    style={{width: 11 * UIMacro.WIDTH_PERCENT, height: 11 * UIMacro.HEIGHT_PERCENT}}/> :
                                <FastImage source={require('../../static/images/2.1.0/required.webp')}
                                           style={{width: 11 * UIMacro.WIDTH_PERCENT, height: 11 * UIMacro.HEIGHT_PERCENT}}
                                />
                        }
                        <Text style={styles.content}>手机验证码</Text>
                    </View>
                    <TextInput placeholder='请输入手机收到的验证码' placeholderTextColor='#AAAAA8' value={this.state.phoneCode}
                               onChangeText={this.handleChangePhoneCode} style={styles.textInputYzm}
                               ref={(c) => this.phoneCodeAccount = c}
                               onEndEditing={() => {
                                   this.loadBlur(this.phoneCodeAccount)
                               }}
                    />
                    <TouchableBounce onPress={this.getPhoneCode}>
                        <Text style={styles.phoneCode}>{this.state.text}</Text>
                    </TouchableBounce>
                </View>
            }
        }
        if (item.name === '301') {
            return <View style={styles.row}>
                <View style={styles.text}>
                    {
                        !('301' in this.state.requiredJsonArr) ?
                            <FastImage style={{width: 11 * UIMacro.WIDTH_PERCENT, height: 11 * UIMacro.HEIGHT_PERCENT}}/> :
                            <FastImage source={require('../../static/images/2.1.0/required.webp')}
                                       style={{width: 11 * UIMacro.WIDTH_PERCENT, height: 11 * UIMacro.HEIGHT_PERCENT}}
                            />
                    }
                    <Text style={styles.content}>QQ</Text>
                </View>
                <TextInput placeholder='请输入QQ账号' placeholderTextColor='#AAAAA8' value={this.state.qq}
                           onChangeText={this.handleChangeqq} style={styles.textInput}
                           ref={(c) => this.qqAccount = c}
                           onEndEditing={() => {
                               this.loadBlur(this.qqAccount)
                           }}
                />
            </View>
        }
        if (item.name === 'securityIssues') {
            return <View>
                <View style={styles.row}>
                    <View style={styles.text}>
                        {
                            !('securityIssues' in this.state.requiredJsonArr) ? <FastImage
                                    style={{width: 11 * UIMacro.WIDTH_PERCENT, height: 11 * UIMacro.HEIGHT_PERCENT}}/> :
                                <FastImage source={require('../../static/images/2.1.0/required.webp')}
                                           style={{width: 11 * UIMacro.WIDTH_PERCENT, height: 11 * UIMacro.HEIGHT_PERCENT}}
                                />
                        }
                        <Text style={styles.content}>安全问题</Text>
                    </View>
                    <TextInput placeholderTextColor='#AAAAA8' placeholder={this.state.msg} editable={false}
                               style={styles.textInputsafe} onChangeText={this.handleChangeSafe}
                               value={this.state.msg}
                    />
                    <View style={styles.dropdownImg}>
                        <View style={styles.modal}>
                            <ModalDropdown dropdownStyle={styles.dropdownStyle}
                                           animated={true}
                                           textStyle={styles.dropdownText}
                                           options={this.state.data}
                                           onSelect={(index, value) => this.saveMsgValue(index, value)}
                                           dropdownTextStyle={styles.dropdownTextStyle}
                                           disabled={this.state.disabled}
                                           dropdownTextHighlightStyle={styles.checkeds}
                            >
                            </ModalDropdown>
                        </View>
                    </View>
                </View>
                <View style={styles.row}>
                    <View style={styles.text}>
                        {
                            !('securityIssues' in this.state.requiredJsonArr) ? <FastImage
                                    style={{width: 11 * UIMacro.WIDTH_PERCENT, height: 11 * UIMacro.HEIGHT_PERCENT}}/> :
                                <FastImage source={require('../../static/images/2.1.0/required.webp')}
                                           style={{width: 11 * UIMacro.WIDTH_PERCENT, height: 11 * UIMacro.HEIGHT_PERCENT}}
                                />
                        }
                        <Text style={styles.content}>答案</Text>
                    </View>
                    <TextInput placeholder='请输入安全问题答案' placeholderTextColor='#AAAAA8' value={this.state.answer}
                               onChangeText={this.handleChangeAnswer} style={styles.textInput}
                               ref={(c) => this.serviceTermsAccount = c}
                               onEndEditing={() => {
                                   this.loadBlur(this.serviceTermsAccount)
                               }}
                    />
                </View>
            </View>

        }
        if (item.name === '304') {
            return <View style={styles.row}>
                <View style={styles.text}>
                    {
                        !('304' in this.state.requiredJsonArr) ?
                            <FastImage style={{width: 11 * UIMacro.WIDTH_PERCENT, height: 11 * UIMacro.HEIGHT_PERCENT}}/> :
                            <FastImage source={require('../../static/images/2.1.0/required.webp')}
                                       style={{width: 11 * UIMacro.WIDTH_PERCENT, height: 11 * UIMacro.HEIGHT_PERCENT}}
                            />
                    }
                    <Text style={styles.content}>微信</Text>
                </View>
                <TextInput placeholder='请输入微信账号' placeholderTextColor='#AAAAA8' value={this.state.weChart}
                           onChangeText={this.handleChangeWeChart} style={styles.textInput}
                           ref={(c) => this.weChatAccount = c}
                           onEndEditing={() => {
                               this.loadBlur(this.weChatAccount)
                           }}
                />

            </View>
        }
        if (item.name === '201') {
            return <View style={styles.row}>
                <View style={styles.text}>
                    {
                        !('201' in this.state.requiredJsonArr) ?
                            <FastImage style={{width: 11 * UIMacro.WIDTH_PERCENT, height: 11 * UIMacro.HEIGHT_PERCENT}}/> :
                            <FastImage source={require('../../static/images/2.1.0/required.webp')}
                                       style={{width: 11 * UIMacro.WIDTH_PERCENT, height: 11 * UIMacro.HEIGHT_PERCENT}}
                            />
                    }
                    <Text style={styles.content}>邮箱</Text>
                </View>
                <TextInput placeholder='请输入邮箱地址' placeholderTextColor='#AAAAA8' value={this.state.email}
                           onChangeText={this.handleChangeEmail} style={styles.textInput}
                           ref={(c) => this.emailAccount = c}
                           onEndEditing={() => {
                               this.loadBlur(this.emailAccount)
                           }}
                />

            </View>
        }
        if (item.name === 'paymentPassword') {
            return <View style={styles.row}>
                <View style={styles.text}>
                    {
                        !('paymentPassword' in this.state.requiredJsonArr) ?
                            <FastImage style={{width: 11 * UIMacro.WIDTH_PERCENT, height: 11 * UIMacro.HEIGHT_PERCENT}}/> :
                            <FastImage source={require('../../static/images/2.1.0/required.webp')}
                                       style={{width: 11 * UIMacro.WIDTH_PERCENT, height: 11 * UIMacro.HEIGHT_PERCENT}}
                            />
                    }
                    <Text style={styles.content}>安全密码</Text>
                </View>
                <TextInput placeholder='请输入6位数字' placeholderTextColor='#AAAAA8' value={this.state.paymentPassword}
                           onChangeText={this.handleChangePayment} style={styles.textInput}
                           ref={(c) => this.paymentPasswordAccount = c} secureTextEntry={this.state.isPwdBlock}
                           onEndEditing={() => {
                               this.loadBlur(this.paymentPasswordAccount)
                           }}
                />
                <TouchableBounce style={styles.eyeImage} onPress={this.passwordBlock1}>
                    <View>
                        {this.showPwdBlockOrNone1(this.state.isPwdBlock)}
                    </View>
                </TouchableBounce>
            </View>
        }
        if (item.name === 'againPassword') {
            return <View style={styles.row}>
                <View style={styles.text}>
                    {
                        !('paymentPassword' in this.state.requiredJsonArr) ?
                            <FastImage style={{width: 11 * UIMacro.WIDTH_PERCENT, height: 11 * UIMacro.HEIGHT_PERCENT}}/> :
                            <FastImage source={require('../../static/images/2.1.0/required.webp')}
                                       style={{width: 11 * UIMacro.WIDTH_PERCENT, height: 11 * UIMacro.HEIGHT_PERCENT}}
                            />
                    }
                    <Text style={styles.content}>确认密码</Text>
                </View>
                <TextInput placeholder='请再次输入安全密码' placeholderTextColor='#AAAAA8' value={this.state.againpassword}
                           onChangeText={this.handleChangeAgainpassword} style={styles.textInput}
                           ref={(c) => this.againPasswordAccount = c} secureTextEntry={this.state.isPwdNone}
                           onEndEditing={() => {
                               this.loadBlur(this.againPasswordAccount)
                           }}
                />
                <TouchableBounce style={styles.eyeImage} onPress={this.passwordNone1}>
                    {this.showPwdBlockOrNone2(this.state.isPwdNone)}
                </TouchableBounce>
            </View>
        }
        if (item.name === 'defaultLocale') {
            return <View style={styles.row}>
                <View style={styles.text}>
                    {
                        !('defaultLocale' in this.state.requiredJsonArr) ?
                            <FastImage style={{width: 11 * UIMacro.WIDTH_PERCENT, height: 11 * UIMacro.HEIGHT_PERCENT}}/> :
                            <FastImage source={require('../../static/images/2.1.0/required.webp')}
                                       style={{width: 11 * UIMacro.WIDTH_PERCENT, height: 11 * UIMacro.HEIGHT_PERCENT}}
                            />
                    }
                    <Text style={styles.content}>主语言</Text>
                </View>
                <TextInput placeholderTextColor='#AAAAA8' placeholder={this.state.language}
                           editable={false} value={this.state.language}
                           onChangeText={this.handleChangeLanguage} style={styles.textInput}
                />
                <View style={styles.dropdownImg}>
                    <View style={styles.modal}>
                        <ModalDropdown dropdownStyle={styles.dropdownStyle1}
                                       animated={true}
                                       textStyle={styles.dropdownText}
                                       options={this.state.languageArr}
                                       onSelect={(index, value) => this.saveLanguage(index, value)}
                                       dropdownTextStyle={styles.dropdownTextStyle}
                                       disabled={this.state.disabled}
                                       dropdownTextHighlightStyle={styles.checkeds}
                        >
                        </ModalDropdown>
                    </View>
                </View>
            </View>
        }
        if (item.name === 'mainCurrency') {
            return <View style={styles.row}>
                <View style={styles.text}>
                    {
                        !('mainCurrency' in this.state.requiredJsonArr) ?
                            <FastImage style={{width: 11 * UIMacro.WIDTH_PERCENT, height: 11 * UIMacro.HEIGHT_PERCENT}}/> :
                            <FastImage source={require('../../static/images/2.1.0/required.webp')}
                                       style={{width: 11 * UIMacro.WIDTH_PERCENT, height: 11 * UIMacro.HEIGHT_PERCENT}}
                            />
                    }
                    <Text style={styles.content}>货币</Text>
                </View>
                <TextInput placeholder={this.state.mainCurrency} placeholderTextColor='#AAAAA8'
                           editable={false} value={this.state.mainCurrency}
                           onChangeText={this.handleChangeMainCurrency} style={styles.textInput}
                />
                <View style={styles.dropdownImg}>
                    <View style={styles.modal}>
                        <ModalDropdown dropdownStyle={styles.dropdownStyle1}
                                       animated={true}
                                       textStyle={styles.dropdownText}
                                       options={this.state.mainCurrencyArr}
                                       onSelect={(index, value) => this.saveMainCurrency(index, value)}
                                       dropdownTextStyle={styles.dropdownTextStyle}
                                       disabled={this.state.disabled}
                                       dropdownTextHighlightStyle={styles.checkeds}
                        >
                        </ModalDropdown>
                    </View>

                </View>
            </View>
        }
        if (item.name === 'sex') {
            return <View style={styles.row}>
                <View style={styles.text}>
                    {
                        !('sex' in this.state.requiredJsonArr) ?
                            <FastImage style={{width: 11 * UIMacro.WIDTH_PERCENT, height: 11 * UIMacro.HEIGHT_PERCENT}}/> :
                            <FastImage source={require('../../static/images/2.1.0/required.webp')}
                                       style={{width: 11 * UIMacro.WIDTH_PERCENT, height: 11 * UIMacro.HEIGHT_PERCENT}}
                            />
                    }
                    <Text style={styles.content}>性别</Text>
                </View>
                <TextInput placeholderTextColor='#AAAAA8' placeholder={this.state.sexItem}
                           editable={false} value={this.state.sexItem}
                           onChangeText={this.handleChangeSex} style={styles.textInput}/>
                <View style={styles.dropdownImg}>
                    <View style={styles.modal}>
                        <ModalDropdown dropdownStyle={styles.dropdownStyle2}
                                       animated={true}
                                       textStyle={styles.dropdownText}
                                       options={this.state.sexArr}
                                       onSelect={(index, value) => this.saveSexValue(index, value)}
                                       dropdownTextStyle={styles.dropdownTextStyle}
                                       disabled={this.state.disabled}
                                       dropdownTextHighlightStyle={styles.checkeds}
                        >
                        </ModalDropdown>
                    </View>
                </View>
            </View>
        }
        if (item.name === 'birthday') {
            let date = new Date();
            let year = date.getFullYear();
            let month = date.getMonth() + 1;
            let day = date.getDate();
            let maxDate = year + '-' + month + '-' + day;
            return <View style={styles.row}>
                <View style={styles.text}>
                    {
                        !('birthday' in this.state.requiredJsonArr) ?
                            <FastImage style={{width: 11 * UIMacro.WIDTH_PERCENT, height: 11 * UIMacro.HEIGHT_PERCENT}}/> :
                            <FastImage source={require('../../static/images/2.1.0/required.webp')}
                                       style={{width: 11 * UIMacro.WIDTH_PERCENT, height: 11 * UIMacro.HEIGHT_PERCENT}}
                            />
                    }
                    <Text style={styles.content}>生日</Text>
                </View>
                <DatePicker
                    style={styles.textInput1}
                    date={this.state.date}
                    mode="date"
                    androidMode="spinner"
                    placeholder="请选择生日"
                    format="YYYY-MM-DD"
                    minDate="1900-01-01"
                    maxDate={maxDate}
                    confirmBtnText="确定"
                    cancelBtnText="取消"
                    showIcon={false}
                    customStyles={{
                        dateInput: {
                            height: 33 * UIMacro.HEIGHT_PERCENT,
                            borderRadius: 5,
                            color: 'white',
                            borderColor: SkinsColor.textInput_border,
                            marginLeft: -10 * UIMacro.WIDTH_PERCENT,
                            marginTop: -5 * UIMacro.WIDTH_PERCENT
                        },
                        placeholderText: {fontSize: 11, color: '#AAAAA8',marginLeft:-136*UIMacro.WIDTH_PERCENT},
                        dateText: {color: '#FFF',marginLeft:-130*UIMacro.WIDTH_PERCENT,fontSize: 11,},
                    }}
                    onDateChange={this.handleBirthday}
                />


            </View>
        }
        if (item.name === 'defaultTimezone') {
            return <View style={styles.row}>
                <View style={styles.text}>
                    {
                        !('defaultTimezone' in this.state.requiredJsonArr) ?
                            <FastImage style={{width: 11 * UIMacro.WIDTH_PERCENT, height: 11 * UIMacro.HEIGHT_PERCENT}}/> :
                            <FastImage source={require('../../static/images/2.1.0/required.webp')}
                                       style={{width: 11 * UIMacro.WIDTH_PERCENT, height: 11 * UIMacro.HEIGHT_PERCENT}}
                            />
                    }
                    <Text style={styles.content}>时区</Text>
                </View>
                <TextInput placeholder={this.state.timezone} placeholderTextColor='#AAAAA8'
                           editable={false} value={this.state.timezone}
                           onChangeText={this.handleChangeTimezone}
                           style={styles.textInput}
                />
                <View style={styles.dropdownImg}>
                    <View style={styles.modal}>
                        <ModalDropdown dropdownStyle={styles.dropdownStyle1}
                                       animated={true}
                                       textStyle={styles.dropdownText}
                                       options={this.state.timezoneData}
                                       onSelect={(index, value) => this.setState({timezone: value})}
                                       dropdownTextStyle={styles.dropdownTextStyle}
                                       disabled={this.state.disabled}
                                       dropdownTextHighlightStyle={styles.checkeds}
                                       style={{backgroundColor:'rgba(0,0,0,0)'}}

                        >
                        </ModalDropdown>
                    </View>
                </View>
            </View>
        }
        if (item.name === 'verificationCode') {
            return <View style={styles.row}>
                <View style={styles.text}>
                    {
                        !('verificationCode' in this.state.requiredJsonArr) ?
                            <FastImage style={{width: 11 * UIMacro.WIDTH_PERCENT, height: 11 * UIMacro.HEIGHT_PERCENT}}/> :
                            <FastImage source={require('../../static/images/2.1.0/required.webp')}
                                       style={{width: 11 * UIMacro.WIDTH_PERCENT, height: 11 * UIMacro.HEIGHT_PERCENT}}
                            />
                    }
                    <Text style={styles.content}>验证码</Text>
                </View>
                <View style={styles.inputYzm}>
                    <TextInput placeholder='点击验证码可更换' placeholderTextColor='#AAAAA8'
                               style={styles.textInputYzm} value={this.state.verificationCode}
                               onChangeText={this.handleYzm}
                               ref={(c) => this.YzmAccount = c}
                               onEndEditing={() => {
                                   this.loadBlur(this.YzmAccount)
                               }}
                    />
                    <TouchableBounce onPress={this._getVerificationCode}>
                        <FastImage
                            source={{
                                uri:
                                    "data:image/png;base64," + this.state.imgUrl
                            }}
                            style={{
                                width: 78 * UIMacro.WIDTH_PERCENT,
                                height: 33 * UIMacro.HEIGHT_PERCENT,
                                marginLeft: 5 * UIMacro.WIDTH_PERCENT
                            }}/>
                    </TouchableBounce>

                </View>
            </View>
        }
    };
    // 选择问题
    saveMsgValue = (index, value) => {
        this.setState({
            msg: value,
            msgValue: this.state.securityIssues[index].value,
        })
    }
    //性别
    saveSexValue = (index, value) => {
        this.setState({
            sexItem: value,
            sexValue: this.state.sexData[index].value,
        })
    }
    //语言
    saveLanguage = (index, value) => {
        this.setState({
            language: value,
            languageValue: this.state.languageData[index].value,
        })
    }
    //货币
    saveMainCurrency = (index, value) => {
        this.setState({
            mainCurrency: value,
            mainCurrencyValue: this.state.mainCurrencyData[index].value,
        })
    }

    componentWillUnmount() {
        this._isMounted = false
        this.setState = (state,callback)=>{
            return;
        }
    }

    componentDidMount() {
        this._isMounted = true;
        //注册初始化
        let url = 'mobile-api/registerOrigin/getRegisterInfo.html'
        GBNetWorkService.post(url, null, null, this._successInitBack, this._failInitBack)
        this.props.show()
        this._getVerificationCode()
    }

    //注册初始化
    _successInitBack = (json) => {
        this.props.hide()
        console.log("注册数据",json.data);
        let datas = Array.from(json.data.field)
        for (let i = 0; i < datas.length; i++) {
            let item = datas[i];
            console.log("进来了");
            if (item.name === 'password') {
                datas.splice(i + 1, 0, {
                    "id": 2,
                    "name": "configPwd",
                    "isRequired": "0",
                    "status": "1",
                    "isRegField": "2",
                    "bulitIn": true,
                    "sort": 2,
                    "derail": false,
                    "isOnly": "2",
                    "i18nName": null
                });
            }
            if (item.name === 'paymentPassword') {
                datas.splice(i + 1, 0, {
                    "id": 10,
                    "name": "againPassword",
                    "isRequired": "2",
                    "status": "1",
                    "isRegField": "1",
                    "bulitIn": false,
                    "sort": 10,
                    "derail": false,
                    "isOnly": "2",
                    "i18nName": null
                });
            }
            if (item.name === '110') {
                datas.splice(i + 1, 0, {
                    "id": 7,
                    "name": "phonecode",
                    "isRequired": "2",
                    "status": "1",
                    "isRegField": "2",
                    "bulitIn": false,
                    "sort": 7,
                    "derail": false,
                    "isOnly": "2",
                    "i18nName": null
                });
            }
        }
        let reg = null, code = null
        let obj = null
        for (let i = 0; i < datas.length; i++) {
            if ('regCode' === datas[i].name) {
                reg = i
            }
            if ('verificationCode' === datas[i].name) {
                code = i
                obj = datas[code]
            }
        }
        if (reg === null) {
            datas.splice(code, 1)
            datas.push(obj)
            this.setState({field: datas})
        } else {
            //将推荐码放到第一位
            let arr5 = [datas[reg]]

            if (reg < code) {
                datas.splice(reg, 1)
                datas.splice(code - 1, 1)
            } else {
                datas.splice(code, 1)
                datas.splice(reg - 1, 1)
            }
            let arr6 = arr5.concat(datas)
            arr6.push(obj)
            this.setState({field: arr6})
        }


        // 将必填数据数组变二位数组
        console.log('二维数组１', json.data.requiredJson)
        let requiredJsonArr = []
        for (let i = 0; i < json.data.requiredJson.length; i++) {
            requiredJsonArr[json.data.requiredJson[i]] = json.data.requiredJson[i]
        }
        this.setState({
            requiredJsonArr: requiredJsonArr,
        })
        console.log('二维数组', this.state.requiredJsonArr)

        let time = []
        time.push(json.data.params.timezone)
        this.setState({
            securityIssues: json.data.selectOption.securityIssues, //安全问题
            requiredJson: json.data.requiredJson,//注册要传的参数
            languageData: json.data.selectOption.defaultLocale,
            mainCurrencyData: json.data.selectOption.mainCurrency,
            sexData: json.data.selectOption.sex,
            timezoneData: time,
            recommendRegisterCode: json.data.params.registerCode ? null : '',
            timezone: json.data.params.timezone,
            isPhone: json.data.isPhone
        });
        console.log(this.state.field);
        console.log('***********', json);
        let arr = [];
        for (let aa of this.state.securityIssues) {
            arr.push(aa.text)
        }
        this.setState({data: arr})
        let arr2 = []
        for (let bb of this.state.sexData) {
            arr2.push(bb.text)
        }
        this.setState({sexArr: arr2})
        let arr3 = []
        for (let cc of this.state.languageData) {
            arr3.push(cc.text)
        }
        this.setState({languageArr: arr3})

        let arr4 = []
        for (let cc of this.state.mainCurrencyData) {
            arr4.push(cc.text)
        }
        this.setState({mainCurrencyArr: arr4})
    };

    _failInitBack = (json) => {
        this.props.hide()
        console.log("失败" + json)
    };

    render() {
        return <View style={styles.container}>
            <View style={styles.containView}>
                <FlatList keyExtractor={(item, index) => index.toString()} data={this.state.field}
                          extraData={this.state} renderItem={this.showList}
                          ListFooterComponent={this.renderFootView}
                />
                <Toast
                    ref="toast"
                    style={{backgroundColor: 'white', marginTop: UIMacro.HEIGHT_PERCENT * 200}}
                    fadeInDuration={300}
                    fadeOutDuration={300}
                    opacity={1}
                    textStyle={{color: 'black', textAlign: 'center'}}
                />
            </View>
        </View>
    }

    renderFootView = () => {
        return (
            <View>
                <View style={styles.checkbox}>
                    <CheckBox checked={this.state.isChecked} label={''}
                              checkedImage={require('../../static/images/2.1.0/select.png')}
                              uncheckedImage={require('../../static/images/2.1.0/unselect.png')}
                              checkboxStyle={{borderRadius: 6, width: 12, height: 12,}}
                              onChange={this.handleChecked}
                    />
                    <TouchableBounce onPress={this.handleAgree} style={styles.label}>
                        <Text style={{color: '#fff', fontSize: 10}}>我已满合法游戏年龄，同意各项开户条约</Text>
                    </TouchableBounce>
                </View>

                <TouchableBounce onPress={this.handleRegister} style={styles.btnLog}>
                    <FastImage style={{height: 41 * UIMacro.HEIGHT_PERCENT, width: 118 * UIMacro.WIDTH_PERCENT,}}
                                     resizeMode='contain'
                                     source={require('../../static/images/2.1.0/btn_general.webp')}>
                        <Text style={styles.log}>立即注册</Text>
                    </FastImage>
                </TouchableBounce>
                <Text>{'\n'}</Text>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        width: UIMacro.WIDTH_PERCENT * 333,
        height: UIMacro.HEIGHT_PERCENT * 284,
    },
    containView: {
        paddingTop: 10 * UIMacro.HEIGHT_PERCENT
    },
    row: {
        flexDirection: 'row',
        marginBottom: 8 * UIMacro.HEIGHT_PERCENT,
        justifyContent: 'flex-end',
        marginRight: 21 * UIMacro.WIDTH_PERCENT,
        alignItems: 'center'
    },
    text: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginRight: 9 * UIMacro.WIDTH_PERCENT
    },

    content: {
        color: '#fff',
        fontSize: 12,
    },
    textInput: {
        backgroundColor: SkinsColor.textInput_bg,
        height: 33 * UIMacro.HEIGHT_PERCENT,
        width: 208 * UIMacro.WIDTH_PERCENT,
        borderRadius: 5,
        color: '#fff',
        fontSize: 11,
        padding: 0,
        paddingLeft: 10,
        borderWidth: 1,
        borderColor: SkinsColor.textInput_border,
    },
    textInput1: {
        backgroundColor: SkinsColor.textInput_bg,
        height: 33 * UIMacro.HEIGHT_PERCENT,
        width: 208 * UIMacro.WIDTH_PERCENT,
        borderRadius: 5,
        padding: 0,
        paddingLeft: 10,
    },
    eyeImage: {
        position: 'absolute',
        right: 10 * UIMacro.WIDTH_PERCENT,
    },
    inputYzm: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    textInputYzm: {
        backgroundColor: SkinsColor.textInput_bg,
        height: 33 * UIMacro.HEIGHT_PERCENT,
        width: 125 * UIMacro.WIDTH_PERCENT,
        borderRadius: 5,
        color: '#fff',
        fontSize: 11,
        padding: 0,
        paddingLeft: 10,
        borderWidth: 1,
        borderColor: SkinsColor.textInput_border,
    },
    phoneCode: {
        width: 78 * UIMacro.WIDTH_PERCENT,
        height: 33 * UIMacro.HEIGHT_PERCENT,
        lineHeight: 33 * UIMacro.HEIGHT_PERCENT,
        marginLeft: 5 * UIMacro.WIDTH_PERCENT,
        backgroundColor: '#E2F7F8',
        color: '#0C4BD3',
        textAlign: 'center',
        fontSize: 15,
    },
    checkbox: {
        flexDirection: 'row',
        width: 333 * UIMacro.WIDTH_PERCENT,
        alignItems: 'center',
        paddingLeft: 100 * UIMacro.WIDTH_PERCENT,
    },
    label: {
        fontSize: 10,
        marginTop: -2 * UIMacro.HEIGHT_PERCENT,
        marginLeft: 5 * UIMacro.WIDTH_PERCENT,
    },
    btnLog: {
        alignItems: 'center',
        marginTop: 5 * UIMacro.HEIGHT_PERCENT
    },
    log: {
        fontSize: 15,
        textAlign: 'center',
        color: '#fff',
        fontWeight: 'bold',
        height: 41 * UIMacro.HEIGHT_PERCENT,
        lineHeight: 41 * UIMacro.HEIGHT_PERCENT,
    },
    textInputsafe: {
        backgroundColor: SkinsColor.textInput_bg,
        height: 33 * UIMacro.HEIGHT_PERCENT,
        width: 208 * UIMacro.WIDTH_PERCENT,
        borderRadius: 5,
        color: '#fff',
        fontSize: 11,
        padding: 0,
        paddingLeft: 10,
        borderWidth: 1,
        borderColor: SkinsColor.textInput_border,
    },
    dropdownImg: {
        position: 'absolute',
        right: 0,
    },
    imageDrop: {
        width: 208 * UIMacro.WIDTH_PERCENT,
        height: 40 * UIMacro.HEIGHT_PERCENT,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: -6 * UIMacro.WIDTH_PERCENT
    },
    modal: {
        height: 40 * UIMacro.HEIGHT_PERCENT,
        alignItems: 'center',
        justifyContent: 'center',
    },
    dropdownStyle: {
        flex: 1,
        height: 150 * UIMacro.HEIGHT_PERCENT,
        borderWidth: 1,
        backgroundColor: SkinsColor.bgTextViewStyle_bg,
    },
    dropdownStyle1: {
        flex: 1,
        height: 33 * UIMacro.HEIGHT_PERCENT,
        width: 208 * UIMacro.WIDTH_PERCENT,
        borderWidth: 1,
        backgroundColor: SkinsColor.bgTextViewStyle_bg,
    },
    dropdownStyle2: {
        flex: 1,
        height: 100 * UIMacro.HEIGHT_PERCENT,
        width: 208 * UIMacro.WIDTH_PERCENT,
        borderWidth: 1,
        backgroundColor: SkinsColor.bgTextViewStyle_bg,
    },
    dropdownText: {
        fontSize: 11,
        color: '#fff',
        paddingLeft: 10
    },
    dropdownTextStyle: {
        color: '#AAAAA8',
        backgroundColor: SkinsColor.bgTextViewStyle_bg,
        fontSize: 12
    },
    checkeds:{
        backgroundColor:SkinsColor.textInput_bg,
        color:'#fff'
    },
    imgDropdown: {
        width: 16 * UIMacro.WIDTH_PERCENT,
        height: 9 * UIMacro.HEIGHT_PERCENT,
        left: 75 * UIMacro.HEIGHT_PERCENT,
    },
    requiredImg: {
        width: 11 * UIMacro.WIDTH_PERCENT, height: 11 * UIMacro.HEIGHT_PERCENT, marginLeft: 5 * UIMacro.WIDTH_PERCENT
    },
    messageView: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    messageTxt: {
        flexDirection: 'row',
        width: UIMacro.WIDTH_PERCENT * 302,
        height: UIMacro.HEIGHT_PERCENT * 116,
        backgroundColor: SkinsColor.messageTxt_bg,
        borderRadius: 10,
        marginTop: UIMacro.HEIGHT_PERCENT * 14,
        borderWidth: 1,
        borderColor: SkinsColor.bgTextViewStyle_border,
        alignItems: 'center'
    },
    mesText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 12,
        marginLeft: 10 * UIMacro.WIDTH_PERCENT
    },
    btn: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    next: {
        marginLeft: 8 * UIMacro.WIDTH_PERCENT,
    },
    btnClick: {
        width: 121 * UIMacro.WIDTH_PERCENT,
        height: 45 * UIMacro.HEIGHT_PERCENT,
        marginTop: 8 * UIMacro.HEIGHT_PERCENT,
    },
});