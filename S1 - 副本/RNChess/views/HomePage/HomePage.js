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
    Alert,
    TextInput,
    AppState,
    PermissionsAndroid,
    Text
} from 'react-native';
import Orientation from 'react-native-orientation';
import HomeBottomView from './HomeBottomView';
import HomeTopView from "./HomeTopView";
import GameFirstScrollView from './GameFirstScrollView';
import GameSecondScrollView from './GameSecondScrollView'
import GameThirdScrollView from './GameThirdScrollView'
import BannerView from './BannerView';
import MarqueeLabel from 'react-native-lahk-marquee-label';
import GBNetWorkService from '../../core/GBNetWorkService';
import UserInfo from "../../core/UserInfo";
import GBServiceParam from "../../core/GBServiceParam";
import LoadingView from '../Loading/LoadingView'
import codePush from "react-native-code-push";
import HotUpdatePage from '../UpdatePage/HotUpdatePage'
import LottieView from 'lottie-react-native';
import MusicManager from '../MusicManager/MusicManager'
import DeviceInfo from 'react-native-device-info';
import UpdatePage from '../UpdatePage/UpdatePage'
import RechargeCenterView from "../RechargeCenter/RechargeCenterView";
import SharePage from "./SharePage" ;  //分享
import IncomePage from "../Income/IncomePage" ;  //收益
import UIMacro from "../../core/UIMacro";
import PersonalMsgPage from "./PersonalMsgPage";
import PersonalCenterView from "../PersonalCenter/PersonalCenterView";
import RNExitApp from 'react-native-exit-app';
import JPushModule from 'jpush-react-native';
import TimeZoneManager from "../../core/TimeZoneManager";
import PromotionsView from "../Promotions/PromotionsView";
import LoginConfirmPage from '../LoginConfirm/LoginConfirmPage'
import RedPagTimes from '../RedPacket/RedPagTimes';  //显示红包次数
import RedPagMoney from '../RedPacket/RedPagMoney'; //红包金额
import RedPagNotWon from '../RedPacket/RedPagNotWon';//红包未中
import RedPagOverSell from '../RedPacket/RedPagOverSell';// 红包结束
import RedPagManagerPage from '../RedPacket/RedPagManagerPage' ;  //红包管理页
import JiuJiJinPopView from "../PromotPopsForHomePage/JiuJiJinPopView";
import ShouCunSongPopView from "../PromotPopsForHomePage/ShouCunSongPopView";
import ZhuCeSongPopView from "../PromotPopsForHomePage/ZhuCeSongPopView";
import RegisterImageSwitchView from "./RegisterImageSwitchView";
import RescueImageSwitchView from "./RescueImageSwitchView";
import RechargeImageSwitchView from "./RechargeImageSwitchView";
import RecommendImageSwitchView from "./RecommendImageSwitchView";
import TouchableBounce from "../../common/TouchableBounce";
import SkinsColor from "../../core/SkinsColor";
import PromptViewPage from "./PromptViewPage";
import SettingViewPage from "./SettingViewPage";
import FastImage from 'react-native-fast-image'



type Props = {};
export default class HomePage extends Component<Props> {

    static navigationOptions = {
        //允许使用返回手势
        gesturesEnabled: false,
    }

    constructor(pros) {
        super(pros);
        this.state = {
            onPage: 'firstPage',//标识在首页还是首页点击跳到其他页
            firstPageOffset: 0,//记录第一页偏移量,在第二页返回第一页的时候取
            secondPageOffset: 0,//记录第二页偏移量，在第三页返回第二页的时候取
            isLoading: true,
            announceString: "",
            progress: 0.0,//热更新的下载进度
            pkgDownloadProgress: 0.0,//安卓安装包的下载进度,
            PersonalCenterModal: false,
            uName: '',
            gameSearchString: '',//游戏列表搜索输入
            thirdGameListApi: 3,
            thirdGameListScrollToZero: false,
            selectStatus: true,
            nextLotteryTime: '',  //下次拆红包时间
            redPagTimes: 0,   //抢红包次数
            redPagToken: '', //抢红包防重token
            redPagMoney:'',  //金额
        }

        //监听安卓的无力返回键 让其不返回上一级
        BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
    };

    onBackButtonPressAndroid = () => {
        return true;
    };

    componentWillMount() {
        this.isMounted = false
        GBNetWorkService.checkInternetConnect();
        console.log("走了获取cookie的方法")
        GBNetWorkService.fetchCookie();
        this.customerService();


        if (GBServiceParam.siteJpushAppkey.length !== 0) {
            //有极光推送key的菜进行极光初始化
            //初始化极光推送
            JPushModule.initPush();
        }
    }

