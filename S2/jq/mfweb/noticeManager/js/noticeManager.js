/**初始化页面 */
$(function(){
    $.ajax({
        type: 'POST',
        url: "/mf/use/pbuis.do",
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        async: true,
        data: '',
        success: function(result) {
            // //判断session超时
            // if(result.resultcode==5){
            //     bootbox.alert("session超时,请重新登陆",function(){
            //         $.removeCookie('userinfo');
            //         location.href= "login.html";
            //     });
            // }
            if(result.newOrderInform==0){
                $('#new_order_inform_value').val(0);
                $('#new_order_inform').css("background","url('noticeManager/images/close.png') no-repeat left 50% top 50%");
            }else{
                $('#new_order_inform_value').val(1);
                $('#new_order_inform').css("background","url('noticeManager/images/open.png') no-repeat left 50% top 50%");
            }
            if(result.systemInform==0){
                $('#system_inform_value').val(0);
                $('#system_inform').css("background","url('noticeManager/images/close.png') no-repeat left 50% top 50%");
            }else{
                $('#system_inform_value').val(1);
                $('#system_inform').css("background","url('noticeManager/images/open.png') no-repeat left 50% top 50%");
            }
            if(result.withdrawalAccountInform==0){
                $('#withdrawal_account_inform_value').val(0);
                $('#withdrawal_account_inform').css("background","url('noticeManager/images/close.png') no-repeat left 50% top 50%");
            }else{
                $('#withdrawal_account_inform_value').val(1);
                $('#withdrawal_account_inform').css("background","url('noticeManager/images/open.png') no-repeat left 50% top 50%");
            }
            if(result.mobileInform==0){
                $('#mobile_inform_value').val(0);
                $('#mobile_inform').css("background","url('noticeManager/images/close.png') no-repeat left 50% top 50%");
            }else{
                $('#mobile_inform_value').val(1);
                $('#mobile_inform').css("background","url('noticeManager/images/open.png') no-repeat left 50% top 50%");
            }
            if(result.emailInform==0){
                $('#email_inform_value').val(0);
                $('#email_inform').css("background","url('noticeManager/images/close.png') no-repeat left 50% top 50%");
            }else{
                $('#email_inform_value').val(1);
                $('#email_inform').css("background","url('noticeManager/images/open.png') no-repeat left 50% top 50%");
            }
            if(result.webpageInform==0){
                $('#webpage_inform_value').val(0);
                $('#webpage_inform').css("background","url('noticeManager/images/close.png') no-repeat left 50% top 50%");
            }else{
                $('#webpage_inform_value').val(1);
                $('#webpage_inform').css("background","url('noticeManager/images/open.png') no-repeat left 50% top 50%");
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
});
/**开启或关闭通知 */
var openOrCloseInform = function(type,status){
    var param = {};
    param["type"] = type;
    param["status"] = status;
    $.ajax({
        type: 'POST',
        url: "/mf/use/pbuus.do",
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        async: true,
        data: JSON.stringify(param),
        success: function(result) {
            bootbox.alert(result.resultmsg);
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
}
$('#new_order_inform').click(function(){
    var new_order_inform_value = $('#new_order_inform_value').val();
    if(new_order_inform_value==0){
        $("#new_order_inform").css("background","url('noticeManager/images/open.png') no-repeat left 50% top 50%");
        openOrCloseInform(1,1);
        $('#new_order_inform_value').val(1);
    }else{
        $("#new_order_inform").css("background","url('noticeManager/images/close.png') no-repeat left 50% top 50%");
        openOrCloseInform(1,0);
        $('#new_order_inform_value').val(0);
    }
    
});
$('#system_inform').click(function(){
    var system_inform_value = $('#system_inform_value').val();
    if(system_inform_value==0){
        $("#system_inform").css("background","url('noticeManager/images/open.png') no-repeat left 50% top 50%");
        openOrCloseInform(2,1);
        $('#system_inform_value').val(1);
    }else{
        $("#system_inform").css("background","url('noticeManager/images/close.png') no-repeat left 50% top 50%");
        openOrCloseInform(2,0);
        $('#system_inform_value').val(0);
    }
});
$('#withdrawal_account_inform').click(function(){
    var withdrawal_account_inform_value = $('#withdrawal_account_inform_value').val();
    if(withdrawal_account_inform_value==0){
        $("#withdrawal_account_inform").css("background","url('noticeManager/images/open.png') no-repeat left 50% top 50%");
        openOrCloseInform(3,1);
        $('#withdrawal_account_inform_value').val(1);
    }else{
        $("#withdrawal_account_inform").css("background","url('noticeManager/images/close.png') no-repeat left 50% top 50%");
        openOrCloseInform(3,0);
        $('#withdrawal_account_inform_value').val(0);
    }
});
$('#mobile_inform').click(function(){
    var mobile_inform_value = $('#mobile_inform_value').val();
    if(mobile_inform_value==0){
        $("#mobile_inform").css("background","url('noticeManager/images/open.png') no-repeat left 50% top 50%");
        openOrCloseInform(4,1);
        $('#mobile_inform_value').val(1);
    }else{
        $("#mobile_inform").css("background","url('noticeManager/images/close.png') no-repeat left 50% top 50%");
        openOrCloseInform(4,0);
        $('#mobile_inform_value').val(0);
    }
});
$('#email_inform').click(function(){
    var email_inform_value = $('#email_inform_value').val();
    if(email_inform_value==0){
        $("#email_inform").css("background","url('noticeManager/images/open.png') no-repeat left 50% top 50%");
        openOrCloseInform(5,1);
        $('#email_inform_value').val(1);
    }else{
        $("#email_inform").css("background","url('noticeManager/images/close.png') no-repeat left 50% top 50%");
        openOrCloseInform(5,0);
        $('#email_inform_value').val(0);
    }
});
$('#webpage_inform').click(function(){
    var webpage_inform_value = $('#webpage_inform_value').val();
    if(webpage_inform_value==0){
        $("#webpage_inform").css("background","url('noticeManager/images/open.png') no-repeat left 50% top 50%");
        openOrCloseInform(6,1);
        $('#webpage_inform_value').val(1);
    }else{
        $("#webpage_inform").css("background","url('noticeManager/images/close.png') no-repeat left 50% top 50%");
        openOrCloseInform(6,0);
        $('#webpage_inform_value').val(0);
    }
});
