import React, {Component} from 'react';
import {Platform, StyleSheet, Image, View, Dimensions, TouchableOpacity, Text} from 'react-native';
import Swiper from 'react-native-swiper';
import GBServiceParam from "../../core/GBServiceParam";
import FastImage from 'react-native-fast-image'
import UIMacro from "../../core/UIMacro";
import ImageUrlManager from '../../core/ImageUrlManager'

type Props = {};
export default class BannerView extends Component<Props> {

    render() {
        return (
            <View style={styles.container}>
                <Swiper style={styles.swiper}
                        loop={true}
                        index={0}
                        autoplay={true}
                        showsPagination={true}
                        paginationStyle={{marginBottom: -25}}
                        dot={<View style={{           //未选中的圆点样式
                            backgroundColor: 'rgba(255,236,122,.4)',
                            width: 10,
                            height: 10,
                            borderRadius: 5,
                            marginHorizontal: 2.5,
                            borderWidth: 1,
                            borderColor: 'gray',
                        }}/>}
                        activeDot={<View style={{    //选中的圆点样式
                            backgroundColor: 'rgb(255,236,122)',
                            width: 10,
                            height: 10,
                            borderRadius: 5,
                            marginHorizontal: 2.5,
                            borderWidth: 1,
                            borderColor: 'gray',
                        }}/>
                        }
                >
                    {this._bannerViewItem()}
                </Swiper>
            </View>
        );
    }

    //轮播图
    _bannerViewItem = () => {
        let imageViews = [];
        const {bannerSource} = this.props;
        bannerSource.map((item, index) => {
            let url;
            url = ImageUrlManager.dealURI(item.cover);
            imageViews.push(
                <TouchableOpacity
                    style={{flex: 1,}}
                    key={index}
                    onPress={() => this._btnClick(item.link && item.link.length > 0 ? item.link : '')}
                >
                    <FastImage source={{
                        uri: url,
                        headers: {Host: GBServiceParam.currentHost},
                        priority: FastImage.priority.normal,
                    }}
                               resizeMode='contain'
                               style={styles.bannerImageStyle}
                    />
                </TouchableOpacity>
            )
        })
        return imageViews;
    }

    _btnClick = (link) => {
        console.log('链接', link)
        if (link.length > 0) {
            this.props.bannerItemClick(link);
        }
    }


}

const styles = StyleSheet.create({
    container: {
        marginHorizontal:10,
        overflow:'hidden',
        width: 147 * UIMacro.WIDTH_PERCENT,
        height: 232 * UIMacro.HEIGHT_PERCENT,
    },
    swiper: {
    },
    bannerImageStyle: {
        flex:1,
        width:147*UIMacro.WIDTH_PERCENT,
        height:206*UIMacro.HEIGHT_PERCENT
    }
});