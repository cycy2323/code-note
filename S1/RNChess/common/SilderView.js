/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    Dimensions,
    Animated, Easing,
} from 'react-native';
import * as Progress from "react-native-progress";
import LottieView from 'lottie-react-native';
import UIMacro from "../core/UIMacro";

export default class SilderView extends Component {

    state = {
        progress: 0,
        modalVisible: false,
    }

    render() {

        let strProgress = (this.props.progress * 100).toString();
        let intPro;
        if (this.props.progress === 1) {
            intPro = strProgress.substr(0, 3) + '%';
        } else {
            intPro = strProgress.substr(0, 2) + '%';
        }

        return (
            <View style={styles.container}>
                <Progress.Bar style={styles.progressBar} progress={this.state.progress}
                              width={UIMacro.SCREEN_WIDTH * 0.5} height={4}
                              unfilledColor='rgb(16, 0, 69)'
                              color='rgb(204, 149, 53)'/>

                <View style={styles.animationView}
                      ref={(shaiziAnimation) => this.shaiziAnimation = shaiziAnimation}>
                    <Text style={styles.percentTextStyle}>{intPro}</Text>
                    <LottieView
                        style={styles.lottieView}
                        source={require('../static/animation/shaizi/shaizi.json')}
                        imageAssetsFolder={'lottie/shaizi/images'}
                        autoPlay
                        loop
                    />
                </View>
            </View>
        );
    }


    componentDidMount() {
        this.isMounted = true;
    }


    componentWillUnmount() {
        this.isMounted = false;

    }

    //改变坐标
    componentWillReceiveProps(nextProps) {
        this.setState({
            progress: nextProps.progress
        })

        this.shaiziAnimation.setNativeProps({
            style: {
                marginLeft: -25 + nextProps.progress * (UIMacro.SCREEN_WIDTH * 0.5)
            }
        });
    }

};

const styles = StyleSheet.create({
    container: {
        width: UIMacro.SCREEN_WIDTH * 0.5,
        height: 30,
    },

    animationView: {
        marginLeft: -25,
        marginTop: -32,
        alignItems: 'center',
        width: 50
    },

    percentTextStyle: {
        color: 'white',
        width: 50,
        textAlign: 'center',
    },

    lottieView: {
        width: 21.5,
        height: 23
    },
    progressBar: {
        marginTop: 15
    }
});
