import {View, Text, StyleSheet, FlatList,} from 'react-native';
import GBNetWorkService from "../../core/GBNetWorkService";
import moment from 'moment';
import BigPopPage from '../../common/BigPopPage' ;
import UIMacro from '../../core/UIMacro'
import SkinsColor from "../../core/SkinsColor";
import UserInfo from "../../core/UserInfo";
import TimeZoneManager from '../../core/TimeZoneManager'


export default class CheckAuditView extends BigPopPage {
    constructor() {
        super();
        this.state = {
            ...this.state,
            withdrawAudit:[],
        }
    }

    pageDidShow = () => {
        GBNetWorkService.post('mobile-api/withdrawOrigin/getAuditLog.html',null,null,this.successGetAudit,this.failGetAudit);
    }

    successGetAudit=(json)=>{
        console.log('getAudit:'+JSON.stringify(json)) ;
        this.setState({
            withdrawAudit:json.data.withdrawAudit,
        })
    }

    failGetAudit=(json)=>{

    }

    showItem = ({item,index}) =>{
        let day = TimeZoneManager.getInstance().stringFromTimestamp(item.createTime);
        return(
            <View style={[styles.table,index%2===0?styles.tableItemBackgroundColor1:styles.tableItemBackgroundColor2]}>
                <Text numberOfLines={2} style={[styles.tableCell1, styles.flex]}>{day}</Text>
                <Text style={[styles.tableCell2, styles.flex]}>{'¥'+UserInfo.isDot(item.rechargeAmount)}</Text>
                <Text style={[styles.tableCell3, styles.flex]}>{item.rechargeAudit===0?'0.00/0.00':UserInfo.isDot(item.rechargeRemindAudit)+'/'+UserInfo.isDot(item.rechargeAudit)}</Text>
                <Text style={[styles.flex,styles.tableCell4]}>{'¥'+UserInfo.isDot(item.favorableAmount)}</Text>
                <Text style={[styles.tableCell5, styles.flex]}>{item.favorableAudit===0?'0.00/0.00':UserInfo.isDot(item.favorableRemindAudit)+'/'+UserInfo.isDot(item.favorableAudit)}</Text>
                <Text style={[styles.flex,styles.tableCell6]}>{parseInt(item.favorableFee)===0?'通过':'¥'+UserInfo.isDot(item.favorableFee)}</Text>
            </View>

        )
    }

    titleImage = () => {
        return require('../../static/images/2.1.0/title15.webp')
    }

    contentView = () => {
        return <View style={styles.wcContainer}>
            {/*table标题栏*/}
            <View style={styles.wcTableTitleImage}>
                    <Text style={styles.tableTitleTextOne}>存款时间</Text>
                    <Text style={styles.tableTitleTextTwo}>存款金额</Text>
                    <Text style={styles.tableTitleTextThree}>存款稽核点</Text>
                    <Text style={styles.tableTitleTextFour}>优惠金额</Text>
                    <Text style={styles.tableTitleTextFive}>优惠稽核点</Text>
                    <Text style={styles.tableTitleTextSix}>优惠扣除</Text>
            </View>
            {/*表格*/}
            <View style={styles.wcTableContent}>
                <FlatList
                    data={this.state.withdrawAudit}
                    renderItem={this.showItem}
                    keyExtractor={(item,index)=>index.toString()}
                    extraData={this.state}
                />
            </View>
        </View>
    }
}

const BORDER_WIDTH = 2;

