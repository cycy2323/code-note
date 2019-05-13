/**
 * @author
 *  Chester
 * @remark 安全中心 二级菜单 福利记录
 */

import React, {Component} from 'react';
import {
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ImageBackground,
    Image, FlatList,
    TextInput,
} from 'react-native';
import ModalDropdown from "react-native-modal-dropdown";
import GBNetWorkService from "../../core/GBNetWorkService";
import Toast from '../../common/ToastView' ;
import TimeZoneManager from "../../core/TimeZoneManager";
import BigPopPage from "../../common/BigPopPage";
import UIMacro from "../../core/UIMacro";
import LoadingView from "../Loading/LoadingView";
import TouchableBounce from "../../common/TouchableBounce";
import SkinsColor from "../../core/SkinsColor";
import UserInfo from "../../core/UserInfo";
import FastImage from 'react-native-fast-image';


type
    Props = {};
const BORDER_WIDTH = 2;

export default class WelfareRecordView extends BigPopPage<Props> {
    constructor(pros) {
        super(pros);
        this.state = {
            ...this.state,
            timeMsg: '近七天',
            typeMsg: '全部',
            timeData: ['今天', '昨天', '本周', '近七天'],
            typeData: [],
            timeDisabled: false,
            typeDisabled: false,
            tableList: [],
            favorable: '0.00',
            recharge: '0.00',
            success: false
        }
    }

    //页面打开回调
    pageDidShow = () => {
        this.getTransactionType();
        this.getFundRecord();
        this._isMounted = true;

    }

    pageDidClose = () => {
        this._isMounted = false;
        this.setState({
            timeMsg: '近七天',
            typeMsg: '全部',
            timeData: ['今天', '昨天', '本周', '近七天'],
            typeData: [],
            timeDisabled: false,
            typeDisabled: false,
            tableList: [],
            favorable: '0.00',
            recharge: '0.00',
            success: false
        });
    }

    pageDidCloseImmediate = () => {
        if (this.props && this.props.changeSelectIndex) {
            this.props.changeSelectIndex();
        }
    }

    titleImage = () => {
        return require('../../static/images/2.1.0/title09.webp')
    }


    renderPage = () => {
        return (
            [<Toast
            ref="toast"
            style={{backgroundColor: 'white',}}
            fadeInDuration={300}
            fadeOutDuration={1000}
            opacity={1}
            textStyle={{color: 'black'}}
            key={'toast'}
        />,
            //loading视图
            <LoadingView ref={(c) => this.loadingView = c} key={'loadingView'}/>]
        )
    }

    GetDateStr = (AddDayCount) => {
        let dd = new Date();
        dd.setDate(dd.getDate() + AddDayCount);//获取AddDayCount天后的日期
        let y = dd.getFullYear();
        let m = (dd.getMonth() + 1) < 10 ? "0" + (dd.getMonth() + 1) : (dd.getMonth() + 1);//获取当前月份的日期，不足10补0
        let d = dd.getDate() < 10 ? "0" + dd.getDate() : dd.getDate();//获取当前几号，不足10补0
        return y + "-" + m + "-" + d;
    };


    /*获取福利记录*/
    getFundRecord = () => {
        this.loadingView.showAnimation();

        let nowDayOfWeek = new Date().getDay(); //今天本周的第几天
        let endDate = this.GetDateStr(0) + ' 23:59:59';
        let startDate;
        let type;
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
        if (this.state.typeMsg === '全部') {
            type = '';
        } else if (this.state.typeMsg === '转账') {
            type = 'transfers';
        } else if (this.state.typeMsg === '存款') {
            type = 'deposit';
        } else if (this.state.typeMsg === '返水') {
            type = 'backwater';
        } else if (this.state.typeMsg === '取款') {
            type = 'withdrawals';
        } else if (this.state.typeMsg === '推荐') {
            type = 'recommend';
        } else if (this.state.typeMsg === '优惠') {
            type = 'favorable';
        }
        let param = {
            'search.beginCreateTime': startDate,
            'search.endCreateTime': endDate,
            'search.transactionType': type,
            'paging.pageNumber': "1",
            'paging.pageSize': "5000"
        };
        console.log(param)
        GBNetWorkService.post("mobile-api/mineOrigin/getFundRecord.html", param, null, this._getFundRecordSuccessBack, this._getFundRecordFailBack)
    };
    _getFundRecordSuccessBack = (json) => {
        //关闭loading
        this.loadingView.dismissAnimation();

        console.log("fulijilu==" + JSON.stringify(json))
        if (json.code === '0') {
            this.setState({
                tableList: json.data.fundListApps,
                favorable: json.data.sumPlayerMap.favorable,
                recharge: json.data.sumPlayerMap.recharge,
            })
        }
        json.data &&
        this.setState({
            success: json.success
        })
    };
    _getFundRecordFailBack = (json) => {
        //关闭loading
        this.loadingView.dismissAnimation();

        console.log("获取福利记录失败：" + JSON.stringify(json))
    };

