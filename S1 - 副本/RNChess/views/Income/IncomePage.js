/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
} from 'react-native';
import BigPopPage from '../../common/BigPopPage' ;
import UserInfo from '../../core/UserInfo' ;
import GBNetWorkService from "../../core/GBNetWorkService";
import LoadingView from '../Loading/LoadingView' ;
import IncomeTipView from './IncomeTipView' ;
import OutDetailsView from './OutDetailsView' ;
import SecurityCenterView from '../PersonalCenter/SecurityCenterView' ;
import UIMacro from '../../core/UIMacro'
import SkinsColor from "../../core/SkinsColor";
import TouchableBounce from "../../common/TouchableBounce";
import FastImage from 'react-native-fast-image'


type Props = {};
export default class IncomePage extends BigPopPage<Props> {

    constructor() {
        super();
        this.state = {
            ...this.state,
            amount: '',
            modalVisible: false,
            outDetailsModalVisible: false,
            tipModalVisible: false,
            isCreditCardTwo: true,
            isCreditLogin: false,
            bankcardNumber: '',
            tipTextValue: '',
            KeyboardShown: false,
            totalBalance: '',

            //getWithDraw 获取取款信息
            getWithDrawCode: '',
            getWithDrawMessage: '',
            withdrawMaxNum: 0,  // 取款最大值
            withdrawMinNum: 0,  // 取款最小值
            //获取手续费接口返回
            actualWithdraw: 0,
            administrativeFee: 0,
            counterFee: 0,
            deductFavorable: 0,
            outDetailDataArr: [],

            securityIndex:0,  //安全中心index
        }
    }

    bindCard = () => {
        //跳转绑定银行卡
        this.setState({
            securityIndex:2
        },()=> this.SecurityCenterView.showPopView())
    }
    noSelect = () => {
        //doNothing
    }

    saveOutDetailData1 = () => {
        let Arr = [this.state.bankcardNumber,
            Number(this.state.amount),
            this.state.counterFee,
            this.state.administrativeFee,
            this.state.deductFavorable,
            this.state.actualWithdraw];
        this.setState({
            outDetailDataArr: Arr,
        })
    }

    pageDidShow = () => {
        this.loadingView.showAnimation();
        //获取是否绑定银行卡
        GBNetWorkService.get('mobile-api/withdrawOrigin/getWithDraw.html', null, null, this.successGetBankInfoBack,
            this.failGetBankInfoBack);
    }

    //页面关闭回调
    pageDidClose = () => {
        this.setState({
            amount: '',
        })
    }


    successGetBankInfoBack = (json) => {
        this.setState({
            bankcardNumber: (json.data && json.data.bankcardMap && json.data.bankcardMap[1]) ? json.data.bankcardMap[1].bankcardNumber : '',
            getWithDrawCode: json.code,
            getWithDrawMessage: json.message,
            withdrawMaxNum: json.data && json.data.rank ? json.data.rank.withdrawMaxNum : '',  // 取款最大值
            withdrawMinNum: json.data && json.data.rank ? json.data.rank.withdrawMinNum : '',  // 取款最小值
            auditMap: json.data ? json.data.auditMap : '',
            totalBalance: json.data ? json.data.totalBalance.toString() : '',
        })
        UserInfo.walletBalance = json.data ? json.data.totalBalance.toString() : '';
        UserInfo.saftyKoken = json.data ? json.data.token : '';
        UserInfo.hasPermissionPwd = json.data ? json.data.isSafePassword : ''; //是否设置安全密码
        this.loadingView.dismissAnimation();
        console.log('sc+bank' + JSON.stringify(json));

    }

    failGetBankInfoBack = (json) => {
        this.loadingView.dismissAnimation();
        console.log('fa' + json.data);
    }

    //失去焦点
    loadBlur = (input) => {
        input.blur()
    }

