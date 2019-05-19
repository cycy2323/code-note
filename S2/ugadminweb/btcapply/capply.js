var xw;

var Trade_Status = function(val) {
	return {
		f: function(val) {
			console.log(val);
			if(val == 1) {
				return "处理中";
			} else if(val == 2) {
				return "已处理"
			}else if(val == 3) {
				return "已驳回"
			}else if(val == 4) {
				return "已撤销"
			}
		},
	}
}();

var aac = "<div class='btn-group form-group'>" +
	"<button id='edit_btn' class='btn green check' data-target='#edit_gp_btn' data-toggle='modal'>" +
	"<i class='fa fa-eye'></i> 查看&nbsp;" +
	"</button>" +
	"</div>";
	var content = "<div class='btn-group form-group'>" +
		"<button id='edit_gp' class='btn blue' data-target='#edit_gp_btn1' data-toggle='modal'>" +
		"<i class='fa fa-pencil'></i> 审批&nbsp;" +
		"</button>" +
		"</div>";
var Caozuo = function(val) {
	return aac+content;

}();
var Apply = function() {

	var userHelper = RefHelper.create({
		ref_url: "ugotcbtcapply",
		ref_col: "ugOtcBtcApplyId",

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
				restbase: 'ugotcbtcapply?sort=-createdTime',
				key_column: 'ugOtcBtcApplyId',
				coldefs: [{
						col: "ugOtcBtcApplyId",
						friendly: "主键ID",
						validate: "ugOtcBtcApplyId",
						nonedit: "nosend",
						hidden:"true",
//						unique: "true",
						index: 1
					},
					{
						col: "userId",
						friendly: "用户ID",
						validate: "userId",
						index: 2
					},
					{
						col: "ugNumber",
						friendly: "平台币数量",
						validate: "ugNumber",
						index: 3
					},
					{
						col: "btcNumber",
						friendly: "比特币数量",
						validate: "btcNumber",
						index: 4
					},
					{
						col: "btcAddress",
						friendly: "比特币地址",
						validate: "btcAddress",
						index: 5
					},
					{
						col: "createdTime",
						friendly: "申请创建时间",
						validate: "createdTime",
						index: 6
					},
					{
						col: "status",
						friendly: "申请状态",
						validate: "status",
						format: Trade_Status,
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
					var find_userId,find_status;
					if($('#userId1').val()) {
						find_userId = RQLBuilder.like("userId", $.trim($('#userId1').val()));
					}
					if($('#status1 option:selected').val()) {
						find_status = RQLBuilder.equal("status", $('#status1  option:selected').val());
					}
					var filter = RQLBuilder.and([
						find_userId,find_status
					]);
					return filter.rql();
				},

			})
		}
	}

}();
//根据用户角色初始化按钮
var button_init = function() {
	var user_info = localStorage.getItem("user_info");
	//获取后先转为json
	var userInfo = eval('(' + user_info + ')');
	//获取登陆名
	var login_name = userInfo.login_name;
	/*var content = "<div class='btn-group form-group'>" +
		"<button id='edit_gp' class='btn blue' data-target='#edit_gp_btn1' data-toggle='modal'>" +
		"<i class='fa fa-pencil'></i> 审批&nbsp;" +
		"</button>" +
		"</div>";*/
	/*if(login_name == "admin") {
		$('#find').append(content);
	}*/
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
		key = key + "_select";
		$("form[name='edit_form'] input[name='" + key + "']").val(val);
	});

	/*状态：1-处理中,2-已处理*/
	if(data.rows[index].status) {
		$("#status_select option[value='" + data.rows[index].status + "']").attr('selected', 'selected');
	}
});

