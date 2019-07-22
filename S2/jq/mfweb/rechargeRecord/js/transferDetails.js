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
var tradeType = function(val) {
	return {
		f: function(val) {
			if(val == 1) {
				return "APP扫码支付";
			} else if(val == 2) {
				return "H5支付"
			} else if(val == 3) {
				return "APP支付"
			} else if(val == 4) {
				return "-"
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
//类型格式化
var typeStr = function(val) {
	return {
		f: function(val) {
			if(val==1){
				return '转入'
			} else if(val == 2) {
				return "转出"
			}
		},
	}
}();
var transferDetails = function() {

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
				restURL: '/mf/tra/pbtds.do?bd={}',
				coldefs: [{
						col: "ugOtcTransferRecordId",
						friendly: "转帐ID",
						validate: "ugOtcTransferRecordId",
						nonedit: "nosend",
						hidden:true,
						index: 1
					},
					{
						col: "tradeType",
						friendly: "来源",
						validate: "tradeType",
						format:tradeType,
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
						col: "typeStr",
						friendly: "类型",
						format:typeStr,
						index: 5
					},
					{
						col: "transferStatus",
						friendly: "状态",
						format:transferStatus,
						index: 7
					},
					{
						col: "",
						friendly: "余额",
						index: 7
					},
					{
						friendly: "操作",
						format: Caozuo,
						index: 8,
					},
				],
				// 查询过滤条件
				findFilter: function() {
					var transferRecordId,tradeType,type,transferStatus,startTime,endTime;
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
					if($('#type').val()) {
						type = RQLBuilder.equal("type", $('#type').val());
					}
					if(type==undefined){
						type = '"type":""';
					}
					var filter = RQLBuilder.and([
						startTime,endTime,transferRecordId,tradeType,transferStatus,type
					]);
					xw.setRestURL("/mf/tra/pbtds.do?bd={"+startTime+","+endTime+","+transferRecordId+","+tradeType+","+transferStatus+","+type+"}");
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
		$.each(data.rows[index], function(key, val) {
		/*模态框关闭后清空模态框里填写的数据*/
		$("#edit_gp_btn").on("hidden.bs.modal", function() {
			document.getElementById("edit_form").reset();
		});
		$("form[name='edit_form'] input[name='" + key + "']").val(val);
	});
});