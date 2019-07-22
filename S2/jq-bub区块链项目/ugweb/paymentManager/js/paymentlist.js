var xw;

var detailform;
var selrow_obj;
var stopPayment = function(val){
	var dialog = bootbox.dialog({
		title: '收款方式停用',
		message:"是否停用？",
		//message:'<p><table><tr></td><td>支付密码：</td><td> <input id="put_paypwd" style="width:200px" type="text" class="form-control" placeHolder="输入密码" autocomplete="off" password="" /></td><td>谷歌验证码：</td><td><input id="put_google" class="form-control " style="width:200px" placeHolder="请输入谷歌验证码"></td></tr></table></p>',
        closeButton: true,
        buttons: {
            ok: {
                label: "停用",
                className: 'btn-success',
                callback: function () {
                    var datapost = {};
					datapost.paymentWayId = val;
					datapost.status = "2";
					$.ajax({
						url: "/ug/mer/pbupw.do",
						type: "POST",
						contentType: "application/json;charset=utf-8",
						data:JSON.stringify(datapost),
						dataType: "json",
						success: function (data) {
							if(data.errcode == '1'){
								//上架成功
								bootbox.alert("停用成功");
								xw.update();
							}else{
								bootbox.alert(data.msg);
								return false;
							}
						},
						error: function () {
							bootbox.alert('停用失败，请重试或联系客服');
							return false;
						}
					});
                }
            }
        }
    });
};
var startPayment = function(val){
    var dialog = bootbox.dialog({
        title: '收款方式启用',
        message:"是否启用？",
        //message:'<p><table><tr></td><td>支付密码：</td><td> <input id="put_paypwd" style="width:200px" type="text" class="form-control" placeHolder="输入密码" autocomplete="off" password="" /></td><td>谷歌验证码：</td><td><input id="put_google" class="form-control " style="width:200px" placeHolder="请输入谷歌验证码"></td></tr></table></p>',
        closeButton: true,
        buttons: {
            ok: {
                label: "启用",
                className: 'btn-success',
                callback: function () {
                    var datapost = {};
                    datapost.paymentWayId = val;
                    datapost.status = "1";
                    $.ajax({
                        url: "/ug/mer/pbupw.do",
                        type: "POST",
                        contentType: "application/json;charset=utf-8",
                        data:JSON.stringify(datapost),
                        dataType: "json",
                        success: function (data) {
                            if(data.errcode == '1'){
                                //上架成功
                                bootbox.alert("启用成功");
                                xw.update();
                            }else{
                                bootbox.alert('启用失败，请重试或联系客服');
                                return false;
                            }
                        },
                        error: function () {
                            bootbox.alert('启用失败，请重试或联系客服');
                            return false;
                        }
                    });
                }
            }
        }
    });
};

