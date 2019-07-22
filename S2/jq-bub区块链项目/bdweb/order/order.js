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

var Status = function(val) {
	return {
		f: function(val) {
			if(val == 1) {
				return "未付款";
			} else if(val == 2) {
				return "已付款";
			} else if(val == 3) {
				return "已完成";
			} else if(val == 4) {
				return "已取消";
			} else if(val == 5) {
				return "已关闭（自动）";
			} else if(val == 6) {
				return "申诉中）";
			} else if(val == 7) {
				return "申诉成功";
			} else if(val == 8) {
				return "申诉失败";
			}
		},
	}
}();

var IsEvaluation = function(val) {
	return {
		f: function(val) {
			if(val == 1) {
				return "已评价";
			} else if(val == 2) {
				return "未评价";
			}
		},
	}
}();

var aac = "<div class='btn-group form-group'>" +
	"<button id='edit_btn' class='btn green check' data-target='#edit_gp_btn' data-toggle='modal'>" +
	"<i class='fa fa-eye'></i> 查看&nbsp;" +
	"</button>" +
	"</div>"
var Caozuo = function(val) {
	return aac;

}();
var Order = function() {

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
				restURL: "/bd/ord/pbder.do?bd={'':''}",
				coldefs: [
					/*{
											col: "ugotcorderid",
											friendly: "订单ID",
											validate: "ugotcorderid",
											nonedit: "nosend",
											
											unique: "true",
											index: 1
										},*/
					{
						col: "orderno",
						friendly: "订单号",
						"class": "orderid",
						validate: "orderno",
						index: 2
					},
					{
						col: "advertid",
						friendly: "广告ID",
						validate: "advertid",
						hidden: "true",
						index: 3
					},
					{
						col: "buyuserid",
						friendly: "买家ID",
						validate: "buyuserid",
						index: 4
					},
					{
						col: "selluserid",
						friendly: "卖家ID",
						validate: "selluserid",
						index: 5
					},
					{
						col: "number",
						friendly: "成交数量",
						validate: "number",
						index: 6
					},
					{
						col: "price",
						friendly: "价格",
						validate: "price",
						index: 7
					},
					{
						col: "brokerage",
						friendly: "手续费",
						validate: "brokerage",
						index: 8
					},
					{
						col: "paymentway",
						friendly: "订单支付方式",
						validate: "paymentway",
						format: PaymentWay,
						index: 9
					},
					{
						col: "status",
						friendly: "订单状态",
						validate: "status",
						format: Status,
						index: 10
					},
					{
						col: "isevaluation",
						friendly: "是否评价",
						validate: "isevaluation",
						format: IsEvaluation,
						index: 11
					},
					{
						col: "coinid",
						friendly: "币种",
						validate: "coinid",
						index: 12
					},
					{
						col: "createdtime",
						friendly: "创建时间",
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
					var orderno, buyuserid, selluserid, isevaluation, status, paymentway;
					if($('#orderno1').val()) {
						orderno = RQLBuilder.equal("orderno", $.trim($('#orderno1').val()));
					}
					if($('#buyuserid1').val()) {
						buyuserid = RQLBuilder.equal("buyuserid", $.trim($('#buyuserid1').val()));
					}
					if($('#selluserid1').val()) {
						selluserid = RQLBuilder.equal("selluserid", $.trim($('#selluserid1').val()));
					}
					if($('#isevaluation1 option:selected').val()) {
						isevaluation = RQLBuilder.equal("isevaluation", $('#isevaluation1  option:selected').val());
					}
					if($('#status1 option:selected').val()) {
						status = RQLBuilder.equal("status", $('#status1  option:selected').val());
					}
					if($('#paymentway1 option:selected').val()) {
						paymentway = RQLBuilder.equal("paymentway", $('#paymentway1  option:selected').val());
					}

					if(orderno == undefined) {
						orderno = '"orderno":""';
					}
					if(buyuserid == undefined) {
						buyuserid = '"buyuserid":""';
					}
					if(selluserid == undefined) {
						selluserid = '"selluserid":""';
					}
					if(isevaluation == undefined) {
						isevaluation = '"isevaluation":""';
					}
					if(status == undefined) {
						status = '"status":""';
					}
					if(paymentway == undefined) {
						paymentway = '"paymentway":""';
					}
					xw.setRestURL("/bd/ord/pbder.do?bd={" + orderno + "," + buyuserid + "," + selluserid + "," + isevaluation + "," + status + "," + paymentway + "}");
				},

			})
		}
	}

}();

/*查看详细信息*/

$(document).on('click','.check',function() {
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

		$("form[name='edit_form'] input[name='" + key + "']").val(val);

		/*订单支付方式：1-微信，2-支付宝，3银行卡*/
		if(data.rows[index].paymentway == 1) {
			$("#paymentway option[value='" + data.rows[index].paymentway + "']").attr('selected', 'selected');
		} else if(data.rows[index].paymentway == 2) {
			$("#paymentway option[value='" + data.rows[index].paymentway + "']").attr('selected', 'selected');
		} else if(data.rows[index].paymentway == 3) {
			$("#paymentway option[value='" + data.rows[index].paymentway + "']").attr('selected', 'selected');
		}
		/*订单状态 1.未付款 2.已付款3.已完成4.已取消5.已关闭(自动 )6.申诉中7.申诉成功 8.申诉失败*/
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
		if(data.rows[index].paymentway == 1) {
			$("#paymentway option[value='" + data.rows[index].paymentway + "']").attr('selected', 'selected');
		} else if(data.rows[index].paymentway == 2) {
			$("#paymentway option[value='" + data.rows[index].paymentway + "']").attr('selected', 'selected');
		}
	});

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