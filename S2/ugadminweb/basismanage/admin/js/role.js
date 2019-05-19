var roleTypes = function(val){
    return "<select id='roleType' name='roleType' class='form-control select2me'><option value='1'>菜单角色</option><option value='2' >流程角色</option><option value='3' selected>数据角色</option></select>";
    // if(val == 1){
    //     //'角色类型：1，菜单角色，2，业务角色',3 数据,
    //     return "<select id='roleType' name='roleType' class='form-control select2me'><option value='1' selected>菜单角色</option><option value='2'>流程角色</option><option value='3'>数据角色</option></select>";
    // }else if(val == 2){
    //     return "<select id='roleType' name='roleType' class='form-control select2me'><option value='1'>菜单角色</option><option value='2' selected>流程角色</option><option value='3'>数据角色</option></select>";
    //
    // }else if(val == 3){
    //     return "<select id='roleType' name='roleType' class='form-control select2me'><option value='1'>菜单角色</option><option value='2' >流程角色</option><option value='3' selected>数据角色</option></select>";
    //
    // }
};
var xw;
var content = "<div class='btn-group form-group'>" +
    "<button id='edit_gp33' class='btn blue' data-target='#edit_gp_btn1' data-toggle='modal'> " +
    "<i class='fa fa-pencil'></i> 修改&nbsp;" +
    "</button>" +
    "</div>";
var Caozuo = function(val) {
    return content;

}();

var roleAction = function () {
    return {
        init: function () {
            this.reload();
        },
        reload: function () {

            $('#divtable').html('');

            var statusStr = "",roleTypeStr = "";
            $.map(GasSysBasic.enumStatus,function(value,key){
                statusStr +=","+key+":"+value;
            });
            statusStr = statusStr.substring(1,statusStr.length);

            $.map(GasSysBasic.enumRoleType,function(value,key){
                roleTypeStr +=","+key+":"+value;
            });
            roleTypeStr = roleTypeStr.substring(1,roleTypeStr.length);

            var global_remap = {
                "roleType":roleTypeStr,
                "status":statusStr
            };

            xw = XWATable.init(
                {
                    divname: "divtable",
                    //----------------table的选项-------
                    pageSize: 10,
                    // columnPicker: true,
                    transition: 'fade',
                    exportxls: {
                        title:"角色管理",
                        remap:global_remap,
                        hidden:false,
                        ci:{}
                    },
                    checkboxes: true,
                    checkAllToggle: true,
                    saveColumn:false,
                    //----------------基本restful地址---
                    restbase: 'ugsysrole/?sort=roleCode',
                    key_column: 'roleId',
                    coldefs: [
                        {
                            col: "roleId",
                            friendly: "角色ID",
                            unique: "true",
                            hidden: false,
                            nonedit: "nosend",
                            readonly: "readonly",
                            index: 1
                        },
                        {
                            col: "roleCode",
                            friendly: "角色编码",
                            validate:"required",
                            index: 2
                        },
                        {
                            col: "roleName",
                            friendly: "角色名称",
                            validate:"required",
                            index: 3
                        },
                        {
                            col: "roleType",
                            friendly: "角色类型",
                            format:GasSysBasic.roleTypeFormat,
                            inputsource: "custom",
                            inputbuilder: "roleTypes",
                            validate:"required",
                            index: 3
                        },
                        {
                            col: "status",
                            friendly: "角色状态",
                            inputsource: "custom",
                            inputbuilder: "statusEditBuilder",
                            validate:"required",
                            format:GasSysBasic.StatusFormat,
                            index: 5
                        },
                        {
                            col: "roleDesc",
                            friendly: "角色权限描述",
                            index: 6
                        },
                        {
                            col: "",
                            friendly: "操作",
                            format: Caozuo,
                            index: 7
                        },

                    ],
                    // 查询过滤条件
                    findFilter: function () {
                        var find_roleId,find_roleName,status,roleType;
                        if ($('#find_roleId').val()) {
                            find_roleId = RQLBuilder.equal("roleId", $.trim($('#find_roleId').val()));
                        }
                        if ($('#find_roleName').val()) {
                            find_roleName = RQLBuilder.like("roleName", $.trim($('#find_roleName').val()));
                        }
                        if ($('#status').val()) {
                            status = RQLBuilder.equal("status", $.trim($('#status').val()));
                        }
                        if ($('#roleType').val()) {
                            roleType = RQLBuilder.equal("roleType", $.trim($('#roleType').val()));
                        }
                        var filter = RQLBuilder.and([
                            find_roleId,find_roleName,status,roleType
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
					"</div>";
					// " <div class='btn-group form-group'>"+
    // 					//     "<button id='upd_button' class='btn blue' data-target='#stack1' data-toggle='modal'>"+
    // 					//         "<i class='fa fa-pencil'></i> 修改&nbsp;"+
    // 					//     "</button>"+
    // 					// "</div>";
	if(login_name=="admin"){
		$('#find').append(content);
	}
}();

/*修改*/
$(document).on('click','#edit_gp33',function() {
    $("#update_gp").show();
    $("#update_gp1").hide();
    var index = $(this).closest('tr').index();
    var data = xw.getTable().getData();

    $.each(data.rows, function(key, val) {
        /*模态框关闭后清空模态框里填写的数据*/
        $("#edit_gp_btn1").on("hidden.bs.modal", function() {
            document.getElementById("edit_form1").reset();
        });
        $("form[name='edit_form1'] input[name='" + key + "']").val(val);
    });
    /*状态*/
    $('#ugotcuserid').val(data.rows[index].roleCode);
    $('#username').val(data.rows[index].roleName);
    $('#frozenfund').val(data.rows[index].roleDesc);
    // 角色狀態
    if(data.rows[index].status == 1) {
        $("#stats option[value='" + data.rows[index].status + "']").attr('selected', 'selected');
    } else if(data.rows[index].status == 2) {
        $("#stats option[value='" + data.rows[index].status + "']").attr('selected', 'selected');
    } else if(data.rows[index].status == 3) {
        $("#stats option[value='" + data.rows[index].status + "']").attr('selected', 'selected');
    }
    /*用户类型*/
    if(data.rows[index].usertype == 1) {
        $("#usertype option[value='" + data.rows[index].usertype + "']").attr('selected', 'selected');
        /*$('#isseniorcertification').attr("disabled","disabled");*/
    } else if(data.rows[index].usertype == 2) {
        /*$('#isseniorcertification').attr("disabled","");*/
        $("#usertype option[value='" + data.rows[index].usertype + "']").attr('selected', 'selected');
    }

    // roleId
    $("#roleId").val(data.rows[index].roleId);

});

$("#update_gp").click(function() {
    $('[disabled]').attr("disabled", false);
    var edit_form1 = $("#edit_form1").serializeObject();

    $.ajax({
        type: 'PUT',
        url: "/ugrest/ugsysrole",
        dataType: 'json',
        contentType: "application/json;charset=utf-8",
        async: false,
        isMask: true,
        data: JSON.stringify(edit_form1),
        success: function() {
            bootbox.alert("修改成功");
            xw.update();
        },
        error: function() {
            bootbox.alert("修改失败");
            xw.update();
        }
    });

});


