var xw;

var AmountType = function(val) {
	return {
		f: function(val) {
			if(val == 1) {
				return "限额";
			} else if(val == 2) {
				return "固额";
			}
		}
	}
}();
var Type = function(val) {
	return {
		f: function(val) {
			if(val == 1) {
				return "买";
			} else if(val == 2) {
				return "卖";
			}
		}
	}
}();
var Status = function(val) {
	return {
		f: function(val) {
			if(val == 1) {
				return "上架";
			} else if(val == 2) {
				return "下架";
			} else if (val == 3) {
				return '售罄';
			}
		}
	}
}();
var PaymentWay = function(val) {
	return {
		f: function(val) {
			var paymentWays = new Array();
			if (val.indexOf('1') != -1) {
				paymentWays.push('微信');
			}
			if (val.indexOf('2') != -1) {
				paymentWays.push('支付宝');
			}
			if (val.indexOf('3') != -1) {
				paymentWays.push('银行卡');
			}
			return paymentWays.join(',');
		}
	}
}();
var IsSeniorCertification = function(val) {
	return {
		f: function(val) {
			if(val == 1) {
				return "是";
			} else if(val == 2) {
				return "否";
			}
		}
	}
}();
var IsMerchantsTrade = function(val) {
	return {
		f: function(val) {
			if(val == 1) {
				return "是";
			} else if(val == 2) {
				return "否";
			}
		}
	}
}();

