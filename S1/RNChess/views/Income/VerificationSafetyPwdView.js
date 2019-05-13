/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */
import {
    StyleSheet,
    Text,
    View,
    TextInput,
} from 'react-native';
import FastImage from 'react-native-fast-image'

import SmallPopPage from "../../common/SmallPopPage";
import UIMacro from '../../core/UIMacro' ;
import UserInfo from "../../core/UserInfo";
import GBNetWorkService from "../../core/GBNetWorkService";
import  IncomeTipView from './IncomeTipView' ;
import SkinsColor from "../../core/SkinsColor";
import TouchableBounce from "../../common/TouchableBounce";



type Props = {};
export default class VerificationSafetyPwdView extends SmallPopPage<Props> {

    constructor() {
        super();
        this.state = {
            ...this.state,
            tipTextValue:'',
            isSuccessWithDraw:false,
            password:'',
            dataArr:[],
        }
    }

    renderPage = () => {
        return (
            [<IncomeTipView ref={(c) => this.IncomeTipView = c} tipTextValues={this.state.tipTextValue} key={1}
                            closeVerificationView={this.closePage}
            />]
        )
    }

    pageDidShow = ()=>{
        this.setState({
            dataArr:this.props.OutDetailArrs,
        })
    }

    closePage=()=>{
        this.props.closeOutDetailView();
        this.closePopView();

    }

    pageDidClose = ()=>{

    }
    //失去焦点
    loadBlur = (input) => {
        input.blur()
    }

    //用于自定义内容视图
    contentView = () => {
        return (
            <View style={styles.playerContainer}>
                    <View style={styles.playerContent}>
                        <Text style={styles.playerText1}>尊敬的玩家：</Text>
                        <Text style={styles.playerText2}>为保护您的账户和资金安全，请输入您的安全密码进行一次完整的验证。</Text>
                        <TextInput
                            style={styles.textInputPlayer}
                            value={this.state.password}
                            secureTextEntry={true}
                            onChangeText={(password) => this.setState({password: password.substr(0, 6)})}
                            ref={(c) => this.playerText1 = c}
                            onEndEditing={() => {
                                this.loadBlur(this.playerText1)
                            }}
                        />
                    </View>
                <TouchableBounce onPress={this.handleNextVerification}>
                    <FastImage style={styles.btnClick}
                                     resizeMode='stretch'
                                     source={require('../../static/images/2.1.0/btn_menu.webp')}>
                        <Text style={styles.logText}>确定</Text>
                    </FastImage>
                </TouchableBounce>
            </View>
        )
    }

    //安全密码验证
    handleNextVerification = () => {
        if (this.state.password === '' || this.state.password == null) {
            this.setState({
                tipTextValue: '请输入安全密码',
            },this.IncomeTipView.showPopView)
            return;
        }
        let amount = this.state.dataArr[1];
        let params = {
            'withdrawAmount': amount,
            'originPwd': this.state.password,
            'remittanceWay': '1',
            'gb.token': UserInfo.saftyKoken,
        };
        GBNetWorkService.post('mobile-api/withdrawOrigin/submitWithdraw.html', params, null, this.successVerificaSafetyPassWord, this.failVerificaSafetyPassWord);
    }

    successVerificaSafetyPassWord = (json) => {
        this.setState({
            password:''
        })
        //确认出币验证安全密码
        if (parseInt(json.code) === 0) {

            this.setState({
                tipTextValue: '出币成功',
            },this.IncomeTipView.showPopView)
            // isSuccessWithDraw: true,

        } else {
            this.setState({
                tipTextValue: json.message === '请求成功' ? '出币成功' : json.message
            },this.IncomeTipView.showPopView)
        }
        if(json.data && json.data.token){
            UserInfo.saftyKoken = json.data.token;
        }

        if (parseInt(json.code) === 1404) {  //未设置安全密码
            this.setState({
                tipTextValue: '未设置安全密码',
                password:''
            },this.IncomeTipView.showPopView) ;
        }

        console.log('successVerificaSafetyPassWord:' + JSON.stringify(json));
    }

    failVerificaSafetyPassWord = (json) => {
        this.setState({
            tipTextValue: '出币失败',
            password:''
        },this.IncomeTipView.showPopView) ;
        console.log('failVerificaSafetyPassWord:' + JSON.stringify(json));
    }


    //提示
    titleImage = () => {
        return require('../../static/images/2.1.0/title03.webp')
    }
}

const styles = StyleSheet.create({
    playerContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 321 * UIMacro.WIDTH_PERCENT,
        height: 180 * UIMacro.HEIGHT_PERCENT,
    },
    playerContent: {
        flex: 1,
        justifyContent: 'center',
        marginLeft: 43 * UIMacro.WIDTH_PERCENT,
        marginRight: 44 * UIMacro.WIDTH_PERCENT,
    },
    playerText1: {
        color: '#fff',
        fontSize: 12,
        marginTop: 5 * UIMacro.HEIGHT_PERCENT,
    },
    playerText2: {
        color: '#fff',
        fontSize: 12,
    },
    textInputPlayer: {
        backgroundColor: SkinsColor.bgTextViewStyle_bg,
        borderRadius: 5,
        color: '#AAAAA8',
        fontSize: 12,
        height: 30 * UIMacro.HEIGHT_PERCENT,
        marginTop: 11 * UIMacro.HEIGHT_PERCENT,
        justifyContent: 'center',
    },
    btnClick: {
        width: 118 * UIMacro.WIDTH_PERCENT,
        height: 41 * UIMacro.HEIGHT_PERCENT,
        marginBottom:20*UIMacro.HEIGHT_PERCENT,
        justifyContent: 'center',
    },
    logText: {
        color: '#fff',
        fontSize: 15,
        textAlign: 'center',
    },
});


