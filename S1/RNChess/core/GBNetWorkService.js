import GBServiceParam from "./GBServiceParam"
import {Platform, NativeModules, Alert, DeviceEventEmitter,NetInfo,AsyncStorage} from "react-native";
import RNFetchBlob from "react-native-fetch-blob"
import UserInfo from "./UserInfo";
import DeviceInfo from "react-native-device-info";

const AndroidNativeNetModule = NativeModules.AndroidNativeNetModule;
const GB_CURRENT_APPBUILD = DeviceInfo.getBuildNumber();
const GB_CURRENT_APPVersion = DeviceInfo.getVersion();
const uniqueId = DeviceInfo.getUniqueID();

export default class GBNetWorkService {
    static connectstatus = true;

    static checkInternetConnect()
    {
        NetInfo.isConnected.fetch().done((isConnect)=>{
            this.connectstatus = isConnect;
            console.log("网络连接:"+isConnect);
        })

        //监听网络变化事件
        NetInfo.addEventListener('connectionChange', (networkType) => {
            this.connectstatus = networkType.type != 'none' && networkType.type != 'unknown';
            console.log("网络连接变化:"+this.connectstatus);
        })
    }

    static get(url, parameter, headerParameter, successCallBack, failedCallBack) {
        if (this.connectstatus == false)
        {
            Alert.alert("无网络链接");
            failedCallBack("无网络链接");
            return;
        }
        if (parameter) {
            let paramsArray = [];
            //拼接参数
            Object.keys(parameter).forEach(key => paramsArray.push(key + '=' + parameter[key]));
            if (url.search(/\?/) === -1) {
                url += '?' + paramsArray.join('&')
            } else {
                url += '&' + paramsArray.join('&')
            }
        }
        let headers = {
            "Host": GBServiceParam.currentHost,
            "Cookie": GBServiceParam.currentCookie,
            "User-Agent": "app_" + Platform.OS+GB_CURRENT_APPVersion+GB_CURRENT_APPBUILD+"+"+uniqueId,
        };

        url = GBServiceParam.currentPreUrl + '/' + url;
        /*新建一个OBJ类型，将headers与headerParam分别以key，value的格式插入obj对象中*/
        let paramObj = Object.create(null);
        Object.keys(headers).forEach(key => paramObj[key] = headers[key]);

        /*如果headerParameter不为空，则将headerParameter拼接进去*/
        if (headerParameter) {
            Object.keys(headerParameter).forEach(key => paramObj[key] = headers[key]);
        }

        if (Platform.OS === "ios") {
            console.log("RNFetchBlob get url:" + url)
            RNFetchBlob
                .config({
                    trusty: true
                })
                .fetch("GET", url, paramObj)
                .then((response) => {
                    if (response.respInfo.status === 200) {
                        if (response.respInfo.headers.headerStatus === undefined || response.respInfo.headers.headerStatus === 200)
                        {
                            //访问成功
                            if (this.isJsonString(response.data)) {
                                //是json的话返回json对象
                                successCallBack(JSON.parse(response.data));
                            }
                            else {
                                //不是json的话返回Text
                                successCallBack(response.data);
                            }
                        }
                        else
                        {
                            this.dealErr(response.respInfo.headers.headerStatus,failedCallBack,url);
                        }
                    }
                    else {
                        //失败
                        this.dealErr(response.respInfo.status,failedCallBack,url);
                    }
                })
                .catch((error) => {
                    failedCallBack(error);
                });
        }
        else {
            AndroidNativeNetModule.get(url, headers, (responseData, header) => {
                console.log("android get:"+responseData);
                console.log("android get header:"+JSON.stringify(header));
                if (this.isJsonString(responseData)) {
                    //是json的话返回json对象
                    successCallBack(JSON.parse(responseData), header);
                }
                else {
                    //不是json的话返回Text
                    successCallBack(responseData);
                }
            }, (error,headerStatus) => {
                console.log("来处理错误信息这里了1+url=="+url)
                this.dealErr(headerStatus,failedCallBack,url);
            });
        }

    }

