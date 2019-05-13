import React, {Component} from 'react'
import {
    View,
    Text,
    StyleSheet,
} from 'react-native'
import SmallPopPage from "../../common/SmallPopPage";
import UIMacro from "../../core/UIMacro";
import TouchableBounce from '../../common/TouchableBounce'
import FastImage from 'react-native-fast-image'

export default class SuccessNewPwdViewPage extends SmallPopPage {
    //标题
    titleImage = ()=> {
        return (
             require('../../static/images/2.1.0/title18.webp')
        )
    }
    handleSure = () =>{
        this.props.isShowBindPhoneNum(false)
        this.closePopView()
    }
    contentView = () =>{
        return(
            <View>
                <View style={styles.sucessText}>
                    <Text style={styles.successtxt}>修改成功</Text>
                </View>
                <View style={styles.sureBtn}>
                    <TouchableBounce onPress={this.handleSure}>
                        <FastImage style={styles.btnClick1}
                                         resizeMode='stretch'
                                         source={ require('../../static/images/2.1.0/btn_menu.webp')}>
                            <Text style={styles.logText1}>确定</Text>
                        </FastImage>
                    </TouchableBounce>
                </View>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    sucessText:{
        marginTop:57*UIMacro.HEIGHT_PERCENT,
        marginLeft:50*UIMacro.WIDTH_PERCENT,
    },
    successtxt:{
        color:'rgba(255, 255, 255, 1)',
        fontSize: 15,
    },
    sureBtn:{
        marginTop:40*UIMacro.HEIGHT_PERCENT,
        marginLeft:20*UIMacro.WIDTH_PERCENT,
    },
    btnClick1: {
        width: 118*UIMacro.WIDTH_PERCENT,
        height: 41*UIMacro.HEIGHT_PERCENT,
    },
    logText1: {
        color: 'rgba(255, 255, 255, 1)',
        fontSize: 15,
        fontWeight: 'bold',
        textAlign: 'center',
        lineHeight: 41*UIMacro.HEIGHT_PERCENT,
    },
})