    /*获取查询类型*/
    getTransactionType = () => {
        GBNetWorkService.get("mobile-api/mineOrigin/getTransactionType.html", null, null, this._getTransactionTypeSuccessBack, this._getTransactionTypeFailBack)
    };
    _getTransactionTypeSuccessBack = (json) => {
        console.log("成功：" + JSON.stringify(json));
        let paramsArray = [];
        paramsArray.push('全部');
        let data = json.data;
        if (json.success) {
            Object.keys(data).forEach(key => paramsArray.push(data[key]));
            console.log("成功：" + paramsArray);
            this.setState({
                typeData: paramsArray
            })
        } else {
            this.refs.toast.show(json.message ? json.message : '查询类型失败');
        }
    };
    _getTransactionTypeFailBack = (json) => {
        console.log("失败：" + JSON.stringify(json))
    };

    showItem = ({item, index}) => {
        return (
            <View
                style={[styles.tableItem, index % 2 === 0 ? styles.tableItemBackgoundColor1 : styles.tableItemBackgoundColor2]}>
                <Text numberOfLines={0} style={{
                    width: 453 / 4.0 * UIMacro.WIDTH_PERCENT,
                    fontSize: 10, color: SkinsColor.tableContentTextColor,
                    textAlign: 'center',
                }}>
                    {TimeZoneManager.getInstance().stringFromTimestamp(item.createTime)}
                </Text>
                <Text style={{
                    width: 453 / 4.0 * UIMacro.WIDTH_PERCENT,
                    fontSize: 10,
                    color: SkinsColor.tableContentTextColor,
                    textAlign: 'center',
                }}>
                    {item.transactionMoney}
                </Text>

                <Text style={{
                    width: 453 / 4.0 * UIMacro.WIDTH_PERCENT,
                    fontSize: 10,
                    color: SkinsColor.tableContentTextColor,
                    textAlign: 'center'
                }}>
                    {item.statusName}
                </Text>
                <Text style={{
                    width: 453 / 4.0 * UIMacro.WIDTH_PERCENT,
                    fontSize: 10,
                    color: SkinsColor.tableContentTextColor,
                    textAlign: 'center'
                }}>
                    {item.transaction_typeName}
                </Text>
            </View>

        )
    };

