$(function() {
	$.ajax({
		type: 'POST',
		url: "/bd/col/pbsel.do",
		dataType: 'json',
		contentType: "application/json;charset=utf-8",
		async: false,
		isMask: true,
		//data: JSON.stringify(edit_form1),
		success: function(ret) {
			a(ret);
			if(ret.err_code == "1") {
				//			bootbox.alert("添加收款账号成功", function(){
				//				location.reload();
				//			});
			} else {
				//			bootbox.alert(ret.msg, function(){
				//				location.reload();
				//			});
			}
		},
		error: function(err) {
			if(err.status==406||err.status==401){
				window.location.replace("/login.html");
			}else{
				bootbox.alert("服务器繁忙,请稍后再试", function() {
					location.reload();
				});
			}

		}
	});
});
var arr = [];
var a = function(ret) {
	arr = (ret.rows);
	var reg = /^(\d{4})\d+(\d{4})$/;
	//	var acco = arr[a].accountbankcard
	//	stro = acco.replace(reg, "$1 **** **** $2");

	var hts = '';
	if(arr != null){
		for(var a = 0, b = arr.length; a < b; a++) {
			var status = arr[a].status;
			var img = '';
			if(status == 1) {
				img = "<img src='collection/picture/img3.png' class='picture2' />"
			} else {
				img = "<img src='collection/picture/img2.png' class='picture2' />"
			}
			if(arr[a].addtype == 1){
				var htmls = "<div class='col-sm-4 collec1'>" +
					"<img src='collection/picture/img1.png' class='picture1'/>" +
					"<span class='collec5' id='accountbankname1_" + a + "'>" + arr[a].accountbankname + "</span>" +
					"<div id ='pict_" + a + "'>" + img + "</div>" +
					"<div class='collec2'>账号名：" + "</div>" +
					"<span class='collec6' id='accountbankcard'>" + (arr[a].accountbankcard).replace(reg, "$1 **** **** $2") + "</span>" +
					"<div class='collec3' data-target='#edit_gp_btn1' data-toggle='modal' id='compile_" + a + "'>编辑</div>" +
					"<div class='collec4' id='' >删除</div>" +
					"</div>";

				hts += htmls;
			}
		}
	}
	$("#circulation").html(hts);
}

//查看二维码
$(document).on('click', '.ABclass5', function() {

	var index = $(this).closest('.ABclass').index();
	var data1 = arr[index];
	var ss = data1.walletsite//'{"address":"'+data.rows[index].accountaddress+'",'+'"amount":"'+data.rows[index].number+'"'+'}';
	var qrcode = new QRCode(document.getElementById("ewm"),{
		width : 100,
		height : 100,
		text: ss
	});

	$("#edit_gp_btn2").on("hidden.bs.modal", function() {
		$('#ewm').html('');
	});
});
//删除ab钱包
$(document).on('click', '.ABclass7', function() {

	var index = $(this).closest('.ABclass').index();
	var data1 = arr[index];

//	bootbox.alert("是否删除收款方式");
//	return;
	$.ajax({
		type: 'POST',
		url: "/bd/col/pbsha.do",
		dataType: 'json',
		contentType: "application/json;charset=utf-8",
		async: false,
		isMask: true,
		data: JSON.stringify(data1),
		success: function(ret) {
			if(ret.err_code == "1") {
				bootbox.alert("删除钱包地址成功", function() {
					location.reload();
				});
			} else {
				bootbox.alert(ret.msg, function() {
					location.reload();
				});
			}
		},
		error: function(err) {
			if(err.status==406||err.status==401){
				window.location.replace("/login.html");
			}else{
				bootbox.alert("服务器繁忙,请稍后再试", function() {
					location.reload();
				});
			}
		}
	});

});

//删除银行
$(document).on('click', '.collec4', function() {

	var index = $(this).closest('.collec1').index();
	var data1 = arr[index];

//	bootbox.alert("是否删除收款方式");
//	return;
	$.ajax({
		type: 'POST',
		url: "/bd/col/pbsha.do",
		dataType: 'json',
		contentType: "application/json;charset=utf-8",
		async: false,
		isMask: true,
		data: JSON.stringify(data1),
		success: function(ret) {
			if(ret.err_code == "1") {
				bootbox.alert("删除收款账号成功", function() {
					location.reload();
				});
			} else {
				bootbox.alert(ret.msg, function() {
					location.reload();
				});
			}
		},
		error: function(err) {
			if(err.status==406||err.status==401){
				window.location.replace("/login.html");
			}else{
				bootbox.alert("服务器繁忙,请稍后再试", function() {
					location.reload();
				});
			}
		}
	});

});



