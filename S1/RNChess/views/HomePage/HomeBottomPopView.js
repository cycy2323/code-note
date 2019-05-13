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
    ImageBackground,
} from 'react-native';
import UIMacro from "../../core/UIMacro";
import MusicManager from "../MusicManager/MusicManager";
import LottieView from 'lottie-react-native';

type Props = {};
export default class HomeBottomPopView extends Component<Props> {
    constructor(pros) {
        super(pros);
        this.state = {
            dialogActiveStatus: false //弹窗状态 默认关闭
        }
    }

    render() {
        return (
            this.state.dialogActiveStatus &&
            <View style={styles.container} accessible={false}>
                <ImageBackground source={require('../../static/images/2.1.0/index_bg_menu.webp')}
                                 resizeMode='contain'
                                 style={styles.bigBackgoundImageStyle}>
                    {this.contentView()}

                </ImageBackground>
            </View>
        );
    }

    contentView() {
        return (
            <View style={{flexDirection: 'row'}}>
                {/*保险箱*/}
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

                {/*收益*/}
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
            </View>
        );
    }

    //打开弹窗
    showPopView = () => {
        this.setState({
            dialogActiveStatus: true
        })
    }

    //关闭弹窗
    closePopView = () => {
        this.setState({
            dialogActiveStatus: false
        })
    }
    onPressafeBox = () => {
        this.props.presSafeBox();
        this.closePopView();
        MusicManager.getInstance().playShowAlert();
    }
    onPressIncome = () => {
        this.props.incomePress();
        this.closePopView();
        MusicManager.getInstance().playShowAlert();
        this.props.setIncomeModalVisible();
    }
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        left: (UIMacro.SCREEN_WIDTH - (480 + 154.5) * UIMacro.SCREEN_FULL_PERCENT) / 4.0 + 480 * UIMacro.SCREEN_FULL_PERCENT - 195 * UIMacro.SCREEN_FULL_PERCENT,
        bottom: UIMacro.SCREEN_WIDTH>667?35 * UIMacro.HEIGHT_PERCENT:28 * UIMacro.HEIGHT_PERCENT
    },
    bigBackgoundImageStyle: {
        width: 162 * UIMacro.SCREEN_FULL_PERCENT,
        height: 105 * UIMacro.HEIGHT_PERCENT,
        alignItems: 'center'
    },
    contentViewStyle: {
        marginTop: 10,
    },
    btn_registerStyle: {
        width: 70 * UIMacro.SCREEN_FULL_PERCENT,
        height: 60 * UIMacro.HEIGHT_PERCENT,
        marginLeft: 5 * UIMacro.SCREEN_FULL_PERCENT,
        marginTop: 10 * UIMacro.HEIGHT_PERCENT
    },

});
