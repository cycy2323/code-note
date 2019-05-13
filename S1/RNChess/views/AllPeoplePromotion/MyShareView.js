import {Component} from "react";
import {
    StyleSheet,
    View,
    Text,
    Clipboard, Alert, Platform, CameraRoll
} from 'react-native';
import React from "react";
import UIMacro from '../../core/UIMacro'
import FastImage from 'react-native-fast-image'
import GBNetWorkService from "../../core/GBNetWorkService";
import Toast from "../../common/ToastView";
import ImageUrlManager from "../../core/ImageUrlManager";

import RNFetchBlob from 'react-native-fetch-blob';
import RNFS from 'react-native-fs';
import SkinsColor from "../../core/SkinsColor";
import UserInfo from "../../core/UserInfo";
import TouchableBounce from "../../common/TouchableBounce";

type Props = {};
export default class MyShareView extends Component<Props> {

    constructor(pros) {
        super(pros);
        this.state = {
            shareCode: '', //分享码
            qcCodeImg: '', //二维码地址
            canReceiveReward: 0,   //是否可以点击领取。（0为不可领取，1为可以领取）
            shareMsg: '',  //分享链接后年那段文字
            shareUrl: '',  //分享链接
            shareMoney: 0, //可领取红利
        }
    };

    componentDidMount() {
        this.getShareData();
    }

