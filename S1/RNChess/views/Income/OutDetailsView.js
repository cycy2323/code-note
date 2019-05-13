import React, {Component} from 'react'
import {
    View,
    Text,
    TextInput,
    StyleSheet,
} from 'react-native'
import BigPopPage from '../../common/BigPopPage' ;
import IncomeTipView from "./IncomeTipView";
import CheckAuditView from './CheckAuditView';
import VerificationSaftyPwdView from './VerificationSafetyPwdView' ;
import UIMacro from '../../core/UIMacro'
import SkinsColor from "../../core/SkinsColor";
import TouchableBounce from "../../common/TouchableBounce";
import FastImage from 'react-native-fast-image'


export default class OutDetailsView extends BigPopPage {

    constructor() {
        super();
        this.state = {
            ...this.state,
            tipTextValue: '',
            dataArr:[],
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            dataArr: nextProps.outDetailDataArr,
        })
    }

    renderPage = () => {
        return (
            [<IncomeTipView ref={(c) => this.IncomeTipView = c} tipTextValues={this.state.tipTextValue} key={1}/>,
             <CheckAuditView ref={(c) => this.CheckAuditView = c}  key={2}/>,
                <VerificationSaftyPwdView ref={(c) => this.VerificationSaftyPwdView = c}  key={3} OutDetailArrs={this.state.dataArr}
                                          closeOutDetailView={this.closePage}
                />
            ]
        )
    }

    //关闭
    closePage=()=>{
        this.props.closeIncomePage();
        this.closePopView()
    }


    titleImage = () => {
        return require('../../static/images/2.1.0/title14.webp')
    }

    contentView = () => {
        let dataSource = this.state.dataArr;
        return <View style={styles.container}>
            <View style={styles.textView}>
                <Text style={styles.content}>福利账户</Text>
                <TextInput
                    style={styles.textInput}
                    value={dataSource[0]}
                    editable={false}  //关闭交互
                />
            </View>
            <View style={styles.textView}>
                <Text style={styles.content}>取款金额</Text>
                <TextInput
                    style={styles.textInput}
                    value={dataSource[1].toString()}
                    editable={false}  //关闭交互
                />
            </View>
            <View style={styles.textView}>
                <Text style={styles.content}>手续费</Text>
                <TextInput
                    style={styles.textInput}
                    value={dataSource[2].toString()}
                    editable={false}  //关闭交互
                />
            </View>
            <View style={styles.textView}>
                <Text style={styles.content}>行政费</Text>
                <TextInput
                    style={styles.textInput}
                    value={dataSource[3].toString()}
                    editable={false}  //关闭交互
                />
            </View>
            <View style={styles.textView}>
                <Text style={styles.content}>扣除优惠</Text>
                <TextInput
                    style={styles.textInput}
                    value={dataSource[4].toString()}
                    editable={false}  //关闭交互
                />
            </View>
            <View style={styles.textView}>
                <Text style={styles.content}>最终出币</Text>
                <TextInput
                    style={styles.textInput}
                    value={dataSource[5].toString()}
                    editable={false}  //关闭交互
                />
            </View>
            <View style={styles.btnViewStyle}>
                <TouchableBounce onPress={this.handlecheck}>
                    <FastImage style={styles.btnClick}
                                     resizeMode='stretch'
                                     source={require('../../static/images/2.1.0/btn_menu.webp')}>
                        <Text style={styles.logText}>查看稽核</Text>
                    </FastImage>
                </TouchableBounce>
                <TouchableBounce onPress={() => this.handleSure()}>
                    <FastImage style={styles.btnClick}
                                     resizeMode='stretch'
                                     source={require('../../static/images/2.1.0/btn_menu.webp')}>
                        <Text style={styles.logText}>确定出币</Text>
                    </FastImage>
                </TouchableBounce>
            </View>
        </View>
    }

    //查看稽核
    handlecheck = () => {
        this.CheckAuditView.showPopView();
    }
    //确认出币
    handleSure = () => {
        let dataSource = this.state.dataArr;
        let money = dataSource[5].toString();
        if (parseFloat(money) > 0) {
            this.VerificationSaftyPwdView.showPopView();
        } else {
            this.setState({
                tipTextValue:'出币数量应大于0'
            },this.IncomeTipView.showPopView)
        }

    }

}

const styles = StyleSheet.create({
    container:{
        marginTop: 5 * UIMacro.HEIGHT_PERCENT,
    },
    textView: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height:40 *UIMacro.HEIGHT_PERCENT,
    },
    content: {
        color: '#fff',
        fontSize: UIMacro.SCREEN_WIDTH >= 667 ? 15 : 13,
        textAlign: 'right',
        marginRight: 10 * UIMacro.WIDTH_PERCENT,
        width: UIMacro.SCREEN_WIDTH >= 667 ? 70 * UIMacro.WIDTH_PERCENT : 80 * UIMacro.WIDTH_PERCENT,
        height: 20 * UIMacro.HEIGHT_PERCENT,
        marginTop: 5 * UIMacro.HEIGHT_PERCENT
    },
    textInput: {
        backgroundColor: SkinsColor.bgTextViewStyle_bg,
        borderRadius: 5,
        color: '#AAAAA8',
        fontSize: 12,
        width: 208 * UIMacro.HEIGHT_PERCENT,
        height: 30 * UIMacro.HEIGHT_PERCENT,
        padding: 0,
        borderWidth: 1,
        borderColor: SkinsColor.bgTextViewStyle_border,
        paddingLeft: 14 * UIMacro.WIDTH_PERCENT
    },
    btnViewStyle: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        marginTop:10*UIMacro.HEIGHT_PERCENT,
    },
    btnClick: {
        width: 118 * UIMacro.WIDTH_PERCENT,
        height: 41 * UIMacro.HEIGHT_PERCENT,
        justifyContent: 'center',
    },
    logText: {
        color: '#fff',
        fontSize: 15,
        fontWeight: 'bold',
        textAlign: 'center',
    },
})