/**
 * @author
 *  Chester
 * @remark 个人中心 二级菜单 安全中心
 */

import React, {Component} from 'react';
import {
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ImageBackground,
} from 'react-native';
import LoginPwdView from "./LoginPwdView";
import SecurityPwdView from "./SecurityPwdView";
import BindBankCardView from "./BindBankCardView";
import BindPhoneView from "./BindPhoneView";
import WelfareChangeView from "./WelfareChangeView";
import UserInfo from "../../core/UserInfo";
import GBNetWorkService from "../../core/GBNetWorkService";
import UIMacro from "../../core/UIMacro";
import BigPopPage from "../../common/BigPopPage";
import RealNameBindView from './RealNameBindView';
import TouchableBounce from "../../common/TouchableBounce";
import FastImage from 'react-native-fast-image';

type Props = {};
const BORDER_WIDTH = 2;

export default class SecurityCenterView extends BigPopPage<Props> {

    constructor(pros) {
        super(pros);
        this.state = {
            ...this.state,
            selectedIndex: 0,
            isChange: this.props.isChange,
            isShowBindPhone: false,
        }
    };

    pageDidShow = () => {
        /*判断是否显示绑定手机*/
        GBNetWorkService.get("mobile-api/findPasswordOrigin/openFindByPhone.html", null, null, this.successShowBindPhone, this.failShowBindPhone)
    }
    pageDidClose = () => {
        this.setState({
            selectedIndex: 0,
            isChange: this.props.isChange,
            isShowBindPhone: false,
        })
        //关闭提示框
        if (this.props && this.props.closeTipView) {
            this.props.closeTipView();
        }
    }

    pageDidCloseImmediate = () =>{
        if (this.props && this.props.changeSelectIndex) {
            this.props.changeSelectIndex();
        }
    }

    //登录密码
    isLoginPwd = () => {

        this.setState({
            selectedIndex: 0,
            isChange: true,
        })
    };
    //安全密码
    isSecurityPwd = () => {
        /*判断是否设置了realName*/
        if (!UserInfo.hasRealName) {
            this.realNameBindView.showPopView();
        }
        this.setState({
            selectedIndex: 1,
            isChange: true,
        })
    };
    //银行卡
    isCreditCard = () => {
        this.setState({
            selectedIndex: 2,
            isChange: true,
        })
    };
    //福利
    isWelfare = () => {
        this.setState({
            selectedIndex: 3,
            isChange: true,
        })
    };
    //绑定手机
    isPhoneNum = () => {
        this.setState({
            selectedIndex: 4,
            isChange: true,
        })
    };

    componentWillReceiveProps() {
        this.setState({
            selectedIndex: this.props.selectedIndex,
        })
    }

    successShowBindPhone = (json) => {
        this.setState({
            isShowBindPhone: parseInt(json.data) === 0 ? false : true,
        })
    }

