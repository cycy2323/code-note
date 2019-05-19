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
function vailNumber(){
	var number = $("#number").val().trim();
	if(isNaN(number)){
		bootbox.alert("请输入数字");
		return false;
	}
	if(strUtil.isEmpty(number)){
		bootbox.alert("数量不能为空");
		return false;
	}
	return true;
};
$("#number").blur(vailNumber);
function vailMin(){
	var minPrice = $("#min").val().trim();
	var maxPrice = $("#max").val().trim();
	if(isNaN(minPrice)){
		bootbox.alert("请输入数字");
		return false;
	}
	if(strUtil.isEmpty(minPrice)){
		bootbox.alert("价格不能为空");
		return false;
	}
	if($("#max").css("display")=="block"){
		if(eval(maxPrice)<=eval(minPrice)){
			bootbox.alert("区间价格输入错误");
			return false;
		}
	}
	return true;
};
$("#min").blur(vailMin);
function vailMax(){
	if($("#max").css("display")=="block"){
		var maxPrice = $("#max").val().trim();
		var minPrice = $("#min").val().trim();
		if(isNaN(maxPrice)){
			bootbox.alert("请输入数字");
			return false;
		}
		if(strUtil.isEmpty(maxPrice)){
			bootbox.alert("价格不能为空");
				return false;
		}
		if(eval(maxPrice)<=eval(minPrice)){
			bootbox.alert("区间价格输入错误");
			return false;
		}
	}
	return true;
};
$("#max").blur(vailMax);
$("#priceType").change(function(){
    var result = $("#priceType  option:selected").val();
    if(result==2){
		$("#max").css({'display':'block'});
    }else{
		$("#max").val("");
		$("#max").css({'display':'none'});
	}
});
$("#save").click(function(){
	if(vailNumber()&&vailMin()&&vailMax()){
		var batch = $('#batch').serializeObject();
		console.log(batch);
	}
//	$.ajax({
//		type: 'POST',
//          url: "",
//          dataType: 'json',
//          contentType: "application/json; charset=utf-8",
//          async: true,
//          data: JSON.stringify(batch),
//          success: function(result) {
//          	bootbox.alert(result.resultmsg);
//              xw.update();
//          },
//          error: function(err) {
//				bootbox.alert("服务异常");			
//          }
//	});
});