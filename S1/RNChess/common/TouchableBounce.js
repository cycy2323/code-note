/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {StyleSheet, TouchableOpacity,} from 'react-native';
import * as Animatable from 'react-native-animatable';
import UIMacro from "../core/UIMacro";

type Props = {};
export default class TouchableBounce extends Component<Props> {
    constructor(pros) {
        super(pros);
        this.state = {
        }
    }

    onPress = () =>{
        this.refs.animationButton.pulse();
        this.props.onPress();
    }

    render() {
        return (
            <TouchableOpacity onPress={this.onPress} style={this.props.style} activeOpacity={0.5}>
                <Animatable.View ref="animationButton" duration={800}>
                    {this.props.children}
                </Animatable.View>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    btnClickView: {
        width: 122 * UIMacro.WIDTH_PERCENT,
        height: 47 * UIMacro.HEIGHT_PERCENT,
        marginLeft: 7 * UIMacro.WIDTH_PERCENT,
        marginTop: 3 * UIMacro.HEIGHT_PERCENT,
    },
});
