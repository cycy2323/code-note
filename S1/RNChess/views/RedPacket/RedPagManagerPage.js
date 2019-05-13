/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {
    DeviceEventEmitter,
    Platform,
    StatusBar,
    StyleSheet,
    View,
    ImageBackground,
    Linking,
    BackHandler,
    Image,
    Alert,
    TouchableOpacity,
    TextInput,
    AppState,
    PermissionsAndroid,
    Text
} from 'react-native';

import GBNetWorkService from '../../core/GBNetWorkService';
import RedPagTimes from '../RedPacket/RedPagTimes';  //显示红包次数
import RedPagMoney from '../RedPacket/RedPagMoney'; //红包金额
import RedPagNotWon from '../RedPacket/RedPagNotWon';//红包未中
import RedPagOverSell from '../RedPacket/RedPagOverSell';// 红包结束


type Props = {};
export default class RedPagManagerPage extends Component<Props> {

    constructor(pros) {
        super(pros);
        this.state = {
            dialogActiveStatus: false, //弹窗状态 默认关闭
            nextLotteryTime: '',  //下次拆红包时间
            redPagTimes: 0,   //抢红包次数
            redPagToken: '', //抢红包防重token
            redPagMoney:'',  //金额
        }
    };


    componentDidMount() {
        this.loadRedPagMsg();
    }



    componentWillUnmount() {

    }

    //打开弹窗
    showPopView = () => {
        this.setState({
            dialogActiveStatus: true
        })
    }

    //关闭弹窗
    closePopView = () => {
        this.setState({
            dialogActiveStatus: false
        })
    }


    render() {
        return (
            this.state.dialogActiveStatus &&
            <View style={styles.bgStyle}>
                {/*红包打开  this.redPagMoney.showPopView()*/}
                <RedPagTimes ref={(c) => this.redPagTimes = c}
                             redPagTimes={this.state.redPagTimes}
                             openRedPags={this.openRedPag}
                />

                {/*红包打开金额显示*/}
                <RedPagMoney ref={(c) => this.redPagMoney = c}
                             redPagMoney={this.state.redPagMoney}
                             openRedPagView={this.loadRedPagMsg}
                />

                {/*红包未中*/}
                <RedPagNotWon ref={(c) => this.redPagNotWon = c}
                              openRedPagView={this.redPagAgainOnce}
                />

                {/*红包结束*/}
                <RedPagOverSell ref={(c) => this.redPagOverSell = c}
                                nextLotteryTime={this.state.nextLotteryTime}
                />
            </View>
        );
    }

    //获取红包次数
    loadRedPagMsg=()=>{
        let param = {'activityMessageId': this.props.activityId};
        GBNetWorkService.post('mobile-api/activityOrigin/countDrawTimes.html', param, null, this._successGetTimeData, this._failGetTimeData);

    }
    //获取红包次数成功
    _successGetTimeData = (json) => {
        if (parseInt(json.code) === 0) {
            if (json.data.drawTimes === 0 || json.data.drawTimes === -5 || json.data.drawTimes === -1) {
                //RedPagOverSell 显示下次拆红包
                this.setState({
                    nextLotteryTime: json.data.nextLotteryTime,
                    redPagToken: json.data.token,
                }, this.redPagOverSell.showPopView);
            } else {
                //显示次数
                this.setState({
                    redPagTimes: json.data.drawTimes,
                    redPagToken: json.data.token,
                }, this.redPagTimes.showPopView);

            }
        }
        console.log(json.data);
    }
    //获取红包次数失败
    _failGetTimeData = () => {

    }

    //拆红包
    openRedPag = () => {
        let param = {'activityMessageId': this.activityId, 'gb.token': this.state.redPagToken};
        GBNetWorkService.post('mobile-api/activityOrigin/getPacket.html', param, null, this._successOpenRedPagData, this._failOpenRedPagData);
    }

    //成功拆开红包
    _successOpenRedPagData = (json) => {
        if (parseInt(json.code)===0){
            if (parseFloat(json.data.award)===0){
                //未中奖
                this.setState({
                    redPagToken:json.data.token,
                },this.redPagNotWon.showPopView)
            } else
            {
                //红包抢到金额应请求获取刷新用户余额
                this.setState({
                    redPagToken:json.data.token,
                    redPagMoney:json.data.award,
                },this.redPagMoney.showPopView)
            }
        }
    }

    //拆红包失败
    _failOpenRedPagData = (json) => {
        console.log(json);
    }
    //未中奖，再来一次
    redPagAgainOnce=()=>{
        //获取红包次数
        this.loadRedPagMsg();
    }

}

const styles = StyleSheet.create({
    bgStyle: {
        flex: 1,
        left:0,
        top:0,
        right:0,
        bottom:0,
        position:'absolute'
    },
});
