var xw;
var isVali = function (val) {
	return {
        f: function (val) {
        	if(val==0){
            	return "未验证";
		    }else if(val==1){
		    	return "已验证"
		    }else{
		    	return "-";
		    }
        }
    }
}();
var isSafe = function (val) {
	return {
        f: function (val) {
        	if(val==0){
            	return "关";
		    }else if(val==1){
		    	return "开"
		    }else{
		    	return "-";
		    }
        }
    }
}();
var isGoogle = function (val) {
	return {
        f: function (val) {
        	if(val==0){
            	return "未验证";
		    }else if(val==1){
		    	return "已验证"
		    }else{
		    	return "-";
		    }
        }
    }
}();
var UserInfoAction = function () {
    return {
        init: function () {
            this.reload();
        },
        reload: function () {
            $('#divtable').html('');
            xw = XWATable.init(
                {
                    divname: "divtable",
                    //----------------table的选项-------
                    pageSize: 50,
                    columnPicker: true,
                    transition: 'fade',
                    checkboxes: true,
                    checkAllToggle: true,
                    //----------------基本restful地址---
                    restbase: 'txtpsuser?sort=-modifiedTime',
                    key_column: 'txTpsUserId',
                    coldefs: [
                        {
                            col: "txTpsUserId",
                            friendly: "用户ID",
                            unique: "true",
                            hidden: false,
                            nonedit: "nosend",
                            index: 1
                        },
                        {
                            col: "email",
                            friendly: "邮箱",
                            inputbuilder: "valiEmailBuilder",
                            index: 2
                        },
                        {
                            col: "valiEmail",
                            friendly: "邮箱是否验证",
                            validate:"required",
                            format: isVali,
                            inputsource: "custom",
                            inputbuilder: "valiEmailBuilder",
                            index: 3
                        },
                        {
                            col: "mobile",
                            friendly: "手机号",
                            validate:"required",
                            index: 4
                        },
                        {
                            col: "valiMobile",
                            friendly: "手机号是否验证",
                            validate:"required",
                            format: isVali,
                            index: 5
                        },
                        {
                            col: "realName",
                            friendly: "真实姓名",
                            validate:"required",
                            index: 6
                        },
                        {
                            col: "idNumber",
                            friendly: "身份证号",
                            validate:"required",
                            index: 7
                        },
                        {
                            col: "valiIdNumber",
                            friendly: "是否实名认证",
                            format: isVali,
                            inputbuilder: "valiIdNumberBuilder",
                            index: 8
                        },
//                      {
//                          col: "countryCode",
//                          friendly: "国家区号",
//                          index: 9
//                      },
                        {
                            col: "isTrPwd",
                            friendly: "是否设置支付密码",
                            format: isVali,
                            inputbuilder: "isTrPwdBuilder",
                            index: 10
                        },
                        {
                            col: "safeVerifySwitch",
                            friendly: "安全验证开关",
                            format: isSafe,
                            index: 11
                        },
                        {
                            col: "valiGooglesecret",
                            friendly: "是否谷歌验证",
                            format: isGoogle,
                            index: 12
                        },
//                      {
//                          col: "createdTime",
//                          friendly: "创建时间",
//                          nonedit: "nosend",
//                          readonly: "readonly",
//                          index: 13
//                      },
                        {
                            col: "modifiedTime",
                            friendly: "变更时间",
                            nonedit: "nosend",
                            readonly: "readonly",
                            index: 14
                        }
                    ],
                    // 查询过滤条件
                    findFilter: function () {
                        var find_userid,find_email,find_mobile,select_valiEmail,select_valiMobile,select_valiIdNumber,select_isTrPwd,
                        verifySwitch,select_google,find_name;
                        if($('#find_userid').val()) {
                            find_userid = RQLBuilder.like("txTpsUserId", $.trim($('#find_userid').val()));
                        }
                        if($('#find_email').val()) {
                            find_email = RQLBuilder.like("email", $.trim($('#find_email').val()));
                        }
                        if($('#find_mobile').val()) {
                            find_mobile = RQLBuilder.like("mobile", $.trim($('#find_mobile').val()));
                        }
                        if($('#select_valiEmail').val()) {
                            select_valiEmail = RQLBuilder.equal("valiEmail", $.trim($('#select_valiEmail').val()));
                        }
                        if($('#select_valiMobile').val()) {
                            select_valiMobile = RQLBuilder.equal("valiMobile", $.trim($('#select_valiMobile').val()));
                        }
                        if($('#select_valiIdNumber').val()) {
                            select_valiIdNumber = RQLBuilder.equal("valiIdNumber", $.trim($('#select_valiIdNumber').val()));
                        }
                        if($('#select_isTrPwd').val()) {
                            select_isTrPwd = RQLBuilder.equal("isTrPwd", $.trim($('#select_isTrPwd').val()));
                        }
                        if($('#verifySwitch').val()) {
                            verifySwitch = RQLBuilder.equal("safeVerifySwitch", $.trim($('#verifySwitch').val()));
                        }
                        if($('#select_google').val()) {
                        	select_google = RQLBuilder.equal("valiGooglesecret", $.trim($('#select_google').val()));
                        }
                        if($('#find_name').val()) {
                        	find_name = RQLBuilder.equal("realName", $.trim($('#find_name').val()));
                        }
                        var filter = RQLBuilder.and([
                            find_userid,find_email,find_mobile,select_valiEmail,select_valiMobile,select_valiIdNumber,select_isTrPwd,
                            verifySwitch,select_google,find_name
                        ]);
                        xw.setRestURL(hzq_rest + 'txtpsuser');
                        return filter.rql();
                    },

                    onAdded: function(ret,jsondata){
                        return  validateForm(jsondata);
                    },
                    onUpdated: function(ret,jsondata){
                        return  validateForm(jsondata);
                    },
                    onDeleted: function(ret,jsondata){
                    },
                })
        }
    }
}();
//取消清除模态框 缓存(修改)  
$("#user_update").on("hidden.bs.modal", function() {
	$('#edit_user_info')[0].reset();
});
//取消清除模态框 缓存(查看) 
$("#user_select").on("hidden.bs.modal", function() {
	$('#select_user_info')[0].reset();
});
//高级搜索
$('#more_button').click(function(){
	$(".senior").toggle();
	
	if($("#more_button i").hasClass("fa fa-chevron-down")){
		$("#more_button i").removeClass("fa fa-chevron-down").addClass("fa fa-chevron-up");
	}else{
		$("#more_button i").removeClass("fa fa-chevron-up").addClass("fa fa-chevron-down");
	}
	
});
//根据用户角色初始化按钮
var button_init = function(){
	var user_info = localStorage.getItem("user_info");
	//获取后先转为json
	var userInfo = eval('(' + user_info + ')');
	//获取登陆名
	var login_name = userInfo.login_name;
	var content ="<div class='btn-group form-group'>"+
						    "<button class='btn blue' id='userUpdate' data-target='#user_update' data-toggle='modal'>"+
						        "<i class='fa fa-pencil'></i> 修改&nbsp;"+
						    "</button>"+
					"</div>";
	if(login_name=="admin"){
		$('#find').append(content);
	}
}();
//查看要修改的用户信息
$("#userUpdate").click(function(){
	var data = xw.getTable().getData(true);
	if (data.rows.length == 0) {
		bootbox.alert("<br><center><h4>请选择一条数据！</h4></center><br>");
		return false;
	}
	if (data.rows.length > 1) {	
		bootbox.alert("<br><center><h4>只能选择一行！</h4></center><br>");
		return false;
	}
	//console.log(data.rows[0]);
	$.each(data.rows[0], function(key,val) {
    	$("form[name='edit_user_info'] input[name='"+key+"']").val(val);  
    	if(key=="valiEmail"){
    		if(val==1){
    			$("#"+key+" option[value='1']").attr("selected",true); 
    		}else{
    			$("#"+key+" option[value='0']").attr("selected",true); 
    		}
    	}
    	if(key=="valiMobile"){
    		if(val==1){
    			$("#"+key+" option[value='1']").attr("selected",true); 
    		}else{
    			$("#"+key+" option[value='0']").attr("selected",true); 
    		}
    	}
    	if(key=="valiIdNumber"){
    		if(val==1){
    			$("#"+key+" option[value='1']").attr("selected",true); 
    		}else{
    			$("#"+key+" option[value='0']").attr("selected",true); 
    		}
    	}
    	if(key=="isTrPwd"){
    		if(val==1){
    			$("#"+key+" option[value='1']").attr("selected",true); 
    		}else{
    			$("#"+key+" option[value='0']").attr("selected",true); 
    		}
    	}
    	if(key=="safeVerifySwitch"){
    		
    		if(val==1){
    			$("#"+key+" option[value='1']").attr("selected",true); 
    		}else{
    			$("#"+key+" option[value='0']").attr("selected",true); 
    		}
    	}
    	if(key=="valiGooglesecret"){
    		if(val==1){
    			$("#"+key+" option[value='1']").attr("selected",true); 
    		}else{
    			$("#"+key+" option[value='0']").attr("selected",true); 
    		}
    	}
    });
})
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
//判断邮箱
var judgeEmail = function() {
	var email = $("#email").val();
	var email_1 = $("#email_1").val();
	var valiEmail = $("#valiEmail").val();
	//判断邮箱正则表达式
	var reg = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/;
	if(email_1!=email){
		if(strUtil.isEmpty(email)){
			$("#valiEmail").val(0);
			return true;
		}else{
			if(!reg.test(email)){
			bootbox.alert("email格式不正确");
			return false;
			}else{
				$("#valiEmail").val(1);
				return true;
			}
		}
	}else{
		if(!strUtil.isEmpty(email)){
			$("#valiEmail").val(1);
		}else{
			
			$("#valiEmail").val(0);
		}
		return true;
	}
};
$('#email').blur(judgeEmail);
//判断手机号
var judgeMobile = function() {
	var mobile = $("#mobile").val();
	var mobile_1 = $("#mobile_1").val();
	var valiMobile = $("#valiMobile").val();
	//判断邮箱正则表达式
	var reg = /(^1[3|4|5|7|8]\d{9}$)|(^09\d{8}$)/;
	if(mobile_1!=mobile){
		if(strUtil.isEmpty(mobile)){
			$("#valiMobile").val(0);
			return true;
		}else{
			if(!reg.test(mobile)){
			bootbox.alert("手机号格式不正确");
			return false;
			}else{
				$("#valiMobile").val(1);
				return true;
			}
		}
	}else{
		if(!strUtil.isEmpty(mobile)){
			$("#valiMobile").val(1);
		}else{
			
			$("#valiMobile").val(0);
		}
		return true;
	}
};
$('#mobile').blur(judgeMobile);
//判断身份证号
var judgeIdNumber = function() {
	var realName = $("#realName").val();
	var idNumber = $("#idNumber").val();
	var idNumber_1 = $("#idNumber_1").val();
	var valiIdNumber = $("#valiIdNumber").val();
	//名字
	var regName = /^[\u4E00-\u9FA5]{1,5}$/;
	//身份证号
	var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
	if(idNumber!=idNumber_1){
		if(!regName.test(realName)){
			if(!strUtil.isEmpty(realName)){
				bootbox.alert("名字输入必须为中文");
				return false;
			}
		}
		if(strUtil.isEmpty(realName)&&strUtil.isEmpty(idNumber)){
			$("#valiIdNumber").val(0);
			return true;
		}else{
			if(!reg.test(idNumber)){
				bootbox.alert("身份证号格式不正确");
				return false;
			}else{
				if(!strUtil.isEmpty(realName)&&!strUtil.isEmpty(idNumber)){
					$("#valiIdNumber").val(1);
				    return true;
				}
				
			}
		}
	}else{
		if(!reg.test(idNumber)){
			if(!strUtil.isEmpty(idNumber)){
				bootbox.alert("身份证号格式不正确");
				return false;
			}
		}
		if(strUtil.isEmpty(realName)||strUtil.isEmpty(idNumber)){
			$("#valiIdNumber").val(0);
		}else{
			$("#valiIdNumber").val(1);
		}
		return true;
	}
};
$('#idNumber').blur(judgeIdNumber);
//名字验证
var judgeRealName = function(){
	var regName = /^[\u4E00-\u9FA5]{1,5}$/;
	var realName = $('#realName').val();
	if(!regName.test(realName)){
		if(!strUtil.isEmpty(realName)){
			bootbox.alert("名字输入必须为中文");
			return false;
		}
	}
}
$('#realName').blur(judgeRealName);
$("#save_user_update").click(function(){
	//设置select只读不可编辑，值可传递 $("#按钮ID").attr("disabled",false);
	$("#isTrPwd").attr("disabled",false);
	var edit_user_info = $("#edit_user_info").serializeObject();
	console.log(edit_user_info);
	if(judgeEmail&&judgeMobile&&judgeIdNumber&&judgeRealName){
		$.ajax({
            type: 'POST',
            url:  "tx/use/pbusu.do",
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            async: true,
            data: JSON.stringify(edit_user_info),
            success: function(data) {
            	bootbox.alert(data.resultmsg);
                xw.update();
            },
            error: function(err) {
				bootbox.alert("服务异常");			
            }
    	});
	}else{
		$("#save_user_update").attr("data-dismiss","");
	}
});
//查看用户详细信息
$("#userSelect").click(function(){
	var data = xw.getTable().getData(true);
	if (data.rows.length == 0) {
		bootbox.alert("<br><center><h4>请选择一条数据！</h4></center><br>");
		return false;
	}
	if (data.rows.length > 1) {	
		bootbox.alert("<br><center><h4>只能选择一行！</h4></center><br>");
		return false;
	}
	//console.log(data.rows[0]);
	$.each(data.rows[0], function(key,val) {
		key = key+"_select";
    	$("form[name='select_user_info'] input[name='"+key+"']").val(val);
    	if(key=="valiEmail_select"){
    		if(val==1){
    			$("#"+key+" option[value='1']").attr("selected",true); 
    		}else{
    			$("#"+key+" option[value='0']").attr("selected",true); 
    		}
    	}
    	if(key=="valiMobile_select"){
    		if(val==1){
    			$("#"+key+" option[value='1']").attr("selected",true); 
    		}else{
    			$("#"+key+" option[value='0']").attr("selected",true); 
    		}
    	}
    	if(key=="valiIdNumber_select"){
    		if(val==1){
    			$("#"+key+" option[value='1']").attr("selected",true); 
    		}else{
    			$("#"+key+" option[value='0']").attr("selected",true); 
    		}
    	}
    	if(key=="isTrPwd_select"){
    		if(val==1){
    			$("#"+key+" option[value='1']").attr("selected",true); 
    		}else{
    			$("#"+key+" option[value='0']").attr("selected",true); 
    		}
    	}
    	if(key=="safeVerifySwitch_select"){
    		
    		if(val==1){
    			$("#"+key+" option[value='1']").attr("selected",true); 
    		}else{
    			$("#"+key+" option[value='0']").attr("selected",true); 
    		}
    	}
    	if(key=="valiGooglesecret_select"){
    		if(val==1){
    			$("#"+key+" option[value='1']").attr("selected",true); 
    		}else{
    			$("#"+key+" option[value='0']").attr("selected",true); 
    		}
    	}
    });
})
