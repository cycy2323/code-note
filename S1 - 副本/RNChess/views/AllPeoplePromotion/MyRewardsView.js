import {Component} from "react";
import {
    StyleSheet,
    View,
    Text,FlatList
} from 'react-native';
import React from "react";
import UIMacro from '../../core/UIMacro'
import ModalDropdown from "react-native-modal-dropdown";
import TimeZoneManager from "../../core/TimeZoneManager";
import GBNetWorkService from "../../core/GBNetWorkService";
import SkinsColor from "../../core/SkinsColor";
import UserInfo from "../../core/UserInfo";
import TouchableBounce from "../../common/TouchableBounce";
import FastImage from 'react-native-fast-image'

type Props = {};
export default class MyRewardsView extends Component<Props> {
    constructor(pros) {
        super(pros);
        this.state = {
            timeMsg: '近七天',
            typeMsg: '推荐红利',
            timeData: ['今天', '昨天', '本周', '近七天'],
            typeData: ['推荐红利', '推荐奖励'],
            timeDisabled: false,
            typeDisabled: false,
            tableList: [],
            favorable: '0.00',
            recharge: '0.00',
            isShowFirstView: true, //是否现在红利，还是显示奖励
        }
    };

    componentDidMount() {
        this.getRecord();
    }

    componentWillUnmount() {
        this.setState({
            timeMsg: '近七天',
            typeMsg: '推荐红利',
            timeData: ['今天', '昨天', '本周', '近七天'],
            typeData: ['推荐红利', '推荐奖励'],
            timeDisabled: false,
            typeDisabled: false,
            tableList: [],
            isShowFirstView: true, //是否现在红利，还是显示奖励
        })
    }

    GetDateStr = (AddDayCount) => {
        let dd = new Date();
        dd.setDate(dd.getDate() + AddDayCount);//获取AddDayCount天后的日期
        let y = dd.getFullYear();
        let m = (dd.getMonth() + 1) < 10 ? "0" + (dd.getMonth() + 1) : (dd.getMonth() + 1);//获取当前月份的日期，不足10补0
        let d = dd.getDate() < 10 ? "0" + dd.getDate() : dd.getDate();//获取当前几号，不足10补0
        return y + "-" + m + "-" + d;
    };