    renderPage = () => {
        return (
            //loading视图
            [<LoadingView ref={(c) => this.loadingView = c} key={"loading"}/>,
                <IncomeTipView ref={(c) => this.IncomeTipView = c}
                               tipTextValues={this.state.tipTextValue}
                               key={"incometip"}
                               showSecurityView={this.showSecurityViews}
                               showBankViews={this.showBankViews}
                />,
                <OutDetailsView ref={(c) => this.OutDetailsView = c} outDetailDataArr={this.state.outDetailDataArr}
                                key={"outdetails"}
                                closeIncomePage={() => this.closePopView()}
                />,
                <SecurityCenterView ref={(c) => this.SecurityCenterView = c} selectedIndex={this.state.securityIndex} isChange={false}
                                    key={"securitycenter"}/>
            ]
        )
    }

    titleImage = () => {
        return require('../../static/images/2.1.0/title07.webp')
    }

    showSecurityViews=()=>{
        //安全中心跳转设置安全密码
        this.IncomeTipView.closePopView();
        this.setState({
            securityIndex:1
        },()=>this.SecurityCenterView.showPopView())
    }
    showBankViews=()=>{
        //安全中心跳转设置安全密码
        this.IncomeTipView.closePopView();
        this.setState({
            securityIndex:2
        },()=>this.SecurityCenterView.showPopView())
    }

