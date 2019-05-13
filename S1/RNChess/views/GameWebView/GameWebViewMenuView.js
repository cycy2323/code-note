import {Component} from "react";
import {
    Dimensions,
    StyleSheet,
    View,
    PanResponder,
    Animated,
    Easing,
} from 'react-native';
import React from "react";
import UIMacro from '../../core/UIMacro'
import TouchableBounce from "../../common/TouchableBounce";
import FastImage from 'react-native-fast-image'

type Props = {};
const w = Dimensions.get('window').width;
const h = Dimensions.get('window').height;
export default class GameWebViewMenuView extends Component<Props> {

    state: {
        fadeAnim: Animated,
        currentAlpha: number,

    };

    constructor(props) {
        super(props);
        this.state = {//设置初值
            currentAlpha: 1.0,//标志位，记录当前value
            fadeAnim: new Animated.Value(1.0),
            imgRotate: new Animated.Value(0),
            showHide: false,
            pan: new Animated.ValueXY(),
            // top:0,left:0,
        };
    }

    startAnimation() {
        // alert(this.state.showHide)
        if (!this.state.showHide) {
            this.setState({showHide: true})
        } else {
            this.setState({showHide: false})
        }

        this.state.currentAlpha = this.state.currentAlpha == 1.0 ? 0.0 : 1.0;
        this.state.imgRotate.setValue(0);
        Animated.parallel([    // after decay, in parallel:
            Animated.timing(
                this.state.fadeAnim,
                {toValue: this.state.currentAlpha}
            ),
            Animated.timing(this.state.imgRotate, {
                toValue: 1,
                duration: 500,
                easing: Easing.inOut(Easing.linear),
            })

        ]).start();



    }

    showOrHide = (state) => {
        let arr = [], index = 0;
        if (state === false) {
            arr.push(<FastImage key={index} style={[styles.hide]}
                            resizeMode='contain'
                            source={require('../../static/images/2.1.0/game_btn_collapse.webp')}/>)
        } else {
            arr.push(<FastImage key={index + 1} style={[styles.hide]}
                            resizeMode='contain'
                            source={require('../../static/images/2.1.0/game_btn_put.webp')}/>)
        }
        return arr
    }

    gobackHome = () => {
        if(!this.state.showHide){
            this.props.gobackHomeCallBack();
        }

    }

    goback = () => {
        if(!this.state.showHide){
            this.props.gobackCallBack();
        }
    }

    goReload = () =>{
        if(!this.state.showHide){
            this.props.goreloadCallBack();
        }
    }

    componentWillMount() {
        this._panResponder = PanResponder.create({
            onMoveShouldSetPanResponder: (evt, gestureState) => {
                let {dx,dy} = gestureState;
                if((Math.abs(dx) > 5) || (Math.abs(dy) > 5)){
                    return true
                }else{
                    return false
                }
            },
            // 设置初始位置
            onPanResponderGrant: (e, gestureState) => {
                this.state.pan.setOffset({
                    x: this.state.pan.x._value,
                    y: this.state.pan.y._value
                });
                this.state.pan.setValue({x: 0, y: 0});
            },
            // 使用拖拽的偏移量来定位
            onPanResponderMove: Animated.event([
                null, {dx: this.state.pan.x, dy: this.state.pan.y},
            ]),
            onPanResponderRelease: (e, {vx, vy}) => {
                this.state.pan.flattenOffset();
            }
        });

        //去除首次进入游戏时,菜单是展开的
        this.setState({fadeAnim: new Animated.Value(0.0)})
        this.startAnimation();
    }

