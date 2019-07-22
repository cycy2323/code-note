var xw;


var valiidnumber = function(val) {
	return {
		f: function(val) {
			if(val == 0) {
				return "未审核";
			} else if(val == 1) {
				return "待审核"
			} else if(val == 2) {
				return "审核未通过"
			} else if(val == 3) {
				return "审核通过"
			}
		},
	}
}();
var status1 = function(val) {
	return {
		f: function(val) {
			if(val == 0) {
				return "停用";
			} else if(val == 1) {
				return "启用"
			}
		},
	}
}();
var istrpwd = function(val) {
	return {
		f: function(val) {
			if(val == 0) {
				return "否";
			} else if(val == 1) {
				return "是"
			}
		},
	}
}();
var googleverify = function(val) {
	return {
		f: function(val) {
			if(val == 0) {
				return "关";
			} else if(val == 1) {
				return "开"
			}
		},
	}
}();
var valigooglesecret = function(val) {
	return {
		f: function(val) {
			if(val == 0) {
				return "未绑定";
			} else if(val == 1) {
				return "已绑定"
			}
		},
	}
}();
var usertype = function(val) {
	return {
		f: function(val) {
			if(val == 1) {
				return "普通用户";
			} else if(val == 2) {
				return "商家"
			}
		},
	}
}();

var real = function(val) {
	return {
		f: function(val) {
			console.log(val)
			return val==null?"":val;
		},
	}
}();
var idnumber = function(val) {
	return {
		f: function(val) {
			console.log(val)
			return val==null?"":val;
		},
	}
}();
var google = function(val) {
	return {
		f: function(val) {
			console.log(val)
			return val==null?"":val;
		},
	}
}();

var aac = "<div class='btn-group form-group'>" +
	"<button id='edit_btn' class='btn green check' data-target='#edit_gp_btn' data-toggle='modal'>" +
	"<i class='fa fa-eye'></i> 查看&nbsp;" +
	"</button>" +
	"</div>";
var content = "<div class='btn-group form-group'>" +
		"<button id='edit_gp' class='btn blue' data-target='#edit_gp_btn1' data-toggle='modal'>" +
		"<i class='fa fa-pencil'></i> 审批&nbsp;" +
		"</button>" +
		"</div>";	
var Caozuo = function(val) {
	return aac+content;

}();
var MerApprove = function() {

	return {
		init: function() {
			this.reload();
		},
		reload: function() {

			$('#divtable').html('');

			xw = XWATable.init({
				divname: "divtable",
				//----------------table的选项-------
				pageSize: 50,
				columnPicker: true,
				transition: 'fade',
				checkboxes: true,
				checkAllToggle: true,
				//----------------基本restful地址---
				restURL: "/bd/mer/pbant.do?bd={'':''}",
				coldefs: [{
						col: "ugotcuserid",
						friendly: "用户ID",
						validate: "ugotcuserid",
						nonedit: "nosend",
//						unique: "true",
						index: 1
					},
					{
						col: "username",
						friendly: "用户名",
						validate: "username",
						index: 2
					},
					{
						col: "realname",
						friendly: "真是姓名",
						validate: "realname",
						format:real,
						index: 3
					},
					{
						col: "idnumber",
						friendly: "身份证号",
						validate: "idnumber",
						format:idnumber,
						index: 4
					},
					{
						col: "valiidnumber",
						friendly: "实名制是否验证",
						validate: "valiidnumber",
						format: valiidnumber,
						index: 5
					},
					{
						col: "status",
						friendly: "状态",
						validate: "status",
						format: status1,
						index: 6
					},
					{
						col: "istrpwd",
						friendly: "是否已设置交易密码",
						validate: "istrpwd",
						format: istrpwd,
						index: 7
					},
					{
						col: "googleverify",
						friendly: "是否开启谷歌验证码",
						validate: "googleverify",
						format: googleverify,
						index: 8
					},
					{
						col: "googlesecret",
						friendly: "谷歌标识码",
						validate: "googlesecret",
						format:google,
						index: 9
					},
					{
						col: "valigooglesecret",
						friendly: "是否绑定谷歌验证",
						validate: "valigooglesecret",
						format: valigooglesecret,
						index: 10
					},
					{
						col: "usertype",
						friendly: "用户类型",
						validate: "usertype",
						format: usertype,
						index: 11
					},
					{
						col: "usablefund",
						friendly: "可用资产",
						validate: "usablefund",
						index: 12
					},
					{
						col: "frozenfund",
						friendly: "冻结资产",
						validate: "frozenfund",
						index: 13
					},
					{
						col: "createdtime",
						friendly: "创建时间",
						validate: "createdtime",
						index: 14
					},
					{
						friendly: "操作",
						format: Caozuo,
						index: 15
					},
				],
				// 查询过滤条件
				findFilter: function() {
					var ugotcuserid;

					if($('#ugotcuserid1').val()) {
						ugotcuserid = RQLBuilder.equal("ugotcuserid", $.trim($('#ugotcuserid1').val()));
					}
					if(ugotcuserid == undefined) {
						ugotcuserid = '"ugotcuserid":""';
					}
					xw.setRestURL("/bd/mer/pbant.do?bd={" + ugotcuserid + "}");
				},

			})
		}
	}

}();

