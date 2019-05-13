/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, View, TouchableOpacity, Text} from 'react-native';
import UIMacro from '../core/UIMacro';
import * as Animatable from 'react-native-animatable';
import FastImage from 'react-native-fast-image'

type Props = {};

let popWidth = 321 * UIMacro.HEIGHT_PERCENT;
let popHeight = 230 * UIMacro.HEIGHT_PERCENT;
const durationTime = 500;

export default class SmallPopPage extends Component<Props> {
    constructor(pros) {
        super(pros);
        this.state = {
            dialogActiveStatus: false //弹窗状态 默认关闭
        }
    }

    //自定义弹窗宽高
    //返回{width:xx,height:xx}
    customWindowSize = () => {

    }

    //用于自定义内容视图
    contentView = () => {

    }

    renderPage = () => {

    }

    //用于自定义标题栏视图
    titleView = () => {
    }

    //用于自定义标题名称
    titleImage = () => {

    }
    pageDidShow = () => {

    }

    pageDidClose = () => {

    }

    //背景图片
    popPageBackground = () => {
        return require('../static/images/2.1.0/popups_prompt.webp')
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
                                     style={[styles.smallBackgoundImageStyle, this.customWindowSize() !== undefined && {
                                         width: this.customWindowSize().width,
                                         height: this.customWindowSize().height
                                     }]}>
                        {this.titleView() === undefined ?
                            <FastImage source={this.titleImage()} style={styles.topTitleImageStyle}/> : this.titleView()}

                        <TouchableOpacity style={{
                            position: 'absolute',
                            right: -3,
                            top: 0,
                        }} onPress={() => this.closePopView()}>
                            <FastImage source={require('../static/images/2.1.0/close.webp')}
                                              style={styles.closeBtnStyle}/>
                        </TouchableOpacity>

                        <View style={styles.contentViewStyle}>
                            {this.contentView()}
                        </View>
                    </FastImage>

                    {this.renderPage()}
                </Animatable.View>
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
    },
    smallBackgoundImageStyle: {
        width: popWidth * UIMacro.WIDTH_PERCENT,
        height: popHeight * UIMacro.HEIGHT_PERCENT,
        alignItems: 'center'
    },
    topTitleImageStyle: {
        marginTop: 10 * UIMacro.WIDTH_PERCENT,
        width:120/3.0* UIMacro.WIDTH_PERCENT,
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