    static post(url, parameter, headerParameter, successCallBack, failedCallBack) {
        if (this.connectstatus == false)
        {
            Alert.alert("无网络链接");
            failedCallBack("无网络链接");
            return;
        }

        let headers = {
            "Host": GBServiceParam.currentHost,
            "Cookie": GBServiceParam.currentCookie,
            "User-Agent": "app_" + Platform.OS+GB_CURRENT_APPVersion+GB_CURRENT_APPBUILD+"+"+uniqueId,
            "X-Requested-With": "XMLHttpRequest",
            "content-type": "application/x-www-form-urlencoded"
        }
        url = GBServiceParam.currentPreUrl + '/' + url;
        /*新建一个OBJ类型，将headers与headerParam分别以key，value的格式插入obj对象中*/
        let paramObj = Object.create(null);
        Object.keys(headers).forEach(key => paramObj[key] = headers[key]);

        /*如果headerParameter不为空，则将headerParameter拼接进去*/
        if (headerParameter) {
            Object.keys(headerParameter).forEach(key => paramObj[key] = headers[key]);
        }


        if (Platform.OS === "ios") {
            let bodyStr = '';


            if (parameter) {
                for (let k of Object.keys(parameter)) {
                    bodyStr += (k + '=' + parameter[k] + '&')
                }
            }

            let publicParameter = {
                "terminal": "app_ios",
                "is_native": true,
                "version": "3.0",
                "locale": "zh_CN",
                "resolution": "2x"
            };
            for (let k of Object.keys(publicParameter)) {
                bodyStr += (k + '=' + publicParameter[k] + '&')
            }
            bodyStr = bodyStr.substring(0, bodyStr.length - 1);

            let responseHeader = {"Set-Cookie": ""};

            var pmregister = new RegExp("captcha/pmregister.html").test(url);
            var securityPwd = new RegExp("captcha/securityPwd.html").test(url);
            var code = new RegExp("captcha/code.html").test(url);
            console.log("完整路径="+url+" Host："+GBServiceParam.currentHost)

            if (pmregister || securityPwd || code) {
                RNFetchBlob
                    .config({
                        trusty: true
                    })
                    .fetch('POST', url, paramObj, JSON.stringify(parameter))
                    .then((response) => {
                        successCallBack(response.data);
                    })
                    .catch((error) => {
                        failedCallBack(error);
                    });
            }
            else {
                RNFetchBlob
                    .config({
                        trusty: true
                    })
                    .fetch('POST', url, paramObj, bodyStr)
                    .then((response) => {
                        if (response.respInfo.status === 200) {
                            if (response.respInfo.headers.headerStatus == undefined || response.respInfo.headers.headerStatus === 200)
                            {
                                //访问成功
                                String.prototype.startWith = function (startStr) {
                                    var d = this.length - startStr.length;
                                    return (d >= 0 && this.indexOf(startStr) == 0)
                                }

                                String.prototype.endWith = function (endStr) {
                                    var d = this.length - endStr.length;
                                    return (d >= 0 && this.lastIndexOf(endStr) == d)
                                }

                                String.prototype.LTrim = function()
                                {
                                    return this.replace(/(^\s*)/g, "");
                                }

                                console.log("RNFetchBlob post response:" + JSON.stringify(response));
                                let cookieString = response.respInfo.headers["Set-Cookie"];
                                console.log("RNFetchBlob cookie:"+cookieString);
                                if (cookieString)
                                {
                                    let setCookieArray = cookieString.split(",");
                                    for (let i = 0; i < setCookieArray.length; i++) {
                                        if ((setCookieArray[i].startWith(" SID=") || setCookieArray[i].startWith("SID=")) && setCookieArray[i].endWith("HttpOnly")) {
                                            responseHeader = {"Set-Cookie": setCookieArray[i].LTrim()};
                                        }
                                    }
                                }

                                if (this.isJsonString(response.data)) {
                                    //是json的话返回json对象
                                    successCallBack(JSON.parse(response.data), responseHeader);
                                }
                                else {
                                    //不是json的话返回Text
                                    successCallBack(response.data, responseHeader);
                                }
                            }
                            else
                            {
                                this.dealErr(response.respInfo.headers.headerStatus,failedCallBack,url);
                            }
                        }
                        else {
                            //失败
                            this.dealErr(response.respInfo.status,failedCallBack,url);
                        }
                    })
                    .catch((error) => {
                        failedCallBack(error);
                    });
            }

        }
        else {
            let publicParameter = {
                "terminal": "app_android",
                "is_native": true,
                "version": "3.0",
                "locale": "zh_CN",
                "theme": "black",
                "resolution": "xxhdpi"
            };
            //todo 合并
            /*新建一个OBJ类型，将headers与headerParam分别以key，value的格式插入obj对象中*/
            let bodyParm = Object.create(null);
            if (parameter) {
                Object.keys(parameter).forEach(key => bodyParm[key] = parameter[key]);
            }
            Object.keys(publicParameter).forEach(key => bodyParm[key] = publicParameter[key]);
            AndroidNativeNetModule.post(url, headers, bodyParm, (responseData, header) => {
                console.log("android post:"+responseData);
                console.log("android post header:"+JSON.stringify(header));

                if (this.isJsonString(responseData)) {
                    //是json的话返回json对象
                    successCallBack(JSON.parse(responseData), header);
                }
                else {
                    //不是json的话返回Text
                    successCallBack(responseData);
                }
            }, (error,headerStatus) => {
                console.log("来处理错误信息这里了+url=="+url+"错误体2"+JSON.stringify(error))
                this.dealErr(headerStatus,failedCallBack,url);
                // failedCallBack(error);
            });
        }
    }

    //判断字符串是否为json格式
    static isJsonString(string) {
        if (typeof string == 'string') {
            try {
                var obj = JSON.parse(string);
                if (typeof obj == 'object' && obj) {
                    return true;
                } else {
                    return false;
                }

            } catch (e) {
                return false;
            }
        }
        else {
            return false;
        }
    }

