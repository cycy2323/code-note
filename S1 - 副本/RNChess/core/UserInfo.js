export default class UserInfo {
    static autoPay = false;
    static isBit = false;
    static isCash = false;
    static totalAssets = 0;
    static walletBalance = 0.00;
    static withdrawAmount = 0.00;
    static transferAmount = 0;
    static preferentialAmount=null;
    static btc = null;
    static bankcard = null;
    static recomdAmount = null;
    static username = '';
    static avatarUrl =  '';
    static lastLoginTime = "";
    static loginTime = null;
    static currency = '';
    static realName = '';
    static userSex = '';
    static bankList = [];
    static isLogin = false;  //是否登录
    static saftyKoken = '';
    static hasRealName = false;
    static hasPermissionPwd = false;
    static voice = 0.0 ;  //背景音乐音量
    static voice1 = 0.0 ;  //背景音乐音量
    static customerUrl = ''; //客服链接
    static isInlay = false ; // 联系客服是否APP内打开（true为跳转web 否则跳转外部浏览器）
    static loginViewShowTimes = 0 ;//主要用来处理被挤下线有多个接口会重复发送通知然后弹出登录页面
    static timeZone = "GMT+08:00";//默认时区
    static isPhone = false;//是否打开手机开关
    static regCode = '';//推荐码
    static isSuccessChaCode = false  //玩家中心登录密码

    static isDot =(num) => { //判断是否有小数点
        if(num!==undefined && num!==null && num!==''){
            var result = (num.toString()).indexOf(".");
            if(result !== -1) {
                return parseFloat(num).toFixed(2);
            } else {
                return num+'.00';
            }
        }else{
            return '0.00';
        }
    }
}