const styles = StyleSheet.create({
    wcContainer: {
        width: 465 * UIMacro.WIDTH_PERCENT,
        height: 291 * UIMacro.HEIGHT_PERCENT,
        borderWidth: BORDER_WIDTH,
        borderColor: SkinsColor.bgTextViewStyle_border,
        backgroundColor: SkinsColor.messageTxt_bg,
        justifyContent:'center',
        marginTop: 7 * UIMacro.HEIGHT_PERCENT,
    },
    wcTableTitleImage: {
        width: 457 * UIMacro.WIDTH_PERCENT,
        height: 25 * UIMacro.HEIGHT_PERCENT,
        marginLeft: 1*UIMacro.HEIGHT_PERCENT,
        justifyContent:'center',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor:SkinsColor.WelfareRecordList_bg

    },
    tableTitleTextOne: {
        color: '#fff',
        fontWeight: 'bold',
        marginLeft: 10 * UIMacro.WIDTH_PERCENT,
        marginRight:10*UIMacro.WIDTH_PERCENT,
        width:65*UIMacro.WIDTH_PERCENT,
        height:20*UIMacro.HEIGHT_PERCENT,
        fontSize: 12,
        marginTop: 5*UIMacro.HEIGHT_PERCENT,
    },
    tableTitleTextTwo: {
        color: '#fff',
        fontWeight: 'bold',
        marginRight:10*UIMacro.WIDTH_PERCENT,
        width:65*UIMacro.WIDTH_PERCENT,
        height:20*UIMacro.HEIGHT_PERCENT,
        fontSize: 12,
        marginTop: 5*UIMacro.HEIGHT_PERCENT,
    },
    tableTitleTextThree: {
        color: '#fff',
        fontWeight: 'bold',
        marginRight:5*UIMacro.WIDTH_PERCENT,
        width:75*UIMacro.WIDTH_PERCENT,
        height:20*UIMacro.HEIGHT_PERCENT,
        fontSize: 12,
        marginTop: 5*UIMacro.HEIGHT_PERCENT,
    },
    tableTitleTextFour: {
        color: '#fff',
        fontWeight: 'bold',
        marginRight:5*UIMacro.WIDTH_PERCENT,
        width:65*UIMacro.WIDTH_PERCENT,
        height:20*UIMacro.HEIGHT_PERCENT,
        fontSize: 12,
        marginTop: 5*UIMacro.HEIGHT_PERCENT,
    },
    tableTitleTextFive: {
        color: '#fff',
        fontWeight: 'bold',
        marginRight:5*UIMacro.WIDTH_PERCENT,
        width:75*UIMacro.WIDTH_PERCENT,
        height:20*UIMacro.HEIGHT_PERCENT,
        fontSize: 12,
        marginTop: 5*UIMacro.HEIGHT_PERCENT,
    },
    tableTitleTextSix: {
        color: '#fff',
        fontWeight: 'bold',
        width:65*UIMacro.WIDTH_PERCENT,
        height:20*UIMacro.HEIGHT_PERCENT,
        fontSize: 12,
        marginTop: 5*UIMacro.HEIGHT_PERCENT,
    },
    wcTableContent: {
        flexDirection:'row',
        width: 457 * UIMacro.WIDTH_PERCENT,
        height: 252 * UIMacro.HEIGHT_PERCENT,
        backgroundColor: SkinsColor.WelfareRecordList_bg,
        justifyContent:'center',
        marginLeft: 1 * UIMacro.WIDTH_PERCENT,
        marginBottom: 3 * UIMacro.HEIGHT_PERCENT,
    },
    table:{
        flexDirection:'row',
        height:25*UIMacro.HEIGHT_PERCENT,
    },
    tableItemBackgroundColor1:{
        backgroundColor:SkinsColor.table_bg1
    },
    tableItemBackgroundColor2:{
        backgroundColor:SkinsColor.table_bg2,
    },
    flex:{
        height: UIMacro.SCREEN_WIDTH>=667? 30*UIMacro.HEIGHT_PERCENT :35*UIMacro.HEIGHT_PERCENT,
        color:'#fff',
        textAlign: 'center',
        justifyContent: 'center',
        fontSize:10,
    },
    tableCell1:{
        width:70*UIMacro.WIDTH_PERCENT,
    },
    tableCell2:{
        width:82*UIMacro.WIDTH_PERCENT,
        lineHeight: 25*UIMacro.HEIGHT_PERCENT,
    },
    tableCell3:{
        width:82*UIMacro.WIDTH_PERCENT,
        lineHeight: 25*UIMacro.HEIGHT_PERCENT,
    },
    tableCell4:{
        width:70*UIMacro.WIDTH_PERCENT,
        lineHeight: 25*UIMacro.HEIGHT_PERCENT,
        color:'#FFEA00',
    },
    tableCell5:{
        width:82*UIMacro.WIDTH_PERCENT,
        lineHeight: 25*UIMacro.HEIGHT_PERCENT,
    },
    tableCell6:{
        width:70*UIMacro.WIDTH_PERCENT,
        lineHeight: 25*UIMacro.HEIGHT_PERCENT,
        color:'#FFEA00',
    },
})