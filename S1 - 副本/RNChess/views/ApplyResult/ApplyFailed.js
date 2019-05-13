/**
 * @lemon
 */

import React, {Component} from 'react';
import {StyleSheet, View, Text, Linking, Dimensions} from 'react-native';
import GBNetWorkService from "../../core/GBNetWorkService";
import BigPopPage from "../../common/BigPopPage";
import UIMacro from "../../core/UIMacro";
import SkinsColor from "../../core/SkinsColor";
import TouchableBounce from "../../common/TouchableBounce";
import FastImage from 'react-native-fast-image'

export default class ApplyFailed extends BigPopPage {
    //标题
    titleImage = ()=> {
        return require('../../static/images/2.1.0/title21.webp')
    }
    /*跳转到外部浏览器*/
    customerService = () => {
        GBNetWorkService.get("mobile-api/origin/getCustomerService.html", null, null, this._customerServiceSuccessBack, this._customerServiceFailBack)
    };
    _customerServiceSuccessBack = (json) => {
        console.log("成功:" + JSON.stringify(json));
        if(json.data && json.data.customerUrl){
            Linking.openURL(json.data.customerUrl)
        }
    };
    _customerServiceFailBack = (json) => {
        console.log("失败:" + JSON.stringify(json))
    };
    // //参与状态
    // hasApplyStatus = () =>{
    //     if(this.props.applyRes.hasApply===true){
    //         return <View style={styles.kefu}>
    //             <Text style={styles.text4}>已参与</Text>
    //         </View>
    //     }else{
    //         return <View style={styles.kefu1}>
    //         </View>
    //     }
    // }
    //重写弹窗内容
    contentView = () => {
        return (
            <View style={styles.container}>
                <View style={styles.content}>
                    <FastImage source={require('../../static/images/2.1.0/error.webp')} style={styles.success}/>
                    <View style={styles.successText}>
                        {/*<Text style={styles.text1}>无响应！ （错误代码：404）</Text>*/}
                        {/*<Text numberOfLines={2} style={styles.text2}>很抱歉！ 当时网络不稳定，无法连接到服务器，请检查本地网络设备是否已断开链接！</Text>*/}
                        <Text style={styles.text1}>《{this.props.applyRes.actibityTitle}》 </Text>
                        <Text style={styles.text2}>{this.props.applyRes.applyResult}</Text>
                    </View>
                </View>
                <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                    <TouchableBounce onPress={this.customerService} style={styles.kefu}>
                        <Text style={styles.text4}>联系客服</Text>
                    </TouchableBounce>
                    {/*<Text style={{color:'#fff'}}>{this.props.applyRes.tips}</Text>*/}
                    <View style={styles.kefu1}> </View>
                </View>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        marginTop:8*UIMacro.WIDTH_PERCENT,
        borderRadius: 5,
        height: 293 * UIMacro.HEIGHT_PERCENT,
        backgroundColor: 'rgba(0,0,0,0.2)',
        width: 450 * UIMacro.WIDTH_PERCENT,
    },
    content:{
        // width:465*UIMacro.WIDTH_PERCENT,
        height:245*UIMacro.HEIGHT_PERCENT,
        marginLeft:6* UIMacro.HEIGHT_PERCENT,
        flexDirection:'row',
        width: (485-16)* UIMacro.HEIGHT_PERCENT,
    },
    success:{
        width:50*UIMacro.HEIGHT_PERCENT,
        height:50*UIMacro.HEIGHT_PERCENT,
        marginTop: 24*UIMacro.HEIGHT_PERCENT,
        marginLeft: 24*UIMacro.WIDTH_PERCENT,
        opacity: 1
    },
    successText:{
        width:355*UIMacro.WIDTH_PERCENT,
        marginTop: 23*UIMacro.HEIGHT_PERCENT,
        marginLeft: 16*UIMacro.WIDTH_PERCENT,
        textAlign: 'center',
    },
    text1:{
        color:'#fff',
        fontSize:16,
        // marginLeft:-4*UIMacro.WIDTH_PERCENT,
    },
    text2:{
        color:'#fff',
        fontSize:13,
        marginTop:5*UIMacro.HEIGHT_PERCENT,
    },
    text3:{
        color:'#2DE614',
        fontSize: 16,
        marginTop:18*UIMacro.HEIGHT_PERCENT,
    },
    kefu:{
        width:93*UIMacro.WIDTH_PERCENT,
        height:30*UIMacro.HEIGHT_PERCENT,
        backgroundColor: SkinsColor.shadowColor,
        borderWidth:0.4,borderColor: SkinsColor.bgTextViewStyle_border,
        marginTop:5*UIMacro.HEIGHT_PERCENT,
        borderRadius:15,
        marginLeft:10*UIMacro.WIDTH_PERCENT,
        color:'#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    kefu1:{
        width:93*UIMacro.WIDTH_PERCENT,
    },
    text4:{
        color:'#fff',
        textAlign: 'center',
        fontWeight:'bold',
        fontSize:15,
    },
});