import React, {Component} from 'react';
import {
    Dimensions,
    Modal,
    StyleSheet,
    Text,
    View,
    ImageBackground,
    Image,
    DeviceEventEmitter,
} from 'react-native';
import UIMacro from "../../core/UIMacro";
import TouchableBounce from "../../common/TouchableBounce";
import FastImage from 'react-native-fast-image'


type
    Props = {};

export default class RechargeSuccessPopView extends Component<Props> {
    constructor(pros) {
        super(pros);
        this.state = {}
    }

    componentWillUnmount() {
        this.timer && clearTimeout(this.timer);
    }

    render() {
        return (
            <View>
                <Modal
                    animationType="fade"/*弹框出现方式*/
                    transparent={true}
                    visible={this.props.modalVisible}
                    onRequestClose={() => {
                        this.props.setModalVisible(!this.props.modalVisible);
                    }}
                    supportedOrientations={['landscape-left', 'landscape-right']}
                >
                    {/*增加黑色背景透明层*/}
                    <View style={styles.opacityView}/>
                    <View style={styles.containerStyle}>
                        <FastImage style={styles.modalView} source={require("../../static/images/2.1.0/bg_success.webp")}>
                            {/*关闭按钮*/}
                            <View style={styles.closeImageView}>
                                <TouchableBounce
                                    activeOpacity={1}
                                    onPress={() => {
                                        this._depositeAginClick()
                                    }}
                                >
                                    <FastImage
                                        style={styles.closeImage}
                                        resizeMode='stretch'
                                        source={require('../../static/images/2.1.0/close.webp')}
                                    />
                                </TouchableBounce>
                            </View>
                            <View style={styles.tipViewStyle}>
                                <Text style={styles.tipTextStyle}>正在等待系统处理</Text>
                                <Text style={styles.tipTextStyle}>请注意查看福利!</Text>
                            </View>
                            <View style={{
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginTop: 15,
                                marginRight: -60 * UIMacro.WIDTH_PERCENT
                            }}>
                                <TouchableBounce onPress={() => {
                                    this._depositeAginClick()
                                }}>
                                    <FastImage source={(require("../../static/images/2.1.0/btn_purple.webp"))}
                                                     style={styles.submitBtnStyle}>
                                        <Text style={{fontSize: 18, color: 'white'}}>再存一次</Text>
                                    </FastImage>
                                </TouchableBounce>
                                <TouchableBounce onPress={() => {
                                    this._backToFirstPage()
                                }}>
                                    <FastImage source={(require("../../static/images/2.1.0/btn_green3_click.webp"))}
                                                     style={styles.submitBtnStyle}>
                                        <Text style={{fontSize: 18, color: 'white', marginLeft: 5}}>返回首页</Text>
                                    </FastImage>
                                </TouchableBounce>
                            </View>
                        </FastImage>
                    </View>
                </Modal>
            </View>
        );
    }

    _depositeAginClick = () => {
        this.props.setModalVisible(!this.props.modalVisible)
    }
    _backToFirstPage = () => {
        this.props.setModalVisible(!this.props.modalVisible)
        this.timer = setTimeout(() => {
            DeviceEventEmitter.emit('depositeSucess', false);
        }, 500);
    }
}

const styles = StyleSheet.create({
    opacityView: {
        width: UIMacro.SCREEN_WIDTH,
        height: UIMacro.SCREEN_HEIGHT,
        opacity: 0.8,
        backgroundColor: '#000',
        position: 'absolute',

    },
    containerStyle: {
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        width: UIMacro.SCREEN_WIDTH,
        height: UIMacro.SCREEN_HEIGHT,

    },
    closeImageView: {
        position: 'absolute',
        right: 110 * UIMacro.WIDTH_PERCENT,
        top: 55 * UIMacro.HEIGHT_PERCENT,
    },
    closeImage: {
        width: 40 * UIMacro.WIDTH_PERCENT,
        height: 40 * UIMacro.WIDTH_PERCENT
    },
    modalView: {
        height: UIMacro.SCREEN_HEIGHT,
        width: 654 * UIMacro.WIDTH_PERCENT,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    tipViewStyle: {
        width: 160 * UIMacro.WIDTH_PERCENT,
        height: 50 * UIMacro.HEIGHT_PERCENT,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        borderRadius: 5,
        backgroundColor: 'rgba(0,0,0,0.2)',
        marginTop: 40 * UIMacro.HEIGHT_PERCENT,
        marginRight: -60 * UIMacro.WIDTH_PERCENT,
    },
    tipTextStyle: {
        fontSize: 15 * UIMacro.WIDTH_PERCENT,
        color: 'rgb(255,234,0)',
    },
    submitBtnStyle: {
        width: 118 * UIMacro.WIDTH_PERCENT,
        height: 40 * UIMacro.HEIGHT_PERCENT,
        justifyContent: 'center',
        alignItems: 'center',
    },


});