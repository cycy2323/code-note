/**
 * @lemon
 */

import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    Dimensions,
    TouchableHighlight,
    ImageBackground,
    ScrollView
} from 'react-native';
import SmallPopPage from "../../common/SmallPopPage";
import UIMacro from "../../core/UIMacro";
import TouchableBounce from '../../common/TouchableBounce'
import FastImage from 'react-native-fast-image';

export default class MessageDetailView extends SmallPopPage {
    //标题
    titleImage = ()=> {
        return require('../../static/images/2.1.0/title03.webp')
    }

    //重写弹窗内容
    contentView = () => {
        return (
            <View style={styles.content}>
                <View style={styles.player}>
                    <View style={styles.playerContent}>
                        <ScrollView>
                            <Text style={styles.playerText}>{this.props.detail?this.props.detail:'返回数据无详细内容'}</Text>
                        </ScrollView>
                    </View>
                </View>
                <TouchableBounce onPress={this.closePopView} style={styles.confirmBtn}>
                    <FastImage
                        style={styles.confirmBtnImage}
                        source={require('../../static/images/2.1.0/btn_general.webp')}>
                        <Text style={styles.confirmText}>确定</Text>
                    </FastImage>
                </TouchableBounce>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    content: {
        height:201*UIMacro.HEIGHT_PERCENT,
        width: 315*UIMacro.WIDTH_PERCENT,
    },
    player: {
        width: (315-16) * UIMacro.WIDTH_PERCENT,
        height: 120 * UIMacro.HEIGHT_PERCENT,
        borderRadius: 10,
        marginLeft: 6* UIMacro.WIDTH_PERCENT,
        justifyContent: 'center',
    },
    playerText: {
        color: '#fff',
        fontSize: 15,
        marginTop: 5 * UIMacro.HEIGHT_PERCENT,
    },
    playerContent: {
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 20 * UIMacro.WIDTH_PERCENT,
        marginRight: 20 * UIMacro.WIDTH_PERCENT,
    },
    confirmBtn: {
        marginTop: 12 * UIMacro.HEIGHT_PERCENT,
        marginBottom: 20 * UIMacro.HEIGHT_PERCENT,
        alignItems:'center',
    },
    confirmBtnImage: {
        width: 42 * (470 / 164) * UIMacro.HEIGHT_PERCENT,
        height: 42 * UIMacro.HEIGHT_PERCENT,
    },
    confirmText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        height: 46 * UIMacro.HEIGHT_PERCENT,
        lineHeight: 46 * UIMacro.HEIGHT_PERCENT,
        marginTop:-3* UIMacro.HEIGHT_PERCENT,
    },
});