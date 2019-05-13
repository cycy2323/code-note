import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    DeviceEventEmitter,
} from 'react-native';
import LoginView from './LoginView'
import RegisterView from './RegisterView'
import BigPopPage from '../../common/BigPopPage'
import Toast from "../../common/ToastView";
import LoadingView from "../Loading/LoadingView";
import RetrievePasswordView from './RetrievePasswordView'
import NoBindPhonePage from './NoBindPhonePage'
import RegistrItemPage from './RegistrItemPage'
import UserInfo from "../../core/UserInfo";
import UIMacro from '../../core/UIMacro'
import SendYzmView from "./SendYzmView";
import SuccessNewPwdViewPage from './SuccessNewPwdViewPage'
import NoPhoneServer from "./NoPhoneServer";
import TouchableBounce from '../../common/TouchableBounce'
import FastImage from 'react-native-fast-image'

type Props = {};

export default class LoginConfirmPage extends BigPopPage<Props> {
    constructor(pros) {
        super(pros);
        this.state = {
            ...this.state,
            isLogin: true,
            isRegister: false,
            userName: '',
            userPwd: '',
            isRegSuccess: false,//是否注册成功再跳转到登录界面
            findModalVisible:false,
            uname:'',
            agreeValue:'',
            isPhoneNum:false,
            selectIndex:0,
            phone:null,
        }
    }

    // onPress切换登录和注册
    handleLogin = () => {
        this.initStatus()
    };
    handleRegister = () => {
        this.setState({isRegister: true});
        this.setState({isLogin: false});
    };
    resetSuccess = () => {
        this.setState(
            {isRegSuccess: false}
        )
    };

    getUnameMsg = (msg) =>{
        this.setState({userName:msg})
    }

    //找回密码
    isBindPhoneNum = (msg) =>{
        this.setState({
            isPhoneNum:msg,
            isLogin:true,
            isRegister:false
        })
    }

    //验证码
    setOpenSendYzm = (index,phone,userName) =>{
        this.setState({
            selectIndex:index,
            phone:phone,
            userName:userName
        })
    }

    //标题
    titleImage = ()=> {
        return (
            (this.state.isLogin && !this.state.isPhoneNum) ? require('../../static/images/2.1.0/title01.webp')
            : (this.state.isLogin && this.state.isPhoneNum) ? require('../../static/images/2.1.0/title18.webp')
            : require('../../static/images/2.1.0/title02.webp')
        )
    }

    renderPage = ()=>{
        return(
              [
                <Toast
                      ref="toast"
                      style={{backgroundColor: 'white'}}
                      fadeInDuration={300}
                      fadeOutDuration={1000}
                      opacity={1}
                      textStyle={{color: 'black'}}
                      key={0}
                  />,

                <NoBindPhonePage ref={(c)=> this.noBindPhone = c} key={2} />,
                  <RegistrItemPage ref={(c)=> this.registerItem = c} key={3} agreeValue={this.state.agreeValue}/>,
                  // loading视图
                  <LoadingView ref={(c)=> this.loadingView = c} key={4}/>,
                  <NoPhoneServer ref={(c)=> this.noPhoneServer = c} key={5}/>,
                  <SuccessNewPwdViewPage ref={(c)=> this.successPwd = c} key={6}
                                         isShowBindPhoneNum={this.isBindPhoneNum}
                  />
              ]
        )
    }

    //同意条款
    agreeMsg = (msg)=>{
        this.setState({agreeValue:msg})
    }
    // 状态初始化
    initStatus = () =>{
        this.setState({
            isLogin:true,
            isPhoneNum:false,
            selectIndex:0,
            isRegister: false,
        })
    }

