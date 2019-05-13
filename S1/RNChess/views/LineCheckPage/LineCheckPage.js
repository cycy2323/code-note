/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {
    Dimensions,
    Platform,
    StatusBar,
    StyleSheet,
    Text,
    View,
    ImageBackground,
    NativeEventEmitter,//原生模块需要
    NativeModules,//原生模块需要
     Alert,
} from 'react-native';
import Orientation from 'react-native-orientation';
import GBServiceParam from '../../core/GBServiceParam';
import SliderView from '../../common/SilderView' ;
import * as Progress from 'react-native-progress';
import UIMacro from "../../core/UIMacro";
import {TalkingDataAppAnalytics} from '../../core/TalkingDataAppAnalytics'
import TouchableBounce from "../../common/TouchableBounce";


const RNLineCheckManager = NativeModules.RNLineCheckManager;

type Props = {};
export default class LineCheckPage extends Component<Props> {
    state = {
        checkStatus: 0,
        progressValue: 0, //检测进度
        checkErrorCode: 0, //1- 2- 3- 错误码
    };

    componentWillMount() {
        this.isMounted = false
    }

    componentDidMount() {
        this.isMounted = true

        //21 18等不走线路检测的站点
        //加上__DEV__判断防止测试环境的代码更新到release环境
        let testMode = true;//不走线路检测时设置为true
        //18
        //7wt3
        //1d497c482250b85debcaff3b9099d469
        //test18.ampinplayopt0matrix.com

        //21
        //wjbn
        //f0581a9da25c2476d18f7675362f596c
        //test01.ccenter.test.so
        if (__DEV__ &&testMode)
        // if (testMode)
        {
            //其他不需要走线路检测的站点直接写配置即可
            GBServiceParam.currentHttpType = "http";
            GBServiceParam.currentPort = "";
            GBServiceParam.currentIP = "192.168.0.92";
            GBServiceParam.currentHost = "test18.ampinplayopt0matrix.com"
            GBServiceParam.currentPreUrl = "http://192.168.0.92";
            GBServiceParam.siteId = "18";
            GBServiceParam.siteCode = "7wt3";
            GBServiceParam.siteS = "1d497c482250b85debcaff3b9099d469";
            GBServiceParam.siteRecommendUserInputCode = "";
            GBServiceParam.siteJpushAppkey = "";

            this.updateCheckStatus(0, 1.0);
            this.updateCheckStatus(1, 1);
        }
        else
        {
            /////////////
            // 原生模块
            // 注册原生模块线路检测回调
            const RNLineCheckManagerEmitter = new NativeEventEmitter(RNLineCheckManager);
            const progressSubscription = RNLineCheckManagerEmitter.addListener('RNLineCheckProgress', (progress) => {
                this.updateCheckStatus(0, progress);
            });

            const completeSubscription = RNLineCheckManagerEmitter.addListener('RNLineCheckComplete', (data) => {
                console.log("检测完成:" + JSON.stringify(data));
                GBServiceParam.currentHttpType = data.currentHttpType;
                GBServiceParam.currentPort = data.currentPort;
                GBServiceParam.currentIP = data.currentIP;
                GBServiceParam.currentHost = data.currentHost;
                GBServiceParam.currentPreUrl = data.currentPreUrl;
                GBServiceParam.siteId = data.siteId;
                GBServiceParam.siteCode = data.siteCode;
                GBServiceParam.siteS = data.siteS;
                GBServiceParam.siteRecommendUserInputCode = data.siteRecommendUserInputCode;
                GBServiceParam.siteJpushAppkey = data.siteJpushAppkey;
                this.updateCheckStatus(1, 1);
            });

            const failedSubscription = RNLineCheckManagerEmitter.addListener('RNLineCheckFailed', (errCode) => {
                console.log("检测失败:" + errCode);
                this.updateCheckStatus(-1, 0);
                this.setState({
                    checkErrorCode: errCode
                })
            });
            //开始检测线路
            //////
            //原生模块
            //调用线路检测方法
            //  ty3a     e1576bc75aabd600d0b6b078af7a96a3 7001
            //  lcat     54f9540412e52a4b43aefb0b461bf043 7002
            // 站点参数的配置 iOS 在原生项目sitesConfig.json里面配置
            //              Android 在原生项目 assets/sitesConfig/sitesConfig.json 里面配置
            RNLineCheckManager.startLineCheck();
        }
    }


