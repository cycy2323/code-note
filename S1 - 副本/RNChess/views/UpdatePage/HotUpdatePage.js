import {Component} from "react";
import {
    Dimensions,
    Platform,
    StatusBar,
    StyleSheet,
    Text,
    View,
    ImageBackground,
    WebView,
    TouchableOpacity,
    Image,
    Modal, Animated, Easing
} from 'react-native';
import React from "react";
import * as Progress from 'react-native-progress';

type Props = {};
export default class HotUpdatePage extends Component<Props> {
    constructor(pros) {
        super(pros);
        this.state = {
            progress: 0.0,
            modalVisible: false,
        }
    };

    //开启
    show = () => {
        this.setState({modalVisible: true});
    }

    //关闭
    dismiss = () => {
        this.setState({modalVisible: false});
    }

    componentDidMount() {

    }


    componentWillReceiveProps(nextProps) {
        this.setState({
            progress:nextProps.progress
        })
    }

    componentWillUnmount() {
    }

// <Modal
// animationType="fade"
// transparent={true}
// visible={this.state.modalVisible}
// supportedOrientations={['landscape-left', 'landscape-right']}
// onRequestClose={() => {
//     this.props.setModalVisible(!this.props.modalVisible);
// }}
// >
// <View style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
// <View style={{width:250,height:127,backgroundColor:'rgba(22, 22, 22, 0.9)',borderRadius: 10,alignItems: "center", justifyContent: "center"}}>
// <Text style={{marginBottom: 40,color: 'white',fontSize:15}}>下载安装包中...</Text>
// <Progress.Bar progress={this.state.progress} width={190} height={2} color='rgb(227, 127, 28)'/>
// </View>
// </View>
// </Modal>
//
    render() {
        return (
            this.state.modalVisible ?
        <View style={{alignItems: "center", justifyContent: "center", position:'absolute',top:0,left:0,right:0,bottom:0}} accessible={false}>
            <View style={{width:250,height:127,backgroundColor:'rgba(22, 22, 22, 0.9)',borderRadius: 10,alignItems: "center", justifyContent: "center"}}>
                <Text style={{marginBottom: 40,color: 'white',fontSize:15}}>下载安装包中...</Text>
                <Progress.Bar progress={this.state.progress} width={190} height={2} color='rgb(227, 127, 28)'/>
            </View>
        </View>
                : null
        )
    }
}
