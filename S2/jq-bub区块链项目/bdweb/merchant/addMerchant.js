var xw;
var format = function(val) {
	return {
		f: function(val) {
			if(val == null) {
				return "";
			} else{
				return val;
			}
		}
	}
}();
var Type = function(val) {
	return {
		f: function(val) {
			if(val == 1) {
				return "买";
			} else if(val == 2) {
				return "卖"
			}
		},
	}
}();
var Status = function(val) {
	return {
		f: function(val) {
			if(val == 1) {
				return "启用";
			} else if(val == 2) {
				return "停用"
			} else if(val == 3) {
				return "已删除"
			} else if(val == 4) {
				return "未审核"
			}
		},
	}
}();

var IsSeniorCertification = function(val) {
	return {
		f: function(val) {
			if(val == 1) {
				return "是";
			} else if(val == 2) {
				return "否"
			}
		},
	}
}();
var IsMerchantsTrade = function(val) {
	return {
		f: function(val) {
			if(val == 1) {
				return "是";
			} else if(val == 2) {
				return "否"
			}
		},
	}
}();

var aac = "<div class='btn-group form-group'>" +
	"<button id='edit_btn' class='btn green check' data-target='#edit_gp_btn' data-toggle='modal'>" +
	"<i class='fa fa-eye'></i> 查看&nbsp;" +
	"</button>" +
	"</div>";

var Caozuo = function(val) {
	return aac;

}();
var Merchant = function() {


	return {

		init: function() {
			// 顺序有影响 (先抓选单, 再抓暂存选单, 再执行其他)

			this.reload();
		},

		reload: function() {

			$('#divtable').html('');
			var useridFormat = function () {
				return {
					f: function (val,row) {
						return "<Button id='passWord' class='btn green check' data-target='#input_many_modal' data-toggle='modal' data-id='"+row.userid+"'>重置密码</Button>";
					}
				}
			}();
			var useridCheckFormat = function () {
				return {
					f: function (val,row) {
						if(row.flag == '0'){
							return "<Button id='passCheckWord' class='btn green check' data-target='#input_many_modal1' data-toggle='modal' data-id='"+row.userid+"'>查看密码</Button>";
						}else{
							return "";
						}

					}
				}
			}();
			xw = XWATable.init({
				divname: "divtable",
				//----------------table的选项-------
				pageSize: 50,
				//columnPicker: true,
				transition: 'fade',
				checkboxes: true,
				checkAllToggle: true,
				saveColumn:false,
				//----------------基本restful地址---
				restURL: "/bd/bus/pbess.do?bd={\"\":\"\"}",
				coldefs: [
					{
						col: "mfusrbusinessid",
						friendly: "商户ID",
						format:format,
						index: 1
					},
					{
						col: "userid",
						friendly: "用户",
						hidden:"false",
						index: 2
					},
					{
						col: "nickname",
						friendly: "商户昵称",
						format:format,
						index: 3
					},
                    {
                        col: "loginname",
                        friendly: "登录账号",
						format:format,
                        index: 4
                    },
					{
						col: "mobile",
						friendly: "手机号",
						format:format,
						index: 5
					},
					{
						col: "ordertotle",
						friendly: "订单创建总数",
						format:format,
						index: 6
					},
					{
						col: "ordercomplete",
						friendly: "订单支付完成总数",
						format:format,
						index: 7
					},
                    {
                        col: "status",
                        friendly: "状态",
                        format:Status,
                        index: 8
                    },
					{
						col: "createdtime",
						friendly: "创建时间",
						format:format,
						index: 9
					},
					{
						col:"detail",
						friendly: "详情",
						format: Caozuo,
						index: 10
					},
					// {
					// 	col:"firstPwd",
					// 	friendly: "初始密码",
					// 	format: useridCheckFormat,
					// 	index: 11
					// },
					{
						col:"userId_op",
						friendly:"密码重置",
						nonedit:"nosend",
						format:useridFormat,
						index:12
					}

				],
				// 查询过滤条件
				findFilter: function() {
					var mfusrbusinessid, status, mobile, nickname;
					if($('#selmfusrbusinessid').val()) {
						mfusrbusinessid = RQLBuilder.equal("mfusrbusinessid", $.trim($('#selmfusrbusinessid').val()));
					}
					if($('#selstatus option:selected').val()) {
						status = RQLBuilder.equal("status", $('#selstatus  option:selected').val());
					}
					if($('#selmobile').val()) {
						mobile = RQLBuilder.equal("mobile", $.trim($('#selmobile').val()));
					}
					if($('#selnickname').val()) {
						nickname = RQLBuilder.equal("nickname", $.trim($('#selnickname').val()));
					}

					if(mfusrbusinessid == undefined) {
						mfusrbusinessid = '"mfusrbusinessid":""';
					}
					if(mobile == undefined) {
						mobile = '"mobile":""';
					}
					if(status == undefined) {
						status = '"status":""';
					}
					if(nickname == undefined) {
						nickname = '"nickname":""';
					}
					console.log(mfusrbusinessid);
					xw.setRestURL("/bd/bus/pbess.do?bd={" + mfusrbusinessid + "," + status + "," + mobile + "," + nickname + "}");
				},

			})
		}
	}

}();

