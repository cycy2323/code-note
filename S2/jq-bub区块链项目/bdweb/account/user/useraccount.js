var xw;

var Trade_Google = function(val) {
	return {
		f: function(val) {
			if(val == 1) {
				return "启用";
			} else if(val == 2) {
				return "停用"
			} else if(val == 3) {
				return "已删除"
			} else if(val == 4) {
				return "禁用账户"
			} else if(val == 5) {
				return "禁止交易"
			}
		},
	}
}();
var nick = function(val) {
	return {
		f: function(val) {
			console.log(val)
			return val==null?"":val;
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
var aac = "<div class='btn-group form-group'>" +
	"<button id='edit_btn' class='btn green check' data-target='#edit_gp_btn' data-toggle='modal'>" +
	"<i class='fa fa-eye'></i> 查看&nbsp;" +
	"</button>" +
	"</div>";
var content = "<div class='btn-group form-group'>" +
		"<button id='edit_gp' class='btn blue' data-target='#edit_gp_btn1' data-toggle='modal'>" +
		"<i class='fa fa-pencil'></i> 修改&nbsp;" +
		"</button>" +
		"</div>";	
var Caozuo = function(val) {
return aac+content;

}();
var UserAccount = function() {
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
				restURL: "/bd/tra/pbade.do?bd={'':''}",
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
						col: "nickname",
						friendly: "用户昵称",
						validate: "nickname",
						format:nick,
						index: 3
					},
					{
						col: "realname",
						friendly: "真实姓名",
						validate: "realname",
						format:real,
						index: 4
					},
					{
						col: "idnumber",
						friendly: "身份证号",
						validate: "idnumber",
						format:idnumber,
						index: 5
					},
					{
						col: "ugotcaccountid",
						friendly: "账户资产ID",
						validate: "ugotcaccountid",
						index: 6
					},
					{
						col: "usablefund",
						friendly: "可用资产",
						validate: "usablefund",
						index: 7
					},
					{
						col: "frozenfund",
						friendly: "冻结资产",
						validate: "frozenfund",
						index: 8
					},
					{
						col: "status",
						friendly: "状态",
						validate: "status",
						format: Trade_Google,
						index: 9
					},
					{
						col: "createdtime",
						friendly: "创建时间",
						validate: "createdtime",
						index: 10
					},
					{
						friendly: "操作",
						format: Caozuo,
						index: 11,
					},

				],
				// 查询过滤条件
				findFilter: function() {
					var status, username,ugotcuserid;
					if($('#status1 option:selected').val()) {
						status = RQLBuilder.equal("status", $('#status1  option:selected').val());
					}
					if($('#username1').val()) {
						username = RQLBuilder.equal("username", $.trim($('#username1').val()));
					}
					if($('#ugotcuserid1').val()) {
						ugotcuserid = RQLBuilder.equal("ugotcuserid", $.trim($('#ugotcuserid1').val()));
					}
					if(status == undefined) {
						status = '"status":""';
					}
					if(username == undefined) {
						username = '"username":""';
					}
					if(ugotcuserid == undefined) {
						ugotcuserid = '"ugotcuserid":""';
					}
					xw.setRestURL("/bd/tra/pbade.do?bd={" + status + "," + username + "," + ugotcuserid + "}");
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
//		"<i class='fa fa-pencil'></i> 修改&nbsp;" +
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
	$("#idcard1").attr("src",data.rows[index].idcardfont)
	$("#idcard2").attr("src",data.rows[index].idcardreverse)
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
			$('#idcard1').attr('src','');
			$('#idcard2').attr('src','');
		});

		key = key + "_select"
		$("form[name='edit_form'] input[name='" + key + "']").val(val);

		/*状态*/
		if(data.rows[index].status == 1) {
			$("#status_select option[value='" + data.rows[index].status + "']").attr('selected', 'selected');
		} else if(data.rows[index].status == 2) {
			$("#status_select option[value='" + data.rows[index].status + "']").attr('selected', 'selected');
		} else if(data.rows[index].status == 3) {
			$("#status_select option[value='" + data.rows[index].status + "']").attr('selected', 'selected');
		} else if(data.rows[index].status == 4) {
			$("#status_select option[value='" + data.rows[index].status + "']").attr('selected', 'selected');
		} else if(data.rows[index].status == 5) {
			$("#status_select option[value='" + data.rows[index].status + "']").attr('selected', 'selected');
		}
		/*实名制是否认证*/
		if(data.rows[index].valiidnumber == 0) {
			$("#valiidnumber_select option[value='" + data.rows[index].valiidnumber + "']").attr('selected', 'selected');
		} else if(data.rows[index].valiidnumber == 1) {
			$("#valiidnumber_select option[value='" + data.rows[index].valiidnumber + "']").attr('selected', 'selected');
		} else if(data.rows[index].valiidnumber == 2) {
			$("#valiidnumber_select option[value='" + data.rows[index].valiidnumber + "']").attr('selected', 'selected');
		} else if(data.rows[index].valiidnumber == 3) {
			$("#valiidnumber_select option[value='" + data.rows[index].valiidnumber + "']").attr('selected', 'selected');
		}
		/*是否已设置交易密码*/
		if(data.rows[index].istrpwd == 0) {
			$("#istrpwd_select option[value='" + data.rows[index].istrpwd + "']").attr('selected', 'selected');
		} else if(data.rows[index].istrpwd == 1) {
			$("#istrpwd_select option[value='" + data.rows[index].istrpwd + "']").attr('selected', 'selected');
		}
		/*是否开启谷歌验证*/
		if(data.rows[index].googleverify == 0) {
			$("#googleverify_select option[value='" + data.rows[index].googleverify + "']").attr('selected', 'selected');
		} else if(data.rows[index].googleverify == 1) {
			$("#googleverify_select option[value='" + data.rows[index].googleverify + "']").attr('selected', 'selected');
		}
		/*是否绑定谷歌验证*/
		if(data.rows[index].valigooglesecret == 0) {
			$("#valigooglesecret_select option[value='" + data.rows[index].valigooglesecret + "']").attr('selected', 'selected');
		} else if(data.rows[index].valigooglesecret == 1) {
			$("#valigooglesecret_select option[value='" + data.rows[index].valigooglesecret + "']").attr('selected', 'selected');
		}
		/*是否高级认证*/
		if(data.rows[index].isseniorcertification == 1) {
			$("#isseniorcertification_select option[value='" + data.rows[index].isseniorcertification + "']").attr('selected', 'selected');
		} else if(data.rows[index].isseniorcertification == 2) {
			$("#isseniorcertification_select option[value='" + data.rows[index].isseniorcertification + "']").attr('selected', 'selected');
		}

	});
	/*Decimal类型转换*/
	//	$("#initPrice_select").val(data.rows[index].initPrice.toFixed(8));

});