    contentView = () => {
        return (
            <View style={styles.contentViewStyle}>
                {/*顶部*/}
                <View style={styles.topViewStyle}>
                    <FastImage
                        style={styles.font_welfare}
                        resizeMode='contain'
                        source={require('../../static/images/2.1.0/personal_title_fuli.webp')}
                    />
                    <View style={styles.bgTextViewStyle}>
                        <Text
                            style={styles.amountTextStyle}>{this.state.totalBalance.length > 0 ? UserInfo.isDot(this.state.totalBalance) : UserInfo.isDot(UserInfo.walletBalance)}</Text>
                    </View>
                    <FastImage
                        style={styles.contentImageStyle}
                        resizeMode='contain'
                        source={require('../../static/images/2.1.0/input_gife.webp')}
                    />
                    <FastImage
                        style={styles.font_fee}
                        resizeMode='contain'
                        source={require('../../static/images/2.1.0/font_fee.webp')}/>

                    <View style={styles.bgTextViewStyle}>
                        <Text style={styles.amountTextStyle}>{UserInfo.isDot(this.state.counterFee)}</Text>
                    </View>
                    <FastImage
                        style={styles.contentImageStyle}
                        resizeMode='contain'
                        source={require('../../static/images/2.1.0/input_coin.webp')}/>
                </View>
                {/*中部*/}
                <View style={styles.middleViewStyle}>
                    <View style={styles.midContentViewStyle}>
                        {/*福利账号图片*/}
                        <FastImage style={styles.midBgImageStyle}
                               resizeMode='contain'
                               source={require('../../static/images/2.1.0/font_account.webp')}/>
                        <TextInput style={styles.textInputStyle}
                                   placeholder={'请绑定银行卡'}
                                   placeholderTextColor={SkinsColor.IDText}
                                   editable={false}  //关闭交互
                                   value={this.state.bankcardNumber ? this.state.bankcardNumber : ''}

                        />

                        <TouchableBounce onPress={this.state.bankcardNumber ? this.noSelect : this.bindCard}
                                          style={styles.bingIncomeBtnViewStyle}>
                            <FastImage
                                style={{width: 130.5 * UIMacro.WIDTH_PERCENT, height: 30 * UIMacro.HEIGHT_PERCENT,justifyContent:'center',alignItems:'center'}}
                                resizeMode='stretch'
                                source={require('../../static/images/2.1.0/btn_blue2_click.webp')}
                            >
                                <Text
                                    style={styles.bingIncomeTextStyle}>{this.state.bankcardNumber ? '已绑定' : '绑定福利账号'}</Text>
                            </FastImage>

                        </TouchableBounce>
                    </View>

                    <View style={styles.midContentViewStyle}>
                        <FastImage style={styles.midBgImageStyle}
                               resizeMode='contain'
                               source={require('../../static/images/2.1.0/font_money.webp')}/>
                        <TextInput style={styles.textInputStyle}
                                   placeholder={'请填写出币数量'}
                                   placeholderTextColor={SkinsColor.IDText}
                                   keyboardType={'numeric'}
                                   onChangeText={(amount) => {
                                       let newText = amount.replace(/[^\d]+/, '');
                                       this.setState({amount: newText})
                                   }}
                                   value={this.state.amount}
                                   onBlur={() => this.textFieldendEditing()}
                                   ref={(c) => this.amount = c}
                                   onEndEditing={() => {
                                       this.loadBlur(this.amount)
                                   }}
                        />
                        {/*+50*/}
                        <TouchableBounce style={styles.amount50And100Style} onPress={this.btn50Click}>
                            <FastImage
                                style={{width: 40 * UIMacro.WIDTH_PERCENT, height: 30 * UIMacro.HEIGHT_PERCENT,justifyContent:'center',alignItems:'center'}}
                                resizeMode='stretch'
                                source={require('../../static/images/2.1.0/btn_blue_click.webp')}
                            >
                                <Text style={styles.amount50And100TextStyle}>+50</Text>
                            </FastImage>

                        </TouchableBounce>
                        {/*+100*/}
                        <TouchableBounce style={styles.amount50And100Style} onPress={this.btn100Click}>
                            <FastImage
                                style={{width: 40 * UIMacro.WIDTH_PERCENT, height: 30 * UIMacro.HEIGHT_PERCENT,justifyContent:'center',alignItems:'center'}}
                                resizeMode='stretch'
                                source={require('../../static/images/2.1.0/btn_blue_click.webp')}
                            >
                                <Text style={styles.amount50And100TextStyle}>+100</Text>
                            </FastImage>

                        </TouchableBounce>

                        {/*全部*/}
                        <TouchableBounce style={styles.amount50And100Style} onPress={this.allAmountBtnClick}>
                            <FastImage
                                style={{width: 40 * UIMacro.WIDTH_PERCENT, height: 30 * UIMacro.HEIGHT_PERCENT,justifyContent:'center',alignItems:'center'}}
                                resizeMode='stretch'
                                source={require('../../static/images/2.1.0/btn_blue_click.webp')}
                            >
                            <Text style={styles.amount50And100TextStyle}>全部</Text>
                            </FastImage>
                        </TouchableBounce>
                    </View>

                </View>
                {/*按钮*/}
                <TouchableBounce onPress={this.sureomeClick} style={{alignItems: 'center'}}>
                    <FastImage
                        style={styles.sureBtnViewStyle}
                        resizeMode='stretch'
                        source={require('../../static/images/2.1.0/btn_general.webp')}
                    >
                        <Text style={styles.sureTextStyle}>确定出币</Text>
                    </FastImage>
                </TouchableBounce>
                {/*低部*/}
                <View style={styles.bottomViewStyle}>
                    <Text style={styles.bottomTextStyle}>1、福利到账一般需3-5分钟，受银行维护等问题可能出现延迟到账。</Text>
                    <Text style={styles.bottomTextStyle}>2、出币前请确认福利账号和真实姓名准确无误。</Text>
                    <Text style={styles.bottomTextStyle}>3、出币必须绑定银行卡号，若需修改绑定卡号，请联系客服。</Text>
                </View>
            </View>
        );
    }

    //金额文本框结束编辑回调
    textFieldendEditing = () => {
        this.getFreeAmount(this.state.amount);
    }

    //获取手续费
    getFreeAmount = (amount) => {
        if (amount === 0 || amount === '') return;
        this.loadingView.showAnimation();
        let params = {'withdrawAmount': parseFloat(amount)}
        GBNetWorkService.get('mobile-api/withdrawOrigin/withdrawFee.html', params, null, this.successGetFree,
            this.failGetFree);
    }

