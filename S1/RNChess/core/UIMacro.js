import {Dimensions} from 'react-native';
const w=Dimensions.get('window').width;
const h=Dimensions.get('window').height;
const W=w>h?w:h;
const H=w>h?h:w;

export default class UIMacro {
    static SCREEN_WIDTH=W;
    static SCREEN_HEIGHT=H;
    static HEIGHT_PERCENT=H/375.0;
    static WIDTH_PERCENT=H/375.0;
    static SCREEN_FULL_PERCENT=W/667.0;
}