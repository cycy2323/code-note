var xw;

// 状态 0=未发布，1=已发布
var auditStatus = function(val) {
	return {
		f: function(val) {
			if(val == 0) {
				return "未发布";
			} else if(val == 1) {
				return "已发布"
			} else if(val == 2) {
				return "下线"
			}
		},
	}
}();
// 系统类型 1=Android,2=Ios
var systemTypes = function(val) {
	return {
		f: function(val) {
			if(val == 1) {
				return "安卓";
			} else if(val == 2) {
				return "IOS"
			}
		},
	}
}();
// 更新类型 1=强制更新,2=非强制更新
var updateTypes = function(val) {
	return {
		f: function(val) {
			if(val == 1) {
				return "强制更新";
			} else if(val == 2) {
				return "非强制更新"
			}
		},
	}
}();

// 操作
var aac = "<div class='btn-group form-group'>" +
	"<button id='version_publish' class='btn green check' data-target='#edit_gp_btn2' data-toggle='modal'>" +
	"发布&nbsp;" +
	"</button>" +
	"</div>";
var content = "<div class='btn-group form-group'>" +
	"<button id='version_login_out' class='btn blue' data-target='#edit_gp_btn1' data-toggle='modal'>" +
	"下线&nbsp;" +
	"</button>" +
	"</div>";
var modify = "<div class='btn-group form-group'>" +
	"<button id='edit_gp' class='btn' data-target='#edit_gp_btn1' data-toggle='modal'>" +
	"<i class='fa fa-pencil'></i> 编辑&nbsp;" +
	"</button>" +
	"</div>";

var Caozuo = function(val) {
	return aac+content+modify;
}();
// 复选按钮
var checkbox = function(val) {
	return {
		f: function(val) {
			return "<input type='checkbox' id='" + val + "'>";
		},
	}
}();

var MerchantApply = function() {


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
				restURL: "/ug/av/pbqp.do?bd={}",
				coldefs: [{
						col: "id",
						friendly: `<div id="select_all" onclick="((e)=>{e=e|| window.event;e.preventDefault();e.stopPropagation(); selectAll(); })()">全选</div>`,
						// validate: "id",
						format: checkbox,
						index: 1
					},
					{
						col: "systemType",
						friendly: "系统类型",
						validate: "systemType",
						format: systemTypes,
						index: 2
					},
					{
						col: "type",
						friendly: "更新类型",
						validate: "type",
						format:updateTypes,
						index: 3
					},
					{
						col: "versionNo",
						friendly: "版本号",
						validate: "versionNo",
						index: 4
					},
					{
						col: "versionName",
						friendly: "版本名称",
						validate: "versionName",
						index: 5
					},
					{
						col: "content",
						friendly: "更新内容",
						validate: "content",
						index: 6
					},
					{
						col: "createTime",
						friendly: "版本时间",
						validate: "createTime",
						format:function(){
							return {
								f:function(val){
									return val.split("T").join(" ")
								}
							}
						}(),
						index: 7
					},
					{
						col: "status",
						friendly: "状态",
						validate: "status",
						format: auditStatus,
						index: 8
					},

					{
						friendly: "操作",
						format: Caozuo,
						index: 12
					}

				],
				// 查询过滤条件
				findFilter: function() {
					var createTimeStart,createTimeEnd,versionNo,versionName,systemType;
					if($('#createTimeStart').val()) {
						createTimeStart = RQLBuilder.equal("createTimeStart", $.trim($('#createTimeStart').val()));
					}
					if($('#createTimeEnd').val()) {
						createTimeEnd = RQLBuilder.equal("createTimeEnd", $.trim($('#createTimeEnd').val()));
					}
					if($('#versionNo').val()) {
						versionNo = RQLBuilder.equal("versionNo", $('#versionNo').val());
					}
					if($('#versionName').val()) {
						versionName = RQLBuilder.equal("versionName", $.trim($('#versionName').val()));
					}
					if($('#systemType').val()) {
						systemType = RQLBuilder.equal("systemType", $.trim($('#systemType').val()));
					}
					if(createTimeStart == undefined) {createTimeStart = '"createTimeStart":""';}
					if(createTimeEnd == undefined) {createTimeEnd = '"createTimeEnd":""';}
					if(versionNo == undefined) {versionNo = '"versionNo":""';}
					if(versionName == undefined) {versionName = '"versionName":""';}
					if(systemType == undefined) {systemType = '"systemType":""';}

					xw.setRestURL("/ug/av/pbqp.do?bd={" + createTimeStart + "," + createTimeEnd + "," + versionNo + "," + versionName + "," + systemType+ "}");
				}

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
	$("#APPEALREASON_SELECT").hide();
	var index = $(this).closest('tr').index();
	var data = xw.getTable().getData();
	$("#idphoto1").attr("src",data.rows[index].idPhoto)
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
		key = key + "_select";
		$("form[name='edit_form'] input[name='" + key + "']").val(val);

		/*是否可登陆*/
		if(data.rows[index].islogin == 1) {
			$("#islogin_select option[value='" + data.rows[index].islogin + "']").attr('selected', 'selected');
		} else if(data.rows[index].islogin == 0) {
			$("#islogin_select option[value='" + data.rows[index].islogin + "']").attr('selected', 'selected');
		}
		/*类型*/
		if(data.rows[index].status == 1) {
			$("#status_select option[value='" + data.rows[index].status + "']").attr('selected', 'selected');
		} else if(data.rows[index].status == 2) {
			$("#status_select option[value='" + data.rows[index].status + "']").attr('selected', 'selected');
		} else if(data.rows[index].status == 3) {
			$("#status_select option[value='" + data.rows[index].status + "']").attr('selected', 'selected');
		} else if(data.rows[index].status == 4) {
			$("#status_select option[value='" + data.rows[index].status + "']").attr('selected', 'selected');
		}
	});

});

