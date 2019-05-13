/**
 * @author
 *  Chester
 * @remark 个人中心 二级菜单 牌局记录
 */

import React, {Component} from 'react';
import {
    Dimensions,
    StyleSheet,
    Text,
    View,
    ImageBackground,
    Image,
    TextInput, Alert, FlatList
} from 'react-native';
import ModalDropdown from "react-native-modal-dropdown";
import GBNetWorkService from "../../core/GBNetWorkService";
import LoadingView from "../Loading/LoadingView";
import TimeZoneManager from "../../core/TimeZoneManager";
import BigPopPage from "../../common/BigPopPage";
import UIMacro from '../../core/UIMacro';
import Toast from "../../common/ToastView";
import * as Animatable from 'react-native-animatable';
import TouchableBounce from "../../common/TouchableBounce";
import SkinsColor from "../../core/SkinsColor";
import UserInfo from "../../core/UserInfo";
import FastImage from 'react-native-fast-image';

type Props = {};
const BORDER_WIDTH = 2;

/*牌局记录*/
export default class GamblingRecordView extends BigPopPage<Props> {

    constructor(pros) {
        super(pros);
        this.state = {
            ...this.state,
            timeMsg: '近七天',
            typeMsg: '全部类型',
            timeData: ['今天', '昨天', '本周', '近七天'],
            typeData: [],
            timeDisabled: false,
            typeDisabled: false,
            tableList: [],
            success: false,
            getTypeSuccess: false,
            isShowStatistics: true,
            status: '',
            single: '0.00',
            profit: '0.00',
        }
    };

    pageDidShow = () => {
        this.getBettingRecord();
    }
    pageDidClose = () => {
        this.setState({
            timeMsg: '近七天',
            typeMsg: '全部类型',
            timeData: ['今天', '昨天', '本周', '近七天'],
            typeData: [],
            timeDisabled: false,
            typeDisabled: false,
            tableList: [],
            success: false,
            getTypeSuccess: false,
            isShowStatistics: true,
            status: '',
            single: '0.00',
            profit: '0.00',
        })
    }

    pageDidCloseImmediate = () => {
        if (this.props && this.props.changeSelectIndex) {
            this.props.changeSelectIndex();
        }
    }
    titleImage = () => {
        return require('../../static/images/2.1.0/title10.webp')
    }

    renderPage = () => {
        return [<Toast
            ref="toast"
            style={{backgroundColor: 'white',}}
            fadeInDuration={300}
            fadeOutDuration={1000}
            opacity={1}
            textStyle={{color: 'black'}}
            key={'toast'}
        />,
        //loading视图
        <LoadingView ref={(c) => this.loadingView = c}
                     key={'loadingView'}
        />]
    }


    GetDateStr = (AddDayCount) => {
        let dd = new Date();
        dd.setDate(dd.getDate() + AddDayCount);//获取AddDayCount天后的日期
        let y = dd.getFullYear();
        let m = (dd.getMonth() + 1) < 10 ? "0" + (dd.getMonth() + 1) : (dd.getMonth() + 1);//获取当前月份的日期，不足10补0
        let d = dd.getDate() < 10 ? "0" + dd.getDate() : dd.getDate();//获取当前几号，不足10补0
        return y + "-" + m + "-" + d;
    };