/*修改*/
$(document).on('click','#edit_gp',function() {
	$("#update_gp").show();
	$("#update_gp1").hide();
	var index = $(this).closest('tr').index();
	var data = xw.getTable().getData();
	$("#idcard3").attr("src",data.rows[index].idcardfont)
	$("#idcard4").attr("src",data.rows[index].idcardreverse)

	$("#valiidnumber").attr("disabled", true);
	$("#istrpwd").attr("disabled", true);
	$("#googleverify").attr("disabled", true);
	$("#valigooglesecret").attr("disabled", true);
	$("#status").attr("disabled", true);


	$.each(data.rows[index], function(key, val) {

		/*模态框关闭后清空模态框里填写的数据*/
		$("#edit_gp_btn1").on("hidden.bs.modal", function() {
			document.getElementById("edit_form1").reset();
			$('#idcard3').attr('src','');
			$('#idcard4').attr('src','');			
		});

		$("form[name='edit_form1'] input[name='" + key + "']").val(val);

		/*状态*/
		if(data.rows[index].status == 1) {
			$("#status option[value='" + data.rows[index].status + "']").attr('selected', 'selected');
		} else if(data.rows[index].status == 2) {
			$("#status option[value='" + data.rows[index].status + "']").attr('selected', 'selected');
		} else if(data.rows[index].status == 3) {
			$("#status option[value='" + data.rows[index].status + "']").attr('selected', 'selected');
		} else if(data.rows[index].status == 4) {
			$("#status option[value='" + data.rows[index].status + "']").attr('selected', 'selected');
		} else if(data.rows[index].status == 5) {
			$("#status option[value='" + data.rows[index].status + "']").attr('selected', 'selected');
		}
		/*实名制是否认证*/
		if(data.rows[index].valiidnumber == 0) {
			$("#valiidnumber option[value='" + data.rows[index].valiidnumber + "']").attr('selected', 'selected');
		} else if(data.rows[index].valiidnumber == 1) {
			$("#valiidnumber option[value='" + data.rows[index].valiidnumber + "']").attr('selected', 'selected');
		} else if(data.rows[index].valiidnumber == 2) {
			$("#valiidnumber option[value='" + data.rows[index].valiidnumber + "']").attr('selected', 'selected');
		} else if(data.rows[index].valiidnumber == 3) {
			$("#valiidnumber option[value='" + data.rows[index].valiidnumber + "']").attr('selected', 'selected');
		}
		/*是否已设置交易密码*/
		if(data.rows[index].istrpwd == 0) {
			$("#istrpwd option[value='" + data.rows[index].istrpwd + "']").attr('selected', 'selected');
		} else if(data.rows[index].istrpwd == 1) {
			$("#istrpwd option[value='" + data.rows[index].istrpwd + "']").attr('selected', 'selected');
		}
		/*是否开启谷歌验证*/
		if(data.rows[index].googleverify == 0) {
			$("#googleverify option[value='" + data.rows[index].googleverify + "']").attr('selected', 'selected');
		} else if(data.rows[index].googleverify == 1) {
			$("#googleverify option[value='" + data.rows[index].googleverify + "']").attr('selected', 'selected');
		}
		/*是否绑定谷歌验证*/
		if(data.rows[index].valigooglesecret == 0) {
			$("#valigooglesecret option[value='" + data.rows[index].valigooglesecret + "']").attr('selected', 'selected');
		} else if(data.rows[index].valigooglesecret == 1) {
			$("#valigooglesecret option[value='" + data.rows[index].valigooglesecret + "']").attr('selected', 'selected');
		}
		/*是否高级认证*/
		if(data.rows[index].isseniorcertification == 1) {
			$("#isseniorcertification option[value='" + data.rows[index].isseniorcertification + "']").attr('selected', 'selected');
		} else if(data.rows[index].isseniorcertification == 2) {
			$("#isseniorcertification option[value='" + data.rows[index].isseniorcertification + "']").attr('selected', 'selected');
		}

	});

	/*Decimal类型转换*/
	//	$("#initPrice").val(data.rows[index].initPrice.toFixed(8));
	//
	//	$("#robotNumMin").val(data.rows[index].robotNumMin.toFixed(8));
	//	$("#robotNumMax").val(data.rows[index].robotNumMax.toFixed(8));

});

$("#update_gp").click(function() {

	 $('[disabled]').attr("disabled", false);

	var edit_form1 = $("#edit_form1").serializeObject();


	$.ajax({
		type: 'POST',
		url: "/bd/tra/pbupd.do",
		dataType: 'json',
		contentType: "application/json;charset=utf-8",
		async: false,
		isMask: true,
		data: JSON.stringify(edit_form1),
		success: function() {
			bootbox.alert("修改成功");
			xw.update();
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