//修改银行卡
$(document).on('click', '.collec3', function() {
	var index = $(this).closest('.collec1').index();
	var data = arr[index];

	if($("#addtype").val() == 1){
		$("#ADDTYPE").hide();
		$("#WALLETSITE").hide();
		$("#ACCOUNTOPENBRANCH").show();
		$("#ACCOUNTBANKCARD").show();
		$("#ACCOUNTBANKNAME").show();
	} else if($("#addtype").val() == 2){
		$("#ADDTYPE").hide();
		$("#WALLETSITE").show();
		$("#ACCOUNTOPENBRANCH").hide();
		$("#ACCOUNTBANKCARD").hide();
		$("#ACCOUNTBANKNAME").hide();
	}
	$("#update_gp").hide();
	$("#update_gp1").show();
	$("#amounttype").attr("disabled", true);
	$("#type").attr("disabled", true);
	$("#paymentway").attr("disabled", true);
	/*模态框关闭后清空模态框里填写的数据*/
	$("#edit_gp_btn1").on("hidden.bs.modal", function() {
		document.getElementById("edit_form1").reset();
	});
	$.each(data, function(key, val) {
		$("form[name='edit_form1'] input[name='" + key + "']").val(val);
	});
	if(data.status == 1) {
		$("#status option[value='" + data.status + "']").attr('selected', 'selected');
	} else if(data.status == 2) {
		$("#status option[value='" + data.status + "']").attr('selected', 'selected');
	}
	var bank={};
	bank.type='2';
	$.ajax({
		type: 'POST',
		url: "/bd/col/pbion.do",
		dataType: 'json',
		contentType: "application/json;charset=utf-8",
		async: false,
		isMask: true,
		data: JSON.stringify(bank),
		success: function(ret) {
			if(ret.err_code == "1"&&ret.type=='2') {
				if(ret.banks!=undefined||ret.banks!=''){
					var data = eval(ret.banks);
					var htmlbank='<option value="">请选择银行</option>';
					data.forEach(bank => {
						htmlbank+='<option value="'+bank.code+'-'+bank.name+'">' +bank.name+ '</option>';
					})
					$('#bank').append(htmlbank);
				}
			}
		},
		error: function(err) {
			if(err.status==406||err.status==401){
				window.location.replace("/login.html");
			}else{
				bootbox.alert("服务器繁忙,请稍后再试", function() {
					location.reload();
				});
			}

		}
	});
	$("#update_gp").show();
	$("#update_gp1").hide();
	var bankselected = data.bankcode+'-'+data.accountbankname;
	$("#bank option[value='" + bankselected + "']").attr('selected', 'selected');
});

/*审批*/
$(document).on('click', '#edit_gp', function() {
	var bank={};
	bank.type='2';
	$.ajax({
		type: 'POST',
		url: "/bd/col/pbion.do",
		dataType: 'json',
		contentType: "application/json;charset=utf-8",
		async: false,
		isMask: true,
		data: JSON.stringify(bank),
		success: function(ret) {
			if(ret.err_code == "1"&&ret.type=='2') {
				if(ret.banks!=undefined||ret.banks!=''){
					var data = eval(ret.banks);
					var htmlbank='<option value="">请选择银行</option>';
					data.forEach(bank => {
						htmlbank+='<option value="'+bank.code+'-'+bank.name+'">' +bank.name+ '</option>';
					})
					$('#bank').append(htmlbank);
				}
			}
		},
		error: function(err) {
			if(err.status==406||err.status==401){
				window.location.replace("/login.html");
			}else{
				bootbox.alert("服务器繁忙,请稍后再试", function() {
					location.reload();
				});
			}

		}
	});
	$("#update_gp").show();
	$("#update_gp1").hide();
});

String.prototype.trim = function() {
	return this.replace(/(^\s*)|(\s*$)/g, '');
};

