/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    ImageBackground, AppState, BackHandler, DeviceEventEmitter,
} from 'react-native';
import UIMacro from "../../core/UIMacro";
import UserInfo from "../../core/UserInfo";
import MusicManager from "../MusicManager/MusicManager";
import Toast from "../../common/ToastView";
import LottieView from 'lottie-react-native';
import DeviveInfo from 'react-native-device-info';
import PopView from './HomeBottomPopView' ;
import GBNetWorkService from "../../core/GBNetWorkService";
import ImageUrlManager from "../../core/ImageUrlManager";
import FastImage from 'react-native-fast-image'

type Props = {};
export default class HomeBottomView extends Component<Props> {

    constructor(pros) {
        super(pros);
        this.state = {
            isShowMore: true, //弹窗状态 默认关闭
            getActivityMsgData: null,
            isOpenArray:new Object(),

        }
    }

    componentDidMount() {
        //监听登录成功获取活动开关信息
        this.deEmitter = DeviceEventEmitter.addListener('rn_login_success_refreshHomeBottom', () => {
           this.getActivityOpen();
        });
        //退出登录获取开关信息
        this.deEmitter1 = DeviceEventEmitter.addListener('rn_login_out', () => {
            this.getActivityOpen();
        });

        //未登录状态获取活动开关
        this.getActivityOpen();
        AppState.addEventListener('change', this.onAppStateChanged);
    }
    //获取活动开关
    getActivityOpen=()=>{
        GBNetWorkService.get("mobile-api/chess/getActivityMsg.html", null, null, this._getActivityMsgSuccessBack, this._getActivityMsgFailBack)
    }

    onAppStateChanged = () => {
        switch (AppState.currentState) {
            case "active":
                this.registerGiftAnimation && this.registerGiftAnimation.play();
                this.firstRechargeAnimation && this.firstRechargeAnimation.play();
                this.QuanMinTuiGuangAnimation && this.QuanMinTuiGuangAnimation.play();
                this.JiuJiJinAnimation && this.JiuJiJinAnimation.play();
                this.HongbaoAnimation && this.HongbaoAnimation.play();
                this.rechargeAnimation && this.rechargeAnimation.play();
                break;
            default:
        }
    }

    componentWillUnmount() {
        AppState.removeEventListener('change', this.onAppStateChanged);
        this.deEmitter.remove();
        this.deEmitter1.remove();
    }

    _getActivityMsgSuccessBack = (json) => {

        console.log("ActivityMsg成功:" + JSON.stringify(json));
        if (json.code === '0') {
            //将需要open展示的活动加入到数组中
            let paramsArray = new Object() ;
            //全民推广
            if (json.data.data.allRecommendedSwitch.open === 1) {
                paramsArray.allRecommendedSwitch=json.data.data.allRecommendedSwitch;
            }
            //红包
            if (json.data.data.redPacketSwitch.open === 1) {
                paramsArray.redPacketSwitch=json.data.data.redPacketSwitch;
            }
            //首存送
            if (json.data.data.rechargeSwitch.open === 1) {
                paramsArray.rechargeSwitch=json.data.data.rechargeSwitch;
            }
            //注册送
            if (json.data.data.registerSwitch.open === 1) {
                paramsArray.registerSwitch=json.data.data.registerSwitch;
            }
            //救济金
            if (json.data.data.rescueSwitch.open === 1) {
                paramsArray.rescueSwitch=json.data.data.rescueSwitch;
            }
            this.setState({
                getActivityMsgData: json.data.data,
                isOpenArray:paramsArray
            });
            console.log("isOpenArray-----:" + JSON.stringify(this.state.isOpenArray));
            //如果推荐奖励信息已开启,并且money>0,则弹出推荐奖励图片
            if(json.data.data.recommendSwitch.open === 1 && json.data.data.recommendSwitch.money >0){
                this.props.recommendImageSwitchFun(json.data.data.recommendSwitch.money);
            }
        }
    };
    _getActivityMsgFailBack = (json) => {
        console.log("ActivityMsg失败:" + JSON.stringify(json));
    };

