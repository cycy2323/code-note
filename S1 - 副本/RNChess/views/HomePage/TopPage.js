import BigPopPage from "../../common/BigPopPage";
import {Text, View} from "react-native";
import React from "react";

export default class TopPage extends BigPopPage<Props> { //继承自弹窗
    //重写弹窗内容
    contentView = () => {
        return (
            <View style={{flex: 1, backgroundColor: 'green'}}>
                <Text>Top视图</Text>
            </View>
        )
    }

    //标题
    titleImage = ()=> {
        return require("../../static/images/2.1.0/title10.webp")
    }
}