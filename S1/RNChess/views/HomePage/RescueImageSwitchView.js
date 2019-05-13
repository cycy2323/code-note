/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, View, Image, ImageBackground, Text, Modal} from 'react-native';
import UIMacro from '../../core/UIMacro'
import TouchableBounce from "../../common/TouchableBounce";
import FastImage from 'react-native-fast-image'

type Props = {};
export default class RescueImageSwitchView extends Component<Props> {
    constructor(pros) {
        super(pros);
        this.state = {
            dialogActiveStatus: false, //弹窗状态 默认关闭
            resgisterImg:require("../../static/images/2.1.0/bg_rescue1.webp"),
            activityId:''
        }
    }

    //用于自定义内容视图
    contentView = () => {

    }

    //用于自定义标题名称
    titleImage = () => {

    }

    //页面打开回调
    pageDidShow = () => {

    }

    //页面关闭回调
    pageDidClose = () => {

    }

    submitBankCard = () =>{
        this.props.onPressPromt(this.state.activityId);
        this.closePopView();
    }

    render() {
        return (
            this.state.dialogActiveStatus &&
            <View style={styles.container} accessible={false}>
                {/*增加黑色背景透明层*/}
                <View style={styles.opacityView}/>
                <View style={styles.containerStyle}>
                    <FastImage style={styles.modalView} resizeMode='contain' source={this.state.resgisterImg}>
                        {/*关闭按钮*/}
                        <View style={styles.closeImageView}>
                            <TouchableBounce
                                activeOpacity={1}
                                onPress={() => {
                                    this.closePopView()
                                }}
                            >
                                <FastImage
                                    style={styles.closeImage}
                                    resizeMode='stretch'
                                    source={require('../../static/images/2.1.0/close.webp')}
                                />
                            </TouchableBounce>
                        </View>
                        <TouchableBounce onPress={this.submitBankCard} style={styles.btnLog}>
                            <FastImage style={{height: 46 * UIMacro.HEIGHT_PERCENT, width: 120.5 * UIMacro.WIDTH_PERCENT}}
                                             resizeMode='stretch'
                                             source={require('../../static/images/2.1.0/btn_view.webp')}>
                                <Text style={styles.log}>前往优惠活动</Text>
                            </FastImage>
                        </TouchableBounce>

                    </FastImage>
                </View>
            </View>
        );
    }

    //打开弹窗
    showPopView = (imgSource,activityId) => {
        this.setState({
            resgisterImg:imgSource,
            dialogActiveStatus: true,
            activityId:activityId
        }, this.pageDidShow)
    }

    //关闭弹窗
    closePopView = () => {
        this.setState({
            dialogActiveStatus: false
        })
        this.pageDidClose();
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
        backgroundColor: 'rgba(0, 0, 0, .5)',
    },
    opacityView: {
        flex: 1,
        opacity: 0.6,
        backgroundColor: '#000',
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
        right: 130 * UIMacro.WIDTH_PERCENT,
        top: 70 * UIMacro.HEIGHT_PERCENT,
    },
    closeImage: {
        width: 40 * UIMacro.WIDTH_PERCENT,
        height: 40 * UIMacro.WIDTH_PERCENT
    },
    modalView: {
        height: UIMacro.SCREEN_HEIGHT,
        width: 654 * UIMacro.WIDTH_PERCENT,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    btnLog: {
        marginTop: 230 * UIMacro.HEIGHT_PERCENT,
        height: 46 * UIMacro.HEIGHT_PERCENT,
        width: 120.5 * UIMacro.WIDTH_PERCENT,
        alignItems: 'center',
    },
    log: {
        fontSize: 15,
        textAlign: 'center',
        color: '#fff',
        fontWeight: 'bold',
        height: 47 * UIMacro.HEIGHT_PERCENT,
        lineHeight: 47 * UIMacro.HEIGHT_PERCENT
    },
});
