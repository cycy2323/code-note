var isVali = function (val) {
	return {
        f: function (val) {
        	if(val==0){
            	return "启用";
		    }else if(val==1){
		    	return "停用"
		    }else{
		    	return "-";
		    }
        },
    }
}();
var UserLevelInfoAction = function () {
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
                    restbase: 'txtpsuserlevel',
                    key_column: 'txTpsUserLevelId',
                    coldefs: [
                        {
                            col: "txTpsUserLevelId",
                            friendly: "ID",
                            unique: "true",
                            hidden: true,
                            nonedit: "nosend",
                            readonly: "readonly",
                            index: 1
                        },
                        {
                            col: "levelName",
                            friendly: "用户等级名称",
                            validate:"required",
                            index: 2
                        },
                        {
                            col: "brokerage",
                            friendly: "手续费比率，单位为%",
                            validate:"required",
                            index: 3
                        },
                        {
                            col: "status",
                            friendly: "状态",
                            validate:"required",
                            format: isVali,
                            index: 4
                        },
                        {
                            col: "createdTime",
                            friendly: "创建时间",
                            validate:"required",
                            
                            index: 5
                        },
                        {
                            col: "modifiedTime",
                            friendly: "变更时间",
                            index: 6
                        }
                        

                    ],
                    // 查询过滤条件
                    findFilter: function () {
                        var find_email,find_mobile;
                        if ($('#find_levelName').val()) {
                            find_email = RQLBuilder.like("levelName", $.trim($('#find_levelName').val()));
                        }
                        if ($('#find_status').val()) {
                            find_mobile = RQLBuilder.like("status", $.trim($('#find_status').val()));
                        }
                        var filter = RQLBuilder.and([
                            find_email,find_mobile
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
	                    "<button id='add_button' class='btn green' data-target='#stack1' data-toggle='modal'>"+
	                        "<i class='fa fa-plus'></i> 添加&nbsp;"+
	                    "</button>"+
	                "</div>"+
	                " <div class='btn-group form-group'>"+
	                    "<button id='upd_button' class='btn blue' data-target='#stack1' data-toggle='modal'>"+
	                        "<i class='fa fa-pencil'></i> 修改&nbsp;"+
	                    "</button>"+
	                "</div>";
	if(login_name=="admin"){
		$('#find').append(content);
	}
}();

