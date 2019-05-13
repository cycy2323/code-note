import {Component} from "react";
import {
    StyleSheet,
    View,
    Text,
    FlatList

} from 'react-native';
import React from "react";
import UIMacro from "../../core/UIMacro";
import SmallPopPage from "../../common/SmallPopPage";
import SkinsColor from "../../core/SkinsColor";

type Props = {};
export default class RewardDetailPopView extends SmallPopPage<Props> {

    titleImage = () => {
        return require('../../static/images/2.1.0/title03.webp')
    }

    contentView = () => {
        let {dataArr} = this.props;
        return <View style={styles.container}>
            <View style={styles.titleViewStyle}>
                <Text style={styles.popTitleTextStyle}>抽成比列</Text>
            </View>
            <FlatList
                data={dataArr}
                renderItem={this._showItem}
                keyExtractor={(item, index) => index.toString()}
                style={styles.flatListStyle}
            />
        </View>
    }
    _showItem = ({item, index}) => {
        return <Text
            style={[styles.tableCellStyle, index % 2 === 0 ? styles.tableCellBackgroundColor1 : styles.tableCellBackgroundColor2]}>
            {item}
        </Text>
    }

}


const styles = StyleSheet.create({
    container: {
        width: 246 * UIMacro.HEIGHT_PERCENT,
        height: 155 * UIMacro.HEIGHT_PERCENT,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    titleViewStyle: {
        width: '100%',
        height: 25 * UIMacro.WIDTH_PERCENT,
        marginTop: 10,
        backgroundColor: SkinsColor.WelfareRecordListHead_bg,
        borderTopRightRadius: 5,
        borderTopLeftRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    popTitleTextStyle: {
        fontSize: 12,
        color: 'white',
        textAlign: 'center',

    },
    flatListStyle: {
        width: '100%',
        height: 130 * UIMacro.HEIGHT_PERCENT,
    },
    tableCellStyle: {
        width: 246 * UIMacro.HEIGHT_PERCENT,
        height: 25 * UIMacro.WIDTH_PERCENT,
        textAlign: 'center',
        fontSize: 10,
        color: SkinsColor.IDText,
        lineHeight: 25 * UIMacro.WIDTH_PERCENT,
    },
    tableCellBackgroundColor1: {
        backgroundColor: SkinsColor.table_bg1
    },
    tableCellBackgroundColor2: {
        backgroundColor: SkinsColor.table_bg2

    }
});