    getShareData = () => {
        GBNetWorkService.post('mobile-api/allPersonRecommend/myShare.html', null, null, this._getMyShareDataSuccess, this._getMyShareDataFail)
    }
    _getMyShareDataSuccess = (json) => {
        if (parseInt(json.code) === 0) {
            this.ids='';
            if (json.data&&json.data.ids&&json.data.ids.length>0){
                for (let i = 0 ; i<json.data.ids.length;i++){
                    if (i===json.data.ids.length-1){
                        this.ids += json.data.ids[i].toString();
                    } else
                    {
                        this.ids += json.data.ids[i]+',';
                    }
                }
            }
            this.setState({
                shareCode: json.data.shareCode,
                qcCodeImg: json.data.qcCodeImg,
                canReceiveReward: json.data.canReceiveReward,
                shareMsg: json.data.shareMsg,
                shareUrl: json.data.shareUrl,
                shareMoney: json.data.shareMoney,
            }, this.props.setTopValue(json.data.shareUserNum, json.data.preDayRecommendMonty, json.data.preDayShareMoney))
        }
        console.log("获取我的分享数据" + JSON.stringify(json))
    }
    _getMyShareDataFail = () => {

    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.topViewStyle}>
                    <FastImage
                        source={require('../../static/images/2.1.0/img_ad.webp')}
                        style={styles.adImageStyle}
                        resizeMode='stretch'
                    />
                    {this._recieveView()}
                </View>
                <FastImage style={styles.bottomBackgoundImageStyle}
                                 source={require('../../static/images/2.1.0/bg_base_share.webp')}
                                 resizeMode='stretch'
                >
                    <FastImage source={require('../../static/images/2.1.0/bg_share.webp')}
                                     style={styles.bottomLeftBgImageStyle}
                    >
                        <FastImage source={require('../../static/images/2.1.0/deco_promotion.webp')}
                               style={styles.redCornerImageStyle}
                        />
                        <FastImage source={require('../../static/images/2.1.0/title_share_promotion.webp')}
                               style={styles.titleShareImageStyle}
                        />
                        <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                            <View style={styles.myCodeViewStyle}>
                                <FastImage source={require('../../static/images/2.1.0/font_mycode.webp')}
                                       style={{
                                           width: 78 * UIMacro.WIDTH_PERCENT,
                                           height: 15 * UIMacro.WIDTH_PERCENT,
                                           marginLeft: 10,
                                           marginRight: 10
                                       }}
                                />
                                <Text style={{color: 'white', fontSize: 12}}>{this.state.shareCode}</Text>
                            </View>
                            <TouchableBounce style={{marginLeft: 5}}
                                             onPress={this._copyCodeBtnClick}
                            >
                                <FastImage source={require("../../static/images/2.1.0/btn_blue.webp")} style={{
                                    width: 40 * UIMacro.SCREEN_FULL_PERCENT,
                                    height: 40 * (60 / 91) * UIMacro.WIDTH_PERCENT,
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}>
                                    <Text style={{fontSize: 11, color: 'white'}}>复制</Text>
                                </FastImage>
                            </TouchableBounce>
                        </View>
                        <Text style={styles.copyContentStyle}
                              numberOfLines={0}
                        >
                            {this.state.shareUrl}
                        </Text>
                        <TouchableBounce style={{marginTop: 5}}
                                         onPress={this._copyShareBtnClick}
                        >
                            <FastImage source={require('../../static/images/2.1.0/btn_copy_promotion.webp')}
                                             style={styles.saveBtnStyle}
                            >
                            </FastImage>
                        </TouchableBounce>
                    </FastImage>
                    <FastImage source={require('../../static/images/2.1.0/bg_qrcode.webp')}
                                     style={styles.bottomRightBgImageStyle}
                    >
                        <View style={styles.qrViewStyle}>
                            <FastImage style={styles.qrImageStyle} source={{
                                uri:
                                    "data:image/png;base64," + this.state.qcCodeImg
                            }}/>
                            {/*<Text style={{color:'#222222',fontSize: 10,marginTop:7*UIMacro.HEIGHT_PERCENT}}>分享专属二维码</Text>*/}
                            {/*<Text style={{color:'#222222',fontSize: 10}}>保存后前往相册查看</Text>*/}
                            <Text style={{
                                color: '#222222',
                                fontSize: 10,
                                marginTop: 7 * UIMacro.HEIGHT_PERCENT
                            }}>分享专属二维码</Text>
                            <Text style={{color: '#222222', fontSize: 10}}>截屏后前往相册查看</Text>
                        </View>

                        {/*<TouchableBounce style={{marginTop:5*UIMacro.HEIGHT_PERCENT}}*/}
                        {/*onPress={this._saveBtnClick}*/}
                        {/*>*/}
                        {/*<ImageBackground source={require('../../static/images/2.1.0/btn_save_promotion.webp')}*/}
                        {/*style={styles.saveBtnStyle}*/}
                        {/*>*/}
                        {/*</ImageBackground>*/}
                        {/*</TouchableBounce>*/}
                    </FastImage>
                </FastImage>
                <Toast
                    ref="toast"
                    style={{
                        backgroundColor: 'white',
                        marginTop: 0.6 * UIMacro.SCREEN_HEIGHT,
                        marginLeft: -50 * UIMacro.WIDTH_PERCENT
                    }}
                    fadeInDuration={300}
                    fadeOutDuration={300}
                    opacity={1}
                    textStyle={{color: 'black'}}
                />
            </View>
        )
    }

    _recieveView = () => {
        return (<FastImage
            source={parseFloat(this.state.shareMoney) === 0 ? require('../../static/images/2.1.0/bg_noreceive.webp') :
                require('../../static/images/2.1.0/bg_receive.webp')}
            style={styles.recieveImageStyle}
        >
            {parseFloat(this.state.shareMoney) === 0 ? null :
                <View style={{
                    width: '100%',
                    justifyContent: 'center', alignItems: 'center'
                }}>
                    <View style={{
                        backgroundColor: 'rgba(0,0,0,0.2)', width: '100%', height: 21 * UIMacro.HEIGHT_PERCENT,
                        justifyContent: 'center', alignItems: 'center'
                    }}>
                        <Text style={{color: '#FFE400', fontSize: 12, fontWeight: 'bold',}}>
                            {UserInfo.isDot(this.state.shareMoney)}
                        </Text>
                    </View>
                    <TouchableBounce style={{marginTop: 3 * UIMacro.HEIGHT_PERCENT}} onPress={this._recieveBtnClick}>
                        <FastImage style={styles.recieveBtnStyle}
                               source={require('../../static/images/2.1.0/btn_receive.webp')}
                               resizeMode='stretch'
                        />
                    </TouchableBounce></View>}
        </FastImage>)


    }
    _recieveBtnClick = () => {
        //领取
        if (this.state.canReceiveReward === 1) {
            let param = {'ids': this.ids};
            //获取未领取的奖励
            GBNetWorkService.post('mobile-api/allPersonRecommend/getUnReciveReward.html', param, null, this._getUnReceiveRewardSuccess,
                this._getUnReceiveRewardFail)
        } else {
            this.refs.toast.show("暂时不可领取")
        }
    }

    _getUnReceiveRewardSuccess = (json) => {
        if (parseInt(json.code) === 0) {
            this.setState({
                shareMoney:0
            },this.refs.toast.show("领取成功", this.getShareData))
        }

    }

    _getUnReceiveRewardFail = (json) => {
        this.refs.toast.show("领取失败")
    }
    //复制推荐码
    _copyCodeBtnClick = () => {
        this.refs.toast.show("复制成功")
        Clipboard.setString(this.state.shareCode)
    }
    //复制并分享
    _copyShareBtnClick = () => {
        this.refs.toast.show("复制成功")
        Clipboard.setString(this.state.shareUrl)
    }
    _saveBtnClick = () => {
        Alert.alert(
            '提示',
            '是否需要保存图片到相册',
            [
                {text: '确定', onPress: () => this.dialogSure()},
                {text: '取消', style: 'cancel'},
            ],
            {cancelable: false}
        )
    }

    //弹窗确定按钮点击
    dialogSure = () => {
        let that = this;
        let urlStr = ("data:image/png;base64," + that.state.qcCodeImg).url
        if (!that.state.qcCodeImg) {
            that.refs.toast.show('图片不存在');
            return;
        }
        return new Promise((resolve, reject) => {
            let timestamp = (new Date()).getTime();//获取当前时间戳
            let random = String(((Math.random() * 1000000) | 0))//六位随机数
            let dirs = Platform.OS === 'ios' ? RNFS.LibraryDirectoryPath : RNFS.ExternalDirectoryPath; //外部文件，共享目录的绝对路径（仅限android）
            const downloadDest = `${dirs}/${timestamp + random}.jpg`;
            const options = {
                fromUrl: urlStr,
                toFile: downloadDest,
                background: true,
                begin: (res) => {
                    // console.log('begin', res);
                    // console.log('contentLength:', res.contentLength / 1024 / 1024, 'M');
                },
            };
            try {
                const ret = RNFS.downloadFile(options);
                ret.promise.then(res => {
                    console.log('下载成功' + JSON.stringify(res));
                    // console.log('file://' + downloadDest)
                    let promise = CameraRoll.saveToCameraRoll(downloadDest, 'photo');
                    promise.then(function (result) {
                        that.refs.toast.show('保存成功');
                    }).catch(function (error) {
                        console.log("保存图片失败：" + error)
                        that.refs.toast.show('保存失败');
                    });
                    resolve(res);
                }).catch(err => {
                    reject(new Error(err))
                });
            } catch (e) {
                reject(new Error(e))
            }
        })
    }

}


