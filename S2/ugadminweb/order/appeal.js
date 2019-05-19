var xw;

var Trade_Status = function(val) {
	return {
		f: function(val) {
			if(val == 1) {
				return "申诉中";
			} else if(val == 2) {
				return "申诉通过"
			} else if(val == 3) {
				return "仲裁中"
			} else if(val == 4){
				return "仲裁通过";
			} else if (val == 5) {
				return "仲裁不通过";
			} else {
                return "_申诉取消";
			}
		},
	}
}();

var Trade_orderStatus = function(val) {
    return {
        f: function(val) {
            if(val == 1) {
                return "未付款";
            } else if(val == 2) {
                return "已付款"
            } else if(val == 3) {
                return "已完成"
            } else if(val == 4){
                return "已取消";
            } else if (val == 5) {
                return "已关闭(自动)";
            }else {
            	return "申诉中"
			}
        },
    }
}();

var Trade_appealStatus = function(val) {
    return {
        f: function(val) {
            if(val == 1) {
                return "买家申诉";
            }else{
                return "卖家申诉";
            }
        },
    }
}();

var Trade_Appeal = function(val) {
	return {
		f: function(val) {
			if(val == '0_B_1_5' || val == '0_B_1_2' || val == '0_S_1_2') {
				return "其他原因";
			} else if(val == '1_B_1_5') {
				return "卖家提供错误付款信息"
			} else if(val == '2_B_1_5') {
				return "已付款，但未在时间内点击确认付款"
			} else if(val == '1_S_1_2') {
				return "买方未付款却标记已付款"
			} else if(val == '1_B_1_2') {
				return "付款后卖方不放行BUB"
			}
		},
	}
}();
var Remark = function(val) {
	return {
		f: function(val) {
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
var Caozuo = function() {
	return {
		f: function(val, row) {
			var result = '<div class="btn-group form-group">';
			result += '<button id="edit_btn" class="btn green check" data-target="#edit_gp_btn" data-toggle="modal">';
			result += '<i class="fa fa-eye"></i> 查看 ';
			result += '</button>';
			result += '</div>';
			if (row.status == 1) {
				result += '<div class="btn-group form-group">';
				result += '<button id="edit_gp" class="btn blue" data-target="#edit_gp_btn1" data-toggle="modal">';
				result += '<i class="fa fa-pencil"></i> 审批 ';
				result += '</button>';
				result += '</div>';
			}
			return result;
		}
	};
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
				pageSize: 10,
				// columnPicker: true,
				transition: 'fade',
				checkboxes: true,
				checkAllToggle: true,
				saveColumn:false,
				//----------------基本restful地址---
				restURL: "/ug/app/pbeal.do?bd={'':''}",
				coldefs: [{
						col: "appealId",
						friendly: "申诉id",
						validate: "appealId",
						nonedit: "nosend",
						hidden:"true",
//						unique: "true",
						index: 1
					},
					{
						col: "nickname",
						friendly: "用户名",
						validate: "nickname",
						index: 3
					},
					{
						col: "orderid",
						friendly: "订单编号",
						validate: "orderid",
						index: 2
					},
                    {
                        col: "orderstatus",
                        friendly: "订单状态",
                        validate: "orderstatus",
						format: Trade_orderStatus,
                        index: 4
                    },
					{
						col: "type",
						friendly: "申诉类型",
						validate: "type",
						format: Trade_appealStatus,
						index: 5
					},
					{
						col: "reason",
						friendly: "申诉原因",
						validate: "reason",
						format: Trade_Appeal,
						index: 5
					},
					{
						col: "remarks",
						friendly: "备注",
						validate: "remarks",
						format: Remark,
						index: 6
					},
					{
						col: "status",
						friendly: "申诉状态",
						validate: "status",
						format: Trade_Status,
						index: 7
					},
					{
						col: "createdtime",
						friendly: "申请时间",
						validate: "createdtime",
						format: {f: function(createdTime) {return createdTime.replace('T', ' ');}},
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
					var orderno,status,type,reason;
					if($('#orderid').val()) {
                        orderno = RQLBuilder.equal("orderno", $.trim($('#orderid').val()));
					}
					if($('#appealStatus option:selected').val()) {
						status = RQLBuilder.equal("status", $('#appealStatus  option:selected').val());
					}
                    if($('#appealType option:selected').val()) {
                        type = RQLBuilder.equal("type", $('#appealType  option:selected').val());
                    }
                    if($('#appealCause option:selected').val()) {
                        reason = RQLBuilder.equal("reason", $('#appealCause  option:selected').val());
                    }
					// if($('#contactway1').val()) {
					// 	contactway = RQLBuilder.equal("contactway", $.trim($('#contactway1').val()));
					// }
					//
					// if(contactway == undefined) {
					// 	contactway = '"contactway":""';
					// }
					if(status == undefined) {
						status = '"status":""';
					}
					if(orderno == undefined) {
						orderno = '"orderno":""';
					}
                    if(type == undefined) {
                        type = '"type":""';
                    }
                    if(reason == undefined) {
                        reason = '"reason":""';
                    }
					xw.setRestURL("/ug/app/pbeal.do?bd={" + orderno + "," + status + ","+ type + "," + reason +"}");
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
	/*模态框关闭后清空模态框里填写的数据*/
	$("#edit_gp_btn").on("hidden.bs.modal", function() {
		document.getElementById("edit_form").reset();
	});
	var index = $(this).closest('tr').index();
	var data = xw.getTable().getData();
	$.each(data.rows[index], function(key, val) {
		key = key + "_select";
		$("form[name='edit_form'] input[name='" + key + "']").val(val);

	});
	$('#orderno_select').val(data.rows[index].orderid);
	$('#appealType_select').val(data.rows[index].type);
	$('#userName').val(data.rows[index].nickname);
	$('#remarks_select').val(data.rows[index].remarks);
		/*状态：1-处理中,2-已处理*/
		if(data.rows[index].status) {
			$("#status_select option[value='" + data.rows[index].status + "']").attr('selected', 'selected');
		}
		/*申诉原因 1-已付款，商户未及时放行已付款2-付款金额和订单金额不匹配已付款3-暂时不想购买了已付款4-付款账号和登录账号不匹配5-其他*/
		if(data.rows[index].appealreason) {
			$("#appealreason_select option[value='" + data.rows[index].appealreason + "']").attr('selected', 'selected');
		}
});

/*审批*/
$(document).on('click','#edit_gp',function() {
	/*模态框关闭后清空模态框里填写的数据*/
	$("#edit_gp_btn1").on("hidden.bs.modal", function() {
		document.getElementById("edit_form1").reset();
	});
	var index = $(this).closest('tr').index();
	var data = xw.getTable().getData();
    $('#orderno').val(data.rows[index].orderid);
    $('#appealTypeSelect').val(data.rows[index].type);
    $('#userID').val(data.rows[index].nickname);
    $('#remarkSelect').val(data.rows[index].remarks);
    $('#createdtimeSelect').val(data.rows[index].createdtime);
    $('#imgPath').attr('src',data.rows[index].details[0].voucherUrl);
    $('#appealId').val(data.rows[index].id);
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
		$("form[name='edit_form1'] input[name='" + key + "']").val(val);
	});
	/*状态：1-处理中,2-已处理*/
	if(data.rows[index].status) {
		$("#status option[value='" + data.rows[index].status + "']").attr('selected', 'selected');
	}
	/*申诉原因 1-已付款，商户未及时放行已付款2-付款金额和订单金额不匹配已付款3-暂时不想购买了已付款4-付款账号和登录账号不匹配5-其他*/
	if(data.rows[index].appealreason) {
		$("#appealreason option[value='" + data.rows[index].appealreason + "']").attr('selected', 'selected');
	}
});

// $("#update_gper").click(function() {
// 	var edit_form1 = $("#edit_form1").serializeObject();
//     var index = $(this).closest('tr').index();
//     var data = xw.getTable().getData();
// 	$.ajax({
// 		type: 'POST',
// 		url: "/ug/app/pbcal.do",
// 		dataType: 'json',
// 		contentType: "application/json;charset=utf-8",
// 		async: false,
// 		isMask: true,
// 		data: JSON.stringify(edit_form1),
// 		success: function() {
// 			bootbox.alert("审批不通过成功");
// 			xw.update();
// 		},
// 		error: function() {
// 			bootbox.alert("审批不通过失败");
// 			xw.update();
// 		}
// 	});
//
// });

$("#appeal").click(function() {
	var edit_form1 = $("#edit_form1").serializeObject();
	$.ajax({
		type: 'POST',
		url: "/ug/appeal/pbapproval.do",
		dataType: 'json',
		contentType: "application/json;charset=utf-8",
		async: false,
		isMask: true,
		data: JSON.stringify(edit_form1),
		success: function(data) {
			if(data.errCode == 1) {
                bootbox.alert("审批成功");
                xw.update();
			}else {
				bootbox.alert(data.msg);
				return false;
			}

		},
		error: function() {
			bootbox.alert("审批失败");
			xw.update();
		}

	});

});
