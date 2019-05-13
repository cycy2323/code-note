/**
 * @lemon
 *
 */

import React, {Component} from 'react';
import {
    Platform,
    TouchableOpacity,
    StyleSheet,
    ImageBackground,
    Text,
    View,
    ScrollView,
    DeviceEventEmitter,
    Linking,
    AppState,
} from 'react-native';
import GBNetWorkService from '../../core/GBNetWorkService';
import UserInfo from '../../core/UserInfo' ;
import MusicManager from "../MusicManager/MusicManager";
import UIMacro from "../../core/UIMacro";
import ImageUrlManager from '../../core/ImageUrlManager'
import LottieView from 'lottie-react-native';
import SkinsColor from '../../core/SkinsColor';
import TouchableBounce from "../../common/TouchableBounce";
import FastImage from 'react-native-fast-image'


type Props = {};
export default class HomeTopView extends Component<Props> {
    state = {
        loginModalVisible: false,
        withdrawAmount: 0.00,
        userName: '',
        avatar: require('../../static/images/2.1.0/visitor.webp'),
        sex: '',
    };
    // 点击优惠活动
    promotions = () => {
        MusicManager.getInstance().playShowAlert();
        this.props.promotions()
    };
    // 点击玩家中心 by Chester
    personalCenterPress = () => {
        MusicManager.getInstance().playShowAlert();
        this.props.personalCenterPress()
    };
    //头像点击
    visitorClick = () => {
        UserInfo.avatarUrl = this.state.avatar
        MusicManager.getInstance().playShowAlert();
        this.props.visitorClick()
    }
    //点击 +
    handleRecharge = () => {
        MusicManager.getInstance().playShowAlert();
        this.props.handleRecharge()
    }
    //点击 刷新
    handleRecovery = () => {
        MusicManager.getInstance().playMoney();

        if (UserInfo.isLogin === false) {
            this.props.setLoginVisible(true)
        } else {
            //一键刷新
            let url = 'mobile-api/mineOrigin/recovery.html';
            let para = {'search.apiId': ''};
            GBNetWorkService.post(url, para, null, this.successRefresh, this.failRefresh)
        }
    }
    //一键刷新
    successRefresh = (json) => {
        console.log('成功 ' + JSON.stringify(json))
        let url = 'mobile-api/userInfoOrigin/getUserInfo.html';
        GBNetWorkService.get(url, null, null, this.successGetUserInfo, this.failGetUserInfo)
    }
    failRefresh = (json) => {
        console.log('失败 ' + json);
    }
    successGetUserInfo = (json) => {
        console.log('userInfo:',json);
        if(json.data && json.data.user){
            UserInfo.walletBalance = json.data.user.walletBalance
            DeviceEventEmitter.emit('rn_login_success', json.data.user.username, json.data.user.walletBalance);
        }
    }

    failGetUserInfo = (json) => {
        console.log('头部刷新失败' + JSON.stringify(json))
        // UserInfo.isLogin = false ;
    }

    //接收DeviceEventEmitter发过来的通知
    componentDidMount() {
        this.isMounted = true
        this.deEmitter = DeviceEventEmitter.addListener('rn_login_success', (name, withdraw, avatar, sex) => {
            console.log('homeTopView', name, withdraw, avatar, sex)
            this.setState({
                userName: name,
                withdrawAmount: withdraw,
                avatar: avatar ? ({uri: ImageUrlManager.dealURI(avatar)}) : sex === 'female'
                    ? (require('../../static/images/2.1.0/photo_female.webp'))
                    : (require('../../static/images/2.1.0/photo_male.webp')),
                sex: sex
            })
        })
        this.lister = DeviceEventEmitter.addListener('rn_login_out', () => {
            UserInfo.isLogin = false;
            this.setState({
                userName: null,
                withdrawAmount: 0.00,
                avatar: require('../../static/images/2.1.0/visitor.webp'),
            })
            //弹出登录页面a
            this.props.visitorClick();
        })

        //获取抽奖红包金额
        this.deEmitter1 = DeviceEventEmitter.addListener('rn_RedPag_RefreshWalletBalance', (redPagMoney) => {
            this.setState({
                withdrawAmount:this.state.withdrawAmount+redPagMoney
            })
        })

        AppState.addEventListener('change', this.onAppStateChanged);
    }

