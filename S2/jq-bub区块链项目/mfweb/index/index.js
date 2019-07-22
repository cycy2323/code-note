var indexInfo = function(){
    $.ajax({
        type: 'POST',
        url: "/mf/use/pbiis.do",
        dataType: 'json',
        contentType: "application/json;charset=utf-8",
        async: false,
        data:'',
        success: function(data) {
            // //判断session超时
            if(data.err_code==599){
                bootbox.alert("session超时,请重新登陆",function(){
                    window.location.replace("/login.html");
                });
            }
            if(data.resultcode==1){
                var netAccount = 0;
                var orders = 0;
                var payNumbers = 0;
                var poundageAccount = 0;
                var pendingOrder = '无';
                if(data.netAccount !=  undefined) {
                    netAccount = data.netAccount;
                }
                if(data.orders !=  undefined) {
                    orders = data.orders;
                }
                if(data.payNumbers !=  undefined) {
                    payNumbers = data.payNumbers;
                }
                if(data.poundageAccount != undefined) {
                    poundageAccount = data.poundageAccount;
                }
                if(data.pendingOrder != undefined&&data.pendingOrder!=0) {
                    pendingOrder = data.pendingOrder;
                }
                $('#pendingOrder').html(pendingOrder);
                $('#netaccount').html(netAccount);
                $('#orders').html(orders);
                $('#paynumbers').html(payNumbers);
                $('#poundageaccount').html(poundageAccount);
            }
        },
        error: function(err) {
            if(err.status==406||err.status==401){
                window.location.replace("/login.html");
            }else{
                bootbox.alert("服务器繁忙,请稍后再试", function() {
                    location.reload();
                });
            }
        }
    });
}();
//防止页面后退
history.pushState(null, null, document.URL);
window.addEventListener('popstate', function () {
    history.pushState(null, null, document.URL);
});