//根据用户角色初始化按钮
var button_init = function() {
	var user_info = localStorage.getItem("user_info");
	//获取后先转为json
	var userInfo = eval('(' + user_info + ')');
	//获取登陆名
	var login_name = userInfo.login_name;
	/*var content = "<div class='btn-group form-group'>" +
		"<button id='edit_gp' class='btn blue' data-target='#edit_gp_btn1' data-toggle='modal'>" +
		"<i class='fa fa-pencil'></i> 修改&nbsp;" +
		"</button>" +
		"</div>";*/
//	if(login_name == "admin") {
//		$('#find').append(content);
//	}
}();

/*查看详细信息*/
$(document).on('click','#edit_btn',function() {
	var index = $(this).closest('tr').index();
	var data = xw.getTable().getData();

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

		key = key + "_select"
		$("form[name='edit_form'] input[name='" + key + "']").val(val);

		//实名制是否验证
		if(data.rows[index].valiidnumber == 0) {
			$("#valiidnumber_select option[value='" + data.rows[index].valiidnumber + "']").attr('selected', 'selected');
		} else if(data.rows[index].valiidnumber == 1) {
			$("#valiidnumber_select option[value='" + data.rows[index].valiidnumber + "']").attr('selected', 'selected');
		} else if(data.rows[index].valiidnumber == 2) {
			$("#valiidnumber_select option[value='" + data.rows[index].valiidnumber + "']").attr('selected', 'selected');
		} else if(data.rows[index].valiidnumber == 3) {
			$("#valiidnumber_select option[value='" + data.rows[index].valiidnumber + "']").attr('selected', 'selected');
		}
		//状态
		if(data.rows[index].status == 0) {
			$("#status_select option[value='" + data.rows[index].status + "']").attr('selected', 'selected');
		} else if(data.rows[index].status == 1) {
			$("#status_select option[value='" + data.rows[index].status + "']").attr('selected', 'selected');
		}
		//是否已设置交易密码
		if(data.rows[index].istrpwd == 0) {
			$("#istrpwd_select option[value='" + data.rows[index].istrpwd + "']").attr('selected', 'selected');
		} else if(data.rows[index].isTrPwd == 1) {
			$("#istrpwd_select option[value='" + data.rows[index].istrpwd + "']").attr('selected', 'selected');
		}
		
		//是否开启谷歌验证
		if(data.rows[index].googleverify == 0) {
			$("#googleverify_select option[value='" + data.rows[index].googleverify + "']").attr('selected', 'selected');
		} else if(data.rows[index].googleverify == 1) {
			$("#googleverify_select option[value='" + data.rows[index].googleverify + "']").attr('selected', 'selected');
		}
		//是否绑定谷歌验证
		if(data.rows[index].valigooglesecret == 0) {
			$("#valigooglesecret_select option[value='" + data.rows[index].valigooglesecret + "']").attr('selected', 'selected');
		} else if(data.rows[index].valigooglesecret == 1) {
			$("#valigooglesecret_select option[value='" + data.rows[index].valigooglesecret + "']").attr('selected', 'selected');
		}
		//用户类型
		if(data.rows[index].usertype == 1) {
			$("#usertype_select option[value='" + data.rows[index].usertype + "']").attr('selected', 'selected');
		} else if(data.rows[index].usertype == 2) {
			$("#usertype_select option[value='" + data.rows[index].usertype + "']").attr('selected', 'selected');
		}
	});
	/*Decimal类型转换*/
	//	$("#initPrice_select").val(data.rows[index].initPrice.toFixed(8));

});