$(document).on("click","#passWord",function(){
	$(".modal-body").find("#prefix_860037789915").remove()
	$("#userId").val($(this).attr("data-id"));
});
$(document).on("click","#passCheckWord",function(){
	$("#userId1").val($(this).attr("data-id"));
	$("#googlecode").attr("readonly",false);
	$("#pwdTitle").html('谷歌验证码:');
	$("#confirm1").show();
	$("#close").val("取消");
	$("#input_many_modal1").on("hidden.bs.modal", function() {
		document.getElementById("edit_form2").reset();
	});
});

$(document).on('click',"#confirm",function(){
	var userId = $("#userId").val();
	var password = $.md5("填充数据");
	var form = {};
	form["password"] = password;
	$.ajax({
		url:hzq_rest + "mfsysuser/"+userId,
		headers:{
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		type:"PUT",
		dateType:"json",
		data:JSON.stringify(form),
		success:function(data){
			if(data.success){
				$("#input_many_modal").modal('hide');
				bootbox.alert("密码修改成功",function(){
					$("#userId").val("");
					location.reload();
				})
			}else {
				bootbox.alert("密码修改失败。")
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
	})
});
$(document).on('click',"#confirm1",function(){
	var userid = $("#userId1").val();
	var googlecode = $("#googlecode").val();
	if(!(/^[0-9]{6}$/.test(googlecode))){
		bootbox.alert("谷歌验证码不正确!");
		return;
	}
	var form = {};
	form["userid"] = userid;
	form["googlecode"] = googlecode;
	$.ajax({
		type: 'POST',
		url: "/bd/bus/pbsle.do",
		dataType: 'json',
		contentType: "application/json;charset=utf-8",
		async: false,
		isMask: true,
		data: JSON.stringify(form),
		success: function(data) {
			if(data.err_code==1){
				$("#pwdTitle").html('初始密码:');
				$("#googlecode").val(data.password);
				$("#googlecode").attr("readonly","readonly");
				$("#confirm1").hide();
				$("#close").val("关闭");
			}else {
				bootbox.alert(data.msg,function(){
					location.reload();
				})
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
//根据用户角色初始化按钮
var button_init = function() {
	var user_info = localStorage.getItem("user_info");
	//获取后先转为json
	var userInfo = eval('(' + user_info + ')');
	//获取登陆名
	var login_name = userInfo.login_name;
	/*var content = "<div class='btn-group form-group'>" +
		"<button id='edit_gp' class='btn blue' data-target='#edit_gp_btn1' data-toggle='modal'>" +
		"<i class='fa fa-pencil'></i> 审批&nbsp;" +
		"</button>" +
		"</div>";*/
	/*if(login_name == "admin") {
		$('#find').append(content);
	}*/
}();

/*查看详细信息*/

$(document).on('click','#edit_btn',function() {
	var index = $(this).closest('tr').index();
	var data = xw.getTable().getData();
	$("#idphoto1").attr("src",data.rows[index].idPhoto)
//	if(data.rows.length == 0) {
//		bootbox.alert("<br><center><h4>请选择一条数据！</h4></center><br>");
//		return false;
//	}
//	if(data.rows.length > 1) {
//		bootbox.alert("<br><center><h4>只能选择一行！</h4></center><br>");
//		return false;
//	}

	$.each(data.rows[index], function(key, val) {
		/*模态框关闭后清空模态框里填写的数据*/
		$("#edit_gp_btn").on("hidden.bs.modal", function() {
			document.getElementById("edit_form").reset();
		});
		/*-----------------------*/
		key = key + "_select";
		$("form[name='edit_form'] input[name='" + key + "']").val(val);

		/*金额类型*/
		if(data.rows[index].amounttype == 1) {
			$("#amounttype_select option[value='" + data.rows[index].amounttype + "']").attr('selected', 'selected');
		} else if(data.rows[index].amounttype == 2) {
			$("#amounttype_select option[value='" + data.rows[index].amounttype + "']").attr('selected', 'selected');
		}
		/*类型*/
		if(data.rows[index].type == 1) {
			$("#type_select option[value='" + data.rows[index].type + "']").attr('selected', 'selected');
		} else if(data.rows[index].type == 2) {
			$("#type_select option[value='" + data.rows[index].type + "']").attr('selected', 'selected');
		}
		/*广告状态*/

			$("#status_select option[value='" + data.rows[index].status + "']").attr('selected', 'selected');


		/*货币类型*/
		if(data.rows[index].cointype == 1) {
			$("#cointype_select option[value='" + data.rows[index].cointype + "']").attr('selected', 'selected');
		}
		/*是否需要高级认证*/
		if(data.rows[index].isseniorcertification == 1) {
			$("#isseniorcertification_select option[value='" + data.rows[index].isseniorcertification + "']").attr('selected', 'selected');
		} else if(data.rows[index].isseniorcertification == 2) {
			$("#isseniorcertification_select option[value='" + data.rows[index].isseniorcertification + "']").attr('selected', 'selected');
		}
		/*是否实名制*/
		if(data.rows[index].valiidnumber == 1) {
			$("#valiidnumber_select option[value='" + data.rows[index].valiidnumber + "']").attr('selected', 'selected');
		} else if(data.rows[index].valiidnumber == 2) {
			$("#valiidnumber_select option[value='" + data.rows[index].valiidnumber + "']").attr('selected', 'selected');
		}

	});

});

/*审批*/
$(document).on('click','#edit_gp',function() {
	var index = $(this).closest('tr').index();
	var data = xw.getTable().getData();

	$("#amounttype").attr("disabled", true);
	$("#type").attr("disabled", true);
	$("#paymentway").attr("disabled", true);
	$.each(data.rows[index], function(key, val) {

		/*模态框关闭后清空模态框里填写的数据*/
		$("#edit_gp_btn1").on("hidden.bs.modal", function() {
			document.getElementById("edit_form1").reset();
		});
		/*-----------------------*/

		$("form[name='edit_form1'] input[name='" + key + "']").val(val);

		/*金额类型*/
		if(data.rows[index].amounttype == 1) {
			$("#amounttype option[value='" + data.rows[index].amounttype + "']").attr('selected', 'selected');
		} else if(data.rows[index].amounttype == 2) {
			$("#amounttype option[value='" + data.rows[index].amounttype + "']").attr('selected', 'selected');
		}
		/*类型*/
		if(data.rows[index].type == 1) {
			$("#type option[value='" + data.rows[index].type + "']").attr('selected', 'selected');
		} else if(data.rows[index].type == 2) {
			$("#type option[value='" + data.rows[index].type + "']").attr('selected', 'selected');
		}
		/*广告状态*/
		if(data.rows[index].status == 1) {
			$("#status option[value='" + data.rows[index].status + "']").attr('selected', 'selected');
		} else if(data.rows[index].status == 2) {
			$("#status option[value='" + data.rows[index].status + "']").attr('selected', 'selected');
		}
		/*支付方式*/
		if(data.rows[index].paymentway == 1) {
			$("#paymentway option[value='" + data.rows[index].paymentway + "']").attr('selected', 'selected');
		} else if(data.rows[index].paymentway == 2) {
			$("#paymentway option[value='" + data.rows[index].paymentway + "']").attr('selected', 'selected');
		} else if(data.rows[index].paymentway == 3) {
			$("#paymentway option[value='" + data.rows[index].paymentway + "']").attr('selected', 'selected');
		} else if(data.rows[index].paymentway == 1,2) {
			$("#paymentway option[value='" + data.rows[index].paymentway + "']").attr('selected', 'selected');
		} else if(data.rows[index].paymentway == 1,3) {
			$("#paymentway option[value='" + data.rows[index].paymentway + "']").attr('selected', 'selected');
		} else if(data.rows[index].paymentway == 2,3) {
			$("#paymentway option[value='" + data.rows[index].paymentway + "']").attr('selected', 'selected');
		} else if(data.rows[index].paymentway == 1,2,3) {
			$("#paymentway option[value='" + data.rows[index].paymentway + "']").attr('selected', 'selected');
		}
		/*货币类型*/
		if(data.rows[index].cointype == 1) {
			$("#cointype option[value='" + data.rows[index].cointype + "']").attr('selected', 'selected');
		}
		/*是否需要高级认证*/
		if(data.rows[index].isseniorcertification == 1) {
			$("#isseniorcertification option[value='" + data.rows[index].isseniorcertification + "']").attr('selected', 'selected');
		} else if(data.rows[index].isseniorcertification == 2) {
			$("#isseniorcertification option[value='" + data.rows[index].isseniorcertification + "']").attr('selected', 'selected');
		}
		/*是否与平台商家交易*/
		if(data.rows[index].ismerchantstrade == 1) {
			$("#ismerchantstrade option[value='" + data.rows[index].ismerchantstrade + "']").attr('selected', 'selected');
		} else if(data.rows[index].ismerchantstrade == 2) {
			$("#ismerchantstrade option[value='" + data.rows[index].ismerchantstrade + "']").attr('selected', 'selected');
		}

	});

});

$("#update_gp").click(function() {
	 var edit_form1 = $("#edit_form1").serializeObject();
	 if(!(/^[a-zA-Z][a-zA-Z0-9]{5,21}$/.test(edit_form1.employeename))){
		bootbox.alert("商户登录名格式应为:以字母开头在6-20之间,只能包含字母数字");
		return;
	 }
	if(!(/^[A-Za-z0-9\u4e00-\u9fa5]{2,15}$/.test(edit_form1.nickname))){
		bootbox.alert("商户昵称格式应为2-15位字母数字或汉字");
		return;
	}
	if(!(/^[\u4e00-\u9fa5]{2,6}$/.test(edit_form1.realname))){
		bootbox.alert("联系人姓名应为2-6位汉字");
		return;
	}
	var phone = document.getElementById('phone').value;
	if(!(/0?(13|14|15|16|18|17)[0-9]{9}/.test(phone))){
		bootbox.alert("手机号格式错误,请重新输入");
		return;
	}
	if(!(/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(edit_form1.email))){
		bootbox.alert("邮箱格式不正确");
		return;
	}
	 $.ajax({
		type: 'POST',
		url: "/bd/bus/pbadd.do",
		dataType: 'json',
		contentType: "application/json;charset=utf-8",
		async: false,
		isMask: true,
		data: JSON.stringify(edit_form1),
		success: function(ret) {
			if(ret.err_code == "1"){
				var string1 = ret.loginName;
				var string2 = ret.userId;
				var string3 = ret.password;
				window.location.href="merchant/successadded.html?loginName="+string1+"&userId="+string2+"&password="+string3;
				bootbox.alert("添加成功");
				xw.update();
			}else{
				bootbox.alert(ret.msg);
				xw.update();
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

//$(document).on('click','#delete2',function(){
//	var index = $(this).closest('tr').index();
//	var data = xw.getTable().getData();
//	//var edit_form2 = $("#edit_form1").serializeObject();
//	//console.log(edit_form2);
//	$.ajax({
//		type: 'POST',
//		url: "/bd/adv/pbsha.do",
//		dataType: 'json',
//		contentType: "application/json;charset=utf-8",
//		async: false,
//		isMask: true,
//		data: JSON.stringify(data.rows[index]),
//		success: function(ret) {
//			if(ret.err_code == "0"){
//				bootbox.alert("删除失败");
//			xw.update();
//			}else{
//			bootbox.alert("删除成功");
//			xw.update();
//			}
//		},
//		error: function() {
//			bootbox.alert("删除失败");
//			xw.update();
//		}
//	});
//
//});
//$("#delete2").click(function() {
//console.log(123456)
//	//var edit_form1 = $("#edit_form1").serializeObject();
//
//	$.ajax({
//		type: 'POST',
//		url: "/bd/adv/pbsha.do",
//		dataType: 'json',
//		contentType: "application/json;charset=utf-8",
//		async: false,
//		isMask: true,
//		//data: JSON.stringify(edit_form1),
//		success: function(ret) {
//			console.log(ret.err_code);
//			if(ret.err_code == "0"){
//				bootbox.alert("删除失败");
//			xw.update();
//			}else{
//			bootbox.alert("删除成功");
//			xw.update();
//			}
//		},
//		error: function() {
//			bootbox.alert("删除失败");
//			xw.update();
//		}
//	});
//
//});
