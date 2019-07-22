var xw;
var aac = "<div class='btn-group form-group'>" +
	"<button id='edit_btn' class='btn green check' data-target='#edit_gp_btn' data-toggle='modal'>" +
	"<i class='fa fa-eye'></i> 查看&nbsp;" +
	"</button>" +
	"</div>";
var Caozuo = function(val) {
	return aac;

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
				pageSize: 50,
				columnPicker: true,
				transition: 'fade',
				checkboxes: true,
				checkAllToggle: true,
				//----------------基本restful地址---
				restURL: '/mf/tra/pbtrs.do?bd={}',
				coldefs: [{
						col: "ugOtcTransferRecordId",
						friendly: "转账记录ID",
						validate: "ugOtcTransferRecordId",
						nonedit: "nosend",
						hidden:true,
						index: 1
					},
					{
						col: "accountFromAddress",
						friendly: "转账地址",
						validate: "accountFromAddress",
						index: 2
					},
					{
						col: "accountToAddress",
						friendly: "收账地址",
						validate: "accountToAddress",
						index: 3
					},
					{
						col: "transferTime",
						friendly: "转账时间",
						validate: "transferTime",
						index: 4
					},
					{
						col: "number",
						friendly: "转账数量",
						validate: "number",
						index: 5
					},
					{
						col: "poundage",
						friendly: "转账手续费",
						validate: "poundage",
						index: 6
					},
					{
						friendly: "操作",
						format: Caozuo,
						index: 7,
					},
				],
				// 查询过滤条件
				findFilter: function() {
					var startTime,endTime;
					if($('#starttime').val()) {
						startTime = RQLBuilder.equal("startTime", $('#starttime').val());
					}
					var filter = RQLBuilder.and([
						startTime
					]);
					if(startTime==undefined){
						startTime = '"startTime":""';
					}
					if($('#endtime').val()) {
						endTime = RQLBuilder.equal("startTime", $('#endtime').val());
					}
					var filter = RQLBuilder.and([
						startTime,endTime
					]);
					if(endTime==undefined){
						endTime = '"endTime":""';
					}
					console.log(startTime);
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