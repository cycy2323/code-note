var xw;

var isLOGIN = function(val) {
	return {
		f: function(val) {
			if(val == 1) {
				return "可登陆";
			} else if(val == 0) {
				return "不可登录"
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
var MerchantApply = function() {


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
				pageSize: 10,
				// columnPicker: true,
				transition: 'fade',
				checkboxes: true,
				checkAllToggle: true,
				saveColumn:false,
				//----------------基本restful地址---
				restURL: "/ug/bus/pbsel.do?bd={\"\":\"\"}",
				coldefs: [{
						col: "userid",
						friendly: "商户ID",
						validate: "userid",
						nonedit: "nosend",
						hidden:"true",
						index: 1
					},
					{
						col: "loginname",
						friendly: "商户登录账号",
						validate: "loginname",
						index: 2
					},
					{
						col: "bdrealname",
						friendly: "代理人姓名",
						validate: "bdrealname",
						index: 3
					},
					{
						col: "islogin",
						friendly: "商户是否可登录",
						validate: "islogin",
						format:isLOGIN,
						index: 4
					},
					{
						col: "status",
						friendly: "商户状态",
						validate: "status",
						format: Status,
						index: 5
					},
					{
						col: "createdtime",
						friendly: "商户创建时间",
						validate: "createdtime",
						index: 6
					},
					{
						friendly: "操作",
						format: Caozuo,
						index: 7
					}

				],
				// 查询过滤条件
				findFilter: function() {
					var loginname,realname,status,islogin;
					if($('#loginName').val()) {
						loginname = RQLBuilder.equal("loginname", $.trim($('#loginName').val()));
					}
					if($('#realName').val()) {
						realname = RQLBuilder.equal("realname", $.trim($('#realName').val()));
					}
					if($('#orLogin option:selected').val()) {
						islogin = RQLBuilder.equal("islogin", $('#orLogin  option:selected').val());
					}
					if($('#statusNow option:selected').val()) {
						status = RQLBuilder.equal("status", $('#statusNow  option:selected').val());
					}
					if(loginname == undefined) {
						loginname = '"loginname":""';
					}
					if(realname == undefined) {
						realname = '"realname":""';
					}
					if(islogin == undefined) {
						islogin = '"islogin":""';
					}
					if(status == undefined) {
						status = '"status":""';
					}

					xw.setRestURL("/ug/bus/pbsel.do?bd={" + loginname + "," + realname + "," + islogin + "," + status + "}");
				}

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
	$("#APPEALREASON_SELECT").hide();
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

		/*是否可登陆*/
		if(data.rows[index].islogin == 1) {
			$("#islogin_select option[value='" + data.rows[index].islogin + "']").attr('selected', 'selected');
		} else if(data.rows[index].islogin == 0) {
			$("#islogin_select option[value='" + data.rows[index].islogin + "']").attr('selected', 'selected');
		}
		/*类型*/
		if(data.rows[index].status == 1) {
			$("#status_select option[value='" + data.rows[index].status + "']").attr('selected', 'selected');
		} else if(data.rows[index].status == 2) {
			$("#status_select option[value='" + data.rows[index].status + "']").attr('selected', 'selected');
		} else if(data.rows[index].status == 3) {
			$("#status_select option[value='" + data.rows[index].status + "']").attr('selected', 'selected');
		} else if(data.rows[index].status == 4) {
			$("#status_select option[value='" + data.rows[index].status + "']").attr('selected', 'selected');
		}

		$("#mfusrbusinessid").val(data.rows[index].mfusrbusinessid);
	});

});

/*审批*/
$(document).on('click','#edit_gp',function() {
	var index = $(this).closest('tr').index();
	var data = xw.getTable().getData();
	$.each(data.rows[index], function(key, val) {

		/*模态框关闭后清空模态框里填写的数据*/
		$("#edit_gp_btn1").on("hidden.bs.modal", function() {
			document.getElementById("edit_form1").reset();
		});
		/*-----------------------*/

		$("form[name='edit_form1'] input[name='" + key + "']").val(val);

		/*是否可登陆*/
		if(data.rows[index].islogin == 1) {
			$("#islogin option[value='" + data.rows[index].islogin + "']").attr('selected', 'selected');
		} else if(data.rows[index].islogin == 0) {
			$("#islogin option[value='" + data.rows[index].islogin + "']").attr('selected', 'selected');
		}
		/*类型*/
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
	$('[disabled]').attr("disabled", false);
	var edit_form1 = $("#edit_form1").serializeObject();
	$.ajax({
		type: 'POST',
		url: "/ug/bus/pbshe.do",
		dataType: 'json',
		contentType: "application/json;charset=utf-8",
		async: false,
		isMask: true,
		data: JSON.stringify(edit_form1),
		success: function(ret) {
			if(ret.err_code == "0"){
				bootbox.alert(ret.msg);
				xw.update();
			}else{
				bootbox.alert("审核成功",function(){
					location.reload();
				});
				xw.update();
			}
		},
		error: function() {
			bootbox.alert("审核失败",function(){
				location.reload();
			});
			xw.update();
		}
	});

});
