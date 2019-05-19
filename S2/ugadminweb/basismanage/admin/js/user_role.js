var xw;
var content = "<div class='btn-group form-group'>" +
    "<button id='edit_gp333' class='btn blue' data-target='#edit_gp_btn1' data-toggle='modal'> " +
    "<i class='fa fa-pencil'></i> 修改&nbsp;" +
    "</button>" +
    "</div>";
var Caozuo = function(val) {
    return content;

}();

var UserRoleAction = function () {

    var roleHelper = RefHelper.create({
        ref_url: "ugsysrole",
        ref_col: "roleId",
        ref_display: "roleName"
    });
    var userHelper = RefHelper.create({
        ref_url: "ugsysuser",
        ref_col: "userId",
        ref_display: "employeeName"
    });
    var userFormat=function () {
        return {
            f: function (val) {
                return userHelper.getDisplay(val);
            }
        }
    }();
    var roleFormat=function () {
        return {
            f: function (val) {
                return roleHelper.getDisplay(val);
            }
        }
    }();


    return {

        init: function () {
            // 顺序有影响 (先抓选单, 再抓暂存选单, 再执行其他)
            this.initHelper();
            this.reload();
        },

        initHelper: function () {
            // 分公司 select init
            $.map(userHelper.getData(), function (value, key) {
                $('#find_userId').append('<option value="' + key + '">' + value + '</option>');
            });

        },

        reload:function(){

            $('#divtable').html('');
            xw=XWATable.init(
                {
                    divname: "divtable",
                    //----------------table的选项-------
                    pageSize:  10,
                    // columnPicker: true,
                    transition: 'fade',
                    checkboxes: true,
                    checkAllToggle:true,
                    saveColumn:false,
                    //----------------基本restful地址---
                    restbase: 'ugsysuserrole?sort=-createdTime',
                    key_column:'userRoleId',
                    coldefs:[
                        {
                            col:"userRoleId",
                            friendly:"用户与角色关系ID",
                            unique:"true",
                            hidden:true,
                            readonly:"readonly",
                            nonedit:"nosend",
                            index:1
                        },
                        {
                            col:"userId",
                            friendly:"用户",
                            inputsource: "select",
                            validate:"required",
                            format:userFormat,
                            ref_url:  "ugsysuser",
                            ref_name: "employeeName",
                            ref_value: "userId",
                            index:2
                        },

                        {
                            col:"roleId",
                            friendly:"角色",
                            format:roleFormat,
                            validate:"required",
                            inputsource: "select",
                            ref_url:  "ugsysrole",
                            ref_name: "roleName",
                            ref_value: "roleId",
                            index:3
                        },
                        {
                            col:"status",
                            friendly:"状态",
                            validate:"required",
                            index:4,
                            format:GasSysBasic.StatusFormat,
                            inputsource: "custom",
                            inputbuilder: "statusEditBuilder"
                        },
                        {
                            col:"createdTime",
                            friendly:"创建时间",
                            format:dateFormat,
                            readonly:"readonly",
                            hidden:true,
                            nonedit:"nosend",
                            index:5
                        },
                        {
                            col:"createdBy",
                            friendly:"创建人",
                            readonly:"readonly",
                            hidden:true,
                            nonedit:"nosend",
                            index:6
                        },
                        {
                            col:"modifiedTime",
                            friendly:"变更时间",
                            format:dateFormat,
                            readonly:"readonly",
                            hidden:true,
                            nonedit:"nosend",
                            index:7
                        },
                        {
                            col:"modifiedBy",
                            friendly:"变更人",
                            readonly:"readonly",
                            hidden:true,
                            nonedit:"nosend",
                            index:8
                        },
                        {
                            col:"hello",
                            friendly:"操作",
                            format:Caozuo,
                            index:9
                        }

                    ],
                    // 查询过滤条件
                    findFilter: function(){
                        var find_userId ;

                        if($('#find_userId option:selected').val())
                        {
                            find_userId=RQLBuilder.equal("userId",$('#find_userId  option:selected').val());
                        }

                        var filter=RQLBuilder.and([
                            find_userId
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
					"</div>" ;
					// " <div class='btn-group form-group'>"+
					//     "<button id='upd_button' class='btn blue' data-target='#stack1' data-toggle='modal'>"+
					//         "<i class='fa fa-pencil'></i> 修改&nbsp;"+
					//     "</button>"+
					// "</div>";
	if(login_name=="admin"){
		$('#find').append(content);
	}
}();
// 修改
$(document).on('click','#edit_gp333',function () {
     var index = $(this).closest('tr').index();
     var data = xw.getTable().getData();
     var currentUserRole = data.rows[index];
     console.log(currentUserRole);
    var r = JSON.stringify({"roleId":1,"roleName":1});
    var u = JSON.stringify({"userId":1,"employeeName":1});
    $("#edit_gp_btn1").on("hidden.bs.modal", function() {
        document.getElementById("edit_form1").reset();
    });
    $("#roleId").html('');
    $("#userID").html('');
    $.each(data.rows, function (key,val) {
        $("form[name='edit_form1'] input[name='" + key + "']").val(val);
    });
    $.ajax({
        type: 'GET',
        url: 'ugrest/ugsysrole?fields='+ r,
        dateType:"json",
        success: function (data) {
            data.forEach(index => {
                if(index.roleId == currentUserRole.roleId){
                    $('#roleId').append('<option value='+index.roleId+' selected>' + index.roleName + '</option>');
                }else{
                    $('#roleId').append('<option value='+index.roleId+'>' + index.roleName + '</option>');
                }


            });
        }
    });
    $.ajax({
        type: 'GET',
        url: 'ugrest/ugsysuser?fields'+ u,
        dateType:"json",
        success: function (data) {
            data.forEach(index => {
                if(index.userId == currentUserRole.userId){
                    $('#userID').append('<option value='+index.userId+' selected>' + index.employeeName + '</option>')
                } else {
                    $('#userID').append('<option value='+index.userId+'>' + index.employeeName + '</option>');
                }
            });
        }
    });

    /*角色用户状态*/
    $("#isauthentication option[value='"+data.rows[index].status+"']").attr('selected', 'selected');
    /*用户角色id userRoleId*/
    $("#userRoleId").val(data.rows[index].userRoleId);

    /*模态框关闭后清空模态框里填写的数据*/
    // $("#edit_gp_btn1").on("hidden.bs.modal", function() {
    //     document.getElementById("edit_form1").reset();
    // });


});

$("#update_gp1").click(function() {
    $('[disabled]').attr("disabled", false);
    var edit_form1 = $("#edit_form1").serializeObject();

    $.ajax({
        type: 'POST',
        url: "/ugrest/ugsysuserrole/admin?",
        dataType: 'json',
        contentType: "application/json;charset=utf-8",
        async: false,
        isMask: true,
        data: JSON.stringify(edit_form1),
        success: function(data) {
            if (data.success){
                bootbox.alert("修改成功");
            }else {
                bootbox.alert("修改失败，"+data.description);
            }

            xw.update();
        },
        error: function() {
            bootbox.alert("修改失败");
            xw.update();
        }
    });

});