/*审批*/
$(document).on('click','#edit_gp',function() {
	var index = $(this).closest('tr').index();
	var data = xw.getTable().getData();
	$.each(data.rows[index], function(key, val) {

		/*模态框关闭后清空模态框里填写的数据*/
		$("#edit_gp_btn1").on("hidden.bs.modal", function() {
			document.getElementById("edit_form1").reset();
		});
		/*-----------------------*/

		$("form[name='edit_form1'] input[name='" + key + "']").val(val);

		// 审核状态
		$("#auditstate1 option[value='" + data.rows[index].auditState + "']").attr('selected', 'selected');
		// 主键ID
		$("#id").val(data.rows[index].id)
		// 订单号
		$("#ordernum").val(data.rows[index].orderNo)
		// 审核备注
		$("#remarks").val(data.rows[index].remarks)

	});

});
$("#update_gp").click(function() {
	$('[disabled]').attr("disabled", false);
	var edit_form1 = $("#edit_form1").serializeObject();
	console.log(edit_form1);
	switch (edit_form1.remarks) {
		case "待审核":
			edit_form1.remarks="0";
			break;
		case "审核通过":
			edit_form1.remarks="1";
			break;
		case "审核驳回":
			edit_form1.remarks="2";
			break;
	}
	$.ajax({
		type: 'POST',
		url: "/ug/bus/pbwra.do",
		dataType: 'json',
		contentType: "application/json;charset=utf-8",
		async: false,
		isMask: true,
		data: JSON.stringify(edit_form1),
		success: function(ret) {
			console.log("ret", ret);
			if(ret.errcode == "1"){
				bootbox.alert("审核成功",function(){
					location.reload();
				});
				xw.update();
			}else{
				bootbox.alert(ret.msg);
				xw.update();
			}
		},
		error: function() {
			bootbox.alert("审核失败",function(){
				location.reload();
			});
			xw.update();
		}
	});

});

// 发布
$(document).on('click','#version_publish',function() {
	var index = $(this).closest('tr').index();
	var data = xw.getTable().getData();
	$.each(data.rows[index], function(key, val) {
		/*模态框关闭后清空模态框里填写的数据*/
		$("#edit_gp_btn2").on("hidden.bs.modal", function() {
			document.getElementById("version_publish_form1").reset();
		});
		/*-----------------------*/
		$("form[name='version_publish_form1'] input[name='" + key + "']").val(val);
		$("#version_id").val(data.rows[index].id)
	});
});
$("#version_publish_bt").click(function() {
	$('[disabled]').attr("disabled", false);
	var version_publish_form1 = $("#version_publish_form1").serializeObject();
	console.log("version_publish_form1",version_publish_form1);
	$.ajax({
		type: 'POST',
		url: "/ug/av/pbpbl.do",
		dataType: 'json',
		contentType: "application/json;charset=utf-8",
		async: false,
		isMask: true,
		data: JSON.stringify(version_publish_form1),
		success: function(ret) {
			// 1=成功，0-请求参数类错误，9-系统异常
			if(ret.code == "1"){
				bootbox.alert("发布成功",function(){
					location.reload();
				});
				xw.update();
			}else{
				bootbox.alert(ret.msg);
				xw.update();
			}
		},
		error: function() {
			bootbox.alert("操作失败",function(){
				location.reload();
			});
			xw.update();
		}
	});
});
// 下线
$(document).on('click','#version_login_out',function() {
	var index = $(this).closest('tr').index();
	var data = xw.getTable().getData();
	$.each(data.rows[index], function(key, val) {
		/*模态框关闭后清空模态框里填写的数据*/
		$("#edit_gp_btn1").on("hidden.bs.modal", function() {
			document.getElementById("login_out_form1").reset();
		});
		/*-----------------------*/
		$("form[name='login_out_form1'] input[name='" + key + "']").val(val);
		$("#versionId").val(data.rows[index].id)
	});
});
$("#login_out_bt").click(function() {
	$('[disabled]').attr("disabled", false);
	var login_out_form1 = $("#login_out_form1").serializeObject();
	// console.log("login_out_form1",login_out_form1);
	$.ajax({
		type: 'POST',
		url: "/ug/av/pbofl.do",
		dataType: 'json',
		contentType: "application/json;charset=utf-8",
		async: false,
		isMask: true,
		data: JSON.stringify(login_out_form1),
		success: function(ret) {
			// 1=成功，0-请求参数类错误，9-系统异常
			if(ret.code == "1"){
				bootbox.alert("已下线",function(){
					location.reload();
				});
				xw.update();
			}else{
				bootbox.alert(ret.msg);
				xw.update();
			}
		},
		error: function() {
			bootbox.alert("操作失败",function(){
				location.reload();
			});
			xw.update();
		}
	});

});

