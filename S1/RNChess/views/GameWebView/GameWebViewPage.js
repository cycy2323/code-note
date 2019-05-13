import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
} from 'react-native';
import UIMacro from "../../core/UIMacro";
import TouchableBounce from "../../common/TouchableBounce";
import FastImage from 'react-native-fast-image'

export default class GameWebViewPage extends Component {
    state = {
        dialogActiveStatus: false
    }

    render() {
        return (
            this.state.dialogActiveStatus &&
            <View style={styles.container}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalTitle}>
                        <FastImage style={styles.image} source={require('../../static/images/2.1.0/icon.webp')}/>
                    </View>
                    <Text style={styles.modalMessage}>确定要离开吗?</Text>
                    <View style={styles.horizonLine}/>
                    <View style={styles.row}>
                        <TouchableBounce style={styles.leftBn} onPress={this.props.onLeftPress} underlayColor={'#C5C5C5'}>
                            <Text style={styles.leftBnText}>确认</Text>
                        </TouchableBounce>
                        <View style={styles.verticalLine}/>
                        <TouchableBounce style={styles.rightBn} onPress={this.props.onRightPress}
                                          underlayColor={'#C5C5C5'}>
                            <Text style={styles.rightBnText}>取消</Text>
                        </TouchableBounce>
                    </View>
                </View>
            </View>
        )
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
        });
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
    modalContainer: {
        width: 270 * UIMacro.WIDTH_PERCENT,
        height: 154 * UIMacro.HEIGHT_PERCENT,
        borderRadius: 5,
        backgroundColor: "white",
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(204, 204, 204, 1)',
    },
    modalTitle: {
        width: 63 * UIMacro.WIDTH_PERCENT,
        height: 63 * UIMacro.HEIGHT_PERCENT,
        borderRadius: 50,
        borderWidth: 1,
        borderColor: 'rgba(204, 204, 204, 0.3)',
        backgroundColor: 'rgba(255, 255, 255, 1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: -20 * UIMacro.HEIGHT_PERCENT
    },
    image: {
        width: 92 / 2 * UIMacro.WIDTH_PERCENT,
        height: 77 / 2 * UIMacro.HEIGHT_PERCENT,
    },
    modalMessage: {
        color: '#8a8a8a',
        fontSize: 18,
        margin: 20,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    horizonLine: {
        backgroundColor: '#9f9fa3',
        height: 0.5,
        alignSelf: 'stretch',
        marginBottom: 5 * UIMacro.HEIGHT_PERCENT
    },
    verticalLine: {
        backgroundColor: 'rgba(204, 204, 204, 1)',
        width: 1,
        alignSelf: 'stretch',
        height:20*UIMacro.HEIGHT_PERCENT,
        marginTop: 7,
    },
    leftBn: {
        borderBottomLeftRadius: 3,
        padding: 7,
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    leftBnText: {
        fontSize: 16,
        color: 'rgba(153, 153, 153, 1)',
    },
    rightBn: {
        borderBottomRightRadius: 3,
        padding: 7,
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    rightBnText: {
        fontSize: 16,
        color: 'rgba(153, 153, 153, 1)'
    }
})