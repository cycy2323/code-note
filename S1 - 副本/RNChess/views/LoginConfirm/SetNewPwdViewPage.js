import React, {Component} from 'react'
import {
    View,
    Text,
    StyleSheet,
    TextInput,
} from 'react-native'

import GBNetWorkService from "../../core/GBNetWorkService";
import SmallPopPage from '../../common/SmallPopPage'
import Toast from "../../common/ToastView";
import UIMacro from '../../core/UIMacro'
import SkinsColor from "../../core/SkinsColor";
import TouchableBounce from '../../common/TouchableBounce'
import FastImage from 'react-native-fast-image'

export default class SetNewPwdViewPage extends SmallPopPage {
    constructor(props) {
        super(props);

        this.state = {
            ...this.state,
            newPassword:'',
            isBlock: true,
            isNone: true,
        }
    }

    //标题
    titleImage = ()=> {
        return (require('../../static/images/title18.webp'))
    }

    renderPage = () =>{
        return(
            <Toast
                ref="toast"
                style={{backgroundColor: 'white',marginTop:270*UIMacro.HEIGHT_PERCENT}}
                fadeInDuration={300}
                fadeOutDuration={1000}
                opacity={1}
                textStyle={{color: 'black'}}
                key={0}
            />
        )
    }

    //是否设置成功——成功 关闭上一级弹窗 提示修改成功 / 失败 提示失败
    handleSure = () =>{
        // 输入验证
        let resetPwd = /^[a-zA-Z0-9_]{6,20}$/;
        if (!this.state.newPassword) {
            this.refs.toast.show("密码不能为空")
            return
        } else if (!resetPwd.test(this.state.newPassword)) {
            this.refs.toast.show("密码需为6-20个字母或数字")
            return
        }

        //设置新密码接口
        let url = 'mobile-api/findPasswordOrigin/findLoginPassword.html';
        let  params = {'username': this.props.userName,'newPassword': this.state.newPassword};
        console.log('账号和新密码',params)
        GBNetWorkService.post(url,params,null,this.newPwdSendSuccess,this.newPwdSendFail)
    }
    newPwdSendSuccess = (json) =>{
        console.log('设置新密码返回结果判断' , json)
        //成功  //TODO
        if(json.message==='请求成功'){
            // 关闭上上级弹窗 并 提示成功
            this.refs.toast.show('密码修改成功')
            setTimeout(()=>{
                this.closePopView()
                this.props.closeFinPword()
                this.props.closeSendYzm()
            },500)
            this.setState({newPassword:''})
        }else{
        // 失败
            this.refs.toast.show(json.message)
        }
    }
    newPwdSendFail = (json) =>{
        console.log('失败' , json)
    };

    // 保存新密码
    _changePwd = (value)=>{
        this.setState({
            newPassword:value
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
    showBlockOrNone1 = (state) => {
        let arr = [], index = 0;
        if (state === true) {
            arr.push(<FastImage key={index} style={{width: 25, height: 25,}}
                            source={require('../../static/images/icon_invisible.webp')}/>)
        } else {
            arr.push(<FastImage key={index + 1} style={{width: 25, height: 25}}
                            source={require('../../static/images/icon_visible.webp')}/>)
        }
        return arr
    }

    //失去焦点
    loadBlur=(input)=> {
        input.blur()
    }

    // 发送验证码
    contentView = () =>{
        return (
            <View style={styles.messageView}>
                <View style={styles.messageTxt}>
                    <View>
                        <Text style={styles.mesText}>账号：  {this.props.userName}</Text>
                        <View style={styles.pwdText}>
                            <Text style={styles.mesText}>新密码 </Text>
                            <TextInput style={styles.yzmInput} placeholder={"请输入新密码"}
                                       value={this.state.newPassword} onChangeText={this._changePwd}
                                       secureTextEntry={this.state.isBlock}
                                       placeholderTextColor='#ccc'
                                       ref={(c)=>this.newPassword=c}
                                       onEndEditing={()=>{this.loadBlur(this.newPassword)}}
                            />
                            <TouchableBounce style={styles.eyeImage} onPress={this.passwordBlock}>
                                <View>
                                    {this.showBlockOrNone1(this.state.isBlock)}
                                </View>
                            </TouchableBounce>
                        </View>
                    </View>
                </View>
                <View style={styles.btn}>
                    <TouchableBounce onPress={this.handleSure} style={styles.next}>
                        <FastImage style={styles.btnClick}
                                         resizeMode='stretch'
                                         source={ require('../../static/images/btn_menu.webp')}>
                            <Text style={styles.logText}>确定</Text>
                        </FastImage>
                    </TouchableBounce>
                </View>
            </View>
        )
    }

}

const styles = StyleSheet.create({
    messageView:{
        justifyContent:'center',
        alignItems: 'center'
    },
    messageTxt:{
        width:UIMacro.WIDTH_PERCENT*298,
        height:UIMacro.HEIGHT_PERCENT*116,
        backgroundColor:SkinsColor.messageTxt_bg,
        borderRadius:10,
        marginTop:UIMacro.HEIGHT_PERCENT*14,
        borderWidth: 1,
        borderColor:SkinsColor.bgTextViewStyle_border,
        alignItems:'center',
        justifyContent:'center'
    },
    yzmInput:{
        backgroundColor: SkinsColor.WelfareRecordDropDownHighLight_bg,
        borderRadius:5,
        width:UIMacro.WIDTH_PERCENT*180,
        height:UIMacro.HEIGHT_PERCENT*33,
        borderWidth:1,
        borderColor:SkinsColor.bgTextViewStyle_border,
        fontSize:10,
        padding: 0,
        color:'#fff',
        lineHeight: 33*UIMacro.HEIGHT_PERCENT,
        paddingLeft: 5
    },
    eyeImage: {
        position: 'absolute',
        top:5*UIMacro.HEIGHT_PERCENT,
        right: 10 * UIMacro.WIDTH_PERCENT,
    },
    mesText:{
        color:'#fff',
        fontSize:12,
        lineHeight:UIMacro.HEIGHT_PERCENT*33,
        marginLeft: 10*UIMacro.WIDTH_PERCENT
    },
    pwdText:{
        flexDirection: 'row',
    },
    btn:{
        flexDirection: 'row',
        justifyContent:'center',
        alignItems: 'center',
    },
    next:{
        marginLeft: 8*UIMacro.WIDTH_PERCENT,
    },
    btnClick: {
        width: 121*UIMacro.WIDTH_PERCENT,
        height: 45*UIMacro.HEIGHT_PERCENT,
        marginTop: 8*UIMacro.HEIGHT_PERCENT,
        marginBottom: 5*UIMacro.HEIGHT_PERCENT
    },
    logText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        height:45*UIMacro.HEIGHT_PERCENT,
        lineHeight:45*UIMacro.HEIGHT_PERCENT
    },
})