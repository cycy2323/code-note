/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {
    Platform,
    StyleSheet,
    View,
    Text,
    Modal,
    AppState
} from 'react-native';
import UIMacro from '../../core/UIMacro'
import LottieView from "lottie-react-native";
import TouchableBounce from "../../common/TouchableBounce";
import FastImage from 'react-native-fast-image'

type Props = {};
export default class RecommendImageSwitchView extends Component<Props> {
    constructor(pros) {
        super(pros);
        this.state = {
            dialogActiveStatus: false, //弹窗状态 默认关闭
            money: 0
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
        AppState.addEventListener('change', this.onAppStateChanged);
    }

    //页面关闭回调
    pageDidClose = () => {

    }

    onAppStateChanged = () => {
        switch (AppState.currentState) {
            case "active":
                this.hongbaoAnimation && this.hongbaoAnimation.play();
                break;
            default:
        }
    }

    render() {
        return (
            this.state.dialogActiveStatus &&
            <View style={styles.container} accessible={false}>
                <LottieView
                    style={{flexDirection: 'column',left:0,top:0,right:0,bottom:0,position:'absolute'}}
                    source={require('../../static/animation/hongbao1/hongbao1.json')}
                    imageAssetsFolder={'lottie/hongbao1/images'}
                    ref={animation => {
                        this.hongbaoAnimation = animation;
                    }}
                    autoPlay
                    loop
                />
                <View style={{justifyContent: 'center',alignItems: 'center',width:300,height:300}}>
                    <FastImage style={{width:210*UIMacro.HEIGHT_PERCENT,height:58*UIMacro.HEIGHT_PERCENT,marginTop:70}} source={require("../../static/images/2.1.0/share_bonus.webp")}/>
                    <FastImage style={{width:61*UIMacro.HEIGHT_PERCENT,height:17*UIMacro.HEIGHT_PERCENT}} source={require("../../static/images/2.1.0/share_bonus_small.webp")}/>
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems:'center',
                    }}>
                        {this.redPagTimesView(this.state.money.toString())}
                        <FastImage style={{
                            width: 14 * UIMacro.HEIGHT_PERCENT, height: 12 * UIMacro.HEIGHT_PERCENT,
                            marginTop: 40 * UIMacro.HEIGHT_PERCENT
                        }}
                               source={require("../../static/images/2.1.0/text_red_yuan.webp")}/>

                    </View>


                    <Text style={{fontSize: 10, color: '#FFF3B2', fontStyle: 'italic', marginTop: 5,textAlign: 'center'}}>已经帮您自动存入福利</Text>
                    <TouchableBounce onPress={this.sureBtnClick} stlye={{justifyContent:'center'}}>
                        <FastImage style={{
                            width: 117.5 * UIMacro.HEIGHT_PERCENT, height: 41.5 * UIMacro.HEIGHT_PERCENT,
                            justifyContent: 'center', alignItems: 'center'}}
                                         resizeMode='contain'
                                         source={require('../../static/images/2.1.0/btn_view.webp')}>
                            <Text style={{
                                color: '#fff',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}>前往分享</Text>
                        </FastImage>
                    </TouchableBounce>
                </View>


                {/*/!*关闭按钮*!/*/}
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
            </View>
        );
    }

    sureBtnClick = () => {
        this.closePopView();
        this.props.setTuiGuangeVisible();
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
    showPopView = (money) => {
        this.setState({
            dialogActiveStatus: true,
            money: money
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
    closeImageView: {
        position: 'absolute',
        right: (UIMacro.SCREEN_WIDTH - 300*UIMacro.WIDTH_PERCENT)/2 ,
        top: 70 * UIMacro.HEIGHT_PERCENT,
    },
    closeImage: {
        width: 40 * UIMacro.WIDTH_PERCENT,
        height: 40 * UIMacro.WIDTH_PERCENT
    },
});
