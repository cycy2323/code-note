var xw ;

var content = "<div class='btn-group form-group'>" +
    "<button id='edit_gp3' class='btn blue' data-target='#edit_gp_btn1' data-toggle='modal'> " +
    "<i class='fa fa-pencil'></i> 修改&nbsp;" +
    "</button>" +
    "</div>";
var Caozuo = function(val) {
    return content;

}();
var UserAction = function () {
//  // 网点helper
//  var chargeUnitHelper=RefHelper.create({
//      ref_url:"gasbizchargeunit",
//      ref_col:"chargeUnitId",
//      ref_display:"chargeUnitName"
//  });
//  var areaFormat=function(){
//      return {
//          f: function(val){
//              return areaHelper.getDisplay(val);
//          }
//      }
//  }();
    var passwordFormat = function () {
        return {
            f: function (val) {
                if(val.length!=8){
                    val="已登录,初始密码失效";
                }
                return  val;
                //  return userHelper.getDisplay(val);
            }
        }
    }();
    return {

        init: function () {
            this.reload();
        },

        reload:function(){
            var loginarea = [];

            var useridFormat = function () {
                return {
                    f: function (val,row) {
                        if(row.status == '1'){
                            return "<a id='passWord'  class='btn green check'  data-target='#input_many_modal' data-toggle='modal' data-id='"+row.userId+"'>重置</a>";
                        }else{
                            return " ";
                        }
                    }
                }
            }();
            var googlesecretbutton = function () {
                return {
                    f: function (val,row) {
                        if(row.status == '1'){
                            return "<a id='googlesecret'  class='btn green check'  data-target='#input_google_modal' data-toggle='modal' data-id='"+row.userId+"'>查看</a>";
                        }else{
                            return " ";
                        }
                    }
                }
            }();

            $('#divtable').html('');
            var queryCondion = RQLBuilder.and([
               /* RQLBuilder.equal("status","1"),*/
            ]).rql();

            xw=XWATable.init(
                {
                    divname: "divtable",
                    //----------------table的选项-------
                    pageSize:10,
                    //columnPicker: true,
                    transition: 'fade',
                    checkboxes: true,
                    checkAllToggle:true,
                    saveColumn:false,
                    sortable: true,      //是否启用排序
                    // sortOrder: "ID asc",
                    // sortable: true,
                    //----------------基本restful地址---
                    restURL: 'ug/use/pbqup.do?bd={}',
                    key_column:'userId',
                    // exportxls:{
                    //     title:"工作人员列表"
                    // },
//                  exportxls: {
//                      title:"工作人员列表",
//                      remap:global_remap,
//                      hidden:false,
//                      ci:{}
//                  },
                    coldefs:[
                        {
                            col:"userId",
                            friendly:"用户ID",
                            unique:"true",
                            hidden:"hidden",
                            nonedit:"nosend",
                            index:1
                        },
                        // {
                        //     col:"employeeCode",
                        //     friendly:"工作人员代码",
                        //     validate:"required",
                        //     index:2
                        // },
                        {
                            col:"employeeName",
                            friendly:"工作人员姓名",
                            validate:"required",
                            index:3
                        },
                        {
                            col:"loginName",
                            friendly:"登录用户名",
                            validate:"required",
                            index:8
                        },
                        // {
                        //     col:"password",
                        //     friendly:"密码",
                        //     format: passwordFormat,
                        //     index:9
                        // },
                        // {
                        //     col:"tel",
                        //     friendly:"电话",
                        //     hidden:true,
                        //     index:10
                        // },

                        {
                            col:"mobile",
                            friendly:"用户手机",
                            hidden:true,
                            index:11
                        },
                        {
                            col:"email",
                            friendly:"邮箱",
                            hidden:true,
                            index:12
                        },
                        // {
                        //     col:"address",
                        //     friendly:"用户办公地址",
                        //     hidden:true,
                        //     index:13
                        // },
                        {
                            col:"isLogin",
                            friendly:"是否可登录",
                            format:GasSysBasic.IsOrNoFormat,
                            inputsource: "custom",
                            inputbuilder: "isLoginBuilder",
                            validate:"required",
                            // hidden:true,
                            index:14
                        },
                        {
                            col:"remark",
                            friendly:"备注",
                            hidden:true,
                            index:15
                        },
                        {
                            col:"status",
                            friendly:"状态",
                            format:GasSysBasic.StatusFormat,
                            inputsource: "custom",
                            inputbuilder: "statusEditBuilder",
                            hidden:false,
                            index:15
                        },
                        // {
                        //    friendly:"谷歌标识码",
                        //    format:googlesecretbutton,
                        //    index:16
                        //},
                        {
                            col:"userId_op",
                            friendly:"登录密码",
                            nonedit:"nosend",
                            format:useridFormat,
                            index:17
                        },
                        {
                            col:"",
                            friendly:"操作",
                            format:Caozuo,
                            index:18
                        }

                    ],

                    // 查询过滤条件
                    findFilter: function(){
                        if($("#status").val() == "3"){
                            $("#mrd_del_btm").hide()
                        }else{
                            $("#mrd_del_btm").show()
                        }
                        var findbd = {};
                        var find_username,status,find_loginname,is_login;

                        if($('#find_username').val())
                        {
                            findbd.userName=$('#find_username').val();
                        }
                        if($('#is_login').val())
                        {
                            findbd.isLogin=$('#is_login').val();
                        }
                        if($('#find_loginname').val())
                        {
                            findbd.loginName=$('#find_loginname').val();
                        }
                        if($("#status").val()){
                            findbd.status =$("#status").val();
                        }else{
                            // status =RQLBuilder.equal("status","1");
                        }
                        xw.setRestURL('/ug/use/pbqup.do?bd='+(JSON.stringify(findbd)));
                    },

                    onAdded: function(a,jsondata){

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

$(document).on("click","#passWord",function(){

    $(".modal-body").find("#prefix_860037789915").remove()
    $("#userId").val($(this).attr("data-id"));

    $("#passwords").val();
});
$(document).on('click',"#confirm",function(){
    let params = {userId:$("#userId").val()}
    params.restPwd = 1
    /*if($("#passwords").val() == ""){
        bootbox.alert("<center><h4>密码不能为空。</h4></center>")
        return false;
    }*/
    var password = $.md5("填充数据");
    var form = {};
    form["password"] = password;
    $.ajax({
        type:"POST",
        async:false,
        dataType:'json',
        contentType:"application/json; charset=utf-8",
        url:"ug/use/pbaur.do",
        data:JSON.stringify(params),
        success:function(data){
            if(data.errorCode=='1'){
                $("#input_many_modal").modal('hide');
                    bootbox.alert("重置密码成功",function(){
                    $("#userId").val("");
                    xw.update();
                })
            }else {
                bootbox.alert("操作失败。")
            }
        }
    })
})

$(document).on("click","#googlesecret",function(){
    $(".modal-body").find("#prefix_860037789915").remove()
    $("#userId1").val($(this).attr("data-id"));
});
$(document).on('click',"#confirm1",function(){
    var userId = $("#userId1").val();
    var form = {};
    form["googlecode"] = $("#googlecode").val();
    form["userid"] = userId;
    $.ajax({
        url:"/ug/use/pbgoo.do",
        headers:{
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        type:"POST",
        dateType:"json",
        data:JSON.stringify(form),
        success:function(data){
            if(data.errcode==3){
                $("#codetype").html('谷歌标识码');
                $("#confirm1").hide();
                $("#googlecode").val(data.googlesecret);
                $("#googlecode").attr("disabled","disabled");
            }else{
                bootbox.alert(data.msg);
            }
        }
    })
});


$(document).on("click","#quxiao",function(){
    location.reload();
});

$('#input_google_modal').on('hide.bs.modal', function () {
    location.reload();
});

$(document).on("click","#upd_button",function(){
    $("#dg_password").hide()
    $("#password").attr("disabled","disabled");
    $("#areaId").attr("disabled","disabled");
});
//回显
var huixian;

$(document).on("click","#userRole",function(){
   /* $('#find_userroleId').html("");
    $('#find_userroleId').val("");
    $("#s2id_find_userroleId .select2-search-choice").remove();*/

    $("#menuRole").html("")
    $("#spRole").html("")

    var userid = $(this).attr("data-id");
    var user = Restful.getByID(hzq_rest+"ugsysuser",userid);
    $("#userName").val(user.employeeName)
    $("#userName").attr("userId",userid);
    /*var roleHelper = RefHelper.create({
        ref_url: "gassysrole",
        ref_col: "roleId",
        ref_display: "roleName"
    });
    $.map(roleHelper.getData(), function (value, key) {
        $('#find_userroleId').append('<option value="' + key + '">' + value + '</option>');
    });*/

    var bd={
        "cols":"*",
        "froms":"tx_sys_role",
        "wheres":"1=1 order by roleCode asc",
        "page":false
    }
//  $.ajax({
//      type: 'get',
//      url:"/txs/dbc/pbsel.do?bd=" + encodeURIComponent(JSON.stringify(bd)),
//      dataType: 'json',
//      contentType: "application/json; charset=utf-8",
//      async: false,
//      success: function(data) {
//          console.log(data.rows)
//          if(data.rows){
//              $.each(data.rows,function(index,item){
//                  if(item.roleType =="1"){
//                      $("#menuRole").append('<li style="display: inline-block;width: 16%; line-height: 30px;"><input name="rolemenu" style="margin-right: 10px;" id="'+item.roleId+'" type="checkbox">'+item.roleName+'</li>')
//                  }else if(item.roleType =="2"){
//                      $("#spRole").append('<li style="display: inline-block;width: 16%; line-height: 30px;"><input name="rolemenu"  style="margin-right: 10px;" id="'+item.roleId+'" type="checkbox">'+item.roleName+'</li>')
//                  }
//              })
//          }
//      },
//      error: function(err) {
//          // alert("find all err");
//      }
//  });

  /*  var menurole = Restful.findNQ(hzq_rest+"gassysrole")
    console.log(menurole)
    console.log($(".checkRoleMenu input[type='checkbox']"))*/

    $.ajax({
        type: 'get',
        url: hzq_rest+'ugsysuserrole/?query={"userId":"'+userid+'"}',
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        async: false,
        success: function(data) {
            var userroleId = [];

            huixian = data;
            $.each(data,function(index,item){
                // userroleId.push(item.roleId);
                $(".checkRoleMenu input[id='"+item.roleId+"']").attr("checked",true);
            })
            // console.log(userroleId)
            // $('#find_userroleId').val(userroleId).trigger("change")
        },
        error: function(err) {
            // alert("find all err");
        }
    });

})

$("#find_fresh").on("click",function(){
     $(".checkRoleMenu input").attr("checked",false);
    $.each(huixian,function(index,item){
        $(".checkRoleMenu input[id='"+item.roleId+"']").attr("checked",true);
    })
})


$(document).on("click","#rule_submit",function(){
    var userId = $("#userName").attr("userId");
    var roleId =[];
    var input = $(".checkRoleMenu input[name='rolemenu']:checked");
    // $("#2c91808200000012015d8f44e3f93311")
    $.each(input,function(index,item){
        // console.log($(item).attr("id"))
        roleId.push($(item).attr("id"))
    })

    // var roleId = $('#find_userroleId').val();
    // var userId = $("#userName").attr("userId");
    // console.log(roleId);
    // console.log(userId);
    $.ajax({
        type: 'get',
        url: hzq_rest+'ugsysuserrole/?query={"userId":"'+userId+'"}',
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        async: false,
        success: function(data) {
            $.each(data,function(index,item){
                 Restful.delByIDR( hzq_rest + "ugsysuserrole",item.userRoleId)
            })
        },
        error: function(err) {
            // alert("find all err");
        }
    });


    if(roleId){
        var userrole = {"userId":userId}
        var succ;
        for(var i=0;i<roleId.length;i++){
            userrole["roleId"] = roleId[i];
            succ = Restful.postData( hzq_rest + "ugsysuserrole",JSON.stringify(userrole))
        }
        if(succ){
            bootbox.alert("角色配置成功！")
        }else{
            bootbox.alert("角色配置失败！")
        }

    }
})
//根据用户角色初始化按钮
var button_init = function(){
	var user_info = localStorage.getItem("user_info");
	//获取后先转为json
	var userInfo = eval('(' + user_info + ')');
	//获取登陆名
	var login_name = userInfo.login_name;
	var content = "<div class='btn-group form-group'>"+
	                    "<button id='add_btn' class='btn green' data-target='#edit_gp_btn1' data-toggle='modal'>"+
	                        "<i class='fa fa-plus'></i> 添加&nbsp;"+
	                    "</button>"+
	                "</div>";
	                // " <div class='btn-group form-group'>"+
	                //     "<button id='upd_button' class='btn blue' data-target='#stack1' data-toggle='modal'>"+
	                //         "<i class='fa fa-pencil'></i> 修改&nbsp;"+
	                //     "</button>"+
	                // "</div>";
	if(login_name){
		$('#find').append(content);
	}
}();

$('#mrd_del_btm').on('click',function(e){
    var selrows = xw.getTable().getData(true);
    console.log(selrows)
    if (selrows.rows.length == 0) {
        bootbox.alert("<br><center><h4>请选择需要删除的行</h4></center><br>");
        return;
    }
    var batchids=new Array();
    $.each(selrows.rows,function(idx,row){
        console.log(row)
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

                    var result = Restful.updateRNQ(hzq_rest+"ugsysuser", batchids.join(','),{status:'3',"modifiedTime":new Date(moment().format("YYYY-MM-DDTHH:mm:ss")+"-00:00"),"modifiedBy":JSON.parse(localStorage.getItem("user_info")).userId})
                    //console.log(result)
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
$(document).on("click", "#add_btn", function () {
    $("#edit_gp_btn1").on("hidden.bs.modal", function() {
        document.getElementById("edit_form1").reset();
        $('#sel_roleId').html('')
    });
    $("#isLogin").val('')
    $("#stats").val('')
    $("#userNames").attr('readonly',false)

    $("#userid_form").val('')
    $("#isLoginEle").hide()
    $("#remarkEle").hide()
    $("#googleEle").hide()
    $("#statsEle").hide()
    // 添加员工——获取角色列表
    $.ajax({
        type:"POST",
        async:false,
        dataType:'json',
        contentType:"application/json; charset=utf-8",
        url:"ug/use/pbqur.do",
        data:JSON.stringify({}),
        success:function(data){
            $.each(data.role, function(key,value) {
                $('#sel_roleId').append('<option value="'+value.roleId+'">'+value.roleName+'</option>');
            });
        }
    })
})

/*修改*/
$(document).on('click','#edit_gp3',function() {
    $('#sel_roleId').html('')
    $("#isLoginEle").show()
    $("#remarkEle").show()
    $("#googleEle").show()
    $("#statsEle").show()
    $("#userNames").attr('readonly',true)


    $("#update_gp").show();
    $("#update_gp1").hide();
    var index = $(this).closest('tr').index();
    var data = xw.getTable().getData();
    // 带userId获取角色列表——动态显示
    $.ajax({
        type:"POST",
        async:false,
        dataType:'json',
        contentType:"application/json; charset=utf-8",
        url:"ug/use/pbqur.do",
        data:JSON.stringify({userId:data.rows[index].userId}),
        success:function(data){
            $.each(data.role, function(key,value) {
                // 当前员工绑定的角色
                if(value.selected=='1'){
                    console.log("value.roleId", value.roleId);
                    $('#sel_roleId').append('<option value='+value.roleId+' selected>' + value.roleName + '</option>');
                }else{
                    $('#sel_roleId').append('<option value="'+value.roleId+'">'+value.roleName+'</option>');
                }
            });
        }
    })

    $.each(data.rows, function(key, val) {
        /*模态框关闭后清空模态框里填写的数据*/
        $("#edit_gp_btn1").on("hidden.bs.modal", function() {
            document.getElementById("edit_form1").reset();
            $('#sel_roleId').html('')
        });
        $("form[name='edit_form1'] input[name='" + key + "']").val(val);
    });
    /*状态*/
    // $('#wordCode').val(data.rows[index].employeeCode);
    $('#workName').val(data.rows[index].employeeName);
    $('#userNames').val(data.rows[index].loginName);
    $('#tellPhone').val(data.rows[index].mobile);
    // $('#phone').val(data.rows[index].roleName);
    // $('#accountMoney').val(data.rows[index].roleDesc);
    $('#userEmail').val(data.rows[index].email);
    // $('#userAddress').val(data.rows[index].roleName);
    $('#remarks').val(data.rows[index].remark);
    $('#google').val(data.rows[index].googlesecret);
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

    /*用户是否登录*/
    $("#isLogin option[value='"+data.rows[index].isLogin+"']").attr('selected', 'selected');

    //用户ID
    $("#userid_form").val(data.rows[index].userId);

});

$("#update_gp").click(function() {
    $('[disabled]').attr("disabled", false);
    var edit_form1 = $("#edit_form1").serializeObject();
    $.ajax({
        type: 'POST',
        url: "/ug/use/pbaur.do",
        dataType: 'json',
        contentType: "application/json;charset=utf-8",
        async: false,
        isMask: true,
        data: JSON.stringify(edit_form1),
        success: function(data) {
            console.log("data", data);
            if (data.errorCode=='1'){
                bootbox.alert("修改成功");
            }else {
                bootbox.alert("修改失败<br>"+data.msg);
            }

            xw.update();
        },
        error: function() {
            bootbox.alert("修改失败");
            xw.update();
        }
    });

});

