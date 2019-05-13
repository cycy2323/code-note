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
} from 'react-native';
import GBNetWorkService from "../../core/GBNetWorkService";
import LoadingView from "../Loading/LoadingView";
import UIMacro from "../../core/UIMacro";
import Toast from "../../common/ToastView";
import TouchableBounce from "../../common/TouchableBounce";
import SkinsColor from "../../core/SkinsColor";
import FastImage from 'react-native-fast-image';

type
    Props = {};
const BORDER_WIDTH = 2;

export default class WelfareChangeView extends Component<Props> {
    state = {
        tableList: [],
        success: false,
        isRefresh: false,
        transferSum:'0.00',
        withdrawSum:'0.00',
        topSuccess:false,
        updateTime:''
    };

    /*一键刷新*/
    welfareRefreshFun = () => {
        if (this._isMounted) {
            this.loadingView.showAnimation();
            GBNetWorkService.get("mobile-api/userInfoOrigin/refresh.html", null, null, this._welfareRefreshSuccessBack, this._welfareRefreshFailBack)
        }
    };
    _welfareRefreshSuccessBack = (json) => {
        if (this._isMounted) {
            //关闭loading
            this.loadingView.dismissAnimation();
            console.log("welfareRefresh成功" + JSON.stringify(json));
            if(json.data && json.data.apis){
                this.setState({
                    tableList: json.data.apis,
                })
            }
            if (parseInt(json.code) === 0) {
                this.refs.toast.show(this.state.isRefresh ? '刷新成功' : '回收成功')
            } else {
                this.refs.toast.show(json.message)
            }
        }
    };
    _welfareRefreshFailBack = (json) => {
        if (this._isMounted) {
            //关闭loading
            this.loadingView.dismissAnimation();
            console.log("welfareRefresh失败")
            this.refs.toast.show(json.message)
        }
    };

    /*一键回收*/
    welfareRecoveryFun = (apiId) => {
        if (this._isMounted) {
            let parma = {"search.apiId": apiId};
            GBNetWorkService.get("mobile-api/mineOrigin/recovery.html", parma, null, this._welfareRecoverySuccessBack, this._welfareRecoveryFailBack)
            this.loadingView.showAnimation();
        }
    };
    _welfareRecoverySuccessBack = (json) => {
        if (this._isMounted) {
            //关闭loading
            this.loadingView.dismissAnimation();
            console.log("welfareRecovery成功" + JSON.stringify(json));
            //回收成功后再调刷新接口更新数据
            this.welfareRefreshFun();
            //更新同步时间
            this.setState({
                updateTime:this.GetDateStr(0)
            });
        }
    };
    _welfareRecoveryFailBack = (json) => {
        if (this._isMounted) {
            //关闭loading
            this.loadingView.dismissAnimation();
            console.log("welfareRecovery失败")
        }
    };

    /*获取用户信息中的福利记录*/
    getUserInfo = () => {
        if (this._isMounted) {
            GBNetWorkService.post("mobile-api/userInfoOrigin/getUserInfo.html", null, null, this._welfareChangeSuccessBack, this._welfareChangeFailBack)
            this.loadingView.showAnimation();
        }
    };

    /*获取提现处理中以及转账处理中的数据*/
    getTransferInfo = () => {
        if (this._isMounted) {
            GBNetWorkService.post("mobile-api/userInfoOrigin/searchHandlingFunds.html", null, null, this._transferInfoSuccessBack, this._transferInfoFailBack)
        }
    };
    _transferInfoSuccessBack = (json) => {
        if (this._isMounted) {
            console.log("transfer成功" + JSON.stringify(json));
            this.setState({
                withdrawSum:json.withdrawSum,
                transferSum:json.transferSum,
                topSuccess:true
            })
        }
    };
    _transferInfoFailBack = (json) => {
        if (this._isMounted) {
            console.log("transfer失败" + JSON.stringify(json))
        }
    };
    _welfareChangeSuccessBack = (json) => {
        console.log("增加的控制参数" + this._isMounted);
        if (this._isMounted) {
            //关闭loading
            this.loadingView.dismissAnimation();
            console.log("welfareChange成功" + JSON.stringify(json));
            json.data &&
            this.setState({
                tableList: json.data.user.apis,
                success: json.success
            })
        }
    };
    _welfareChangeFailBack = (json) => {
        //关闭loading
        if (this._isMounted) {
            this.loadingView.dismissAnimation();
            console.log("welfareChange失败" + JSON.stringify(json))
        }
    };

    GetDateStr = (AddDayCount) => {
        let dd = new Date();
        dd.setDate(dd.getDate() + AddDayCount);//获取AddDayCount天后的日期
        let y = dd.getFullYear();
        let m = (dd.getMonth() + 1) < 10 ? "0" + (dd.getMonth() + 1) : (dd.getMonth() + 1);//获取当前月份的日期，不足10补0
        let d = dd.getDate() < 10 ? "0" + dd.getDate() : dd.getDate();//获取当前几号，不足10补0
        let H = dd.getHours()<10?"0"+dd.getHours():dd.getHours();
        let M = dd.getMinutes()<10?"0"+dd.getMinutes():dd.getMinutes();
        let s = dd.getSeconds()<10?"0"+dd.getSeconds():dd.getSeconds();
        return y + "-" + m + "-" + d + " " + H +":"+M+":"+s;
    };