    failShowBindPhone = (json) => {
        console.log('failShowBindPhone' + JSON.stringify(json))
    }
    titleImage = () => {
        return require('../../static/images/2.1.0/title12.webp')
    }
    renderPage = () => {
        return <RealNameBindView ref={(c) => this.realNameBindView = c}/>
    }
    contentView = () => {
        return (<View style={styles.modalMiddleView}>
            <View style={styles.modalLeftView}>
                <View style={styles.modalLeftImage}>

                    <TouchableBounce onPress={this.isLoginPwd} style={styles.btnClickView} >
                        <FastImage style={styles.btnClick}
                                         resizeMode='contain'
                                         source={(this.state.isChange ? this.state.selectedIndex : this.props.selectedIndex) === 0 ? require('../../static/images/2.1.0/btn_click.webp') : require('../../static/images/2.1.0/btn_general.webp')}>
                            <Text style={styles.logText}>修改登录密码</Text>
                        </FastImage>
                    </TouchableBounce>

                    <TouchableBounce onPress={this.isSecurityPwd} style={styles.btnClickView}>
                        <FastImage style={styles.btnClick}
                                         resizeMode='contain'
                                         source={(this.state.isChange ? this.state.selectedIndex : this.props.selectedIndex) === 1 ? require('../../static/images/2.1.0/btn_click.webp') : require('../../static/images/2.1.0/btn_general.webp')}>
                            <Text style={styles.logText}>{UserInfo.hasPermissionPwd ? '修改安全密码' : '设置安全密码'}</Text>
                        </FastImage>
                    </TouchableBounce>

                    <TouchableBounce onPress={this.isCreditCard} style={styles.btnClickView}>
                        <FastImage style={styles.btnClick}
                                         resizeMode='contain'
                                         source={(this.state.isChange ? this.state.selectedIndex : this.props.selectedIndex) === 2 ? require('../../static/images/2.1.0/btn_click.webp') : require('../../static/images/2.1.0/btn_general.webp')}>
                            <Text style={styles.logText}>银行卡</Text>
                        </FastImage>
                    </TouchableBounce>

                    <TouchableBounce onPress={this.isWelfare} style={styles.btnClickView}>
                        <FastImage style={styles.btnClick}
                                         resizeMode='contain'
                                         source={(this.state.isChange ? this.state.selectedIndex : this.props.selectedIndex) === 3 ? require('../../static/images/2.1.0/btn_click.webp') : require('../../static/images/2.1.0/btn_general.webp')}>
                            <Text style={styles.logText}>福利转换</Text>
                        </FastImage>
                    </TouchableBounce>

                    {this.state.isShowBindPhone ?
                        <TouchableBounce onPress={this.isPhoneNum} style={styles.btnClickView}>
                            <FastImage style={styles.btnClick}
                                             resizeMode='contain'
                                             source={(this.state.isChange ? this.state.selectedIndex : this.props.selectedIndex) === 4 ? require('../../static/images/2.1.0/btn_click.webp') : require('../../static/images/2.1.0/btn_general.webp')}>
                                <Text style={styles.logText}>绑定手机</Text>
                            </FastImage>
                        </TouchableBounce> : null}

                </View>
            </View>
            {

                (this.state.isChange ? this.state.selectedIndex : this.props.selectedIndex) === 0
                &&
                <LoginPwdView closeSecurityView={this._sucess}
                />
            }
            {
                (this.state.isChange ? this.state.selectedIndex : this.props.selectedIndex) === 1
                &&
                <SecurityPwdView closeSecurityView={this._sucess}
                                 setRealNameVisible={this._showRealNameView}
                />
            }
            {
                (this.state.isChange ? this.state.selectedIndex : this.props.selectedIndex) === 2
                &&
                <BindBankCardView/>
            }
            {
                (this.state.isChange ? this.state.selectedIndex : this.props.selectedIndex) === 3
                &&
                <WelfareChangeView>
                    <View>

                    </View>
                </WelfareChangeView>
            }
            {
                (this.state.isChange ? this.state.selectedIndex : this.props.selectedIndex) === 4
                &&
                <BindPhoneView closeSecurityView={this._sucess}
                />
            }
        </View>);
    }
    _sucess = () => {
        this.closePopView()
    }
    _showRealNameView = () => {
        this.realNameBindView.showPopView();
    }

}

const styles = StyleSheet.create({
    modalLeftImage: {
        width: 135 * UIMacro.WIDTH_PERCENT,
        height: 302.5 * UIMacro.HEIGHT_PERCENT,
        marginLeft: -2,
        marginTop: 7 * UIMacro.WIDTH_PERCENT,
    },
    btnClick: {
        width: 117.5 * UIMacro.WIDTH_PERCENT,
        height: 41.5 * UIMacro.HEIGHT_PERCENT,
    },
    btnClickView: {
        width: 122 * UIMacro.WIDTH_PERCENT,
        height: 47 * UIMacro.HEIGHT_PERCENT,
        marginLeft: 7 * UIMacro.WIDTH_PERCENT,
        marginTop: 3 * UIMacro.HEIGHT_PERCENT,
    },
    logText: {
        color: '#fff',
        fontSize: 15,
        fontWeight: 'bold',
        textAlign: 'center',
        height: 41.5 * UIMacro.HEIGHT_PERCENT,
        lineHeight: 41.5 * UIMacro.HEIGHT_PERCENT
    },
    modalMiddleView: {
        flexDirection: 'row',
    },
});