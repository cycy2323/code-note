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
var orderStatus = function(val) {
	return {
		// 0=待处理，1=成功，2=失败
		f: function(val) {
			if(val === 0) {
				return "待处理"
			}else if(val===1){
				return "成功";
			}else{
				return "失败";
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
				restURL: '/mf/rrs/pbsel.do?bd={}',
				coldefs: [{
						col: "merOrderNo",
						friendly: "订单号",
						validate: "merOrderNo",
						index: 1
					},
					{
						col: "userId",
						friendly: "提现用户ID",
						validate: "userId",
						format: formatAll,
						index: 2
					},
					{
						col: "amount",
						friendly: "提现金额(BUB)",
						validate: "amount",
						format: formatAll,
						index: 3
					},
					{
						col: "createTime",
						friendly: "申请时间",
						validate: "createTime",
						format: formatAll,
						index: 4
					},
					{
						col: "status",
						friendly: "订单状态",
						validate: "status",
						format: orderStatus,
						index: 5
					},
					{
						col: "modifyTime",
						friendly: "审批时间",
						validate: "modifyTime",
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
					var startDate,endDate,status,searchKey;
					if($('#startDate').val()) {
						startDate = RQLBuilder.equal("startDate", $('#startDate').val());
					}
					if(startDate==undefined){
						startDate = '"startDate":""';
					}
					if($('#endDate').val()) {
						endDate = RQLBuilder.equal("endDate", $('#endDate').val());
					}
					if(endDate==undefined){
						endDate = '"endDate":""';
					}
					if($('#status option:selected').val()) {
						status = RQLBuilder.equal("status", $('#status  option:selected').val());
					}
					if(status==undefined){
						status = '"status":""';
					}
					if($('#searchKey').val()) {
						searchKey = RQLBuilder.equal("searchKey", $('#searchKey').val());
					}
					if(searchKey==undefined){
						searchKey = '"searchKey":""';
					}
					var filter = RQLBuilder.and([
						startDate,endDate,status,searchKey
					]);
					xw.setRestURL("/mf/rrs/pbsel.do?bd={"+startDate+","+endDate+","+status+","+searchKey+"}");
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


layui.use('laydate', function(){
	var laydate = layui.laydate;
	//常规用法
	laydate.render({
		elem: '#endDate'
	});
	laydate.render({
		elem: '#startDate'
	});
});