    render() {
        const deviceName = DeviveInfo.getModel();
        let BottomHeight =
            deviceName === 'iphone x' || deviceName === 'iPhone XS' || deviceName === 'iPhone XS Max' ?
                30 * UIMacro.HEIGHT_PERCENT : 18 * UIMacro.HEIGHT_PERCENT;
        console.log('BottomHeight:' + BottomHeight);
        return (
            <View style={styles.container}>
                <FastImage style={styles.bottomBgImageStyle}
                                 resizeMode='stretch'
                                 source={require('../../static/images/2.1.0/footer.webp')}>
                </FastImage>
                <View style={{
                    position: 'absolute', height: 45, flexDirection: 'row', justifyContent: 'space-between',
                    paddingRight: 15 * UIMacro.HEIGHT_PERCENT,//长屏手机,充值图标超出屏幕右边
                    paddingLeft: 15 * UIMacro.HEIGHT_PERCENT,//长屏手机,充值图标超出屏幕右边
                    left: 0,
                    right: 0
                }}>
                    <View style={{flexDirection: 'row'}}>
                        {/*注册送*/}
                        {this.state.isOpenArray && this.state.isOpenArray.registerSwitch
                        &&
                        <TouchableOpacity style={[styles.btn_registerStyle]}
                                          onPress={() => this.onPressOpenRegisterImage()}>
                            <LottieView
                                style={{
                                    flex: 1
                                }}
                                source={require('../../static/animation/zhucesong/zhucesong.json')}
                                imageAssetsFolder={'lottie/zhucesong/images'}
                                ref={animation => {
                                    this.registerGiftAnimation = animation;
                                }}
                                autoPlay
                                loop
                            >
                            </LottieView>
                        </TouchableOpacity>
                        }

                        {/*首存送*/}
                        {this.state.isOpenArray && this.state.isOpenArray.rechargeSwitch
                            &&
                        <TouchableOpacity style={[styles.btn_registerStyle]}
                                          onPress={() => this.onPressOpenRechargeImage()}>
                            <LottieView
                                style={{
                                    flex: 1
                                }}
                                source={require('../../static/animation/shoucunsong/shoucunsong.json')}
                                imageAssetsFolder={'lottie/shoucunsong/images'}
                                ref={animation => {
                                    this.firstRechargeAnimation = animation;
                                }}
                                autoPlay
                                loop
                            >
                            </LottieView>
                        </TouchableOpacity>
                        }

                        {/*全民推广*/}
                        {this.state.isOpenArray && this.state.isOpenArray.allRecommendedSwitch
                        &&
                        <TouchableOpacity style={[styles.btn_registerStyle]}
                                          onPress={() => this.onPressQuanMinTuiGuang()}>
                            <LottieView
                                style={{
                                    flex: 1
                                }}
                                source={require('../../static/animation/quanmintuiguang/quanmintuiguang.json')}
                                imageAssetsFolder={'lottie/quanmintuiguang/images'}
                                ref={animation => {
                                    this.QuanMinTuiGuangAnimation = animation;
                                }}
                                autoPlay
                                loop
                            >
                            </LottieView>
                        </TouchableOpacity>
                        }

                        {/*救济金*/}
                        {this.state.isOpenArray && this.state.isOpenArray.rescueSwitch
                            &&
                        <TouchableOpacity style={[styles.btn_registerStyle]} onPress={() => this.onPressOpenRescueImage()}>
                            <LottieView
                                style={{
                                    flex: 1
                                }}
                                source={require('../../static/animation/jiuyuanjin/jiuyuanjin.json')}
                                imageAssetsFolder={'lottie/jiuyuanjin/images'}
                                ref={animation => {
                                    this.JiuJiJinAnimation = animation;
                                }}
                                autoPlay
                                loop
                            >
                            </LottieView>
                        </TouchableOpacity>
                        }

                        {/*抢红包*/}
                        {this.state.isOpenArray && this.state.isOpenArray.redPacketSwitch
                            &&
                        <TouchableOpacity style={[styles.btn_registerStyle]} onPress={() => this.onPressHongbao(this.state.isOpenArray.redPacketSwitch.activityId)}>
                            <LottieView
                                style={{
                                    flex: 1
                                }}
                                source={require('../../static/animation/hongbao3/hongbao3.json')}
                                imageAssetsFolder={'lottie/hongbao3/images'}
                                ref={animation => {
                                    this.HongbaoAnimation = animation;
                                }}
                                autoPlay
                                loop
                            >
                            </LottieView>
                        </TouchableOpacity>
                        }
                        {/*保险箱*/}
                        {Object.getOwnPropertyNames(this.state.isOpenArray).length <= 4
                        &&
                        <TouchableOpacity style={[styles.btn_registerStyle]} onPress={() => this.onPressafeBox()}>
                            <LottieView
                                style={{
                                    flex: 1
                                }}
                                source={require('../../static/animation/baoxianxiang/baoxianxiang.json')}
                                imageAssetsFolder={'lottie/baoxianxiang/images'}
                                ref={animation => {
                                    this.safeBoxAnimation = animation;
                                }}
                                autoPlay
                                loop
                            >
                            </LottieView>
                        </TouchableOpacity>
                        }

                        {/*收益*/}
                        {Object.getOwnPropertyNames(this.state.isOpenArray).length<=4
                        &&
                        <TouchableOpacity style={[styles.btn_registerStyle]} onPress={() => this.onPressIncome()}>
                            <LottieView
                                style={{
                                    flex: 1
                                }}
                                source={require('../../static/animation/shouyi/shouyi.json')}
                                imageAssetsFolder={'lottie/shouyi/images'}
                                ref={animation => {
                                    this.incomeAnimation = animation;
                                }}
                                autoPlay
                                loop
                            >
                            </LottieView>
                        </TouchableOpacity>
                        }

                        {/*更多*/}
                        {Object.getOwnPropertyNames(this.state.isOpenArray).length===5
                            &&
                        <TouchableOpacity style={styles.btn_registerStyle} onPress={() => this.onPressMore()}>
                            <FastImage style={styles.btn_moreStyle}
                                   resizeMode='contain'
                                   source={require('../../static/images/2.1.0/btn_more.webp')}/>
                        </TouchableOpacity>
                        }
                    </View>


                    {/*充值*/}
                    <TouchableOpacity style={[styles.btn_rechargeStyle]} onPress={() => this.onPressRecharge()}>
                        <LottieView
                            style={{
                                width: 164 * UIMacro.SCREEN_FULL_PERCENT,
                                height: 57 * UIMacro.HEIGHT_PERCENT
                            }}
                            source={require('../../static/animation/recharge/recharge.json')}
                            imageAssetsFolder={'lottie/recharge/images'}
                            ref={animation => {
                                this.rechargeAnimation = animation;
                            }}
                            autoPlay
                            loop
                        >
                        </LottieView>
                    </TouchableOpacity>


                </View>
                {/*提示框*/}
                <Toast
                    ref="toast"
                    style={{backgroundColor: 'white', marginTop: -50 * UIMacro.WIDTH_PERCENT, position: 'absolute'}}
                    fadeInDuration={300}
                    fadeOutDuration={300}
                    opacity={1}
                    textStyle={{color: 'black'}}
                />
                {/*个人中心*/}
                <PopView ref={(c) => this.popView = c} setIncomeModalVisible={this.setIncomeModalVisibles}
                         presSafeBox={this.presSafeBox}
                         incomePress={this.incomePress}
                />
            </View>
        );
    }

