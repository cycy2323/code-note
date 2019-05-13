/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, View,ScrollView} from 'react-native';
import GameListView from './GameListView'
import UIMacro from "../../core/UIMacro";
import TouchableBounce from "../../common/TouchableBounce";
import FastImage from 'react-native-fast-image'
import {Image} from "react-native-animatable";


const ITEM_WIDTH=114*UIMacro.WIDTH_PERCENT;
const ITEM_HEIGHT=100*UIMacro.HEIGHT_PERCENT;
let dataJsonArray=[];

type Props = {};
export default class GameSecondScrollView extends Component<Props> {
    constructor(props){
        super(props);
        this.state = {
            //记录当前偏移量
            currentOffSet :0,
        };
    }

    render() {

        return (
            <View style={{flex: 1,
                height:ITEM_HEIGHT*2+2*20}}>
                <ScrollView
                    ref={(scrollView)=>{this.scrollView=scrollView}}
                    onMomentumScrollEnd={(e)=>this.onAnimationEnd(e)}
                    contentContainerStyle = {{flexDirection:'column'}}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    alwaysBounceVertical={false}
                    bounces={false}
                    pagingEnabled={true}
                >
                    {this._renderScrollMethod()}
                </ScrollView>
                {this._renderRightBtn()}
                {this._renderLeftBtn()}
            </View>
        );
    }

    _renderScrollMethod=()=>{
        const {datas}=this.props;
        dataJsonArray = Array.from(datas)
        let data1=[];
        let data2=[];
        for (let i =0;i<dataJsonArray.length;i++) {
            if (i%2===0){
                data1.push(dataJsonArray[i]);
            } else {
                data2.push(dataJsonArray[i]);
            }
        }
        if(data1.length>data2.length){
            data1.push('');
            data1.push('')
        }else if(data1.length=data2.length){
            data2.push('');
            data2.push('')
        }else{
            data2.push('');
            data2.push('')
        }
        let viewArray=[];
        viewArray.push(<GameListView dataArray={data1} key={0} pageType={this.props.pageType}/>)
        viewArray.push(<GameListView dataArray={data2} key={1} pageType={this.props.pageType}/>)
        return viewArray;

    }
    _renderRightBtn=()=>{
        let array=[];
        const {currentOffSet}=this.state;
        let num =parseInt(dataJsonArray.length/2.0);
        if (dataJsonArray.length%2===1){
            num=parseInt(dataJsonArray.length/2.0)+1;

        }
        if (currentOffSet+num*(ITEM_WIDTH+13)>UIMacro.SCREEN_WIDTH&&currentOffSet+UIMacro.SCREEN_WIDTH<num*(ITEM_WIDTH+13)-50) {
            array.push(<TouchableBounce style={styles.rightBtnStyle} onPress={()=>{this.rightBtnClick()}} key={'right'}>
                <Image source={require("../../static/images/2.1.0/arrow_next.png")}/>
            </TouchableBounce>)

        }
        return array;

    }
    rightBtnClick=()=>{
        let num =parseInt(dataJsonArray.length/2.0);
        if (dataJsonArray.length%2===1){
            num=parseInt(dataJsonArray.length/2.0)+1;

        }
        if (this.state.currentOffSet+2*UIMacro.SCREEN_WIDTH<num*(ITEM_WIDTH+13)){
            this.scrollView.scrollTo({x:this.state.currentOffSet+UIMacro.SCREEN_WIDTH,y:0,animated:true});
            this.setState(preState=>({currentOffSet:preState.currentOffSet+UIMacro.SCREEN_WIDTH}));
        }else {
            this.scrollView.scrollTo({x:num*(ITEM_WIDTH+13)-UIMacro.SCREEN_WIDTH,y:0,animated:true});
            this.setState(preState=>({currentOffSet:num*(ITEM_WIDTH+13)-UIMacro.SCREEN_WIDTH}));
        }


    }

    _renderLeftBtn=()=>{
        let array=[]
        const {currentOffSet}=this.state;
        if (currentOffSet>=ITEM_WIDTH+13) {
            array.push(<TouchableBounce style={styles.leftBtnStyle} onPress={()=>{this.leftBtnClick()}} key={'left'}>
                <Image source={require("../../static/images/2.1.0/arrow_prev.png")}/>
            </TouchableBounce>)

        }
        return array;


    }
    leftBtnClick=()=>{
        if (this.state.currentOffSet<UIMacro.SCREEN_WIDTH){
            this.scrollView.scrollTo({x:0,y:0,animated:true});
            this.setState(preState=>({currentOffSet:0}));
        }else {
            this.scrollView.scrollTo({x:this.state.currentOffSet-UIMacro.SCREEN_WIDTH,y:0,animated:true});
            this.setState(preState=>({currentOffSet:preState.currentOffSet-UIMacro.SCREEN_WIDTH}));
        }

    }
    onAnimationEnd(e){
        // 获取滑动的偏移量
        this.setState({
            currentOffSet:e.nativeEvent.contentOffset.x,
        });

    }
    componentWillUnmount(){
        this.props.secondCallBack(this.state.currentOffSet);
    }
    componentDidMount(){

        this.scrollView.scrollTo({x:this.props.offset,y:0,animated:true});
    }

}


const styles = StyleSheet.create({
    rightBtnStyle:{
        position: 'absolute',
        right: 30,
        top:ITEM_HEIGHT,
    },
    leftBtnStyle:{
        position: 'absolute',
        left: 17,
        top:ITEM_HEIGHT,
    }
});
