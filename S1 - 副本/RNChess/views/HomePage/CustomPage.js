import BigPopPage from "../../common/BigPopPage";
import {Text, View} from "react-native";
import React from "react";
import TopPage from './TopPage'
import TouchableBounce from "../../common/TouchableBounce";

export default class CustomPage extends BigPopPage<Props> { //继承自弹窗
    constructor(pros) {
        super(pros);
        this.state = {
            ...this.state,
            xxxx: false
        }
    }

    pageDidShow = ()=>{
        console.log("弹窗pageDidShow");
    }

    pageDidClose = ()=>{
        console.log("弹窗pageDidClose");
    }

    openWindow = ()=>{
        this.topPage.showPopView();
    }

    renderPage = ()=>{
        return (
            <TopPage ref={(c)=>this.topPage = c}/>
        )
    }

    //重写弹窗内容
    contentView = () => {
        return (
            this.state.xxxx ?
            <View style={{flex: 1, backgroundColor: 'red'}}>
                <Text>重写的子视图</Text>
                <TouchableBounce onPress={this.openWindow}>
                    <Text>另一个弹窗</Text>
                </TouchableBounce>
            </View> :
                <View style={{flex: 1, backgroundColor: 'red'}}>
                    <Text>重写的子视图2</Text>
                </View>

        )
    }

    //标题
    // titleImage = ()=> {
    //     return require("../../static/images/title09.webp")
    // }

    change1 = ()=>{
        this.setState({
            xxxx: false
        })
    }

    change2 = ()=>{
        this.setState({
            xxxx: true
        })
    }

    //标题自定义视图
    titleView = ()=> {
        return (
            <View>
                <TouchableBounce onPress={this.change1}><Text>按钮1</Text></TouchableBounce>
                <TouchableBounce onPress={this.change2}><Text>按钮2</Text></TouchableBounce>
            </View>
        )
    }
}