    render() {
        const {pan} = this.state;
        // 从pan里计算出偏移量
        const [translateX, translateY] = [pan.x, pan.y];
        // // 设置transform为偏移量
        const imageStyle = {transform: [{translateX}, {translateY}]};
        const spin = this.state.imgRotate.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '360deg']
        })
        return (
            <Animated.View style={[styles.container,imageStyle]}
                           {...this._panResponder.panHandlers}>
                    <View style={{position:'absolute',right:60}}>
                        <TouchableBounce onPress={this.gobackHome} style={[styles.common,styles.home]}>
                            <Animated.Image resizeMode='contain'
                                            source={require('../../static/images/2.1.0/game_btn_home.webp')}
                                            style={{
                                                opacity: this.state.fadeAnim, //透明度动画
                                                transform: [//transform动画
                                                    {
                                                        translateY: this.state.fadeAnim.interpolate({
                                                            inputRange: [0, 1],
                                                            outputRange: [60, 0] //线性插值，0对应60，0.6对应30，1对应0
                                                        }),
                                                    },
                                                    {
                                                        translateX: this.state.fadeAnim.interpolate({
                                                            inputRange: [0, 1],
                                                            outputRange: [40, 0] //线性插值，0对应60，0.6对应30，1对应0
                                                        }),
                                                    },
                                                    {
                                                        scale: this.state.fadeAnim
                                                    },
                                                    {rotate: spin}
                                                ],
                                            }}>
                            </Animated.Image>
                        </TouchableBounce>

                        <TouchableBounce onPress={this.goReload} style={[styles.common,styles.reload]}>
                            <Animated.Image resizeMode='contain'
                                            source={require('../../static/images/2.1.0/game_btn_refresh.webp')}
                                            style={{
                                                opacity: this.state.fadeAnim, //透明度动画
                                                transform: [//transform动画
                                                    {
                                                        translateX: this.state.fadeAnim.interpolate({
                                                            inputRange: [0, 1],
                                                            outputRange: [70, 0] //线性插值，0对应60，0.6对应30，1对应0
                                                        }),
                                                    },
                                                    {
                                                        scale: this.state.fadeAnim
                                                    },
                                                    {rotate: spin}
                                                ],
                                            }}>
                            </Animated.Image>
                        </TouchableBounce>

                        <TouchableBounce onPress={this.goback} style={[styles.common,styles.back]}>
                            <Animated.Image resizeMode='contain'
                                            source={require('../../static/images/2.1.0/game_btn_return.webp')}
                                            style={{
                                                top:-60,
                                                opacity: this.state.fadeAnim, //透明度动画
                                                transform: [//transform动画
                                                    {
                                                        translateY: this.state.fadeAnim.interpolate({
                                                            inputRange: [0, 1],
                                                            outputRange: [0, 60] //线性插值，0对应60，0.6对应30，1对应0
                                                        }),
                                                    },
                                                    {
                                                        translateX: this.state.fadeAnim.interpolate({
                                                            inputRange: [0, 1],
                                                            outputRange: [30, 0] //线性插值，0对应60，0.6对应30，1对应0
                                                        }),
                                                    },
                                                    {
                                                        scale: this.state.fadeAnim
                                                    },
                                                    {rotate: spin}
                                                ],
                                            }}>
                            </Animated.Image>
                        </TouchableBounce>
                    </View>

                    <TouchableBounce onPress={() => this.startAnimation()} style={styles.button}>
                        {this.showOrHide(this.state.showHide)}
                    </TouchableBounce>
            </Animated.View>
        );
    }
}

const styles = StyleSheet.create({
    button: {
        width: 50 * (68 / 75) * 0.8 * UIMacro.WIDTH_PERCENT,
        height: 47.5 * 0.8 * UIMacro.HEIGHT_PERCENT,
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: 'yellow',
        position:'absolute',
        // top: 0,
        right:0,
    },
    container: {
        position: 'absolute',
        top: 0,
        right: 20,
        width:120,
        height:145,
        justifyContent:'flex-end',
        alignItems:'center',
        // backgroundColor: '#f00',
        flexDirection:'row'
    },
    common: {
        width: 50 * (68 / 75) * 0.8 * UIMacro.WIDTH_PERCENT,
        height: 47.5 * 0.8 * UIMacro.HEIGHT_PERCENT,
        justifyContent: 'center',
        alignItems: 'center',

    },
    home: {
        right:-30,
        top:-10
        // backgroundColor:'pink',
    },
    reload: {
        // top: 15,
        // right: -10,
        // backgroundColor:'blue',
    },
    back: {
        right:-30,
        top:10,
        // backgroundColor:'green',
    },

});