    onAppStateChanged = () => {
        switch (AppState.currentState) {
            case "active":
                this.kefuAnimation.play();
                this.youhuihuodongAnimation.play();
                this.xiaoxizhongxinAnimation.play();
                this.wanjiazhongxinAnimation.play();
                break;
            default:
        }
    }

    componentWillUnmount() {
        this.isMounted = false
        this.deEmitter.remove()
        this.lister.remove()
        this.deEmitter1.remove()
        AppState.removeEventListener('change', this.onAppStateChanged);
    }

    // 消息中心
    MessagesCenter = () => {
        MusicManager.getInstance().playShowAlert();
        this.props.MessagesCenter()
    }
    /*联系客服：跳转到外部浏览器*/
    customerService = () => {
        if (!UserInfo.isLogin) {
            this.props.setLoginVisible()
        } else {
            if (UserInfo.customerUrl && UserInfo.customerUrl.length > 0) {
                Linking.openURL(UserInfo.customerUrl);
            } else {
                GBNetWorkService.get("mobile-api/origin/getCustomerService.html", null, null, this._customerServiceSuccessBack,
                    this._customerServiceFailBack)
            }
        }

    };
    _customerServiceSuccessBack = (json) => {
        console.log("成功:" + JSON.stringify(json));
        if(json.data && json.data.customerUrl){
            Linking.openURL(json.data.customerUrl)
        }
    };
    _customerServiceFailBack = (json) => {
        console.log("失败:" + JSON.stringify(json))
    };

    render() {
        return (
            <View style={styles.container}>
                <FastImage source={require('../../static/images/2.1.0/top_bg.webp')}
                                 resizeMode='stretch'
                                 style={styles.topBg}>
                    {/*左*/}
                    <View style={styles.userBg}>
                        {/*头像*/}
                        <View style={styles.userMsg}>
                            <TouchableBounce onPress={this.visitorClick} style={styles.visitorImgBG}>
                                <FastImage source={this.state.avatar}
                                       resizeMode='contain'
                                       style={styles.visitorImg}/>
                            </TouchableBounce>
                            {/*头像信息*/}
                            <View style={styles.visitorMessage}>
                                <Text numberOfLines={1} style={styles.user_info}>
                                    {(this.state.userName === '' || this.state.userName === null) ? '请先登录' : this.state.userName}
                                </Text>
                                <View style={styles.user_info_bg}>
                                    <Text style={styles.save_info}>保险箱</Text>
                                    <Text style={styles.user_info}>0.00</Text>
                                </View>
                            </View>
                        </View>
                        {/*/!*福利*!/*/}
                        <FastImage source={require('../../static/images/2.1.0/rounded_bg.webp')}
                                         resizeMode='stretch'
                                         style={styles.rounded_bg}>
                            <TouchableBounce onPress={this.handleRecovery}>
                                <FastImage source={require('../../static/images/2.1.0/btn_refresh.webp')}
                                       resizeMode='contain'
                                       style={styles.btn_refresh}/>
                            </TouchableBounce>
                            <View style={styles.welfare}>
                                <Text style={styles.roundedText}>福利</Text>
                                <Text style={styles.welfareText}>
                                    {UserInfo.isDot(this.state.withdrawAmount)}
                                </Text>
                            </View>
                            <TouchableBounce onPress={this.handleRecharge}>
                                <FastImage source={require('../../static/images/2.1.0/btn_top_recharge.webp')}
                                       resizeMode='contain'
                                       style={styles.btn_top_recharge}>
                                </FastImage>
                            </TouchableBounce>
                        </FastImage>
                    </View>
                    {/*右*/}
                    <View style={styles.TopR}>
                        <TouchableOpacity style={styles.itemStyle} onPress={this.customerService}>
                            <LottieView
                                style={{
                                    flex:1
                                }}
                                source={require('../../static/animation/kefu/kefu.json')}
                                imageAssetsFolder={'lottie/kefu/images'}
                                ref={animation => {
                                    this.kefuAnimation = animation;
                                }}
                                autoPlay
                                loop>
                            </LottieView>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.itemStyle} onPress={this.promotions}>
                            <LottieView
                                style={{
                                    flex:1
                                }}
                                source={require('../../static/animation/youhuihuodong/youhuihuodong.json')}
                                imageAssetsFolder={'lottie/youhuihuodong/images'}
                                ref={animation => {
                                    this.youhuihuodongAnimation = animation;
                                }}
                                autoPlay
                                loop>
                            </LottieView>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.itemStyle} onPress={this.MessagesCenter}>
                            <LottieView
                                style={{
                                    flex:1
                                }}
                                source={require('../../static/animation/xiaoxizhongxin/xiaoxizhongxin.json')}
                                imageAssetsFolder={'lottie/xiaoxizhongxin/images'}
                                ref={animation => {
                                    this.xiaoxizhongxinAnimation = animation;
                                }}
                                autoPlay
                                loop>
                            </LottieView>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.itemStyle} onPress={this.personalCenterPress}>
                            <LottieView
                                style={{
                                    flex: 1
                                }}
                                source={require('../../static/animation/wanjiazhongxin/wanjiazhongxin.json')}
                                imageAssetsFolder={'lottie/wanjiazhongxin/images'}
                                ref={animation => {
                                    this.wanjiazhongxinAnimation = animation;
                                }}
                                autoPlay
                                loop>
                            </LottieView>
                        </TouchableOpacity>
                    </View>
                </FastImage>
            </View>
        );
    }
}

