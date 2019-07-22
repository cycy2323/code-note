var OtcAdvBas = function() {
    var enumStatus = {'1':'上架中','2':'已下架','3':'售罄'};//广告状态  1-出售中2-已下架 3-售罄
    var enumAmountType ={'1':'限额','2':'固额'}; //AMOUNT_TYPE
    var enumType = {'1':'买','2':'卖'};// 类型 1:买 2:卖
    var enumPaymentWay = {'1':'微信','2':'支付宝','3':'银行卡'};//PAYMENT_WAY 支付方式  1.微信 2.支付宝 3.银行卡 多种用,隔开
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

        paymentWayStrFormat :{//多个 类型，用逗号分割
            f:function(val){
                var resultstr ='';
                if(val){
                    if(val.indexOf(",") != -1){
                        $.each(val.split(','), function(index, code) {
                            if(enumPaymentWay[code]) {
                                resultstr += enumPaymentWay[code] + ",";
                            }
                        })
                    }else{
                        resultstr += enumPaymentWay[val];
                    }
                }else{
                    resultstr +="--";
                }
                return resultstr;
            }
        },
        advertStatusFormat:{
            f:function(val){
                if(val == '1'){
                    return '<span style="color:#45b6af;">'+enumStatus[val]+'</span>';
                }else if(val == '2'){
                    return '<span style="color:#999;">'+enumStatus[val]+'</span>';
                }else if(val == '3'){
                    return '<span style="color:#167cf9;">'+enumStatus[val]+'</span>';
                }else{
                    return "--";
                }
            }
        },
        amountTypeFormat:{
            f:function(val,row){
                var returnstr = '';
                if(val == '1'){//限额
                    var minamount = '',maxamount = '';
                    if(row.limitMinAmount){
                        minamount  = row.limitMinAmount;
                    }else{
                        minamount = '--';
                    }
                    if(row.limitMaxAmount){
                        maxamount = row.limitMaxAmount;
                    }else{
                        maxamount = '--';
                    }
                    returnstr += enumAmountType[val]+":"+minamount+"~"+maxamount;

                }else if(val == '2'){//固额
                    var fixedamount = '';
                    if(row.fixedAmount){
                        fixedamount = row.fixedAmount;
                    }else{
                        fixedamount ='--';
                    }
                    returnstr += enumAmountType[val]+":"+fixedamount;
                }else{
                    returnstr +='--';
                }
                return returnstr;
            }
        },
        typeFormat :{
            f:function(val){
                return enumType[val];
            }
        },


        init: function(xwajson) {



        }
    }
}();
