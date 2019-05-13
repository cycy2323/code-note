import {Component} from "react";
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';
import React from "react";
import FastImage from 'react-native-fast-image'


type Props = {};
export default class MaintemancePage extends Component<Props> {
    constructor(pros) {
        super(pros);

    };

    render() {
        return (
            <View style={styles.container} accessible={false}>
                <View style={styles.contentView}>
                    <FastImage style={styles.noAccessImage}
                               source={require('../../static/images/2.1.0/maintain.webp')}
                               resizeMode='contain'
                    />
                    <Text style={styles.noAccessTitle}>UNDER MAINTEMANCE</Text>
                    <Text style={styles.noAccessSubTitle}>网站维护中，暂停访问</Text>
                    <Text style={styles.noAccessContent}>抱歉！本系统程序升级，将暂停访问，敬请期待！如有什么疑问，请联系我们的客服</Text>
                </View>

            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        flex:1,
        alignItems: "center",
        justifyContent: 'center'
    },
    contentView:{
        alignItems: "center",
    },
    noAccessImage:{
        width:375,
        height:225/2.0
    },
    noAccessTitle:{
        fontSize:17,
    },
    noAccessSubTitle:{
        fontSize:22,
        marginTop: 10
    },
    noAccessContent:{
        fontSize:15,
        marginTop:10
    }
});