    successGetFree = (json) => {
        console.log('counterFee', json.data);
        if (parseInt(json.code) === 0) {
            this.setState({
                counterFee: json.data.counterFee,
                actualWithdraw: json.data.actualWithdraw,
                administrativeFee: json.data.administrativeFee,
                deductFavorable: json.data.deductFavorable,
            }, this.saveOutDetailData1)
        } else {
            this.setState({
                tipTextValue: json.message
            }, this.IncomeTipView.showPopView)
        }
        console.log('getFree:' + JSON.stringify(json));

        this.loadingView.dismissAnimation()
    }

    failGetFree = (json) => {
        this.loadingView.dismissAnimation();
        this.setState({
            tipTextValue: json.message
        }, this.IncomeTipView.showPopView)
        console.log('failGetFree:' + json.data);
    }

    //确认出币按钮点击
    sureomeClick = () => {
        if (!this.state.bankcardNumber) {
            this.setState({
                tipTextValue: '请先绑定银行卡'
            }, this.IncomeTipView.showPopView)
        }else if (!UserInfo.hasPermissionPwd ){
            this.setState({
                tipTextValue: '请先设置安全密码'
            }, this.IncomeTipView.showPopView)
        }
        else if (this.state.amount.length === 0 || parseFloat(this.state.amount) < 0) {
            this.setState({
                tipTextValue: '出币数量应大于0'
            }, this.IncomeTipView.showPopView)
        } else {
            if (parseInt(this.state.totalBalance) === 0) {
                this.setState({
                    tipTextValue:'福利余额不足'
                },this.IncomeTipView.showPopView)
            } else if (parseFloat(this.state.amount) > this.state.totalBalance) {
                this.setState({
                    tipTextValue:'出币数量大于福利余额'
                },this.IncomeTipView.showPopView)
            } else if (parseFloat(this.state.amount) < this.state.withdrawMinNum) {
                this.setState({
                    tipTextValue:'出币数量应大于' + this.state.withdrawMinNum
                },this.IncomeTipView.showPopView)
            } else if (parseFloat(this.state.amount) > this.state.withdrawMaxNum) {
                this.setState({
                    tipTextValue: '出币数量应小于' + this.state.withdrawMaxNum
                }, this.IncomeTipView.showPopView)
            } else if (parseInt(this.state.getWithDrawCode) !== 0) {
                this.setState({
                    tipTextValue: this.state.getWithDrawMessage
                }, this.IncomeTipView.showPopView)
            }
            else if (parseInt(this.state.getWithDrawCode) === 0) {
                this.OutDetailsView.showPopView();
            }
        }
    }

    btn50Click = () => {
        this.setState({
            amount: (parseInt(this.state.amount === '' ? 0 : this.state.amount) + 50).toString(),
        },()=>this.getFreeAmount(this.state.amount.toString()))
    }
    btn100Click = () => {
        this.setState({
            amount: (parseInt(this.state.amount === '' ? 0 : this.state.amount) + 100).toString(),
        }, ()=>this.getFreeAmount(this.state.amount))
    }
    allAmountBtnClick = () => {
        this.setState({
            amount: this.state.totalBalance,
        },()=>this.getFreeAmount(this.state.amount.toString()))
    }

}

