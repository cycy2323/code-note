var xw;
var OperateFunc = function () {
	return {
		f: function (val, row) {

			var returnstr = '';
			//'1':'上架中','2':'已下架','3':'售罄'
			if(row.status !='3'){
				returnstr +='<a data-id="' + val + '" href=javascript:editDetail("' + row.operateid + '")  style="color:#0cc2aa">编辑</a>'
			}
			if(row.status == '2'){//上架
				returnstr +=' <a data-id="' + val + '" onclick="putAdvert(\'' + val + '\')" href="javascript:void(0)" style="color:#167cf9">上架</a>'
			}
			if(row.status == '1'){//下架
				returnstr +=' <a data-id="' + val + '" onclick="downAdvert(\'' + val + '\')" href="javascript:void(0)" style="color:#df2d2d">下架</a>'
			}
		   return returnstr;
		}
	}
}();
var editDetail = function(advertid,row){
	doClearForView();
	reShowDetail(advertid);
}

var doClearForView = function(){
	$("#edit_gp_btn").on("hidden.bs.modal", function() {
		document.getElementById("edit_form1").reset();
	});
}
var reShowDetail = function(advertid){

	var rows = new Array();
	selrows = xw.getTable().getData()
	$.each(selrows.rows, function(idx, row) {
		if(row.ugOtcAdvertId == advertid) {
			rows.push(row);
		}
	});
	selrows.rows = rows;
	selrow_obj = rows[0];

	$.each(selrow_obj, function(key, val) {//key.val

		$("form[name='advertEdit'] input[data-name='"+key+"']").val(val);
		$("form[name='advertEdit'] select[data-name='"+key+"']").val(val).trigger("change");
	});

	$('#edit_gp_btn1').modal("show");
}
var putAdvert = function (advertid) {
    var dialog = bootbox.dialog({
		title: '广告上架',
		message:'<p id="identifier"><table><tr></td><td>支付密码：</td><td> <input id="put_paypwd" style="width:200px" type="text" class="form-control" placeHolder="输入密码" autocomplete="off" password="" /></td><td>谷歌验证码：</td><td><input id="put_google" class="form-control " style="width:200px" placeHolder="请输入谷歌验证码"></td></tr></table></p>',
        closeButton: true,
        buttons: {
            ok: {
                label: "广告上架确认",
                className: 'btn-success',
                callback: function () {
                    if (!$("#put_paypwd").val()) {
                        return false;
                    } else {
						// authu.password='" + $.md5($('#rePrintAuth').attr('password'))
						var pwdmd5 = $.md5($('#put_paypwd').attr('password'));
						var googlecode= $('#put_google').val();
						var datapost = {};
						datapost.advertId = advertid;
						datapost.transactionPassword = pwdmd5;
						datapost.googlecode = googlecode;
                        $.ajax({
                            url: "ug/mer/pbsas.do",
                            type: "POST",
							contentType: "application/json;charset=utf-8",
							data:JSON.stringify(datapost),
                            dataType: "json",
                            success: function (data) {
                                //console.log(data);
                                if(data.err_code == '1'){
									//上架成功
									bootbox.alert("上架成功");
									xw.update();
								}else{
									// console.log(data.msg);//错误信息
									bootbox.alert(data.msg);
									return false;
								}
                            },
                            error: function () {

								bootbox.alert('上架失败，请重试或联系客服');
								return false;
                            }
                        });
                        // return false;
                    }
                }
            }
        }
    });
}

