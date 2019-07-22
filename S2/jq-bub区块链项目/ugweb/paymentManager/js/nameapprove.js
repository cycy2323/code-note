var xw;

var Trade_valiIdNumber = function(val) {
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

var Trade_status = function(val) {
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

var Trade_isTrPwd = function(val) {
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

var Trade_googleVerify = function(val) {
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

var Trade_valiGooglesecret = function(val) {
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

var Trade_userType = function(val) {
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
var Name = function() {

	var userHelper = RefHelper.create({
		ref_url: "ugotcuser",
		ref_col: "ugOtcUserId",

	});

	var roleFormat = function() {
		return {
			f: function(val) {
				return roleHelper.getDisplay(val);
			}
		}
	}();

	return {

		init: function() {
			// 顺序有影响 (先抓选单, 再抓暂存选单, 再执行其他)

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
				restbase: 'ugotcuser',
				key_column: 'ugOtcUserId',
				coldefs: [{
						col: "ugOtcUserId",
						friendly: "用户ID",
						validate: "ugOtcUserId",
						nonedit: "nosend",
//						unique: "true",
						index: 1
					},
					{
						col: "userName",
						friendly: "用户名",
						validate: "userName",
						index: 2
					},
					{
						col: "valiIdNumber",
						friendly: "实名制是否验证",
						validate: "valiIdNumber",
						format: Trade_valiIdNumber,
						index: 3
					},
					{
						col: "status",
						friendly: "状态",
						validate: "status",
						format: Trade_status,
						index: 4
					},
					{
						col: "isTrPwd",
						friendly: "是否设置支付密码",
						validate: "isTrPwd",
						format: Trade_isTrPwd,
						index: 5
					},
					{
						col: "googleVerify",
						friendly: "是否开启谷歌验证码",
						validate: "googleVerify",
						format: Trade_googleVerify,
						index: 6
					},
					{
						col: "valiGooglesecret",
						friendly: "是否绑定谷歌验证",
						validate: "valiGooglesecret",
						format: Trade_valiGooglesecret,
						index: 7
					},
					{
						col: "userType",
						friendly: "用户类型",
						validate: "userType",
						format: Trade_userType,
						index: 8
					},
					{
						col: "createdTime",
						friendly: "创建时间",
						validate: "createdTime",
						index: 9
					},
					{
						friendly: "操作",
						format: Caozuo,
						index: 10,
					},

				],
				// 查询过滤条件
				findFilter: function() {
					var find_valiIdNumber, find_status, find_isTrPwd, find_googleVerify, find_valiGooglesecret, find_valiGooglesecret;
					if($('#valiIdNumber1 option:selected').val()) {
						find_valiIdNumber = RQLBuilder.equal("valiIdNumber", $('#valiIdNumber1  option:selected').val());
					}
					if($('#status1 option:selected').val()) {
						find_status = RQLBuilder.equal("status", $('#status1  option:selected').val());
					}
					if($('#isTrPwd1 option:selected').val()) {
						find_isTrPwd = RQLBuilder.equal("isTrPwd", $('#isTrPwd1  option:selected').val());
					}
					if($('#googleVerify1 option:selected').val()) {
						find_googleVerify = RQLBuilder.equal("googleVerify", $('#googleVerify1  option:selected').val());
					}
					if($('#valiGooglesecret1 option:selected').val()) {
						find_valiGooglesecret = RQLBuilder.equal("valiGooglesecret", $('#valiGooglesecret1  option:selected').val());
					}
					if($('#valiGooglesecret1 option:selected').val()) {
						find_valiGooglesecret = RQLBuilder.equal("valiGooglesecret", $('#valiGooglesecret1  option:selected').val());
					}

					var filter = RQLBuilder.and([
						find_valiIdNumber, find_status, find_isTrPwd, find_googleVerify, find_valiGooglesecret, find_valiGooglesecret
					]);
					return filter.rql();
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
//	var content = "<div class='btn-group form-group'>" +
//		"<button id='edit_gp' class='btn blue' data-target='#edit_gp_btn1' data-toggle='modal'>" +
//		"<i class='fa fa-pencil'></i> 审批&nbsp;" +
//		"</button>" +
//		"</div>";
//	if(login_name == "admin") {
//		$('#find').append(content);
//	}
}();


/*查看详细信息*/

$(document).on('click','#edit_btn',function() {
	var index = $(this).closest('tr').index();
	var data = xw.getTable().getData();
	
	$("#idcard1").attr("src",data.rows[index].idCardFont)
	$("#idcard2").attr("src",data.rows[index].idCardReverse)
	
	
//	if(data.rows.length == 0) {
//		bootbox.alert("<br><center><h4>请选择一条数据！</h4></center><br>");
//		return false;
//	}
//	if(data.rows.length > 1) {
//		bootbox.alert("<br><center><h4>只能选择一行！</h4></center><br>");
//		return false;
//	}
console.log(data.rows[index])
	$.each(data.rows[index], function(key, val) {
		/*模态框关闭后清空模态框里填写的数据*/
		$("#edit_gp_btn").on("hidden.bs.modal", function() {
			document.getElementById("edit_form").reset();
			$('#idcard1').attr('src','');
			$('#idcard2').attr('src','');
		});
		/*-----------------------*/
		key = key + "_select";
		$("form[name='edit_form'] input[name='" + key + "']").val(val);
		
		//实名制是否验证
		if(data.rows[index].valiIdNumber == 0) {
			$("#valiIdNumber_select option[value='" + data.rows[index].valiIdNumber + "']").attr('selected', 'selected');
		} else if(data.rows[index].valiIdNumber == 1) {
			$("#valiIdNumber_select option[value='" + data.rows[index].valiIdNumber + "']").attr('selected', 'selected');
		} else if(data.rows[index].valiIdNumber == 2) {
			$("#valiIdNumber_select option[value='" + data.rows[index].valiIdNumber + "']").attr('selected', 'selected');
		} else if(data.rows[index].valiIdNumber == 3) {
			$("#valiIdNumber_select option[value='" + data.rows[index].valiIdNumber + "']").attr('selected', 'selected');
		}
		//状态
		if(data.rows[index].status == 0) {
			$("#status_select option[value='" + data.rows[index].status + "']").attr('selected', 'selected');
		} else if(data.rows[index].status == 1) {
			$("#status_Select option[value='" + data.rows[index].status + "']").attr('selected', 'selected');
		}
		//是否已设置支付密码
		if(data.rows[index].isTrPwd == 0) {
			$("#isTrPwd_select option[value='" + data.rows[index].isTrPwd + "']").attr('selected', 'selected');
		} else if(data.rows[index].isTrPwd == 1) {
			$("#isTrPwd_select option[value='" + data.rows[index].isTrPwd + "']").attr('selected', 'selected');
		}
		
		//是否开启谷歌验证
		if(data.rows[index].googleVerify == 0) {
			$("#googleVerify_select option[value='" + data.rows[index].googleVerify + "']").attr('selected', 'selected');
		} else if(data.rows[index].googleVerify == 1) {
			$("#googleVerify_select option[value='" + data.rows[index].googleVerify + "']").attr('selected', 'selected');
		}
		//是否绑定谷歌验证
		if(data.rows[index].valiGooglesecret == 0) {
			$("#valiGooglesecret_select option[value='" + data.rows[index].valiGooglesecret + "']").attr('selected', 'selected');
		} else if(data.rows[index].valiGooglesecret == 1) {
			$("#valiGooglesecret_select option[value='" + data.rows[index].valiGooglesecret + "']").attr('selected', 'selected');
		}
		//用户类型
		if(data.rows[index].userType == 1) {
			$("#userType_select option[value='" + data.rows[index].userType + "']").attr('selected', 'selected');
		} else if(data.rows[index].userType == 2) {
			$("#userType_select option[value='" + data.rows[index].userType + "']").attr('selected', 'selected');
		}

	});

});

/*审批*/
$(document).on('click','#edit_gp',function() {
	var index = $(this).closest('tr').index();
	var data = xw.getTable().getData();
	$("#idcard3").attr("src",data.rows[index].idCardFont)
	$("#idcard4").attr("src",data.rows[index].idCardReverse)

//	if(data.rows.length == 0) {
//		bootbox.alert("<br><center><h4>请选择一条数据！</h4></center><br>");
//		return false;
//	}
//	if(data.rows.length > 1) {
//		bootbox.alert("<br><center><h4>只能选择一行！</h4></center><br>");
//		return false;
//	}
	
	if(data.rows[index].valiIdNumber == 1) {
		$("#update_gp").attr("style", "display:block;");
		$("#update_gper").attr("style", "display:block;");
	} else if(data.rows[index].valiIdNumber == 2) {
		$("#update_gp").attr("style", "display:none;");
		$("#update_gper").attr("style", "display:none;");
	} else if(data.rows[index].valiIdNumber == 3) {
		$("#update_gp").attr("style", "display:none;");
		$("#update_gper").attr("style", "display:none;");
	} else if(data.rows[index].valiIdNumber == 0) {
		$("#update_gp").attr("style", "display:none;");
		$("#update_gper").attr("style", "display:none;");
	}

	$.each(data.rows[index], function(key, val) {

		/*模态框关闭后清空模态框里填写的数据*/
		$("#edit_gp_btn1").on("hidden.bs.modal", function() {
			document.getElementById("edit_form1").reset();
			$('#idcard3').attr('src','');
			$('#idcard4').attr('src','');
		});
		/*-----------------------*/
		$("form[name='edit_form1'] input[name='" + key + "']").val(val);

		if(data.rows[index].valiIdNumber == 0) {
			$("#valiIdNumber option[value='" + data.rows[index].valiIdNumber + "']").attr('selected', 'selected');
		} else if(data.rows[index].valiIdNumber == 1) {
			$("#valiIdNumber option[value='" + data.rows[index].valiIdNumber + "']").attr('selected', 'selected');
		} else if(data.rows[index].valiIdNumber == 2) {
			$("#valiIdNumber option[value='" + data.rows[index].valiIdNumber + "']").attr('selected', 'selected');
		} else if(data.rows[index].valiIdNumber == 3) {
			$("#valiIdNumber option[value='" + data.rows[index].valiIdNumber + "']").attr('selected', 'selected');
		}
		//状态
		if(data.rows[index].status == 0) {
			$("#status option[value='" + data.rows[index].status + "']").attr('selected', 'selected');
		} else if(data.rows[index].status == 1) {
			$("#status option[value='" + data.rows[index].status + "']").attr('selected', 'selected');
		}
		//是否已设置支付密码
		if(data.rows[index].isTrPwd == 0) {
			$("#isTrPwd option[value='" + data.rows[index].isTrPwd + "']").attr('selected', 'selected');
		} else if(data.rows[index].isTrPwd == 1) {
			$("#isTrPwd option[value='" + data.rows[index].isTrPwd + "']").attr('selected', 'selected');
		}
		//是否已设置支付密码
		if(data.rows[index].isTrPwd == 0) {
			$("#isTrPwd option[value='" + data.rows[index].isTrPwd + "']").attr('selected', 'selected');
		} else if(data.rows[index].isTrPwd == 1) {
			$("#isTrPwd option[value='" + data.rows[index].isTrPwd + "']").attr('selected', 'selected');
		}
		//是否开启谷歌验证
		if(data.rows[index].googleVerify == 0) {
			$("#googleVerify option[value='" + data.rows[index].googleVerify + "']").attr('selected', 'selected');
		} else if(data.rows[index].googleVerify == 1) {
			$("#googleVerify option[value='" + data.rows[index].googleVerify + "']").attr('selected', 'selected');
		}
		//是否绑定谷歌验证
		if(data.rows[index].valiGooglesecret == 0) {
			$("#valiGooglesecret option[value='" + data.rows[index].valiGooglesecret + "']").attr('selected', 'selected');
		} else if(data.rows[index].valiGooglesecret == 1) {
			$("#valiGooglesecret option[value='" + data.rows[index].valiGooglesecret + "']").attr('selected', 'selected');
		}
		//用户类型
		if(data.rows[index].userType == 1) {
			$("#userType option[value='" + data.rows[index].userType + "']").attr('selected', 'selected');
		} else if(data.rows[index].userType == 2) {
			$("#userType option[value='" + data.rows[index].userType + "']").attr('selected', 'selected');
		}

	});

});

$("#update_gp").click(function() {

	var edit_form1 = $("#edit_form1").serializeObject();

	$.ajax({
		type: 'POST',
		url: "/ug/app/pbove.do",
		dataType: 'json',
		contentType: "application/json;charset=utf-8",
		async: false,
		isMask: true,
		data: JSON.stringify(edit_form1),
		success: function() {
			bootbox.alert("审批通过成功");
			xw.update();
		},
		error: function() {
			bootbox.alert("审批通过失败");
			xw.update();
		}
	});

});

$("#update_gper").click(function() {

	var edit_form1 = $("#edit_form1").serializeObject();

	$.ajax({
		type: 'POST',
		url: "/ug/app/pbqux.do",
		dataType: 'json',
		contentType: "application/json;charset=utf-8",
		async: false,
		isMask: true,
		data: JSON.stringify(edit_form1),
		success: function() {
			bootbox.alert("审批不通过成功");
			xw.update();
		},
		error: function() {
			bootbox.alert("审批不通过失败");
			xw.update();
		}
	});

});