const styles = StyleSheet.create({
    contentViewStyle: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    topViewStyle: {
        flexDirection: 'row',
        height: 50 * UIMacro.HEIGHT_PERCENT,
    },
    //中间内容视图
    middleViewStyle: {
        width: 450 * UIMacro.WIDTH_PERCENT,
        height: 94 * UIMacro.HEIGHT_PERCENT,
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.2)',
        borderRadius: 5,
        borderColor: SkinsColor.bgTextViewStyle_border,
        borderWidth: 0.3,
    },
    //inputView 样式
    midContentViewStyle: {
        width: 426 * UIMacro.WIDTH_PERCENT,
        left: 10,
        height: 48 * UIMacro.HEIGHT_PERCENT,
        top: 2,
        flexDirection: 'row',
        alignItems: 'center'
    },

    //福利账号、出币数量样式
    midBgImageStyle: {
        width: 62.5 * UIMacro.WIDTH_PERCENT,
        height:30 * UIMacro.WIDTH_PERCENT
    },

    bottomViewStyle: {
        width: '97%',
        height: 64 * UIMacro.HEIGHT_PERCENT,
        borderTopColor: SkinsColor.bgTextViewStyle_border,
        borderTopWidth: 1,
        marginTop: 8 * UIMacro.HEIGHT_PERCENT,
    },
    bottomTextStyle: {
        fontSize: 11,
        color: '#fff',
        bottom: -10,
        height:18*UIMacro.WIDTH_PERCENT
    },
    font_welfare: {
        width: 45 * UIMacro.WIDTH_PERCENT,
        marginLeft: 20 * UIMacro.WIDTH_PERCENT,
        marginTop: 15 * UIMacro.WIDTH_PERCENT,
    },
    font_fee: {
        width: 45 * UIMacro.WIDTH_PERCENT,
        marginLeft: 20 * UIMacro.WIDTH_PERCENT,
        marginTop: 15 * UIMacro.WIDTH_PERCENT,
    },
    bgTextViewStyle: {
        borderWidth: 1,
        borderColor: SkinsColor.bgTextViewStyle_border,
        height: 28,
        width: 120 * UIMacro.WIDTH_PERCENT,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'flex-end',
        right: -20 * UIMacro.WIDTH_PERCENT,
        marginTop: 18* UIMacro.WIDTH_PERCENT,
        backgroundColor: SkinsColor.bgTextViewStyle_bg
    },
    contentImageStyle: {
        marginTop: 10 * UIMacro.WIDTH_PERCENT,
        right: 115 * UIMacro.WIDTH_PERCENT,
        width: 42.5 * UIMacro.WIDTH_PERCENT,
        height: 40 * UIMacro.HEIGHT_PERCENT,

    },
    amountTextStyle: {
        right: 10,
        color: '#FEFEFE',
        fontWeight: 'bold',
        fontSize: 13,
    },
    sureBtnViewStyle: {
        width: 118 * UIMacro.WIDTH_PERCENT,
        height: 41 * UIMacro.HEIGHT_PERCENT,
        marginTop: 8 * UIMacro.HEIGHT_PERCENT,
    },
    sureTextStyle: {
        color: '#fff',
        fontSize: 15,
        fontWeight: 'bold',
        height: 45 * UIMacro.HEIGHT_PERCENT,
        textAlign: 'center',
        lineHeight: 45 * UIMacro.HEIGHT_PERCENT,
        marginTop:-3* UIMacro.HEIGHT_PERCENT,
    },
    textInputStyle: {
        width: 225 * UIMacro.WIDTH_PERCENT,
        height: 30 * UIMacro.HEIGHT_PERCENT,
        backgroundColor: SkinsColor.bgTextViewStyle_bg,
        marginLeft: 5,
        borderRadius: 5,
        paddingLeft: 50 * UIMacro.WIDTH_PERCENT,
        color: '#fff',
        fontSize: 12,
        padding: 0,
        borderColor:SkinsColor.bgTextViewStyle_border,
        borderWidth:0.5,
    },
    //绑定福利账号
    bingIncomeBtnViewStyle: {
        marginLeft: 5,
        justifyContent: 'center',
        alignItems: 'center'
    },
    bingIncomeTextStyle: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#fff',
    },
    //50 100 按钮样式
    amount50And100Style: {
        marginLeft: 5 * UIMacro.WIDTH_PERCENT,
        justifyContent: 'center',
        alignItems: 'center',
    },
    amount50And100TextStyle: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#fff',
        position: 'absolute'
    },

});