/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import LineCheckPage from "./views/LineCheckPage/LineCheckPage";  //线路检测
import HomePage from './views/HomePage/HomePage' ;
import GameWebView from './views/GameWebView/GameWebView'
import MusicManager from './views/MusicManager/MusicManager'
import SplashPage from './views/LineCheckPage/SplashPage'
import NoAccessPage from './views/ErrPage/NoAccessPage'
import MaintemancePage from './views/ErrPage/MaintemancePage'
import AllPeoplePromotionPage from './views/AllPeoplePromotion/AllPeoplePromotionPage'
import { createStackNavigator} from 'react-navigation';


type Props = {};
export default class App extends Component<Props> {

    componentDidMount() {
        //播放声音
        MusicManager.getInstance().playBGM() ;
    }


    render() {
        return (
            <RootStack/>
        );
    }
}

const RootStack = createStackNavigator(
    {
        SplashPage:{
            screen:SplashPage
        },
        LineCheckPage: {
            screen: LineCheckPage,
        },
        HomePage:{
            screen:HomePage,
        },
        GameWebView:{
            screen:GameWebView
        },
        NoAccessPage:{
            screen:NoAccessPage
        },
        MaintemancePage:{
            screen:MaintemancePage
        },
        AllPeoplePromotionPage:{
            screen:AllPeoplePromotionPage
        },
    },
    {
        initialRouteName: 'SplashPage',
        navigationOptions:{
            header:null,  //隐藏顶部导航栏
        }
    }
);

