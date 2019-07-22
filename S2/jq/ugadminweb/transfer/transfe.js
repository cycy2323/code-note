var xw;
var paytype = function(val) {
	return {
		f: function(val) {
			if(val == 1) {
				return "APP扫码支付";
			} else if(val == 2) {
				return "H5"
			}else if(val == 3) {
				return "APP支付"
			}
		}
	}
}();
var transferstatust = function(val) {
	return {
		f: function(val) {
			if(val == 1) {
				return "成功";
			} else if(val == 2) {
				return "失败"
			}else if(val == 3) {
				return "未支付"
			} else if (val == 4) {
				return "超时关闭"
			}
		}
	}
}();
var outtradenoformat = function(val) {
	return {
		f: function(val) {
			if(val == null) {
				return "";
			} else{
				return val;
			}
		}
	}
}();

var nullformat = function(val) {
	return {
		f: function(val) {
			if(val == null) {
				return "-";
			} else{
				return val;
			}
		}
	}
}();

var notifystatusn = function(val) {
	return {
		f: function(val) {
			if(val == 1) {
				return "成功";
			} else if(val == 2) {
				return "失败"
			}
		}
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

var Transfe = function() {

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
				transition: 'fade',
				checkboxes: true,
				checkAllToggle: true,
				saveColumn:false,
				//----------------基本restful地址---
				restURL: "/ug/bus/pbtrn.do?bd={}",
				coldefs: [
					{
						col: "ugotctransferrecordid",
						friendly: "转账ID",
						validate: "ugotctransferrecordid",
						nonedit: "nosend",
						hidden:"true",
						index: 1
					},
					{
						col: "frombusinessid",
						friendly: "付款商户ID ",
						validate: "frombusinessid",
						index: 2
					},
					{
						col: "tobusinessid",
						friendly: "收款商户ID ",
						validate: "tobusinessid",
						index: 3
					},
					{
						col: "fromusername",
						friendly: "付款人账号",
						validate: "fromusername",
						index: 4,
						format:nullformat
					},
					{
						col: "tousername",
						friendly: "收款人账号",
						validate: "tousername",
						index: 5,
						format:nullformat
					},
					{
						col: "outtradeno",
						friendly: "商户订单号",
						validate: "outtradeno",
						format:outtradenoformat,
						index: 6
					},
					{
						col: "number",
						friendly: "支付金额",
						validate: "number",
						index: 7
					},
					{
						col: "totleamount",
						friendly: "实际到账金额",
						validate: "totleamount",
						index: 8
					},
					{
						col: "paytype",
						friendly: "支付方式",
						validate: "paytype",
						format:paytype,
						index: 9
					},
					{
						col: "transfertime",
						friendly: "付款时间",
						validate: "transfertime",
						index: 10,
						format:nullformat
					},
					{
						col: "transferstatus",
						friendly: "转账状态",
						validate: "transferstatus",
						format:transferstatust,
						index: 11
					},
					{
						col: "notifystatus",
						friendly: "通知状态",
						validate: "notifystatus",
						format:notifystatusn,
						index: 12
					},
					{
						col: "createdtime",
						friendly: "创建时间",
						validate: "createdtime",
						format:nullformat,
						index: 13
					},
					{
						friendly: "操作",
						format: Caozuo,
						index: 14
					}
				],
				// 查询过滤条件

				findFilter: function() {
					var paytype,transferstatus,notifystatus,starttime,endtime,tobusinessid,frombusinessid,outtradeno;

					if($('#outtradeno1').val()) {
						outtradeno = RQLBuilder.equal("outtradeno", $.trim($('#outtradeno1').val()));
					}
					if($('#tobusinessid1').val()) {
						tobusinessid = RQLBuilder.equal("tobusinessid", $.trim($('#tobusinessid1').val()));
					}
					if($('#frombusinessid1').val()) {
						frombusinessid = RQLBuilder.equal("frombusinessid", $.trim($('#frombusinessid1').val()));
					}
					if($('#payType1').val()) {
						paytype = RQLBuilder.equal("paytype", $.trim($('#payType1  option:selected').val()));
					}
					if($('#transferStatus1').val()) {
						transferstatus = RQLBuilder.equal("transferstatus", $.trim($('#transferStatus1  option:selected').val()));
					}
					if($('#notifyStatus1').val()) {
						notifystatus = RQLBuilder.equal("notifystatus", $.trim($('#notifyStatus1  option:selected').val()));
					}
					if($('#createdTimeStart1').val()) {
						starttime = RQLBuilder.equal("starttime", $.trim($('#createdTimeStart1').val()));
					}
					if($('#createdTimeEnd1').val()) {
						endtime = RQLBuilder.equal("endtime", $.trim($('#createdTimeEnd1').val()));
					}
					if(paytype == undefined) {
						paytype = '"paytype":""';
					}
					if(transferstatus == undefined) {
						transferstatus = '"transferstatus":""';
					}
					if(notifystatus == undefined) {
						notifystatus = '"notifystatus":""';
					}
					if(starttime == undefined) {
						starttime = '"starttime":""';
					}
					if(endtime == undefined) {
						endtime = '"endtime":""';
					}

					if(tobusinessid == undefined) {
						tobusinessid = '"tobusinessid":""';
					}
					if(frombusinessid == undefined) {
						frombusinessid = '"frombusinessid":""';
					}
					if(outtradeno == undefined) {
						outtradeno = '"outtradeno":""';
					}
					xw.setRestURL("/ug/bus/pbtrn.do?bd={" +paytype+","+transferstatus+","+notifystatus+","+starttime+","+endtime+","+tobusinessid+","+frombusinessid+","+outtradeno+"}");
				}
			})
		}
	}

}();

/*查看详细信息*/

$(document).on('click','#edit_btn',function() {
	var index = $(this).closest('tr').index();
	var data = xw.getTable().getData();
	$.each(data.rows[index], function(key, val) {
		/*模态框关闭后清空模态框里填写的数据*/
		$("#edit_gp_btn").on("hidden.bs.modal", function() {
			document.getElementById("edit_form").reset();
		});
		/*-----------------------*/

		$("form[name='edit_form'] input[name='" + key + "']").val(val);

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
/**转账记录下载 */
$('#down_button').click(function(){
	$.ajax({
		type: 'POST',
		url: "/ug/tra/pbtrs.do",
		dataType: 'json',
		contentType: "application/json;charset=utf-8",
		async: false,
		isMask: true,
		data: JSON.stringify(edit_form1),
		success: function() {
			bootbox.alert("下载成功");
		},
		error: function() {
			bootbox.alert("下载失败");
		}
	});
});
layui.use('laydate', function(){
	var laydate = layui.laydate;
	//常规用法
	laydate.render({
		elem: '#createdTimeEnd1'
	});
	laydate.render({
		elem: '#createdTimeStart1'
	});
});
