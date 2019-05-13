import {Component} from "react";
import {
    StyleSheet,
    Text,
    View,
    Image,
} from 'react-native';
import React from "react";
import FastImage from 'react-native-fast-image'

type Props = {};
export default class NoAccessPage extends Component<Props> {
    constructor(pros) {
        super(pros);

    };

    render() {
        return (
            <View style={styles.container} accessible={false}>
                <View style={styles.contentView}>
                    <FastImage style={styles.noAccessImage}
                               source={require('../../static/images/2.1.0/no_access_image.webp')}
                               resizeMode='contain'
                    />
                    <Text style={styles.noAccessTitle}>NO    ACCESS</Text>
                    <Text style={styles.noAccessSubTitle}>您所在的地区禁止访问</Text>
                    <Text style={styles.noAccessContent}>由于您所在的地不在我们的服务允许范围内，我们暂时无法为您服务！</Text>
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