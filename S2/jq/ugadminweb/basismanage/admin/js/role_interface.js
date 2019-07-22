
var GET,POST,PUT,DELETE,xw;
var method = function(val){
    return "<select id='urlMethod' name='urlMethod' class='form-control select2me'>" +
        "<option value=''></option>" +
        "<option value='GET'>GET</option>" +
        "<option value='PUT'>PUT</option>" +
        "<option value='POST'>POST</option>" +
        "<option value='DELETE'>DELETE</option>" +
        "<option value='GET,PUT'>GET,PUT</option>" +
        "<option value='POST,GET'>POST,GET</option>" +
        "<option value='POST,PUT'>POST,PUT</option>" +
        "<option value='GET,DELETE'>GET,DELETE</option>" +
        "<option value='DELETE,PUT'>DELETE,PUT</option>" +
        "<option value='POST,DELETE'>POST,DELETE</option>" +
        "<option value='POST,GET,PUT'>POST,GET,PUT</option>" +
        "<option value='GET,PUT,DELETE'>GET,PUT,DELETE</option>" +
        "<option value='POST,GET,DELETE'>POST,GET,DELETE</option>" +
        "<option value='POST,PUT,DELETE'>POST,PUT,DELETE</option>" +
        "<option value='POST,GET,PUT,DELETE'>POST,GET,PUT,DELETE</option>" +
        "</select>";
};
var urlResourceHelper=RefHelper.create({
    ref_url:"ugsysurlresource",
    ref_col:"urlResourceId",
    ref_display:"urlResourceName",
});
var roleHelper=RefHelper.create({
    ref_url:"ugsysrole",
    ref_col:"roleId",
    ref_display:"roleName",
});
var urlResourceFormat=function(){
    return {
        f: function(val){
            return urlResourceHelper.getDisplay(val);
        },
    }
}();
var roleFormat=function(){
    return {
        f: function(val){
            return roleHelper.getDisplay(val);
        },
    }
}();

var content = "<div class='btn-group form-group'>" +
    "<button id='update_btn' class='btn blue' data-target='#edit_gp_btn1' data-toggle='modal'> " +
    "<i class='fa fa-pencil'></i> 修改&nbsp;" +
    "</button>" +
    "</div>";
var Caozuo = function(val) {
    return content;

}();

