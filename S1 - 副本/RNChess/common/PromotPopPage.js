/**
 * 首页活动全屏弹框
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, View, TouchableOpacity, Text, Modal} from 'react-native';
import UIMacro from '../core/UIMacro'
import FastImage from 'react-native-fast-image'

type Props = {};
export default class PromotPopPage extends Component<Props> {
    constructor(pros) {
        super(pros);
        this.state = {
            dialogActiveStatus: false //弹窗状态 默认关闭
        }
    }

    //页面打开回调
    pageDidShow = () => {

    }
    //页面关闭回调
    pageDidClose = () => {

    }
    //打开弹窗
    showPopView = () => {
        this.setState({
            dialogActiveStatus: true
        }, this.pageDidShow)
    }
    //关闭弹窗
    closePopView = () => {
        this.setState({
            dialogActiveStatus: false
        })
        this.pageDidClose();
    }
    // 背景图
    BackgroundSource = () => {
        return require("../static/images/2.1.0/bg_registered1.webp")
    }
    //按钮文字
    btnText = () => {
        return "确定"
    }
    //点击按钮方法 (在homePage打开活动弹框等)
    btnClick = () => {
        alert('按钮方法')
    }
    // 点击按钮调用方法和关闭自己
    BtnClickAndClose = () => {
        this.closePopView();
        this.btnClick()
    }
    //其他弹框
    renderPage = () => {

    }

    render() {
        return (
            this.state.dialogActiveStatus &&
            <View style={styles.container} accessible={false}>
                {/*增加黑色背景透明层*/}
                <View style={styles.opacityView}/>
                <View style={styles.containerStyle}>
                    <FastImage style={styles.modalView} source={this.BackgroundSource()}>
                        {/*关闭按钮*/}
                        <View style={styles.closeImageView}>
                            <TouchableOpacity
                                activeOpacity={1}
                                onPress={() => {
                                    this.closePopView()
                                }}
                            >
                                <FastImage
                                    style={styles.closeImage}
                                    resizeMode='stretch'
                                    source={require('../static/images/2.1.0/close.webp')}
                                />
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity style={{bottom: 45 * UIMacro.HEIGHT_PERCENT}} onPress={this.BtnClickAndClose}>
                            <FastImage style={{
                                                width: 113 * UIMacro.HEIGHT_PERCENT, height: 113 *(92/241)* UIMacro.HEIGHT_PERCENT,
                                                justifyContent: 'center', alignItems: 'center',}}
                                             source={require('../static/images/2.1.0/btn_view.webp')}>
                                <Text style={{
                                    color: '#fff',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    fontWeight:'bold',
                                    fontSize:15,
                                }}>{this.btnText()}</Text>
                            </FastImage>
                        </TouchableOpacity>
                    </FastImage>
                </View>

                {this.renderPage()}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
    },
    opacityView: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        opacity: 0.5,
        backgroundColor: 'black',
        position: 'absolute',

    },
    containerStyle: {
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        width: UIMacro.SCREEN_WIDTH,
        height: UIMacro.SCREEN_HEIGHT,

    },
    closeImageView: {
        position: 'absolute',
        right: 90 * UIMacro.WIDTH_PERCENT,
        top: 75 * UIMacro.HEIGHT_PERCENT,
    },
    closeImage: {
        width: 40 * UIMacro.WIDTH_PERCENT,
        height: 40 * UIMacro.WIDTH_PERCENT
    },
    modalView: {
        height: UIMacro.SCREEN_HEIGHT,
        width: UIMacro.SCREEN_HEIGHT*(1060/750),
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
});
