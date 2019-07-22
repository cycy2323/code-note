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

var isTransferFM = function (val) {
	return {
        f: function (val) {
        	if(val==1){
            	return "否";
		    }else if(val==0){
		    	return "是"
		    }else{
		    	return "-";
		    }
        }
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
                    restbase: 'txbizcurrency?query={"coinType":"2"}',
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
                            friendly: "股票名称",
                            validate:"required",
                            index: 2
                        },
                        {
                            col: "currencyCode",
                            friendly: "股票编码",
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
                            col: "floatLimit",
                            friendly: "浮动限制",
                            index: 5
                        },
                        {
                            col: "coinType",
                            friendly: "交易对类型",
                            index: 7,
                            hidden: true,
                            nonedit: "nosend",
                            readonly: "readonly",
                            format: typeFM
                        },
                        {
                            col: "isTransfer",
                            friendly: "是否允许股权转让",
                            index: 8,
                            format: isTransferFM
                        },
                        {
                            col: "presellCount",
                            friendly: "预发行个数",
                            index: 9
                        },
                        {
                            col: "selledCount",
                            friendly: "预发行剩余个数",
                            index: 10
                        },
                        {
                            col: "presellPrice",
                            friendly: "发行价",
                            index: 11
                        },
                        {
                            col: "industry",
                            friendly: "行业",
                            index: 12
                        },
                        {
                            col: "currencyDesc",
                            friendly: "描述",
                            nonedit: "nosend",
                            readonly: "readonly",
                            index: 13
                        },
                        {
                            col: "startTime",
                            friendly: "申购开始时间",
                            index: 14
                        },
                        {
                            col: "endTime",
                            friendly: "申购结束时间",
                            index: 14
                        },
                        {
                            col: "publishTime",
                            friendly: "发布时间",
                            index: 14
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
                        var coinType = RQLBuilder.like("coinType", "2");
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
    if(!currencyName){
        bootbox.alert("股票名称不能为空");
		return;
    }
    var currencyCode = $("#currencyCode").val();
    if(!currencyCode){
        bootbox.alert("股票代码不能为空");
		return;
    }
	var status = $("#status").val();
	var floatLimit = $("#floatLimit").val();
	var presellCount = $("#presellCount").val();
//	var selledCount = $("#selledCount").val();
	var presellPrice = $("#presellPrice").val();
	var industry = $("#industry").val();
	var startTime = $("#startTime").val();
	var endTime = $("#endTime").val();
	var publishTime = $("#publishTime").val();
    var currencyDesc = $("#currencyDesc").val();
    var isTransfer = $("#isTransfer").val();
	var param = {
		"bizCurrencyId":currencyCode,
		"currencyName":currencyName,
		"currencyCode":currencyCode,
		"status":status,
		"coinType":"2",
		"floatLimit":floatLimit,
		"presellCount":presellCount,
		"selledCount":presellCount,
		"presellPrice":presellPrice,
		"industry":industry,
		"startTime":startTime,
		"endTime":endTime,
		"publishTime":publishTime,
        "currencyDesc":currencyDesc,
        "isTransfer":isTransfer
	}
    Restful.insert(hzq_rest+"txbizcurrency",param);
    
    var accounts = Restful.findNQ(hzq_rest+"txtpsaccount");
    for(var i = 0;i<accounts.length;i++){
        var accountid = accounts[i].txTpsAccountId;
        var paramDet = {
            "accountId":accountid,
            "coinId":currencyCode,
            "coinName":currencyName,
            "accountType":"2"
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
	$.each(data.rows[0], function(key,val) {
    	$("form[name='edit_form'] input[name='"+key+"']").val(val);
    });
})
$("#edit_gp").click(function(){
	var edit_form = $("#edit_form").serializeObject();
	Restful.update(hzq_rest+"txbizcurrency",edit_form.bizCurrencyId,edit_form);
	xw.update();
})