$("#update_gp").click(function() {
	var edit_form1 = $("#edit_form1").serializeObject();
	var banknamecode = edit_form1.bank;//选择的银行
	var status = edit_form1.status;//状态
	var accountbankcard = edit_form1.accountbankcard;//银行卡号
	var accountopenbranch = edit_form1.accountopenbranch;//支行名称
	var accountusername = edit_form1.accountusername;//姓名
	var googlecode = edit_form1.googlecode;//谷歌验证码

	if (!banknamecode){
		bootbox.alert("请选择银行");
		return;
	}
	if (!(/^[\u4e00-\u9fa5]+$/.test(accountopenbranch))){
		bootbox.alert("请正确填写中文支行名称!");
		return;
	}
	if (!(/^[0-9]{10,20}$/.test(accountbankcard))){
		bootbox.alert("银行卡号不正确!");
		return;
	}
	if (!(/^[\u4e00-\u9fa5]{2,6}$/.test(accountusername))){
		bootbox.alert("姓名位2-6汉字");
		return;
	}
	if (status==""){
		bootbox.alert("请选择状态");
		return;
	}
	if (!(/^[0-9]{6}$/.test(googlecode))){
		bootbox.alert("谷歌验证码为6位数字");
		return;
	}
	edit_form1.bankcode = banknamecode.split("-")[0];
	edit_form1.accountbankname = banknamecode.split("-")[1];
	edit_form1.addtype='1';
	edit_form1.status=status;
	$.ajax({
		type: 'POST',
		url: "/bd/col/pbion.do",
		dataType: 'json',
		contentType: "application/json;charset=utf-8",
		async: false,
		isMask: true,
		data: JSON.stringify(edit_form1),
		success: function(data) {
			if(data.errCode == "1") {
				bootbox.alert(data.msg, function() {
					location.reload();
				});
			} else {
				bootbox.alert(data.msg, function() {
					location.reload();
				});
			}
		},
		error: function(err) {
			if(err.status==406||err.status==401){
				window.location.replace("/login.html");
			}else{
				bootbox.alert("服务器繁忙,请稍后再试", function() {
					location.reload();
				});
			}
		}
	});
});


//修改AB钱包地址
$(document).on('click', '.ABclass6', function() {
	var index = $(this).closest('.ABclass').index();
	var data = arr[index];
	if(data.addtype == 1){
		$("#ADDTYPE").hide();
		$("#WALLETSITE").hide();
		$("#ACCOUNTOPENBRANCH").show();
		$("#ACCOUNTBANKCARD").show();
		$("#ACCOUNTBANKNAME").show();
	} else if(data.addtype == 2){
		$("#ADDTYPE").hide();
		$("#WALLETSITE").show();
		$("#ACCOUNTOPENBRANCH").hide();
		$("#ACCOUNTBANKCARD").hide();
		$("#ACCOUNTBANKNAME").hide();
	}
	$("#update_gp").hide();
	$("#update_gp1").show();
	$("#amounttype").attr("disabled", true);
	$("#type").attr("disabled", true);
	$("#paymentway").attr("disabled", true);
	$.each(data, function(key, val) {

		/*模态框关闭后清空模态框里填写的数据*/
		$("#edit_gp_btn1").on("hidden.bs.modal", function() {
			document.getElementById("edit_form1").reset();
		});
		/*-----------------------*/
		$("form[name='edit_form1'] input[name='" + key + "']").val(val);

		if(data.status == 1) {
			$("#status option[value='" + data.status + "']").attr('selected', 'selected');
		} else if(data.status == 2) {
			$("#status option[value='" + data.status + "']").attr('selected', 'selected');
		}

		if(data.addtype == 1) {
			$("#addtype option[value='" + data.addtype + "']").attr('selected', 'selected');
		} else if(data.addtype == 2) {
			$("#addtype option[value='" + data.addtype + "']").attr('selected', 'selected');
		}

	});

});

$("#update_gp1").click(function() {
	var edit_form1 = $("#edit_form1").serializeObject();

	$.ajax({
		type: 'POST',
		url: "/bd/col/pbgai.do",
		dataType: 'json',
		contentType: "application/json;charset=utf-8",
		async: false,
		isMask: true,
		data: JSON.stringify(edit_form1),
		success: function(ret) {
			if(ret.err_code == "1") {
				bootbox.alert("修改收款账号成功", function() {
					location.reload();
				});
			} else {
				bootbox.alert(ret.msg, function() {
					location.reload();
				});
			}
		},
		error: function(err) {
			if(err.status==406||err.status==401){
				window.location.replace("/login.html");
			}else{
				bootbox.alert("服务器繁忙,请稍后再试", function() {
					location.reload();
				});
			}

		}
	});

});