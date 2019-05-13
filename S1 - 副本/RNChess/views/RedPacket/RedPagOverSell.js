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
import TouchableBounce from '../../common/TouchableBounce'
import FastImage from 'react-native-fast-image'

type Props = {};
export default class RedPagOverSell extends Component<Props> {
    constructor(pros) {
        super(pros);
        this.state = {
            dialogActiveStatus: false //弹窗状态 默认关闭
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

    render() {
        return (
            this.state.dialogActiveStatus &&
            <View style={styles.container} accessible={false}>
                {/*增加黑色背景透明层*/}
                <View style={styles.opacityView}/>
                <View style={styles.containerStyle}>
                    <FastImage style={styles.modalView} source={require("../../static/images/2.1.0/red_bg.webp")}>
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
                        <FastImage
                            style={{width: 318 * UIMacro.HEIGHT_PERCENT, height: 223.5 * UIMacro.HEIGHT_PERCENT,alignItems:'center'}}
                            source={require("../../static/images/2.1.0/bg_oversell.webp")}>

                            <Text style={{color:'#FFF3B2',fontSize:11,marginTop:94*UIMacro.HEIGHT_PERCENT }}>下次拆红包的时间为</Text>
                            <View style={{backgroundColor:'#BA1F1D',marginTop:11*UIMacro.HEIGHT_PERCENT,
                                borderRadius:10*UIMacro.HEIGHT_PERCENT,paddingLeft: 5,paddingRight: 5,paddingTop: 3,paddingBottom: 3, }}>
                                <Text style={{color:'#FFEA00',fontSize:12}}>{this.props.nextLotteryTime.substr(5,this.props.nextLotteryTime.length-5)}</Text>
                            </View>

                            <TouchableBounce
                                activeOpacity={1}
                                onPress={() => {
                                    this.closePopView()
                                }}
                            >
                                <FastImage
                                    style={{width:50*UIMacro.HEIGHT_PERCENT,height:50*UIMacro.HEIGHT_PERCENT}}
                                    resizeMode='stretch'
                                    source={require('../../static/images/2.1.0/redbtn_kong.webp')}
                                />
                            </TouchableBounce>

                        </FastImage>
                    </FastImage>
                </View>
            </View>
        );
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
});
