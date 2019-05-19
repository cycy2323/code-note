var xw;

var PaymentWay = function(val) {
	return {
		f: function(val) {
			if(val == 1) {
				return "微信";
			} else if(val == 2) {
				return "支付宝";
			} else if(val == 3) {
				return "银行卡";
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
var Payment = function() {

	var userHelper = RefHelper.create({
		ref_url: "ugotcpaymentway",
		ref_col: "ugOtcPaymentWayId",

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
				pageSize: 10,
				// columnPicker: true,
				transition: 'fade',
				checkboxes: true,
				checkAllToggle: true,
				saveColumn:false,
				//----------------基本restful地址---
				restbase: 'ugotcpaymentway?sort=-createdTime',
				key_column: 'ugOtcPaymentWayId',
				coldefs: [
// 					{
// 						col: "ugOtcPaymentWayId",
// 						friendly: "收款方式表主键",
// 						validate: "ugOtcPaymentWayId",
// 						nonedit: "nosend",
// 						hidden: 'true',
// //						unique: "true",
// 						index: 1
// 					},
					{
						col: "userId",
						friendly: "用户ID",
						validate: "userId",
						index: 2
					},
					{
						col: "paymentWay",
						friendly: "收款方式",
						validate: "paymentWay",
						format: PaymentWay,
						index: 3
					},
					{
						col: "paymentAccount",
						friendly: "账号",
						validate: "paymentAccount",
						index: 4
					},
					{
						col: "qrCode",
						friendly: "二维码",
						validate: "qrCode",
						index: 5
					},
					{
						col: "accountOpenBank",
						friendly: "开户银行",
						validate: "accountOpenBank",
						index: 6
					},
					{
						col: "accountOpenBranch",
						friendly: "开户支行",
						validate: "accountOpenBranch",
						index: 7
					},
					{
						col: "accountBankCard",
						friendly: "银行卡号",
						validate: "accountBankCard",
						index: 8
					},
					{
						col: "createdTime",
						friendly: "创建时间",
						validate: "createdTime",
						index: 10
					},
//					{
//						col: "modifyTime",
//						friendly: "修改时间",
//						validate: "modifyTime",
//						index: 11
//					},
					{
						friendly: "操作",
						format: Caozuo,
						index: 12,
					},

				],
				// 查询过滤条件
				findFilter: function() {
					var paymentWay;
					if($('#paymentWay1 option:selected').val()) {
						paymentWay = RQLBuilder.equal("paymentWay", $('#paymentWay1  option:selected').val());
					}
					var filter = RQLBuilder.and([
						paymentWay
					]);
					return filter.rql();
				},

			})
		}
	}

}();

/*查看详细信息*/

$(document).on('click','#edit_btn',function() {
	/*模态框关闭后清空模态框里填写的数据*/
	$("#edit_gp_btn").on("hidden.bs.modal", function() {
		document.getElementById("edit_form").reset();
	});
	$('#qrCode').html('');
	var index = $(this).closest('tr').index();
	var data = xw.getTable().getData();
	$('#qrCode').qrcode(data.rows[index].qrCode)
	$.each(data.rows[index], function(key, val) {
		$("form[name='edit_form'] input[name='" + key + "']").val(val);
	});
	/*订单支付方式：1-微信，2-支付宝，3银行卡*/
	if(data.rows[index].paymentWay == 1) {
		$("#paymentWay option[value='" + data.rows[index].paymentWay + "']").attr('selected', 'selected');
	} else if(data.rows[index].paymentWay == 2) {
		$("#paymentWay option[value='" + data.rows[index].paymentWay + "']").attr('selected', 'selected');
	} else if(data.rows[index].paymentWay == 3) {
		$("#paymentWay option[value='" + data.rows[index].paymentWay + "']").attr('selected', 'selected');
	}
	/*状态，1-未支付，2-已付款，3-确认收款，4-交易成功，5-已取消，6-交易关闭(手动，7-交易超时关闭，8-申诉中*/
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
	} else if(data.rows[index].status == 6) {
		$("#status option[value='" + data.rows[index].status + "']").attr('selected', 'selected');
	} else if(data.rows[index].status == 7) {
		$("#status option[value='" + data.rows[index].status + "']").attr('selected', 'selected');
	} else if(data.rows[index].status == 8) {
		$("#status option[value='" + data.rows[index].status + "']").attr('selected', 'selected');
	}
	/*是否评价，1-已评价,2-未评价*/
	if(data.rows[index].paymentWay == 1) {
		$("#paymentWay option[value='" + data.rows[index].paymentWay + "']").attr('selected', 'selected');
	} else if(data.rows[index].paymentWay == 2) {
		$("#paymentWay option[value='" + data.rows[index].paymentWay + "']").attr('selected', 'selected');
	}
});


//var button_init = function() {
//	var user_info = localStorage.getItem("user_info");
//	//获取后先转为json
//	var userInfo = eval('(' + user_info + ')');
//	//获取登陆名
//	var login_name = userInfo.login_name;
//
////	var content = "<div class='btn-group form-group'>" +
////		"<button id='add_ann' class='btn green' data-target='#edit_gp_btn' data-toggle='modal'>" +
////		"<i class='fa fa-plus'></i> 添加&nbsp;" +
////		"</button>" +
////		"</div>" + "&nbsp" +
////		"<div class='btn-group form-group'>" +
////		"<button id='edit_gp' class='btn blue' data-target='#edit_gp_btn1' data-toggle='modal'>" +
////		"<i class='fa fa-pencil'></i> 修改&nbsp;" +
////		"</button>" +
////		"</div>";
//	if(login_name == "admin") {
//		$('#find').append(content);
//	}
//}();

/*修改*/
$("#edit_gp").click(function() {

	var data = xw.getTable().getData(true);

	if(data.rows.length == 0) {
		bootbox.alert("<br><center><h4>请选择一条数据！</h4></center><br>");
		return false;
	}
	if(data.rows.length > 1) {
		bootbox.alert("<br><center><h4>只能选择一行！</h4></center><br>");
		return false;
	}

	$.each(data.rows[index], function(key, val) {
		/*模态框关闭后清空模态框里填写的数据*/
		$("#edit_gp_btn1").on("hidden.bs.modal", function() {
			document.getElementById("edit_form1").reset();
		});
		/*-----------------------*/
		$("form[name='edit_form1'] input[name='" + key + "']").val(val);
		if(data.rows[index].status == 0) {
			$("#status option[value='" + data.rows[index].status + "']").attr('selected', 'selected');
		} else if(data.rows[index].status == 1) {
			$("#status option[value='" + data.rows[index].status + "']").attr('selected', 'selected');
		}
	});

});

$("#update_gp").click(function() {

	/*var date = new Date();
	var year = date.getFullYear();
	var month = date.getMonth() + 1;
	var day = date.getDate();
	var hour = date.getHours();
	var minute = date.getMinutes();
	var second = date.getSeconds();
	var sj = year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
	$("#modifiedTime").val(sj);
	*/
	var edit_form1 = $("#edit_form1").serializeObject();
	if($("#status").val() == "") {
		alert('状态不能为空');

		return false;
	}
	if($("#sort").val() == "") {
		alert('不能为空');

		return false;
	}

	//	$.ajax({
	//		type: 'POST',
	//		url: "/tx/art/pbcle.do",
	//		dataType: 'json',
	//		contentType: "application/json;charset=utf-8",
	//		async: false,
	//		isMask: true,
	//		data: JSON.stringify(edit_form1),
	//		success: function() {
	//			bootbox.alert("修改成功");
	//			xw.update();
	//		},
	//		error: function() {
	//			bootbox.alert("修改失败");
	//			xw.update();
	//		}
	//	});
	//
});

/*新增*/
/*   $("#add_ann").click(function(){


	var data = xw.getTable().getData(true);

});*/

//$("#update_gp1").click(function() {
//
//	/*var date = new Date();
//	var year = date.getFullYear();
//	var month = date.getMonth() + 1;
//	var day = date.getDate();
//	var hour = date.getHours();
//	var minute = date.getMinutes();
//	var second = date.getSeconds();
//	var sj = year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
//	$("#createTime_select").val(sj);*/
//
//	var edit_form = $("#edit_form").serializeObject();
//
//	$.ajax({
//		type: 'POST',
//		url: "/tx/art/pbadd.do",
//		dataType: 'json',
//		contentType: "application/json;charset=utf-8",
//		async: false,
//		isMask: true,
//		data: JSON.stringify(edit_form),
//		success: function() {
//
//			bootbox.alert("新增成功");
//			xw.update();
//		},
//		error: function() {
//
//			bootbox.alert("新增失败");
//			xw.update();
//		}
//	});
//
//});

/*点击新增查看分类*/
/*$("#add_ann").click(function(){


	$.ajax({
            type: 'POST',
            url:"/tx/art/pbory.do",
            dataType: 'json',
            contentType: "application/json;charset=utf-8",
            async: false,
            isMask: true,
            data: JSON.stringify(edit_form),
            success: function(result) {

            	bootbox.alert("查询成功");
            	xw.update();
            },
            error: function(result) {

				bootbox.alert("查询失败");
				xw.update();
            }
        });


});*/
