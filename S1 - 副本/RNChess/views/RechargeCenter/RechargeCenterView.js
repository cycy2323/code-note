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
    Image,
    ImageBackground,
    ScrollView,
    Linking
} from 'react-native';
import RechargeCenterNormalRightView from "./RechargeCenterNormalRightView";
import RechargeCenterOnlinePayRightView from './RechargeCenterOnlinePayRightView';
import RechargeDetailNormalView from './RechargeDetailNormalView';
import RechargeDetailOnlineBankView from './RechargeDetailOnlineBankView';
import RechargeDetailATMView from './RechargeDetailATMView'
import RechargeDetailOneCodePayView from './RechargeDetailOneCodePayView'
import RechargeDetailBitCoinView from './RechargeDetailBitCoinView'
import RechargeDetailOtherPayView from './RechargeDetailOtherPayView'
import UIMacro from "../../core/UIMacro"
import GBNetWorkService from "../../core/GBNetWorkService";
import GBServiceParam from "../../core/GBServiceParam";
import FastImage from 'react-native-fast-image'
import LoadingView from "../Loading/LoadingView";
import BigPopPage from "../../common/BigPopPage";
import ImageUrlManager from '../../core/ImageUrlManager'
import TouchableBounce from "../../common/TouchableBounce";


type Props = {};
export default class RechargeCenterView extends BigPopPage<Props> {
    constructor(pros) {
        super(pros);
        this.state = {
            ...this.state,
            leftSelectedIndex: 0,//主要标记选中哪一个
            leftSelectedType: "",
            showRightView: "", //normal表示是第一级页面，detail表示是详情页面
            leftDataArray: [],
            payWayDetailData: {},
            payWayAllData: {},
            money: "",
        }
    }


    pageDidShow=()=>{
        this.loadingView.showAnimation();
        GBNetWorkService.post("mobile-api/depositOrigin/index.html", null, null, this._rechargeSuccessBack, this._rechargeFailBack)
    }
    pageDidClose = ()=>{
        //状态都要重置
        this.setState({
                leftSelectedIndex: 0,//主要标记选中哪一个
                leftSelectedType: "",
                showRightView: "", //normal表示是第一级页面，detail表示是详情页面
                leftDataArray: [],
                payWayDetailData: {},
                payWayAllData: {},
                money: "",
            }
        )

    }
    renderPage = () => {
        return <LoadingView ref={(c) => this.loadingView = c}/>
    }

    _rechargeSuccessBack = (json) => {
        if (json.code === "0") {
            if (json.data.length > 0) {
                //默认请求第一个支付平台下的支付方式
                let item = json.data[0];
                if (item.name==="快充中心"){
                    this.setState({
                        leftDataArray: json.data,
                    })
                    Linking.openURL(item.code)
                } else {
                    this.setState({
                        leftDataArray: json.data,
                        leftSelectedType: item.code,
                        showRightView: item.code === 'bitcoin' ? 'bitCoinDetail' : 'normal',
                    })
                }

            }
        }
        this.loadingView.dismissAnimation();

    }
    _rechargeFailBack = (json) => {
        this.loadingView.dismissAnimation()
    }
    titleImage = () => {
        return require('../../static/images/2.1.0/title13.webp')

    }

    contentView = ()=>{
        return (
            <View style={styles.container}>
                <View style={styles.leftViewStyle}>
                        <ScrollView style={{height:'100%'}}>
                            {this._leftView()}
                        </ScrollView>
                </View>
                {this._rightView()}
            </View>)

    }