var downAdvert = function(val){
	var dialog = bootbox.dialog({
		title: '广告下架',
		message:'<p><table><tr></td><td>支付密码：</td><td> <input id="down_paypwd" style="width:200px" type="text" class="form-control" placeHolder="输入密码" autocomplete="off" password="" /></td><td>谷歌验证码：</td><td><input id="down_google" class="form-control " style="width:200px" placeHolder="请输入谷歌验证码"></td></tr></table></p>',
        closeButton: true,
        buttons: {
            ok: {
                label: "广告下架确认",
                className: 'btn-success',
                callback: function () {
                    if (!$("#down_paypwd").val()) {
                        return false;
                    } else {
						// authu.password='" + $.md5($('#rePrintAuth').attr('password'))
						var pwdmd5 = $.md5($('#down_paypwd').attr('password'));
						var googlecode= $('#down_google').val();
						var datapost = {};
						datapost.advertId = val;
						datapost.transactionPassword = pwdmd5;
						datapost.googlecode = googlecode;
						console.log(datapost);
                        $.ajax({
                            url: "ug/mer/pbcas.do",
                            type: "POST",
							contentType: "application/json;charset=utf-8",
							data:JSON.stringify(datapost),
                            dataType: "json",
                            success: function (data) {
                                // console.log('下架数据',data);
                                if(data.errcode == '1'){
									//上架成功
									bootbox.alert("下架成功");
									xw.update();
								}else{
									// console.log(data.msg);//错误信息
									bootbox.alert('下架失败，请重试或联系客服');
									return false;
								}
                            },
                            error: function () {

								bootbox.alert('下架失败，请重试或联系客服');
								return false;
                            }
                        });
                        // return false;
                    }
                }
            }
        }
    });
};
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