    //重写弹窗内容
    contentView = () => {
        return (<View style={styles.modalMiddleView}>
            <View>
                <FastImage style={styles.modalLeftImage}
                                 resizeMode='stretch'
                >
                    <TouchableBounce onPress={this.handleLogin} style={styles.touchBtn}>
                            <FastImage style={styles.btnClick}
                                             resizeMode='stretch'
                                             source={this.state.isLogin ? require('../../static/images/2.1.0/btn_click.webp') : require('../../static/images/2.1.0/btn_general.webp')}>
                                <Text style={styles.logText}>登录</Text>
                            </FastImage>
                    </TouchableBounce>

                    <TouchableBounce onPress={this.handleRegister} style={styles.touchBtn}>
                            <FastImage style={styles.btnClick}
                                             resizeMode='stretch'
                                             source={this.state.isRegister ?require('../../static/images/2.1.0/btn_click.webp') : require('../../static/images/2.1.0/btn_general.webp')}>
                                <Text style={styles.logText}>注册正式账户</Text>
                            </FastImage>
                    </TouchableBounce>
                </FastImage>
            </View>
            <View style={styles.modalRightView}>
                <View style={styles.modalRightContainer}>
                    {
                        (this.state.isLogin && !this.state.isPhoneNum)
                        &&
                        <LoginView   showLoading1={()=>{this.loadingView.showAnimation()}}
                                     showloading2={()=>{this.loadingView.dismissAnimation()}}
                                     userName={this.state.userName}
                                     userPwd={this.state.userPwd} isRegSuccess={this.state.isRegSuccess}
                                     resetSuccess={this.resetSuccess}
                                     closeLoginConfirm={this.props.setCloseLogin}
                                     setFindPword={this.setFindPwdWord}
                                     getUsername={this.getUnameMsg}
                                     setNoBindPhone={()=>this.noBindPhone.showPopView()}
                                     isShowBindPhoneNum={this.isBindPhoneNum}
                        />
                    }
                    {
                        this.state.isRegister
                        &&
                        <RegisterView  showLoading1={()=>{this.loadingView.showAnimation()}}
                                       showLoading2={()=>{this.loadingView.dismissAnimation()}}
                                       setAgreeItem={()=>{this.registerItem.showPopView()}}
                                       setAgreeValue={this.agreeMsg}
                                       show={this.props.showLoading} hide={this.props.hideLoading}
                        />
                    }
                    {
                        (this.state.isLogin && this.state.isPhoneNum && this.state.selectIndex !==1)
                        &&
                        <RetrievePasswordView isPhoneNum={this.isBindPhoneNum}
                                              showLoading1={()=>{this.loadingView.showAnimation()}}
                                              showLoading2={()=>{this.loadingView.dismissAnimation()}}
                                              userName={this.state.userName}
                                              setSendYzm={this.setOpenSendYzm}
                                              concatServer={()=>{this.noPhoneServer.showPopView()}}

                        />
                    }
                    {
                        (this.state.isLogin && this.state.selectIndex ===1)
                        &&
                        <SendYzmView phone={this.state.phone} userName={this.state.userName}

                                     showLoading1={()=>{this.loadingView.showAnimation()}}
                                     showLoading2={()=>{this.loadingView.dismissAnimation()}}
                                     openNewPwd={()=>{this.successPwd.showPopView()}}
                        />
                    }
                </View>
            </View>
        </View>)
    };

    pageDidShow = ()=>{
        this._isMounted = true;
        this.regListener = DeviceEventEmitter.addListener('rn_register_success', (log, reg,name, pword, success) => {
            console.log('注册成功:',log, reg, name, pword, success);
            this.setState({
                isLogin: log,
                isRegister: reg,
                userName: name,
                userPwd: pword,
                isRegSuccess: success,
                // 初始化状态
                isPhoneNum:false,
                selectIndex:0,
            })
        })
    }

    pageDidClose = ()=>{
        this._isMounted = false;
        this.regListener.remove()
        this.initStatus()
        UserInfo.loginViewShowTimes = 0;
    }

}

const styles = StyleSheet.create({
    touchBtn: {
        marginTop: 11 * UIMacro.HEIGHT_PERCENT,
        alignItems: 'center'
    },
    btnClick: {
        width: 121 * UIMacro.WIDTH_PERCENT,
        height: 45 * UIMacro.HEIGHT_PERCENT,
    },
    logText: {
        color: '#fff',
        fontSize: 15,
        fontWeight: 'bold',
        height: 45 * UIMacro.HEIGHT_PERCENT,
        textAlign: 'center',
        lineHeight: 45 * UIMacro.HEIGHT_PERCENT,
    },
    modalLeftImage: {
        width: 135 * UIMacro.WIDTH_PERCENT,
        height: 302.5 * UIMacro.HEIGHT_PERCENT,
        marginLeft: -2
    },
    modalRightView: {
        backgroundColor: 'rgba(0, 0, 0, .2)',
        // padding: 10,
        width: 335 * UIMacro.WIDTH_PERCENT,
        height: 285 * UIMacro.HEIGHT_PERCENT,
        borderRadius: 5,
        marginTop: 10 * UIMacro.HEIGHT_PERCENT,
        // marginLeft: 142 * UIMacro.WIDTH_PERCENT,
        marginRight: 10 * UIMacro.WIDTH_PERCENT,
        marginBottom: -14 * UIMacro.HEIGHT_PERCENT,
    },
    modalRightContainer: {
    },
    modalMiddleView: {
        flexDirection: 'row',
    },
});