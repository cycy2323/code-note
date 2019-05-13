import {Component} from "react";
import {
    StyleSheet,
    Text,
    View
} from 'react-native';
import React from "react";
import Orientation from "react-native-orientation";
import UIMacro from '../../core/UIMacro'
import MyShareView from './MyShareView'
import  MyRewardsView from './MyRewardsView';
import AllPromotionView from './AllPromotionView'
import RewardDetailView from './RewardDetailView'
import RewardDetailPopView from './RewardDetailPopView'
import TeamRecordView from './TeamRecordView'
import UserInfo from "../../core/UserInfo";
import TouchableBounce from "../../common/TouchableBounce";
import FastImage from 'react-native-fast-image'


type Props = {};
export default class AllPeoplePromotionPage extends Component<Props> {

    constructor(pros) {
        super(pros);
        this.state = {
            selectIndex:0,
            shareUserNum:0, //直接推荐玩家
            preDayRecommendMonty:0, //昨天推荐奖励（直接注册）
            preDayShareMoney:0, //昨天红利数（投注）
            detailDataArr:[],
        }
    };

    componentWillMount()
    {
    }

    componentDidMount() {

    }

    componentWillUnmount(){

    }

    loadTopData=(shareUserNum,preDayRecommendMonty,preDayShareMoney)=>{
        this.setState({
            shareUserNum:shareUserNum===null?0:shareUserNum,
            preDayRecommendMonty:preDayRecommendMonty===null?0:preDayRecommendMonty,
            preDayShareMoney:preDayShareMoney===null?0:preDayShareMoney,
        })
    }

    render() {
        return (
            <FastImage style={styles.container}
                             source={require('../../static/images/2.1.0/bg_promotion.webp')}>
                <FastImage
                    style={styles.titleImageBackgoundStyle}
                    source={require('../../static/images/2.1.0/topbg_promotion.webp')}
                    resizeMode='stretch'
                >
                    <TouchableBounce onPress={this._backBtnClick}>
                        <FastImage
                            source={require('../../static/images/2.1.0/btn_back.webp')}
                            style={styles.backImageStyle}
                        />
                    </TouchableBounce>
                    <Text style={{fontSize:10,color:'#FFE71F',marginLeft: 20*UIMacro.WIDTH_PERCENT}}>
                        直属下级人数：{this.state.shareUserNum} 人  昨日推荐奖励：{UserInfo.isDot(this.state.preDayRecommendMonty)}&nbsp;&nbsp;
                           昨日红利奖励：{UserInfo.isDot(this.state.preDayShareMoney)}
                    </Text>
                    <FastImage source={require('../../static/images/2.1.0/title_promotion.webp')}
                           style={styles.titileImageStyle}
                           resizeMode='contain'
                    />
                </FastImage>
                <View style={styles.contentViewStyle}>
                    <FastImage style={styles.leftBgImageStyle} source={require('../../static/images/2.1.0/bg_leftmenu.webp')}>
                        <View style={{marginTop:14*UIMacro.HEIGHT_PERCENT }}>
                            {this._leftView()}
                        </View>

                    </FastImage>
                    {this.state.selectIndex===0
                    &&<MyShareView setTopValue={this.loadTopData} />
                    }
                    {
                        this.state.selectIndex===1&&<AllPromotionView/>
                    }
                    {
                        this.state.selectIndex===2&&<RewardDetailView lookBtnClick={this._rewardDetailLookBtnClick}


                        />
                    }
                    {this.state.selectIndex===3
                    &&<MyRewardsView/>
                    }
                    {this.state.selectIndex===4
                    &&<TeamRecordView/>
                    }

                </View>
                <RewardDetailPopView ref={(c)=>this.rewardDetailPopView=c} dataArr={this.state.detailDataArr}/>
            </FastImage>
        )
    }
    _backBtnClick=()=>{
        const {navigation} = this.props;
        navigation.pop();
    }
    _leftView=()=>{
        let titles=["我的分享","全民推广","奖励详细","我的奖励","团队记录"];
        let viewArray=[];
        for (let i = 0; i < titles.length; i++) {
            if (i===this.state.selectIndex){
                viewArray.push(<FastImage source={require("../../static/images/2.1.0/btn_promotion_click.webp")}
                                                style={styles.selectedBtnStyle} key={i}>
                    <TouchableBounce onPress={() => {
                        this._btnClick(i)
                    }} style={styles.btnStyle}>
                        <Text style={styles.btnTextStyle}>{titles[i]}</Text>
                    </TouchableBounce>
                </FastImage>)

            } else {
                viewArray.push(<FastImage source={require("../../static/images/2.1.0/btn_promotion.webp")}
                                                style={styles.normalBtnStyle} key={i}>
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
    _btnClick=(i)=>{
       this.setState({
           selectIndex:i,
       })
    }
    _rewardDetailLookBtnClick=(dataArr)=>{
        this.setState({
            detailDataArr:dataArr,
        })
        this.rewardDetailPopView.showPopView()

    }
}


const styles = StyleSheet.create({
    container: {
        flex:1,
        flexDirection:'column',
    },
    titleImageBackgoundStyle:{
        width: '100%',
        height: 42*UIMacro.HEIGHT_PERCENT,
        flexDirection: 'row',
        justifyContent:'space-between',
        alignItems:'center',
    },
    backImageStyle:{
        width:32*UIMacro.SCREEN_FULL_PERCENT,
        height:21*UIMacro.HEIGHT_PERCENT,
        marginLeft: 20*UIMacro.SCREEN_FULL_PERCENT,
    },
    titileImageStyle:{
        width:110*UIMacro.SCREEN_FULL_PERCENT,
        height: 30*UIMacro.HEIGHT_PERCENT,
        marginRight: 14*UIMacro.SCREEN_FULL_PERCENT,
    },
    contentViewStyle:{
        width:'100%',
        height:UIMacro.SCREEN_HEIGHT-42*UIMacro.HEIGHT_PERCENT,
        flexDirection:'row',
    },
    leftBgImageStyle:{
        width:117*UIMacro.SCREEN_FULL_PERCENT,
        height:'100%',
        justifyContent: 'flex-start',
        zIndex: 100
    },
    normalBtnStyle:{
        width:112*UIMacro.SCREEN_FULL_PERCENT,
        height:41*UIMacro.HEIGHT_PERCENT,
        marginTop:3*UIMacro.HEIGHT_PERCENT,

    },
    selectedBtnStyle:{
        width:118*UIMacro.SCREEN_FULL_PERCENT,
        height:41*UIMacro.HEIGHT_PERCENT,
        marginTop:3*UIMacro.HEIGHT_PERCENT,
    },
    btnStyle:{
        width:112*UIMacro.SCREEN_FULL_PERCENT,
        height:41*UIMacro.HEIGHT_PERCENT,
        justifyContent:'center',
        alignItems:'center'
    },
    btnTextStyle:{
        fontSize:15,
        color:'white',
    },
});