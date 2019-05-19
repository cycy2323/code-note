var xw;
var UserCollectionInfoAction = function () {
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
                    restbase: 'txtpscollection',
                    key_column: 'txTpsCollectionId',
                    coldefs: [
                        {
                            col: "txTpsCollectionId",
                            friendly: "收藏ID",
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
                            col: "coinId",
                            friendly: "基础币种",
                            validate:"required",
                            index: 3
                        },
                        {
                            col: "tradeCurrency",
                            friendly: "计价币种",
                            validate:"required",
                            index: 4
                        }
                        

                    ],
                    // 查询过滤条件
                    findFilter: function () {
                        var find_user,find_coin,find_tradecoin;
                        if ($('#find_user').val()) {
                            find_user = RQLBuilder.like("userId", $.trim($('#find_user').val()));
                        }
                        if ($('#find_coin').val()) {
                            find_coin = RQLBuilder.like("coinId", $.trim($('#find_coin').val()));
                        }
                        if ($('#find_tradecoin').val()) {
                            find_tradecoin = RQLBuilder.like("tradeCurrency", $.trim($('#find_tradecoin').val()));
                        }
                        var filter = RQLBuilder.and([
                           find_user,find_coin,find_tradecoin
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
	var content ="<div class='btn-group form-group'>"+
				    "<button class='btn blue' id='userCollectionInfo' data-target='#user_collection_info' data-toggle='modal'>"+
				        "<i class='fa fa-pencil'></i> 修改&nbsp;"+
				    "</button>"+
				"</div>";
	if(login_name=="admin"){
		$('#find').append(content);
	}
}();
//查看要修改的用户收藏信息
$("#userCollectionInfo").click(function(){
	var data = xw.getTable().getData(true);
	if (data.rows.length == 0) {
		bootbox.alert("<br><center><h4>请选择一条数据！</h4></center><br>");
		return false;
	}
	if (data.rows.length > 1) {	
		bootbox.alert("<br><center><h4>只能选择一行！</h4></center><br>");
		return false;
	}
	//console.log(data.rows[0]);
	$.each(data.rows[0], function(key,val) {
    	$("form[name='edit_user_collection_info'] input[name='"+key+"']").val(val);  	
    });
});
//工具函数
var strUtil = {
    /*
     * 判断字符串是否为空
     */
    isEmpty:function(str){
        if(str == null||str.length == 0){
            return true;
        }else{
            return false;
        }
    }
}
//表单元素验证
var validateForm = function(){
	var coinId = $('#coinId').val();
	var tradeCurrency = $('#tradeCurrency').val();
	if(strUtil.isEmpty(coinId)){
		bootbox.alert('基础币种不能为空');
		return false;
	}
	if(strUtil.isEmpty(tradeCurrency)){
		bootbox.alert('计价币种不能为空');
		return false;
	}
	$("#save_user_collection_update").attr("data-dismiss","modal");
	return true;
}

//保存修改
$("#save_user_collection_update").click(function(){
	var edit_user_collection_info = $("#edit_user_collection_info").serializeObject();
//	console.log(edit_user_collection_info);
	if(validateForm()){
		$.ajax({
			type:'POST',
			url:'/tx/use/pbucu.do',
			dataType:'json',
			contentType:'application/json; charset=utf-8',
			async:true,
			data:JSON.stringify(edit_user_collection_info),
			success:function(result){
				bootbox.alert(result.resultmsg);
	            xw.update();
			},
			error:function(){
				bootbox.alert("服务异常");
			}
		});
	}

});



