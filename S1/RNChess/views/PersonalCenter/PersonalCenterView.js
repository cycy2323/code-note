/**
 * @author
 *  Chester
 * @remark 个人中心 主菜单 右侧弹出
 */

import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ImageBackground,
    Image,
    Linking,
    Alert
} from 'react-native';
import WelfareRecordView from "./WelfareRecordView";
import GamblingRecordView from "./GamblingRecordView";
import UserInfo from "../../core/UserInfo";
import GBNetWorkService from "../../core/GBNetWorkService";
import UIMacro from "../../core/UIMacro";
import MusicManager from "../MusicManager/MusicManager";
import SecurityCenterView from './SecurityCenterView'
import TouchableBounce from "../../common/TouchableBounce";
import GBServiceParam from "../../core/GBServiceParam";
import SkinsColor from "../../core/SkinsColor";
import FastImage from 'react-native-fast-image';

type
    Props = {};


export default class PersonalCenterView extends Component<Props> {
    constructor(pros) {
        super(pros);
        this.state = {
            selectIndex: -1,
        }
    };

    /*跳转到外部浏览器*/
    customerService = () => {
        MusicManager.getInstance().playShowAlert();

        console.log('isInlay' + UserInfo.isInlay, 'customerUrl:' + UserInfo.customerUrl)
        if (UserInfo.customerUrl && UserInfo.customerUrl.length > 0) {
            if (UserInfo.isInlay) {
                this.props.pushToWebView;
            } else {
                Linking.openURL(UserInfo.customerUrl)
            }
        } else {
            GBNetWorkService.get("mobile-api/origin/getCustomerService.html", null, null, this._customerServiceSuccessBack, this._customerServiceFailBack)
        }
    };

    _customerServiceSuccessBack = (json) => {
        console.log("成功:" + JSON.stringify(json));
        if (UserInfo.isInlay) {

        } else {
            Linking.openURL(json.data.customerUrl)
        }
    };
    _customerServiceFailBack = (json) => {
        console.log("失败:" + JSON.stringify(json))
    };


    render() {
        return (
            this.props.modalVisible
            &&
            <View style={styles.containerView} accessible={false}>
                {/*增加黑色背景透明层*/}
                <TouchableOpacity style={styles.backgroundBtnStyle}
                                  onPress={() => {
                                      this.props.setModalVisible(!this.props.modalVisible);
                                      this.setState({selectIndex: -1})
                                  }}
                >
                    {/*个人中心列表*/}
                    <FastImage
                        style={styles.personalMenuBgImage}
                        resizeMode='stretch'
                        source={require('../../static/images/2.1.0/bg_menu.webp')}
                    >
                        <View style={styles.PersonalCenterModalView}>
                            {/*个人信息*/}
                            <Text style={styles.personalMessageFirstText}> {"ID : " + UserInfo.username}</Text>
                            <View>
                                <Text style={styles.personalMessageSecondText}> 欢迎光临！</Text>
                            </View>
                            <View style={{
                                flexDirection: 'row',
                                backgroundColor: SkinsColor.personalMessageText_bg,
                                marginTop: 6 * UIMacro.WIDTH_PERCENT
                            }}>
                                <Text style={styles.personalMessageThreeTextFFF}> 随身福利：</Text>
                                <Text style={styles.personalMessageThreeText}>{UserInfo.isDot(UserInfo.walletBalance)}</Text>
                            </View>
                        </View>
                        <View style={{marginRight: 14 * UIMacro.WIDTH_PERCENT, marginTop: 10 * UIMacro.WIDTH_PERCENT}}>
                            {this._fourBtnView()}
                        </View>
                        <FastImage source={require('../../static/images/2.1.0/arrow_btn.webp')}
                               style={styles.arrowBtnStyle}/>
                    </FastImage>
                </TouchableOpacity>
                <GamblingRecordView ref={(c) => this.gamblingRecordView = c}
                                    changeSelectIndex={this.changeSelectIndex}/>
                <WelfareRecordView ref={(c) => this.welfareRecordView = c} changeSelectIndex={this.changeSelectIndex}/>
                <SecurityCenterView ref={(c) => this.securityCenterView = c}
                                    selectedIndex={0}
                                    isChange={false}
                                    changeSelectIndex={this.changeSelectIndex}
                />
            </View>
        );
    }

