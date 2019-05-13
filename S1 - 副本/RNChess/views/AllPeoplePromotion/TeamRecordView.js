import {Component} from "react";
import {
    StyleSheet,
    View,
    Text,
    FlatList
} from 'react-native';
import React from "react";
import UIMacro from "../../core/UIMacro";
import GBNetWorkService from "../../core/GBNetWorkService";
import SkinsColor from "../../core/SkinsColor";
import FastImage from 'react-native-fast-image';

type Props = {};
export default class TeamRecordView extends Component<Props> {

    constructor(pros) {
        super(pros);
        this.state = {
            teamListData:[],
        }
    };
    componentDidMount(){
        GBNetWorkService.post('mobile-api/allPersonRecommend/teamList.html',null,null,this._getTeamDataSucess,this._getTeamDataFail)
    }
    _getTeamDataSucess=(json)=>{
        if (parseInt(json.code) === 0){
            this.setState({
                teamListData:json.data
            })
        }
        console.log("团队记录数据"+JSON.stringify(json))

    }
    _getTeamDataFail=(json)=>{
        console.log("获取团队记录失败")

    }




    render() {
        return (
            <View style={styles.teamRecordContainer}>
                <FastImage style={styles.titleImageStyle}
                       source={require("../../static/images/2.1.0/title_team.webp")}
                />
                <View style={styles.tableTitleViewStyle}>
                    <Text style={{fontSize:12,color:'white',width:169*UIMacro.SCREEN_FULL_PERCENT,textAlign:'center'}}>玩家账号</Text>
                    <Text style={{fontSize:12,color:'white'}}>推荐玩家数</Text>
                    <Text style={{fontSize:12,color:'white',width:150*UIMacro.SCREEN_FULL_PERCENT,textAlign:'center'}}>今日新增推荐</Text>
                </View>
                <View  style={styles.teamRecordFlatListStyle}>
                    {this.state.teamListData.length>0&&<FlatList
                        data={this.state.teamListData}
                        renderItem={this._showItem}
                        keyExtractor={(item) => item.id.toString()}
                        // extraData={this.state}

                    />}
                    {
                        this.state.teamListData.length===0&&<View style={styles.nodataViewStyle}>
                            <FastImage source={require("../../static/images/2.1.0/nodata_promotion.webp")}
                                   style={{width:75*UIMacro.WIDTH_PERCENT,height:116*UIMacro.WIDTH_PERCENT}}
                            />
                            <Text style={{fontSize:11,color:'white'}}>暂无数据</Text>
                        </View>

                    }
                </View>
            </View>
        )
    }
    _showItem=({item,index})=>{
        return<View style={[styles.tableCellStyle,index===0?styles.selfViewStyle:index%2===0?styles.tableCellBackgroundColor2:styles.tableCellBackgroundColor1]}>
            <Text style={{fontSize:10,color:SkinsColor.tableTitleTextColor,width:169*UIMacro.SCREEN_FULL_PERCENT,textAlign:'center'}}>
                {item.playName.indexOf('自身')===-1?item.playName.substr(0,1)+'******'+item.playName.substr(item.playName.length-1,1)+'(直属下级)':
                    item.playName}
            </Text>
            <Text style={{fontSize:10,color:SkinsColor.tableTitleTextColor}}>{item.recommendNum}</Text>
            <Text style={{fontSize:10,color:SkinsColor.tableTitleTextColor,width:150*UIMacro.SCREEN_FULL_PERCENT,textAlign:'center'}}>{item.todayRecommendNum}</Text>
            </View>

    }
}


const styles = StyleSheet.create({
    teamRecordContainer: {
        width:540*UIMacro.SCREEN_FULL_PERCENT,
        height:328*UIMacro.HEIGHT_PERCENT,
        flexDirection:'column',
        marginTop:5*UIMacro.HEIGHT_PERCENT,
        marginLeft: 5*UIMacro.SCREEN_FULL_PERCENT,
        borderRadius:5,
        backgroundColor:'rgba(0,0,0,0.4)',
    },
    titleImageStyle:{
        width: 62*UIMacro.WIDTH_PERCENT,
        height:15*UIMacro.WIDTH_PERCENT,
        marginLeft:15*UIMacro.SCREEN_FULL_PERCENT,
        marginTop:15*UIMacro.HEIGHT_PERCENT,
    },
    tableTitleViewStyle:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginLeft:15*UIMacro.SCREEN_FULL_PERCENT,
        marginTop:8*UIMacro.HEIGHT_PERCENT,
        backgroundColor:SkinsColor.WelfareRecordListHead_bg,
        width:507*UIMacro.SCREEN_FULL_PERCENT,
        height:25*UIMacro.HEIGHT_PERCENT,
    },
    selfViewStyle:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor:SkinsColor.selfViewStyle,
        width:507*UIMacro.SCREEN_FULL_PERCENT,
        height:25*UIMacro.HEIGHT_PERCENT,
    },
    teamRecordFlatListStyle:{
        width:507*UIMacro.SCREEN_FULL_PERCENT,
        height:225*UIMacro.HEIGHT_PERCENT,
        marginLeft:15*UIMacro.SCREEN_FULL_PERCENT,
        justifyContent:'center',
        alignItems:'center',
    },
    tableCellStyle:{
        width:507*UIMacro.SCREEN_FULL_PERCENT,
        height:25*UIMacro.WIDTH_PERCENT,
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',

    },
    tableCellBackgroundColor1:{
        backgroundColor:SkinsColor.table_bg1
    },
    tableCellBackgroundColor2:{
        backgroundColor:SkinsColor.table_bg2

    },
    nodataViewStyle:{
        width:76*UIMacro.WIDTH_PERCENT,
        height:133*UIMacro.WIDTH_PERCENT,
        flexDirection:'column',
        justifyContent:'space-between',
        alignItems:'center'
    }


});