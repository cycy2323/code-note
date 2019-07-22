var xw;

var Trade_Status = function(val) {
	return {
		f: function(val) {
			if(val == 1) {
				return "申诉中";
			} else if(val == 2) {
				return "申诉成功"
			} else if(val == 3) {
				return "申诉失败"
			}
		},
	}
}();

var Trade_Appeal = function(val) {
	return {
		f: function(val) {
			if(val == 1) {
				return "已付款商户未放行";
			} else if(val == 2) {
				return "付款金额和订单金额不匹配已付款"
			} else if(val == 3) {
				return "暂时不想购买了已付款"
			} else if(val == 4) {
				return "付款账号和登录账号不匹配"
			} else if(val == 5) {
				return "其他"
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
var Appeal = function() {

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
				restURL: "/ug/app/pbeal.do?bd={'':''}",
				coldefs: [{
						col: "ugotcappealid",
						friendly: "申诉id",
						validate: "ugotcappealid",
						nonedit: "nosend",
						hidden:"true",
//						unique: "true",
						index: 1
					},
					{
						col: "userid",
						friendly: "申诉人id",
						validate: "userid",
						index: 2
					},
					{
						col: "orderno",
						friendly: "订单编号",
						validate: "orderno",
						index: 3
					},
					{
						col: "contactway",
						friendly: "联系方式",
						validate: "contactway",
						index: 4
					},
					{
						col: "appealreason",
						friendly: "申诉原因",
						validate: "appealreason",
						format: Trade_Appeal,
						index: 5
					},
					{
						col: "remark",
						friendly: "备注",
						validate: "remark",
						index: 6
					},
					{
						col: "status",
						friendly: "申请状态",
						validate: "status",
						format: Trade_Status,
						index: 7
					},
					{
						col: "createdtime",
						friendly: "申请时间",
						validate: "createdtime",
						index: 8
					},
					{
						friendly: "操作",
						format: Caozuo,
						index: 9,
					},

				],
				// 查询过滤条件
				findFilter: function() {
					var orderno,status,contactway;
					if($('#orderno1').val()) {
						orderno = RQLBuilder.equal("orderno", $.trim($('#orderno1').val()));
					}
					if($('#status1 option:selected').val()) {
						status = RQLBuilder.equal("status", $('#status1  option:selected').val());
					}
					if($('#contactway1').val()) {
						contactway = RQLBuilder.equal("contactway", $.trim($('#contactway1').val()));
					}

					if(contactway == undefined) {
						contactway = '"contactway":""';
					}
					if(status == undefined) {
						status = '"status":""';
					}
					if(orderno == undefined) {
						orderno = '"orderno":""';
					}
					xw.setRestURL("/ug/app/pbeal.do?bd={" + orderno + "," + status + "," + contactway + "}");
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
		/*-----------------------*/
		//console.log('-----',$("form[name='edit_form'] input[name='" + key + "']").length);
		key = key + "_select";
		$("form[name='edit_form'] input[name='" + key + "']").val(val);

		/*状态：1-处理中,2-已处理*/
		if(data.rows[index].status == 1) {
			$("#status_select option[value='" + data.rows[index].status + "']").attr('selected', 'selected');
		} else if(data.rows[index].status == 2) {
			$("#status_select option[value='" + data.rows[index].status + "']").attr('selected', 'selected');
		} else if(data.rows[index].status == 3) {
			$("#status_select option[value='" + data.rows[index].status + "']").attr('selected', 'selected');
		}
		
		/*申诉原因 1-已付款，商户未及时放行已付款2-付款金额和订单金额不匹配已付款3-暂时不想购买了已付款4-付款账号和登录账号不匹配5-其他*/
		if(data.rows[index].appealreason == 1) {
			$("#appealreason_select option[value='" + data.rows[index].appealreason + "']").attr('selected', 'selected');
		} else if(data.rows[index].appealreason == 2) {
			$("#appealreason_select option[value='" + data.rows[index].appealreason + "']").attr('selected', 'selected');
		} else if(data.rows[index].appealreason == 3) {
			$("#appealreason_select option[value='" + data.rows[index].appealreason + "']").attr('selected', 'selected');
		} else if(data.rows[index].appealreason == 4) {
			$("#appealreason_select option[value='" + data.rows[index].appealreason + "']").attr('selected', 'selected');
		} else if(data.rows[index].appealreason == 5) {
			$("#appealreason_select option[value='" + data.rows[index].appealreason + "']").attr('selected', 'selected');
		}
	});

});

/*审批*/
$(document).on('click','#edit_gp',function() {
	var index = $(this).closest('tr').index();
	var data = xw.getTable().getData();
//	console.log(data);
//	console.log(data.rows[index]);
//	console.log(data.rows[index].paymentway);
/*	if(data.rows.length == 0) {
		bootbox.alert("<br><center><h4>请选择一条数据！</h4></center><br>");
		return false;
	}
	if(data.rows.length > 1) {
		bootbox.alert("<br><center><h4>只能选择一行！</h4></center><br>");
		return false;
	}*/

	if(data.rows[index].status == 2) {
		$("#update_gp").attr("style", "display:none;");
		$("#update_gper").attr("style", "display:none;");
	} else if(data.rows[index].status == 1) {
		$("#update_gp").attr("style", "display:block;");
		$("#update_gper").attr("style", "display:block;");
	} else if(data.rows[index].status == 3) {
		$("#update_gp").attr("style", "display:none;");
		$("#update_gper").attr("style", "display:none;");
	}

	$.each(data.rows[index], function(key, val) {

		/*模态框关闭后清空模态框里填写的数据*/
		$("#edit_gp_btn1").on("hidden.bs.modal", function() {
			document.getElementById("edit_form1").reset();
		});
		/*-----------------------*/
		//console.log('-----',$("form[name='edit_form1'] input[name='" + key + "']").length);
		$("form[name='edit_form1'] input[name='" + key + "']").val(val);

		/*状态：1-处理中,2-已处理*/
		if(data.rows[index].status == 1) {
			$("#status option[value='" + data.rows[index].status + "']").attr('selected', 'selected');
		} else if(data.rows[index].status == 2) {
			$("#status option[value='" + data.rows[index].status + "']").attr('selected', 'selected');
		} else if(data.rows[index].status == 3) {
			$("#status option[value='" + data.rows[index].status + "']").attr('selected', 'selected');
		}
		
		/*申诉原因 1-已付款，商户未及时放行已付款2-付款金额和订单金额不匹配已付款3-暂时不想购买了已付款4-付款账号和登录账号不匹配5-其他*/
		if(data.rows[index].appealreason == 1) {
			$("#appealreason option[value='" + data.rows[index].appealreason + "']").attr('selected', 'selected');
		} else if(data.rows[index].appealreason == 2) {
			$("#appealreason option[value='" + data.rows[index].appealreason + "']").attr('selected', 'selected');
		} else if(data.rows[index].appealreason == 3) {
			$("#appealreason option[value='" + data.rows[index].appealreason + "']").attr('selected', 'selected');
		} else if(data.rows[index].appealreason == 4) {
			$("#appealreason option[value='" + data.rows[index].appealreason + "']").attr('selected', 'selected');
		} else if(data.rows[index].appealreason == 5) {
			$("#appealreason option[value='" + data.rows[index].appealreason + "']").attr('selected', 'selected');
		}

	});

});

$("#update_gper").click(function() {
	var edit_form1 = $("#edit_form1").serializeObject();

	$.ajax({
		type: 'POST',
		url: "/ug/app/pbcal.do",
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

$("#update_gp").click(function() {

	var edit_form1 = $("#edit_form1").serializeObject();

	$.ajax({
		type: 'POST',
		url: "/ug/app/pbchu.do",
		dataType: 'json',
		contentType: "application/json;charset=utf-8",
		async: false,
		isMask: true,
		data: JSON.stringify(edit_form1),
		success: function() {
			bootbox.alert("审批成功");
			xw.update();
		},
		error: function() {
			bootbox.alert("审批失败");
			xw.update();
		}
	});

});