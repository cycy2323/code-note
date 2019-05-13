import {Component} from "react";
import {
    StyleSheet,
    View,
    WebView,
    DeviceEventEmitter,
} from 'react-native';
import React from "react";
import GameWebViewMenuView from './GameWebViewMenuView'
import MusicManager from '../MusicManager/MusicManager'
import DeviceInfo from 'react-native-device-info';
import UIMacro from "../../core/UIMacro";
import GameWebViewPage from './GameWebViewPage'

let canGoback = false;

type Props = {};
export default class GameWebView extends Component<Props> {

    gobackHomeCallBack = () => {
        this.gameWebViewPage.showPopView()
    }

    goHome = () => {
        const {navigation} = this.props;
        navigation.pop();
        MusicManager.getInstance().playBGM();
        DeviceEventEmitter.emit('RefreshUserBalance', 'RefreshUserBalance'); //刷新余额
    }

    gobackCallBack = () => {
        if (canGoback) {
            this.webView.goBack()
        }
        else {
            this.gameWebViewPage.showPopView()
        }
    }
    goreloadCallBack = () => {
        this.webView.reload()
    }

    onNavigationStateChange = (e) => {
        canGoback = e.canGoBack;
    }

    render() {
        //获取系统版本号
        const version = DeviceInfo.getSystemVersion();
        const {navigation} = this.props;
        const url = navigation.getParam('url');
        console.log("加载的游戏:" + url);
        return (
            <View style={{flex: 1}}>
                <WebView
                    style={{backgroundColor: 'white', flex: 1}}
                    source={{uri: url}}
                    mixedContentMode="always"
                    useWebKit={parseFloat(version) < 10.0 ? false : true}
                    ref={(c) => this.webView = c}
                    onNavigationStateChange={this.onNavigationStateChange}
                />
                <GameWebViewMenuView gobackHomeCallBack={this.gobackHomeCallBack}
                                     gobackCallBack={this.gobackCallBack}
                                     goreloadCallBack={this.goreloadCallBack}
                />
                <GameWebViewPage onRightPress={() => {
                    this.gameWebViewPage.closePopView()
                }}
                                 onLeftPress={this.goHome}
                                 ref={(c) => this.gameWebViewPage = c}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({})
