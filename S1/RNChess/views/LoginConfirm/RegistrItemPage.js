import React, {Component} from 'react'
import {
    View, WebView,
    Platform
} from 'react-native'
import BigPopPage from '../../common/BigPopPage'
import UIMacro from "../../core/UIMacro";

//webView注入js
const BaseScript =
    // 检测web端总元素高度
    `
     (function () {        var height = null;
        function changeHeight() {
          if (document.body.scrollHeight != height) {
            height = document.body.scrollHeight;
            if (window.postMessage) {
              window.postMessage(JSON.stringify({
                type: 'setHeight',
                height: height,
              }))
            }
          }
        }
        setTimeout(changeHeight, 300);
    } ())
    `;


export default class RegisterView extends BigPopPage {

    constructor(pros) {
        super(pros);
        this.state = {
            ...this.state,
            height: null,
        }
    }

    //标题
    titleImage = () => {
        return (require('../../static/images/2.1.0/title03.webp'))
    }

    contentView = () => {
        return (
            <View style={{width: 490 * UIMacro.WIDTH_PERCENT, height: 300 * UIMacro.HEIGHT_PERCENT,}}>
                {
                    this.webViewShow(this.props.agreeValue)
                }
            </View>
        )
    }
    webViewShow = (agreeValue) => {
        if (agreeValue) {
            return <WebView
                useWebKit={false}
                injectedJavaScript={BaseScript}
                style={{
                    width: 485 * UIMacro.WIDTH_PERCENT,
                    height: this.state.height,
                    backgroundColor: 'rgba(0,0,0,0)'
                }}
                automaticallyAdjustContentInsets
                source={this.webViewContent(agreeValue)}
                decelerationRate='normal'
                scalesPageToFit={Platform.OS === 'ios' ? false : true}
                javaScriptEnabled // 仅限Android平台。iOS平台JavaScript是默认开启的。s
                domStorageEnabled // 适用于安卓
                scrollEnabled={true}
                onMessage={(event) => this.onMessage(event)}
            />
        }
    }
    webViewContent = (agreeValue) => {
        return (
            Platform.OS === 'ios' ?
                {html: "<div style=\"padding: 10px;color: #fff;\">" + agreeValue + "</div>"} :
                {html: "<div style=\"padding: 10px;color: #fff;\">" + agreeValue + "</div>", baseUrl: ''}
        )

    }

    // 接收web端交互消息
    onMessage(event) {
        try {
            const action = JSON.parse(event.nativeEvent.data)
            if (action.type === 'setHeight' && action.height > 0) {
                this.setState({height: action.height}, () => {
                    console.log('onMessage', this.state.height)
                })
            }
        } catch (error) {
            // pass
        }
    }
}