var xw;
var statusDI = function (val) {
	return {
        f: function (val) {
        	if(val==1){
            	return "启用";
		    }else if(val==2){
		    	return "停用"
		    }else if(val==3){
		    	return "已删除"
		    }else{
		    	return "-";
		    }
        },
    }
}();
$("#add_balance").click(function(){
	var data = xw.getTable().getData(true);
	var money = $("#rechargemoney").val();
	var usableFund = parseFloat(data.rows[0].usableFund)+parseFloat(money);
	var amount = parseFloat(data.rows[0].amount)+parseFloat(money);
	var txTpsAccountDetailId = data.rows[0].txTpsAccountDetailId;
	var param = {
		"txTpsAccountDetailId":txTpsAccountDetailId,
		"amount":amount,
		"usableFund":usableFund
	}
	//console.log(param);
    var result = Restful.update(hzq_rest+"txtpsaccountdetail",txTpsAccountDetailId,param);
    if(result==true){
    	bootbox.alert("充值成功");
    }
//  var param2 = {
//      "toUser":data.rows[0].address,
//      "amount":money,
//      "coinCode":data.rows[0].coinId,
//      "fromUser":"system",
//      "remark":"系统充值"
//  }
//  param2.txTpsUserTransferId = $.md5(JSON.stringify(param2));
//  Restful.insert(hzq_rest+"txtpsusertransfer",param2);
	xw.update();
})
//根据用户角色初始化按钮
var button_init = function(){
	var user_info = localStorage.getItem("user_info");
	//获取后先转为json
	var userInfo = eval('(' + user_info + ')');
	//获取登陆名
	var login_name = userInfo.login_name;
	var content = "<div class='btn-group form-group'>"+
					    "<button id='recharge' class='btn green'  data-target='#rechargeid' data-toggle='modal'>"+
					        "<i class='fa fa-plus'></i> 充值&nbsp;"+
					    "</button>"+
					"</div>";
	if(login_name=="admin"){
		$('#find').append(content);
	}
}();
$("#recharge").click(function(){
	var data = xw.getTable().getData(true);
	if (data.rows.length == 0) {
		bootbox.alert("<br><center><h4>请选择一条数据！</h4></center><br>");
		return false;
	}
	if (data.rows.length > 1) {
		bootbox.alert("<br><center><h4>只能选择一行！</h4></center><br>");
		return false;
	}
})
var AccountDetailInfoAction = function () {
    return {
        init: function () {
            this.reload();
        },
        reload: function () {
            $('#divtable').html('');
            xw = XWATable.init(
                {
                    divname: "divtable",
                    //----------------table的选项-------
                    pageSize: 50,
                    columnPicker: true,
                    transition: 'fade',
                    checkboxes: true,
                    checkAllToggle: true,
                    //----------------基本restful地址---
                    restbase: 'txtpsaccountdetail?sort=-modifiedTime',
                    key_column: 'txTpsAccountDetailId',
                    coldefs: [
                        {
                            col: "txTpsAccountDetailId",
                            friendly: "账户资产ID",
                            unique: "true",
                            hidden: false,
                            nonedit: "nosend",
                            readonly: "readonly",
                            index: 1
                        },
                        {
                            col: "accountId",
                            friendly: "账户ID",
                            validate:"required",
                            index: 2
                        },
                        {
                            col: "coinId",
                            friendly: "币种代码",
                            validate:"required",
                            index: 3
                        },
                        {
                            col: "usableFund",
                            friendly: "可用资产",
                            validate:"required",
                            index: 4
                        },
                        {
                            col: "frozenFund",
                            friendly: "冻结资产",
                            validate:"required",
                            index: 5
                        },
                        {
                            col: "amount",
                            friendly: "总量",
                            index: 6
                        },
                        {
                            col: "address",
                            friendly: "地址",
                            index: 7
                        },
//                      {
//                          col: "rechargeFundNo",
//                          friendly: "充提平台账户id",
//                          index: 13
//                      },
//                      {
//                          col: "createdTime",
//                          friendly: "创建时间",
//                          nonedit: "nosend",
//                          readonly: "readonly",
//                          index: 14
//                      },
                        {
                            col: "modifiedTime",
                            friendly: "变更时间",
                            nonedit: "nosend",
                            readonly: "readonly",
                            index: 15
                        },
                        {
                            col: "status",
                            friendly: "状态",
                            format: statusDI,
                            readonly: "readonly",
                            index: 15
                        }
                    ],
                    findFilter: function () {
                        var find_txTpsAccountDetailId,find_accountId,find_coin,find_status;
                        if ($('#find_txTpsAccountDetailId').val()) {
                            find_txTpsAccountDetailId = RQLBuilder.equal("txTpsAccountDetailId", $.trim($('#find_txTpsAccountDetailId').val()));
                        }
                        if ($('#find_accountId').val()) {
                            find_txTpsAccountDetailId = RQLBuilder.equal("accountId", $.trim($('#find_accountId').val()));
                        }
                        if ($('#find_coin').val()) {
                            find_coin = RQLBuilder.equal("coinId", $.trim($('#find_coin').val()));
                        }
                        if ($('#find_status').val()) {
                            find_status = RQLBuilder.equal("status", $.trim($('#find_status').val()));
                        }
                        var filter = RQLBuilder.and([
                            find_txTpsAccountDetailId,find_accountId,find_coin,find_status
                        ]);
                        return filter.rql();
                    },
                })
        }
    }
}();
//查看账户详细信息
$('#userAccountDetailSelect').click(function(){
	var data = xw.getTable().getData(true);
	if (data.rows.length == 0) {
		bootbox.alert("<br><center><h4>请选择一条数据！</h4></center><br>");
		return false;
	}
	if (data.rows.length > 1) {	
		bootbox.alert("<br><center><h4>只能选择一行！</h4></center><br>");
		return false;
	}
	console.log(data.rows[0]);
	$.each(data.rows[0], function(key,val) {
    	$("form[name='select_user_account_detail'] input[name='"+key+"']").val(val);  	
    	if(key=="status"){
    		if(val==1){
    			$("#"+key+" option[value='1']").attr("selected",true); 
    		}else if(val==2){
    			$("#"+key+" option[value='2']").attr("selected",true); 
    		}else{
    			$("#"+key+" option[value='3']").attr("selected",true); 
    		}
    	}
    });
});



