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

	var userHelper = RefHelper.create({
		ref_url: "ugotctransferrecord",
		ref_col: "ugOtcTransferRecordId",

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
				pageSize: 50,
				columnPicker: true,
				transition: 'fade',
				checkboxes: true,
				checkAllToggle: true,
				//----------------基本restful地址---
				restbase: 'ugotctransferrecord',
				key_column: 'ugOtcTransferRecordId',
				coldefs: [{
						col: "ugOtcTransferRecordId",
						friendly: "转账记录ID",
						validate: "ugOtcTransferRecordId",
						nonedit: "nosend",
						
						index: 1
					},
					{
						col: "accountFromAddress",
						friendly: "从这个账户地址",
						validate: "accountFromAddress",
						index: 2
					},
					{
						col: "accountToAddress",
						friendly: "到这个账户ID",
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
					var find_par;
					if($('#categoryId1').val()) {
						find_par = RQLBuilder.like("categoryId", $.trim($('#categoryId1').val()));
					}

					var filter = RQLBuilder.and([
						find_par
					]);
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