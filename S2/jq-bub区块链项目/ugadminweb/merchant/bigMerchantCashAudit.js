var xw;

// 审核状态 1=审核通过，2=审核驳回 0=待审核
var auditStatus = function(val) {
	return {
		f: function(val) {
			if(val == 0) {
				return "待审核";
			} else if(val == 1) {
				return "审核通过"
			} else if(val == 2) {
				return "审核驳回"
			}
		},
	}
}();
var orderType = function(val) {
    return {
        f: function(val) {
            if(val == 2) {
                return "代付";
            } else if(val == 1) {
                return "提现"
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

var Caozuo = function(val,row) {
	// return aac+content;
	return {
		f: function (val, row) {
			if (row.auditState == 0) {
				return aac+content;
			}else {
				return aac
			}
        }
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
				restURL: "/ug/bus/pbwrl.do?bd={\"\":\"\"}",
				coldefs: [{
						col: "id",
						friendly: "id",
						validate: "id",
						nonedit: "nosend",
						hidden:"true",
						index: 1
					},
					{
						col: "merOrderNo",
						friendly: "商户提现单号",
						validate: "merOrderNo",
						index: 2
					},
					{
						col: "orderNo",
						friendly: "币友转账单据号",
						validate: "orderNo",
						index: 3
					},
                    {
                        col: "sourceType",
                        friendly: "订单类型",
                        validate: "sourceType",
                        format: orderType,
                        index: 4
                    },
					{
						col: "userId",
						friendly: "收款方用户名",
						validate: "userId",
						// format:isLOGIN,
						index: 5
					},
					{
						col: "walletAddr",
						friendly: "收款地址",
						validate: "walletAddr",
						// format: Status,
						index: 6
					},
					{
						col: "merId",
						friendly: "商户名",
						validate: "merId",
						index: 7
					},
					{
						col: "amount",
						friendly: "金额",
						validate: "amount",
						index: 8
					},
					{
						col: "auditState",
						friendly: "审核状态",
						validate: "auditState",
						format: auditStatus,
						index: 9
					},
					{
						col: "auditUser",
						friendly: "审核人",
						validate: "auditUser",
						index: 10
					},

					{
						col: "createDate",
						friendly: "创建时间",
						validate: "createDate",
						index: 11
					},
					{
						col: "remarks",
						friendly: "备注",
						validate: "remarks",
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
					var auditstate,orderNo,userId,merId,walletAddr,merOrderNo,sourceType;
					if($('#merOrderNo').val()) {
                        merOrderNo = RQLBuilder.equal("merOrderNo", $.trim($('#merOrderNo').val()));
					}
					if($('#merId').val()) {
                        merId = RQLBuilder.equal("merId", $('#merId').val());
					}
					if($('#userId').val()) {
                        userId = RQLBuilder.equal("userId", $.trim($('#userId').val()));
					}
					if($('#orderNo').val()) {
                        orderNo = RQLBuilder.equal("orderNo", $.trim($('#orderNo').val()));
					}
					if($('#auditstate').val()) {
						auditstate = RQLBuilder.equal("auditstate", $.trim($('#auditstate  option:selected').val()));
					}
                    if($('#sourceType').val()) {
                        sourceType = RQLBuilder.equal("sourceType", $.trim($('#sourceType').val()));
                    }
					if($('#walletAddr').val()) {
                        walletAddr = RQLBuilder.equal("walletAddr", $.trim($('#walletAddr').val()));
					}
					// if($('#minamount').val()) {
					// 	minamount = RQLBuilder.equal("minamount", $.trim($('#minamount').val()));
					// }
					// if($('#maxamount').val()) {
					// 	maxamount = RQLBuilder.equal("maxamount", $.trim($('#maxamount').val()));
					// }
					if(merOrderNo == undefined) {merOrderNo = '"orderno":""';}
					if(merId == undefined) {merId = '"merId":""';}
					if(userId == undefined) {userId = '"userId":""';}
					if(orderNo == undefined) {orderNo = '"orderNo":""';}
					if(auditstate == undefined) {auditstate = '"auditstate":""';}
					if(walletAddr == undefined) {walletAddr = '"walletAddr":""';}
					if(sourceType == undefined) {sourceType = '"sourceType":""';}
					// if(minamount == undefined) {minamount = '"minamount":""';}
					// if(maxamount == undefined) {maxamount = '"maxamount":""';}

					xw.setRestURL("/ug/bus/pbwrl.do?bd={" + merOrderNo + "," + merId + "," + userId + "," + orderNo + "," + auditstate + "," + walletAddr + "," + sourceType + "}");
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
		$("form[name='edit_form'] select[name='" + key + "']").val(val);
		key = key + "_select";
		$("form[name='edit_form'] input[name='" + key + "']").val(val);


		/*是否可登陆*/
		// if(data.rows[index].islogin == 1) {
		// 	$("#islogin_select option[value='" + data.rows[index].islogin + "']").attr('selected', 'selected');
		// } else if(data.rows[index].islogin == 0) {
		// 	$("#islogin_select option[value='" + data.rows[index].islogin + "']").attr('selected', 'selected');
		// }
		// /*类型*/
		// if(data.rows[index].status == 1) {
		// 	$("#status_select option[value='" + data.rows[index].status + "']").attr('selected', 'selected');
		// } else if(data.rows[index].status == 2) {
		// 	$("#status_select option[value='" + data.rows[index].status + "']").attr('selected', 'selected');
		// } else if(data.rows[index].status == 3) {
		// 	$("#status_select option[value='" + data.rows[index].status + "']").attr('selected', 'selected');
		// } else if(data.rows[index].status == 4) {
		// 	$("#status_select option[value='" + data.rows[index].status + "']").attr('selected', 'selected');
		// }
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
			// console.log("ret", ret);
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
