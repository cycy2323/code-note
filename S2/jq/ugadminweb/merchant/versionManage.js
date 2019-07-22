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
	"<button id='edit_gp' class='btn' data-target='#edit_form' data-toggle='modal'>" +
	"<i class='fa fa-pencil'></i> 编辑&nbsp;" +
	"</button>" +
	"</div>";
var empty = "<div class='btn-group form-group'>" +
	"<button class='btn' style='opacity:0'></button>" +
	"</div>";


var Caozuo = function(val,rowItem) {
	return {
		f: function(val,rowItem) {
			if(rowItem.status == 0) {
				return aac+modify;;
			} else if(rowItem.status == 1) {
				return content+modify
			} else if(rowItem.status == 2) {
				return empty
			}
		},
	}
}();
// 复选按钮
var checkbox = function(val,item) {
	return {
		f: function(val,item) {
			return "<input type='checkbox' id='" + item.id + "'>";
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
				coldefs: [
					// {
					// 	col: "id",
					// 	friendly: `<div id="select_all" onclick="((e)=>{e=e|| window.event;e.preventDefault();e.stopPropagation(); selectAll(); })()">全选</div>`,
					// 	// validate: "id",
					// 	format: checkbox,
					// 	index: 1
					// },
					{
						col:"ids",
						friendly: `<div id="select_all" onclick="((e)=>{e=e|| window.event;e.preventDefault();e.stopPropagation(); selectAll(); })()">全选</div>`,
						validate: "id",
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
						validate: "status",
						format: Caozuo,
						index: 9
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
let modleStatu=null // 判断弹框是添加还是编辑
/*编辑*/
$(document).on('click','#edit_gp',function() {
	modleStatu='modify'
	// 重新请求详情
	var index = $(this).closest('tr').index();
	var data = xw.getTable().getData();
	let id = data.rows[index].id
	$.ajax({
		type: 'POST',
		url: "/ug/av/pbqsf.do",
		dataType: 'json',
		contentType: "application/json;charset=utf-8",
		async: false,
		isMask: true,
		data: JSON.stringify({ id:id }),
		success: function(ret) {
			$.each(ret, function(key, val) {
				/*模态框关闭后清空模态框里填写的数据*/
				$("#edit_gp_btn1").on("hidden.bs.modal", function() {
					document.getElementById("edit_form1").reset();
				});
				/*-----------------------*/
				$("form[name='add_form'] input[name='" + key + "']").val(val);
				$("form[name='add_form'] select[name='" + key + "']").val(val);
			});
		},
		error: function() {
			bootbox.alert("详细信息查询失败",function(){
				location.reload();
			});
			xw.update();
		}
	})
});
$("#update_gp").click(function() {
	$('[disabled]').attr("disabled", false);
	var edit_form1 = $("#edit_form1").serializeObject();
	// console.log(edit_form1);
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
				});
				xw.update();
			}else{
				bootbox.alert(ret.msg);
				xw.update();
			}
		},
		error: function() {
			bootbox.alert("操作失败",function(){
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
				});
				xw.update();
			}else{
				bootbox.alert(ret.msg);
				xw.update();
			}
		},
		error: function() {
			bootbox.alert("操作失败",function(){
			});
			xw.update();
		}
	});

});

