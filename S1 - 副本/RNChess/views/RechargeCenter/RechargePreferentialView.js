/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 *
 */

import React, {Component} from 'react';
import {StyleSheet, Text, View, Image, ImageBackground} from 'react-native';
import UIMacro from "../../core/UIMacro";
import GBNetWorkService from "../../core/GBNetWorkService";
import TouchableBounce from "../../common/TouchableBounce";
import FastImage from 'react-native-fast-image'


type Props = {};
export default class RechargePreferentialView extends Component<Props> {
    constructor(pros) {
        super(pros);
        this.state = {
            feeStr: 0,
            dataFee:'',
            // preferentialStr: 0,
        }
    }

    componentDidMount() {
        this._isMounted = true;
        const {money, payWay, accountId, txid} = this.props;
        let param = {};
        if (txid.length === 0) {
            param = {
                "result.rechargeAmount": money,
                "depositWay": payWay,
                "account": accountId
            }

        } else {
            //比特币
            param = {
                "result.bitAmount": money,
                "depositWay": payWay,
                "result.bankOrder": txid,
                "account": accountId
            }


        }
        GBNetWorkService.post("mobile-api/depositOrigin/seachSale.html", param, null, this._preferentialSuccess, this._referentialFail)
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    _preferentialSuccess = (json) => {
        if (Object.keys(json).length > 0) {
            console.log("手续费的数据"+JSON.stringify(json))
            if(json.data  && json.data.msg){
                if (json.code === '0') {
                    if (json.data.fee===undefined || json.data.fee === null){
                        this.setState({feeStr:"手续费: "+ json.data.msg})
                    } else
                    {
                        if (json.data.fee > 0) {
                            this.setState({feeStr: "优惠: " +json.data.counterFee})
                        } else if (json.data.fee < 0) {
                            this.setState({feeStr: "手续费: "+json.data.counterFee})
                        } else if (json.data.fee == 0) {
                            this.setState({feeStr:"手续费: "+ json.data.msg})
                        }
                    }
                }
            }
        }
    }
    _referentialFail = (json) => {


    }

    render() {
        const {money, txid} = this.props;
        let str1 = txid.length === 0 ? "金 额: ￥" + money : "金 额: " + money
        return (
            <View style={styles.container}>
                <FastImage style={styles.contentStyle} source={require('../../static/images/2.1.0/popups_prompt.webp')}>
                    <View style={styles.topImage}>
                            <FastImage style={{marginTop:10,width:40*UIMacro.HEIGHT_PERCENT,height:17.5*UIMacro.HEIGHT_PERCENT}} source={require('../../static/images/2.1.0/title03.webp')}/>
                            <TouchableBounce
                                style={{position: 'absolute',
                                    right:-17,}}
                                activeOpacity={1}
                                onPress={() => {
                                    this.props.setModalVisible(!this.props.modalVisible);
                                }}
                            >
                                    <FastImage
                                        style={styles.closeImage}
                                        resizeMode='stretch'
                                        source={require('../../static/images/2.1.0/close.webp')}
                                    />
                            </TouchableBounce>
                    </View>
                     <View style={styles.subContentViewStyle}>
                         <Text style={{fontSize: 15,
                             color: 'white',
                             position:'absolute',
                             top: 25 * UIMacro.HEIGHT_PERCENT,
                             left:90*UIMacro.WIDTH_PERCENT,}}>
                             {str1}
                         </Text>
                         <Text style={{
                             fontSize: 15,
                             color: 'white',
                             position: 'absolute',
                             top: 50 * UIMacro.HEIGHT_PERCENT,
                             left: 90 * UIMacro.WIDTH_PERCENT
                         }}>
                             {this.state.feeStr}
                         </Text>

                         <TouchableBounce onPress={() => {
                             this._submitBtnClick()
                         }}>
                             <FastImage source={(require("../../static/images/2.1.0/btn_menu.webp"))} style={styles.submitBtnStyle}>
                                 <Text style={{fontSize: 18, color: 'white'}}>确定</Text>
                             </FastImage>
                         </TouchableBounce>
                     </View>
                </FastImage>
            </View>
        );
    }

    _submitBtnClick = () => {
        this.props.preferentialSubmitBtnCllick(false);

    }

}
const styles = StyleSheet.create({
    container:{
        position:'absolute',
        right: 80*UIMacro.WIDTH_PERCENT,
        top:15*UIMacro.HEIGHT_PERCENT,
        justifyContent:'center',
        alignItems:'center',
    },
    contentStyle: {
        flexDirection: 'column',
        justifyContent:'space-between',
        alignItems: 'center',
        height: 255 * UIMacro.HEIGHT_PERCENT - 10,
        width:320*UIMacro.WIDTH_PERCENT,
    },
    submitBtnStyle: {
        width: 118* UIMacro.WIDTH_PERCENT,
        height: 40* UIMacro.WIDTH_PERCENT,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 18 * UIMacro.HEIGHT_PERCENT,
    },
    topImage:{
        width:320*UIMacro.WIDTH_PERCENT,
        height:40*UIMacro.HEIGHT_PERCENT,
        flexDirection:'row',
        justifyContent: 'center',
    },
    closeImage: {
        width:40*UIMacro.WIDTH_PERCENT,
        height:40*UIMacro.HEIGHT_PERCENT,

    },
    subContentViewStyle:{
        width:300*UIMacro.WIDTH_PERCENT,
        height:180*UIMacro.HEIGHT_PERCENT,
        flexDirection:'column',
        justifyContent: 'flex-end',
        alignItems:'center',
    }


});