    /*获取我的奖励记录*/
    getRecord = () => {
        let nowDayOfWeek = new Date().getDay(); //今天本周的第几天
        let endDate = this.GetDateStr(0)+' 23:59:59';
        // let endDate = this.GetDateStr(0);
        let startDate;
        let type;
        //判断时间
        if (this.state.timeMsg === '近七天') {
            startDate = this.GetDateStr(-7);
        } else if (this.state.timeMsg === '今天') {
            startDate = this.GetDateStr(0);
        } else if (this.state.timeMsg === '昨天') {
            startDate = this.GetDateStr(-1);
        } else if (this.state.timeMsg === '本周') {
            startDate = this.GetDateStr(1 - nowDayOfWeek);
        }
        startDate = startDate+' 00:00:01';
        if (this.state.typeMsg === '推荐红利') {
            type = "0";
            this.setState({
                isShowFirstView: true,
                tableList: [],
            })
        } else if (this.state.typeMsg === '推荐奖励') {
            type = "1";
            this.setState({
                isShowFirstView: false,
                tableList: [],
            })
        }
        let param = {
            'startTime': startDate,
            'endTime': endDate,
            'paging.pageNumber': "1",
            'paging.pageSize': "5000",
            'type': type
        };
        GBNetWorkService.post('mobile-api/allPersonRecommend/recommendRecords.html', param, null, this._getRecordSuccessBack,
            this._getRecordFailBack)
    };
    _getRecordSuccessBack = (json) => {
        console.log("我的奖励success==" + JSON.stringify(json))
        if (parseInt(json.code) === 0) {
            this.setState({
                tableList: json.data.records,
            })
        }
    };
    _getRecordFailBack = (json) => {
        console.log("获取我的奖励fail:" + JSON.stringify(json))
    };

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.wcContainer}>
                    {/*顶部*/}
                    <View style={styles.topTitleView}>
                        <Text style={styles.topViewTimeTextStyle}>时间</Text>
                        <ModalDropdown dropdownStyle={styles.dropdownStyle}
                                       options={this.state.timeData}
                                       onSelect={(index, value) => this.setState({timeMsg: value})}
                                       dropdownTextStyle={styles.dropdownTextStyle}
                                       dropdownTextHighlightStyle={styles.dropdownTextHighlightStyle}
                                       disabled={this.state.timeDisabled}
                                       scrollEnabled={false}
                                       showsVerticalScrollIndicator={false}>
                            <View style={styles.selectViewStyle}>
                                <Text style={styles.selectTextStyle}>
                                    {this.state.timeMsg}</Text>
                                <FastImage source={require('../../static/images/2.1.0/arrow_down.webp')}
                                       resizeMode='stretch'
                                       style={styles.timeRightDownImageStyle}/>
                            </View>
                        </ModalDropdown>

                        <Text style={styles.topViewRewardsTextStyle}>奖励类型</Text>
                        <ModalDropdown dropdownStyle={styles.dropdownStyle1}
                                       options={this.state.typeData}
                                       onSelect={(index, value) => this.setState({typeMsg: value})}
                                       dropdownTextStyle={styles.dropdownTextStyle}
                                       dropdownTextHighlightStyle={styles.dropdownTextHighlightStyle}
                                       disabled={this.state.typeDisabled}
                                       scrollEnabled={false}
                                       showsVerticalScrollIndicator={false}>
                            <View style={styles.selectViewStyle}>
                                <Text style={styles.selectTextStyle}>
                                    {this.state.typeMsg}</Text>
                                <FastImage source={require('../../static/images/2.1.0/arrow_down.webp')}
                                       resizeMode='stretch'
                                       style={styles.typeRightDownImageStyle}/>
                            </View>
                        </ModalDropdown>
                        <TouchableBounce onPress={this.getRecord} style={styles.searchBtn}>
                            <FastImage
                                style={styles.searchBtnImage}
                                resizeMode='stretch'
                                source={require('../../static/images/2.1.0/btn_blue.webp')}>
                                <Text style={styles.searchBtnText}>搜索</Text>
                            </FastImage>
                        </TouchableBounce>
                    </View>
                    {/*渲染头部视图*/}
                    {this.renderTopView()}

                    <View style={styles.wcTableContent}>
                        {/*判断有数据显示列表，无数所显示图片*/}
                        {
                            this.state.tableList.length !== 0
                            &&
                            <FlatList
                                data={this.state.tableList}
                                renderItem={this.state.isShowFirstView ? this.showItem : this.showItem1}
                                keyExtractor={(item, index) => index.toString()}
                                extraData={this.state}/>
                        }
                        {
                            this.state.tableList.length === 0
                            &&
                            <View style={{justifyContent:'center',alignItems:'center'}}>
                                <FastImage style={styles.imageMM} source={require('../../static/images/2.1.0/nodata_promotion.webp')}/>
                                <Text style={{color:'white', bottom: 30 * UIMacro.HEIGHT_PERCENT}}>暂无数据</Text>
                            </View>

                        }
                    </View>
                </View>
            </View>
        )
    }

    //渲染头部视图
    renderTopView = () => {
        {/*table标题栏*/}
        return (
            this.state.isShowFirstView ?
                <View style={styles.titleViewStyle}>
                    <Text
                        style={[styles.tableTitleTextStyle, {width: 510 / 3.0 * UIMacro.SCREEN_FULL_PERCENT}]}>红利结算日期</Text>
                    <Text
                        style={[styles.tableTitleTextStyle, {width: 510 / 3.0 * UIMacro.SCREEN_FULL_PERCENT}]}>红利金额</Text>
                    <Text
                        style={[styles.tableTitleTextStyle, {width: 510 / 3.0 * UIMacro.SCREEN_FULL_PERCENT}]}>下属红利总金额</Text>
                </View> :
                <View style={styles.titleViewStyle}>
                    <Text
                        style={[styles.tableTitleTextStyle, {width: 510 / 4.0 * UIMacro.SCREEN_FULL_PERCENT}]}>新增玩家账号(直属下级)</Text>
                    <Text
                        style={[styles.tableTitleTextStyle, {width: 510 / 4.0 * UIMacro.SCREEN_FULL_PERCENT}]}>注册时间</Text>
                    <Text
                        style={[styles.tableTitleTextStyle, {width: 510 / 4.0 * UIMacro.SCREEN_FULL_PERCENT}]}>状态</Text>
                    <Text
                        style={[styles.tableTitleTextStyle, {width: 510 / 4.0 * UIMacro.SCREEN_FULL_PERCENT}]}>奖励金额</Text>
                </View>
        )
    }
    // 红利 3列  红利结算日期  红利金额  下属红利总金额
    showItem = ({item, index}) => {
        return (
            <View
                style={[styles.tableItem, index % 2 === 0 ? styles.tableItemBackgroundColor1 : styles.tableItemBackgroundColor2]}>
                <Text numberOfLines={0} style={{
                    width: 507 / 3.0 * UIMacro.SCREEN_FULL_PERCENT,
                    fontSize: 10, color: SkinsColor.IDText,
                    textAlign: 'center',
                }}>
                    {item.date}
                </Text>
                <Text style={{
                    width: 507 / 3.0 * UIMacro.SCREEN_FULL_PERCENT,
                    fontSize: 10,
                    color: SkinsColor.IDText,
                    textAlign: 'center',
                    marginRight: 5 * UIMacro.WIDTH_PERCENT
                }}>
                    {UserInfo.isDot(item.money)}
                </Text>

                <Text style={{
                    width: 510 / 3.0 * UIMacro.SCREEN_FULL_PERCENT,
                    fontSize: 10,
                    color: SkinsColor.IDText,
                    textAlign: 'center'
                }}>
                    {UserInfo.isDot(item.teamMoney)}
                </Text>
            </View>

        )
    };
    //奖励4列  新增玩家账号(直属下级)  注册时间   状态   奖励金额
    showItem1 = ({item, index}) => {
        return (
            <View
                style={[styles.tableItem, index % 2 === 0 ? styles.tableItemBackgroundColor1 : styles.tableItemBackgroundColor2]}>
                <Text numberOfLines={0} style={{
                    width: 507 / 4.0 * UIMacro.SCREEN_FULL_PERCENT,
                    fontSize: 10, color: SkinsColor.IDText,
                    textAlign: 'center',
                    justifyContent:'center'
                }}>
                    {item.recommendUserName.substr(0,1)+'******'+item.recommendUserName.substr(item.recommendUserName.length-1,1)+'(直属下级)'}
                </Text>
                <Text style={{
                    width: 510 / 4.0 * UIMacro.SCREEN_FULL_PERCENT,
                    fontSize: 10,
                    color: SkinsColor.IDText,
                    textAlign: 'center',
                    justifyContent:'center'
                }}>
                    {TimeZoneManager.getInstance().stringFromTimestampXieGang(item.createTime)}
                </Text>

                <Text style={{
                    width: 510 / 4.0 * UIMacro.SCREEN_FULL_PERCENT,
                    fontSize: 10,
                    color: (Number(item.status)===(2 || 3 || 4 || 5))?'#FFEA00':SkinsColor.IDText,
                    textAlign: 'center',
                    justifyContent:'center'
                }}>
                    {this.getChineseFromStatus(item.status)}
                </Text>
                <Text style={{
                    width: 510 / 4.0 * UIMacro.SCREEN_FULL_PERCENT,
                    fontSize: 10,
                    color: SkinsColor.IDText,
                    textAlign: 'center',
                    justifyContent:'center'
                }}>
                    {UserInfo.isDot(item.rewardAmount)}
                </Text>
            </View>
        )
    }

    //通过状态code获取对应的中文
    getChineseFromStatus=(status)=>{
        let str = '';
        status = Number(status) ;
        if (status===1) {str = '正常';}
        else if (status===2) {str = '停用';}
        else if (status===3) {str = '账户冻结';}
        else if (status===4) {str = '余额冻结';}
        else if (status===5) {str = '账号过期';}
        return str ;
    }
}