    showItem = ({item}) => {

        if (item.status === '暂停转账') {
            return (
                <View style={styles.table}>
                    <Text style={styles.tableRow1}>{item.apiName}</Text>
                    <Text style={styles.tableRow4}>维护中</Text>
                    <FastImage
                        resizeMode='contain'
                        style={{
                            width: 19,
                            height: 21.5,
                            marginTop: -5 * UIMacro.HEIGHT_PERCENT,
                            marginLeft: 5 * UIMacro.WIDTH_PERCENT
                        }}
                        source={require('../../static/images/2.1.0/nowork.webp')}
                    />
                </View>
            )
        } else {
            return (
                <View style={styles.table}>
                    <Text style={styles.tableRow1}>{item.apiName}</Text>
                    <Text style={item.balance === 0 ? styles.tableRow3 : styles.tableRow2}>{item.balance}</Text>
                    <TouchableOpacity onPress={() => {
                        this.welfareRecoveryFun(item.apiId);
                        this.setState({isRefresh: false})
                    }}
                                      style={styles.refreshRecoveryText}>
                        <FastImage
                            resizeMode='contain'
                            style={{width: 19, height: 21.5}}
                            source={require('../../static/images/2.1.0/refresh2.webp')}
                        />
                    </TouchableOpacity>
                </View>
            )
        }
    };

    showData = () => {
        if (this.state.success && this.state.tableList.length !== 0) {
            return <FlatList
                data={this.state.tableList}
                renderItem={this.showItem}
                keyExtractor={(item, index) => item.apiId}
                numColumns={3}
                extraData={this.state}/>
        } else if (this.state.success) {
            return <FastImage style={styles.imageMM} resizeMode='stretch'
                          source={require('../../static/images/2.1.0/nodata_bg2.webp')}/>
        }
    };

    showTop = () => {
        if(this.state.topSuccess){
            return(
                <View style={styles.middleTop}>
                    <Text style={styles.middleTopText1}>提现处理中 </Text>
                    <Text style={styles.middleTopText}>{this.state.withdrawSum} </Text>
                    <Text style={styles.middleTopText1}>转账处理中 </Text>
                    <Text style={styles.middleTopText}>{this.state.transferSum} </Text>
                </View>
            )
        }else{
            return(
                <View style={styles.middleTop}>
                    <Text style={styles.middleTopText}> </Text>
                </View>
            )
        }
    };

    showBottom = () => {
        if(this.state.topSuccess){
            return(
                <View style={styles.middleBottom}>
                    <Text style={styles.middleTopText1}>福利已经完成同步: </Text>
                    <Text style={styles.middleTopText1}>{this.state.updateTime} </Text>
                </View>
            )
        }
    };