//查看
var viewDetail = function(val){
    // if ($('#show_paymentWay').val() == '1' || $('#show_paymentWay').val() == '2') {
    //     // debugger
    //     document.getElementById('accountOpenBank').style.display = 'none';
    //     document.getElementById('accountOpenBranch').style.display = 'none';
    //     document.getElementById('accountBankCard').style.display = 'none';
    //     document.getElementById('affirmBankCard').style.display = 'none';
    //     document.getElementById('show_img').style.display = 'block';
    // } else {
    //     document.getElementById('accountOpenBank').style.display = 'block';
    //     document.getElementById('accountOpenBranch').style.display = 'block';
    //     document.getElementById('accountBankCard').style.display = 'block';
    //     document.getElementById('affirmBankCard').style.display = 'block';
    //     document.getElementById('show_img').style.display = 'none';
    // }
	$('#divOne').html('');
	doClearForView();
	reShowDetail(val);
	// $('#show_payment_modal').modal("show");
};
var doClearForView = function(){
	$("#show_payment_form").on("hidden.bs.modal", function() {
		document.getElementById("show_payment_form").reset();
	});
};
var reShowDetail = function(paymentid){

	var rows = new Array();
	selrows = xw.getTable().getData();
	$.each(selrows.rows, function(idx, row) {
		if(row.ugOtcPaymentWayId == paymentid) {
			rows.push(row);
		}
	});
	selrows.rows = rows;
	selrow_obj = rows[0];
	$.each(selrow_obj, function(key, val) {//key.val
		if(key =='qrCode'){
            new QRCode(document.getElementById('divOne'), val);
			// $('#show_qrCode').attr('src',val);
		}else{
			$("form[name='paymentShow'] input[data-name='"+key+"']").val(val);
			$("form[name='paymentShow'] select[data-name='"+key+"']").val(val).trigger("change");
		}
		if($('#show_paymentWay').val() == '3'){
			$('#show_img').hide();
		}else{
			$('#show_img').show();
		}

	});

	$('#show_payment_modal').modal("show");
};
var PaymentList = function() {

	var OperateFunc = function () {
        return {
            f: function (val, row) {
				//var balance_date = row.balanceDate
				var returnstr = '';
				$('#ugOtcPaymentWayId').val(row.ugOtcPaymentWayId);
				$('#show_paymentAccount1').val(row.paymentAccount);
				$('#show_paymentName1').val(row.paymentName);
				$('#show_status1').val(row.status);
				$('#show_accountOpenBank1').val(row.accountOpenBank);
				$('#show_accountOpenBranch1').val(row.accountOpenBranch);
				$('#show_accountBankCard1').val(row.accountBankCard);

				// 暂时注释该功能
				if(row.status == '1'){//已付款-待放行
					returnstr +=' <a data-id="' + val + '" onclick="stopPayment(\'' + val + '\')" href="javascript:void(0)" style="color:#df2d2d">停用</a>'
				} else if (row.status == '2') {
                    returnstr +=' <a data-id="' + val + '" onclick="startPayment(\'' + val + '\')" href="javascript:void(0)" style="color:#167CF9">启用</a>'
				}

				// if(row.status == '1'){//待付款
				// 	returnstr +=' <a data-id="' + val + '" onclick="viewDetail1(\'' + val + '\')" href="javascript:void(0)" style="color:#0cc2aa">查看</a>';
					returnstr +=' <a data-id="' + val + '" onclick="viewDetail(\'' + val + '\')" href="javascript:void(0)" style="color:#0cc2aa">查看</a>';
				// }
				// if(row.status == '2'){

				// }
               return returnstr;

            }
        }
	}();




	return {

		init: function() {
			// 顺序有影响 (先抓选单, 再抓暂存选单, 再执行其他)
			this.initHelper();
			this.reload();
		},
		initHelper:function(){
			$('input[type=radio][name=optionsRadios]').change(function() {
				if(this.value == 'alipay'){//支付宝
					$('#picbody').show();
				}else if(this.value =='weixinpay'){//微信
					$('#picbody').show();
				}else if(this.value == 'unionpay'){//银行
					$('#picbody').hide();
				}
			});
		},
		reload: function() {

			$('#divtable').html('');


			var selecturl = "/ug/mer/pbpws.do";

			var bd = {};

			xw = XWATable.init({
				divname: "divtable",
				//----------------table的选项-------
				pageSize: 50,
				columnPicker: false,
				transition: 'fade',
				checkboxes: false,
				checkAllToggle: true,
				//----------------基本restful地址---
				restURL:selecturl+"?bd="+encodeURIComponent(JSON.stringify(bd)),
				// restURL: "/ug/ord/pbder.do?bd={'':''}",
				coldefs: [
                    {
                        col: "ugOtcPaymentWayId",
                        friendly: "账号ID",
						hidden: true,
                        index: 1
                    },
					{
						col: "paymentWay",
						friendly: "账号类型",
						format:OtcOrdBas.paymentWayFormat,
						index: 2
					},
					{
						col: "paymentAccount",
						friendly: "账号ID",
						index: 3
					},
					{
						col: "paymentName",
						friendly: "姓名",
						validate: "createdtime",
						index: 4
					},
					{
						col: "sumdayamount",
						friendly: "今日已收款",
						//format:OtcOrdBas.paymentWayFormat,
						index: 5
					},
					{
						col: "status",
						friendly: "启用状态",
						format:{
							f:function(val){
								if(val){
									if(val =='1'){
										return '<span style="color:#167cf9">启用中</span>';
									}else
									if(val == '2'){
										return '<span style="color:#666">已停用</span>';
									}else{
										return val;
									}
								}else{
									return "--";
								}
							}
						},

						index: 6
					},
					{
						col:"accountOpenBank",
						friendly:"开户银",
						hidden:true,
						index : 7
					},
					{
						col:"accountOpenBranch",
						friendly:"开户支行",
						hidden:true,
						index : 8
					},
					{
						col:"accountBankCard",
						friendly:"银行账号",
						hidden:true,
						index : 9
					},
					{
						col:"qrCode",
						friendly:"收款二维码",
						hidden:true,
						index : 10
					},
					// {
					// 	col:"",
					// 	friendly:"",
					// 	hidden:true,
					// 	index : 11
					// },
					{
						col: "ugOtcPaymentWayId",
						friendly: "操作",//查看 提醒付款，放行订单
						// validate: ,
						format:OperateFunc,
						index: 12
					}

				],
				// 查询过滤条件
				findFilter: function() {
					var findbd = {};
					if($('#find_orderno').val()){
						findbd.orderno = $('#find_orderno').val();
					}
					if($('#find_buyuserid').val()){
						findbd.buyuserid = $('#find_buyuserid').val();
					}
					if($('#find_status').val()){
						findbd.type = $('#find_status').val();
					}
					if($('#find_begintime').val() && $('#find_endtime').val()){
						findbd.begintime = $('#find_begintime').val();
						findbd.endtime = $('#find_endtime').val();
					}
					if($('#find_paymentwayaccount').val()){
						findbd.paymentwayaccount = $('#find_paymentwayaccount').val();
					}
					//encodeURIComponent
					xw.setRestURL(selecturl+"?bd="+(JSON.stringify(findbd)));
                    return "";//filter.rql();
				},

			})
		}
	}

}();

