/*
*
* 描述：
* @author lee
* @create 2019-01-24 11:14 AM
*/
export default class UserInfo {
  static autoPay = false;
  static isBit = false;
  static isCash = false;
  static totalAssets = 0;
  static walletBalance = 0.00;
  static withdrawAmount = 0;
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
  static isPhone = false;//默认时区
}



