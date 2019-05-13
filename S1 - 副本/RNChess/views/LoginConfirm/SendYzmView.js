import React, {Component} from 'react'
import {View, Text, StyleSheet, TextInput,} from 'react-native'


import GBNetWorkService from '../../core/GBNetWorkService'
import Toast from "../../common/ToastView";
import UserInfo from '../../core/UserInfo'
import UIMacro from '../../core/UIMacro'
import SuccessNewPwdViewPage from "./SuccessNewPwdViewPage";
import SkinsColor from "../../core/SkinsColor";
import TouchableBounce from '../../common/TouchableBounce'
import FastImage from 'react-native-fast-image'

export default class SendYzmView extends Component {
    constructor(pros) {
        super(pros);
        this.state = {
            ...this.state,
            second:60,
            text:'获取验证码',
            timer:null,
            sendYZMSuccessData:'',
            code:'',
            placeholder:'请输验证码',
            overTimeStamp:null,
            nowStamp:null,
            isShowBusy:false,
            newPassword:'',
            againPassword:'',
            isBlock: true,
            isNone: true,
            isPwdBlock:true,
            isPwdNone:true,
        }
    }

    handleSure = () =>{
        let resetPwd = /^([a-z0-9\.\@\!\#\$\%\^\&\*\(\)]){6,20}$/i
       if(!this.state.code){
           this.refs.toast.show('请输入验证码')
           return
       }else if (!resetPwd.test(this.state.newPassword)) {
           this.refs.toast.show("密码请输入6-20位数字、字符及特殊符号")
           return
       }
       if(!this.state.newPassword){
           this.refs.toast.show('请输入新密码')
           return
       }
        if(this.state.againPassword !== this.state.newPassword){
            this.refs.toast.show('您二次输入的密码不一致')
            return
        }

        //较验验证码
        let url = 'mobile-api/findPasswordOrigin/checkPhoneCode.html';
        let params = {'code': this.state.code};
        console.log('验证码',params)
        GBNetWorkService.post(url,params,null,this.YZMSendSuccess,this.YZMSendFail)
        this.props.showLoading1()
    }

    YZMSendSuccess = (json) =>{
        this.props.showLoading2()
        console.log('验证码输入返回情况' , json)
        // 验证码错误时
        if(json.message==="验证码输入错误"){
            this.refs.toast.show("验证码输入错误")
        }else{
            //设置新密码接口
            let url = 'mobile-api/findPasswordOrigin/findLoginPassword.html';
            let  params = {'username': this.props.userName,'newPassword': this.state.newPassword};
            console.log('账号和新密码',params)
            GBNetWorkService.post(url,params,null,this.newPwdSendSuccess,this.newPwdSendFail)
            this.props.showLoading1()
        }
    }
    YZMSendFail = (json) =>{
        this.props.showLoading2()
        console.log('失败' , json)
    };

    newPwdSendSuccess = (json) =>{
        console.log('设置新密码返回结果判断' , json)
        this.props.showLoading2()
        //成功  //TODO
        if(json.message==='请求成功'){
            this.interval && clearInterval(this.interval)
            this.setState({
                text:'获取验证码',
                second:60,
            })
            this.props.openNewPwd()

            this.setState({newPassword:'',againPassword:'',code:''})
        }else{
            // 失败
            this.refs.toast.show(json.message)
        }
    }
    newPwdSendFail = (json) =>{
        this.props.showLoading2()
        console.log('失败' , json)
    };

    //保存验证码
    handleChangeCode = (msg) => {
        this.setState({code: msg});
    };

    //失去焦点
    loadBlur=(input)=> {
        input.blur()
    }

    // 发送验证码
    render () {
        return(
            <View>
                <View style={styles.YzmText}>
                    <Text style={styles.txt}>验证码已发送至您的手机 &nbsp;: &nbsp;&nbsp;&nbsp;<Text style={styles.phones}>{this.props.phone}</Text></Text>
                </View>
                <View style={styles.yzmCount}>
                    <Text style={styles.yzmText}>验证码</Text>
                    <TextInput style={styles.yzmInput}
                                value={this.state.code}
                               placeholder='请输入验证码'
                               onChangeText={this.handleChangeCode} placeholderTextColor='rgba(170, 170, 168, 1)'
                               ref={(c)=>this.codeAccount=c}
                               onEndEditing={()=>{this.loadBlur(this.codeAccount)}}
                    />
                    <TouchableBounce onPress={this.getVerificationCode} style={styles.next}>
                         <FastImage style={styles.btnClick}
                                          resizeMode='stretch'
                                          source={ require('../../static/images/2.1.0/btn_green_action2.webp')}>
                             <Text style={styles.logText}>{this.state.text}</Text>
                         </FastImage>
                    </TouchableBounce>
                </View>
                <View style={styles.pwdText}>
                    <Text style={styles.mesText}>新密码 </Text>
                    <TextInput style={styles.yzmInput1} placeholder={"请输入新密码"}
                               value={this.state.newPassword} onChangeText={this._changePwd}
                               secureTextEntry={this.state.isBlock}
                               placeholderTextColor='rgba(170, 170, 168, 1)'
                               ref={(c)=>this.newPassword=c}
                               onEndEditing={()=>{this.loadBlur(this.newPassword)}}
                    />
                    <TouchableBounce style={styles.eyeImage} onPress={this.passwordBlock}>
                        <View>
                            {this.showBlockOrNone1(this.state.isBlock)}
                        </View>
                    </TouchableBounce>
                </View>
                <View style={styles.pwdText}>
                    <Text style={[styles.mesText,styles.text0]}>确认新密码</Text>
                    <TextInput style={styles.yzmInput1} placeholder={"请再次输入密码"}
                               value={this.state.againPassword} onChangeText={this._changeAgainPwd}
                               secureTextEntry={this.state.isNone}
                               placeholderTextColor='rgba(170, 170, 168, 1)'
                               ref={(c)=>this.againPassword=c}
                               onEndEditing={()=>{this.loadBlur(this.againPassword)}}
                    />
                    <TouchableBounce style={styles.eyeImage} onPress={this.passwordNone}>
                        {this.showPwdBlockOrNone2(this.state.isNone)}
                    </TouchableBounce>
                </View>
                <View style={styles.sureBtn}>
                    <TouchableBounce onPress={this.handleSure}>
                        <FastImage style={styles.btnClick1}
                                         resizeMode='stretch'
                                         source={ require('../../static/images/2.1.0/btn_menu.webp')}>
                            <Text style={styles.logText1}>确定</Text>
                        </FastImage>
                    </TouchableBounce>
                </View>
                <Toast
                    ref="toast"
                    style={{backgroundColor: 'white',marginTop:200*UIMacro.HEIGHT_PERCENT}}
                    fadeInDuration={300}
                    fadeOutDuration={1000}
                    opacity={1}
                    textStyle={{color: 'black'}}
                />
            </View>

        )

    }
    // 保存新密码
    _changePwd = (value)=>{
        this.setState({
            newPassword:value
        })
    }
    _changeAgainPwd = (value)=>{
        this.setState({
            againPassword:value
        })
    }
    // 睁眼闭眼
    passwordBlock = () => {
        if (!this.state.isBlock) {
            this.setState({isBlock: true})
        } else {
            this.setState({isBlock: false})
        }
    }
    passwordNone = () => {
        if (!this.state.isNone) {
            this.setState({isNone: true})
        } else {
            this.setState({isNone: false})
        }
    };
    showBlockOrNone1 = (state) => {
        let arr = [], index = 0;
        if (state === true) {
            arr.push(<FastImage key={index} style={{width: 18, height: 9,}}
                            source={require('../../static/images/2.1.0/icon_closed.webp')}/>)
        } else {
            arr.push(<FastImage key={index + 1} style={{width: 18, height: 9}}
                            source={require('../../static/images/2.1.0/icon_show.webp')}/>)
        }
        return arr
    }
    showPwdBlockOrNone2 = (state) => {
        let arr = [], index = 0;
        if (state === true) {
            arr.push(<FastImage key={index} style={{width: 18, height: 9,}}
                            source={require('../../static/images/2.1.0/icon_closed.webp')}/>)
        } else {
            arr.push(<FastImage key={index + 1} style={{width: 18, height: 9}}
                            source={require('../../static/images/2.1.0/icon_show.webp')}/>)
        }
        return arr
    };

    //获取短信验证码
    getVerificationCode = () =>{
        if(this.state.text==='获取验证码'){
            let url = 'mobile-api/origin/sendFindPasswordPhone.html';
            let params;
            if (this.props.encryptedId) {
                params = {'encryptedId': this.props.encryptedId};
            }
            GBNetWorkService.post(url,params,null,this.successPhone,this.failPhone)
        }
    }
    successPhone = (json) =>{
        console.log('发送验证码成功1',json)
        this.setState({sendYZMSuccessData:json.message})
        if (parseInt(json.code)===0){
            this.refs.toast.show("发送成功")
            this.runTimer() ;
        }else{
            this.refs.toast.show(json.message)
        }

    };

    failPhone = (json) =>{
        console.log('失败' , json)
    };

    //倒计时
    runTimer = () =>{
        const codeTime = this.state.second;
        const now = Date.now()
        // const overTimeStamp = now + codeTime * 1000 + 100/*过期时间戳（毫秒） +100 毫秒容错*/
        this.setState({overTimeStamp:now + codeTime * 1000 + 100})
        this.interval = setInterval(() => {
            /* 切换到后台不受影响*/
            // const nowStamp = Date.now()
            this.setState({nowStamp:Date.now()})
            if (this.state.nowStamp >= this.state.overTimeStamp) {
                /* 倒计时结束*/
                this.interval && clearInterval(this.interval);
                this.setState({
                    second: codeTime,
                    text: '获取验证码',
                    placeholder:'请输验证码',
                    // code:'',
                    // isShowBusy:true,
                })
            } else {
                const leftTime = parseInt((this.state.overTimeStamp - this.state.nowStamp) / 1000, 10)
                this.setState({
                    second: leftTime,
                    text: `重新获取(${leftTime}s)`,
                })
            }
        },1000)
    }
    componentDidMount(){
        this._isMounted = true
    }
    componentWillUnmount(){
        this._isMounted = false
        this.setState({code:''})
        this.interval && clearInterval(this.interval)
        this.setState({
            text:'获取验证码',
            second:60,

        })
    }

}

const styles = StyleSheet.create({
    YzmText:{
        backgroundColor:'rgba(0, 0, 0, .5)',
        borderRadius:15,
        marginTop:15*UIMacro.HEIGHT_PERCENT,
        marginLeft:30*UIMacro.WIDTH_PERCENT,
        marginRight:26*UIMacro.WIDTH_PERCENT,
        width:280*UIMacro.WIDTH_PERCENT,
        height:29*UIMacro.HEIGHT_PERCENT,
        justifyContent: 'center',
        alignItems: 'center'
    },
    txt:{
        color:'rgba(255, 255, 255, 1)',
        fontSize:12,
        // paddingLeft: 27*UIMacro.WIDTH_PERCENT,
        paddingTop: 9*UIMacro.HEIGHT_PERCENT,
        paddingBottom: 9*UIMacro.HEIGHT_PERCENT,
    },
    phones:{
        color:'rgba(255, 234, 0, 1)',
    },
    yzmCount:{
        flexDirection:'row',
        marginTop:18*UIMacro.HEIGHT_PERCENT,
        marginLeft:55*UIMacro.WIDTH_PERCENT,
    },
    yzmText:{
       color:'rgba(255, 255, 255, 1)',
       fontSize:12,
        marginTop:10*UIMacro.HEIGHT_PERCENT,
        marginRight:10*UIMacro.WIDTH_PERCENT,
    },
    yzmInput:{
        backgroundColor: SkinsColor.bgTextViewStyle_bg,
        borderRadius:5,
        width:UIMacro.WIDTH_PERCENT*115,
        height:UIMacro.HEIGHT_PERCENT*33,
        borderWidth:1,
        borderColor:SkinsColor.bgTextViewStyle_border,
        fontSize:13,
        padding: 0,
        color:'#fff',
        paddingLeft: 5
    },
    next:{
        justifyContent:'center',
        alignItems: 'center',
    },
    btnClick: {
        width: 89*UIMacro.WIDTH_PERCENT,
        height: 31*UIMacro.HEIGHT_PERCENT,
        marginLeft: 7*UIMacro.WIDTH_PERCENT,
    },
    logText: {
        color: 'rgba(255, 255, 255, 1)',
        fontSize: 12,
        fontWeight: 'bold',
        textAlign: 'center',
        lineHeight: 31*UIMacro.HEIGHT_PERCENT,
    },
    pwdText:{
        flexDirection: 'row',
        marginTop:19*UIMacro.HEIGHT_PERCENT,
        marginLeft:54*UIMacro.WIDTH_PERCENT,
    },
    mesText:{
        color:'rgba(255, 255, 255, 1)',
        fontSize:12,
        marginTop:10*UIMacro.HEIGHT_PERCENT,
        marginRight:10*UIMacro.WIDTH_PERCENT,
    },
    text0:{
        textAlign: 'right',
        marginLeft:-20*UIMacro.WIDTH_PERCENT,
    },
    yzmInput1:{
        backgroundColor: SkinsColor.bgTextViewStyle_bg,
        borderRadius:5,
        width:UIMacro.WIDTH_PERCENT*208,
        height:UIMacro.HEIGHT_PERCENT*33,
        borderWidth:1,
        borderColor:SkinsColor.bgTextViewStyle_border,
        fontSize:13,
        padding: 0,
        color:'#fff',
        paddingLeft: 5
    },
    eyeImage: {
        position: 'absolute',
        top:15*UIMacro.HEIGHT_PERCENT,
        right: 40 * UIMacro.WIDTH_PERCENT,
    },
    sureBtn:{
        marginTop:40*UIMacro.HEIGHT_PERCENT,
        marginLeft:109*UIMacro.WIDTH_PERCENT,
    },
    btnClick1: {
        width: 118*UIMacro.WIDTH_PERCENT,
        height: 41*UIMacro.HEIGHT_PERCENT,
    },
    logText1: {
        color: 'rgba(255, 255, 255, 1)',
        fontSize: 15,
        fontWeight: 'bold',
        textAlign: 'center',
        lineHeight: 41*UIMacro.HEIGHT_PERCENT,
    },
    sure:{

    },
})