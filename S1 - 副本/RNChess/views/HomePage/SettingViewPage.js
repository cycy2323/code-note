import React, {Component} from 'react'
import {
    View,
    Text,
    Image,
    StyleSheet,
    Dimensions,
    TextInput,
    TouchableOpacity,
    ImageBackground,
    NativeModules
} from 'react-native'

import SystemSetting from 'react-native-system-setting'
import Slider from "react-native-slider";
import MusicManager from '../MusicManager/MusicManager'
import UserInfo from '../../core/UserInfo'
import SmallPopPage from "../../common/SmallPopPage";
import UIMacro from '../../core/UIMacro'
import SkinsColor from "../../core/SkinsColor";


export default class SettingViewPage extends SmallPopPage {

    constructor(props) {
        super(props);

        this.state = {
            ...this.state,
            firstValue: MusicManager.getInstance().bgmPlayerVolume(),
            secondValue: MusicManager.getInstance().alertPlayerVolume(),
        }
    }


    //标题
    titleImage = ()=> {
        return (require('../../static/images/2.1.0/title05.webp'))
    }
    //重写弹框大小
    customWindowSize = ()=>{
        return {width:321*UIMacro.WIDTH_PERCENT,height:160*UIMacro.HEIGHT_PERCENT}
    }
    //重写弹框背景图
    popPageBackground=()=>{
        return  require('../../static/images/2.1.0/popups_setting.webp')
    }
    contentView = () => {
        let musicValueWith = (this.state.firstValue / 1) * 204 * UIMacro.WIDTH_PERCENT;
        let music2ValueWith = (this.state.secondValue / 1) * 204 * UIMacro.WIDTH_PERCENT;
        return (
            <View style={{justifyContent: 'center', alignItems: 'center',marginTop:40* UIMacro.WIDTH_PERCENT}}>
                <View style={styles.messageTxt}>
                    <View style={styles.music}>
                        <Text style={styles.mText}>音乐</Text>
                        <ImageBackground
                            imageStyle={{
                                borderWidth: 2,
                                borderColor: SkinsColor.musicSetting_border,
                                backgroundColor: SkinsColor.musicSetting_bg,
                                borderRadius: 6
                            }}
                            style={styles.bar_empty}
                        >
                            <ImageBackground style={styles.bar_music1}
                                             imageStyle={{
                                                 backgroundColor: SkinsColor.musicSetting_value,
                                                 width: musicValueWith,
                                                 borderRadius: 5,
                                                 borderWidth:1,
                                                 borderColor:SkinsColor.musicSetting_border
                                             }}
                            />
                            {/*ref={(c) => this.firstChangeLeftValue = c}*/}
                            <Slider
                                value={this.state.firstValue}
                                onValueChange={(firstValue) => {
                                    this.setState({firstValue})
                                    //设置音量大小
                                    MusicManager.getInstance().configBgmPlayerVolume(firstValue);
                                }
                                }
                                thumbImage={require('../../static/images/2.1.0/circular_music.png')}
                                thumbStyle={styles.circular}
                                thumbTintColor=''
                                trackStyle={{width: UIMacro.WIDTH_PERCENT * 225}}
                                maximumTrackTintColor=''
                                minimumTrackTintColor=''
                                style={{position: 'absolute'}}
                            />
                        </ImageBackground>
                    </View>
                    <View style={styles.music1}>
                        <Text style={styles.mText}>音效</Text>
                        <ImageBackground
                            imageStyle={{
                                borderWidth: 2,
                                borderColor: SkinsColor.musicSetting_border,
                                backgroundColor: SkinsColor.musicSetting_bg,
                                borderRadius: 6
                            }}
                            style={styles.bar_empty}
                        >
                            <ImageBackground style={styles.bar_music1}
                                             imageStyle={{
                                                 backgroundColor: SkinsColor.musicSetting_value,
                                                 width: music2ValueWith,
                                                 borderRadius: 5,
                                                 borderWidth:1,
                                                 borderColor:SkinsColor.musicSetting_border,
                                             }}
                            />
                            <Slider
                                value={this.state.secondValue}
                                onValueChange={(secondValue) => {
                                    this.setState({secondValue})
                                    //设置音量大小
                                    MusicManager.getInstance().configAlertPlayerVolume(secondValue);
                                }
                                }
                                thumbImage={require('../../static/images/2.1.0/circular_volume.png')}
                                thumbStyle={styles.circular}
                                thumbTintColor=''
                                trackStyle={{width: UIMacro.WIDTH_PERCENT * 225}}
                                maximumTrackTintColor=''
                                minimumTrackTintColor=''
                                style={{position: 'absolute'}}
                            />
                        </ImageBackground>
                    </View>

                </View>

            </View>
        )
    };
}

const styles = StyleSheet.create({

    messageTxt: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    music: {
        flexDirection: 'row',
        marginTop: -10 * UIMacro.HEIGHT_PERCENT,
        alignItems: 'center',
        justifyContent: 'center'
    },
    mText: {
        color: 'rgba(255, 255, 255, 1)',
        fontSize: 15,
        marginRight: 16 * UIMacro.WIDTH_PERCENT,
        marginTop: -4 * UIMacro.HEIGHT_PERCENT,
    },
    bar_empty: {
        width: UIMacro.WIDTH_PERCENT * 217,
        height: UIMacro.HEIGHT_PERCENT * 10,
        justifyContent: 'center',
    },
    bar_music: {
        width: 0,
        height: UIMacro.HEIGHT_PERCENT * 10,
    },
    circular: {
        width: 31 * UIMacro.WIDTH_PERCENT,
        height: 30 * UIMacro.WIDTH_PERCENT,
        left:-3 * UIMacro.WIDTH_PERCENT,
    },
    music1: {
        flexDirection: 'row',
        marginTop: 20 * UIMacro.HEIGHT_PERCENT,
        alignItems: 'center',
        justifyContent: 'center'
    },
    bar_music1: {
        height: UIMacro.HEIGHT_PERCENT * 10,
    },
    circular1: {
        width: 29 * UIMacro.WIDTH_PERCENT,
        height: 29 * UIMacro.WIDTH_PERCENT,
        justifyContent: 'center',
        position: 'absolute',
        left: 110 * UIMacro.WIDTH_PERCENT,
        top: -6 * UIMacro.HEIGHT_PERCENT,
    },
})