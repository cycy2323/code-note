var xw ;


var UserAction = function () {
    return {
        init: function () {
            this.reload();
        },
        reload:function(){
            var useridFormat = function () {
                return {
                    f: function (val,row) {
                        if(row.status == '1'){
                            return "<a id='passWord' style='cursor:pointer' data-target='#input_many_modal' data-toggle='modal' data-id='"+row.userId+"'>重置密码</a>";
                        }else{
                            return " ";
                        }
                    }
                }
            }();
            var useridCheckFormat = function () {
                return {
                    f: function (val,row) {
                        if(row.flag == '0'){
                            return "<a id='checkPassWord' style='cursor:pointer' data-target='#input_many_modal2' data-toggle='modal' data-id='"+row.userId+"'>查看密码</a>";
                        }else{
                            return " ";
                        }
                    }
                }
            }();
            var caozuoFormat = function () {
                return {
                    f: function (val,row) {
                        return  "<a id='modifyUser' class=\"btn blue\" style='cursor:pointer' data-target='#edit_gp_btn_user' data-toggle='modal' data-id='"+row.userId+"'>修改</a>" +
                            "<a id='deleteUser' class=\"btn red\" style='cursor:pointer' data-target='#delete_modal' data-toggle='modal' data-id='"+row.userId+"'>删除</a>";
                    }
                }
            }();

            xw = XWATable.init({
                divname: "divtable",
                pageSize: 10,
                transition: 'fade',
                checkboxes: false,
                checkAllToggle: true,
                saveColumn:false,
                restURL: '/mf/use/pbupg.do?bd={"state":"1"}',
                coldefs: [
                    {
                        col:"userId",
                        friendly:"用户ID",
                        unique:"true",
                        hidden:"hidden",
                        nonedit:"nosend",
                        index:1
                    },
                    {
                        col:"employeeName",
                        friendly:"员工姓名",
                        validate:"required",
                        index:3
                    },
                    {
                        col:"loginName",
                        friendly:"登录用户名",
                        validate:"required",
                        index:8
                    },
                    {
                        col:"email",
                        friendly:"邮箱",
                        index:12
                    },
                    {
                        col:"status",
                        friendly:"状态",
                        format:GasSysBasic.StatusFormat,
                        inputsource: "custom",
                        inputbuilder: "statusEditBuilder",
                        index:15
                    },
                    // {
                    //     col:"checkPwd",
                    //     friendly:"初始密码",
                    //     format:useridCheckFormat,
                    //     index:16
                    // },
                    {
                        col:"updatePwd",
                        friendly:"重置密码",
                        format:useridFormat,
                        index:17
                    },
                    {
                        col:"caozuo",
                        friendly:"操作",
                        format:caozuoFormat,
                        index:19
                    }

                ],
                // 查询过滤条件
                findFilter: function() {
                    var employeeName,loginName,status,state;
                    if($.trim($("#find_username").val())){$.trim()
                        employeeName =RQLBuilder.equal("employeeName",$.trim($("#find_username").val()));
                    }
                    if($.trim($("#find_loginname").val())){
                        loginName =RQLBuilder.equal("loginName",$.trim($("#find_loginname").val()));
                    }
                    if($('#status1 option:selected').val()) {
                        status = RQLBuilder.equal("status", $('#status1  option:selected').val());
                    }

                    if(employeeName==undefined){
                        employeeName = '"employeeName":""';
                    }
                    if(loginName==undefined){
                        loginName = '"loginName":""';
                    }if(status==undefined){
                        status = '"status":""';
                    }
                    state = '"state":"1"';
                    var filter = RQLBuilder.and([
                        employeeName,loginName,status,state
                    ]);
                    xw.setRestURL("/mf/use/pbupg.do?bd={"+employeeName+','+loginName+','+status+','+state+"}");
                    return filter.rql();
                }
            });
        }
    }
}();

$(document).on("click","#passWord",function(){
    $(".modal-body").find("#prefix_860037789915").remove()
    $("#userId").val($(this).attr("data-id"));
    $("#passwords").val();
});