var Advert = function() {
	return {
		init: function() {
			// 顺序有影响 (先抓选单, 再抓暂存选单, 再执行其他)
			this.initHelper();
			this.reload();
		},
		initHelper:function(){
			//编辑保存
			// $('#update_advert').on('click',function(e){
			// 	//判断 校验密码 && 谷歌验证码是否填写
			// 	//获取from中都值，然后调用接口
			// 	// var edit_form1 = $("#edit_form1").serializeObject();
			// 	$.ajax({
			// 		type: 'POST',
			// 		url: "ug/mer/pbuas.do",
			// 		dataType: 'json',
			// 		contentType: "application/json;charset=utf-8",
			// 		async: false,
			// 		isMask: true,
			// 		data: JSON.stringify(edit_form1),
			// 		success: function(ret) {
			// 			if(ret.err_code == "0"){
			// 				bootbox.alert(ret.msg);
			// 			xw.update();
			// 			}else{
			// 			bootbox.alert("修改成功");
			// 			xw.update();
			// 			}
			// 		},
			// 		error: function() {
			// 			bootbox.alert("修改失败");
			// 			xw.update();
			// 		}
			// 	});
			// });

			$('#add_advert_button').on('click',function(e){
				//先清空所有信息
				document.getElementById("add_advert_form").reset();
				$('#add_advert_modal').modal("show");
				if($('#add_amounttype').val() == '1'){
					$('.showlimitmax').show();
					$('.showlimitmin').show();
					$('.showfix').hide();//初始：显示限额，隐藏固额
				}
				// bub 余额
				$.ajax({
					url: "/mf/usr/pblbi.do?bd="+JSON.stringify({'reqresource': '1'}),
					type: 'GET',
					contentType: "application/json;charset=utf-8",
					dataType: "json",
					// parmas: JSON.stringify(reqresource),
					// data: {},
					success: function (data) {
						// console.log(data)
						// alert(data.usablefund)
						// var resNum = data.usablefund
						document.getElementById('balabceNum').innerHTML = data.usablefund
						// window.open(data.payUrl)
					}
				})
				// 收款账号获取
				// let mfbusinessid=JSON.parse(localStorage.getItem("user_info")).businessId
				$.ajax({
					type: 'POST',
					url: "/mf/usr/pbgwa.do",
					dataType: 'json',
					contentType: "application/json;charset=utf-8",
					async: false,
					isMask: true,
					data: JSON.stringify({}),
					// data: JSON.stringify({'mfbusinessids': mfbusinessid}),
					success: function(ret) {
						if(ret.err_code == "0"||ret.err_code == "9"){
							bootbox.alert(ret.msg);
						}else{
							let $select = $("#receiverAccountPhoneNum")
							// 拼html
							let options;
							if(ret.rows){
								ret.rows.map((val) => {
									options += `<option value="` + val.username + `">` + val.username + `</option>`
								})
								$select.html(options)
							}
						}
					},
					error: function(err) {
						bootbox.alert(err.msg);
					}
				});
			});
			$('#submit_advert').on('click',function(e){//发布广告
				//校验信息 -- 支付密码是否为空
				var receiverAccountPhoneNum = $('#receiverAccountPhoneNum').val();
				var number = $('#number').val();

				//校验是否是数字
				if(!number){
					bootbox.alert("填写数量");return;
				}
				var reg=/^[1-9]\d*$/;
				if(!reg.test(number)){
					bootbox.alert("填写数量需为正整数");return;
				}
				if(!receiverAccountPhoneNum){
					bootbox.alert("填写收款账号");return;
				}
				var advdata = {};
				advdata.number = number;
				advdata.receiverAccountPhoneNum =receiverAccountPhoneNum
				// console.log(advdata);
				$.ajax({
					type: 'POST',
						url: "/mf/tra/pbcwd.do",
					dataType: 'json',
					contentType: "application/json;charset=utf-8",
					async: false,
					isMask: true,
					data: JSON.stringify(advdata),
					success: function(ret) {
						if(ret.err_code == "1"){
							bootbox.alert(ret.msg);
							$("#add_advert_modal").modal("hide");
							xw.update();
						}else{
							bootbox.alert(ret.msg);
							return;
							// xw.update();
						}
					},
					error: function() {
						bootbox.alert("添加失败");
						// xw.update();
						return;
					}
				});

			});
			$('#add_amounttype').on('change',function(){
				if($('#add_amounttype').val() == '1'){//限额
					$('.showlimitmax').show();
					$('.showlimitmin').show();
					$('.showfix').hide();
				}else if($('#add_amounttype').val() =='2'){//固额
					$('.showfix').show();
					$('.showlimitmax').hide();
					$('.showlimitmin').hide();
				}
			});
			$(document).on('input','#put_paypwd',function(){
				//alert(1);
				var _this = this;
				var newPassword = _this.value;
				var oldPassword = _this.getAttribute("password");
				var deta = newPassword.length-oldPassword.length;

				var truePassword = "";
				var p = _this.selectionEnd;//光标结束时的位置

				for(var i=0; i<newPassword.length; i++){
					var c = newPassword.charAt(i);
					if(i<p && c!='●'){
						truePassword += c;
					}else if(i<p && c=='●'){
						truePassword +=  oldPassword.charAt(i);
					}else {
						truePassword += oldPassword.substr(oldPassword.length-newPassword.length+p,newPassword.length-p);
						break;
					}
				}
				newPassword = truePassword.replace(/\S/g, '●');

				_this.setAttribute('password', truePassword);
				_this.value = newPassword;
				// 解决在win8中光标总是到input框的最后
				_this.selectionEnd = p;
				_this.selectionStart = p;
				//console.log(truePassword);
			});

			$(document).on('input','#down_paypwd',function(){
				//alert(1);
				var _this = this;
				var newPassword = _this.value;
				var oldPassword = _this.getAttribute("password");
				var deta = newPassword.length-oldPassword.length;

				var truePassword = "";
				var p = _this.selectionEnd;//光标结束时的位置

				for(var i=0; i<newPassword.length; i++){
					var c = newPassword.charAt(i);
					if(i<p && c!='●'){
						truePassword += c;
					}else if(i<p && c=='●'){
						truePassword +=  oldPassword.charAt(i);
					}else {
						truePassword += oldPassword.substr(oldPassword.length-newPassword.length+p,newPassword.length-p);
						break;
					}
				}
				newPassword = truePassword.replace(/\S/g, '●');

				_this.setAttribute('password', truePassword);
				_this.value = newPassword;
				// 解决在win8中光标总是到input框的最后
				_this.selectionEnd = p;
				_this.selectionStart = p;
				//console.log(truePassword);
			});

			//保存修改
			$('#update_advert').on('click',function(e){
				//校验
				var edit_advertId = $('#edit_advertId').val(),edit_number = $('#edit_number').val(),edit_amountType = $('#edit_amountType').val(),edit_limitMaxAmount=$('#edit_limitMaxAmount').val();
				var edit_limitMinAmount = $('#edit_limitMinAmount').val(),edit_fixedAmount = $('#edit_fixedAmount').val(),edit_price =$('#edit_price').val() ;
				var edit_type = $('#edit_type').val(),edit_pamentWay = $('#edit_paymentWay').val(),edit_coinId = $('#edit_coinId').val(),edit_coinType = $('#edit_coinType').val();
				var edit_prompt = $('#edit_prompt').val(),edit_autoReplyContent = $('#edit_autoReplyContent').val(),edit_isMerchantsTrade = $('#edit_isMerchantsTrade').val();
				var edit_isSeniorCertification = $('#edit_isSeniorCertification').val(),edit_transactionPassword = $('#edit_transactionPassword').val(),edit_googlecode = $('#edit_googlecode').val();
				if(!edit_advertId){
					bootbox.alert("广告ID为空");return;
				}
				if(!edit_transactionPassword){
					bootbox.alert("填写支付密码");return;
				}
				if(!edit_googlecode){
					bootbox.alert("请填写谷歌验证码");return;
				}
				if(!edit_number){
					bootbox.alert("请填写 数量");return;
				}
				if(!edit_amountType){
					bootbox.alert("请选择金额类型");return;
				}
				if(edit_amountType == '1'){
					if(!edit_limitMinAmount){
						bootbox.alert("请填写最小限额");return;
					}
					if(!edit_limitMaxAmount){
						bootbox.alert("请填写最大限额");return;
					}
				}else if(edit_amountType == '2'){
					if(!edit_fixedAmount){
						bootbox.alert("请填写固额");return;
					}
				}
				if(!edit_type){
					bootbox.alert("请选择类型");return;
				}
				if(!edit_price){
					bootbox.alert("请填写单价");return;
				}
				if(!edit_pamentWay){
					bootbox.alert('请选择付款方式');return;
				}
				if(!edit_coinId){
					bootbox.alert('请填写币种');return;
				}
				if(!edit_coinType){
					bootbox.alert('请选择货币类型');return;
				}
				if(!edit_prompt){
					bootbox.alert('请填写付款期限');return;
				}
				if(!edit_isSeniorCertification){
					bootbox.alert('请选择 是否需要高级认证');return;
				}
				if(!edit_isMerchantsTrade){
					bootbox.alert('请选择 是否允许平台内都商家购买');return;
				}
				var editadvdata = {};
				editadvdata.advertId = edit_advertId;
				editadvdata.number = edit_number,editadvdata.AmountType =edit_amountType ,editadvdata.limitMaxAmount =edit_limitMaxAmount ,editadvdata.limitMinAmount =edit_limitMinAmount ;
				editadvdata.fixedAmount =edit_fixedAmount ,editadvdata.price =edit_price ,editadvdata.type =edit_type,editadvdata.pamentWay = edit_pamentWay,editadvdata.coinId =edit_coinId;
				editadvdata.coinType =edit_coinType ,editadvdata.prompt = edit_prompt,editadvdata.autoReplyContent=edit_autoReplyContent ,editadvdata.isSeniorCertification =edit_isSeniorCertification;
				editadvdata.isMerchantsTrade = edit_isMerchantsTrade,editadvdata.transactionPassword=$.md5(edit_transactionPassword),editadvdata.googlecode = edit_googlecode;
				$.ajax({
					type: 'POST',
					url: "/ug/mer/pbuas.do",
					dataType: 'json',
					contentType: "application/json;charset=utf-8",
					async: false,
					isMask: true,
					data: JSON.stringify(editadvdata),
					success: function(ret) {
						if(ret.errcode == "1"){
							bootbox.alert("修改成功");
							xw.update();
						}else{
							bootbox.alert(ret.msg);
							return;
							// xw.update();
						}
					},
					error: function() {
						bootbox.alert("修改失败");
						// xw.update();
						return;
					}
				});
			})
		},

		reload: function() {

			$('#divtable').html('');

			xw = XWATable.init({
				divname: "divtable",
				//----------------table的选项-------
				pageSize: 10,
				// columnPicker: true,
				transition: 'fade',
				checkboxes: false,
				checkAllToggle: true,
				//----------------基本restful地址---
				restURL: "/mf/wrs/pbsel.do?bd={'':''}",
				coldefs: [
					{
						col: "merOrderNo",
						friendly: "订单号",
						validate: "merOrderNo",
						nonedit: "nosend",
						// hidden:"true",
						unique: "true",
						// format:"",
						index: 1
					},
					{
						col: "userId",
						friendly: "提现账号",
						validate: "userId",
						index: 2
					},
					{
						col: "amount",
						friendly: "提现金额(BUB)",
						validate: "amount",
						index: 3
					},
					{
						col: "createTime",
						friendly: "申请时间",
						validate: "createTime",
						index: 3
					},
					{
						col: "status",
						friendly: "订单状态",
						validate: "status",
						format: orderStatus,
						index: 7
					},

					{
						col: "modifyTime",
						friendly: "审批时间",
						validate: "modifyTime",
						index: 13
					}
				],
				// 查询过滤条件
				findFilter: function() {
					var finddb = {};
					if($('#searchKey').val()){
						finddb.searchKey = $('#searchKey').val();
					}
					if($('#status option:selected').val()){
						finddb.status = $('#status option:selected').val();
					}
					if($('#endDate').val()){
						finddb.endDate = $('#endDate').val();
					}
					if($('#startDate').val()){
						finddb.startDate = $('#startDate').val();
					}

					xw.setRestURL("/mf/wrs/pbsel.do?bd="+(JSON.stringify(finddb)));
				},

			})
		}
	}
}();



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

