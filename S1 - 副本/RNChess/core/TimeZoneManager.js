
export default class TimeZoneManager {

    constructor() {
        this.instance = null;
        this.timeZone = "GMT+08:00";//默认东八区
    }

    static getInstance() {
        if(!this.instance) {
            this.instance = new TimeZoneManager();
        }
        return this.instance;
    }

    // 时间戳转换
    stringFromTimestamp(timestamp){
        // console.log('时间戳１',timestamp)
        // 当前时区
        let timeZone=this.timeZone.slice(3,6)*1
        // 时区差
        let hoursCount=timeZone-8
        // console.log('时间差',hoursCount)
        let date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
        let h=date.getHours();
        let newDate=date.setHours(h+hoursCount); //调整时时区
        // console.log('时间戳2',newDate)
        let nowDate=new Date(newDate)
        let Y = nowDate.getFullYear() + '-';
        let M = (nowDate.getMonth()+1 < 10 ? '0'+(nowDate.getMonth()+1) : nowDate.getMonth()+1) + '-';
        let D = nowDate.getDate() < 10 ?'0'+nowDate.getDate()+' ':nowDate.getDate()+' ';
        h = (nowDate.getHours() < 10 ? '0' + nowDate.getHours() : nowDate.getHours()) + ':';
        let m = (nowDate.getMinutes() < 10 ? '0' + nowDate.getMinutes() : nowDate.getMinutes()) + ':';
        let s = nowDate.getSeconds() < 10 ? '0' + nowDate.getSeconds() : nowDate.getSeconds();
        return Y+M+D+h+m+s;
    };

    // 时间戳转换---带斜杠
    stringFromTimestampXieGang(timestamp){
        // console.log('时间戳１',timestamp)
        // 当前时区
        let timeZone=this.timeZone.slice(3,6)*1
        // 时区差
        let hoursCount=timeZone-8
        // console.log('时间差',hoursCount)
        let date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
        let h=date.getHours();
        let newDate=date.setHours(h+hoursCount); //调整时时区
        // console.log('时间戳2',newDate)
        let nowDate=new Date(newDate)
        let Y = nowDate.getFullYear() + '/';
        let M = (nowDate.getMonth()+1 < 10 ? '0'+(nowDate.getMonth()+1) : nowDate.getMonth()+1) + '/';
        let D = nowDate.getDate() < 10 ?'0'+nowDate.getDate()+' ':nowDate.getDate()+' ';
        return Y+M+D;
    };
}