    static fetchCookie() {
        let headers = {
            "Host": GBServiceParam.currentHost,
            "User-Agent": "app_" + Platform.OS+GB_CURRENT_APPVersion+GB_CURRENT_APPBUILD+"+"+uniqueId,
            "X-Requested-With": "XMLHttpRequest",
            "content-type": "application/x-www-form-urlencoded",
            "Cookie":""
        }
        let url = GBServiceParam.currentPreUrl + "/mobile-api/origin/getHttpCookie.html?v="+(new Date()).valueOf();
        if (Platform.OS === "ios") {

            RNFetchBlob
                .config({
                    trusty: true
                })
                .fetch("GET", url, headers)
                .then((response) => {
                    console.log("fetch cookie resp:"+JSON.stringify(response))

                    String.prototype.startWith = function (startStr) {
                        var d = this.length - startStr.length;
                        return (d >= 0 && this.indexOf(startStr) == 0)
                    }

                    String.prototype.endWith = function (endStr) {
                        var d = this.length - endStr.length;
                        return (d >= 0 && this.lastIndexOf(endStr) == d)
                    }

                    String.prototype.LTrim = function()
                    {
                        return this.replace(/(^\s*)/g, "");
                    }

                    let cookieString = response.respInfo.headers["Set-Cookie"];
                    console.log("fetch cookie sss:"+cookieString)
                    let setCookieArray = cookieString.split(",");
                    for (let i = 0; i < setCookieArray.length; i++) {
                        if ((setCookieArray[i].startWith(" SID=") || setCookieArray[i].startWith("SID=")) && setCookieArray[i].endWith("HttpOnly")) {
                            GBServiceParam.currentCookie = setCookieArray[i].LTrim();
                        }
                    }
                    console.log("fetch cookie:"+GBServiceParam.currentCookie)
                })
                .catch((error) => {
                });
        }
        else {
            AndroidNativeNetModule.get(url, headers, (responseData, header) => {
                // console.log("android ok:"+responseData);
                // console.log("android header cookie:"+header["Set-Cookie"]);
                GBServiceParam.currentCookie = header["Set-Cookie"];
            }, (error,headerStatus) => {
                console.log("来处理错误信息这里了+url=="+url+"错误体1"+JSON.stringify(error))
                this.dealErr(headerStatus,null,url);
            });
        }
    }

    static dealErr(statusCode, failedCallBack,url) {
        let errMsg = "网络连接错误"+statusCode;

        if (statusCode == 403) {
            errMsg = "无权限访问"
        }
        else if (statusCode == 404) {
            errMsg = "请求链接或页面找不到"
        }
        else if (statusCode == 500) {
            errMsg = "代码错误"
        }
        else if (statusCode == 502) {
            errMsg = "网络连接错误"
        }
        else if (statusCode == 600) {
            errMsg = "session已过期"
        }
        else if (statusCode == 601) {
            errMsg = "需要输入安全密码"
        }
        else if (statusCode == 602) {
            errMsg = "服务忙"
        }
        else if (statusCode == 603) {
            errMsg = "域名不存在"
        }
        else if (statusCode == 604) {
            errMsg = "临时域名过期"
        }
        //在首页已处理
        // else if (statusCode == 605) {
        //     errMsg = "ip被限制 605"
        // }
        else if (statusCode == 606) {
            errMsg = "您的账号在其他设备登录"
            UserInfo.isLogin = false;
            UserInfo.username = null;
            UserInfo.withdrawAmount = null;
            if (url.search('mobile-api/mineOrigin/logout.html')==-1){
                if (UserInfo.loginViewShowTimes==0){
                    DeviceEventEmitter.emit('rn_login_out');
                }
            }
            GBServiceParam.currentCookie=''
            //重新获取cookie
            this.fetchCookie();
        }
        //在首页已处理
        // else if (statusCode == 607) {
        //     errMsg = "站点维护 607"
        // }
        else if (statusCode == 608) {
            errMsg = "重复请求"
        }
        else if (statusCode == 609) {
            errMsg = "站点不存在"
        }
        else if (statusCode == 1001) {
            errMsg = "请先登录"
            UserInfo.isLogin = false;
            UserInfo.username = null;
            UserInfo.withdrawAmount = null;
            if (url.search('mobile-api/mineOrigin/logout.html')==-1){
                if (UserInfo.loginViewShowTimes==0){
                    DeviceEventEmitter.emit('rn_login_out');
                }
            }
            GBServiceParam.currentCookie=''

            //重新获取cookie
            this.fetchCookie();
        }
        //为了防止同事弹出多个alert
        if (UserInfo.loginViewShowTimes==0){
            UserInfo.loginViewShowTimes=1;
            Alert.alert(errMsg,
                "",
                [
                    {text: 'OK', onPress: () =>UserInfo.loginViewShowTimes=0},
                ],);
        }
        if (failedCallBack!=null) {
            failedCallBack(errMsg,statusCode);
        }

    }

}