var Caozuo = function() {
	return {
		f: function() {
			var result = '<div class="btn-group form-group">';
			result += '<button id="edit_btn" class="btn green check" data-target="#edit_gp_btn" data-toggle="modal">';
			result += '<i class="fa fa-eye"></i> 查看 ';
			result += '</button>';
			result += '</div>';
			return result;
		}
	}
}();
var Advert = function() {


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
				sortable: true,
				sortOrder: 'createdTime desc',
				//----------------基本restful地址---
				restURL: "/ug/adv/pbert.do?bd={'':''}&sort=-createdTime",
				coldefs: [{
						col: "ugOtcAdvertId",
						friendly: "广告ID",
						validate: "ugOtcAdvertId",
						nonedit: "nosend",
						hidden:"true",
//						unique: "true",
						index: 1
					},
					{
						col: "userId",
						friendly: "创建人",
						validate: "userId",
						index: 2
					},
					{
						col: "number",
						friendly: "数量",
						validate: "number",
						index: 3
					},
					{
						col: "prompt",
						friendly: "付款期限",
						validate: "prompt",
						index: 4
					},
					{
						col: "limitMaxAmount",
						friendly: "限额最大",
						validate: "limitMaxAmount",
						index: 5
					},
					{
						col: "limitMinAmount",
						friendly: "限额最小",
						validate: "limitMinAmount",
						index: 6
					},
					{
						col: "amountType",
						friendly: "金额类型",
						validate: "amountType",
						format: AmountType,
						index: 7
					},
					{
						col: "type",
						friendly: "类型",
						validate: "type",
						format: Type,
						index: 8,
						sortable: false
					},
					{
						col: "status",
						friendly: "广告状态",
						validate: "status",
						format: Status,
						index: 9
					},
					{
						col: "paymentWay",
						friendly: "支付方式",
						validate: "paymentWay",
						format: PaymentWay,
						index: 10
					},
					{
						col: "isSeniorCertification",
						friendly: "是否需要高级认证",
						validate: "isSeniorCertification",
						format: IsSeniorCertification,
						index: 11
					},
					{
						col: "isMerchantsTrade",
						friendly: "是否与平台商家交易",
						validate: "isMerchantsTrade",
						format: IsMerchantsTrade,
						index: 12
					},
					{
						col: "shelveTime",
						friendly: "广告发布时间",
						validate: "shelveTime",
						format: {f: function(shelveTime) {return shelveTime.replace('T', ' ');}},
						index: 13
					},{
						col: "unshelveTime",
						friendly: "广告下架时间",
						validate: "unshelveTime",
						format: {f: function(unshelveTime) {return unshelveTime.replace('T', ' ');}},
						index: 14
					},
					{
						friendly: "操作",
						format: Caozuo,
						sorting: false,
						index: 15
					}

				],
				// 查询过滤条件
				findFilter: function() {
					var userid, type, status, isseniorcertification, ismerchantstrade;
					if($('#userid1').val()) {
						userid = RQLBuilder.equal("userId", $.trim($('#userid1').val()));
					}
					if($('#type1 option:selected').val()) {
						type = RQLBuilder.equal("type", $('#type1  option:selected').val());
					}
					if($('#status1 option:selected').val()) {
						status = RQLBuilder.equal("status", $('#status1  option:selected').val());
					}
					if($('#isseniorcertification1 option:selected').val()) {
						isseniorcertification = RQLBuilder.equal("isSeniorCertification", $('#isseniorcertification1  option:selected').val());
					}
					if($('#ismerchantstrade1 option:selected').val()) {
						ismerchantstrade = RQLBuilder.equal("isMerchantsTrade", $('#ismerchantstrade1  option:selected').val());
					}

					if(userid == undefined) {
						userid = '"userId":""';
					}
					if(type == undefined) {
						type = '"type":""';
					}
					if(status == undefined) {
						status = '"status":""';
					}
					if(isseniorcertification == undefined) {
						isseniorcertification = '"isSeniorCertification":""';
					}
					if(ismerchantstrade == undefined) {
						ismerchantstrade = '"isMerchantsTrade":""';
					}

					xw.setRestURL("/ug/adv/pbert.do?bd={" + userid + "," + type + "," + status + "," + isseniorcertification + "," + ismerchantstrade + "}");
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
}();

/*查看详细信息*/

$(document).on('click','#edit_btn',function() {
	$("#APPEALREASON_SELECT").hide();
	var index = $(this).closest('tr').index();
	var data = xw.getTable().getData();
	$("#idphoto1").attr("src",data.rows[index].idPhoto)

	$.each(data.rows[index], function(key, val) {
		/*模态框关闭后清空模态框里填写的数据*/
		$("#edit_gp_btn").on("hidden.bs.modal", function() {
			document.getElementById("edit_form").reset();
		});
		/*-----------------------*/
		$("form[name='edit_form'] input[name='" + key + "']").val(val);

	});

	/*金额类型*/
	$("#amounttype_select option[value='" + data.rows[index].amountType + "']").attr('selected', 'selected');
	/*类型*/
	$("#type_select option[value='" + data.rows[index].type + "']").attr('selected', 'selected');
	/*广告状态*/
	$("#status_select option[value='" + data.rows[index].status + "']").attr('selected', 'selected');
	/*支付方式*/
	$("#paymentway_select option[value='" + data.rows[index].paymentWay + "']").attr('selected', 'selected');
	/*货币类型*/
	$("#cointype_select option[value='" + data.rows[index].coinType + "']").attr('selected', 'selected');
	/*是否需要高级认证*/
	$("#isseniorcertification_select option[value='" + data.rows[index].isSeniorCertification + "']").attr('selected', 'selected');
	/*是否需要高级认证*/
	$("#ismerchantstrade_select option[value='" + data.rows[index].isMerchantsTrade + "']").attr('selected', 'selected');


});

/*审批*/
$(document).on('click','#edit_gp',function() {
	var index = $(this).closest('tr').index();
	var data = xw.getTable().getData();
	$("#APPEALREASON").hide();
	$("#amounttype").attr("disabled", true);
	$("#type").attr("disabled", true);
	$("#paymentway").attr("disabled", true);
	$.each(data.rows[index], function(key, val) {

		/*模态框关闭后清空模态框里填写的数据*/
		$("#edit_gp_btn1").on("hidden.bs.modal", function() {
			document.getElementById("edit_form1").reset();
		});
		/*-----------------------*/

		$("form[name='edit_form1'] input[name='" + key + "']").val(val);

	});

	/*金额类型*/
	$("#amounttype option[value='" + data.rows[index].amountType + "']").attr('selected', 'selected');
	/*类型*/
	$("#type option[value='" + data.rows[index].type + "']").attr('selected', 'selected');
	/*广告状态*/
	$("#status option[value='" + data.rows[index].status + "']").attr('selected', 'selected');
	/*支付方式*/
	$("#paymentway option[value='" + data.rows[index].paymentWay + "']").attr('selected', 'selected');
	/*货币类型*/
	$("#cointype option[value='" + data.rows[index].coinType + "']").attr('selected', 'selected');
	/*是否需要高级认证*/
	$("#isseniorcertification option[value='" + data.rows[index].isSeniorCertification + "']").attr('selected', 'selected');
	/*是否与平台商家交易*/
	$("#ismerchantstrade option[value='" + data.rows[index].isMerchantsTrade + "']").attr('selected', 'selected');
});

$("#update_gp").click(function() {

	$('[disabled]').attr("disabled", false);

	var edit_form1 = $("#edit_form1").serializeObject();

	$.ajax({
		type: 'POST',
		url: "/ug/adv/pbgai.do",
		dataType: 'json',
		contentType: "application/json;charset=utf-8",
		async: false,
		isMask: true,
		data: JSON.stringify(edit_form1),
		success: function(ret) {
			if(ret.err_code == "0"){
				bootbox.alert(ret.msg);
				xw.update();
			}else{
				bootbox.alert("修改成功");
				xw.update();
			}
		},
		error: function() {
			bootbox.alert("修改失败");
			xw.update();
		}
	});

});
