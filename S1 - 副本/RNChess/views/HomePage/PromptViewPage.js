import React, {Component} from 'react'
import {View, Text, StyleSheet, Dimensions, TextInput, ImageBackground, AsyncStorage, DeviceEventEmitter} from 'react-native'

import GBNetWorkService from "../../core/GBNetWorkService";
import UserInfo from "../../core/UserInfo";
import JPushModule from "jpush-react-native";
import SmallPopPage from '../../common/SmallPopPage'
import UIMacro from '../../core/UIMacro'
import TouchableBounce from "../../common/TouchableBounce";
import FastImage from 'react-native-fast-image'

const coHeight = 20

export default class PromptViewPage extends SmallPopPage {
    handleSure = () =>{
        this.props.showLoading1();
        //退出登录
        let url = 'mobile-api/mineOrigin/logout.html'
        GBNetWorkService.get(url,null,null,this.successLogout,this.failLogout)
    }
    handleCancel = ()=>{
        this.closePopView()
    }
    //退出登录
    successLogout = (json) =>{
        JPushModule.setAlias("",success => {});

        //退出登录清空用户名及福利
        DeviceEventEmitter.emit('rn_login_out');

        console.log('返回json数据' + JSON.stringify(json))
        UserInfo.username = null;
        UserInfo.withdrawAmount = null;
        UserInfo.isLogin = false;
        this.props.showLoading2();
        this.closePopView()
        this.props.setClosePersonal()
    }
    failLogout = (json) =>{

        DeviceEventEmitter.emit('rn_login_out');
        UserInfo.username = null ;
        UserInfo.withdrawAmount = null;
        UserInfo.isLogin = false;
    }

    //标题
    titleImage = ()=> {
        return (require('../../static/images/2.1.0/title03.webp'))
    }

    //重写弹框大小
    customWindowSize = ()=>{
        return {width:321*UIMacro.WIDTH_PERCENT,height:225*UIMacro.HEIGHT_PERCENT}
    }

    //重写弹框背景图
    popPageBackground = ()=>{
        return require('../../static/images/2.1.0/popups_prompt.webp');
    }

    contentView = () =>{
        return (
            <View style={styles.message}>
                <View style={styles.messageTxt}>
                    <Text style={styles.mesText}>确定退出吗？</Text>
                </View>
                <View style={styles.btn}>
                    <TouchableBounce onPress={this.handleCancel} style={styles.next}>
                        <FastImage style={styles.btnClick}
                                         resizeMode='contain'
                                         source={ require('../../static/images/2.1.0/btn_general.webp')}>
                            <Text style={styles.logText}>取消</Text>
                        </FastImage>
                    </TouchableBounce>
                    <TouchableBounce onPress={this.handleSure} style={styles.next}>
                        <FastImage style={styles.btnClick}
                                         resizeMode='contain'
                                         source={ require('../../static/images/2.1.0/btn_general.webp')}>
                            <Text style={styles.logText}>确定</Text>
                        </FastImage>
                    </TouchableBounce>
                </View>

            </View>
        )
    }
}

const styles = StyleSheet.create({
    message:{
        justifyContent:'center',
        alignItems:'center',
    },
    messageTxt:{
        flexDirection:'row',
        marginTop:UIMacro.HEIGHT_PERCENT*57,
        justifyContent:'center',
        alignItems: 'center',
    },
    mesText:{
        color:'rgba(255, 255, 255, 1)',
        textAlign:'center',
        fontSize:15,
    },
    btn:{
        flexDirection: 'row',
        justifyContent:'center',
        alignItems: 'center',
        marginTop:35*UIMacro.HEIGHT_PERCENT,
    },
    next:{
        // justifyContent:'center',
        // alignItems: 'center',
    },
    btnClick: {
        width: 118*UIMacro.WIDTH_PERCENT,
        height: 41*UIMacro.HEIGHT_PERCENT,
        marginLeft: 7*UIMacro.WIDTH_PERCENT,
        marginTop: 10*UIMacro.HEIGHT_PERCENT,
        justifyContent:'center',
    },
    logText: {
        color: '#fff',
        fontSize: 15,
        // fontWeight: 'bold',
        textAlign: 'center',
        height: 41 * UIMacro.HEIGHT_PERCENT,
        lineHeight: 41 * UIMacro.HEIGHT_PERCENT
    },
})