// 删除
// 要删除的数组
var idsArr = []
$(document).on('click','#delete-message',function() {
	var $checkedBox = $(":input:checked")
	$checkedBox.map((val)=>{
		// console.log("val", $checkedBox[val].id);
		idsArr.push($checkedBox[val].id)
	})
});
$("#delete_ids_btn").click(function() {
	$.ajax({
		type: 'POST',
		url: "/ug/av/pbroe.do",
		dataType: 'json',
		contentType: "application/json;charset=utf-8",
		async: false,
		isMask: true,
		data: JSON.stringify({ids:idsArr}),
		success: function(ret) {
			// 1=成功，0-请求参数类错误，9-系统异常
			if(ret.code == "1"){
				bootbox.alert("删除成功",function(){
					location.reload();
				});
				xw.update();
			}else{
				bootbox.alert(ret.msg);
				xw.update();
			}
		},
		error: function() {
			bootbox.alert("操作失败",function(){
				location.reload();
			});
			xw.update();
		}
	});
});
// 全选
function selectAll() {
	// 查所有input[type=checkbox] ,是否有checked
	let $elem = $(":input[type=checkbox]"),
		$length=$("span:has(input[type=checkbox]).checked").length,
		$elems=$("span:has(input[type=checkbox])")

	console.log("$length", $length);
	// console.log("selete_all", $(":input[type=checkbox]:checked"));
	if($length>0 && $length<$elem.length){
		// 有&&不全，所有input[type=checkbox] checked
		for(var i=0;i<$elem.length;i++){
			console.log("$elem[i1]", $elem[i]);
			$($elems[i]).prop("class","checked")
		}
	}else if($length===0){
		// 没有，所有input[type=checkbox] checked=fase
		for(var i=0;i<$elem.length;i++){
			$elems[i].setAttribute("class","checked")
			console.log("$elem[i2]", $elem[i]);
		}
	}else if($length===$elem.length){
		//	全选
		// 没有，所有input[type=checkbox] checked=fase
		for(var i=0;i<$elem.length;i++){
			$elems[i].removeAttribute("class")
			console.log("$elem[i3]", $elem[i]);
		}

	}
}

// 新增
$(document).on('click','#add-message',function() {

});
$("#addVersion").click(function() {
	$('[disabled]').attr("disabled", false);
	var version_publish_form1 = $("#version_publish_form1").serializeObject();
	console.log("version_publish_form1",version_publish_form1);
	$.ajax({
		type: 'POST',
		url: "/ug/av/pbpbl.do",
		dataType: 'json',
		contentType: "application/json;charset=utf-8",
		async: false,
		isMask: true,
		data: JSON.stringify(version_publish_form1),
		success: function(ret) {
			// 1=成功，0-请求参数类错误，9-系统异常
			if(ret.code == "1"){
				bootbox.alert("发布成功",function(){
					location.reload();
				});
				xw.update();
			}else{
				bootbox.alert(ret.msg);
				xw.update();
			}
		},
		error: function() {
			bootbox.alert("操作失败",function(){
				location.reload();
			});
			xw.update();
		}
	});
});

layui.use('laydate', function(){
	var laydate = layui.laydate;
	//常规用法
	laydate.render({
		elem: '#createTimeEnd'
	});
	laydate.render({
		elem: '#createTimeStart'
	});
});