    componentDidMount() {
        this._isMounted = true;
        this.getUserInfo();
        this.getTransferInfo();
        //更新同步时间
        this.setState({
            updateTime:this.GetDateStr(0)
        });
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {
        return (
            <View style={styles.wcContainer}>
                {this.showTop()}
                {/*按钮栏*/}
                <View style={styles.wcSearchBar}>
                    <TouchableBounce onPress={() => {
                        this.welfareRefreshFun();
                        this.setState({isRefresh: true})
                    }} style={styles.welfareChangeRefreshBtn}>
                        <FastImage
                            style={styles.welfareSearchLeftBtnImage}
                            resizeMode='stretch'
                            source={require('../../static/images/2.1.0/btn_blue3_click.webp')}>
                            <Text style={styles.welfareSearchBtnText}>一键刷新</Text>
                            <FastImage
                                style={styles.refreshRecovery}
                                resizeMode='contain'
                                source={require('../../static/images/2.1.0/refresh.webp')}
                            />
                        </FastImage>
                    </TouchableBounce>
                    <TouchableBounce onPress={() => {
                        this.welfareRecoveryFun('');
                        this.setState({isRefresh: false})
                    }}
                                      style={styles.welfareChangeRecoveryBtn}>
                        <FastImage
                            style={styles.welfareSearchRightBtnImage}
                            resizeMode='stretch'
                            source={require('../../static/images/2.1.0/btn_blue3_click.webp')}>
                            <Text style={styles.welfareSearchBtnText}>一键回收</Text>
                            <FastImage
                                style={styles.refreshRecovery}
                                resizeMode='contain'
                                source={require('../../static/images/2.1.0/recovery.webp')}
                            />
                        </FastImage>
                    </TouchableBounce>
                </View>
                {/*表格*/}
                <View style={styles.wcTableContent}>
                    {this.showData()}
                </View>

                {this.showBottom()}
                {/*loading视图*/}
                <LoadingView ref={(c) => this.loadingView = c}/>
                <Toast
                    ref="toast"
                    style={{
                        backgroundColor:
                            'white', marginTop: 230 * UIMacro.HEIGHT_PERCENT,
                    }}
                    fadeInDuration={300}
                    fadeOutDuration={300}
                    opacity={1}
                    textStyle={{color: 'black'}}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    wcContainer: {
        width: 335 * UIMacro.WIDTH_PERCENT,
        height: 285 * UIMacro.HEIGHT_PERCENT,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: SkinsColor.bgTextViewStyle_border,
        backgroundColor: 'rgba(0, 0, 0, .2)',
        marginTop: 10 * UIMacro.HEIGHT_PERCENT,
    },
    wcSearchBar: {
        height: 48 * UIMacro.HEIGHT_PERCENT,
        width: 335 * UIMacro.WIDTH_PERCENT,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    wcTableContent: {
        flexDirection: 'row',
        height: 185 * UIMacro.HEIGHT_PERCENT,
        marginLeft: 6 * UIMacro.WIDTH_PERCENT,
    },
    table: {
        width: 107 * UIMacro.WIDTH_PERCENT,
        height: 69 * UIMacro.HEIGHT_PERCENT,
        borderWidth: 1,
        borderColor: SkinsColor.table_bg1,
        marginRight: 1,
        marginBottom: 1,
        backgroundColor: SkinsColor.shadowColor
    },
    tableRow1: {
        height: 20 * UIMacro.HEIGHT_PERCENT,
        color: '#fff',
        fontSize: 11,
        textAlign: 'left',
        marginLeft: 8 * UIMacro.WIDTH_PERCENT,
        marginTop: 7 * UIMacro.HEIGHT_PERCENT,
        fontWeight: 'bold'
    },
    tableRow2: {
        height: 20 * UIMacro.HEIGHT_PERCENT,
        fontSize: 11,
        textAlign: 'left',
        color: '#FFEA00',
        marginLeft: 8 * UIMacro.WIDTH_PERCENT,
    },
    tableRow3: {
        height: 20 * UIMacro.HEIGHT_PERCENT,
        fontSize: 11,
        textAlign: 'left',
        color: '#fff',
        marginLeft: 8 * UIMacro.WIDTH_PERCENT,
    },
    tableRow4: {
        height: 20 * UIMacro.HEIGHT_PERCENT,
        fontSize: 11,
        textAlign: 'left',
        color: SkinsColor.IDText,
        marginLeft: 8 * UIMacro.WIDTH_PERCENT,
    },
    welfareSearchLeftBtnImage: {
        width: 130 * UIMacro.WIDTH_PERCENT,
        height: 30 * UIMacro.HEIGHT_PERCENT,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    welfareSearchRightBtnImage: {
        width: 130 * UIMacro.WIDTH_PERCENT,
        height: 30 * UIMacro.HEIGHT_PERCENT,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    welfareSearchBtnText: {
        color: '#fff',
        fontSize: 15,
        fontWeight: 'bold',
        textAlign: 'center',
        height: 30 * UIMacro.HEIGHT_PERCENT,
        lineHeight: 30 * UIMacro.HEIGHT_PERCENT,
    },
    refreshRecovery: {
        marginLeft: 4 * UIMacro.WIDTH_PERCENT,
        width: 19.5 * UIMacro.WIDTH_PERCENT,
        height: 18.5 * UIMacro.WIDTH_PERCENT,
    },
    welfareChangeRefreshBtn: {
        width: 131 * UIMacro.WIDTH_PERCENT,
        height: 31 * UIMacro.HEIGHT_PERCENT,
    },
    welfareChangeRecoveryBtn: {
        width: 131 * UIMacro.WIDTH_PERCENT,
        height: 33 * UIMacro.HEIGHT_PERCENT,
        marginLeft: 7 * UIMacro.WIDTH_PERCENT,
    },
    refreshRecoveryText: {
        width: 12 * UIMacro.WIDTH_PERCENT,
        height: 14 * UIMacro.WIDTH_PERCENT,
        marginLeft: 8 * UIMacro.WIDTH_PERCENT,
        marginTop: -5 * UIMacro.HEIGHT_PERCENT
    },
    imageMM: {
        width: 212 * UIMacro.WIDTH_PERCENT,
        height: 173 * UIMacro.HEIGHT_PERCENT,
        marginLeft: 50 * UIMacro.WIDTH_PERCENT,
        marginRight: 50 * UIMacro.WIDTH_PERCENT,
        marginBottom: 15 * UIMacro.HEIGHT_PERCENT,
    },
    middleTop:{
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        marginTop:11*UIMacro.HEIGHT_PERCENT,
    },
    middleBottom:{
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        marginTop:5*UIMacro.HEIGHT_PERCENT,
    },
    middleTopText1:{
        fontSize:11,
        color:SkinsColor.IDText
    },
    middleTopText:{
        fontSize:11,
        color:'#CCDBFF'
    }
});