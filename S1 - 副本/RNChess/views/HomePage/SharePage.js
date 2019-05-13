/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import SmallPopPage from '../../common/SmallPopPage' ;
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Image,
    Dimensions,
    CameraRoll,
    ImageBackground,
    Alert, PermissionsAndroid
} from 'react-native';
import RNFS from 'react-native-fs'; //文件处理
import Toast from '../../common/ToastView' ;
import GBNetWorkService from "../../core/GBNetWorkService";
import GBServiceParam from "../../core/GBServiceParam";
import FastImage from 'react-native-fast-image';
import LoadingView from "../Loading/LoadingView";
import UIMacro from "../../core/UIMacro";
import ImageUrlManager from '../../core/ImageUrlManager'
import TouchableBounce from "../../common/TouchableBounce";

type Props = {};
export default class ShareView extends SmallPopPage<Props> {

    constructor() {
        super();
        this.state = {
            ...this.state,
            imageUrl: ''
        }
    }

    pageDidShow = () => {
        this.loadingView.showAnimation();
        GBNetWorkService.get("mobile-api/chess/getShareQRCode.html", null, null, this.shareViewDataSuccessBack,
            this.shareViewDataFailBack);
        Platform.OS === 'android' && this.requestReadPermission();
    }


    shareViewDataSuccessBack = (json) => {
        console.log(json.data);
        if (json.data && json.data.qrCodeUrl) {
            this.setState({
                imageUrl: json.data.qrCodeUrl,
            })
        }

        this.loadingView.dismissAnimation();
    }
    shareViewDataFailBack = (json) => {
        this.loadingView.dismissAnimation();
        console.log(json);
    }

    renderPage = () => {
        return (
            [<Toast
                ref="toast"
                style={{backgroundColor: 'white',marginTop:300*UIMacro.HEIGHT_PERCENT}}
                fadeInDuration={300}
                fadeOutDuration={300}
                opacity={1}
                textStyle={{color: 'black'}}
                key={1}
            />,
                <LoadingView ref={(c) => this.loadingView = c} key={2}/>
            ]
    )
    }

    titleImage = () => {
        return require('../../static/images/2.1.0/title08.webp')
    }

    contentView = () => {
        return (
            <View style={styles.contentViewStyle}>
                <FastImage source={{
                    uri: ImageUrlManager.dealURI(this.state.imageUrl),
                    headers: {Host: GBServiceParam.currentHost},
                    priority: FastImage.priority.normal,
                }}
                    // resizeMode='contain'
                           style={styles.imageStyle}
                />
                <TouchableBounce style={styles.savePhotoViewStyle}
                                  onPress={() => this.savePhoto()}>
                    <ImageBackground style={styles.saveBtn}
                                     resizeMode='stretch'
                                     source={require('../../static/images/2.1.0/btn_menu.webp')}>
                        <Text style={styles.saveBtnTextStyle}>保存照片</Text>
                    </ImageBackground>
                </TouchableBounce>
            </View>
        );
    }

    async requestReadPermission() {
        try {
            //返回string类型
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                {
                    //第一次请求拒绝后提示用户你为什么要这个权限
                    'title': '我要读写权限',
                    'message': '没权限我不能工作，同意就好了'
                }
            )
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                return true;
            } else {
                return false;
            }
        } catch (err) {
            return false;
        }
    }

    //弹窗确定按钮点击
    dialogSure = () => {
        let that = this;
        let  urlStr = ImageUrlManager.dealURI(that.state.imageUrl);
        if (!that.state.imageUrl)  {that.refs.toast.show('图片不存在'); return;}
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


    //保存图片
    savePhoto = () => {
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
}

const styles = StyleSheet.create({
    contentViewStyle: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageStyle: {
        marginTop: 20* UIMacro.HEIGHT_PERCENT,
        width: 84* UIMacro.HEIGHT_PERCENT,
        height: 84* UIMacro.HEIGHT_PERCENT,
        marginBottom: 10* UIMacro.HEIGHT_PERCENT,
    },
    savePhotoViewStyle: {
        marginBottom: 20 * UIMacro.HEIGHT_PERCENT,
        marginTop: 10 * UIMacro.HEIGHT_PERCENT,
    },
    saveBtnTextStyle: {
        fontSize: 15,
        color: '#fff',
        textAlign: 'center'
    },
    saveBtn: {
        width: 118*UIMacro.HEIGHT_PERCENT,
        height: 41*UIMacro.HEIGHT_PERCENT,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