    changeSelectIndex = () => {
        this.setState({
            selectIndex: -1
        })
    };

    _fourBtnView = () => {
        let titles = ["福利记录", "游戏记录", "安全中心", "帮助中心"]
        let viewArray = [];
        for (let i = 0; i < titles.length; i++) {
            if (i === this.state.selectIndex) {
                viewArray.push(<FastImage source={require("../../static/images/2.1.0/btn_menu_click.webp")}
                                                style={styles.btnBackImageStyle} key={i}>
                    <TouchableBounce onPress={() => {
                        this._btnClick(i)
                    }} style={styles.btnStyle}>
                        <Text style={styles.btnTextStyle}>{titles[i]}</Text>
                    </TouchableBounce>
                </FastImage>)

            } else {
                viewArray.push(<FastImage source={require("../../static/images/2.1.0/btn_menu.webp")}
                                                style={styles.btnBackImageStyle} key={i}>
                    <TouchableBounce onPress={() => {
                        this._btnClick(i)
                    }} style={styles.btnStyle}>
                        <Text style={styles.btnTextStyle}>{titles[i]}</Text>
                    </TouchableBounce>
                </FastImage>)

            }
        }
        return viewArray;
    }

    _getMineInfoSuccessBack = (json) =>{
        let url = "http://"+json.data.siteUrl+"/help/firstType.html"
        Linking.openURL(url);
    }
    _getMineInfoFailBack = (json) =>{
        console.log('getMineInfo 失败',json);
        Alert.alert("获取主页域名失败")
    }

    _btnClick = (index) => {
        MusicManager.getInstance().playShowAlert();
        if (index === 0) {
            this.welfareRecordView.showPopView()
        } else if (index === 1) {
            this.gamblingRecordView.showPopView()
        } else if (index === 2) {
            this.securityCenterView.showPopView()
        } else if (index === 3) {
            GBNetWorkService.get("mobile-api/allPersonRecommend/getMineInfo.html", null, null, this._getMineInfoSuccessBack, this._getMineInfoFailBack)
        }
        this.setState({
            selectIndex: index
        })
    }
}

const styles = StyleSheet.create({
    containerView: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.2)'
    },
    backgroundBtnStyle: {
        width: '100%',
        height: '100%',
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    PersonalCenterModalView: {
        height: 85 * UIMacro.HEIGHT_PERCENT,
        width: 157 * UIMacro.WIDTH_PERCENT,
        flexDirection: 'column',
        alignItems: 'center',
    },
    personalMenuBgImage: {
        width: 178 * UIMacro.WIDTH_PERCENT,
        height: UIMacro.SCREEN_HEIGHT,
        flexDirection: 'column',
        alignItems: 'flex-end',
    },
    personalMessageFirstText: {
        marginTop: 15 * UIMacro.HEIGHT_PERCENT,
        color: SkinsColor.personalMessageText,
        fontSize: 12
    },
    personalMessageSecondText: {
        color: '#fff',
        fontSize: 12,
        marginTop: 17 * UIMacro.WIDTH_PERCENT,
    },
    personalMessageThreeText: {
        color: SkinsColor.personalMessageText,
        fontSize: 12
    },
    personalMessageThreeTextFFF: {
        color: '#fff',
        fontSize: 12
    },
    btnBackImageStyle: {
        width: 123 * UIMacro.WIDTH_PERCENT,
        height: 48 * UIMacro.WIDTH_PERCENT,
        marginTop: 5 * UIMacro.WIDTH_PERCENT,

    },
    btnStyle: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    btnTextStyle: {
        fontSize: 15,
        color: 'white',
    },
    arrowBtnStyle: {
        width: 20 * UIMacro.WIDTH_PERCENT,
        height: 29 * UIMacro.WIDTH_PERCENT,
        position: 'absolute',
        left: 14 * UIMacro.WIDTH_PERCENT,
        top: 176 * UIMacro.WIDTH_PERCENT,
    }
});