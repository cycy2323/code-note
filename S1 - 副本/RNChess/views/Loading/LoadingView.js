import {Component} from "react";
import {
    StyleSheet,
    View,
} from 'react-native';
import React from "react";
import LottieView from 'lottie-react-native';

type Props = {};
export default class LoadingView extends Component<Props> {
    constructor(pros) {
        super(pros);
        this.state = {
            modalVisible: false,
        }
    };

    //执行loading
    showAnimation = () => {
        this.setState({modalVisible: true});
    }

    //关闭loading
    dismissAnimation = () => {
        this.setState({modalVisible: false});
    }

    componentDidMount() {

    }


    componentWillUnmount() {

    }

    render() {
        return (
            this.state.modalVisible &&
            <View style={styles.container} accessible={false}>
                <LottieView
                    style={{width:67,height:67}}
                    source={require('../../static/animation/loading/loading.json')}
                    ref={(loadingAnimation) => this.loadingAnimation = loadingAnimation}
                    imageAssetsFolder={'lottie/loading/images'}
                    autoPlay
                    loop
                />
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        justifyContent: "center",
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    }
});