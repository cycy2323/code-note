//工具函数
var strUtil = {
    /*
     * 判断字符串是否为空
     */
    isEmpty:function(str){
        if(str == null||str.length == 0){
            return true;
        }else{
            return false;
        }
    }
}
function vailContent(){
	var content = $("#content").val();
	if(strUtil.isEmpty(content)){
		bootbox.alert("系统通知内容不能为空");
		return false;
	}
	return true;
};
$("#send").click(function(){
	if(vailContent()){
		var sysNotice = $("#sysNotice").serializeObject();
		console.log(content);
		$.ajax({
			type: 'POST',
            url: "/bd/sys/pbsns.do",
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            async: true,
            data: JSON.stringify(sysNotice),
            success: function(result) {
            	bootbox.alert(result.msg);
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
});