    updateCheckStatus = (status, progress) => {
        this.setState({
            checkStatus: status,
            progressValue: progress,
        })
    }

    render() {
        console.log("线路检测render")
        return (
            <ImageBackground
                source={{uri: Platform.OS === 'ios' ? "app_launchbg_chess.jpg" : "app_launchbg_chess"}}
                style={styles.bgImageStyle}>
                {this.bottomView(this.state.checkStatus, this.state.progressValue)}
            </ImageBackground>
        )
    }


    bottomView = (checkStatus, progress) => {
        //检测中
        if (checkStatus === 0) {
            return (
                <View style={styles.bottomContainerViewStyle}>
                    <Text style={styles.longTextStyle}>正在匹配服务器，请稍后...</Text>
                    <SliderView progress={progress}/>
                </View>
            )
        }
        else if (checkStatus === 1) {
            //检测通过
            this.timer=setTimeout(()=>this.props.navigation.navigate('HomePage'),1*1000);
            return (
                <View style={styles.bottomContainerViewStyle}>
                    <Text style={styles.longTextStyle}>检测完成，即将进入...</Text>
                    <SliderView progress={progress}/>
                </View>
            )
        }
        //检测失败
        else if (checkStatus === -1) {
            return (
                <View style={styles.bottomContainerViewStyle}>
                    <View style={styles.topViewStyle}>
                        <TouchableBounce style={styles.checkBtnStyle} onPress={() => this.lineCheckBtnClick()}>
                            <Text style={styles.textStyle}>线路检测</Text>
                        </TouchableBounce>

                        <TouchableBounce style={styles.checkBtnStyle} onPress={() => this.checkResult()}>
                            <Text style={styles.textStyle}>检测结果</Text>
                        </TouchableBounce>
                    </View>
                    <SliderView progress={0}/>
                </View>
            )
        }
    };

    //线路检测按钮
    lineCheckBtnClick = () => {
        RNLineCheckManager.startLineCheck();
        this.setState({
            checkStatus: 0,
            progressValue: 0
        })
    };

    //检测结果按钮
    checkResult = () => {
        let title = '';
        let msg = '';
        if (this.state.checkErrorCode === 1) {
            title = '网络连接失败';
            msg = '网络连接失败，请确认您的网络连接正常后再次尝试！';
        } else if (this.state.checkErrorCode === 2) {
            title = '线路获取失败';
            msg = '线路获取失败，请确认您的网络连接正常后再次尝试！';
        } else if (this.state.checkErrorCode === 3) {
            title = '服务器连接失败';
            msg = '出现未知错误，请联系在线客服并提供以下信息:';
        }
        Alert.alert(
            title,
            msg,
            [
                {text: '关闭', style: 'cancel'},
            ],
            {cancelable: false}
        )
    }

    componentWillUnmount() {
        clearInterval(this.timer)
        this.isMounted = false;

    }

}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#F5FCFF',
    },
    bgImageStyle: {
        flex:1,
        resizeMode: 'cover',
    },
    bottomContainerViewStyle: {
        justifyContent: 'center',
        alignItems:'center',
        bottom: -UIMacro.SCREEN_HEIGHT + 70,
    },
    longTextStyle: {
        color: '#fff',
        textAlign: 'center',
        height:30
    },
    textStyle: {
        color: '#fff',
        textAlign: 'center',
        lineHeight:30
    },
    topViewStyle: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width:200
    },
    checkBtnStyle: {
        width:80,
        height:30,
        backgroundColor: '#44A22D',
        borderRadius:15,
    },
    progressViewStyle: {
        width: UIMacro.SCREEN_WIDTH * 0.5,
        left: UIMacro.SCREEN_WIDTH * 0.25,
    },
});
