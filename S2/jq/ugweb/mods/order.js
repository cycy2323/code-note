var OtcOrdBas = function() {
    var enumPaymentWay = {'1':'微信','2':'支付宝','3':'银行卡'};//PAYMENT_WAY 订单的支付方式  1.微信 2.支付宝 3.银行卡
    var enumStatus ={'1':'等待买方付款','2':'待放行','3':'已完成（已放行）','4':'已取消','5':'已关闭(自动)','6':'申诉中','7':'申诉成功','8':'申诉失败'} ;//订单状态 1.未付款 2.已付款3.已完成4.已取消5.已关闭(自动 )6.申诉中
    var enumIsEvaluation ={'1':'已评价','2':'未评价'};
   
    // var bankNameHelper ;
    return {
        // PAYMENT_WAY 订单的支付方式
        paymentWayFormat :{
            f:function(val){
                if(val){
                    return enumPaymentWay[val];
                }else{
                    return "--";
                }
            }
        },
        orderStatusFormat:{
            f:function(val){
                if(val == '6'){
                    return '<span style="color:#f9c116;">'+enumStatus[val]+'</span>';
                }else if(val == '4'){
                    return '<span style="color:#999;">'+enumStatus[val]+'</span>';
                }else if(val == '2'){
                    return '<span style="color:#167cf9;">'+enumStatus[val]+'</span>';
                }else if(val == '3'){
                    return '<span style="color:#0cc2aa;">'+enumStatus[val]+'</span>';
                }else if (val =='1'){
                    return '<span style="color:#df2d2d">'+enumStatus[val]+'</span>';
                }else if(val){
                    return enumStatus[val];
                }else{
                    return "--";
                }
            }
        },
        orderIsEvaluation:{
            f:function(val){
                return enumIsEvaluation[val];
            }
        },

        copyCycleFormat: {
            f: function(val){
                return enumCopyCycle[val];
            },
        },

    	bookTypeFormat:{
            f: function(val){
                return enumBookType[val];
            },
        },
        advPaymentWayFormat :{
            f:function(val){
                var val_arr = new Array();
                if(val){
                    val_arr = val.split(",");
                }
                if(val_arr && val_arr.length > 0){
                    var returnstr ='';
                    for(var j=0;j<val_arr.length;j++){
                        var namestr = val_arr[j];
                        returnstr += ","+ enumPaymentWay[namestr];
                    }
                    return returnstr;
                }else{
                    return "--";
                }
            }
        },
        checkStrong :function(sPW){
            if (sPW.length < 8||sPW.length > 16){
                return 0; //密码太短或太长
            }
            Modes = 0;
            for (i = 0; i < sPW.length; i++) {
                //测试每一个字符的类别并统计一共有多少种模式.
                Modes |= CharMode(sPW.charCodeAt(i));
            }
            return bitTotal(Modes);
        },
        CharMode:function(iN){
            if (iN >= 48 && iN <= 57) //数字
                return 1;
            if (iN >= 65 && iN <= 90) //大写字母
                return 2;
            if (iN >= 97 && iN <= 122) //小写
                return 4;
            else
                return 8; //特殊字符
        },
        bitTotal:function(num){
            modes = 0;
            for (i = 0; i < 4; i++) {
                if (num & 1) modes++;
                num >>>= 1;
            }
            return modes;
        },

        init: function(xwajson) {



        }
    }
}();