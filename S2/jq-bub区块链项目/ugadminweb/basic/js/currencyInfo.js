var xw;
var statusFM = function (val) {
	return {
        f: function (val) {
        	if(val==0){
            	return "启用";
		    }else if(val==1){
		    	return "停用"
		    }else if(val==2){
		    	return "停牌"
		    }else if(val==3){
		    	return "预售"
		    }else{
		    	return "-";
		    }
        },
    }
}();
var typeFM = function (val) {
	return {
        f: function (val) {
        	if(val==1){
            	return "数字货币";
		    }else if(val==2){
		    	return "股票"
		    }else if(val==3){
		    	return "法币"
		    }else{
		    	return "-";
		    }
        },
    }
}();

var NoticeInfoAction = function () {
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
                    restbase: 'txbizcurrency?query={"coinType":"1"}',
                    key_column: 'bizCurrencyId',
                    coldefs: [
                        {
                            col: "bizCurrencyId",
                            friendly: "币种ID",
                            unique: "true",
                            hidden: true,
                            nonedit: "nosend",
                            readonly: "readonly",
                            index: 1
                        },
                        {
                            col: "currencyName",
                            friendly: "虚拟币名称",
                            validate:"required",
                            index: 2
                        },
                        {
                            col: "currencyCode",
                            friendly: "虚拟币编码",
                            validate:"required",
                            index: 3
                        },
                        {
                            col: "status",
                            friendly: "状态",
                            validate:"required",
                            format:statusFM,
                            index: 4
                        },
                        
                        {
                            col: "createdTime",
                            friendly: "创建时间",
                            hidden: true,
                            nonedit: "nosend",
                            readonly: "readonly",
                            index: 14
                        },
                        {
                            col: "modifiedTime",
                            friendly: "变更时间",
                            hidden: true,
                            nonedit: "nosend",
                            readonly: "readonly",
                            index: 14
                        }
                        

                    ],
                    // 查询过滤条件
                    findFilter: function () {
                        var find_coin,find_tradecoin;
                        if ($('#find_code').val()) {
                            find_coin = RQLBuilder.like("currencyCode", $.trim($('#find_code').val()));
                        }
                        if ($('#find_name').val()) {
                            find_tradecoin = RQLBuilder.like("currencyName", $.trim($('#find_name').val()));
                        }
                        var coinType = RQLBuilder.like("coinType", "1");
                        var filter = RQLBuilder.and([
                            find_coin,find_tradecoin,coinType
                        ]);
                        xw.setRestURL(hzq_rest + 'txbizcurrency');
                        return filter.rql();
                    },

                    onAdded: function(ret,jsondata){
                        return  validateForm(jsondata);
                    },
                    onUpdated: function(ret,jsondata){
                        return  validateForm(jsondata);
                    },
                    onDeleted: function(ret,jsondata){
                    },
                })
        }
    }
}();

$("#add_gp").click(function(){
	var currencyName = $("#currencyName").val();
	var currencyCode = $("#currencyCode").val();
	var status = $("#status").val();
	var param = {
		"bizCurrencyId":currencyCode,
		"currencyName":currencyName,
		"currencyCode":currencyCode,
		"status":status,
		"coinType":"1"
	}
    Restful.insert(hzq_rest+"txbizcurrency",param);
    var accounts = Restful.findNQ(hzq_rest+"txtpsaccount");
    for(var i = 0;i<accounts.length;i++){
        var accountid = accounts[i].txTpsAccountId;
        var paramDet = {
            "accountId":accountid,
            "coinId":currencyCode,
            "coinName":currencyName,
            "accountType":"1"
        }
        paramDet.txTpsAccountDetailId = $.md5(JSON.stringify(paramDet)+new Date().getTime);
        paramDet.address = paramDet.txTpsAccountDetailId;
        
        $.ajax({
            type: 'POST',
            url:  hzq_rest+"txtpsaccountdetail",
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            async: true,
            isMask: true,
            data: JSON.stringify(paramDet),

            success: function(data) {
                bool = data;
            },
            error: function(err) {

            }
        });
        
    }

	xw.update();
})

$("#edit_btn").click(function(){
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
    	$("form[name='edit_form'] input[name='"+key+"']").val(val);
    });
})
$("#edit_gp").click(function(){
	var edit_form = $("#edit_form").serializeObject();
	console.log(edit_form)
	Restful.update(hzq_rest+"txbizcurrency",edit_form.bizCurrencyId,edit_form);
	xw.update();
})
