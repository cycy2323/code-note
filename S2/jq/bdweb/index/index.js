var incomeMsg;
$(function(){
		$.ajax({
			type: 'POST',
			url: "/bd/inc/pbsel.do",
			dataType: 'json',
			contentType: "application/json;charset=utf-8",
			async: false,
			isMask: true,
			data: '',
			success: function(data) {
				if(data.err_code==1){
					var estimate = 0;
					var closing = 0;
					var sum = 0;
					var clsd = 0;
					if(data.income!=undefined&&data.income!=0){
						estimate=data.income;
					}
					if(data.close!=undefined&&data.close!=0){
						closing=data.close;
					}
					if(data.generalincome!=undefined&&data.generalincome!=0){
						sum=data.generalincome;
					}
					if(data.closeincome!=undefined&&data.closeincome!=0){
						clsd=data.closeincome;
					}
					$("#estimate").html(estimate);
					$("#closing").html(closing);
					$("#sum").html(sum);
					$("#clsd").html(clsd);
					incomeMsg=data;
				}else if(data.err_code==599){
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
//清空
$("#edit_gp_btn").on("hidden.bs.modal", function() {
	document.getElementById("edit_form").reset();
});

$("#edit_gp_onsubmit").click(function() {
    document.getElementById("moneypwd").value = '';
	if(incomeMsg.close!=undefined&&incomeMsg.close!=0){
		$.ajax({
			type: 'POST',
			url: "/bd/inc/pbpay.do",
			dataType: 'json',
			contentType: "application/json;charset=utf-8",
			async: false,
			isMask: true,
			data: '',
			success: function(data) {
				$("#shroffnumber").html('');
				if(data.err_code==1){
					if(data.rows!=undefined){
						$("#edit_gp").click();
						var selectHtml='';
						$.each(data.rows, function(i,item){
							selectHtml+="<option value='"+item.bdusrpaymentwayid+"'>"+item.accountbankname+": "+item.accountbankcard+"</option>";
						});
						$("#shroffnumber").html(selectHtml)
						$("#depositamount").val(incomeMsg.close);

					}else{
						bootbox.alert("请添加收款账号！");
					}
				}else if(data.err_code==599){
					bootbox.alert(data.msg, function() {
						location.reload();
					});
				}else{
					bootbox.alert(data.msg);
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
	}else{
		bootbox.alert("无提现金额！");
	}

});
$("#update_gp1").click(function() {
	var depositamount=$("#depositamount").val();
	var shroffnumber=$("#shroffnumber").val();
	var moneypwd=$("#moneypwd").val();
	var googlecode=$("#googlecode").val();
	if(depositamount==0){
		bootbox.alert("无提现金额");
      return;
	}
	if(shroffnumber.trim().length==0){
		bootbox.alert("请选择收款账号");
		return;
	}
	if(moneypwd.trim().length==0){
		bootbox.alert("请输入资金密码");
		return;
	}
	if(googlecode.trim().length==0){
		bootbox.alert("请输入谷歌验证码");
		return;
	}
	var edit_form={};
	edit_form.depositamount=depositamount;
	edit_form.shroffnumber=shroffnumber;
	edit_form.moneyoassword=$.md5(moneypwd);
	edit_form.googlecode=googlecode;

		$.ajax({
			type: 'POST',
			url: "/bd/inc/pbent.do",
			dataType: 'json',
			contentType: "application/json;charset=utf-8",
			async: false,
			isMask: true,
			data: JSON.stringify(edit_form),
			success: function(rest) {
				if(rest.err_code == "1"){
					rest.msg==='提现成功'&&
					bootbox.alert("提现申请成功，请等待审核处理，可在提现结算管理菜单栏查看处理进度。",function(){
						location.reload();
					});
					xw.update();
				}else if(data.err_code==599){
					bootbox.alert(data.msg, function() {
						location.reload();
					});
				}else{
					bootbox.alert(rest.msg);
					xw.update();
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


$(function(){
	$.ajax({
			type: 'POST',
			url: "/bd/usr/pbcur.do",
			dataType: 'json',
			contentType: "application/json;charset=utf-8",
			async: false,
			isMask: true,
			data:'',
			success: function(rest) {
				if(rest.err_code==1){
					var sumwater=0;
					var ordnumber=0;
					var toresults=0;
					if(undefined!=rest.ordermoney){
						sumwater=rest.ordermoney;
					}
					if(undefined!=rest.ordernumber){
						ordnumber=rest.ordernumber;
					}
					if(undefined!=rest.sharemoney){
						toresults=rest.sharemoney;
					}
					$("#sumwater").html(sumwater);
					$("#ordnumber").html(ordnumber);
					$("#toresults").html(toresults);
				}else if(data.err_code==599){
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
//防止页面后退
history.pushState(null, null, document.URL);
window.addEventListener('popstate', function () {
	history.pushState(null, null, document.URL);
});