    /*跳转到外部浏览器*/
    customerService = () => {
        GBNetWorkService.get("mobile-api/origin/getCustomerService.html", null, null, this._customerServiceSuccessBack, this._customerServiceFailBack)
    };
    _customerServiceSuccessBack = (json) => {
        // console.log("customerService成功:" + JSON.stringify(json));
        if(json.data && json.data.customerUrl){
            UserInfo.customerUrl = json.data.customerUrl;
        }
        if(json.data && json.data.isInlay){
            UserInfo.isInlay = json.data.isInlay;
        }
    };
    _customerServiceFailBack = (json) => {
        console.log("失败:" + JSON.stringify(json))
    };

    _getAnnouncementSuccess = (json) => {
        console.log("xxxxxxxxxxxx::" + JSON.stringify(json["data"]["announcement"]))
        let announcementArr = Array.from(json["data"]["announcement"]);
        let announceStr = "";
        for (let i = 0; i < announcementArr.length; i++) {
            let str = announcementArr[i]["content"];
            str = str.replace(/[\r\n]/g, "")
            announceStr += "     " + str;

        }
        this.setState({
            announceString: announceStr,
        })
    }
    _getAnnouncementFail = (json) => {

    }

    enterGame = (itemData) => {
        let url = itemData.gameLink;
        this.loadingView.showAnimation();
        console.log("itemData.gameLink:"+url)
        GBNetWorkService.get(url, null, null, (response) => {
            this.loadingView.dismissAnimation();
            if (response != null) {
                if (Object.keys(response.data).length > 0) {
                    if (response.data.gameMsg) {
                        Alert.alert(response.data.gameMsg);
                    }
                    else {
                        MusicManager.getInstance().pauseBGM();
                        this.props.navigation.navigate('GameWebView', {url: response.data.gameLink});
                    }
                } else {
                    Alert.alert(response.message);
                }
            } else {
                Alert.alert("获取游戏链接失败");
            }

        }, (err) => {
            this.loadingView.dismissAnimation();
            Alert.alert("获取游戏链接失败 " + err);
        })
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

    downloadAndInstall = (response) => {
        if (Platform.OS === 'ios') {
            let downloadUrl = `itms-services://?action=download-manifest&url=https://${response.appUrl}${response.versionName}/${GBServiceParam.siteCode}/app_${GBServiceParam.siteCode}_${response.versionName}.plist`
            Linking.openURL(downloadUrl);
            setTimeout(() => {
                //强制退出
                RNExitApp.exitApp();
            }, 3 * 1000)
        }
        else {
            // let downloadUrl = `${GBServiceParam.currentPreUrl}/android/${response.versionName}/app_${GBServiceParam.siteCode}_${response.versionName}.apk`
            // console.log("下载路径：" + downloadUrl)
            // if (this.requestReadPermission()) {
            //     this.updatePage.show(response.memo, downloadUrl, `app_${GBServiceParam.siteCode}_${response.versionName}.apk`);
            // }

            //跳转到浏览器
            if (this.siteUrl)
            {
                Linking.openURL('http://'+this.siteUrl);
            }
            else
            {
                Alert.alert("未获取到主页域名")
            }

            setTimeout(() => {
                //强制退出
                RNExitApp.exitApp();
            }, 3 * 1000)
        }
    }

    //先检测是否需要更新原生包
    //如果不需要更新原生安装包 再检测热更新
    //包更新检测
    checkVersionUpdate = () => {
        if (__DEV__)
        {
            //调试模式不做更新检测
            return;
        }
        this.loadingView.showAnimation();

        let parameter = {code: GBServiceParam.siteCode, type: Platform.OS, siteId: GBServiceParam.siteId};
        GBNetWorkService.post("mobile-api/app/update.html", parameter, null, (response) => {

            this.loadingView.dismissAnimation();
            console.log("检测包更新成功:" + JSON.stringify(response));

            let GB_CURRENT_APPBUILD = DeviceInfo.getBuildNumber();
            console.log("getBuildNumber:" + GB_CURRENT_APPBUILD);
            if (response.versionCode <= GB_CURRENT_APPBUILD && response.forceVersion <= GB_CURRENT_APPBUILD) {
                //不需要更新
                //继续检测热更新
                console.log("不需要更新 继续检测热更新")
                this.checkHotUpdate();
            }
            else if (response.versionCode > GB_CURRENT_APPBUILD && response.forceVersion <= GB_CURRENT_APPBUILD) {
                //本地版本号比线上版本号要小 且
                //本地版本号大于强制更新版本号
                //需要弹框 但可以跳过

                Alert.alert(
                    '发现新版本啦',
                    response.memo,
                    [
                        {
                            text: '忽略更新', onPress: () => {
                                this.checkHotUpdate();
                            }
                        },
                        {
                            text: '下载更新', onPress: () => {
                                this.downloadAndInstall(response);
                            }
                        },
                    ],
                    {cancelable: false}
                )
            }
            else if (response.versionCode > GB_CURRENT_APPBUILD && response.forceVersion > GB_CURRENT_APPBUILD) {
                //本地版本号小于线上版本号 且
                //本地版本号小于线上强制更新版本号
                //需要弹框 不能跳过

                Alert.alert(
                    '发现新版本啦',
                    response.memo,
                    [
                        {
                            text: '下载更新', onPress: () => {
                                this.downloadAndInstall(response);
                            }
                        },
                    ],
                    {cancelable: false}
                )
            }

        }, (err, statusCode) => {
            console.log("检测包更新失败:" + err);
            this.loadingView.dismissAnimation();
            //处理605 607错误码
            if (statusCode == 605) {
                //ip受限
                this.props.navigation.navigate('NoAccessPage');
            }
            else if (statusCode == 607) {
                //网站维护
                this.props.navigation.navigate('MaintemancePage');
            }
        });
    }

    //热更新检测
    checkHotUpdate = () => {
        console.log("开始热更细检测1")
        if (__DEV__) {
            // debug模式
            //不做更新检测
        } else {
            // release模式
            console.log("开始热更细检测2")
            codePush.sync({
                // updateDialog: true, // 是否打开更新提示弹窗
                updateDialog: {
                    //是否显示更新描述
                    appendReleaseDescription: true,
                    //更新描述的前缀。 默认为"Description"
                    descriptionPrefix: "",
                    //强制更新按钮文字，默认为continue
                    mandatoryContinueButtonLabel: "立即更新",
                    //强制更新时的信息. 默认为"An update is available that must be installed."
                    mandatoryUpdateMessage: "",
                    //非强制更新时，按钮文字,默认为"ignore"
                    optionalIgnoreButtonLabel: '取消',
                    //非强制更新时，确认按钮文字. 默认为"Install"
                    optionalInstallButtonLabel: '安装更新',
                    //非强制更新时，检查到更新的消息文本
                    optionalUpdateMessage: '',
                    //Alert窗口的标题
                    title: '检测到有更新了'
                },
                installMode: codePush.InstallMode.IMMEDIATE,
                mandatoryInstallMode: codePush.InstallMode.IMMEDIATE,
            }, (status) => {
                switch (status) {
                    case codePush.SyncStatus.CHECKING_FOR_UPDATE:
                        console.log("CHECKING_FOR_UPDATE");
                        break;
                    case codePush.SyncStatus.DOWNLOADING_PACKAGE:
                        console.log("DOWNLOADING_PACKAGE");
                        this.hotUpdatePage.show();
                        break;
                    case codePush.SyncStatus.INSTALLING_UPDATE:
                        console.log("INSTALLING_UPDATE");
                        this.hotUpdatePage.dismiss();
                        break;
                    case codePush.SyncStatus.UP_TO_DATE:
                        console.log("UP_TO_DATE");
                        break;
                }
            }, (progress) => {
                let currProgress = parseFloat(progress.receivedBytes / progress.totalBytes).toFixed(2)
                this.setState({
                    progress: currProgress // 为了显示进度百分比
                });
            });
        }
    }

    componentDidMount() {
        this.loadingView.showAnimation();

        GBNetWorkService.post("mobile-api/origin/getTimeZone.html", null, null, this._getTimeZoneSuccess, this._getTimeZoneFail)
        GBNetWorkService.get("mobile-api/chess/mainIndex.html", null, null, this._homeDataSucessBack, this._homeDataFailBack)

        this.isMounted = true
        //接受点击cell的通知，还要加个传过来的参数判断是哪个页面cell点击的
        this.reciveData = DeviceEventEmitter.addListener('itemClick', (itemData, pageType) => {
            if (UserInfo.isLogin === false) {
                this.loginConfirm.showPopView()
            } else {
                if (pageType === 'firstPage' && itemData) {
                    if (itemData.type === "game") {
                        this.enterGame(itemData);
                    } else {
                        this.setState({
                            onPage: 'secondPage',
                            secondPageOffset: 0,
                            secondGameListArray: itemData.relation,
                        });
                    }
                } else if (pageType === 'secondPage' && itemData) {
                    if (itemData.type === "game") {
                        this.enterGame(itemData);
                    } else {
                        this.setState({
                            onPage: 'thirdPage',
                            thirdGameListArray: itemData.relation,
                            thirdGameAllData: itemData.relation,//第三个游戏所有的数据，主要用来搜索的时候过度
                            thirdGameListApi: itemData.apiId,
                        });
                    }

                } else if (pageType === 'thirdPage' && itemData) {
                    this.enterGame(itemData);
                }
            }

        })
        //获取跑马灯
        GBNetWorkService.post("mobile-api/origin/getAnnouncement.html", null, null, this._getAnnouncementSuccess, this._getAnnouncementFail)


        //监听登录成功的通知
        this.loginSubscription = DeviceEventEmitter.addListener('rn_login_success', () => {
            console.log("首页监听到登陆成功");
            //每五分钟调用一次保活接口
            this.timer = setInterval(() => {
                GBNetWorkService.post("mobile-api/mineOrigin/alwaysRequest.html", null, null, (response, header) => {
                    console.log("保活调用成功。。。" + JSON.stringify(response));
                }, (err) => {
                    console.log("保活调用失败。。。" + err);
                });
            }, 5 * 60 * 1000);
        });

        this.logoutSubscription = DeviceEventEmitter.addListener('rn_login_out', () => {
            clearInterval(this.timer);
        });

        AppState.addEventListener('change', this.onAppStateChanged);

        //存款成功，点击返回首页
        this.reciveData = DeviceEventEmitter.addListener('depositeSucess', (showRechageView) => {
            this.rechargePopView.closePopView();
        })

        if (UserInfo.isLogin) {
            this.listener = DeviceEventEmitter.addListener('RefreshUserBalance', (e) => {
                let url = 'mobile-api/userInfoOrigin/getUserInfo.html';
                GBNetWorkService.get(url, null, null, this.successGetUserInfo, this.failGetUserInfo)
            });
        }
    }

    _getTimeZoneSuccess = (json) => {
        console.log("获取的时区==" + JSON.stringify(json))
        if (parseInt(json.code) === 0) {
            TimeZoneManager.getInstance().timeZone = json.data;
        }

    }
    _getTimeZoneFail = (json) => {

    }

    successGetUserInfo = (json) => {
        if(json.data && json.data.user){
            DeviceEventEmitter.emit('rn_login_success', json.data.user.username, json.data.user.walletBalance);
        }
    }

    failGetUserInfo = (json) => {
        console.log('失败' + JSON.stringify(json))
        // UserInfo.isLogin = false ;
    }

    onAppStateChanged = () => {
        switch (AppState.currentState) {
            case "active":
                this.snowAnimation&&this.snowAnimation.play();
                MusicManager.getInstance().playBGM();
                break;
            case "background":
                MusicManager.getInstance().pauseBGM();
                break;
            default:
        }
    }

    _homeDataSucessBack = (json) => {
        this.loadingView.dismissAnimation();
        // this.JiuJiJinPopView.showPopView()
        // this.ShouCunSongPopView.showPopView()
        // this.ZhuCeSongPopView.showPopView()
        this.siteUrl=json.data&&json.data.siteUrl;
        this.activityId=json.data&&json.data.activity&&json.data.activity.activityId; // 抢红包活动id
        this.setState({
            isLoading: false,
            bannerArray: json.data.banner,
            gameListArray: json.data.siteApiRelation,
        })
        console.log('主页数据:',json.data)

        this.checkVersionUpdate();
    }
    _homeDataFailBack = (json) => {
        this.loadingView.dismissAnimation();
        console.log("失败" + JSON.stringify(json))
        this.checkVersionUpdate();
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
        this.isMounted = false
        //移除通知
        this.reciveData.remove();
        this.listener.remove();
        this.loginSubscription.remove();
        this.logoutSubscription.remove();
        clearInterval(this.timer)
        AppState.removeEventListener('change', this.onAppStateChanged);
    }

    setRechargeCenterModalVisible = () => {
        if (UserInfo.isLogin === false) {
            this.loginConfirm.showPopView()
        } else {
            this.rechargePopView.showPopView();
        }

    }

    /*改变分享弹窗是否显示的BOOL值*/
    setShareModalVisible = () => {
        if (UserInfo.isLogin === false) {
            this.loginConfirm.showPopView()
        } else {
            this.SharePage.showPopView();
        }

    };


    /*改变收益弹窗是否显示的BOOL值*/
    setIncomeModalVisible = () => {
        if (UserInfo.isLogin === false) {
            this.loginConfirm.showPopView()
        } else {
            this.IncomePage.showPopView();
        }
    };
    /*跳转全民推广*/
    setTuiGuangeVisible = () => {
        //跳推广
        if (UserInfo.isLogin === false) {
            this.loginConfirm.showPopView()
        } else {
            this.props.navigation.navigate('AllPeoplePromotionPage');
        }
    }


    /*登录弹窗*/
    setLoginVisible = (visible) => {
        console.log("设置登录页面显示的参数===" + visible)
        this.loginConfirm.showPopView()
        if (visible) {
            UserInfo.loginViewShowTimes = 0;
        }
    }
    visitorClick = () => {
        if (UserInfo.isLogin === false) {
            this.setLoginVisible(true)
        } else {
            //人个中心弹窗
            this.personalMsg.showPopView()
        }
    }

    // 点击优惠活动
    promotions = () => {
        if (UserInfo.isLogin === false) {
            this.loginConfirm.showPopView()
        } else {
            this.setState({
                selectStatus: true,
            }, this.Promotions.showPopView)
        }
    };
    // 点击消息中心
    MessagesCenter = () => {
        if (UserInfo.isLogin === false) {
            this.loginConfirm.showPopView()
        } else {
            this.setState({
                selectStatus: false,
            }, this.Promotions.showPopView)
        }
    };
    // 点击首页活动入口
    onPressPromt = (val) => {
        this.setState({
            selectStatus: val,
        }, this.Promotions.showPopView)
    };

    // 点击玩家中心 by Chester
    personalCenterPress = () => {
        if (UserInfo.isLogin === false) {
            this.loginConfirm.showPopView()

        } else {
            this.setState({
                PersonalCenterModal: true,
            })
        }
    };
    setPersonalCenter = (visible) => {
        this.setState({PersonalCenterModal: visible});
    };
    //点击 +
    handleRecharge = () => {
        if (UserInfo.isLogin === false) {
            this.loginConfirm.showPopView()
        } else {
            this.rechargePopView.showPopView();
        }
    }

    render() {
        return (
            <FastImage
                source={require("../../static/images/2.1.0/bg.webp")}
                style={styles.bgImageStyle}>
                <View style={{position: 'absolute', top: 0, left: 0, right: 0, alignItems: 'center'}}>
                    <FastImage style={{flex: 1}} source={require("../../static/images/2.1.0/topbg.webp")}/>
                </View>

                <View style={{position: 'absolute', bottom: 0, left: 0, right: 0, alignItems: 'center'}}>
                    <FastImage style={{flex: 1}} source={require("../../static/images/2.1.0/footerbg.webp")}/>
                </View>

                <LottieView
                    style={{position: 'absolute', top: 0, right: 0, left: 0, bottom: 0}}
                    source={require('../../static/animation/shouyebeijing/shouyebeijing.json')}
                    ref={snowAnimation => {this.snowAnimation = snowAnimation}}
                    imageAssetsFolder={'lottie/shouyebeijing/images'}
                    autoPlay
                    loop
                />

                {/*顶部视图*/}
                <View style={styles.topContainer}>
                    <HomeTopView promotions={this.promotions}
                                 MessagesCenter={this.MessagesCenter}
                                 handleRecharge={this.handleRecharge}
                                 personalCenterPress={this.personalCenterPress}
                                 visitorClick={this.visitorClick}
                                 setLoginVisible={this.setLoginVisible}
                    />
                </View>
                {/*中间视图  游戏列表和轮播图*/}
                <View style={styles.centerContainer}>
                    <View style={styles.MarqueeLabelContainer}>
                        {/*轮播公告*/}
                        {this.state.announceString.length === 0 ?
                            <View style={styles.MarqueeLabelLogoImageStyle}></View> :
                            <FastImage source={require("../../static/images/2.1.0/notice_bg.webp")}
                                             style={styles.MarqueeLabelImageStyle}
                            >
                                <View style={{
                                    overflow: 'hidden',
                                    width: 310 * UIMacro.HEIGHT_PERCENT,
                                    left: 10 * UIMacro.WIDTH_PERCENT,
                                    top: 2 * UIMacro.HEIGHT_PERCENT,
                                }}>

                                    <MarqueeLabel
                                    speed={50}
                                    textStyle={{fontSize: 12, color: 'white'}}
                                >
                                    {this.state.announceString}
                                </MarqueeLabel>

                                </View>
                            </FastImage>}
                        {/*logo+搜索+返回键*/}
                        <View style={styles.MarqueeLabelImageSearchStyle}>
                            {this._gameLogoView()}
                            <View style={styles.searchAndBack}>
                                {this._searchAndBackBtn()}
                            </View>
                        </View>
                    </View>

                    <View style={styles.centerGameView}>
                        {this._centerView()}
                    </View>
                </View>
                {/*底部视图*/}
                <HomeBottomView pageType={this.state.onPage}
                                onPressPromt={this.onPressPromt}
                                setRechargeCenterModalVisible={this.setRechargeCenterModalVisible}
                                setShareModalVisible={this.setShareModalVisible}
                                setIncomeModalVisible={this.setIncomeModalVisible}
                                setTuiGuangVisible={this.setTuiGuangeVisible}
                                openLoginConfirm={() => {
                                    this.loginConfirm.showPopView()
                                }}
                                openRedPag={this.redPagButtonClick}
                                registerImageSwitchFun={(imgSource)=>this.registerImageSwitchFun(imgSource)}
                                rescueImageSwitchFun={(imgSource,activityId)=>this.rescueImageSwitchFun(imgSource,activityId)}
                                rechargeImageSwitchFun={(imgSource,activityId)=>this.rechargeImageSwitchFun(imgSource,activityId)}
                                recommendImageSwitchFun={(money)=>this.recommendImageSwitchFun(money)}
                                ref='HomeBottomView'
                />

                {/*玩家中心*/}
                <PersonalCenterView setModalVisible={this.setPersonalCenter}
                                    modalVisible={this.state.PersonalCenterModal}
                                    pushToWebView={() => this.props.navigation.navigate('GameWebView', UserInfo.customerUrl)}

                />

                {/*分享弹窗*/}
                <SharePage ref={(c) => this.SharePage = c}/>
                <IncomePage ref={(c) => this.IncomePage = c}/>

                {/*个人中心*/}
                <PersonalMsgPage ref={(c) => this.personalMsg = c}
                                 openPersonalView={()=>this.promptViews.showPopView()}
                                 openSetting={()=>this.settingView.showPopView()}
                />

                {/*退出*/}
                <PromptViewPage ref={(c)=>this.promptViews = c}
                                setClosePersonal={()=>this.personalMsg.closePopView()}
                                showLoading1={()=>{this.loadingView.showAnimation()}}
                                showLoading2={()=>{this.loadingView.dismissAnimation()}}
                />

                {/*设置*/}
                <SettingViewPage ref={(c)=>this.settingView = c} />

                <PromotionsView ref={(c) => this.Promotions = c} selectStatus={this.state.selectStatus}/>

                <RechargeCenterView ref={(c) => this.rechargePopView = c}/>

                {/*登录弹窗*/}
                <LoginConfirmPage ref={(c) => this.loginConfirm = c}
                                  showLoading={()=>{this.loadingView.showAnimation()}}
                                  hideLoading={()=>{this.loadingView.dismissAnimation()}}
                                  setCloseLogin={()=>this.loginConfirm.closePopView()}
                />

                <RedPagManagerPage ref={(c) => this.redPagManagerPage = c}
                                   activityId={this.activityId}

                />

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

                {/*点击注册送展示活动图片*/}
                <RegisterImageSwitchView ref={(c) => this.registerImageSwitch = c}
                                         openRegisterConfirm={() => {
                                         this.loginConfirm.handleRegister();
                                         this.loginConfirm.showPopView()
                                     }}
                />

                {/*点击救济金展示活动图片*/}
                <RescueImageSwitchView ref={(c) => this.rescueImageSwitch = c}
                                       onPressPromt={(activityId)=>this.onPressPromt(activityId)}
                />

                {/*点击首存送展示活动图片*/}
                <RechargeImageSwitchView ref={(c) => this.rechargeImageSwitch = c}
                                         onPressPromt={(activityId)=>this.onPressPromt(activityId)}
                />

                {/*弹出推荐奖励信息图片*/}
                <RecommendImageSwitchView ref={(c) => this.recommendImageSwitch = c}
                                          setTuiGuangeVisible={()=>this.setTuiGuangeVisible()}
                />

                {/*活动全屏广告*/}
                {/*<JiuJiJinPopView ref={(c) => this.JiuJiJinPopView = c}/>*/}
                {/*<ShouCunSongPopView ref={(c) => this.ShouCunSongPopView = c}/>*/}
                <ZhuCeSongPopView ref={(c) => this.ZhuCeSongPopView = c}/>

                <HotUpdatePage progress={this.state.progress} ref={(c) => this.hotUpdatePage = c}/>
                <UpdatePage ref={(c) => this.updatePage = c}/>

                {/*loading视图*/}
                <LoadingView ref={(c) => this.loadingView = c}/>
            </FastImage>
        );
    }

    //底部红包按钮点击
    redPagButtonClick = () => {
        // this.redPagManagerPage.showPopView();
        //获取红包次数
        this.loadRedPagMsg();
    }
    //获取红包次数
    loadRedPagMsg=()=>{
        let param = {'activityMessageId': this.activityId};
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
        }else
        {
            //获取活动异常让bottomView弹出错误提示
            if (json.message !== '请求成功'){
                this.refs.HomeBottomView.showRedPagMessage(json.message);
            }
        }
        console.log(json.data);
    }
    //获取红包次数失败
    _failGetTimeData = (json) => {
        console.log('抢红包点击',json);
    }