var roleAction = function () {
    return {
        init: function () {
            $.map(roleHelper.getData(), function (value, key) {
                $('#find_role').append('<option value="' + key + '">' + value + '</option>');
            });
            this.reload();
        },
        reload: function () {

            $('#divtable').html('');

            xw=XWATable.init(
                {
                    divname: "divtable",
                    //----------------table的选项-------
                    pageSize:50,
                    // columnPicker: true,
                    saveColumn: false,
                    transition: 'fade',
                    checkboxes: true,
                    checkAllToggle:true,
                    //----------------基本restful地址---
                    restbase: 'ugsysroleurlresource',
                    key_column:'roleUrlResourceId',
                    coldefs:[
                        {
                            col:"roleUrlResourceId",
                            friendly:"ID",
                            unique:"true",
                            hidden:true,
                            //readonly:"readonly",
                            nonedit:"nosend",
                            index:1
                        },
                        {
                            col:"roleId",
                            friendly:"角色名称",
                            format:roleFormat,
                            validate:"required",
                            inputsource: "select",
                            ref_url:  "ugsysrole",
                            ref_name: "roleName",
                            ref_value: "roleId",
                            index:2
                        },
                        {
                            col:"urlResourceId",
                            friendly:"资源名称",
                            validate:"required",
                            format:urlResourceFormat,
                            inputsource: "select",
                            ref_url:  "ugsysurlresource",
                            ref_name: "urlResourceName",
                            ref_value: "urlResourceId",
                            index:3
                        },
                        {
                            col:"urlMethod",
                            friendly:"请求方法",
                            inputsource: "custom",
                            inputbuilder: "method",
                            validate:"required",
                            index:4
                        },
                        {
                            col:"createdTime",
                            friendly:"创建时间",
                            hidden:true,
                            format:dateFormat,
                            nonedit:"nosend",
                            index:5
                        },
                        {
                            col:"createdBy",
                            friendly:"创建人",
                            hidden:true,
                            nonedit:"nosend",
                            index:6
                        },
                        {
                            col:"modifiedTime",
                            friendly:"变更时间",
                            hidden:true,
                            format:dateFormat,
                            nonedit:"nosend",
                            index:7
                        },
                        {
                            col:"modifiedBy",
                            friendly:"变更人",
                            hidden:true,
                            nonedit:"nosend",
                            index:8
                        },
                        {
                            col:"status",
                            friendly:"状态",
                            validate:"required",
                            format:GasSysBasic.StatusFormat,
                            inputsource: "custom",
                            inputbuilder: "statusEditBuilder",
                            index:9
                        },
                        {
                            col:"",
                            friendly:"操作",
                            format:Caozuo,
                            index:10
                        }

                    ],
                    // 查询过滤条件
                    findFilter: function () {
                        var find_roleName;
                        if ($('#find_role').val()) {
                            find_roleName = RQLBuilder.like("roleId", $.trim($('#find_role').val()));
                        }
                        var filter = RQLBuilder.and([
                            find_roleName
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
	                "</div>";
	                // " <div class='btn-group form-group'>"+
	                //     "<button id='upd_button' class='btn blue' data-target='#stack1' data-toggle='modal'>"+
	                //         "<i class='fa fa-pencil'></i> 修改&nbsp;"+
	                //     "</button>"+
	                // "</div>";
	if(login_name=="admin"){
		$('#find').append(content);
	}
}();

$(document).on('click','#update_btn',function() {
    var index = $(this).closest('tr').index();
    var data = xw.getTable().getData();
    $.each(data.rows, function(key, val) {
        /*模态框关闭后清空模态框里填写的数据*/
        $("#edit_gp_btn1").on("hidden.bs.modal", function() {
            document.getElementById("edit_form1").reset();
        });
        $("form[name='edit_form1'] input[name='" + key + "']").val(val);
        // $('#menuParent').append('<option>'+ data.rows.parentMenuId +'</option>')
    });
    $('#userName').html('');
    $('#resourceName').html('');

    $('#reMethod').val(data.rows[index].urlMethod);
    $('#stats').val(data.rows[index].status);
    $('#roleUrlResourceId').val(data.rows[index].roleUrlResourceId);

    var urlResourceId = data.rows[index].urlResourceId;
    var roleId = data.rows[index].roleId;
    $.ajax({
        url: 'ugrest/ugsysrole?fields={"roleName": 1,"roleId": 1}',
        type: 'GET',
        dataType: 'json',
        contentType: "application/json;charset=utf-8",
        async: false,
        isMask: true,
        success: function(data) {
            $.each(data,function (index,val) {
                if (val.roleId == roleId){
                    $('#userName').append('<option value="'+val.roleId+'" selected>' + val.roleName + '</option>');
                }else {
                    $('#userName').append('<option value="'+val.roleId+'">' + val.roleName + '</option>');
                }

            })
        }
    });
    $.ajax({
        url: 'ugrest/ugsysurlresource?fields={"urlResourceName": 1,"urlResourceId": 1}',
        type: 'GET',
        dataType: 'json',
        contentType: "application/json;charset=utf-8",
        async: false,
        isMask: true,
        success: function(data) {
            $.each(data,function (index,val) {
                if(val.urlResourceId == urlResourceId){
                    $('#resourceName').append('<option value="'+val.urlResourceId+'" selected>' + val.urlResourceName + '</option>');
                }else{
                    $('#resourceName').append('<option value="'+val.urlResourceId+'">' + val.urlResourceName + '</option>');
                }
            })
        }
    })
});

$("#update_gp").click(function() {
    $('[disabled]').attr("disabled", false);
    var edit_form1 = $("#edit_form1").serializeObject();
    $.ajax({
        type: 'PUT',
        url: "/ugrest/ugsysroleurlresource/",
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