//$(document).on('click','#delete2',function(){
//	var index = $(this).closest('tr').index();
//	var data = xw.getTable().getData();
//	//var edit_form2 = $("#edit_form1").serializeObject();
//	//console.log(edit_form2);
//	$.ajax({
//		type: 'POST',
//		url: "/ug/adv/pbsha.do",
//		dataType: 'json',
//		contentType: "application/json;charset=utf-8",
//		async: false,
//		isMask: true,
//		data: JSON.stringify(data.rows[index]),
//		success: function(ret) {
//			if(ret.err_code == "0"){
//				bootbox.alert("删除失败");
//			xw.update();
//			}else{
//			bootbox.alert("删除成功");
//			xw.update();
//			}
//		},
//		error: function() {
//			bootbox.alert("删除失败");
//			xw.update();
//		}
//	});
//
//});
//$("#delete2").click(function() {
//console.log(123456)
//	//var edit_form1 = $("#edit_form1").serializeObject();
//
//	$.ajax({
//		type: 'POST',
//		url: "/ug/adv/pbsha.do",
//		dataType: 'json',
//		contentType: "application/json;charset=utf-8",
//		async: false,
//		isMask: true,
//		//data: JSON.stringify(edit_form1),
//		success: function(ret) {
//			console.log(ret.err_code);
//			if(ret.err_code == "0"){
//				bootbox.alert("删除失败");
//			xw.update();
//			}else{
//			bootbox.alert("删除成功");
//			xw.update();
//			}
//		},
//		error: function() {
//			bootbox.alert("删除失败");
//			xw.update();
//		}
//	});
//
//});



