import GBServiceParam from './GBServiceParam' //获取站点主题

// 保险箱背景色
let user_info_bg = 'rgba(17, 44, 103, 1)';
let user_info_bg_border = 'rgba(168, 244, 255, 0.3)';
// 个人信息
let IDText = '#CCDBFF'; //字
// 音乐音量
let musicSetting_bg = 'rgba(17, 40, 120, 1)';
let musicSetting_value = 'rgba(27, 110, 225, 1)';
let musicSetting_border = 'rgba(91, 117, 207, 1)';
// 输入框
let textInput_bg = 'rgba(11, 29, 98, 1)';
let textInput_border = '#8994DB';
//玩家中心
let personalMessageText = '#FFEA00';//头部信息
//消息中心
let listItem = '#fff';
let itemDate = 'rgba(125, 138, 186, 1)';
//充值中心
let containerStyle_bg = 'rgb(47,70,156)';
let shadowColor = 'rgba(14,41,95,0.6)';//输入框背景色 阴影色
let infoSubViewStyle_bg = 'rgb(41,60,135)';//充值二级窗口阴影背景
// 收益
let bgTextViewStyle_bg = '#0B2178';//输入框背景
let bgTextViewStyle_border = '#5B75CF';//边框颜色
let personalMessageText_bg = 'rgba(0,0,0, 0)';//里大框背景
//全民推广
let topTitleView = '#19328B';//搜索栏背景
let selfViewStyle = '#1FA8FF';//自身列表色
//福利记录
//列表头部颜色
let WelfareRecordListHead_bg = '#112878';//表头
let table_bg1 = '#4E5BC3';
let table_bg2 = '#3B46A6';
let tableTitleTextColor = '#fff';//表头字
let tableContentTextColor = '#D2D7FF';
// 输入框占位符
let placeholderTextColor = 'rgb(105,158,255)';

