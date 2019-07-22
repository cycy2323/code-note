var xw;
var statusFormat = function (val) {
	return {
        f: function (val) {
        	if(val==0){
            	return "启用";
		    }else if(val==1){
		    	return "删除"
		    }else{
		    	return "-";
		    }
        }
    }
}();
var UserWalletAddress = function () {
    return {
        init: function () {
            this.reload();
        },
        reload: function () {

            $('#divtable').html('');
            this.xw = XWATable.init(
                {
                    divname: "divtable",
                    //----------------table的选项-------
                    pageSize: 50,
                    columnPicker: true,
                    transition: 'fade',
                    checkboxes: true,
                    checkAllToggle: true,
                    //----------------基本restful地址---
                    restbase: 'txtpswalletaddress?sort=-modifiedTime',
                    key_column: 'txTpsWalletAddressId',
                    coldefs: [
                        {
                            col: "txTpsWalletAddressId",
                            friendly: "钱包地址ID",
                            unique: "true",
                            hidden: false,
                            readonly: "readonly",
                            width:200,
                            index: 1
                        },
                        {
                            col: "accountId",
                            friendly: "账户ID",
                            validate:"required",
                            index: 2
                        },
                         {
                            col: "coin",
                            friendly: "币种",
                            validate:"required",
                            index: 4
                        },
                        {
                            col: "userId",
                            friendly: "用户ID",
                            validate:"required",
                            index: 5
                        },
                        {
                            col: "status",
                            friendly: "状态",
                            format:statusFormat,
                            index: 6
                        },
                        {
                            col: "icon",
                            friendly: "图标",
                            index: 6
                        },
                        {
                            col: "createdBy",
                            friendly: "创建人",
                            index: 7
                        },
                        {
                            col: "createdTime",
                            friendly: "创建时间",
                            index: 8
                        },
                        {
                            col: "modifiedBy",
                            friendly: "变更人",
                            index: 9
                        },
                        {
                            col: "modifiedTime",
                            friendly: "变更时间",
                            index: 10
                        },
                        {
                            col: "remark",
                            friendly: "备注",
                            index: 11
                        }
                    ],
                    // 查询过滤条件
                    findFilter: function () {
                        var txTpsWalletAddressId,accountId,userId,status,userType;
                        if($('#txTpsWalletAddressId').val()) {
                            txTpsWalletAddressId = RQLBuilder.equal("txTpsWalletAddressId", $.trim($('#txTpsWalletAddressId').val()));
                        }
                        if($('#accountId').val()) {
                            accountId = RQLBuilder.equal("accountId", $.trim($('#accountId').val()));
                        }
                        if($('#userId').val()) {
                            userId = RQLBuilder.equal("userId", $.trim($('#userId').val()));
                        }
                        if($('#status').val()) {
                            status = RQLBuilder.equal("status", $.trim($('#status').val()));
                        }
                        userType = RQLBuilder.equal("userType",'1');
                        var filter = RQLBuilder.and([
                            txTpsWalletAddressId,userId,accountId,status,userType
                        ]);
                        return filter.rql();
                    }
                })
        }
    }
}();
////查看钱包地址信息
//$("#userUpdate").click(function(){
//	var data = xw.getTable().getData(true);
//	if (data.rows.length == 0) {
//		bootbox.alert("<br><center><h4>请选择一条数据！</h4></center><br>");
//		return false;
//	}
//	if (data.rows.length > 1) {	
//		bootbox.alert("<br><center><h4>只能选择一行！</h4></center><br>");
//		return false;
//	}
//	console.log(data.rows[0]);
//	$.each(data.rows[0], function(key,val) {
//  	$("form[name='edit_user_info'] input[name='"+key+"']").val(val);  	
//  	if(key=="valiEmail"){
//  		if(val==1){
//  			$("#"+key+" option[value='1']").attr("selected",true); 
//  		}else{
//  			$("#"+key+" option[value='0']").attr("selected",true); 
//  		}
//  	}
//  	if(key=="valiMobile"){
//  		if(val==1){
//  			$("#"+key+" option[value='1']").attr("selected",true); 
//  		}else{
//  			$("#"+key+" option[value='0']").attr("selected",true); 
//  		}
//  	}
//  	if(key=="valiIdNumber"){
//  		if(val==1){
//  			$("#"+key+" option[value='1']").attr("selected",true); 
//  		}else{
//  			$("#"+key+" option[value='0']").attr("selected",true); 
//  		}
//  	}
//  	if(key=="isTrPwd"){
//  		if(val==1){
//  			$("#"+key+" option[value='1']").attr("selected",true); 
//  		}else{
//  			$("#"+key+" option[value='0']").attr("selected",true); 
//  		}
//  	}
//  	
//  });
//})

