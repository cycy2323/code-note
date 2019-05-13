import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    Linking,
} from 'react-native';
import UserInfo from "../../core/UserInfo";
import GBNetWorkService from "../../core/GBNetWorkService";
import SmallPopPage from '../../common/SmallPopPage'
import UIMacro from '../../core/UIMacro'
import TouchableBounce from '../../common/TouchableBounce'
import FastImage from 'react-native-fast-image'

export default class NoBindPhonePage extends SmallPopPage<Props> {
    constructor(pros) {
        super(pros);
        this.state = {
            ...this.state,
            isNoBindPhoneToFindPwd:false,  //未开启手机找回密码
        }
    }

    //标题
    titleImage = ()=> {
        return ( require('../../static/images/2.1.0/title03.webp'))
    }

    /*联系客服：跳转到外部浏览器*/
    customerService = () => {
        if (UserInfo.customerUrl&&UserInfo.customerUrl.length>0){
            Linking.openURL(UserInfo.customerUrl);
        } else
        {
            GBNetWorkService.get("mobile-api/origin/getCustomerService.html", null, null, this._customerServiceSuccessBack,
                this._customerServiceFailBack)
        }
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

//重写弹窗内容
    contentView = () => {
        return(
            <View style={styles.messageView}>
                <View style={styles.messageTxt1}>
                    <Text style={styles.mesText}>未开启找回密码功能，请联系</Text>
                    <TouchableBounce onPress={this.customerService}>
                        <Text style={styles.zxkefu}>在线客服</Text>
                    </TouchableBounce>
                </View>
                <View style={styles.btn}>
                    <TouchableBounce onPress={()=>this.closePopView()} style={styles.next}>
                        <FastImage style={styles.btnClick}
                                         resizeMode='stretch'
                                         source={ require('../../static/images/2.1.0/btn_menu.webp')}>
                            <Text style={styles.logText}>确定</Text>
                        </FastImage>
                    </TouchableBounce>
                </View>
            </View>
        )
    }
}
const styles=StyleSheet.create({

    messageView:{
        justifyContent:'center',
        alignItems: 'center',
        // backgroundColor: 'rgba(0, 0, 0, .2)',
    },
    messageTxt1:{
        width:UIMacro.WIDTH_PERCENT*298,
        height:UIMacro.HEIGHT_PERCENT*116,
        marginTop:UIMacro.HEIGHT_PERCENT*30,
        alignItems:'center',
        justifyContent:'center',
        flexDirection: 'row'
    },
    mesText:{
        color:'#fff',
        textAlign:'center',
        fontSize:15,
        marginLeft: 10*UIMacro.WIDTH_PERCENT
    },
    btn:{
        flexDirection: 'row',
        justifyContent:'center',
        alignItems: 'center',
    },
    btnClick: {
        width: 118 * UIMacro.WIDTH_PERCENT,
        height: 41 * UIMacro.HEIGHT_PERCENT,
        marginLeft: 7 * UIMacro.WIDTH_PERCENT,
        // marginTop: 10 * UIMacro.HEIGHT_PERCENT,
        justifyContent: 'center',
    },
    logText: {
        color: '#fff',
        fontSize: 15,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    zxkefu:{
        fontSize:15,
        color:'#FFEA00',
        borderBottomWidth: 1,
        borderBottomColor:'#FFEA00'
    },

})