var xw;

var AmountType = function(val) {
	return {
		f: function(val) {
			if(val == 1) {
				return "限额";
			} else if(val == 2) {
				return "固额"
			}
		},
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
				return "上架";
			} else if(val == 2) {
				return "下架"
			}
		},
	}
}();
var PaymentWay = function(val) {
	return {
		f: function(val) {
			if(val == 1) {
				return "微信";
			} else if(val == 2) {
				return "支付宝"
			} else if(val == 3) {
				return "银行卡"
			} else if(val == 1+","+2+","+3) {
				return "微信,支付宝,银行卡";
			} else if(val == 1+","+2) {
				return "微信,支付宝";
			} else if(val == 1+","+3) {
				return "微信,银行卡";
			} else if(val == 2+","+3) {
				return "支付宝,银行卡";
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
	var content = "<div class='btn-group form-group'>" +
		"<button id='edit_gp' class='btn blue' data-target='#edit_gp_btn1' data-toggle='modal'>" +
		"<i class='fa fa-pencil'></i> 修改&nbsp;" +
		"</button>" +
		"</div>";
		
var Caozuo = function(val) {
	return aac+content;

}();
var Advert = function() {


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
				restURL: "/ug/adv/pbert.do?bd={'':''}",
				coldefs: [{
						col: "ugotcadvertid",
						friendly: "广告ID",
						validate: "ugotcadvertid",
						nonedit: "nosend",
						hidden:"true",
//						unique: "true",
						index: 1
					},
					{
						col: "userid",
						friendly: "创建人",
						validate: "userid",
						index: 2
					},
					{
						col: "number",
						friendly: "数量",
						validate: "number",
						index: 3
					},
					{
						col: "prompt",
						friendly: "付款期限",
						validate: "prompt",
						index: 4
					},
					{
						col: "limitmaxamount",
						friendly: "限额最大",
						validate: "limitmaxamount",
						index: 5
					},
					{
						col: "limitminamount",
						friendly: "限额最小",
						validate: "limitminamount",
						index: 6
					},
					{
						col: "amounttype",
						friendly: "金额类型",
						validate: "amounttype",
						format: AmountType,
						index: 7
					},
					{
						col: "type",
						friendly: "类型",
						validate: "type",
						format: Type,
						index: 8
					},
					{
						col: "status",
						friendly: "广告状态",
						validate: "status",
						format: Status,
						index: 9
					},
					{
						col: "paymentway",
						friendly: "支付方式",
						validate: "paymentway",
						format: PaymentWay,
						index: 10
					},
					{
						col: "isseniorcertification",
						friendly: "是否需要高级认证",
						validate: "isseniorcertification",
						format: IsSeniorCertification,
						index: 11
					},
					{
						col: "ismerchantstrade",
						friendly: "是否与平台商家交易",
						validate: "ismerchantstrade",
						format: IsMerchantsTrade,
						index: 12
					},
					{
						col: "createdtime",
						friendly: "广告发布时间",
						validate: "createdtime",
						index: 13
					},
					{
						friendly: "操作",
						format: Caozuo,
						index: 14,
					},

				],
				// 查询过滤条件
				findFilter: function() {
					var userid, type, status, isseniorcertification, ismerchantstrade;
					if($('#userid1').val()) {
						userid = RQLBuilder.equal("userid", $.trim($('#userid1').val()));
					}
					if($('#type1 option:selected').val()) {
						type = RQLBuilder.equal("type", $('#type1  option:selected').val());
					}
					if($('#status1 option:selected').val()) {
						status = RQLBuilder.equal("status", $('#status1  option:selected').val());
					}
					if($('#isseniorcertification1 option:selected').val()) {
						isseniorcertification = RQLBuilder.equal("isseniorcertification", $('#isseniorcertification1  option:selected').val());
					}
					if($('#ismerchantstrade1 option:selected').val()) {
						ismerchantstrade = RQLBuilder.equal("ismerchantstrade", $('#ismerchantstrade1  option:selected').val());
					}

					if(userid == undefined) {
						userid = '"userid":""';
					}
					if(type == undefined) {
						type = '"type":""';
					}
					if(status == undefined) {
						status = '"status":""';
					}
					if(isseniorcertification == undefined) {
						isseniorcertification = '"isseniorcertification":""';
					}
					if(ismerchantstrade == undefined) {
						ismerchantstrade = '"ismerchantstrade":""';
					}
					
					xw.setRestURL("/ug/adv/pbert.do?bd={" + userid + "," + type + "," + status + "," + isseniorcertification + "," + ismerchantstrade + "}");
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
		if(data.rows[index].status == 1) {
			$("#status_select option[value='" + data.rows[index].status + "']").attr('selected', 'selected');
		} else if(data.rows[index].status == 2) {
			$("#status_select option[value='" + data.rows[index].status + "']").attr('selected', 'selected');
		}
		/*支付方式*/
		if(data.rows[index].paymentway == 1) {
			$("#paymentway_select option[value='" + data.rows[index].paymentway + "']").attr('selected', 'selected');
		} else if(data.rows[index].paymentway == 2) {
			$("#paymentway_select option[value='" + data.rows[index].paymentway + "']").attr('selected', 'selected');
		} else if(data.rows[index].paymentway == 3) {
			$("#paymentway_select option[value='" + data.rows[index].paymentway + "']").attr('selected', 'selected');
		} else if(data.rows[index].paymentway == 1,2) {
			$("#paymentway_select option[value='" + data.rows[index].paymentway + "']").attr('selected', 'selected');
		} else if(data.rows[index].paymentway == 1,3) {
			$("#paymentway_select option[value='" + data.rows[index].paymentway + "']").attr('selected', 'selected');
		} else if(data.rows[index].paymentway == 2,3) {
			$("#paymentway_select option[value='" + data.rows[index].paymentway + "']").attr('selected', 'selected');
		} else if(data.rows[index].paymentway == 1,2,3) {
			$("#paymentway_select option[value='" + data.rows[index].paymentway + "']").attr('selected', 'selected');
		}
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
		/*是否需要高级认证*/
		if(data.rows[index].ismerchantstrade == 1) {
			$("#ismerchantstrade_select option[value='" + data.rows[index].ismerchantstrade + "']").attr('selected', 'selected');
		} else if(data.rows[index].ismerchantstrade == 2) {
			$("#ismerchantstrade_select option[value='" + data.rows[index].ismerchantstrade + "']").attr('selected', 'selected');
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
	    
    $('[disabled]').attr("disabled", false);

	var edit_form1 = $("#edit_form1").serializeObject();

	$.ajax({
		type: 'POST',
		url: "/ug/adv/pbgai.do",
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
			bootbox.alert("修改成功");
			xw.update();
			}
		},
		error: function() {
			bootbox.alert("修改失败");
			xw.update();
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
//		url: "/ug/adv/pbsha.do",
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
//		url: "/ug/adv/pbsha.do",
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