initPayType=()=>{
	let redio_value=$("input:radio[name='optionsRadios']:checked").val();//①
	if(redio_value == 'alipay'){//支付宝
		$('#picbody').show();
		$('#bankName').hide();
		$('#bankNo').hide();
		$('#comfirBankNo').hide();
		$('#show_bank').hide();
		$('#accountNo').show();
	}else if(redio_value =='weixinpay'){//微信
		$('#picbody').show();
		$('#bankName').hide();
		$('#show_bank').hide();
		$('#bankNo').hide();
		$('#comfirBankNo').hide();
		$('#accountNo').show();
	}else if(redio_value == 'unionpay'){//银行
		$('#picbody').hide();
		$('#accountNo').hide();
		$('#bankName').show();
		$('#bankNo').show();
		$('#comfirBankNo').show();
		$('#show_bank').show();
	}
}

// 切换方式
$("input:radio[name='optionsRadios']").change(function (){
	initPayType()
	// $("#pic").removeClass();
	// $("#pic").addClass("img"+opt);
	// $("#tip").text($("input[name='style']:checked").next("label").text());//②
	// $("#tip").css("color","red");
})
// 新增
$('#add_newpaybutton').on('click',function(e){
	$('#photopic').modal("show");
	$('#image_1').hide();
	initPayType()
})


// var meterReadingId,ctmArchiveId;
// $(document).on("click",'.uploadpic',function(){
//     meterReadingId = $(this).attr("data-id");
//     ctmArchiveId = $(this).attr("data-code");

//     $("#photopic").modal("show")

// })

$("#paymentsubmit").on("click",function(){
	var updatedata = {};
	// var merchant = $('#merchant').val();
	var add_paymentWay = '';
	var redio_value=$("input:radio[name='optionsRadios']:checked").val();//①
	if(redio_value == 'alipay'){//支付宝
		add_paymentWay = '2';
	}else if(redio_value =='weixinpay'){//微信
		add_paymentWay = '1';
	}else if(redio_value == 'unionpay'){//银行
		add_paymentWay = '3';
	}
	var paymentAccount = $('#add_paymentAccount').val();
	var paymentName = $('#add_paymentName').val();
	var imagePath = $('#imagePath')[0].src;
	var hadUpload = $('#hadUpload').val();
	var accountOpenBank = $('#add_accountOpenBank').val();
	var accountOpenBranch = $('#add_accountOpenBranch').val();
	var accountBankCard = $('#add_accountBankCard').val();
	var add_accountBankCardRepeat = $('#add_accountBankCardRepeat').val();
	var add_tradePwd= $.md5($('#add_tradePwd').val());
	var oneDayLimit= $('#oneDayLimit').val();

	if(!add_tradePwd){
		bootbox.alert("请填写支付密码");
		return;
	}
	if(!add_paymentWay){
		bootbox.alert("请选择收款方式");
		return;
	}
	if(add_paymentWay=='3'){
		if(!accountOpenBank){
	 		bootbox.alert("请填写开户银行");
	 		return;
	 	}
	 	if(!accountOpenBranch){
	 		bootbox.alert("请填写开户支行");
	 		return;
	 	}
	 	if(!accountBankCard){
	 		bootbox.alert("请填写银行卡");
	 		return;
	 	}
	 	if(!add_accountBankCardRepeat){
			bootbox.alert("请填写确认银行账号");
			return;
		}
	}else{
		if(!paymentAccount){
			bootbox.alert("请填写收款账户");
			return;
		}
		if(!paymentName){
			bootbox.alert("请填写收款人姓名");
			return;
		}
		if(!hadUpload){
			bootbox.alert("请上传收款二维码");
			return;
		}
	}
	updatedata.paymentWay = add_paymentWay,updatedata.name = paymentName,updatedata.account = paymentAccount,updatedata.QRCode=imagePath;
	updatedata.accountOpenBank = accountOpenBank,updatedata.accountOpenBranch = accountOpenBranch,updatedata.accountBankCard = accountBankCard;
	updatedata.accountBankCardRepeat = add_accountBankCardRepeat,updatedata.tradePwd = add_tradePwd;updatedata.oneDayLimit = oneDayLimit;
	$.ajax({
            type: 'POST',
            url:"/ug/mer/pbapw.do",
            dataType: 'json',
            contentType: "application/json;charset=utf-8",
            async: false,
            isMask: true,
            data: JSON.stringify(updatedata),
            success: function(result) {
				if(result.errcode == '1'){
					bootbox.alert(result.msg,()=>{
						location.reload()
					});
					xw.update();
				}else{
					if(result.msg==="请先设置资金密码"){
						bootbox.alert("请先设置支付密码");
					}else{
						bootbox.alert(result.msg);
					}
					return;
				}

            },
            error: function(result) {
				bootbox.alert("接口访问异常");
				xw.update();
            }
        });

});
// 查看



