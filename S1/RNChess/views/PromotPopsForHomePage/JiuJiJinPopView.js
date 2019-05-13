/**
 * 首页活动全屏弹框
 * https://github.com/facebook/react-native
 *@lemon
 */

import React from 'react';
import PromotPopPage from '../../common/PromotPopPage'

type Props = {};
export default class JiuJiJinPopView extends PromotPopPage<Props> {
    constructor(pros) {
        super(pros);
        this.state = {
            ...this.state,

        }
    }
    //页面打开回调
    pageDidShow = () => {

    }
    //页面关闭回调
    pageDidClose = () => {

    }
    // 背景图
    BackgroundSource = () => {
        return require("../../static/images/2.1.0/bg_registered1.webp")
    }
    //按钮文字
    btnText = () => {
        return "前往优惠活动"
    }
    //点击按钮方法 (在homePage打开活动弹框等)
    btnClick = () => {
        alert('打开优惠活动救济金')
    }
}