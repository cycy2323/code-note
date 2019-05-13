import {Component} from "react";
import {
    StyleSheet,
    View,
    ScrollView,
    Text,
} from 'react-native';
import React from "react";
import UIMacro from "../../core/UIMacro";
import GBNetWorkService from "../../core/GBNetWorkService";
import UserInfo from "../../core/UserInfo";
import TouchableBounce from "../../common/TouchableBounce";
import FastImage from 'react-native-fast-image'

type Props = {};
export default class RewardDetailView extends Component<Props> {

    constructor(pros) {
        super(pros);
        this.state = {
            moneyArray: [],
            teamRecommendRules: [],
            recommendRule: '',
            detailRule: '',
            adviceReward: '',
            showType: 0,
        }
    };

    componentDidMount() {
        GBNetWorkService.get('mobile-api/allPersonRecommend/ruleDetail.html', null, null, this._getRewardDetailDataSuccess, this._getRewardDetailDataFail)
    }

    _getRewardDetailDataSuccess = (json) => {
        //"adviceReward":"推荐好友成功注册并累计存款满{1}同时有效投注满{2}，您可获得{3}奖励",
        console.log("获取奖励详情数据" + JSON.stringify(json))
        if(json.data){
            this.setState({
                moneyArray: json.data.moneyArray,
                teamRecommendRules:json.data&&json.data.teamRecomendRulse?json.data.teamRecomendRulse:[],
                recommendRule: json.data.recommendRule,
                detailRule: json.data.detailRule,
                adviceReward: json.data.adviceReward,
                showType: json.data.showTpye,
            })
        }
    }
    _getRewardDetailDataFail = () => {

    }


    render() {

        return (
            <View style={styles.container}>
                <ScrollView>
                    <FastImage style={styles.titleImageStyle}
                           source={require("../../static/images/2.1.0/title_recommend_promotion.webp")}
                    />
                    {this.state.moneyArray&&this.state.moneyArray.length>0?
                    <View style={{flexDirection: 'row',marginLeft:15}}>
                        {this.dealAdviceReward()}
                    </View>:
                        <View>
                            <Text style={[styles.normalTextStyle, {marginLeft: 15}]}>无</Text>
                        </View>}
                    <FastImage style={styles.titleImageStyle}
                           source={require("../../static/images/2.1.0/title_bonus_promotion.webp")}

                    />
                    <Text style={[styles.normalTextStyle, {marginLeft: 15, marginRight: 15}]}
                          numberOfLines={0}
                    >
                        {this.state.recommendRule}
                    </Text>
                    {parseInt(this.state.showType) === 3 ? this._teamSettingTableView() : this._singleSettingTableView()}
                    <FastImage style={styles.titleImageStyle}
                           source={require("../../static/images/2.1.0/title_rule_promotion.webp")}

                    />
                    <Text style={[styles.normalTextStyle, {marginLeft: 15, marginBottom: 15, marginRight: 15}]}
                          numberOfLines={0}
                    >
                        {this.state.detailRule&&this.state.detailRule.length>0?this.state.detailRule:'无'}
                    </Text>
                </ScrollView>
            </View>
        )
    }

    //处理推荐奖励
    dealAdviceReward=()=>{
        let ViewArray = [];
        let tempArr = this.state.adviceReward.split(/{[0-9]*}/);
        for (let i = 0; i<tempArr.length;i++){
            ViewArray.push(
                <View style={{flexDirection:'row'}} key={i}>
                    <Text style={styles.normalTextStyle}>{tempArr[i]}</Text>
                    <Text style={styles.goldTextStyle}>{this.state.moneyArray[i]&&this.state.moneyArray[i].length>0?'￥'+UserInfo.isDot(this.state.moneyArray[i]):''}</Text>
                </View>
            )
        }
        return  ViewArray;
    }

