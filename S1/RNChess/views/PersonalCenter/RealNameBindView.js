/**
 * @lemon
 */

import React, {Component} from 'react';
import {StyleSheet, View, Text, TextInput, ImageBackground, Alert,} from 'react-native';
import UIMacro from "../../core/UIMacro";
import GBNetWorkService from "../../core/GBNetWorkService";
import UserInfo from "../../core/UserInfo";
import Toast from '../../common/ToastView' ;
import SmallPopPage from "../../common/SmallPopPage";
import TouchableBounce from "../../common/TouchableBounce";
import SkinsColor from "../../core/SkinsColor";
import FastImage from 'react-native-fast-image';

export default class RealNameBindView extends SmallPopPage {
    constructor(pros) {
        super(pros);
        this.state = {
            ...this.state,
            realName:"",
        }
    };

    confirmName = () => {
        let restName = /^[\u4e00-\u9fa5A-Za-z_\.]{2,30}$/;
        if (this.state.realName.length === 0) {
            this.refs.toast.show('请输入真实姓名')
            return;
        }
        if(!restName.test(this.state.realName)){
            // 提示
            this.refs.toast.show('请输入2-30个字符（由汉字、大小写英文字母、“.”组成）')
            return
        }
        let param = {'realName': this.state.realName};
        GBNetWorkService.post("mobile-api/mineOrigin/setRealName.html", param, null, this._realNameSuccessBack, this._realNameFailBack)

    };
    _realNameSuccessBack = (json) => {
        if (json.success) {
            UserInfo.realName = this.state.realName;
            UserInfo.hasRealName = true;
            this.refs.toast.show('真实姓名设置成功')
            this.closePopView()
        }
    };
    _realNameFailBack = (json) => {
        this.refs.toast.show('真实姓名设置失败')
    };
    //失去焦点
    loadBlur=(input)=> {
        input.blur()
    }
    renderPage=()=>{
         return  (<Toast
                ref="toast"
                style={{backgroundColor: 'white',marginTop:220*UIMacro.HEIGHT_PERCENT,position:'absolute'}}
                fadeInDuration={300}
                fadeOutDuration={300}
                opacity={1}
                textStyle={{color: 'black'}}
            />)
    }
    titleImage=()=>{
       return  require('../../static/images/2.1.0/title17.webp')
    }

    contentView=()=>{
        return (
            <View style={styles.showViewCont}>
                <View style={styles.tip}>
                    <Text style={styles.tipText}>请填写真实姓名，真实姓名将用于绑定福利卡号，
                        绑定成功后才可申请出币！一旦设置后不可修改。</Text>
                    <View style={styles.nameInput}>
                        <Text style={styles.nameText}>真实姓名</Text>
                        <TextInput placeholder=''
                                   placeholderTextColor='#AAAAA8'
                                   style={styles.PersonalInput}
                                   ref={(c)=>this.PersonalInput=c}
                                   onEndEditing={()=>{this.loadBlur(this.PersonalInput)}}
                                   onChangeText={(msg)=>{this.setState({realName:msg})}}
                                   value={this.state.realName}
                        />
                    </View>
                </View>
                <TouchableBounce onPress={this.confirmName} style={styles.confirmBtn}>
                    <FastImage
                        style={styles.confirmBtnImage}
                        resizeMode='contain'
                        source={require('../../static/images/2.1.0/btn_general.webp')}>
                        <Text style={styles.confirmText}>确定</Text>
                    </FastImage>
                </TouchableBounce>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    showViewCont: {
        width: UIMacro.WIDTH_PERCENT * 310,
        alignItems: 'center',
    },
    tip: {
        width: UIMacro.WIDTH_PERCENT * 296,
        height: UIMacro.HEIGHT_PERCENT * 117,
        borderRadius:10,
        backgroundColor:'rgba(0,0,0,0)',
        marginTop:UIMacro.HEIGHT_PERCENT *13,
        alignItems:'center'
    },
    tipText: {
        color:'#fff',
        fontSize:10,
        marginLeft:UIMacro.WIDTH_PERCENT *12,
        marginRight:UIMacro.WIDTH_PERCENT *12,
        marginTop:UIMacro.HEIGHT_PERCENT *13,
        marginBottom: UIMacro.HEIGHT_PERCENT *10
    },
    confirmBtn: {
        alignItems:'center',
        marginTop:-20,
    },
    confirmBtnImage: {
        width: 117.5 * UIMacro.HEIGHT_PERCENT,
        height: 41.5 * UIMacro.HEIGHT_PERCENT,
    },
    confirmText: {
        color: '#fff',
        fontSize: 15,
        fontWeight: 'bold',
        textAlign: 'center',
        height: 41.5 * UIMacro.HEIGHT_PERCENT,
        lineHeight: 41.5 * UIMacro.HEIGHT_PERCENT
    },
    nameInput: {
        flexDirection: 'row',

    },
    nameText: {
        lineHeight: UIMacro.HEIGHT_PERCENT *33,
        color:'#fff',
        fontSize:14,
    },
    PersonalInput:{
        backgroundColor:SkinsColor.bgTextViewStyle_bg,
        height:UIMacro.HEIGHT_PERCENT*35,
        width:202*UIMacro.WIDTH_PERCENT,
        borderRadius:5,
        marginLeft:10*UIMacro.WIDTH_PERCENT,
        color: '#fff',
        padding:0,
        paddingLeft: 10
    },
});