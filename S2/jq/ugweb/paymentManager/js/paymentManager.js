//初始化
$(function(){
	$.ajax({
        type: 'POST',
        url: "/mf/pay/pbpws.do",
        dataType: 'json',
        contentType: "application/json;charset=utf-8",
        data:'',
        success: function(result) {
			// console.log(result);
			var sweepPay = result.sweepPay;
			if(sweepPay==0){
				$('#sweepIsAccess').hide();
				$('#sweepAccess').show();
			}else{
				$('#sweepIsAccess').show();
				$('#sweepAccess').hide();
			}
			var webpagePay = result.webpagePay;
			if(webpagePay==0){
				$('#webIsAccess').hide();
				$('#webAccess').show();
			}else{
				$('#webIsAccess').show();
				$('#webAccess').hide();
			}
			var appPay = result.appPay;
			if(appPay==0){
				$('#appIsAccess').hide();
				$('#appAccess').show();
			}else{
				$('#appIsAccess').show();
				$('#appAccess').hide();
			}
        },
        error: function() {
            bootbox.alert("接口异常");
            // window.location="login.html"
        }
    });
});
/**支付方式接入 1-扫码支付 2-H5支付 3-APP支付*/
var paymentAccess = function(type){
	var param = {};
	param["type"] = type;
	$.ajax({
        type: 'POST',
        url: "/mf/pay/pbpaa.do",
        dataType: 'json',
        contentType: "application/json;charset=utf-8",
        data:JSON.stringify(param),
        success: function(result) {
			bootbox.alert(result.msg,function(){
				location.reload();
			});
        },
        error: function() {
            bootbox.alert("接口异常");
            // window.location="login.html"
        }
    });
};
/**扫码支付接入 */
$('#sweepAccess').click(function(){
	var sweepText = $('#sweepText').text();
	bootbox.confirm({
        buttons: {
			confirm: {
                label: '确认',
                className: 'blue'
            },
			cancel: {
                label: '取消',
                className: 'btn-default'
            }
        },
        message: "确认接入"+sweepText,
        callback:function(result){
			if(result){
				paymentAccess(1);
			}else{
				return;
			}
        }
		
	});
});
/**H5支付接入 */
$('#webAccess').click(function(){
	var webText = $('#webText').text();
	bootbox.confirm({
        buttons: {
			confirm: {
                label: '确认',
                className: 'blue'
            },
			cancel: {
                label: '取消',
                className: 'btn-default'
            }
        },
        message: "确认接入"+webText,
        callback:function(result){
			if(result){
				paymentAccess(2);
			}else{
				return;
			}
        }
	});
});
/**app支付接入 */
$('#appAccess').click(function(){
	var appText = $('#appText').text();
	bootbox.confirm({
        buttons: {
			confirm: {
                label: '确认',
                className: 'blue'
            },
			cancel: {
                label: '取消',
                className: 'btn-default'
            }
        },
        message: "确认接入"+appText,
        callback:function(result){
			if(result){
				paymentAccess(3);
			}else{
				return;
			}
        }
		
	});
});