/*审批*/
$(document).on('click','#edit_gp',function() {
	var index = $(this).closest('tr').index();
	var data = xw.getTable().getData();


	if(data.rows[index].status != 1) {
		$("#update_gp").attr("style", "display:none;");
		$("#bohui").attr("style", "display:none;");
	} else {
		$("#update_gp").attr("style", "display:block;");
		$("#bohui").attr("style", "display:block;");
	}

	$.each(data.rows[index], function(key, val) {

		/*模态框关闭后清空模态框里填写的数据*/
		$("#edit_gp_btn1").on("hidden.bs.modal", function() {
			document.getElementById("edit_form1").reset();
		});
		/*-----------------------*/

		$("form[name='edit_form1'] input[name='" + key + "']").val(val);

	});
	/*状态：1-处理中,2-已处理*/
	if(data.rows[index].status) {
		$("#status option[value='" + data.rows[index].status + "']").attr('selected', 'selected');
	}

});

//已汇出
$("#update_gp").click(function() {

	var edit_form1 = $("#edit_form1").serializeObject();

	$.ajax({
		type: 'POST',
		url: "/ug/app/pbply.do",
		dataType: 'json',
		contentType: "application/json;charset=utf-8",
		async: false,
		isMask: true,
		data: JSON.stringify(edit_form1),
		success: function() {
			var val = bootbox.alert("审批成功",function (val) {

				$('#edit_gp_btn2').modal('toggle')
			});
			xw.update();
		},
		error: function() {
			bootbox.alert("审批失败");
			xw.update();
		}
	});

});

$(document).on('click','#update_gp',function() {
	var index = $(this).closest('tr').index();
	var data = xw.getTable().getData();


	$.each(data.rows[index], function(key, val) {

		/*模态框关闭后清空模态框里填写的数据*/
		$("#edit_gp_btn2").on("hidden.bs.modal", function() {
			document.getElementById("edit_form2").reset();
		});
		/*-----------------------*/

		$("form[name='edit_form2'] input[name='" + key + "']").val(val);

	});

});
$("#update_gp2").click(function() {

	var edit_form2 = $("#edit_form2").serializeObject();

	$.ajax({
		type: 'POST',
		url: "/ug/con/pbext.do",
		dataType: 'json',
		contentType: "application/json;charset=utf-8",
		async: false,
		isMask: true,
		data: JSON.stringify(edit_form2),
		success: function() {
			bootbox.alert("操作成功");
			xw.update();
		},
		error: function() {
			bootbox.alert("操作失败");
			xw.update();
		}
	});

});


//已驳回
$("#bohui").click(function() {

	var edit_form1 = $("#edit_form1").serializeObject();

	$.ajax({
		type: 'POST',
		url: "/ug/app/pbrej.do",
		dataType: 'json',
		contentType: "application/json;charset=utf-8",
		async: false,
		isMask: true,
		data: JSON.stringify(edit_form1),
		success: function(ret) {
			$("#rejcause").val(ret.rejcause);
			var val = bootbox.alert("驳回成功",function (val) {
				$('#edit_gp_btn3').modal('toggle')
			});
			xw.update();
		},
		error: function() {
			bootbox.alert("驳回失败");
			xw.update();
		}
	});

});

$(document).on('click','#bohui',function() {
	var index = $(this).closest('tr').index();
	var data = xw.getTable().getData();


	$.each(data.rows[index], function(key, val) {

		/*模态框关闭后清空模态框里填写的数据*/
		$("#edit_gp_btn3").on("hidden.bs.modal", function() {
			document.getElementById("edit_form3").reset();
		});
		/*-----------------------*/

		$("form[name='edit_form3'] input[name='" + key + "']").val(val);

	});

});
$("#update_gp3").click(function() {

	var edit_form3 = $("#edit_form3").serializeObject();
	console.log(edit_form3);
	$.ajax({
		type: 'POST',
		url: "/ug/app/pbboh.do",
		dataType: 'json',
		contentType: "application/json;charset=utf-8",
		async: false,
		isMask: true,
		data: JSON.stringify(edit_form3),
		success: function() {
			bootbox.alert("操作成功");
			xw.update();
		},
		error: function() {
			bootbox.alert("操作失败");
			xw.update();
		}
	});

});