    //拆红包
    openRedPag = () => {
        // this.redPagNotWon.showPopView();
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
                //红包抢到，发送通知刷新用户钱包余额
                DeviceEventEmitter.emit('rn_RedPag_RefreshWalletBalance', json.data.award);
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

    registerImageSwitchFun=(imgSource)=>{
        this.registerImageSwitch.showPopView(imgSource);
    }

    rescueImageSwitchFun=(imgSource,activityId)=>{
        this.rescueImageSwitch.showPopView(imgSource,activityId);
    }

    rechargeImageSwitchFun=(imgSource,activityId)=>{
        this.rechargeImageSwitch.showPopView(imgSource,activityId);
    }

    recommendImageSwitchFun=(money)=>{
        this.recommendImageSwitch.showPopView(money);
    }



    _gameLogoView = () => {
        let array = []
        if (this.state.onPage === 'thirdPage') {
            let image = require('../../static/images/2.1.0/logo15.webp')
            switch (this.state.thirdGameListApi) {
                case 28: {
                    //GG捕鱼
                    image = require('../../static/images/2.1.0/logo12.webp')
                }
                    break;
                case 35: {
                    //MW电子
                    image = require('../../static/images/2.1.0/logo11.webp')
                }
                    break;
                case 15: {
                    //HB电子
                    image = require('../../static/images/2.1.0/logo07.webp')
                }
                    break;
                case 26: {
                    //PNG电子
                    image = require('../../static/images/2.1.0/logo06.webp')
                }
                    break;
                case 20: {
                    //BSG电子
                    image = require('../../static/images/2.1.0/logo03.webp')
                }
                    break;
                case 27: {
                    //DT电子
                    image = require('../../static/images/2.1.0/logo10.webp')
                }
                    break;
                case 6: {
                    //PT电子
                    image = require('../../static/images/2.1.0/logo04.webp')
                }
                    break;
                case 25: {
                    //新霸电子
                    image = require('../../static/images/2.1.0/logo05.webp')
                }
                    break;
                case 3: {
                    //MG电子
                    image = require('../../static/images/2.1.0/logo01.webp')
                }
                    break;
                case 9: {
                    //AG电子
                    image = require('../../static/images/2.1.0/logo08.webp')
                }
                    break;
                case 10: {
                    //BB电子
                    image = require('../../static/images/2.1.0/logo09.webp')
                }
                    break;
                case 44: {
                    //NT电子
                    image = require('../../static/images/2.1.0/logo13.webp')
                }
                    break;
                case 38: {
                    //新PP电子
                    image = require('../../static/images/2.1.0/logo02.webp')
                }
                    break;
                case 45: {
                    //PG老虎机
                    image = require('../../static/images/2.1.0/logo14.webp')
                }
                    break;
                case 14: {
                    //NYX电子
                    image = require('../../static/images/2.1.0/logo15.webp')//已下架
                }
                    break;
                case 32: {
                    //PP电子
                    image = require('../../static/images/2.1.0/logo02.webp')
                }
                    break;
                default:
                    break;
            }
            array.push(<FastImage style={{
                width: 100 * UIMacro.SCREEN_FULL_PERCENT,
                height: 25 * UIMacro.HEIGHT_PERCENT,
                marginLeft: 35 * UIMacro.WIDTH_PERCENT,
                marginTop: 2 * UIMacro.HEIGHT_PERCENT,
            }} source={image} key={'logoImage'}/>)
        }else{
            array.push(<View key='empty'></View>)
        }
        return array;
    }

    //游戏列表第三层搜索按钮
    _searchAndBackBtn = () => {
        let array = []
        if (this.state.onPage === 'thirdPage') {
            array.push(
                <ImageBackground source={require("../../static/images/2.1.0/btn_search.webp")}
                                        style={styles.searchContainer} key={'searchbtn'}
                                        resizeMode='contain' >
                    <TextInput placeholder='搜寻游戏...'
                           placeholderTextColor={SkinsColor.placeholderTextColor ? SkinsColor.placeholderTextColor : '#fff'}
                           value={this.state.gameSearchString}
                           onChangeText={this._handleChangeSearchGameString}
                           style={{ fontSize: 10,
                               color: 'white',
                               paddingLeft: 20*UIMacro.WIDTH_PERCENT,
                               width: 70 * UIMacro.SCREEN_FULL_PERCENT,
                               padding: 0, }}
                           ref={(c) => this.searchGameInput = c}
                           onEndEditing={() => {
                               this.loadBlur(this.searchGameInput)
                           }}   />
                    <TouchableBounce onPress={this._searchBtnClick} style={{marginRight: 20 * UIMacro.WIDTH_PERCENT}}>
                    <FastImage source={require("../../static/images/2.1.0/icon_search.webp")}
                           resizeMode='contain'
                           style={{width: 8 * UIMacro.WIDTH_PERCENT, height: 8 * UIMacro.WIDTH_PERCENT}}/>
                    </TouchableBounce>
                </ImageBackground>)
        }
        if (this.state.onPage != 'firstPage') {
            array.push(<TouchableBounce
                style={{
                    paddingRight: 2* UIMacro.WIDTH_PERCENT,
                }}
                onPress={this._bottomViewbtnClick}
                key={'backBtn'}
            >
                <FastImage source={require("../../static/images/2.1.0/btn_return.webp")}
                       style={{
                           width: 45 * UIMacro.WIDTH_PERCENT,
                           height: 24 * UIMacro.WIDTH_PERCENT,
                           marginTop: 3 * UIMacro.HEIGHT_PERCENT
                       }}
                />
            </TouchableBounce>)
        }
        return array;
    }
    //失去焦点
    loadBlur = (input) => {
        input.blur()
    }
    _handleChangeSearchGameString = (string) => {
        this.setState({gameSearchString: string});
    }
    // 游戏搜索
    _searchBtnClick = () => {

        if (this.state.gameSearchString.length === 0) {
            this.setState({
                thirdGameListArray: this.state.thirdGameAllData,
                thirdGameListScrollToZero: false,
            })
        } else {
            let arr = [];
            for (let i = 0; i < this.state.thirdGameAllData.length; i++) {
                let item = this.state.thirdGameAllData[i];
                if (item.name.search(this.state.gameSearchString) === -1) {

                } else {
                    arr.push(item)
                }

            }
            this.setState({
                thirdGameListArray: arr,
                thirdGameListScrollToZero: true,
            },this.searchInit)
        }

    }

    // 搜索初始化
    searchInit = () =>{
        this.refs.ThirdScrollView && this.refs.ThirdScrollView.scrollToZero()
    };
    _centerView = () => {
        const {onPage} = this.state;
        let array = []
        if (!this.state.isLoading) {
            if (onPage === 'firstPage') {
                array.push(<BannerView bannerItemClick={this._bannerClick} bannerSource={this.state.bannerArray}
                                       key={'banner'}/>)
                array.push(<GameFirstScrollView pageType={onPage} datas={this.state.gameListArray}
                                                firstCallBack={this._getFirstPageOffset}
                                                offset={this.state.firstPageOffset} key={'gameFirst'}/>)
            } else if (onPage === 'secondPage') {
                array.push(<GameSecondScrollView pageType={onPage} datas={this.state.secondGameListArray}
                                                 secondCallBack={this._getSecondPageOffset}
                                                 offset={this.state.secondPageOffset} key={'gameSecond'}/>)
            } else if (onPage === 'thirdPage') {
                array.push(<GameThirdScrollView pageType={onPage}
                                                datas={this.state.thirdGameListArray}
                                                key={'gameThird'}
                                                scrollToZero={this.state.thirdGameListScrollToZero }
                                                ref='ThirdScrollView'
                />)
            }
        }

        return array;

    }

    _bannerClick = (link) => {
        if (UserInfo.isLogin === false) {
            this.loginConfirm.showPopView()
        } else if (link.length > 0) {
            this.props.navigation.navigate('GameWebView', {url: link});
            // alert('banner点击了'+link)
        }
    }

    _bottomViewbtnClick = (typeStr) => {
        if (this.state.onPage === 'secondPage') {
            this.setState({onPage: 'firstPage'});
        } else if (this.state.onPage === 'thirdPage') {
            this.setState({
                onPage: 'secondPage',
                gameSearchString: '',
            });
        }
    }
    _getFirstPageOffset = (x) => {
        this.setState({firstPageOffset: x})

    }
    _getSecondPageOffset = (x) => {
        this.setState({secondPageOffset: x})
    }
}

const styles = StyleSheet.create({
    bgImageStyle: {
        flex: 1,
    },
    MarqueeLabelContainer: {
        flexDirection: 'row',
        height: 30 * UIMacro.HEIGHT_PERCENT,
        justifyContent: 'center',
        alignItems: 'center'
    },
    MarqueeLabelImageStyle: {
        width: 326 * UIMacro.HEIGHT_PERCENT,
        height: 326 * (59 / 652) * UIMacro.HEIGHT_PERCENT,
    },
    MarqueeLabelLogoImageStyle: {
        width: 326 * UIMacro.SCREEN_FULL_PERCENT,
        height: 30 * UIMacro.HEIGHT_PERCENT,
        marginLeft: 60 * UIMacro.WIDTH_PERCENT,
    },
    MarqueeLabelImageSearchStyle: {
        height: 30 * UIMacro.HEIGHT_PERCENT,
        flexDirection: 'row',
        position: 'absolute',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: 667 * UIMacro.SCREEN_FULL_PERCENT,
        // paddingRight: 30 * UIMacro.HEIGHT_PERCENT,
    },
    searchAndBack: {
        height: 30 * UIMacro.HEIGHT_PERCENT,
        flexDirection: 'row',
        alignItems: 'center',
        marginTop:2 * UIMacro.HEIGHT_PERCENT,
        paddingRight: 10 * UIMacro.HEIGHT_PERCENT,
    },
    searchContainer: {
        width: 97 * UIMacro.SCREEN_FULL_PERCENT,
        height: 24.5 * UIMacro.HEIGHT_PERCENT,
        marginTop:5 * UIMacro.HEIGHT_PERCENT,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginRight: 3* UIMacro.HEIGHT_PERCENT,
    },
    centerContainer: {
        height: 287 * UIMacro.HEIGHT_PERCENT,
    },
    centerGameView: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    topContainer: {
        height: 50 * UIMacro.HEIGHT_PERCENT
    },
});
