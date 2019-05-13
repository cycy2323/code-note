/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 *
 */

import React, {Component} from 'react';
import {StyleSheet, Text, View, Image, ImageBackground} from 'react-native';
import UIMacro from "../../core/UIMacro";
import SkinsColor from "../../core/SkinsColor";
import TouchableBounce from "../../common/TouchableBounce";
import FastImage from 'react-native-fast-image'


type Props = {};
export default class RechargeDetailHeadView extends Component<Props> {
    constructor(pros) {
        super(pros);
        this.state = {
            tipMessageHidden: false,

        }
    }

    render() {
        return (
            <View style={styles.container}>
                {this._rightTipMessageView()}
            </View>
        );
    }

    //右边提示消息视图
    _rightTipMessageView = () => {
        let array = [];
        if (!this.state.tipMessageHidden) {
            array.push(<FastImage source={require("../../static/images/2.1.0/message.webp")} style={styles.messageBgImageStyle}
                                        key={"message"}>
                <Text style={{color: 'rgb(227,64,0)', fontSize: 11 * UIMacro.HEIGHT_PERCENT, marginLeft: 8}}>温馨提示:完成存款后，请前往游戏大厅申请活动优惠。
                </Text>
                <TouchableBounce onPress={() => {
                    this._coloseBtnClick()
                }}>
                    <FastImage source={require("../../static/images/2.1.0/message_close.webp")}
                           style={{width: 25, height: 20, marginRight: 5}}/>
                </TouchableBounce>
            </FastImage>)
        }
        return array;
    }

    _coloseBtnClick = () => {
        this.setState({
            tipMessageHidden: true,
        })
    }

}
const styles = StyleSheet.create({
    container: {
        width: 340 * UIMacro.WIDTH_PERCENT,
        backgroundColor: SkinsColor.containerStyle_bg,
    },
    messageBgImageStyle: {
        height: 26,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: 337 * UIMacro.WIDTH_PERCENT,
        marginRight: 3,
    },
});