    /*获取棋牌记录*/
    getBettingRecord = () => {
        this.refs.animationButton.pulse();
        this.loadingView.showAnimation();

        let nowDayOfWeek = new Date().getDay(); //今天本周的第几天
        let endDate = this.GetDateStr(0) + ' 23:59:59';
        let startDate;
        //判断时间
        if (this.state.timeMsg === '近七天') {
            startDate = this.GetDateStr(-6);
        } else if (this.state.timeMsg === '今天') {
            startDate = this.GetDateStr(0);
        } else if (this.state.timeMsg === '昨天') {
            startDate = this.GetDateStr(-1);
            endDate = startDate + ' 23:59:59';
        } else if (this.state.timeMsg === '本周') {
            startDate = this.GetDateStr(1 - nowDayOfWeek);
        }
        startDate = startDate + ' 00:00:01';
        let param = {
            'search.beginBetTime': startDate,
            'search.endBetTime': endDate,
            'isShowStatistics': this.state.isShowStatistics,
            'paging.pageNumber': "1",
            'paging.pageSize': "5000",
        };
        console.log(param)
        GBNetWorkService.post("mobile-api/mineOrigin/getBettingList.html", param, null, this._getBettingSuccessBack, this._getBettingFailBack)
    };
    _getBettingSuccessBack = (json) => {
        //关闭loading
        this.loadingView.dismissAnimation();

        console.log("成功:" + JSON.stringify(json));
        if (json.success && json.data.list && json.data) {
            for (let i = 0; i < json.data.list.length; i++) {
                if (json.data.list[i].orderState === 'pending_settle') {
                    json.data.list[i].orderState = '未结算'
                } else if (json.data.list[i].orderState === 'settle') {
                    json.data.list[i].orderState = '已结算'
                } else {
                    json.data.list[i].orderState = '取消订单'
                }
            }
            this.setState({
                tableList: json.data.list,
                success: json.success,
            });
            if (json.data.statisticsData) {
                this.setState({
                    single: json.data.statisticsData.single,
                    profit: json.data.statisticsData.profit
                });
            }

        }
    };
    _getBettingFailBack = (json) => {
        //关闭loading
        this.loadingView.dismissAnimation();

        console.log("失败:" + JSON.stringify(json));
    };


    showItem = ({item, index}) => {
        return (
            <View
                style={[styles.tableItem, index % 2 === 0 ? styles.tableItemBackgoundColor1 : styles.tableItemBackgoundColor2]}>

                <Text style={{
                    // width: 453 / 5.0 * UIMacro.WIDTH_PERCENT,
                    fontSize: 10,
                    color: SkinsColor.IDText,
                    textAlign: 'center',
                    flex:1,
                    justifyContent:'center',
                    alignItems:'center',
                }}>
                    {item.gameName}
                </Text>
                <Text style={{
                    fontSize: 10, color: SkinsColor.IDText,
                    textAlign: 'center',
                    // width: 400 / 5.0 * UIMacro.WIDTH_PERCENT,
                    flex:1,
                    justifyContent:'center',
                    alignItems:'center',
                }}>
                    {TimeZoneManager.getInstance().stringFromTimestamp(item.betTime)}
                </Text>
                <Text style={{
                    fontSize: 10,
                    color: SkinsColor.IDText,
                    textAlign: 'center',
                    // width: 453 / 5.0 * UIMacro.WIDTH_PERCENT,
                    flex:1,
                    justifyContent:'center',
                    alignItems:'center',
                }}>
                    {UserInfo.isDot(item.singleAmount)}
                </Text>

                <Text style={{
                    // width: 453 / 5.0 * UIMacro.WIDTH_PERCENT,
                    fontSize: 10,
                    color: SkinsColor.IDText,
                    textAlign: 'center',
                    flex:1,
                    justifyContent:'center',
                    alignItems:'center',
                }}>
                    {UserInfo.isDot(item.profitAmount)}
                </Text>
                <Text style={{
                    // width: 453 / 5.0 * UIMacro.WIDTH_PERCENT,
                    fontSize: 10,
                    color: SkinsColor.IDText,
                    textAlign: 'center',
                    flex:1,
                    justifyContent:'center',
                    alignItems:'center',
                }}>
                    {item.orderState}
                </Text>
            </View>
        )
    };