    //收益
    setIncomeModalVisibles = () => {
        this.props.setIncomeModalVisible();
    }

    //点击首页活动入口
    onPressPromt = (val) => {
        if (UserInfo.isLogin === false) {
            this.props.openLoginConfirm()
        } else {
            this.props.onPressPromt(val)
        }
    }
    //点击注册送进入注册页面
    onPressOpenRegisterImage = () => {
        let imgSource;
        if(this.state.isOpenArray.registerSwitch.img==='regist_send_1'){
            imgSource = require("../../static/images/2.1.0/bg_registered1.webp")
        }else if(this.state.isOpenArray.registerSwitch.img==='regist_send_2'){
            imgSource = require("../../static/images/2.1.0/bg_registered2.webp")
        }else{
            imgSource = require("../../static/images/2.1.0/bg_registered3.webp")
        }
        if (UserInfo.isLogin === false) {
            this.props.registerImageSwitchFun(imgSource);
        }
    };

    //点击救济金展示活动图片
    onPressOpenRescueImage = () => {
        let imgSource;
        let activityId = this.state.isOpenArray.rescueSwitch.activityId;
        if(this.state.isOpenArray.rescueSwitch.img==='relief_fund_1'){
            imgSource = require("../../static/images/2.1.0/bg_rescue1.webp")
        }else if(this.state.isOpenArray.rescueSwitch.img==='relief_fund_2'){
            imgSource = require("../../static/images/2.1.0/bg_rescue2.webp")
        }else{
            imgSource = require("../../static/images/2.1.0/bg_rescue3.webp")
        }
        if (UserInfo.isLogin === false) {
            this.props.openLoginConfirm();
        }else {
            this.props.rescueImageSwitchFun(imgSource,activityId);
        }
    }

