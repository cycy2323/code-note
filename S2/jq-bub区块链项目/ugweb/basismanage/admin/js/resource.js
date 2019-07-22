/**
 * Created by alex on 2017/4/23.
 */

var ResourceAction = function () {
    return {

        init: function () {
            this.reload();
        },
        reload:function(){

            $('#divtable').html('');

            var statusStr = "",interfaceTypeStr = "";
            $.map(GasSysBasic.enumStatus,function(value,key){
                statusStr +=","+key+":"+value;
            });
            statusStr = statusStr.substring(1,statusStr.length);

            $.map(GasSysBasic.enumInterfaceType,function(value,key){
                interfaceTypeStr +=","+key+":"+value;
            })
            interfaceTypeStr = interfaceTypeStr.substring(1,interfaceTypeStr.length);

            var global_remap = {
                "urlResourceType":interfaceTypeStr,
                "status":statusStr
            };

            this.xw=XWATable.init(
                {
                    divname: "divtable",
                    //----------------table的选项-------
                    pageSize:50,
                    columnPicker: true,
                    transition: 'fade',
                    exportxls: {
                        title:"URL资源管理",
                        remap:global_remap,
                        hidden:false,
                        ci:{}
                    },
                    checkboxes: true,
                    checkAllToggle:true,
                    //----------------基本restful地址---
                    restbase: 'mfsysurlresource?sort=-modifiedTime',
                    key_column: "urlResourceId",
                    //---------------行定义
                    coldefs: [
                        {
                            col:"urlResourceId",
                            friendly: "资源id",
                            unique:true,
                            hidden:false,
                            nonedit:"nosend",
                            index:1
                        },
                        {
                            col:"urlResourceName",
                            friendly:"资源名称",
                            validate:"required",
                            index:2
                        },
                        {
                            col:"urlResourcePath",
                            friendly:"资源地址",
                            validate:"required",
                            index:3
                        },
                        {
                            col:"urlResourceType",
                            friendly: "资源类型",
                            validate:"required",
                            format:GasSysBasic.InterfaceTypeFormat,
                            inputsource: "custom",
                            inputbuilder: "logTypeBuilder",
                            index:4
                        },
                        {
                            col:"urlLogOut",
                            friendly:"日志标记",
                            format:GasSysBasic.logFormat,
                            inputsource: "custom",
                            inputbuilder: "logBuilder",
                            index:5
                        },
                        {
                            col:"createdTime",
                            friendly:"创建时间",
                            format:dateFormat,
                            hidden:true,
                            nonedit:"nosend",
                            index:6
                        },
                        {
                            col:"createdBy",
                            friendly:"创建人",
                            hidden:true,
                            nonedit:"nosend",
                            index:7
                        },
                        {
                            col:"modifiedTime",
                            friendly:"变更时间",
                            format:dateFormat,
                            hidden:true,
                            nonedit:"nosend",
                            index:8
                        },
                        {
                            col:"modifiedBy",
                            friendly:"变更人",
                            hidden:true,
                            nonedit:"nosend",
                            index:9
                        },
                        {
                            col:"status",
                            format:GasSysBasic.StatusFormat,
                            inputsource: "custom",
                            inputbuilder: "statusEditBuilder",
                            validate:"required",
                            friendly:"状态",
                            index:10
                        }
                    ],

                    // 查询过滤条件
                    findFilter: function(){
                        var find_resourceId,find_resource,resourceType,status;
						if($('#find_resourceId').val()){
                            find_resourceId=RQLBuilder.like("urlResourceId",$.trim($('#find_resourceId').val()));
                        }
                        if($('#find_resource').val())
                        {
                            find_resource=RQLBuilder.like("urlResourceName",$.trim($('#find_resource').val()));
                        }
                        if($('#resourceType').val())
                        {
                            resourceType=RQLBuilder.like("urlResourceType",$.trim($('#resourceType').val()));
                        }
                         if($('#status').val())
                        {
                            status=RQLBuilder.like("status",$.trim($('#status').val()));
                        }
                        var filter=RQLBuilder.and([
                            find_resourceId,find_resource,resourceType,status
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
	var content =   "<div class='btn-group form-group'>"+
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
