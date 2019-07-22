var xw;

var Trade_Status = function(val) {
	return {
		f: function(val) {
			if(val == 1) {
				return "申请中";
			} else if(val == 2) {
				return "申请不通过"
			} else if(val == 3) {
				return "申请通过"
			} else if(val == 4) {
				return "已通知"
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
var Password = function() {

	var userHelper = RefHelper.create({
		ref_url: "ugotcretrievepassword",
		ref_col: "id",

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
				restbase: 'ugotcretrievepassword',
				key_column: 'id',
				coldefs: [{
						col: "id",
						friendly: "主键ID",
						validate: "id",
						nonedit: "nosend",
						hidden:"true",
//						unique: "true",
						index: 1
					},
					{
						col: "name",
						friendly: "姓名",
						validate: "name",
						index: 2
					},
					{
						col: "idNumber",
						friendly: "身份证号",
						validate: "idNumber",
						index: 3
					},
					{
						col: "email",
						friendly: "邮箱",
						validate: "email",
						index: 4
					},
					{
						col: "newPassword",
						friendly: "新密码",
						validate: "newPassword",
						index: 5
					},
					{
						col: "status",
						friendly: "申请状态",
						validate: "status",
						format: Trade_Status,
						index: 6
					},
					{
						col: "createdTime",
						friendly: "申请时间",
						validate: "createdTime",
						index: 7
					},
					{
						friendly: "操作",
						format: Caozuo,
						index: 8,
					},

				],
				// 查询过滤条件
				findFilter: function() {
					var find_userId,find_status;
					if($('#userId1').val()) {
						find_userId = RQLBuilder.like("userId", $.trim($('#userId1').val()));
					}
					if($('#status1 option:selected').val()) {
						find_status = RQLBuilder.equal("status", $('#status1  option:selected').val());
					}
					var filter = RQLBuilder.and([
						find_userId,find_status
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

		/*状态：1-处理中,2-已处理*/
		if(data.rows[index].status == 1) {
			$("#status_select option[value='" + data.rows[index].status + "']").attr('selected', 'selected');
		} else if(data.rows[index].status == 2) {
			$("#status_select option[value='" + data.rows[index].status + "']").attr('selected', 'selected');
		}  else if(data.rows[index].status == 3) {
			$("#status_select option[value='" + data.rows[index].status + "']").attr('selected', 'selected');
		}  else if(data.rows[index].status == 4) {
			$("#status_select option[value='" + data.rows[index].status + "']").attr('selected', 'selected');
		}

	});

});

/*审批*/
$(document).on('click','#edit_gp',function() {
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
	$("#idphoto2").attr("src",data.rows[index].idPhoto)
	if(data.rows[index].status == 2) {
		$("#update_gp").attr("style", "display:none;");
	} else if(data.rows[index].status == 1) {
		$("#update_gp").attr("style", "display:block;");
	} else if(data.rows[index].status == 3) {
		$("#update_gp").attr("style", "display:none;");
	} else if(data.rows[index].status == 4) {
		$("#update_gp").attr("style", "display:none;");
	}
	
	if(data.rows[index].status == 2) {
		$("#tongzhi").attr("style", "display:none;");
	} else if(data.rows[index].status == 1) {
		$("#tongzhi").attr("style", "display:none;");
	} else if(data.rows[index].status == 3) {
		$("#tongzhi").attr("style", "display:block;");
	} else if(data.rows[index].status == 4) {
		$("#tongzhi").attr("style", "display:none;");
	}

	$.each(data.rows[index], function(key, val) {

		/*模态框关闭后清空模态框里填写的数据*/
		$("#edit_gp_btn1").on("hidden.bs.modal", function() {
			document.getElementById("edit_form1").reset();
		});
		/*-----------------------*/

		$("form[name='edit_form1'] input[name='" + key + "']").val(val);

		/*状态：1-处理中,2-已处理*/
		if(data.rows[index].status == 1) {
			$("#status option[value='" + data.rows[index].status + "']").attr('selected', 'selected');
		} else if(data.rows[index].status == 2) {
			$("#status option[value='" + data.rows[index].status + "']").attr('selected', 'selected');
		} else if(data.rows[index].status == 3) {
			$("#status option[value='" + data.rows[index].status + "']").attr('selected', 'selected');
		} else if(data.rows[index].status == 4) {
			$("#status option[value='" + data.rows[index].status + "']").attr('selected', 'selected');
		}

	});

});

$("#update_gp").click(function() {

	var edit_form1 = $("#edit_form1").serializeObject();

	$.ajax({
		type: 'POST',
		url: "/ug/res/pbest.do",
		dataType: 'json',
		contentType: "application/json;charset=utf-8",
		async: false,
		isMask: true,
		data: JSON.stringify(edit_form1),
		success: function(ret) {
			console.log(ret.err_code);
			if(ret.err_code == "0"){
				bootbox.alert("无此身份证号的用户");
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

$("#tongzhi").click(function() {

	var edit_form1 = $("#edit_form1").serializeObject();

	$.ajax({
		type: 'POST',
		url: "/ug/res/pbice.do",
		dataType: 'json',
		contentType: "application/json;charset=utf-8",
		async: false,
		isMask: true,
		data: JSON.stringify(edit_form1),
		success: function(ret) {
			console.log(ret.err_code);
			if(ret.err_code == "0"){
				bootbox.alert("通知失败");
			xw.update();
			}else{
			bootbox.alert("通知成功");
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