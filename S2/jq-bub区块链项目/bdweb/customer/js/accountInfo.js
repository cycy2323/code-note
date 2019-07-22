 var xw;
 var statusUC = function (val) {
	return {
        f: function (val) {
        	if(val==1){
            	return "启用";
		    }else if(val==2){
		    	return "停用";
		    }else{
		    	return "已删除";
		    }
        },
    }
}();
var AccountInfoAction = function () {
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
                    restbase: 'txtpsaccount',
                    key_column: 'txTpsAccountId',
                    coldefs: [
                        {
                            col: "txTpsAccountId",
                            friendly: "账户资产ID",
                            unique: "true",
                            hidden: false,
                            nonedit: "nosend",
                            readonly: "readonly",
                            index: 1
                        },
                        {
                            col: "userId",
                            friendly: "用户ID",
                            validate:"required",
                            index: 2
                        },
                        {
                            col: "status",
                            friendly: "状态",
                            validate:"required",
                            format:statusUC,
                            index: 3
                        },
//                      {
//                          col: "createdTime",
//                          friendly: "创建时间",
//                          validate:"required",
//                          index: 4
//                      },
                        {
                            col: "modifiedTime",
                            friendly: "修改时间",
                            validate:"required",
                            index: 5
                        }
                    ],
                    // 查询过滤条件
                    findFilter: function () {
                        var find_txTpsAccountId,find_userid,find_status;
                        if ($('#find_txTpsAccountId').val()) {
                            find_txTpsAccountId = RQLBuilder.like("txTpsAccountId", $.trim($('#find_txTpsAccountId').val()));
                        }
                        if ($('#find_userid').val()) {
                            find_userid = RQLBuilder.like("userId", $.trim($('#find_userid').val()));
                        }
                        if ($('#find_status').val()) {
                            find_status = RQLBuilder.like("status", $.trim($('#find_status').val()));
                        }
                        var filter = RQLBuilder.and([
                            find_txTpsAccountId,find_userid,find_status
                        ]);
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
//根据用户角色初始化按钮
var button_init = function(){
	var user_info = localStorage.getItem("user_info");
	//获取后先转为json
	var userInfo = eval('(' + user_info + ')');
	//获取登陆名
	var login_name = userInfo.login_name;
	var content = "<div class='btn-group form-group'>"+
					    "<button id='updateUserAccountInfo' class='btn blue' data-target='#update_user_account_info' data-toggle='modal'>"+
					        "<i class='fa fa-pencil'></i> 修改&nbsp;"+
					    "</button>"+
					"</div>";
	if(login_name=="admin"){
		$('#find').append(content);
	}
}();
$("#updateUserAccountInfo").click(function(){
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
    	$("form[name='edit_user_account_info'] input[name='"+key+"']").val(val);  	
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
$('#save_user_account_update').click(function(){
	var edit_user_account_info = $('#edit_user_account_info').serializeObject();
//	console.log(edit_user_account_info);
	$.ajax({
		type: 'POST',
            url:  "/tx/use/pbuai.do",
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            async: true,
            data: JSON.stringify(edit_user_account_info),
            success: function(result) {
            	bootbox.alert(result.resultmsg);
                xw.update();
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


