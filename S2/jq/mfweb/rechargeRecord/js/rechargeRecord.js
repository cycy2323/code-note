var xw;

var aac = "<div class='btn-group form-group'>" +
	"<button id='edit_btn' class='btn green check' data-target='#edit_gp_btn' data-toggle='modal'>" +
	"<i class='fa fa-eye'></i> 查看&nbsp;" +
	"</button>" +
	"</div>";
var Caozuo = function(val) {
	return aac;
}();
//支付方式
var payTypeFormat = function(val) {
	return {//1-APP扫码支付 2-H5 3-APP支付
		f: function(val) {
			if(val == 1) {
				return "APP扫码支付";
			} else if(val == 2) {
				return "H5支付"
			} else if(val == 3) {
				return "APP支付"
			} else if(val == 4) {
				return ""
			}
		},
	}
}();
//状态
var transferStatus = function(val) {
	return {
		f: function(val) {
			if(val == 1) {
				return "成功";
			} else if(val == 2) {
				return "失败"
			} else if (val == 3) {
				return "未支付"
			} else if (val == 4) {
				return "超时关闭"
			}
		},
	}
}();
//金额格式化
var formatNumber = function(val) {
	return {
		f: function(val) {
			if(val == null) {
				return "";
			} else{
				return val;
			}
		},
	}
}();
//订单号格式化
var formatOrderNumber = function(val) {
	return {
		f: function(val) {
			if(val==null){
				return ""
			}else{
				return val
			}
		},
	}
}();
//备注格式化
var formatRemark = function(val) {
	return {
		f: function(val) {
			if(val==null){
				return ""
			}else{
				return val
			}
		},
	}
}();
var transferTime = function(val) {
	return {
		f: function(val) {
			if(val==null){
				return ""
			}else{
				return val
			}
		},
	}
}();

//通知状态
var notifyStatus = function(val) {
	return {
		f: function(val) {
			if(val == 1) {
				return "成功";
			} else if(val == 2) {
				return "失败"
			}
		},
	}
}();


var rechargeRecord = function() {

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
				restURL: '/mf/tra/pbtrs.do?bd={}',
				coldefs: [
					/*{
						col: "ugOtcTransferRecordId",
						friendly: "转帐ID",
						validate: "ugOtcTransferRecordId",
						index: 1
					},*/
					{
						col: "outTradeNo",
						friendly: "商家订单号",
						validate: "outTradeNo",
						format : formatOrderNumber,
						index: 1
					},
					{
						col: "fromUserName",
						friendly: "付款账号",
						validate: "fromUserName",
						format : formatOrderNumber,
						index: 2
					},
					{
						col: "number",
						friendly: "金额",
						validate: "number",
						format:formatNumber,
						index: 4
					},
					{
						col: "merRealAmount",
						friendly: "实际到账金额",
						index: 5
					},
					{
						col: "poundage",
						friendly: "服务费金额",
						index: 6
					},
					{
						col: "payType",
						friendly: "支付方式",
						format:payTypeFormat,
						index: 7
					},
					{
						col: "transferTime",
						friendly: "转账时间",
						validate: "transferTime",
						format:transferTime,
						index: 8
					},
					{
						col: "transferStatus",
						friendly: "支付状态",
						format:transferStatus,
						index: 9
					},
					{
						col: "notifyStatus",
						friendly: "通知状态",
						format:notifyStatus,
						index: 10
					},
					{
						col: "remark",
						friendly: "备注",
						format:formatRemark,
						index: 11
					},
					{
						col: "createdTime",
						friendly: "创建时间",
						validate: "createdTime",
						format:transferTime,
						index: 12
					},
					{
						friendly: "操作",
						format: Caozuo,
						index: 13
					}
				],
				// 查询过滤条件
				findFilter: function() {
					var transferRecordId,tradeType,payType,transferStatus,startTime,endTime,outTradeNo,notifyStatus;
					if($('#starttime').val()) {
						startTime = RQLBuilder.equal("startTime", $('#starttime').val());
					}
					if(startTime==undefined){
						startTime = '"startTime":""';
					}
					if($('#payType1').val()) {
						payType = RQLBuilder.equal("payType", $('#payType1').val());
					}
					if(payType==undefined){
						payType = '"payType":""';
					}
					if($('#endtime').val()) {
						endTime = RQLBuilder.equal("endTime", $('#endtime').val());
					}
					if(endTime==undefined){
						endTime = '"endTime":""';
					}
					if($('#transferRecordId').val()) {
						transferRecordId = RQLBuilder.equal("transferRecordId", $('#transferRecordId').val());
					}
					if(transferRecordId==undefined){
						transferRecordId = '"transferRecordId":""';
					}
					if($('#tradeType').val()) {
						tradeType = RQLBuilder.equal("tradeType", $('#tradeType').val());
					}
					if(tradeType==undefined){
						tradeType = '"tradeType":""';
					}
					if($('#transferStatus').val()) {
						transferStatus = RQLBuilder.equal("transferStatus", $('#transferStatus').val());
					}
					if(transferStatus==undefined){
						transferStatus = '"transferStatus":""';
					}
					if($('#outTradeNo').val()) {
						outTradeNo = RQLBuilder.equal("outTradeNo", $('#outTradeNo').val());
					}
					if(outTradeNo==undefined){
						outTradeNo = '"outTradeNo":""';
					}
					if($('#notifyStatus').val()) {
						notifyStatus = RQLBuilder.equal("notifyStatus", $('#notifyStatus').val());
					}
					if(notifyStatus==undefined){
						notifyStatus = '"notifyStatus":""';
					}
					var filter = RQLBuilder.and([
						startTime,endTime,transferRecordId,tradeType,transferStatus,notifyStatus,outTradeNo,payType
					]);
					xw.setRestURL("/mf/tra/pbtrs.do?bd={"+startTime+","+endTime+","+transferRecordId+","+tradeType+","+transferStatus+","+notifyStatus+","+payType+","+outTradeNo+"}");
					return filter.rql();
				},

			})
		}
	}

}();
/*查看详细信息*/
/*查看详细信息*/
$(document).on('click','#edit_btn',function() {
	var index = $(this).closest('tr').index();
	var data = xw.getTable().getData();
    /*模态框关闭后清空模态框里填写的数据*/
    $("#edit_gp_btn").on("hidden.bs.modal", function() {
        document.getElementById("edit_form").reset();
    });
	$.each(data.rows[index], function(key, val) {
		$("form[name='edit_form'] input[name='" + key + "']").val(val);
	});
	if(data.rows[index].payType == 1) {
		$("#payType").val('APP扫码支付');
	} else if(data.rows[index].payType == 2) {
		$("#payType").val('H5');
	} else if(data.rows[index].payType == 3) {
		$("#payType").val('APP支付');
	}
	if(data.rows[index].transferStatus == 1){
		$("#transferStatus1").val('成功');
	} else if(data.rows[index].transferStatus == 2) {
		$("#transferStatus1").val('失败');
	} else if(data.rows[index].transferStatus == 3) {
		$("#transferStatus1").val('未支付');
	} else if (data.rows[index].transferStatus == 4) {
        $("#transferStatus1").val('超时关闭');
    }


});