// /*查看详细信息*/

// $(document).on('click','#edit_btn',function() {
// 	var index = $(this).closest('tr').index();
// 	var data = xw.getTable().getData();
// 	$("#idphoto1").attr("src",data.rows[index].idPhoto)
// //	if(data.rows.length == 0) {
// //		bootbox.alert("<br><center><h4>请选择一条数据！</h4></center><br>");
// //		return false;
// //	}
// //	if(data.rows.length > 1) {
// //		bootbox.alert("<br><center><h4>只能选择一行！</h4></center><br>");
// //		return false;
// //	}

// 	$.each(data.rows[index], function(key, val) {
// 		/*模态框关闭后清空模态框里填写的数据*/
// 		$("#edit_gp_btn").on("hidden.bs.modal", function() {
// 			document.getElementById("edit_form").reset();
// 		});
// 		/*-----------------------*/
// 		key = key + "_select";
// 		$("form[name='edit_form'] input[name='" + key + "']").val(val);

// 		/*金额类型*/
// 		if(data.rows[index].amounttype == 1) {
// 			$("#amounttype_select option[value='" + data.rows[index].amounttype + "']").attr('selected', 'selected');
// 		} else if(data.rows[index].amounttype == 2) {
// 			$("#amounttype_select option[value='" + data.rows[index].amounttype + "']").attr('selected', 'selected');
// 		}
// 		/*类型*/
// 		if(data.rows[index].type == 1) {
// 			$("#type_select option[value='" + data.rows[index].type + "']").attr('selected', 'selected');
// 		} else if(data.rows[index].type == 2) {
// 			$("#type_select option[value='" + data.rows[index].type + "']").attr('selected', 'selected');
// 		}
// 		/*广告状态*/
// 		if(data.rows[index].status == 1) {
// 			$("#status_select option[value='" + data.rows[index].status + "']").attr('selected', 'selected');
// 		} else if(data.rows[index].status == 2) {
// 			$("#status_select option[value='" + data.rows[index].status + "']").attr('selected', 'selected');
// 		}
// 		/*支付方式*/
// 		if(data.rows[index].paymentway == 1) {
// 			$("#paymentway_select option[value='" + data.rows[index].paymentway + "']").attr('selected', 'selected');
// 		} else if(data.rows[index].paymentway == 2) {
// 			$("#paymentway_select option[value='" + data.rows[index].paymentway + "']").attr('selected', 'selected');
// 		} else if(data.rows[index].paymentway == 3) {
// 			$("#paymentway_select option[value='" + data.rows[index].paymentway + "']").attr('selected', 'selected');
// 		} else if(data.rows[index].paymentway == 1,2) {
// 			$("#paymentway_select option[value='" + data.rows[index].paymentway + "']").attr('selected', 'selected');
// 		} else if(data.rows[index].paymentway == 1,3) {
// 			$("#paymentway_select option[value='" + data.rows[index].paymentway + "']").attr('selected', 'selected');
// 		} else if(data.rows[index].paymentway == 2,3) {
// 			$("#paymentway_select option[value='" + data.rows[index].paymentway + "']").attr('selected', 'selected');
// 		} else if(data.rows[index].paymentway == 1,2,3) {
// 			$("#paymentway_select option[value='" + data.rows[index].paymentway + "']").attr('selected', 'selected');
// 		}
// 		/*货币类型*/
// 		if(data.rows[index].cointype == 1) {
// 			$("#cointype_select option[value='" + data.rows[index].cointype + "']").attr('selected', 'selected');
// 		}
// 		/*是否需要高级认证*/
// 		if(data.rows[index].isseniorcertification == 1) {
// 			$("#isseniorcertification_select option[value='" + data.rows[index].isseniorcertification + "']").attr('selected', 'selected');
// 		} else if(data.rows[index].isseniorcertification == 2) {
// 			$("#isseniorcertification_select option[value='" + data.rows[index].isseniorcertification + "']").attr('selected', 'selected');
// 		}
// 		/*是否需要高级认证*/
// 		if(data.rows[index].ismerchantstrade == 1) {
// 			$("#ismerchantstrade_select option[value='" + data.rows[index].ismerchantstrade + "']").attr('selected', 'selected');
// 		} else if(data.rows[index].ismerchantstrade == 2) {
// 			$("#ismerchantstrade_select option[value='" + data.rows[index].ismerchantstrade + "']").attr('selected', 'selected');
// 		}