    //点击首存送展示活动图片
    onPressOpenRechargeImage = () => {
        let imgSource;
        let activityId = this.state.isOpenArray.rechargeSwitch.activityId;
        if(this.state.isOpenArray.rechargeSwitch.img==='first_deposit_1'){
            imgSource = require("../../static/images/2.1.0/bg_deposit1.webp")
        }else if(this.state.isOpenArray.rechargeSwitch.img==='first_deposit_2'){
            imgSource = require("../../static/images/2.1.0/bg_deposit2.webp")
        }else{
            imgSource = require("../../static/images/2.1.0/bg_deposit3.webp")
        }
        if (UserInfo.isLogin === false) {
            this.props.openLoginConfirm();
        }else {
            this.props.rechargeImageSwitchFun(imgSource,activityId);
        }
    }

    //全民推广
    onPressQuanMinTuiGuang = () => {
        this.props.setTuiGuangVisible();
    }

    //抢红包
    onPressHongbao = () => {
        if (UserInfo.isLogin === false) {
            this.props.openLoginConfirm()
        } else {
            this.props.openRedPag();
        }
    }


    //充值
    onPressRecharge = () => {
        MusicManager.getInstance().playShowAlert();
        this.props.setRechargeCenterModalVisible();
    }
    //保险箱
    presSafeBox = () => {
        this.setState({
            isShowMore: true,
        })
        if (UserInfo.isLogin === false) {
            this.props.openLoginConfirm()
        } else {
            this.refs.toast.show('功能开发中');
        }
    }
    //收益
    incomePress = () => {
        this.setState({
            isShowMore: true,
        })
    }

    onPressafeBox = () => {
        this.presSafeBox();
        MusicManager.getInstance().playShowAlert();
    }
    onPressIncome = () => {
        this.incomePress();
        MusicManager.getInstance().playShowAlert();
        this.setIncomeModalVisibles();
    }

    //更多
    onPressMore = () => {
        if (this.state.isShowMore) {
            this.popView.showPopView();
            this.setState({
                isShowMore: false,
            })
        } else {
            this.popView.closePopView()
            this.setState({
                isShowMore: true,
            })
        }
    }

    //点击底部红包按钮，首页传回来的方法，红包次数获取异常  非正常code 提示错误信息
    showRedPagMessage=(msg)=>{
        this.refs.toast.show(msg);
    }

}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        height: 45 * UIMacro.HEIGHT_PERCENT,
        flex: 1,
        marginTop: 9 * UIMacro.HEIGHT_PERCENT,
    },
    bottomBgImageStyle: {
        flex: 1,
        height: 29 * UIMacro.HEIGHT_PERCENT,
        flexDirection: 'row',
    },

    btn_registerStyle: {
        width: 70 * UIMacro.SCREEN_FULL_PERCENT,
        height: 60 * UIMacro.HEIGHT_PERCENT,
        // backgroundColor: 'red',
        marginLeft: 2.5 * UIMacro.SCREEN_FULL_PERCENT,
        bottom: 40 * UIMacro.HEIGHT_PERCENT, // iphone x  30*UIMacro.HEIGHT_PERCENT,
    },

    btn_rechargeStyle: {
        bottom: 30 * UIMacro.HEIGHT_PERCENT, // iphone x  30*UIMacro.HEIGHT_PERCENT,
        // marginLeft: 100,
        // marginRight: 40,
    },
    btn_moreStyle: {
        marginTop: 18,
        marginLeft: 5
    },
});
