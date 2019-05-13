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
    Text,
    View,
} from 'react-native';

import SmallPopPage from "../../common/SmallPopPage";
import UIMacro from '../../core/UIMacro' ;
import SecurityCenterView from '../PersonalCenter/SecurityCenterView' ;
import TouchableBounce from "../../common/TouchableBounce";
import FastImage from 'react-native-fast-image'


type Props = {};
export default class IncomeTipView extends SmallPopPage<Props> {

    constructor() {
        super();
        this.state = {
            ...this.state,
            tipTextValue: '',
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            tipTextValue: nextProps.tipTextValues
        })
    }

    renderPage = () => {
        return (
                <SecurityCenterView ref={(c) => this.SecurityCenterView = c} selectedIndex={1} isChange={false} closeTipView={this.closePopView}/>
        )
    }

    //用于自定义内容视图
    contentView = () => {
        //, {marginLeft: 70 * UIMacro.WIDTH_PERCENT}
        return (
            <View style={styles.playerContainer}>
                <View style={styles.player}>
                    <View style={[styles.playerContent]}>
                        <Text style={styles.playerText}>{this.state.tipTextValue}</Text>
                    </View>
                </View>
                <TouchableBounce onPress={this.tipHandleClick}>
                    <FastImage style={styles.btnClick}
                                     resizeMode='stretch'
                                     source={require('../../static/images/2.1.0/btn_menu.webp')}>
                        <Text style={styles.logText}>确定</Text>
                    </FastImage>
                </TouchableBounce>
            </View>
        )
    }

    //弹窗确定按钮点击
    tipHandleClick = () => {
        if (this.state.tipTextValue === '出币成功') {
            this.props.closeVerificationView();
            this.closePopView()
        } else if (this.state.tipTextValue === '未设置安全密码' ) {
            //如果没有设置安全密码跳转安全中心设置安全密码
            this.SecurityCenterView.showPopView();
        }else if ( this.state.tipTextValue==='请先设置安全密码'){
            //如果没有设置安全密码跳转安全中心设置安全密码
            this.props.showSecurityView();
        }else if ( this.state.tipTextValue==='请先绑定银行卡'){
            //如果没有绑定银行卡跳转到安全中心绑定银行卡
            this.props.showBankViews();
        }
        else
        {
            this.closePopView()
        }
    }

    //提示
    titleImage = () => {
        return require('../../static/images/2.1.0/title03.webp')
    }
}

const styles = StyleSheet.create({
    playerContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 315 * UIMacro.WIDTH_PERCENT,
        height: 187 * UIMacro.HEIGHT_PERCENT,
    },
    player: {
        width: 269 * UIMacro.WIDTH_PERCENT,
        height: 80 * UIMacro.HEIGHT_PERCENT,
        marginLeft: 23 * UIMacro.WIDTH_PERCENT,
        marginRight: 24 * UIMacro.WIDTH_PERCENT,
        borderRadius: 10,
    },
    playerContent: {
        flex: 1,
        justifyContent: 'center',
    },
    playerText: {
        color: '#fff',
        fontSize: 15,
        marginTop: 5 * UIMacro.HEIGHT_PERCENT,
        justifyContent:'center',
        textAlign: 'center',
    },
    btnClick: {
        width: 121 * UIMacro.WIDTH_PERCENT,
        height: 45 * UIMacro.HEIGHT_PERCENT,
        marginLeft: 7 * UIMacro.WIDTH_PERCENT,
        marginTop: 10 * UIMacro.HEIGHT_PERCENT,
        justifyContent: 'center',
    },
    logText: {
        color: '#fff',
        fontSize: 15,
        textAlign: 'center',
    },
});


