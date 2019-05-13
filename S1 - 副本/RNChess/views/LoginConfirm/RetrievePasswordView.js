import React, {Component} from 'react'
import {
    View,
    Text,
    StyleSheet,
    TextInput,
} from 'react-native'

import GBNetWorkService from "../../core/GBNetWorkService";
import Toast from "../../common/ToastView";
import UIMacro from "../../core/UIMacro";
import SkinsColor from "../../core/SkinsColor";
import TouchableBounce from '../../common/TouchableBounce'
import FastImage from 'react-native-fast-image'

export default class RetrievePasswordView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            ...this.state,
            checkPhoneData:'',
            modalVisible:false,
            phone:'',
            encryptedId:'',
            sendYzmIndex:0,
            userName:''
        }
    }

    // 点击下一步——查询账号是否有绑定手机号
    handleNext = () =>{
        //执行loading
        this.props.showLoading1()
        let url = 'mobile-api/findPasswordOrigin/findUserPhone.html';
        let params= {'username': this.state.userName};
        console.log('账号参数',params);
        GBNetWorkService.post(url, params, null, this._successBack, this._failBack)
    };
    _successBack = (json) => {
        // 关闭loading
        this.props.showLoading2()
        console.log('查账号是否绑定手机',json.data)
        if(json.data === null){
            this.refs.toast.show('账号有误')
        }else if(json.data.phone===null){
            this.props.concatServer()
        }else{
            this.setState({
                checkPhoneData:json.data,
                phone:json.data.phone,
                encryptedId:json.data.encryptedId,
                sendYzmIndex:1
            },()=>this.props.setSendYzm(this.state.sendYzmIndex,this.state.phone,this.state.userName))

        }
    }
    _failBack = (json) => {
        this.props.showLoading2()
        console.log("失败" + JSON.stringify(json))
    };

    //返回登录
    handleBack = () =>{
        this.props.isPhoneNum(false)
    }

    setuserNameChange = (bool) => {
        this.setState({userNameChange: bool})
    }

    //保存用户名
    handleChangeName = (msg) => {
        this.setState({
            userName:msg,
        })
    };

    //失去焦点
    loadBlur=(input)=> {
        input.blur()
    }

    //重写弹窗内容
    render (){
        return (
            <View style={styles.messageView}>
                <View style={styles.messageTxt}>
                    <Text style={styles.mesText}>用户名</Text>
                    <TextInput style={styles.passwordInput} placeholder='请输入用户名' value={this.state.userName}
                               onChangeText={this.handleChangeName} placeholderTextColor='rgba(170, 170, 170, 1)'
                               ref={(c)=>this.userNameAccount=c}
                               onEndEditing={()=>{this.loadBlur(this.userNameAccount)}}
                    />
                </View>
                <View style={styles.btnTxt}>
                    <TouchableBounce onPress={this.handleBack} style={styles.next}>
                        <FastImage style={styles.btnClick}
                                         resizeMode='stretch'
                                         source={ require('../../static/images/2.1.0/btn_menu.webp')}>
                            <Text style={styles.logText}>返回登录</Text>
                        </FastImage>
                    </TouchableBounce>
                    <TouchableBounce onPress={this.handleNext} style={styles.next}>
                        <FastImage style={styles.btnClick}
                                         resizeMode='stretch'
                                         source={ require('../../static/images/2.1.0/btn_menu.webp')}>
                            <Text style={styles.logText}>下一步</Text>
                        </FastImage>
                    </TouchableBounce>
                </View>
                <Toast
                    ref="toast"
                    style={{backgroundColor: 'white',marginTop:150*UIMacro.HEIGHT_PERCENT}}
                    fadeInDuration={300} fadeOutDuration={300}
                    opacity={1}
                    textStyle={{color: 'black'}}
                    key={0}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({

    messageView:{
        justifyContent:'center',
        alignItems: 'center',
        marginTop:95*UIMacro.HEIGHT_PERCENT,
    },
    messageTxt:{
        flexDirection:'row',
        // width:UIMacro.WIDTH_PERCENT*298,
        // height:UIMacro.HEIGHT_PERCENT*116,
        // backgroundColor:'#4757C6',
        borderRadius:10,
        marginTop:UIMacro.HEIGHT_PERCENT*14,
        alignItems:'center'
    },
    mesText:{
        color:'#fff',
        textAlign:'center',
        fontSize:12,
        marginLeft: 10*UIMacro.WIDTH_PERCENT
    },
    passwordInput:{
        backgroundColor: SkinsColor.textInput_bg,
        height:33*UIMacro.HEIGHT_PERCENT,
        width:197*UIMacro.WIDTH_PERCENT,
        borderRadius:5,
        marginLeft:8,
        color:'#AAAAA8',
        fontSize:12,
        padding: 0,
        paddingLeft: 10,
        borderWidth: 1,
        borderColor: SkinsColor.textInput_border
    },

    next:{
        justifyContent:'center',
        alignItems: 'center',
    },
    btnClick: {
        width: 121*UIMacro.WIDTH_PERCENT,
        height: 45*UIMacro.HEIGHT_PERCENT,
        marginLeft: 7*UIMacro.WIDTH_PERCENT,
        marginTop: 8*UIMacro.HEIGHT_PERCENT,
        marginBottom: 5*UIMacro.HEIGHT_PERCENT
    },
    logText: {
        color: '#fff',
        fontSize: 15,
        fontWeight: 'bold',
        textAlign: 'center',
        height:45*UIMacro.HEIGHT_PERCENT,
        lineHeight:45*UIMacro.HEIGHT_PERCENT
    },
    btnTxt:{
        flexDirection: 'row',
        marginTop:UIMacro.HEIGHT_PERCENT*65,
    },
})