import {Component} from "react";
import {
    Dimensions,
    Platform,
    StatusBar,
    StyleSheet,
    Text,
    View,
    ImageBackground,
    WebView,
    Image,
    Modal, Animated, Easing, NativeModules, NativeEventEmitter
} from 'react-native';
import React from "react";
import * as Progress from 'react-native-progress';
import TouchableBounce from '../../common/TouchableBounce'



type Props = {};
export default class UpdatePage extends Component<Props> {
    constructor(pros) {
        super(pros);
        this.state = {
            progress: 0.0,
            modalVisible: false,
            title: '下载安装包中...',
            updateMsg: ''
        }
    };

    //开启
    show = (updateMsg,downloadUrl,apkName) => {
        this.setState({
            modalVisible: true,
            updateMsg: updateMsg
        });

        if (Platform.OS === 'android')
        {
            const AndroidUpdateModule = NativeModules.AndroidUpdateModule;
            const AndroidUpdateModuleEmitter = new NativeEventEmitter(AndroidUpdateModule);

            AndroidUpdateModule.downloadApk(downloadUrl, apkName);

            const progressSubscription = AndroidUpdateModuleEmitter.addListener('RNDownLoadApkProgress', (progress) => {

                console.log("apk download progress:"+progress);
                if (progress+0.05 > this.state.progress || progress ===1.0)
                {
                    this.setState({
                        progress:progress
                    })
                }

                if (this.state.progress >= 1.0) {
                    this.setState({
                        title: '安装包已就绪'
                    })
                }
            });
        }

    }

    //关闭
    dismiss = () => {
        this.setState({modalVisible: false});
    }

    componentDidMount() {

    }

    componentWillUnmount() {
    }

    render() {
        return (
            this.state.modalVisible ?
                <View style={styles.container} accessible={false}>
                    <View style={styles.content}>
                        <Text style={styles.title}>{this.state.title}</Text>
                        <Text style={styles.des}>{this.state.updateMsg}</Text>
                        <Progress.Bar style={{marginBottom: 20}} progress={this.state.progress} width={190} height={2}
                                      color='rgb(227, 127, 28)'/>
                        {this.state.progress >= 1.0 &&
                        <TouchableBounce style={styles.installBt}>
                            <Text style={styles.installBtTitle}>安装</Text>
                        </TouchableBounce>}
                    </View>
                </View>
                : null
        )
    }
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        justifyContent: "center",
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    content: {
        width: 250,
        backgroundColor: 'rgba(22, 22, 22, 0.9)',
        borderRadius: 10,
        alignItems: "center",
    },
    installBt: {
        alignItems: "center",
        justifyContent: "center",
        width: 100,
        height: 32.5,
        borderRadius: 7.5,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.15)',
        marginBottom: 10
    },
    installBtTitle: {
        color: 'white'
    },
    title: {
        marginTop: 10,
        color: 'white',
        fontSize: 15,
    },
    des: {
        marginTop: 10,
        marginBottom: 20,
        color: 'white',
        fontSize: 12
    },

});