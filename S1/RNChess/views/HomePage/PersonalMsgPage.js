import React, {Component} from 'react'
import {View, Text,  StyleSheet, Dimensions, TextInput,  Clipboard,
     ImageBackground, DeviceEventEmitter} from 'react-native'

import PromptViewPage from './PromptViewPage'
import SettingViewPage from './SettingViewPage'
import UserInfo from '../../core/UserInfo' ;
import SmallPopPage from '../../common/SmallPopPage'
import LoadingView from "../Loading/LoadingView";
import UIMacro from "../../core/UIMacro";
import Toast from "../../common/ToastView";
import SkinsColor from "../../core/SkinsColor";
import GBNetWorkService from "../../core/GBNetWorkService";
import TouchableBounce from "../../common/TouchableBounce";
import FastImage from 'react-native-fast-image'


export default class PersonalMsgPage extends SmallPopPage {
    constructor(pros) {
        super(pros);
        this.state = {
            ...this.state,
            avatar:require('../../static/images/2.1.0/visitor.webp'),
            sex:'',
            tjmCode:'无',
            officialUrl:'无'
        }
    }

    handleOut = () =>{
        this.props.openPersonalView()
    }

    //设置弹窗
    handleSetting = ()=>{
        this.props.openSetting()
    }


    renderPage = ()=>{
        return (
            [
                <Toast
                    ref="toast"
                    style={{backgroundColor: 'white',marginTop:250*UIMacro.HEIGHT_PERCENT}}
                    fadeInDuration={300}
                    fadeOutDuration={1000}
                    opacity={1}
                    textStyle={{color: 'black'}}
                    key={0}
                />
            ]
        )
    }
    //标题
    titleImage = ()=> {
        return (require('../../static/images/2.1.0/title04.webp'))
    }

    //重写弹框大小
    customWindowSize = ()=>{
        return {width:321*UIMacro.WIDTH_PERCENT,height:249*UIMacro.HEIGHT_PERCENT}
    }

    //重写弹框背景图
    popPageBackground = ()=>{
        return require('../../static/images/2.1.0/popups_infor.webp');
    }

    handleCopy1 = () =>{
        Clipboard.setString(this.state.tjmCode)
        this.refs.toast.show('复制成功')
        // let str = await Clipboard.getString()

    }
    handleCopy2 = () =>{
        Clipboard.setString(this.state.officialUrl)
        this.refs.toast.show('复制成功')
    }

    pageDidClose = () =>{
        this._isMounted = false
    }
    pageDidShow = () =>{
        this._isMounted = true
        GBNetWorkService.get("mobile-api/allPersonRecommend/getMineInfo.html", null, null, this._getMineInfoSuccessBack, this._getMineInfoFailBack)
    }
    _getMineInfoSuccessBack = (json) =>{
        console.log('tjm---',json);
        if(json.code==='0'){
            this.setState({
                tjmCode:json.data.shareCode,
                officialUrl:json.data.siteUrl
            })
        }
    }
    _getMineInfoFailBack = (json) =>{
        console.log('getMineInfo 失败',json);
    }

