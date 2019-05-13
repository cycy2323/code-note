/** @format */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

import { YellowBox } from 'react-native';
import _ from 'lodash'
YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated']);
YellowBox.ignoreWarnings(['Setting a timer']);
YellowBox.ignoreWarnings(['ListView is deprecated']);
const _console = _.clone(console);
console.warn = message => {
    if (message.indexOf('Setting a timer') <= -1) {
        _console.warn(message);
    }
};

//打印日志信息的操作是同步的 影响性能 需要在release时替换为空函数
if (!__DEV__) {
    global.console = {
        info: () => {},
        log: () => {},
        warn: () => {},
        error: () => {},
    };
}

AppRegistry.registerComponent(appName, () => App);
