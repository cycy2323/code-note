import {Component} from "react";
import {
    StyleSheet,
    StatusBar,
} from 'react-native';
import React from "react";
import Orientation from "react-native-orientation";
import FastImage from 'react-native-fast-image'


type Props = {};
export default class SplashPage extends Component<Props> {

    constructor(pros) {
        super(pros);
    };

    componentWillMount() {
        this.isMounted = false
        //只允许横屏
        const initial = Orientation.getInitialOrientation();
        if (initial === 'PORTRAIT') {
            Orientation.lockToLandscapeRight();
            Orientation.lockToLandscape();
        }
        else
        {
            Orientation.lockToLandscape();
        }
    }

    componentDidMount() {
        this.timer = setTimeout(() => {
            this.props.navigation.navigate('LineCheckPage');
            clearTimeout(this.timer);
        }, 2 * 1000);
    }

    componentWillUnmount() {
        clearTimeout(this.timer);
    }

    render() {
        return (
            <FastImage style={styles.container} resizeMode='cover'
                             source={require('../../static/images/2.1.0/splash_bg.webp')}>
                <StatusBar
                    animated={true} //指定状态栏的变化是否应以动画形式呈现。目前支持这几种样式：backgroundColor, barStyle和hidden
                    hidden={true}  //是否隐藏状态栏。
                    translucent={true}//指定状态栏是否透明。设置为true时，应用会在状态栏之下绘制（即所谓“沉浸式”——被状态栏遮住一部分）。常和带有半透明背景色的状态栏搭配使用。
                    barStyle={'light-content'} // enum('default', 'light-content', 'dark-content')
                />
                <FastImage source={require('../../static/images/2.1.0/splash_deco.webp')}
                           style={{justifyContent: 'center',
                               alignItems: 'center',height:'70%',width:'50%'}}
                           resizeMode='contain'
                />
            </FastImage>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});