// 修改提交

$("#amendSubmit").on("click",function(){
    // var index = $(this).closest('tr').index();
    // var data = xw.getTable().getData();
    var updatedata = {};
    // var merchant = $('#merchant').val();
    var add_paymentWay = '';
    var redio_value=$("input:radio[name='optionsRadios']:checked").val();//①
    if(redio_value == 'alipay'){//支付宝
        add_paymentWay = '2';
    }else if(redio_value =='weixinpay'){//微信
        add_paymentWay = '1';
    }else if(redio_value == 'unionpay'){//银行
        add_paymentWay = '3';
    }
    var paymentAccount = $('#show_paymentAccount').val();
    var paymentName = $('#show_paymentName').val();
	var hadUpload = $('#hadUpload').val();
    var imagePath = $('#show_qrCode')[0].src;
    var accountOpenBank = $('#show_accountOpenBank').val();
    var accountOpenBranch = $('#show_accountOpenBranch').val();
    var accountBankCard = $('#show_accountBankCard').val();
    var add_accountBankCardRepeat = $('#affirm_accountBankCard').val();
    var add_tradePwd= $('#payPWD').val();
    var paymentWayId = $('#ugOtcPaymentWayId').val();

    if(!add_tradePwd){
        bootbox.alert("请填写交易密码");
        return;
    }
    if(!add_paymentWay){
        bootbox.alert("请选择收款方式");
        return;
    }
    if($('#show_paymentWay').val()=='3'){
        if(!accountOpenBank){
            bootbox.alert("请填写开户银行");
            return;
        }
        if(!accountOpenBranch){
            bootbox.alert("请填写开户支行");
            return;
        }
        if(!accountBankCard){
            bootbox.alert("请填写银行卡");
            return;
        }
        if(!add_accountBankCardRepeat){
            bootbox.alert("请填写确认银行账号");
            return;
        }
    }else{
        if(!paymentAccount){
            bootbox.alert("请填写收款账户");
            return;
        }
        if(!paymentName){
            bootbox.alert("请填写收款人姓名");
            return;
        }
        if(!hadUpload){
            bootbox.alert("请上传收款二维码");
            return;
        }
    }
    updatedata.paymentWay = add_paymentWay,updatedata.name = paymentName,updatedata.account = paymentAccount,updatedata.QRCode=imagePath;
    updatedata.accountOpenBank = accountOpenBank,updatedata.accountOpenBranch = accountOpenBranch,updatedata.accountBankCard = accountBankCard;
    updatedata.accountBankCardRepeat = add_accountBankCardRepeat,updatedata.tradePwd = add_tradePwd;
    updatedata.paymentWayId = paymentWayId;
    $.ajax({
        type: 'POST',
        url:"/ug/mer/pbupw.do",
        dataType: 'json',
        contentType: "application/json;charset=utf-8",
        async: false,
        isMask: true,
        data: JSON.stringify(updatedata),
        success: function(result) {
            if(result.errcode == '1'){
                bootbox.alert(result.msg);
                xw.update();
            }else{
                // if(result.msg==="请先设置资金密码"){
                //     bootbox.alert("请先设置支付密码");
                // }else{
                //     bootbox.alert(result.msg);
                // }
                bootbox.alert(result.msg);
                return;
            }

        },
        error: function(result) {
            bootbox.alert("接口访问异常");
            xw.update();
        }
    });

})
