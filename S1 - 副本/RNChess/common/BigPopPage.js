/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, View, Image, TouchableOpacity, ImageBackground, Text} from 'react-native';
import UIMacro from '../core/UIMacro';
import * as Animatable from 'react-native-animatable';
import FastImage from 'react-native-fast-image'

type Props = {};
const durationTime = 500;
export default class BigPopPage extends Component<Props> {
    constructor(pros) {
        super(pros);
        this.state = {
            dialogActiveStatus: false //弹窗状态 默认关闭
        }
    }


    //用于自定义内容视图
    contentView = () => {

    }

    //其他弹框
    renderPage = () => {

    }

    //用于自定义标题栏视图
    titleView = () => {
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

    //页面关闭需要立即执行的回调
    pageDidCloseImmediate = () => {

    }

    //背景图片
    popPageBackground = () => {
        return require('../static/images/2.1.0/popups_alluse.webp')
    }

    render() {
        return (
            this.state.dialogActiveStatus &&
            <View style={styles.container}>
                <View style={{opacity:0.4,backgroundColor: '#000',
                    position:'absolute',flex:1,top:0,right:0,bottom:0,left:0}}/>
                <Animatable.View ref="animationView" animation="bounceIn" iterationCount={1} duration={durationTime}
                                 accessible={false}>
                    <FastImage source={this.popPageBackground()}
                                     style={styles.bigBackgoundImageStyle}>
                        {this.titleView() === undefined ?
                            <FastImage source={this.titleImage()} style={styles.topTitleImageStyle}
                                       resizeMode='contain'
                            /> :
                            this.titleView()}
                        <TouchableOpacity style={{
                            position: 'absolute',
                            right: -1,
                            top: -1,
                        }} onPress={() => this.closePopView()}>
                            <FastImage source={require('../static/images/2.1.0/close.webp')}
                                              style={styles.closeBtnStyle}/>
                        </TouchableOpacity>
                        <View style={styles.contentViewStyle}>
                            {this.contentView()}
                        </View>
                    </FastImage>
                </Animatable.View>
                {this.renderPage()}
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
        this.refs.animationView.bounceOut();
        this.pageDidCloseImmediate();
        let that = this;
        setTimeout(function () {
            that.setState({
                dialogActiveStatus: false
            });
            that.pageDidClose();
        }, durationTime);
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
        // backgroundColor: 'rgba(0, 0, 0, .2)',
    },
    bigBackgoundImageStyle: {
        width: 490 * UIMacro.WIDTH_PERCENT,
        height: 349 * UIMacro.HEIGHT_PERCENT,
        alignItems: 'center'
    },
    topTitleImageStyle: {
        marginTop: 10 * UIMacro.WIDTH_PERCENT,
        width:220/3.0* UIMacro.WIDTH_PERCENT,
        height:53/3.0* UIMacro.WIDTH_PERCENT,
    },
    closeBtnStyle: {
        width: 40 * UIMacro.HEIGHT_PERCENT,
        height: 40 * UIMacro.HEIGHT_PERCENT,
    },
    contentViewStyle: {
        marginTop: 10,
    }
});
