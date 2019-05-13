/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, View, Image, ImageBackground, Text, Modal} from 'react-native';
import UIMacro from '../../core/UIMacro';
import TouchableBounce from '../../common/TouchableBounce'
import FastImage from 'react-native-fast-image'

type Props = {};
export default class RedPagTimes extends Component<Props> {
    constructor(pros) {
        super(pros);
        this.state = {
            dialogActiveStatus: false, //弹窗状态 默认关闭
            redPackTimes:0,
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
                            style={{width: 318 * UIMacro.HEIGHT_PERCENT, height: 223.5 * UIMacro.HEIGHT_PERCENT}}
                            source={require("../../static/images/2.1.0/bg_bonus.webp")}>
                            {/*你还有*/}
                            <FastImage source={require("../../static/images/2.1.0/text_haiyou.webp")}
                                   style={{
                                       width: 69 * UIMacro.HEIGHT_PERCENT, height: 22 * UIMacro.HEIGHT_PERCENT,
                                       marginTop: 42 * UIMacro.HEIGHT_PERCENT, marginLeft: 53 * UIMacro.HEIGHT_PERCENT
                                   }}
                            />

                            <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                                {this.redPagTimesView(this.props.redPagTimes.toString())}
                            </View>

                            <FastImage   style={{width:79*UIMacro.HEIGHT_PERCENT,height:15*UIMacro.HEIGHT_PERCENT,
                                            right:20*UIMacro.WIDTH_PERCENT,top:110*UIMacro.HEIGHT_PERCENT,
                                            position:'absolute',
                            }}
                                     source={require("../../static/images/2.1.0/text_jihui.webp")}
                                     resizeMode='stretch' />

                            <TouchableBounce style={{width:50*UIMacro.HEIGHT_PERCENT,height:50*UIMacro.HEIGHT_PERCENT,
                                left:145*UIMacro.WIDTH_PERCENT,bottom: 45*UIMacro.HEIGHT_PERCENT,
                                position:'absolute',
                            }} onPress={this.openRedPagBtnClick}>
                                <FastImage source={require("../../static/images/2.1.0/redbtn_chai.webp")}
                                           style={{width:57*UIMacro.HEIGHT_PERCENT,height:57*UIMacro.HEIGHT_PERCENT}}
                                         resizeMode='stretch' />
                            </TouchableBounce>

                        </FastImage>
                    </FastImage>
                </View>
            </View>
        );
    }

    redPagTimesView = (str) => {
        let image = require('../../static/images/2.1.0/ling.webp');
        let array= [];
        for (let i = 0; i < str.length; i++) {
            switch (Number(str[i])) {
                case 0: {
                    image = require('../../static/images/2.1.0/ling.webp')
                }
                    break;
                case 1: {
                    image = require('../../static/images/2.1.0/yi.webp')
                }
                    break;
                case 2: {
                    image = require('../../static/images/2.1.0/er.webp')
                }
                    break;
                case 3: {
                    image = require('../../static/images/2.1.0/san.webp')
                }
                    break;
                case 4: {
                    image = require('../../static/images/2.1.0/si.webp')
                }
                    break;
                case 5: {
                    image = require('../../static/images/2.1.0/wu.webp')
                }
                    break;
                case 6: {
                    image = require('../../static/images/2.1.0/liu.webp')
                }
                    break;
                case 7: {
                    image = require('../../static/images/2.1.0/qi.webp')
                }
                    break;
                case 8: {
                    image = require('../../static/images/2.1.0/ba.webp')
                }
                    break;
                case 9: {
                    image = require('../../static/images/2.1.0/jiu.webp')
                }
                    break;
                default:
                    break;
        }

            array.push(<FastImage
                style={{width:46*UIMacro.HEIGHT_PERCENT,height:59*UIMacro.HEIGHT_PERCENT,marginLeft:0*UIMacro.WIDTH_PERCENT}}
                source={image} key={i}
                resizeMode='stretch'
            />)

        }
        return array;
    }

    openRedPagBtnClick = ()=>{
        this.closePopView();
        this.props.openRedPags();
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
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        opacity: 0.5,
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