    //重写弹窗内容
    contentView = () =>{
        return (
            <View style={styles.message}>
                <View style={{flexDirection:'row'}}>
                <View style={styles.leftViews}>
                    <FastImage  style={styles.personalImg}
                            resizeMode='contain'
                            source={UserInfo.avatarUrl}/>
                    <Text style={styles.IDText}>ID {UserInfo.username}</Text>
                    <View style={styles.timeBox}>
                        <Text style={styles.logTime}>最近登录时间</Text>
                        <Text numberOfLines={0} style={[styles.logTime,styles.localTime]}>{UserInfo.lastLoginTime}</Text>
                    </View>

                </View>

                <View style={styles.rightViews}>
                    <View style={styles.rightUp}>
                        <View style={styles.fuliBox}>
                            <FastImage  style={styles.fuli}
                                    resizeMode='contain'
                                    source={require('../../static/images/2.1.0/personal_title_fuli.webp')}/>
                            <Text style={styles.fuliText}>{UserInfo.isLogin===false ? '0.00' : UserInfo.isDot(UserInfo.walletBalance)}</Text>
                        </View>
                        <View style={styles.fuliBox}>
                            <FastImage  style={styles.fuli}
                                    resizeMode='contain'
                                    source={require('../../static/images/2.1.0/personal_title_safe.webp')}/>
                            <Text style={styles.fuliText}>0.00</Text>
                        </View>
                    </View>
                    <View style={styles.rightDown}>
                        <View style={styles.copyBox}>
                            <FastImage  style={styles.fuli}
                                    resizeMode='contain'
                                    source={require('../../static/images/2.1.0/personal_title_code.webp')}/>
                            <View style={styles.tjmBox}>
                                <Text style={styles.tjmTxt}>{this.state.tjmCode}</Text>
                                <TouchableBounce onPress={this.handleCopy1} style={styles.bgCopy}>
                                    <ImageBackground style={styles.btnCopy}
                                                     resizeMode='contain'
                                                     source={ require('../../static/images/2.1.0/btn_blue_small.webp')}>
                                        <Text style={styles.copyText}>复制</Text>
                                    </ImageBackground>
                                </TouchableBounce>
                            </View>
                            <FastImage  style={styles.fuliImg}
                                    resizeMode='contain'
                                    source={require('../../static/images/2.1.0/personal_title_url.webp')}/>
                            <View style={styles.tjmBox}>
                                <Text numberOfLines={1} style={styles.official}>{this.state.officialUrl}</Text>
                                <TouchableBounce onPress={this.handleCopy2} style={styles.bgCopy}>
                                    <ImageBackground style={styles.btnCopy}
                                                     resizeMode='contain'
                                                     source={ require('../../static/images/2.1.0/btn_blue_small.webp')}>
                                        <Text style={styles.copyText}>复制</Text>
                                    </ImageBackground>
                                </TouchableBounce>
                            </View>
                        </View>
                    </View>
                </View>
                </View>
                           {/*<Text style={styles.roundedText}>仓库福利</Text>*/}
                           {/*<Text style={styles.roundedText}>{UserInfo.isLogin===true ? '0.00' : '---'}</Text>*/}

                <View style={styles.btn}>
                    <TouchableBounce onPress={this.handleOut} style={styles.next}>
                        <FastImage style={styles.btnClick}
                                         resizeMode='contain'
                                         source={ require('../../static/images/2.1.0/btn_general.webp')}>
                            <Text style={styles.logText}>退出</Text>
                        </FastImage>
                    </TouchableBounce>
                    <TouchableBounce onPress={this.handleSetting} style={styles.next}>
                        <FastImage style={styles.btnClick}
                                         resizeMode='contain'
                                         source={ require('../../static/images/2.1.0/btn_general.webp')}>
                            <Text style={styles.logText}>设置</Text>
                        </FastImage>
                    </TouchableBounce>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({

    message:{
        alignItems:'center',
    },
    leftViews:{
       width:UIMacro.WIDTH_PERCENT*106,
       height:UIMacro.HEIGHT_PERCENT*136,
        marginTop:UIMacro.HEIGHT_PERCENT*15,
        marginLeft:UIMacro.WIDTH_PERCENT*-1,
        backgroundColor:'rgba(0, 0, 0, .2)',
        borderRadius: 5,
    },
    personalImg:{
        width:65*UIMacro.WIDTH_PERCENT,
        height:65*UIMacro.HEIGHT_PERCENT,
        marginTop:4*UIMacro.HEIGHT_PERCENT,
        marginLeft:21*UIMacro.WIDTH_PERCENT,
    },
    IDText:{
        marginTop:5*UIMacro.HEIGHT_PERCENT,
        marginLeft:21*UIMacro.WIDTH_PERCENT,
        fontSize:10,
        color:SkinsColor.IDText,
        marginBottom: 10*UIMacro.HEIGHT_PERCENT,
    },
    timeBox:{
        width:100*UIMacro.WIDTH_PERCENT,
        height:22*UIMacro.HEIGHT_PERCENT,
        alignItems:'center',
        justifyContent:'center'
    },
    logTime:{
        fontSize:10,
        color:SkinsColor.logTime,
        textAlign:'center',
    },
    localTime:{
        marginTop:5*UIMacro.HEIGHT_PERCENT,
    },
    rightViews:{
        width:182*UIMacro.WIDTH_PERCENT,
        marginTop:UIMacro.HEIGHT_PERCENT*15,
        marginLeft:UIMacro.WIDTH_PERCENT*2,
    },
    rightUp:{
        height:49*UIMacro.HEIGHT_PERCENT,
        backgroundColor:'rgba(0, 0, 0, .2)',
        borderRadius: 5,
    },
    fuliBox:{
        flexDirection:'row',
        marginTop:UIMacro.HEIGHT_PERCENT*7,
        marginLeft:UIMacro.WIDTH_PERCENT*7,
    },
    fuli:{
        width:43*UIMacro.WIDTH_PERCENT,
        height:15*UIMacro.HEIGHT_PERCENT,
        marginTop:1*UIMacro.HEIGHT_PERCENT
    },
    fuliText:{
        color:'#FEFEFE',
        fontSize:12,
        width:62*UIMacro.WIDTH_PERCENT,
        height:15*UIMacro.HEIGHT_PERCENT,
        lineHeight: 15*UIMacro.HEIGHT_PERCENT,
    },
    rightDown:{
        width:182*UIMacro.WIDTH_PERCENT,
        height:87*UIMacro.HEIGHT_PERCENT,
        backgroundColor:'rgba(0, 0, 0, .2)',
        borderRadius: 5,
        marginTop:UIMacro.HEIGHT_PERCENT*2,
    },
    copyBox:{
        marginTop:UIMacro.HEIGHT_PERCENT*7,
        marginLeft:UIMacro.WIDTH_PERCENT*7,
    },
    tjmBox:{
        flexDirection:'row',
    },
    tjmTxt:{
        width:91*UIMacro.WIDTH_PERCENT,
        height:15*UIMacro.HEIGHT_PERCENT,
        marginTop:UIMacro.HEIGHT_PERCENT*3,
        marginLeft:UIMacro.WIDTH_PERCENT*5,
        fontSize:12,
        color:'#FFF',
    },
    fuliImg:{
        width:55*UIMacro.WIDTH_PERCENT,
        height:14*UIMacro.HEIGHT_PERCENT,
        marginTop:UIMacro.HEIGHT_PERCENT*5,
    },
    official:{
        width:105*UIMacro.WIDTH_PERCENT,
        height:15*UIMacro.HEIGHT_PERCENT,
        marginLeft:UIMacro.WIDTH_PERCENT*5,
        fontSize:12,
        color:'#FFF',
        textDecorationLine:'underline'
    },
    bgCopy:{
        alignItems: 'center',
        justifyContent: 'center',
        position:'absolute',
        right:5*UIMacro.WIDTH_PERCENT,
    },
    btnCopy:{
        width: 56*UIMacro.WIDTH_PERCENT,
        height: 24*UIMacro.HEIGHT_PERCENT,
    },
    copyText:{
      color:'#FFF',
      fontSize:12,
      textAlign: 'center',
        lineHeight: 24*UIMacro.HEIGHT_PERCENT,
    },
    btn: {
        marginTop:-5*UIMacro.HEIGHT_PERCENT,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft:9*UIMacro.WIDTH_PERCENT,
        marginBottom:5*UIMacro.HEIGHT_PERCENT
    },
    next:{
        justifyContent:'center',
        alignItems: 'center',
    },
    btnClick: {
        width: 118*UIMacro.WIDTH_PERCENT,
        height: 41*UIMacro.HEIGHT_PERCENT,
        marginRight: 6*UIMacro.WIDTH_PERCENT,
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