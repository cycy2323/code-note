var xw;
var aac = "<div class='btn-group form-group'>" +
	"<button id='edit_btn' class='btn green check' data-target='#edit_gp_btn' data-toggle='modal'>" +
	"<i class='fa fa-eye'></i> 查看&nbsp;" +
	"</button>" +
	"</div>";
var Caozuo = function(val) {
	return aac;
}();

var formatAll = function(val) {
	return {
		f: function(val) {
			if(val == null) {
				return ""
			}else{
				return val;
			}
		}
	}
}();

var formatTransferStatus = function(val) {
	return {
		f: function(val) {
			if(val==null) {
				return ""
			}else if(val==1){
				return '成功';
			}else if(val==2){
				return '失败';
			}else if(val==3){
				return '未支付';
			} else if (val ==4) {
				return '超时关闭'
			}
		}
	}
}();

var formatPayType = function(val) {
	return {
		f: function(val) {
			if(val==null) {
				return ""
			}else if(val==1){
				return 'APP扫码支付';
			}else if(val==2){
				return 'H5';
			}else if(val==3){
				return 'APP支付';
			}
		}
	}
}();





var Transfe = function() {
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
				coldefs: [{
						col: "ugOtcTransferRecordId",
						friendly: "订单ID",
						validate: "ugOtcTransferRecordId",
						index: 1
					},
					{
						col: "fromUserName",
						friendly: "付款账号",
						validate: "fromUserName",
						format: formatAll,
						index: 2
					},
					{
						col: "transferTime",
						friendly: "付款时间",
						validate: "transferTime",
						format: formatAll,
						index: 3
					},
					{
						col: "number",
						friendly: "订单金额",
						validate: "number",
						format: formatAll,
						index: 4
					},
					{
						col: "poundage",
						friendly: "转账手续费",
						validate: "poundage",
						format: formatAll,
						index: 5
					},
					{
						col: "payType",
						friendly: "支付方式",
						format: formatPayType,
						index: 5
					},
					{
						col: "transferStatus",
						friendly: "支付状态",
						format: formatTransferStatus,
						index: 5
					},
					{
						col: "createdTime",
						friendly: "订单创建时间",
						validate: "createdTime",
						format: formatAll,
						index: 6
					},/*,
					{
						friendly: "操作",
						format: Caozuo,
						index: 7,
					},*/
				],
				// 查询过滤条件
				findFilter: function() {
					var startTime,endTime,transferRecordId,transferStatus;
					if($('#transferRecordId').val()) {
						transferRecordId = RQLBuilder.equal("transferRecordId", $('#transferRecordId').val());
					}
					if($('#transferStatus option:selected').val()) {
						transferStatus = RQLBuilder.equal("transferStatus", $('#transferStatus  option:selected').val());
					}
					if($('#starttime').val()) {
						startTime = RQLBuilder.equal("startTime", $('#starttime').val());
					}
					if($('#endtime').val()) {
						endTime = RQLBuilder.equal("endTime", $('#endtime').val());
					}
					if(endTime==undefined){
						endTime = '"endTime":""';
					}
					if(startTime==undefined){
						startTime = '"startTime":""';
					}
					if(transferRecordId==undefined){
						transferRecordId = '"transferRecordId":""';
					}
					if(transferStatus==undefined){
						transferStatus = '"transferStatus":""';
					}
					var filter = RQLBuilder.and([
						startTime,endTime,transferRecordId,transferStatus
					]);
					xw.setRestURL("/mf/tra/pbtrs.do?bd={"+startTime+","+endTime+","+transferRecordId+","+transferStatus+"}");
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
		/*-----------------------*/

		$("form[name='edit_form'] input[name='" + key + "']").val(val);

	});

});
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
	var edit_form1 = $("#edit_form1").serializeObject();
	if($("#status").val() == "") {
		alert('状态不能为空');
		return false;
	}
	if($("#sort").val() == "") {
		alert('不能为空');
		return false;
	}
});