// 删除
// 要删除的数组
var idsArr = []
$(document).on('click','#delete-message',function() {
	idsArr = []
	var $checkedBox = $(":input:checked")
	$checkedBox.map((val)=>{
		// console.log("val", $checkedBox[val].id);
		idsArr.push($checkedBox[val].id)
	})
});
$("#delete_ids_btn").click(function() {
	if(idsArr.length!==0){
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
					});
					xw.update();
				}else{
					bootbox.alert(ret.msg);
					xw.update();
				}
			},
			error: function() {
				bootbox.alert("操作失败",function(){
				});
				xw.update();
			}
		});
	}else{
		bootbox.alert('当前没有选择任何版本');
	}
});
// 全选
function selectAll() {
	// 查所有input[type=checkbox] ,是否有checked
	let $elem = $(":input[type=checkbox]"),
		$length=$("span:has(input[type=checkbox]).checked").length,
		$elems=$("span:has(input[type=checkbox])")

	// console.log("$length", $length);
	// console.log("selete_all", $(":input[type=checkbox]:checked"));
	if($length>0 && $length<$elem.length){
		// 有&&不全，所有input[type=checkbox] checked
		for(var i=0;i<$elem.length;i++){
			// console.log("$elem[i1]", $elem[i]);
			$($elems[i]).prop("class","checked")
		}
	}else if($length===0){
		// 没有，所有input[type=checkbox] checked=fase
		for(var i=0;i<$elem.length;i++){
			$elems[i].setAttribute("class","checked")
			// console.log("$elem[i2]", $elem[i]);
		}
	}else if($length===$elem.length){
		//	全选
		// 没有，所有input[type=checkbox] checked=fase
		for(var i=0;i<$elem.length;i++){
			$elems[i].removeAttribute("class")
			// console.log("$elem[i3]", $elem[i]);
		}
	}
}

// 新增
$(document).on('click','#add-message',function() {
	modleStatu='add'
	// 初始化表单
	document.getElementById("add_form").reset();
	$("#select_file").html('选择文件')
	$("#created_time").val('当前时间')
});
// 选择文件
$(document).on('click','#select_file',function() {
	$("#version_content").click()
});
// 获取文件名
let file = null, fileId;
$("#version_content").on("change", function(){
	let $select_file = $("#select_file")
	file = this.files[0] || this.files.item(0);
	if(file === null){
		$select_file.html('选择文件')
		return
	}else{
		$("#version_name").val(file.name);
		$select_file.html('正在上传...')
		let form = new FormData(document.getElementById('version_content_form'));
		// fileId = GasModService.getUuid();
		$.ajax({
			url:"/ug/av/upload.do",
			// url:"/ug/pay/uppls.do?busiId="+fileId+"",
			dataType: 'text',
			processData: false,
			contentType: false,
			async: false,
			type: 'POST',
			data:form,
			success: function (data) {
				let obj = eval('(' + data + ')');
				$("form[name='add_form'] input[name='actionArg']").val(obj.path);
				if(obj.code=='2'){
					bootbox.alert(obj.message);
					$select_file.html('选择文件')
					$("#version_name").val('')
					return
				}
				$select_file.html('上传成功')
			},
			error: function (data) {
				$select_file.html('选择文件')
				bootbox.alert(data.msg)
				// if(arguments[0].status == '413'){
				// 	bootbox.alert("文件不能超过1M");
				// }else{bootbox.alert(data.msg);}
				// $("#fileId").val('');
			}
		})
	}
})

//提交version_upload_btn
$("#version_upload_btn").click(function() {
	let url=null
	if(modleStatu==="add"){
		url='/ug/av/pbadd.do'
		if(file === null){
			bootbox.alert("请填写完整所有内容 及 选择文件");
			return;
		}
	}else{
		url='/ug/av/pbmdf.do'
	}
	// console.log("$(\"#action_arg\").val()", $("#action_arg").val());
	if($("#system-type").val() && $("#version_no").val() && $("#version_name").val() && $("#content").val() && $("#type").val() && $("#action_arg").val()){
		var add_form = $("#add_form").serializeObject();
		$.ajax({
			type: 'POST',
			dataType: 'json',
			contentType: "application/json;charset=utf-8",
			async: false,
			isMask: true,
			data: JSON.stringify(add_form),
			url: url,
			success: function(ret) {
				// 1=成功，0-请求参数类错误，9-系统异常
				if(ret.code == "1"){
					$("#edit_form").removeClass('in')
					bootbox.alert("操作成功",function(){
					});
					xw.update();
				}else{
					bootbox.alert(ret.msg);
					xw.update();
				}
			},
			error: function() {
				bootbox.alert("操作失败",function(){
				});
				xw.update();
			}
		});
	}else{
		bootbox.alert("请填写完整所有内容 及 选择文件");
	}
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