    _singleSettingTableView = () => {
            // showType 1只有团队有效玩家　２：只有团队有效投注额　３同时有团队有效玩家，有效投注额
            return <FastImage source={require("../../static/images/2.1.0/bg_table_promotion.webp")}
                                    style={[styles.tableBgImageStyle,
                                        {height:65*UIMacro.WIDTH_PERCENT+this.state.teamRecommendRules.length*30*UIMacro.WIDTH_PERCENT}]}
                                    resizeMode='stretch'
            >
                <View style={styles.tableTitleViewStyle}>
                    <View style={{justifyContent:'center',width:160*UIMacro.SCREEN_FULL_PERCENT,alignItems:'center'}}>
                        <FastImage
                            source={parseInt(this.state.showType) === 1 ? require("../../static/images/2.1.0/table_title_quantity.webp")
                                : require("../../static/images/2.1.0/table_title_money.webp")}
                            resizeMode='stretch'
                        />
                    </View>

                    <View style={{justifyContent:'center',width:160*UIMacro.SCREEN_FULL_PERCENT,alignItems:'center'}}>
                        <FastImage source={require("../../static/images/2.1.0/table_title_draw.webp")}
                               resizeMode='stretch'
                        />
                    </View>


                    <View style={{justifyContent:'center',width:160*UIMacro.SCREEN_FULL_PERCENT,alignItems:'center'}}>
                        <FastImage source={require("../../static/images/2.1.0/table_title_bonus.webp")}
                               resizeMode='stretch'
                        />
                    </View>

                </View>
                {this._singleSettingTableContenView()}
            </FastImage>

    }

    _singleSettingTableContenView = () => {
        let viewArray = [];
        for (let i = 0; i < Object.keys(this.state.teamRecommendRules).length; i++) {
            viewArray.push(<View style={styles.teamTableCellStyle} key={i}>
                <Text
                    style={styles.numTextStyle}>{parseInt(this.state.showType) === 1 ? '≥'+this.state.teamRecommendRules[i].effectivePlayers+'人' :
                    '≥'+UserInfo.isDot(this.state.teamRecommendRules[i].effectiveBetting)}</Text>



                <TouchableBounce style={{
                    width:160 * UIMacro.SCREEN_FULL_PERCENT,
                    justifyContent:'center',
                    alignItems:'center',
                }}
                                  onPress={() => {
                                      this._btnClick(this.state.teamRecommendRules[i].pumpDetail)
                                  }}>
                    <FastImage source={require("../../static/images/2.1.0/table_click2.webp")}

                    />
                </TouchableBounce>
                <Text style={styles.numTextStyle}>{this.state.teamRecommendRules[i].maxReward === null ?'无上限' :
                    '￥'+UserInfo.isDot(this.state.teamRecommendRules[i].maxReward)}</Text>

            </View>)

        }
        return viewArray;
    }

    _teamSettingTableView = () => {

            return <FastImage source={require("../../static/images/2.1.0/bg_table_promotion.webp")}
                                    style={[styles.tableBgImageStyle,
                                        {height:65*UIMacro.WIDTH_PERCENT+this.state.teamRecommendRules.length*30*UIMacro.WIDTH_PERCENT}]}
                                    resizeMode='stretch'
            >
                <View style={styles.teamTableTitleViewStyle}>
                    <View style={{justifyContent:'center',width:120*UIMacro.SCREEN_FULL_PERCENT,alignItems:'center'}}>
                        <FastImage source={require("../../static/images/2.1.0/table_title_quantity.webp")}
                                   resizeMode='contain'
                                   style={{justifyContent:'center',width:120*UIMacro.SCREEN_FULL_PERCENT,
                                       height:15*UIMacro.WIDTH_PERCENT,alignItems:'center'}}
                        />
                    </View>

                    <View style={{justifyContent:'center',width:120*UIMacro.SCREEN_FULL_PERCENT,alignItems:'center'}}>
                    <FastImage source={require("../../static/images/2.1.0/table_title_money.webp")}
                               resizeMode='contain'
                               style={{justifyContent:'center',width:120*UIMacro.SCREEN_FULL_PERCENT,
                                   height:15*UIMacro.WIDTH_PERCENT,alignItems:'center'}}
                    />
                    </View>


                    <View style={{justifyContent:'center',width:120*UIMacro.SCREEN_FULL_PERCENT,alignItems:'center',height:18}}>
                        <FastImage source={require("../../static/images/2.1.0/table_title_draw.webp")}
                                   resizeMode='contain'
                                   style={{justifyContent:'center',width:120*UIMacro.SCREEN_FULL_PERCENT,
                                       height:15*UIMacro.WIDTH_PERCENT,alignItems:'center'}}
                        />
                    </View>

                    <View style={{justifyContent:'center',width:120*UIMacro.SCREEN_FULL_PERCENT,
                        height:20*UIMacro.WIDTH_PERCENT,alignItems:'center'}}>
                        <FastImage source={require("../../static/images/2.1.0/table_title_bonus.webp")}
                                   resizeMode='contain'
                                   style={{justifyContent:'center',width:120*UIMacro.SCREEN_FULL_PERCENT,
                                       height:15*UIMacro.WIDTH_PERCENT,alignItems:'center'}}
                        />
                    </View>
                </View>
                {this._teamSettingTableViewContenView()}
            </FastImage>

    }
    _teamSettingTableViewContenView = () => {
        let viewArray = [];
        for (let i = 0; i < Object.keys(this.state.teamRecommendRules).length; i++) {
            viewArray.push(<View style={styles.teamTableCellStyle} key={i}>
                <Text style={{
                    width: 120.0 * UIMacro.SCREEN_FULL_PERCENT,
                    color: 'white',
                    fontSize: 12,
                    fontWeight: 'bold',
                    textAlign: 'center',
                    justifyContent:'center'
                }}>
                    ≥{this.state.teamRecommendRules[i].effectivePlayers}人
                </Text>
                <Text style={{
                    width: 120 * UIMacro.SCREEN_FULL_PERCENT,
                    color: 'white',
                    fontSize: 12,
                    fontWeight: 'bold',
                    textAlign: 'center',
                    justifyContent:'center'
                }}>≥{UserInfo.isDot(this.state.teamRecommendRules[i].effectiveBetting)}</Text>
                <TouchableBounce style={{
                    width:120 * UIMacro.SCREEN_FULL_PERCENT,
                    justifyContent:'center',
                    alignItems:'center',
                }}
                                  onPress={() => {
                                      this._btnClick(this.state.teamRecommendRules[i].pumpDetail)
                                  }}>
                    <FastImage source={require("../../static/images/2.1.0/table_click2.webp")}
                               resizeMode='contain'
                               style={{justifyContent:'center',width:120*UIMacro.SCREEN_FULL_PERCENT,
                                   height:15*UIMacro.WIDTH_PERCENT,alignItems:'center'}}

                    />
                </TouchableBounce>
                <Text style={{
                    width: 120 * UIMacro.SCREEN_FULL_PERCENT,
                    color: 'white',
                    fontSize: 12,
                    fontWeight: 'bold',
                    textAlign: 'center',
                    justifyContent:'center'
                }}>
                    {this.state.teamRecommendRules[i].maxReward === null ?'无上限':'￥'+UserInfo.isDot(this.state.teamRecommendRules[i].maxReward) }
                </Text>

            </View>)

        }
        return viewArray;
    }
    _btnClick = (dataArr) => {
        this.props.lookBtnClick(dataArr);

    }
}


