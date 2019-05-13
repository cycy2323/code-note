/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Image, View,FlatList,Dimensions,Text,DeviceEventEmitter} from 'react-native';
import GBServiceParam from "../../core/GBServiceParam";
import FastImage from 'react-native-fast-image'
import UIMacro from "../../core/UIMacro";
import ImageUrlManager from "../../core/ImageUrlManager";
import TouchableBounce from "../../common/TouchableBounce";

const ITEM_WIDTH=120*UIMacro.WIDTH_PERCENT;
const ITEM_HEIGHT=107.5*UIMacro.HEIGHT_PERCENT;

type Props = {};
export default class GameListView extends Component<Props> {

    render() {
        const {dataArray,pageType}=this.props;
        return (
            <View style={styles.container}>
                    <FlatList
                        data={dataArray}
                        renderItem={({item})=>(<GameListViewItem item={item} pageType={pageType}/>)}
                        extraData={this.state}
                        keyExtractor={(item,index)=>index.toString()}
                        horizontal={true}
                        scrollEnabled={false}
                    />
            </View>
        );
    }
}

class GameListViewItem extends Component<Props>{

    render(){
        const {item,pageType}=this.props;
        return(
            <TouchableBounce onPress={()=>{this._pressClick()}}>
               <View style={styles.itemStyle}>
                   {this._imageRender(item)}
               </View>
            </TouchableBounce>
        )
    }
    _imageRender=(item)=>{
        if(item){
            let  array=[];
            let imageUrl = item.cover.replace("null","2x")
            let url ;
            url = ImageUrlManager.dealURI(imageUrl);
            array.push(<View style={{width:ITEM_WIDTH,
                height:ITEM_HEIGHT}} key={item.cover}>
                <FastImage source={{uri:url,headers: {Host: GBServiceParam.currentHost},
                    priority: FastImage.priority.normal,}}
                           resizeMode='stretch'
                           style={{width:ITEM_WIDTH,
                               height:ITEM_HEIGHT,}}
                           key={item.cover}/>
                {this._borderImageView(item)}
            </View>)

            return array;
        }
    }
    _borderImageView=(item)=>{
        let viewArray=[]
        if (item.type==='game' && item.apiTypeId === 2){
            viewArray.push( <FastImage source={require('../../static/images/2.1.0/game_deco.webp')}
                                       style={styles.thirdPageImageStyle}
                                       resizeMode='stretch'
                                       key={item.gameLink}
            />)
            viewArray.push(<View style={{alignItems: 'center'}}
                                 key={item.gameLink+'1'}
            >
                <Text style={styles.thirdPageGameNameStyle}>{item.name.length>4?item.name.substr(0,3)+'...':item.name}</Text>
            </View>)
        }
        return viewArray;
    }
    _pressClick=()=>{
        const {item,pageType}=this.props;
        //发送通知
        DeviceEventEmitter.emit('itemClick',item,pageType);
    }



}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        height:ITEM_HEIGHT+10,
    },
    itemStyle:{
        width:ITEM_WIDTH,
        height:ITEM_HEIGHT,
        marginLeft: 8,
        alignItems: 'center'
    },
    thirdPageImageStyle:{
        width:ITEM_WIDTH,
        height:ITEM_HEIGHT,
        position:'absolute',
        top:0,
        left:0,
    },
    thirdPageGameNameStyle:{
        position:'absolute',
        bottom:5,
        color:'white',
        fontSize:13,
    }

});