const styles = StyleSheet.create({

    container: {},
    topBg: {
        flexDirection: 'row',
        height: 45 * UIMacro.HEIGHT_PERCENT,
        width: UIMacro.SCREEN_WIDTH,
        paddingBottom: 3 * UIMacro.HEIGHT_PERCENT,
    },
    userBg: {
        flex: 3,
        flexDirection: 'row',
        alignItems: 'center',
        left: 10 * UIMacro.HEIGHT_PERCENT,
    },
    userMsg: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    user_info_bg: {
        width: 108 * UIMacro.HEIGHT_PERCENT,
        height: 16 * UIMacro.HEIGHT_PERCENT,
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: SkinsColor.user_info_bg,
        borderColor: SkinsColor.user_info_bg_border,
        borderWidth: .5,
        borderRadius: 16,
    },
    save_info: {
        marginLeft: 6 * UIMacro.HEIGHT_PERCENT,
        color: 'rgba(255, 253, 64, 1)',
        fontSize: 10,
        lineHeight:14*UIMacro.HEIGHT_PERCENT
    },
    user_info: {
        marginLeft: 6 * UIMacro.HEIGHT_PERCENT,
        marginBottom: 3 * UIMacro.HEIGHT_PERCENT,
        color: '#fff',
        fontSize: 10,
        marginRight: 6 * UIMacro.HEIGHT_PERCENT,
    },
    visitorImgBG: {},
    visitorImg: {
        width: 35 * UIMacro.HEIGHT_PERCENT,
        height: 35 * UIMacro.HEIGHT_PERCENT,
    },
    visitorMessage: {},
    rounded_bg: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        width: 30 * (373 / 63) * UIMacro.HEIGHT_PERCENT,
        height: 30 * UIMacro.HEIGHT_PERCENT,
        alignItems: 'center',
        marginLeft: 8 * UIMacro.HEIGHT_PERCENT,
    },
    btn_refresh: {
        marginLeft: 2 * UIMacro.HEIGHT_PERCENT,
        width: 26 * UIMacro.HEIGHT_PERCENT,
        height: 26 * UIMacro.HEIGHT_PERCENT,
    },
    welfare: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: (30 * (373 / 63) - 72) * UIMacro.HEIGHT_PERCENT,
    },
    roundedText: {
        marginRight: 15,
        fontSize: 12,
        color: '#FFD800',
        marginTop:2*UIMacro.HEIGHT_PERCENT,
    },
    welfareText: {
        // marginRight:15,
        fontSize: 12,
        color: '#fff',
        marginTop:2*UIMacro.HEIGHT_PERCENT
    },
    btn_top_recharge: {
        marginRight: 2 * UIMacro.HEIGHT_PERCENT,
        width: 26 * UIMacro.HEIGHT_PERCENT,
        height: 26 * UIMacro.HEIGHT_PERCENT,
    },
    TopR: {
        flex: 2.1,
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        paddingRight: 30 * UIMacro.HEIGHT_PERCENT,
    },
    itemStyle: {
        marginLeft: 0 * UIMacro.SCREEN_FULL_PERCENT,
        top: -5 * UIMacro.HEIGHT_PERCENT,
        width: 70 * UIMacro.HEIGHT_PERCENT,//宽高小比例屏幕,图标超出屏幕
        height: 60 * UIMacro.HEIGHT_PERCENT,
        // backgroundColor: 'red'
    },

});
