var xw;


var Isguarantee = function(val) {
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

var Isauthentication = function(val) {
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

var hao = function(val) {
	return {
		f: function(val) {
			return val==null?"":val;
		},
	}
}();
var isvipState = function(val) {
	return {
		f: function(val) {
			return val==null?"":val==1?"是":val==2?"否":"";
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
var Mer = function() {

	return {
		init: function() {
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
				restURL: "/ug/tra/pbadd.do?bd={'':''}",
				coldefs: [{
						col: "ugotcmerchantid",
						friendly: "商户ID",
						validate: "ugotcmerchantid",
						nonedit: "nosend",
					    hidden:true,
//						unique: "true",
						index: 1
					},
					{
						col: "userid",
						friendly: "用户ID",
						validate: "userid",
						index: 2
					},
					{
						col: "username",
						friendly: "登录账号",
						validate: "username",
						index: 3
					},
					{
						col: "highpraisenumber",
						friendly: "好评数量",
						validate: "highpraisenumber",
						format:hao,
						index: 4
					},
					{
						col: "ordertotle",
						friendly: "订单总量",
						validate: "ordertotle",
						index: 5
					},
					{
						col: "ordercomplete",
						friendly: "订单完成量",
						validate: "ordercomplete",
						index: 6
					},
					{
						col: "ordercancel",
						friendly: "订单取消量",
						validate: "ordercancel",
						index: 7
					},
					{
						col: "isguarantee",
						friendly: "是否赔付担保",
						validate: "isguarantee",
						format: Isguarantee,
						index: 8
					},
					{
						col: "isauthentication",
						friendly: "是否身份认证 ",
						validate: "isauthentication",
						format: Isauthentication,
						index: 9
					},
					{
						col: "isvip",
						friendly: "商户是否为VIP",
						validate: "isvip",
						format: isvipState,
						index: 10
					},
					{
						friendly: "操作",
						format: Caozuo,
						index: 11
					}

				],
				// 查询过滤条件
				findFilter: function() {
					var isguarantee,isauthentication,userid,isvip,username;

					if($('#isguarantee1 option:selected').val()) {
						isguarantee = RQLBuilder.equal("isguarantee", $('#isguarantee1  option:selected').val());
					}
					if($('#isauthentication1 option:selected').val()) {
						isauthentication = RQLBuilder.equal("isauthentication", $('#isauthentication1  option:selected').val());
					}
					if($('#userid').val()) {
						userid = RQLBuilder.equal("userid", $('#userid').val());
					}
					if(userid == undefined) {
						userid = '"userid":""';
					}
					if($('#isVip option:selected').val()) {
						isvip = RQLBuilder.equal("isvip", $('#isVip  option:selected').val());
					}
					if(isvip == undefined) {
						isvip = '"isvip":""';
					}
					if($('#username').val()) {
						username = RQLBuilder.equal("username", $('#username').val());
					}
					if(username == undefined) {
						username = '"username":""';
					}

					if(isguarantee == undefined) {
						isguarantee = '"isguarantee":""';
					}
					if(isauthentication == undefined) {
						isauthentication = '"isauthentication":""';
					}
					xw.setRestURL("/ug/tra/pbadd.do?bd={" + isguarantee + "," + isauthentication +"," + userid + "," + username +"," + isvip +"}");
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

		if(data.rows[index].isguarantee == 1) {
			$("#isguarantee_select option[value='" + data.rows[index].isguarantee + "']").attr('selected', 'selected');
		} else if(data.rows[index].isguarantee == 2) {
			$("#isguarantee_select option[value='" + data.rows[index].isguarantee + "']").attr('selected', 'selected');
		}
		if(data.rows[index].isauthentication == 1) {
			$("#isauthentication_select option[value='" + data.rows[index].isauthentication + "']").attr('selected', 'selected');
		} else if(data.rows[index].isguarantee == 2) {
			$("#isauthentication_select option[value='" + data.rows[index].isauthentication + "']").attr('selected', 'selected');
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

	$.each(data.rows[index], function(key, val) {
		/*模态框关闭后清空模态框里填写的数据*/
		$("#edit_gp_btn1").on("hidden.bs.modal", function() {
			document.getElementById("edit_form1").reset();

		});
		$("form[name='edit_form1'] input[name='" + key + "']").val(val);
		if(data.rows[index].isguarantee == 1) {
			$("#isguarantee option[value='" + data.rows[index].isguarantee + "']").attr('selected', 'selected');
		} else if(data.rows[index].isguarantee == 2) {
			$("#isguarantee option[value='" + data.rows[index].isguarantee + "']").attr('selected', 'selected');
		}

		if(data.rows[index].isauthentication == 1) {
			$("#isauthentication option[value='" + data.rows[index].isauthentication + "']").attr('selected', 'selected');
		} else if(data.rows[index].isguarantee == 2) {
			$("#isauthentication option[value='" + data.rows[index].isauthentication + "']").attr('selected', 'selected');
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
		url: "/ug/tra/pbupa.do",
		dataType: 'json',
		contentType: "application/json;charset=utf-8",
		async: false,
		isMask: true,
		data: JSON.stringify(edit_form1),
		success: function() {
			bootbox.alert("修改成功");
			xw.update();
		},
		error: function() {
			bootbox.alert("修改失败");
			xw.update();
		}
	});

});
