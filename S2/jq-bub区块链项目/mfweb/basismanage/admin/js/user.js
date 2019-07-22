var xw ;


var UserAction = function () {
    var userHelper = RefHelper.create({
        ref_url: "mfusrbusiness",
        ref_col: "mfUsrBusinessId",
        ref_display: "nickName"
    });
    var userFormat=function () {
        return {
            f: function (val) {
                return userHelper.getDisplay(val);
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
                            return "<a id='passWord' style='cursor:pointer' data-target='#input_many_modal' data-toggle='modal' data-id='"+row.userId+"'>重置密码</a>";
                            // <a id='userRole' style='cursor:pointer' data-target='#input_many_modal1' data-toggle='modal' data-id='"+row.userId+"'>配置角色</a> 
                        }else{
                            return " ";
                        }
                    }
                }
            }();
            var user_info = localStorage.getItem("user_info");
            //获取后先转为json
            var userInfo = eval('(' + user_info + ')');
            var businessId = userInfo.businessId;
            $('#divtable').html('');
            var queryCondion = RQLBuilder.and([
                RQLBuilder.equal("businessId",businessId),
            ]).rql()

            xw=XWATable.init(
                {
                    divname: "divtable",
                    //----------------table的选项-------
                    pageSize:50,
                    columnPicker: true,
                    transition: 'fade',
                    checkboxes: true,
                    checkAllToggle:true,
                    //----------------基本restful地址---
                    restbase: 'mfsysuser',
                    key_column:'userId',
                    coldefs:[
                        {
                            col:"userId",
                            friendly:"用户ID",
                            unique:"true",
                            hidden:"hidden",
                            nonedit:"nosend",
                            index:1
                        },
                        {
                            col:"employeeCode",
                            friendly:"员工代码",
                            validate:"required",
                            index:2
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
                            col:"password",
                            friendly:"密码",
                            validate:"required",
                            // nonedit:"nosend",
                            readonly:"readonly",
                            hidden:true,
                            index:9
                        },
                        {
                            col:"businessId",
                            friendly:"所属商户",
                            validate:"required",
                            format:userFormat,
                            ref_url:  "mfusrbusiness",
                            ref_name: "nickName",
                            ref_value: "mfUsrBusinessId",
                            inputsource: "custom",
                            inputbuilder: "businessBuilder",
                            index:10
                        },
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
                            hidden:true,
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
                            hidden:false,
                            index:15
                        },

                        {
                            col:"userId_op",
                            friendly:"操作",
                            nonedit:"nosend",
                            format:useridFormat,
                            index:16
                        }
                    ],
                    // 查询过滤条件
                    findFilter: function(){
                        if($("#status").val() == "3"){
                            $("#mrd_del_btm").hide()
                        }else{
                            $("#mrd_del_btm").show()
                        }

                        var find_username,status,find_loginname,is_login;

                        if($('#find_username').val())
                        {
                            find_username=RQLBuilder.like("employeeName",$('#find_username').val());
                        }
                        if($('#is_login').val())
                        {
                            is_login=RQLBuilder.like("isLogin",$('#is_login').val());
                        }
                        if($('#find_loginname').val())
                        {
                            find_loginname=RQLBuilder.like("loginName",$('#find_loginname').val());
                        }
                        if($("#status").val()){
                            status =RQLBuilder.equal("status",$("#status").val());
                        }else{
                            status =RQLBuilder.equal("status","1");
                        }

                        var filter=RQLBuilder.and([
                            find_username,find_loginname,status,is_login
                        ]);

                        xw.setRestURL(hzq_rest + 'mfsysuser');
                        return filter.rql();
                    },

                    onAdded: function(a,jsondata){

                        return  validateForm(jsondata);
                    },
                    onUpdated: function(ret,jsondata){
                        console.log(jsondata)
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
})
$(document).on('click',"#confirm",function(){
    var userId = $("#userId").val();
    if($("#passwords").val() == ""){
        bootbox.alert("<center><h4>密码不能为空。</h4></center>")
        return false;
    }
    var password = $.md5($("#passwords").val());
    console.log(password)
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
            console.log(data)
            if(data.success){
                bootbox.alert("密码修改成功",function(){
                    $("#userId").val("");
                    $("#passwords").val("");
                })
            }else {
                bootbox.alert("密码修改失败。")
            }
        }
    })
})

$(document).on("click","#upd_button",function(){
    $("#dg_password").hide()
    $("#password").attr("disabled","disabled");
    $("#areaId").attr("disabled","disabled");
})
//回显
var huixian;

$(document).on("click","#userRole",function(){
   /* $('#find_userroleId').html("");
    $('#find_userroleId').val("");
    $("#s2id_find_userroleId .select2-search-choice").remove();*/

    $("#menuRole").html("")
    $("#spRole").html("")

    var userid = $(this).attr("data-id");
    console.log(userid);
    var user = Restful.getByID(hzq_rest+"mfsysuser",userid);
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
        url: hzq_rest+'mfsysuserrole/?query={"userId":"'+userid+'"}',
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        async: false,
        success: function(data) {
            var userroleId = [];
            console.log(data);
            huixian = data;
            $.each(data,function(index,item){
                // userroleId.push(item.roleId);
                $(".checkRoleMenu input[id='"+item.roleId+"']").attr("checked",true);
            })
            // console.log(userroleId)
            // $('#find_userroleId').val(userroleId).trigger("change")
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


    if(roleId){
        var userrole = {"userId":userId}
        var succ;
        for(var i=0;i<roleId.length;i++){
            userrole["roleId"] = roleId[i];
            succ = Restful.postData( hzq_rest + "mfsysuserrole",JSON.stringify(userrole))
        }
        if(succ){
            bootbox.alert("角色配置成功！")
        }else{
            bootbox.alert("角色配置失败！")
        }

    }
})
// //根据用户角色初始化按钮
// var button_init = function(){
// 	var user_info = localStorage.getItem("user_info");
// 	//获取后先转为json
// 	var userInfo = eval('(' + user_info + ')');
// 	//获取登陆名
// 	var login_name = userInfo.login_name;
// 	var content = "<div class='btn-group form-group'>"+
// 	                    "<button id='add_button' class='btn green' data-target='#stack1' data-toggle='modal'>"+
// 	                        "<i class='fa fa-plus'></i> 添加&nbsp;"+
// 	                    "</button>"+
// 	                "</div>"+
// 	                " <div class='btn-group form-group'>"+
// 	                    "<button id='upd_button' class='btn blue' data-target='#stack1' data-toggle='modal'>"+
// 	                        "<i class='fa fa-pencil'></i> 修改&nbsp;"+
// 	                    "</button>"+
// 	                "</div>";
// 	if(login_name=="admin"){
// 		$('#find').append(content);
// 	}
// }();

$('#mrd_del_btm').on('click',function(e){
    var selrows = xw.getTable().getData(true);
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

                    var result = Restful.updateRNQ(hzq_rest+"mfsysuser", batchids.join(','),{status:'3',"modifiedTime":new Date(moment().format("YYYY-MM-DD HH:mm:ss")+"-00:00"),"modifiedBy":JSON.parse(localStorage.getItem("user_info")).userId})
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