// 颜色变量统一转换
switch (GBServiceParam.skinType) {
    case 1:
        user_info_bg = 'rgba(17, 44, 103, 1)';
        user_info_bg_border = 'rgba(168, 244, 255, 0.3)';
        IDText = '#CCDBFF';
        musicSetting_bg = 'rgba(17, 40, 120, 1)';
        musicSetting_value = 'rgba(27, 110, 225, 1)';
        musicSetting_border = 'rgba(91, 117, 207, 1)';
        textInput_bg = 'rgba(11, 29, 98, 1)';
        textInput_border = '#8994DB';
        personalMessageText = '#FFEA00';
        personalMessageText_bg = 'rgba(0,0,0, 0)';
        listItem = '#fff';
        itemDate = 'rgba(125, 138, 186, 1)';
        containerStyle_bg = 'rgb(47,70,156)';
        shadowColor = 'rgba(14,41,95,0.6)';
        infoSubViewStyle_bg = 'rgb(41,60,135)';
        bgTextViewStyle_bg = '#0B2178';
        bgTextViewStyle_border = '#5B75CF';
        WelfareRecordListHead_bg = '#112878';
        table_bg1 = '#4E5BC3';
        table_bg2 = '#3B46A6';
        tableTitleTextColor = '#fff';
        tableContentTextColor = '#D2D7FF';
        topTitleView = '#19328B';
        selfViewStyle = '#1FA8FF';
        placeholderTextColor = 'rgb(105,158,255)';
        break;
    case 2:
        user_info_bg = 'rgba(34, 34, 34, 1)';
        user_info_bg_border = 'rgba(252, 206, 141, 0.5)';
        IDText = 'rgba(251, 242, 204, 1)';
        musicSetting_bg = 'rgba(32, 32, 35, 1)';
        musicSetting_value = 'rgba(206, 191, 167, 1)';
        musicSetting_border = 'rgba(244, 230, 208, 1)';
        textInput_bg = 'rgba(32, 32, 35, 1)';
        textInput_border = 'rgba(121, 111, 96, 1)';
        personalMessageText = 'rgba(205, 186, 141, 1)';
        personalMessageText_bg = 'rgba(0,0,0,0)';
        listItem = 'rgba(255, 235, 213, 1)';
        itemDate = 'rgba(180, 156, 129, 1)';
        containerStyle_bg = 'rgba(0,0,0,0.2)';
        shadowColor = 'rgba(32, 32, 35, 1)';
        infoSubViewStyle_bg = 'rgba(0,0,0,0)';
        bgTextViewStyle_bg = 'rgba(32, 32, 35, 1)';
        bgTextViewStyle_border = 'rgba(121, 111, 96, 1)';
        WelfareRecordListHead_bg = '#202023';
        table_bg1 = '#4A4B4E';
        table_bg2 = '#3A3A3D';
        tableTitleTextColor = '#FBF2CC';
        tableContentTextColor = '#FBF2CC';
        topTitleView = '#313131';
        selfViewStyle = '#958558';
        placeholderTextColor = 'white';
        break;
    case 3:
        user_info_bg = '#4A0A12';
        user_info_bg_border = '#4A0A12';
        IDText = '#F9C9CA';
        musicSetting_bg = '#3D0303';
        musicSetting_value = '#E98A1C';
        musicSetting_border = '#E07F7F';
        textInput_bg = '#3D0303';
        textInput_border = '#E07F7F';
        personalMessageText = '#FFEA00';
        personalMessageText_bg = '#952120';
        listItem = '#F9C9CA';
        itemDate = '#C4383A';
        containerStyle_bg = 'rgba(0,0,0,0.2)';//不变
        shadowColor = '#3D0303';
        infoSubViewStyle_bg = '#3D0303';
        bgTextViewStyle_bg = '#3D0303';
        bgTextViewStyle_border = '#E07F7F';
        WelfareRecordListHead_bg = '#470505';
        table_bg1 = '#C14848';
        table_bg2 = '#A02D2D';
        tableTitleTextColor = '#FEFEFE';
        tableContentTextColor = '#F9C9CA';
        topTitleView = '#701111';
        selfViewStyle = '#FF7E00';
        placeholderTextColor = '#F9C9CA';
        break;
    case 4:
        user_info_bg = '#312851';
        user_info_bg_border = '#7EB7BF';
        IDText = '#DCD3F0';
        musicSetting_bg = '#2F2255';
        musicSetting_value = '#D3B0DE';
        musicSetting_border = '#B4F5FF';
        textInput_bg = '#2F2255';
        textInput_border = '#2F2255';
        personalMessageText = '#FFEA00';
        personalMessageText_bg = 'rgba(0,0,0,0.2)';
        listItem = '#DCD3F0';
        itemDate = '#8874B7';
        containerStyle_bg = 'rgba(0,0,0,0.2)';//不变
        shadowColor = '#2F2255';
        infoSubViewStyle_bg = '#472E6E';
        bgTextViewStyle_bg = '#2F2255';
        bgTextViewStyle_border = '#9579DC';
        WelfareRecordListHead_bg = '#472A67';
        table_bg1 = '#7D55B6';
        table_bg2 = '#62389F';
        tableTitleTextColor = '#FEFEFE';
        tableContentTextColor = '#DCD3F0';
        topTitleView = '#5B3287';
        placeholderTextColor = '#D3C6FE';
        break;
    case 5:
        user_info_bg = '#001719';
        user_info_bg_border = '#004C53';
        IDText = '#A5D8DB';
        musicSetting_bg = '#0A3436';
        musicSetting_value = '#FEA000';
        musicSetting_border = '#1F9CA4';
        textInput_bg = '#073F40';
        textInput_border = '#109CA1';
        personalMessageText = '#FFEA00';
        personalMessageText_bg = 'rgba(0,0,0,0.2)';
        listItem = '#A5D8DB';
        itemDate = '#58808B';
        containerStyle_bg = 'rgba(0,0,0,0.2)';//不变
        shadowColor = '#073F40';
        infoSubViewStyle_bg = 'rgba(0,0,0,0.2)';
        bgTextViewStyle_bg = '#073F40';
        bgTextViewStyle_border = '#109CA1';
        WelfareRecordListHead_bg = '#004547';
        table_bg1 = '#219699';
        table_bg2 = '#187B7E';
        tableTitleTextColor = '#FEFEFE';
        tableContentTextColor = '#A5D8DB';
        topTitleView = '#015C5F';
        selfViewStyle = '#42C8CB';
        placeholderTextColor = '#A5D8DB';
        break;
}


export default class SkinsColor {
    static user_info_bg = user_info_bg;
    static user_info_bg_border = user_info_bg_border;
    static IDText = IDText;
    static logTime = IDText;
    static musicSetting_bg = musicSetting_bg;
    static musicSetting_value = musicSetting_value;
    static musicSetting_border = musicSetting_border;
    static textInput_bg = textInput_bg;
    static textInput_border = textInput_border;
    static personalMessageText = personalMessageText;
    static personalMessageText_bg = personalMessageText_bg;
    static listItem = listItem;
    static itemDate = itemDate;
    static containerStyle_bg = containerStyle_bg;
    static shadowColor = shadowColor;
    static infoSubViewStyle_bg = infoSubViewStyle_bg;
    static bgTextViewStyle_bg = bgTextViewStyle_bg;
    static bgTextViewStyle_border = bgTextViewStyle_border;
    static WelfareRecordDropDownNormalText = table_bg1;
    static WelfareRecordDropDownHighLight_bg = table_bg2;
    static WelfareRecordListHead_bg = WelfareRecordListHead_bg;
    static WelfareRecordList_bg = WelfareRecordListHead_bg;
    static table_bg1 = table_bg1;
    static table_bg2 = table_bg2;
    static ListBottom_bg = WelfareRecordListHead_bg;
    static tableTitleTextColor = tableTitleTextColor;
    static tableContentTextColor = tableContentTextColor;
    static topTitleView = topTitleView;
    static selfViewStyle = selfViewStyle;
    static messageTxt_bg = table_bg1;
    static placeholderTextColor = placeholderTextColor;
}