    //左边视图
    _leftView = () => {
        let array = [];
        for (let i = 0; i < this.state.leftDataArray.length; i++) {
            let leftData = this.state.leftDataArray[i];
            if (i === this.state.leftSelectedIndex) {
                array.push(<FastImage source={require("../../static/images/2.1.0/btn_click.webp")}
                                            style={styles.leftItemViewBgImageStyle} key={i}>
                    <TouchableBounce onPress={() => {
                        this._leftItemClick(leftData.code, i,leftData.name)
                    }} style={styles.leftItemBtnStyle}>
                        <View style={styles.leftItemViewStyle}>
                            <FastImage source={{
                                uri: ImageUrlManager.dealURI(leftData.iconUrl),
                                headers: {Host: GBServiceParam.currentHost},
                                priority: FastImage.priority.normal,
                            }} style={{width: 20, height: 22.5, marginLeft: 10}} resizeMode='contain'/>
                            <Text style={styles.leftItemViewTextstyle}>{leftData.name}</Text>
                        </View>
                    </TouchableBounce>
                </FastImage>)
            } else {
                array.push(<FastImage source={require("../../static/images/2.1.0/btn_general.webp")}
                                            style={styles.leftItemViewBgImageStyle} key={i}>
                    <TouchableBounce onPress={() => {
                        this._leftItemClick(leftData.code, i,leftData.name)
                    }} style={styles.leftItemBtnStyle}>
                        <View style={styles.leftItemViewStyle}>
                            <FastImage source={{
                                uri: ImageUrlManager.dealURI(leftData.iconUrl),
                                headers: {Host: GBServiceParam.currentHost},
                                priority: FastImage.priority.normal,
                            }} style={{width: 20, height: 22.5, marginLeft: 10}} resizeMode='contain'/>
                            <Text style={styles.leftItemViewTextstyle}>{leftData.name}</Text>
                        </View>
                    </TouchableBounce>
                </FastImage>)
            }

        }
        return array;
    }
    //左边按钮点击事件
    _leftItemClick = (code, index,name) => {
        console.log("点击充值的code="+code)
        if (name==="快充中心") {
            //这里要用 json.data.payLink 跳转到浏览器
            Linking.openURL(code)
        }else {
            this.setState({
                leftSelectedIndex: index,
                leftSelectedType: code,
                showRightView: code === 'bitcoin' ? 'bitCoinDetail' : 'normal',
            })
        }


    }
    _rightView = () => {
        if (this.state.showRightView === 'normal') {
            if (this.state.leftSelectedType === "online") {
                //在线支付
                return <RechargeCenterOnlinePayRightView callBack={this._submitBtnClick}
                                                         payType={this.state.leftSelectedType}/>
            } else {
                    return <RechargeCenterNormalRightView callBack={this._submitBtnClick}
                                                          payType={this.state.leftSelectedType}/>
            }
        } else if (this.state.showRightView === 'normalDetail') {
            return <RechargeDetailNormalView payWayType={this.state.leftSelectedType}
                                             payWayDetailData={this.state.payWayDetailData}
                                             money={this.state.money}
            />
        } else if (this.state.showRightView === 'onlineBankDetail') {
            return <RechargeDetailOnlineBankView payWayType={this.state.leftSelectedType}
                                                 payWayDetailData={this.state.payWayDetailData}
                                                 payWayAllData={this.state.payWayAllData}
                                                 money={this.state.money}/>
        } else if (this.state.showRightView === 'counterDetail') {
            return <RechargeDetailATMView payWayType={this.state.leftSelectedType}
                                          payWayDetailData={this.state.payWayDetailData}
                                          payWayAllData={this.state.payWayAllData}
                                          money={this.state.money}/>
        } else if (this.state.showRightView === 'oneCodePayDetail') {
            return <RechargeDetailOneCodePayView payWayType={this.state.leftSelectedType}
                                                 payWayDetailData={this.state.payWayDetailData}
                                                 money={this.state.money}/>
        } else if (this.state.showRightView === 'otherPayDetail') {
            return <RechargeDetailOtherPayView payWayType={this.state.leftSelectedType}
                                               payWayDetailData={this.state.payWayDetailData} money={this.state.money}/>
        } else if (this.state.showRightView === 'bitCoinDetail') {
            return <RechargeDetailBitCoinView payType={this.state.leftSelectedType}/>
        } else if (this.state.showRightView === 'onlinePay') {
            return <RechargeCenterOnlinePayRightView callBack={this._submitBtnClick}
                                                     payType={this.state.leftSelectedType}/>
        }
    }
    //提交按钮点击事件,flag跳到哪个详情，payWayData详情需要的数据
    _submitBtnClick = (flag, payWayData,payWayAllData,money) => {
        this.setState({
            showRightView: flag,
            payWayDetailData: payWayData,
            payWayAllData: payWayAllData,
            money: money,
        })

    }

}
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        marginRight: 5,
        justifyContent: 'space-between',
        height:290*UIMacro.WIDTH_PERCENT
    },
    leftViewStyle: {
        width: 133.5 * UIMacro.WIDTH_PERCENT,
        marginLeft:8 * UIMacro.WIDTH_PERCENT,
    },
    leftItemViewBgImageStyle: {
        height: 41 * UIMacro.HEIGHT_PERCENT,
        width: 117.5 * UIMacro.HEIGHT_PERCENT,
        marginTop: 5 * UIMacro.HEIGHT_PERCENT,
        marginLeft: 8 * UIMacro.WIDTH_PERCENT,
        marginRight: 8 * UIMacro.WIDTH_PERCENT,
        alignItems: 'flex-start',
        justifyContent: 'center',
    },
    leftItemViewStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 3,

    },
    leftItemViewTextstyle: {
        fontSize: 15 * UIMacro.HEIGHT_PERCENT,
        color: 'white',
    },
    leftItemBtnStyle: {
        width: '100%',
        height: '100%',
        alignItems: 'flex-start',
        justifyContent: 'center',
    }

});