/*修改*/
	$(document).on('click','#edit_gp',function() {
	var index = $(this).closest('tr').index();
	$("#update_gp").show();
	$("#update_gp1").hide();
	var data = xw.getTable().getData();

	/*if(data.rows.length == 0) {
		bootbox.alert("<br><center><h4>请选择一条数据！</h4></center><br>");
		return false;
	}
	if(data.rows.length > 1) {
		bootbox.alert("<br><center><h4>只能选择一行！</h4></center><br>");
		return false;
	}*/
	if(data.rows[index].usertype == 1){
		$("#update_gp").attr("style", "display:block;");
	} else if(data.rows[index].usertype == 2){
		$("#update_gp").attr("style", "display:none;");
	}

	$.each(data.rows[index], function(key, val) {
		/*模态框关闭后清空模态框里填写的数据*/
		$("#edit_gp_btn1").on("hidden.bs.modal", function() {
			document.getElementById("edit_form1").reset();

		});
		$("form[name='edit_form1'] input[name='" + key + "']").val(val);
		if(data.rows[index].valiidnumber == 0) {
			$("#valiidnumber option[value='" + data.rows[index].valiidnumber + "']").attr('selected', 'selected');
		} else if(data.rows[index].valiidnumber == 1) {
			$("#valiidnumber option[value='" + data.rows[index].valiidnumber + "']").attr('selected', 'selected');
		} else if(data.rows[index].valiidnumber == 2) {
			$("#valiidnumber option[value='" + data.rows[index].valiidnumber + "']").attr('selected', 'selected');
		} else if(data.rows[index].valiidnumber == 3) {
			$("#valiidnumber option[value='" + data.rows[index].valiidnumber + "']").attr('selected', 'selected');
		}
		//状态
		if(data.rows[index].status == 0) {
			$("#status option[value='" + data.rows[index].status + "']").attr('selected', 'selected');
		} else if(data.rows[index].status == 1) {
			$("#status option[value='" + data.rows[index].status + "']").attr('selected', 'selected');
		}
		//是否已设置交易密码
		if(data.rows[index].istrpwd == 0) {
			$("#istrpwd option[value='" + data.rows[index].istrpwd + "']").attr('selected', 'selected');
		} else if(data.rows[index].istrpwd == 1) {
			$("#istrpwd option[value='" + data.rows[index].istrpwd + "']").attr('selected', 'selected');
		}
		
		//是否开启谷歌验证
		if(data.rows[index].googleverify == 0) {
			$("#googleverify option[value='" + data.rows[index].googleverify + "']").attr('selected', 'selected');
		} else if(data.rows[index].googleverify == 1) {
			$("#googleVerify option[value='" + data.rows[index].googleverify + "']").attr('selected', 'selected');
		}
		//是否绑定谷歌验证
		if(data.rows[index].valigooglesecret == 0) {
			$("#valigooglesecret option[value='" + data.rows[index].valigooglesecret + "']").attr('selected', 'selected');
		} else if(data.rows[index].valiGooglesecret == 1) {
			$("#valigooglesecret option[value='" + data.rows[index].valigooglesecret + "']").attr('selected', 'selected');
		}
		//用户类型
		if(data.rows[index].usertype == 1) {
			$("#usertype option[value='" + data.rows[index].usertype + "']").attr('selected', 'selected');
		} else if(data.rows[index].usertype == 2) {
			$("#usertype option[value='" + data.rows[index].usertype + "']").attr('selected', 'selected');
		}

	});

	/*Decimal类型转换*/
	//	$("#initPrice").val(data.rows[index].initPrice.toFixed(8));
	//
	//	$("#robotNumMin").val(data.rows[index].robotNumMin.toFixed(8));
	//	$("#robotNumMax").val(data.rows[index].robotNumMax.toFixed(8));

});

$("#update_gp").click(function() {

	var edit_form1 = $("#edit_form1").serializeObject();

	$.ajax({
		type: 'POST',
		url: "/bd/mer/pbren.do",
		dataType: 'json',
		contentType: "application/json;charset=utf-8",
		async: false,
		isMask: true,
		data: JSON.stringify(edit_form1),
		success: function(ret) {
			console.log(ret.err_code);
			if(ret.err_code == "0"){
				bootbox.alert("审核失败");
			xw.update();
			}else{
			bootbox.alert("审核成功");
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