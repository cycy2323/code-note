import {Component} from "react";
import {
    StyleSheet,
    View,
    ScrollView
} from 'react-native';
import React from "react";
import UIMacro from "../../core/UIMacro";
import FastImage from 'react-native-fast-image'

type Props = {};
export default class RedPackagePopView extends Component<Props> {

    constructor(pros) {
        super(pros);
    };



    render() {
        return (
            <View style={styles.container}>
                <ScrollView>
                    <FastImage source={require("../../static/images/2.1.0/img_chart.webp")}
                                     style={{width:507*UIMacro.SCREEN_FULL_PERCENT,height: 250*UIMacro.SCREEN_FULL_PERCENT,marginTop: 15*UIMacro.SCREEN_FULL_PERCENT}}
                    >

                    </FastImage>
                    <FastImage source={require("../../static/images/2.1.0/img_bonus.webp")}
                                     style={{width:507*UIMacro.SCREEN_FULL_PERCENT,height: 406*UIMacro.SCREEN_FULL_PERCENT,marginTop:8}}
                    >

                    </FastImage>
                </ScrollView>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        width:540*UIMacro.SCREEN_FULL_PERCENT,
        height:328*UIMacro.HEIGHT_PERCENT,
        flexDirection:'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop:5*UIMacro.HEIGHT_PERCENT,
        marginLeft: 5*UIMacro.SCREEN_FULL_PERCENT,
        borderRadius:5,
        backgroundColor:'rgba(0,0,0,0.4)',
    }
});