const styles = StyleSheet.create({
    container: {
        width: 540 * UIMacro.SCREEN_FULL_PERCENT,
        height: 328 * UIMacro.HEIGHT_PERCENT,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 5 * UIMacro.HEIGHT_PERCENT,
        borderRadius: 5,
        backgroundColor: 'rgba(0,0,0,0.4)',
        marginLeft: 5 * UIMacro.HEIGHT_PERCENT,
    },
    topViewStyle: {
        flexDirection: 'row',
        marginTop: 13 * UIMacro.HEIGHT_PERCENT,
        justifyContent: 'center'
    },
    adImageStyle: {
        width: 340 * UIMacro.SCREEN_FULL_PERCENT,
        height: 95 * UIMacro.HEIGHT_PERCENT,
        borderRadius: 5,
    },
    recieveImageStyle: {
        width: 161 * UIMacro.SCREEN_FULL_PERCENT,
        height: 95 * UIMacro.HEIGHT_PERCENT,
        marginLeft: 6 * UIMacro.SCREEN_FULL_PERCENT,
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'center',
        borderRadius: 5,
    },
    recieveTextStyle: {
        color: '#FFE400',
        fontSize: 12,
        fontWeight: 'bold',
        backgroundColor: 'rgba(0,0,0,0.2)'
    },
    recieveBtnStyle: {
        width: 65 * UIMacro.SCREEN_FULL_PERCENT,
        height: 26 * UIMacro.HEIGHT_PERCENT,
    },
    bottomBackgoundImageStyle: {
        width: 513 * UIMacro.SCREEN_FULL_PERCENT,
        height: 210 * UIMacro.HEIGHT_PERCENT,
        marginTop: 3 * UIMacro.HEIGHT_PERCENT,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    bottomLeftBgImageStyle: {
        width: 335 * UIMacro.SCREEN_FULL_PERCENT,
        height: 194 * UIMacro.HEIGHT_PERCENT,
        marginRight: 7 * UIMacro.SCREEN_FULL_PERCENT,
        borderRadius: 5,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    bottomRightBgImageStyle: {
        width: 155 * UIMacro.SCREEN_FULL_PERCENT,
        height: 194 * UIMacro.HEIGHT_PERCENT,
        borderRadius: 5,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    qrViewStyle: {
        width: 118 * UIMacro.SCREEN_FULL_PERCENT,
        height: 130 * UIMacro.WIDTH_PERCENT,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 5,
    },
    qrImageStyle: {
        width: 83 * UIMacro.WIDTH_PERCENT,
        height: 83 * UIMacro.WIDTH_PERCENT,
    },
    saveBtnStyle: {
        width: 121 * UIMacro.SCREEN_FULL_PERCENT,
        height: 46 * UIMacro.HEIGHT_PERCENT,

    },
    redCornerImageStyle: {
        width: 51 * UIMacro.WIDTH_PERCENT,
        height: 51 * UIMacro.WIDTH_PERCENT,
        position: 'absolute',
        top: 0,
        left: 0,
    },
    titleShareImageStyle: {
        width: 254 * UIMacro.WIDTH_PERCENT,
        height: 64 * UIMacro.WIDTH_PERCENT,
    },
    myCodeViewStyle: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: SkinsColor.bgTextViewStyle_bg,
        borderRadius: 5,
        height: 30 * UIMacro.WIDTH_PERCENT,
        width: 249 * UIMacro.SCREEN_FULL_PERCENT,

    },
    copyContentStyle: {
        width: 290 * UIMacro.SCREEN_FULL_PERCENT,
        height: 40 * UIMacro.WIDTH_PERCENT,
        backgroundColor: SkinsColor.bgTextViewStyle_bg,
        borderRadius: 5,
        color: '#CCDBFF',
        fontSize: 11,
        marginTop: 5,
        paddingLeft: 10 * UIMacro.WIDTH_PERCENT,
        paddingTop: 5 * UIMacro.WIDTH_PERCENT,

    }

});