    showData = () => {
        if (this.state.success && this.state.tableList.length !== 0) {
            return <FlatList
                data={this.state.tableList}
                renderItem={this.showItem}
                keyExtractor={(item, index) => item.id.toString()}
                extraData={this.state}/>
        } else if (this.state.success) {
            return (
                <FastImage style={styles.imageMM} source={require('../../static/images/2.1.0/nodata.webp')}>
                    <Text style={{fontSize: 14, color: '#FFF'}}>当前暂无福利记录</Text>
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
                    <TextInput placeholder={this.state.timeMsg} placeholderTextColor='white' editable={false}
                               style={styles.wcSearchBarTextInput}/>
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

                    <Text style={styles.wcSearchBarTextSecond}>类型</Text>
                    <TextInput placeholder={this.state.typeMsg} placeholderTextColor='white' editable={false}
                               style={styles.wcSearchBarTextInput}/>
                    <View style={styles.wcSearchBarDropDownModal}>
                        <ModalDropdown dropdownStyle={styles.wcSearchBarDropDownStyleLong}
                                       textStyle={styles.wcSearchBarDropDownText} options={this.state.typeData}
                                       onSelect={(index, value) => this.setState({typeMsg: value})}
                                       dropdownTextStyle={styles.wcSearchBarDropDownTextStyle}
                                       disabled={this.state.typeDisabled}
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

                    <TouchableBounce onPress={this.getFundRecord} style={styles.searchBtn}>
                        <FastImage
                            style={styles.welfareSearchBtnImage}
                            resizeMode='stretch'
                            source={require('../../static/images/2.1.0/btn_blue.webp')}>
                            <Text style={styles.welfareSearchBtnText}>搜索</Text>
                        </FastImage>
                    </TouchableBounce>
                </View>
                {/*table标题栏*/}
                <View style={styles.titleViewStyle}>
                    <Text style={styles.tableTitleTextStyle}>时间</Text>
                    <Text style={styles.tableTitleTextStyle}>金额</Text>
                    <Text style={styles.tableTitleTextStyle}>状态</Text>
                    <Text style={styles.tableTitleTextStyle}>类型</Text>
                </View>
                <View style={styles.wcTableContent}>
                    {this.showData()}
                </View>
                <View style={styles.wcBottom}>
                    {
                        this.state.success && this.state.tableList.length !== 0
                        &&
                        <Text style={styles.wcBottomText}>充值合计：{UserInfo.isDot(this.state.recharge)}</Text>
                    }
                    {
                        this.state.success && this.state.tableList.length !== 0
                        &&
                        <Text style={styles.wcBottomText}>优惠合计：{UserInfo.isDot(this.state.favorable)}</Text>
                    }
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
        color: SkinsColor.tableTitleTextColor,
        fontWeight: 'bold',
        width: 453 / 4.0 * UIMacro.WIDTH_PERCENT,
        fontSize: 12,
        textAlign: 'center',
    },

    wcTableContent: {
        flexDirection: 'row',
        width: 453 * UIMacro.WIDTH_PERCENT,
        height: 175 * UIMacro.HEIGHT_PERCENT,
        backgroundColor: SkinsColor.WelfareRecordList_bg,
        marginLeft: 6 * UIMacro.WIDTH_PERCENT,
        justifyContent: 'center'
    },
    tableItem: {
        flexDirection: 'row',
        width: 453 * UIMacro.WIDTH_PERCENT,
        height: 25 * UIMacro.WIDTH_PERCENT,
        alignItems: 'center',
    },
    tableItemBackgoundColor1: {
        backgroundColor: SkinsColor.table_bg1
    },
    tableItemBackgoundColor2: {
        backgroundColor: SkinsColor.table_bg2,
    },


    tableViewText2: {
        color: SkinsColor.tableTitleTextColor,
        textAlign: 'center',
        justifyContent: 'center',
        fontSize: 11,
        marginTop: -3
    },


    imageMM: {
        width: 151.5 * UIMacro.WIDTH_PERCENT,
        height: 151.5 * UIMacro.HEIGHT_PERCENT,
        marginBottom: 15 * UIMacro.HEIGHT_PERCENT,
        justifyContent:'flex-end',
        alignItems:'center'
    },
    wcBottom: {
        width: 453 * UIMacro.WIDTH_PERCENT,
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
        height: 41 * UIMacro.HEIGHT_PERCENT,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        backgroundColor: SkinsColor.ListBottom_bg,
        marginLeft: 6 * UIMacro.WIDTH_PERCENT,
    },
    wcBottomText: {
        color: SkinsColor.tableTitleTextColor,
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
        height: 175 * UIMacro.HEIGHT_PERCENT,
        borderWidth: 0,
        marginTop: 8 * UIMacro.HEIGHT_PERCENT
    },
    wcSearchBarDropDownText: {
        fontSize: 14,
        color: '#a5d2f2',
    },
    wcSearchBarDropDownTextStyle: {
        color: '#FFFFFF',
        backgroundColor: SkinsColor.WelfareRecordDropDownNormalText,
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
        backgroundColor: SkinsColor.textInput_bg,
        height: 25 * UIMacro.HEIGHT_PERCENT,
        borderRadius: 5,
        color: '#FFFFFF',
        fontSize: 15,
        width: 105 * UIMacro.WIDTH_PERCENT,
        padding: 0,
        paddingLeft: 7 * UIMacro.WIDTH_PERCENT,
        marginLeft: 8 * UIMacro.WIDTH_PERCENT,
        borderWidth: 1,
        borderColor: SkinsColor.textInput_border,
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
        marginLeft: 25 * UIMacro.WIDTH_PERCENT
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
});