$(document).on("click","#checkPassWord",function(){
    $("#textName").html("谷歌验证码:");
    $("#userId1").val($(this).attr("data-id"));
    $("#googlecode").attr("readonly",false);
    $("#confirm1").show();
    $("#close").val("取消");
    $("#input_many_modal2").on("hidden.bs.modal", function() {
        document.getElementById("edit_form2").reset();
    });
});
$(document).on('click',"#confirm1",function(){
    var userid = $("#userId1").val();
    var googlecode = $("#googlecode").val();
    if(!(/^[0-9]{6}$/.test(googlecode))){
        bootbox.alert("谷歌验证码不正确!");
        return;
    }
    var form = {};
    form["userid"] = userid;
    form["googlecode"] = googlecode;
    $.ajax({
        type: 'POST',
        url: "/mf/mer/pbsml.do",
        dataType: 'json',
        contentType: "application/json;charset=utf-8",
        async: false,
        isMask: true,
        data: JSON.stringify(form),
        success: function(data) {
            if(data.err_code==1){
                $("#textName").html("初始密码:");
                $("#googlecode").val(data.password);
                $("#googlecode").attr("readonly","readonly");
                $("#confirm1").hide();
                $("#close").val("关闭");
            }else {
                bootbox.alert(data.msg,function(){
                    location.reload();
                })
            }
        },
        error: function(err) {
            if(err.status==406||err.status==401){
                bootbox.alert("登录超时!", function() {
                    window.location.replace("/login.html");
                });
            }else{
                bootbox.alert("服务器繁忙,请稍后再试", function() {
                    location.reload();
                });
            }
        }
    });
});
$(document).on('click',"#confirm",function(){
    $("#input_many_modal").modal('hide');  //手动关闭
    var userId = $("#userId").val();
    var password = $.md5('填充接口用');
    var form = {};
    form["password"] = password;
    $.ajax({
        url:hzq_rest + "mfsysuser/"+userId,
        headers:{
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        type:"PUT",
        dateType:"json",
        data:JSON.stringify(form),
        success:function(data){
            if(data.success){
                bootbox.alert("密码修改成功",function(){
                    $("#userId").val("");
                    location.reload();
                })
            }else {
                bootbox.alert("密码修改失败。")
            }
        }
        ,error: function(err) {
            if(err.status==406||err.status==401){
                window.location.replace("/login.html");
            }else{
                bootbox.alert("服务器繁忙,请稍后再试", function() {
                    location.reload();
                });
            }
        }
    })
});

$(document).on("click","#upd_button",function(){
    $("#dg_checkPwd").hide();
    $("#dg_userId_op").hide();
});

$("#edit_gp_btn_user").on("hidden.bs.modal", function() {
    document.getElementById("edit_form").reset();

});
$(document).on('click',"#add_button_new",function(){
    $("#status").val("0");
    $("#titleName").html('添加员工');
    var form = {};
    form["state"] = 3;
    $.ajax({
        type: 'POST',
        url: "/mf/use/pbupg.do",
        dataType: 'json',
        contentType: "application/json;charset=utf-8",
        async: false,
        isMask: true,
        data: JSON.stringify(form),
        success: function(data) {
            if(data.error_code==1){
                $("#role").html('');
                if(data.role!=undefined){
                    $("#add_button_relay").click();
                    var roleSelect='<option value="">请选择</option>';
                    data.role.forEach(vo=>{
                        roleSelect+= '<option value="'+vo.roleId+'">'+vo.roleName+'</option>'
                    });
                    $("#role").html(roleSelect);
                }else{
                    bootbox.alert("请先创建角色!");
                }
            }else {
                bootbox.alert(data.msg,function(){
                    location.reload();
                })
            }
        },
        error: function(err) {
            if(err.status==406||err.status==401){
                bootbox.alert("登录超时!", function() {
                    window.location.replace("/login.html");
                });
            }else{
                bootbox.alert("服务器繁忙,请稍后再试", function() {
                    location.reload();
                });
            }
        }
    });
});


$(document).on('click',"#modifyUser",function(){//修改
    $("#modifyUserId").val($(this).attr("data-id"));
    var index = $(this).closest('tr').index();
    var data = xw.getTable().getData();
    $("#titleName").html('修改用户');
    $("input[name='employeeName']").val(data.rows[index].employeeName);
    $("input[name='loginName']").val(data.rows[index].loginName);
    $("input[name='email']").val(data.rows[index].email);

    $("#status option[value='" + data.rows[index].status + "']").attr('selected', 'selected');



    var form = {};
    form["state"] = 3;
    $.ajax({
        type: 'POST',
        url: "/mf/use/pbupg.do",
        dataType: 'json',
        contentType: "application/json;charset=utf-8",
        async: false,
        isMask: true,
        data: JSON.stringify(form),
        success: function(data) {
            if(data.error_code==1){
                $("#role").html('');
                var roleSelect='<option value="">请选择</option>';
                data.role && data.role.forEach(vo=>{
                    roleSelect+= '<option value="'+vo.roleId+'">'+vo.roleName+'</option>'
                });
                $("#role").html(roleSelect);
                $("#role option[value='" + xw.getTable().getData().rows[index].role + "']").attr('selected', 'selected');
            }else {
                bootbox.alert(data.msg,function(){
                    location.reload();
                })
            }

        },
        error: function(err) {
            if(err.status==406||err.status==401){
                bootbox.alert("登录超时!", function() {
                    window.location.replace("/login.html");
                });
            }else{
                bootbox.alert("服务器繁忙,请稍后再试", function() {
                    location.reload();
                });
            }
        }
    });
});
$(document).on('click',"#update_gp",function(){//保存
    var edit_form = $("#edit_form").serializeObject();
    var  employeeName= edit_form.employeeName;//员工姓名
    var  loginName= edit_form.loginName;//登录用户名
    var  email= edit_form.email;//邮箱
    var  status= edit_form.status;//状态
    var  role= edit_form.role;//角色
    var  userId= edit_form.modifyUserId;//userId
    if(!(/^[\u4e00-\u9fa5]{2,6}$/.test(employeeName))){
        bootbox.alert("员工姓名应为2-6位汉字");
        return;
    }
    if(!(/^[a-zA-Z][a-zA-Z0-9]{5,21}$/.test(loginName))){
        bootbox.alert("登录名格式应为:以字母开头在6-20之间,只能包含字母数字");
        return;
    }
    if(!(/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(email))){
        bootbox.alert("邮箱格式不正确");
        return;
    }
    if(status==""||status==null){
        bootbox.alert("请选择状态!");
        return;
    }
    if(role==""||role==null){
        bootbox.alert("请选择角色!");
        return;
    }
    var form = {};
    form["state"] = 2;//识别接口
    form["loginName"] = loginName;
    form["email"] = email;
    form["employeeName"] = employeeName;
    form["userType"] = role;
    form["status"] = status;
    form["userId"] = userId;
    $.ajax({
        type: 'POST',
        url: "/mf/use/pbupg.do",
        dataType: 'json',
        contentType: "application/json;charset=utf-8",
        async: false,
        isMask: true,
        data: JSON.stringify(form),
        success: function(data) {
            if(data.error_code===1){
                bootbox.alert(data.msg,function(){
                    location.reload();
                })
            }else {
                bootbox.alert(data.msg,function(){
                    location.reload();
                })
            }
        },
        error: function(err) {
            if(err.status==406||err.status==401){
                bootbox.alert("登录超时!", function() {
                    window.location.replace("/login.html");
                });
            }else{
                bootbox.alert("服务器繁忙,请稍后再试", function() {
                    location.reload();
                });
            }
        }
    });
});

$(document).on('click',"#deleteUser",function(){
    $("#deleteId").val($(this).attr("data-id"));
});

$(document).on('click',"#confirm_delete",function(){
    var form = {};
    form["userId"] = $("#deleteId").val();
    form["state"] = 4;
    $('#delete_modal').modal('hide')
    $.ajax({
        type: 'POST',
        url: "/mf/use/pbupg.do",
        dataType: 'json',
        contentType: "application/json;charset=utf-8",
        async: false,
        isMask: true,
        data: JSON.stringify(form),
        success: function(data) {
            if(data.errorCode==1){
                bootbox.alert(data.msg,function(){
                    location.reload();
                });
            }else {
                bootbox.alert(data.msg,function(){
                    location.reload();
                });
            }
        },
        error: function(err) {
            if(err.status==406||err.status==401){
                bootbox.alert("登录超时!", function() {
                    window.location.replace("/login.html");
                });
            }else{
                bootbox.alert("服务器繁忙,请稍后再试", function() {
                    location.reload();
                });
            }
        }
    });
});



























//回显
/*var huixian;

$(document).on("click","#userRole",function(){
    $("#menuRole").html("")
    $("#spRole").html("")

    var userid = $(this).attr("data-id");
    var user = Restful.getByID(hzq_rest+"mfsysuser",userid);
    $("#userName").val(user.employeeName)
    $("#userName").attr("userId",userid);
    var bd={
        "cols":"*",
        "froms":"tx_sys_role",
        "wheres":"1=1 order by roleCode asc",
        "page":false
    }

    $.ajax({
        type: 'get',
        url: hzq_rest+'mfsysuserrole/?query={"userId":"'+userid+'"}',
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        async: false,
        success: function(data) {
            huixian = data;
            $.each(data,function(index,item){
                $(".checkRoleMenu input[id='"+item.roleId+"']").attr("checked",true);
            })
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

})*/

/*
$("#find_fresh").on("click",function(){
    $(".checkRoleMenu input").attr("checked",false);
    $.each(huixian,function(index,item){
        $(".checkRoleMenu input[id='"+item.roleId+"']").attr("checked",true);
    })
})
*/


/*$(document).on("click","#rule_submit",function(){
    var userId = $("#userName").attr("userId");
    var roleId =[];
    var input = $(".checkRoleMenu input[name='rolemenu']:checked");
    $.each(input,function(index,item){
        roleId.push($(item).attr("id"))
    })
    $.ajax({
        type: 'get',
        url: hzq_rest+'mfsysuserrole/?query={"userId":"'+userId+'"}',
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        async: false,
        success: function(data) {
            $.each(data,function(index,item){
                Restful.delByIDR( hzq_rest + "mfsysuserrole",item.userRoleId)
            })
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
});*/
$('#mrd_del_btm').on('click',function(e){
    var selrows = xw.getTable().getData(true);
    if (selrows.rows.length == 0) {
        bootbox.alert("<br><center><h4>请选择需要删除的行</h4></center><br>");
        return;
    }
    var batchids=new Array();
    $.each(selrows.rows,function(idx,row){
        if(row.status!='3')
        {
            batchids.push(row.userId);
        }else{
            bootbox.alert("<center><h4>该人员已经是删除状态。</h4></center>")
            return false;
        }
    })
    if(batchids.length==selrows.rows.length){
        var box = bootbox.confirm({
            // title: "删除未抄表记录",
            buttons: {
                confirm: {
                    label: '确认',
                    className: 'blue'
                },
                cancel: {
                    label: '取消',
                    className: 'btn-default'
                }
            },
            message: "<br><center><h4>确定删除选择（" + selrows.rows.length + "）条记录吗？</h4></center><br>",
            callback: function (result) {
                if(result){

                    var result = Restful.updateRNQ(hzq_rest+"mfsysuser", batchids.join(','),{status:'3',"modifiedTime":new Date(moment().format("YYYY-MM-DD HH:mm:ss")+"-00:00"),"modifiedBy":JSON.parse(localStorage.getItem("user_info")).userId})
                    if(result&&result.success){
                        bootbox.alert("<br><center><h4>删除成功：共删除("+result.retObj+")条</h4></center><br>");
                        xw.update();
                    }else{
                        bootbox.alert("<br><center><h4>删除失败。</h4></center><br>")
                    }
                }
            }
        });
    }
});