const styles = StyleSheet.create({
    container: {
        width: 540 * UIMacro.SCREEN_FULL_PERCENT,
        height: 323 * UIMacro.HEIGHT_PERCENT,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 5 * UIMacro.HEIGHT_PERCENT,
        marginLeft: 5 * UIMacro.SCREEN_FULL_PERCENT,
        borderRadius: 5,
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    wcContainer: {
        width: 510 * UIMacro.SCREEN_FULL_PERCENT,
        height: 308 * UIMacro.HEIGHT_PERCENT,
        borderRadius: 5,
    },
    topTitleView: {
        height: 43 * UIMacro.HEIGHT_PERCENT,
        flexDirection: 'row',
        alignItems: 'center',
        width: 510 * UIMacro.SCREEN_FULL_PERCENT,
        backgroundColor: SkinsColor.topTitleView,
    },
    //时间
    topViewTimeTextStyle: {
        color: '#fff',
        fontSize: 15,
        marginLeft: 8 * UIMacro.SCREEN_FULL_PERCENT
    },
    timeRightDownImageStyle: {
        marginRight: 10 * UIMacro.SCREEN_FULL_PERCENT,
        marginTop: 8 * UIMacro.HEIGHT_PERCENT,
        width: 14 * UIMacro.HEIGHT_PERCENT,
        height: 8 * UIMacro.HEIGHT_PERCENT,
    },
    typeRightDownImageStyle: {
        marginRight: 10 * UIMacro.SCREEN_FULL_PERCENT,
        marginTop: 8 * UIMacro.HEIGHT_PERCENT,
        width: 14 * UIMacro.HEIGHT_PERCENT,
        height: 8 * UIMacro.HEIGHT_PERCENT,
    },
    //奖励类型
    topViewRewardsTextStyle: {
        color: '#fff',
        fontSize: 15,
        marginLeft: 30 * UIMacro.SCREEN_FULL_PERCENT
    },
    dropdownStyle: {
        width: 105 * UIMacro.SCREEN_FULL_PERCENT,
        flex: 1,
        height: 100 * UIMacro.HEIGHT_PERCENT,
        borderWidth: 0,
        marginTop: 1,
        marginLeft: 5 * UIMacro.SCREEN_FULL_PERCENT,
    },
    dropdownStyle1: {
        width: 105 * UIMacro.SCREEN_FULL_PERCENT,
        flex: 1,
        height: 50 * UIMacro.HEIGHT_PERCENT,
        borderWidth: 0,
        marginTop: 1,
        marginLeft: 5 * UIMacro.SCREEN_FULL_PERCENT,
    },
    dropdownTextStyle: {
        color: '#FFFFFF',
        backgroundColor: SkinsColor.bgTextViewStyle_bg,
        fontSize: 15,
        height: 25 * UIMacro.HEIGHT_PERCENT,
        width: 105 * UIMacro.SCREEN_FULL_PERCENT,
        paddingTop: 0,
        paddingBottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        lineHeight: 25*UIMacro.HEIGHT_PERCENT
    },
    dropdownTextHighlightStyle: {
        color: '#FFFFFF',
        backgroundColor: SkinsColor.WelfareRecordDropDownHighLight_bg,
        fontSize: 15,
        height: 25 * UIMacro.HEIGHT_PERCENT,
        width: 105 * UIMacro.SCREEN_FULL_PERCENT,
        paddingTop: 0,
        paddingBottom: 0,
    },
    selectViewStyle: {
        width: 105 * UIMacro.SCREEN_FULL_PERCENT,
        height: 25 * UIMacro.HEIGHT_PERCENT,
        backgroundColor: SkinsColor.bgTextViewStyle_bg,
        borderRadius: 5,
        borderWidth: 0.5,
        borderColor: SkinsColor.bgTextViewStyle_border,
        marginLeft: 5,
        flexDirection: 'row',
        justifyContent:'space-between',
    },
    selectTextStyle: {
        color: 'white',
        marginLeft: 5 * UIMacro.SCREEN_FULL_PERCENT,
        lineHeight:25 * UIMacro.HEIGHT_PERCENT,
        alignItems:'center',
        justifyContent:'center'
    },
    tableTitleTextStyle: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 12,
        textAlign: 'center',
        justifyContent:'center',
    },
    //FlatList Style
    wcTableContent: {
        flexDirection: 'row',
        width: 510 * UIMacro.SCREEN_FULL_PERCENT,
        height: 240 * UIMacro.HEIGHT_PERCENT,
        backgroundColor: SkinsColor.WelfareRecordList_bg,
    },
    tableItem: {
        flexDirection: 'row',
        width: 510 * UIMacro.SCREEN_FULL_PERCENT,
        height: 25 * UIMacro.WIDTH_PERCENT,
        alignItems: 'center',
    },
    tableItemBackgroundColor1: {
        backgroundColor: SkinsColor.table_bg1
    },
    tableItemBackgroundColor2: {
        backgroundColor: SkinsColor.table_bg2,
    },
    //无数据妹妹图片
    imageMM: {
        width: 75 * UIMacro.WIDTH_PERCENT,
        height: 116 * UIMacro.HEIGHT_PERCENT,
        marginLeft: 231 * UIMacro.WIDTH_PERCENT,
        marginRight: 233 * UIMacro.WIDTH_PERCENT,
        marginBottom: 30 * UIMacro.HEIGHT_PERCENT,
        marginTop: 30 * UIMacro.HEIGHT_PERCENT,
    },
    searchBtnImage: {
        width: 81 * UIMacro.SCREEN_FULL_PERCENT,
        height: 33 * UIMacro.HEIGHT_PERCENT,
    },
    searchBtnText: {
        color: '#fff',
        fontSize: 15,
        fontWeight: 'bold',
        textAlign: 'center',
        height: 33 * UIMacro.HEIGHT_PERCENT,
        lineHeight: 33 * UIMacro.HEIGHT_PERCENT
    },
    searchBtn: {
        width: 81 * UIMacro.SCREEN_FULL_PERCENT,
        height: 33 * UIMacro.HEIGHT_PERCENT,
        marginLeft: 25 * UIMacro.WIDTH_PERCENT
    },
    titleViewStyle: {
        width: 510 * UIMacro.SCREEN_FULL_PERCENT,
        height: 25 * UIMacro.WIDTH_PERCENT,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        backgroundColor: SkinsColor.WelfareRecordListHead_bg,
        flexDirection: 'row',
        alignItems: 'center',
    },
});