    showData = () => {
        if (this.state.success && this.state.tableList.length !== 0) {
            return <FlatList
                data={this.state.tableList}
                renderItem={this.showItem}
                keyExtractor={(item, index) => item.id}
                extraData={this.state}/>
        } else if (this.state.success) {
            return (
                <FastImage style={styles.imageMM} source={require('../../static/images/2.1.0/nodata.webp')}>
                    <Text style={{fontSize: 14, color: '#FFF'}}>当前暂无牌局记录</Text>
                </FastImage>
            )
        }
    };
    contentView = () => {
        return (
            <View style={styles.wcContainer}>
                {/*搜索栏*/}
                <View style={styles.wcSearchBar}>
                    <Text style={styles.wcSearchBarTextFirst}>时间</Text>
                    <TextInput placeholder={this.state.timeMsg} placeholderTextColor='#AAAAA8' editable={false}
                               style={styles.wcSearchBarTextInput} onChangeText={this.handleChangeText}/>
                    <View style={styles.wcSearchBarDropDownModal}>
                        <ModalDropdown dropdownStyle={styles.wcSearchBarDropDownStyle}
                                       textStyle={styles.wcSearchBarDropDownText} options={this.state.timeData}
                                       onSelect={(index, value) => this.setState({timeMsg: value})}
                                       dropdownTextStyle={styles.wcSearchBarDropDownTextStyle}
                                       disabled={this.state.timeDisabled}
                                       dropdownTextHighlightStyle={styles.wcSearchBarDropDownTextHighlightStyle}
                                       scrollEnabled={false}
                        >
                            <View style={styles.wcSearchBarDropImageView}>
                                <FastImage source={require('../../static/images/2.1.0/drop_down.webp')}
                                       resizeMode='stretch'
                                       style={styles.wcSearchBarDropImage}/>
                            </View>
                        </ModalDropdown>
                    </View>
                    <TouchableBounce onPress={this.getBettingRecord} style={styles.searchBtn} activeOpacity={0.5}>
                        <Animatable.View ref="animationButton" duration={800}>
                            <FastImage
                                style={styles.welfareSearchBtnImage}
                                resizeMode='stretch'
                                source={require('../../static/images/2.1.0/btn_blue.webp')}>
                                <Text style={styles.welfareSearchBtnText}>搜索</Text>
                            </FastImage>
                        </Animatable.View>
                    </TouchableBounce>
                </View>
                {/*table标题栏*/}
                <View style={styles.titleViewStyle}>
                    <Text style={styles.tableTitleTextOne}>游戏名称</Text>
                    <Text style={styles.tableTitleTextTwo}>牌局时间</Text>
                    <Text style={styles.tableTitleTextThree}>福利投注</Text>
                    <Text style={styles.tableTitleTextFour}>赛果</Text>
                    <Text style={styles.tableTitleTextFive}>状态</Text>
                </View>
                <View style={styles.wcTableContent}>
                    {/*判断有数据显示列表，无数所显示图片*/}
                    {this.showData()}
                </View>
                <View style={styles.gbBottom}>
                    <View style={styles.wcBottom}>
                        {
                            this.state.success && this.state.tableList.length !== 0
                            &&
                            <View style={{flexDirection: 'row'}}>
                                <Text style={styles.gbBottomText}>福利投注合计：</Text>
                                <Text style={styles.gbBottomTextDown}>{UserInfo.isDot(this.state.single)}</Text>
                            </View>
                        }
                        {
                            this.state.success && this.state.tableList.length !== 0
                            &&
                            <View style={{flexDirection: 'row'}}>
                                <Text style={styles.gbBottomText}>赛果合计：</Text>
                                <Text style={styles.gbBottomTextDown}>{UserInfo.isDot(this.state.profit)}</Text>
                            </View>
                        }
                    </View>
                </View>
            </View>
        );
    }


}