const styles = StyleSheet.create({
    container: {
        width: 540 * UIMacro.SCREEN_FULL_PERCENT,
        height: 328 * UIMacro.HEIGHT_PERCENT,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 5 * UIMacro.HEIGHT_PERCENT,
        marginLeft: 5 * UIMacro.SCREEN_FULL_PERCENT,
        borderRadius: 5,
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    titleImageStyle: {
        width: 63 * UIMacro.WIDTH_PERCENT,
        height: 15 * UIMacro.WIDTH_PERCENT,
        marginTop: 15,
        marginLeft: 15,

    },
    normalTextStyle: {
        fontSize: 11,
        color: '#CCDBFF',
        marginTop: 10,
    },
    goldTextStyle: {
        fontSize: 11,
        color: '#FFE400',
        marginTop: 10,
    },
    tableBgImageStyle: {
        width: 507 * UIMacro.SCREEN_FULL_PERCENT,
        height: 204 * UIMacro.HEIGHT_PERCENT,
        borderRadius: 5,
        marginTop: 15,
        marginLeft: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    tableTitleViewStyle: {
        flexDirection: 'row',
        width: 480*UIMacro.SCREEN_FULL_PERCENT,
        marginTop: 8 * UIMacro.HEIGHT_PERCENT,
        justifyContent: 'space-between',
        marginBottom: 7 * UIMacro.HEIGHT_PERCENT,

    },
    numTextStyle: {
        width: 160 * UIMacro.SCREEN_FULL_PERCENT,
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
        textAlign: 'center',
        justifyContent:'center',
    },
    teamTableTitleViewStyle: {
        flexDirection: 'row',
        width: 480 * UIMacro.SCREEN_FULL_PERCENT,
        marginTop: 8 * UIMacro.HEIGHT_PERCENT,
        justifyContent: 'flex-start',
        marginBottom: 7 * UIMacro.HEIGHT_PERCENT
    },
    teamTableCellStyle: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems:'center',
        width: 480 * UIMacro.SCREEN_FULL_PERCENT,
        height: 28 * UIMacro.HEIGHT_PERCENT,
        borderRadius: 14 * UIMacro.HEIGHT_PERCENT,
        marginTop: 2 * UIMacro.HEIGHT_PERCENT,
        backgroundColor: '#C39232'
    }


});