// 	});

// });

// /*审批*/
// $(document).on('click','#edit_gp',function() {
// 	var index = $(this).closest('tr').index();
// 	var data = xw.getTable().getData();

// 	$("#amounttype").attr("disabled", true);
// 	$("#type").attr("disabled", true);
// 	$("#paymentway").attr("disabled", true);
// 	$.each(data.rows[index], function(key, val) {

// 		/*模态框关闭后清空模态框里填写的数据*/
// 		$("#edit_gp_btn1").on("hidden.bs.modal", function() {
// 			document.getElementById("edit_form1").reset();
// 		});
// 		/*-----------------------*/

// 		$("form[name='edit_form1'] input[name='" + key + "']").val(val);

// 		/*金额类型*/
// 		if(data.rows[index].amounttype == 1) {
// 			$("#amounttype option[value='" + data.rows[index].amounttype + "']").attr('selected', 'selected');
// 		} else if(data.rows[index].amounttype == 2) {
// 			$("#amounttype option[value='" + data.rows[index].amounttype + "']").attr('selected', 'selected');
// 		}
// 		/*类型*/
// 		if(data.rows[index].type == 1) {
// 			$("#type option[value='" + data.rows[index].type + "']").attr('selected', 'selected');
// 		} else if(data.rows[index].type == 2) {
// 			$("#type option[value='" + data.rows[index].type + "']").attr('selected', 'selected');
// 		}
// 		/*广告状态*/
// 		if(data.rows[index].status == 1) {
// 			$("#status option[value='" + data.rows[index].status + "']").attr('selected', 'selected');
// 		} else if(data.rows[index].status == 2) {
// 			$("#status option[value='" + data.rows[index].status + "']").attr('selected', 'selected');
// 		}
// 		/*支付方式*/
// 		if(data.rows[index].paymentway == 1) {
// 			$("#paymentway option[value='" + data.rows[index].paymentway + "']").attr('selected', 'selected');
// 		} else if(data.rows[index].paymentway == 2) {
// 			$("#paymentway option[value='" + data.rows[index].paymentway + "']").attr('selected', 'selected');
// 		} else if(data.rows[index].paymentway == 3) {
// 			$("#paymentway option[value='" + data.rows[index].paymentway + "']").attr('selected', 'selected');
// 		} else if(data.rows[index].paymentway == 1,2) {
// 			$("#paymentway option[value='" + data.rows[index].paymentway + "']").attr('selected', 'selected');
// 		} else if(data.rows[index].paymentway == 1,3) {
// 			$("#paymentway option[value='" + data.rows[index].paymentway + "']").attr('selected', 'selected');
// 		} else if(data.rows[index].paymentway == 2,3) {
// 			$("#paymentway option[value='" + data.rows[index].paymentway + "']").attr('selected', 'selected');
// 		} else if(data.rows[index].paymentway == 1,2,3) {
// 			$("#paymentway option[value='" + data.rows[index].paymentway + "']").attr('selected', 'selected');
// 		}
// 		/*货币类型*/
// 		if(data.rows[index].cointype == 1) {
// 			$("#cointype option[value='" + data.rows[index].cointype + "']").attr('selected', 'selected');
// 		}
// 		/*是否需要高级认证*/
// 		if(data.rows[index].isseniorcertification == 1) {
// 			$("#isseniorcertification option[value='" + data.rows[index].isseniorcertification + "']").attr('selected', 'selected');
// 		} else if(data.rows[index].isseniorcertification == 2) {
// 			$("#isseniorcertification option[value='" + data.rows[index].isseniorcertification + "']").attr('selected', 'selected');
// 		}
// 		/*是否与平台商家交易*/
// 		if(data.rows[index].ismerchantstrade == 1) {
// 			$("#ismerchantstrade option[value='" + data.rows[index].ismerchantstrade + "']").attr('selected', 'selected');
// 		} else if(data.rows[index].ismerchantstrade == 2) {
// 			$("#ismerchantstrade option[value='" + data.rows[index].ismerchantstrade + "']").attr('selected', 'selected');
// 		}

// 	});

// });

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