const styles = StyleSheet.create({
    wcContainer: {
        width: 465 * UIMacro.WIDTH_PERCENT,
        height: 291 * UIMacro.HEIGHT_PERCENT,
        borderRadius: 5,
        backgroundColor: 'rgba(0,0,0,0.2)',
        marginTop: 10 * UIMacro.HEIGHT_PERCENT,
    },
    wcSearchBar: {
        height: 43 * UIMacro.HEIGHT_PERCENT,
        flexDirection: 'row',
        alignItems: 'center',
    },
    tableTitleTextStyle: {
        color: '#fff',
        fontWeight: 'bold',
        width: 113.25 * UIMacro.WIDTH_PERCENT,
        fontSize: 12,
        textAlign: 'center'
    },

    wcTableContent: {
        flexDirection: 'row',
        width: 453 * UIMacro.WIDTH_PERCENT,
        height: 175 * UIMacro.HEIGHT_PERCENT,
        justifyContent: 'center',
        backgroundColor: SkinsColor.WelfareRecordList_bg,
        marginLeft: 6 * UIMacro.WIDTH_PERCENT
    },
    tableItem: {
        flexDirection: 'row',
        width: 453 * UIMacro.WIDTH_PERCENT,
        height: 25 * UIMacro.WIDTH_PERCENT,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tableItemBackgoundColor1: {
        backgroundColor: SkinsColor.table_bg1
    },
    tableItemBackgoundColor2: {
        backgroundColor: SkinsColor.table_bg2,
    },


    tableViewText2: {
        color: '#fff',
        textAlign: 'center',
        justifyContent: 'center',
        fontSize: 11,
        marginTop: -3
    },


    imageMM: {
        width: 151.5 * UIMacro.WIDTH_PERCENT,
        height: 151.5 * UIMacro.HEIGHT_PERCENT,
        marginBottom: 15 * UIMacro.HEIGHT_PERCENT,
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    wcBottom: {
        width: 453 * UIMacro.WIDTH_PERCENT,
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
        height: 41 * UIMacro.HEIGHT_PERCENT,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        backgroundColor: SkinsColor.WelfareRecordList_bg,
        marginLeft: 6 * UIMacro.WIDTH_PERCENT,
    },
    wcBottomText: {
        color: '#CCDBFF',
        fontSize: 12,
        marginLeft: 13,
    },
    wcSearchBarDropDownModal: {
        height: 40,
        alignItems: 'center',
        marginLeft: -105 * UIMacro.WIDTH_PERCENT,
        marginTop: 15 * UIMacro.HEIGHT_PERCENT
    },
    wcSearchBarDropDownStyle: {
        width: 104 * UIMacro.WIDTH_PERCENT,
        flex: 1,
        height: 100 * UIMacro.HEIGHT_PERCENT,
        borderWidth: 0,
        marginTop: 8 * UIMacro.HEIGHT_PERCENT
    },
    wcSearchBarDropDownStyleLong: {
        width: 104 * UIMacro.WIDTH_PERCENT,
        flex: 1,
        height: 147 * UIMacro.HEIGHT_PERCENT,
        borderWidth: 0,
        marginTop: 8 * UIMacro.HEIGHT_PERCENT
    },
    wcSearchBarDropDownText: {
        fontSize: 14,
        color: '#a5d2f2',
    },
    wcSearchBarDropDownTextStyle: {
        color: '#FFFFFF',
        backgroundColor: SkinsColor.bgTextViewStyle_bg,
        fontSize: 15,
        height: 25 * UIMacro.HEIGHT_PERCENT,
        width: 104 * UIMacro.WIDTH_PERCENT,
        paddingTop: 0,
        paddingBottom: 0,
        lineHeight: 25 * UIMacro.HEIGHT_PERCENT,
    },
    wcSearchBarDropDownTextHighlightStyle: {
        color: '#FFFFFF',
        backgroundColor: SkinsColor.WelfareRecordDropDownHighLight_bg,
        fontSize: 15,
        height: 25 * UIMacro.HEIGHT_PERCENT,
        width: 104 * UIMacro.WIDTH_PERCENT,
        paddingTop: 0,
        paddingBottom: 0,
    },
    wcSearchBarDropImage: {
        width: 14, height: 8,
    },
    wcSearchBarTextFirst: {
        color: '#fff',
        fontSize: 15,
        marginLeft: 17 * UIMacro.WIDTH_PERCENT
    },
    wcSearchBarTextSecond: {
        color: '#fff',
        fontSize: 15,
        marginLeft: 25 * UIMacro.WIDTH_PERCENT
    },
    wcSearchBarTextInput: {
        backgroundColor: SkinsColor.bgTextViewStyle_bg,
        height: 25 * UIMacro.HEIGHT_PERCENT,
        borderRadius: 5,
        color: '#FFFFFF',
        fontSize: 15,
        width: 105 * UIMacro.WIDTH_PERCENT,
        padding: 0,
        paddingLeft: 7 * UIMacro.WIDTH_PERCENT,
        marginLeft: 8 * UIMacro.WIDTH_PERCENT,
        borderWidth: 1,
        borderColor: SkinsColor.bgTextViewStyle_border
    },
    wcSearchBarDropImageView: {
        width: 14,
        height: 8,
        justifyContent: 'center',
        marginLeft: 78 * UIMacro.WIDTH_PERCENT,
        marginTop: 9 * UIMacro.HEIGHT_PERCENT
    },
    welfareSearchBtnImage: {
        width: 81 * UIMacro.WIDTH_PERCENT,
        height: 33 * UIMacro.HEIGHT_PERCENT,
    },
    welfareSearchBtnText: {
        color: '#fff',
        fontSize: 15,
        fontWeight: 'bold',
        textAlign: 'center',
        height: 33 * UIMacro.HEIGHT_PERCENT,
        lineHeight: 33 * UIMacro.HEIGHT_PERCENT
    },
    searchBtn: {
        width: 81 * UIMacro.WIDTH_PERCENT,
        height: 33 * UIMacro.HEIGHT_PERCENT,
        position: 'absolute',
        right: 34 * UIMacro.WIDTH_PERCENT
    },
    messageView: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    btnClick: {
        width: 121 * UIMacro.WIDTH_PERCENT,
        height: 45 * UIMacro.HEIGHT_PERCENT,
        marginTop: 8 * UIMacro.HEIGHT_PERCENT,
    },
    logText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        height: 45 * UIMacro.HEIGHT_PERCENT,
        lineHeight: 45 * UIMacro.HEIGHT_PERCENT
    },
    btn: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    titleViewStyle: {
        width: 453 * UIMacro.WIDTH_PERCENT,
        height: 25 * UIMacro.WIDTH_PERCENT,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        backgroundColor: SkinsColor.WelfareRecordListHead_bg,
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 6 * UIMacro.WIDTH_PERCENT,
    },
    arrowViewStyle: {
        width: 453 * UIMacro.WIDTH_PERCENT,
        height: 20 * UIMacro.WIDTH_PERCENT,
        marginLeft: 5 * UIMacro.WIDTH_PERCENT,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: SkinsColor.table_bg1
    },
    gbBottomText: {
        color: SkinsColor.IDText,
        fontSize: 12,
        textAlign: 'right',
        width: 100
    },
    gbBottomTextDown: {
        color: SkinsColor.IDText,
        fontSize: 12,
    },
    tableTitleTextOne: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 12,
        textAlign: 'center',
        width: 453 / 5.0 * UIMacro.WIDTH_PERCENT,
    },
    tableTitleTextTwo: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 12,
        textAlign: 'center',
        width: 453 / 5.0 * UIMacro.WIDTH_PERCENT,
    },
    tableTitleTextThree: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 12,
        textAlign: 'center',
        width: 453 / 5.0 * UIMacro.WIDTH_PERCENT,
    },
    tableTitleTextFour: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 12,
        textAlign: 'center',
        width: 453 / 5.0 * UIMacro.WIDTH_PERCENT,
    },
    tableTitleTextFive: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 12,
        textAlign: 'center',
        width: 453 / 5.0 * UIMacro.WIDTH_PERCENT,
    },
});