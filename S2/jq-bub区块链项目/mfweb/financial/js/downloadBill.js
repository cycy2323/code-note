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
var payType = function(val) {
	return {
		f: function(val) {
			if(val == 1) {
				return "APP扫码支付";
			} else if(val == 2) {
				return "H5支付"
			} else if(val == 3) {
				return "APP支付"
			}else{
				return '';
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
			}else if(val == 3) {
				return "未支付"
			}else if (val ==4) {
				return '超时关闭';
			}
		},
	}
}();

var closeSate = function(val) {
	return {
		f: function(val) {//0:预估收入 1：可结算 2：已结算
			if(val==0){
				return '预估收入';
			}else if(val==1){
				return '可结算';
			}else if(val==2){
				return '已结算';
			}else{
				return '';
			}
		},
	}
}();
//通用
var formatString = function(val) {
	return {
		f: function(val) {
			if(val==null){
				return ""
			}else{
				return val;
			}
		},
	}
}();
//备注格式化
var formatRemark = function(val) {
	return {
		f: function(val) {
			if(val==null||val==""){
				return "无"
			}
		},
	}
}();
var DownloadBill = function() {
	var roleFormat = function() {
		return {
			f: function(val) {
				return roleHelper.getDisplay(val);
			}
		}
	}();
	return {
		init: function() {
			this.reload();
		},
		reload: function() {
			$('#divtable').html('');
			xw = XWATable.init({
				divname: "divtable",
				pageSize: 10,
				transition: 'fade',
				checkboxes: true,
				checkAllToggle: true,
				saveColumn:false,
				exportxls:
				{
                        title:"账单下载",//导出excel的文件名
                        remap: ss, //需要转义的列与需要转义成的数据
                        hidden:false,
                        ci:{}
                },
				//----------------基本restful地址---
				restURL: '/mf/tra/pbtrs.do?bd={\"\":\"\"}',
				coldefs: [
					{
						col: "outTradeNo",
						friendly: "订单号",
						validate: "outTradeNo",
						format: formatString,
						index: 1
					},
					{
						col: "nickName",
						friendly: "付款用户",
						format: formatString,
						index: 2
					},
					{
						col: "number",
						friendly: "订单金额",
						format: formatString,
						index: 3
					},
					{
						col: "merRealAmount",
						friendly: "实际到账金额",
						format: formatString,
						index: 4
					},
					{
						col: "poundage",
						friendly: "手续费",
						format: formatString,
						index: 5
					},
					{
						col: "transferStatus",
						friendly: "支付状态",
						format: transferStatus,
						index: 6
					},
					{
						col: "payType",
						friendly: "支付方式",
						format: payType,
						index: 7
					},
					{
						col: "closeStatus",
						friendly: "结算状态",
						validate: "closeStatus",
						format: closeSate,
						index: 8
					},
					// {
					// 	col: "rechargeTime",
					// 	friendly: "商户系统时间",
					// 	format: formatString,
					// 	index: 9
					// },
					{
						col: "transferTime",
						friendly: "付款时间",
						format: formatString,
						index: 10
					},
					{
						col: "createdTime",
						friendly: "订单创建时间",
						format: formatString,
						index: 11
					},
					{
						col: "remark",
						friendly: "备注",
						format: formatString,
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
					var startTime,endTime;
					if($('#starttime').val()) {
						startTime = RQLBuilder.equal("startTime", $('#starttime').val());
					}
					if(startTime==undefined){
						startTime = '"startTime":""';
					}
					if($('#endtime').val()) {
						endTime = RQLBuilder.equal("endTime", $('#endtime').val());
					}
					if(endTime==undefined){
						endTime = '"endTime":""';
					}
					var filter = RQLBuilder.and([
						startTime,endTime
					]);
					xw.setRestURL("/mf/tra/pbtrs.do?bd={"+startTime+","+endTime+"}");
					return filter.rql();
				},

			})
		}
	}

}();
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
		$("#transferStatus").val('成功');
	} else if(data.rows[index].transferStatus == 2) {
		$("#transferStatus").val('失败');
	} else if(data.rows[index].transferStatus == 3) {
		$("#transferStatus").val('未支付');
	}








});
