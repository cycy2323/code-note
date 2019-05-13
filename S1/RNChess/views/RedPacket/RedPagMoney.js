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
export default class RedPagMoney extends Component<Props> {
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
                            style={{width: 298 * UIMacro.HEIGHT_PERCENT, height: 301.5 * UIMacro.HEIGHT_PERCENT}}
                            source={require("../../static/images/2.1.0/bg_winning.webp")}>

                            <View style={{
                                flexDirection: 'row',
                                justifyContent: 'center',
                                marginTop: 170 * UIMacro.HEIGHT_PERCENT
                            }}>
                                {this.redPagTimesView(this.props.redPagMoney.toString())}
                                <FastImage style={{
                                    width: 14 * UIMacro.HEIGHT_PERCENT, height: 12 * UIMacro.HEIGHT_PERCENT,
                                    marginTop: 50 * UIMacro.HEIGHT_PERCENT
                                }}
                                       source={require("../../static/images/2.1.0/text_red_yuan.webp")}/>
                            </View>


                            <TouchableBounce onPress={this.sureBtnClick}>
                                <FastImage style={{
                                    width: 113 * UIMacro.HEIGHT_PERCENT, height: 38 * UIMacro.HEIGHT_PERCENT,
                                    justifyContent: 'center', alignItems: 'center',
                                    marginLeft: 90 * UIMacro.HEIGHT_PERCENT, marginTop: 11 * UIMacro.HEIGHT_PERCENT
                                }}
                                                 source={require('../../static/images/2.1.0/btn_view.webp')}>
                                    <Text style={{
                                        color: '#fff',
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}>确定</Text>
                                </FastImage>
                            </TouchableBounce>
                        </FastImage>
                    </FastImage>
                </View>
            </View>
        );
    }

    sureBtnClick = () => {
        this.closePopView();
        this.props.openRedPagView();
    }

    redPagTimesView = (str) => {
        let image = require('../../static/images/2.1.0/ling.webp');
        let array = [];
        for (let i = 0; i < str.length; i++) {
            switch (str[i]) {
                case '0': {
                    image = require('../../static/images/2.1.0/ling.webp')
                }
                    break;
                case '1': {
                    image = require('../../static/images/2.1.0/yi.webp')
                }
                    break;
                case '2': {
                    image = require('../../static/images/2.1.0/er.webp')
                }
                    break;
                case '3': {
                    image = require('../../static/images/2.1.0/san.webp')
                }
                    break;
                case '4': {
                    image = require('../../static/images/2.1.0/si.webp')
                }
                    break;
                case '5': {
                    image = require('../../static/images/2.1.0/wu.webp')
                }
                    break;
                case '6': {
                    image = require('../../static/images/2.1.0/liu.webp')
                }
                    break;
                case '7': {
                    image = require('../../static/images/2.1.0/qi.webp')
                }
                    break;
                case '8': {
                    image = require('../../static/images/2.1.0/ba.webp')
                }
                    break;
                case '9': {
                    image = require('../../static/images/2.1.0/jiu.webp')
                }
                    break;
                case '.': {
                    image = require('../../static/images/2.1.0/dot.webp')
                }
                    break;
                default:
                    break;
            }

            array.push(str[i] === '.' ? <FastImage
                    style={{
                        width: 12 * UIMacro.HEIGHT_PERCENT,
                        height: 12 * UIMacro.HEIGHT_PERCENT,
                        marginTop: 42 * UIMacro.WIDTH_PERCENT
                    }}
                    source={image} key={i}
                    resizeMode='stretch'/>
                : <FastImage
                    style={{width: 43 * UIMacro.HEIGHT_PERCENT, height: 54 * UIMacro.HEIGHT_PERCENT}}
                    source={image} key={i}
                    resizeMode='stretch'/>
            )

        }
        return array;
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
