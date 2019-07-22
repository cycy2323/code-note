
var roleAction = function () {
    return {
        init: function () {
            this.reload();
        },
        reload: function () {
            var modifyRole = function () {
                return {
                    f: function (val,row) {//data-target='#input_many_modal'
                        return "<a id='roleModify' class='btn blue'  style='cursor:pointer'  data-toggle='modal' data-id='"+row.roleId+"'>修改</a>";
                    }
                }
            }();
            var deleteRole = function () {
                return {
                    f: function (val,row) {
                        return "<a id='roleDelete' class=\"btn red\"  style='cursor:pointer' data-target='#delete_modal' data-toggle='modal' data-id='"+row.roleId+"'>删除</a>";
                    }
                }
            }();
            $('#divtable').html('');
            xw = XWATable.init({
                divname: "divtable",
                pageSize: 10,
                transition: 'fade',
                checkboxes: false,
                checkAllToggle: true,
                saveColumn:false,
                restURL: '/mf/sys/pbmue.do?bd={"state":"1"}',
                coldefs: [
                    {
                        col: "roleId",
                        friendly: "角色ID",
                        hidden: true,
                        index: 1
                    },
                    {
                        col: "roleName",
                        friendly: "角色名称",
                        validate:"required",
                        index: 2
                    },
                    {
                        col: "roleDesc",
                        friendly: "角色描述",
                        index: 3
                    },
                    {
                        col: "createdTime",
                        friendly: "创建时间",
                        index: 4
                    }
                    ,
                    {
                        col: "menuId",
                        friendly: "菜单",
                        hidden:true,
                        index: 5
                    },
                    {
                        col: "menuName",
                        friendly: "角色权限",
                        index: 5
                    }
                    ,
                    {
                        col: "modify",
                        friendly: "修改",
                        format: modifyRole,
                        index: 6
                    },
                    {
                        col: "deleteRole",
                        friendly: "删除",
                        format: deleteRole,
                        index: 6
                    }

                ],
                // 查询过滤条件
                findFilter: function() {
                    var roleName,state;
                    if($("#find_roleName").val()){
                        roleName =RQLBuilder.equal("roleName",$("#find_roleName").val());
                    }
                    if(roleName==undefined){
                        roleName = '"roleName":""';
                    }
                    state = '"state":"1"';
                    var filter = RQLBuilder.and([
                        roleName
                    ]);
                    xw.setRestURL("/mf/sys/pbmue.do?bd={"+roleName+','+state+"}");
                    return filter.rql();
                }
            });
        }
    }
}();
let menuSelectedIdArr=[];//选中状态的ids
$(document).on("click","#roleModify",function(){
    $("#add_user_role").on("hidden.bs.modal", function() {
        document.getElementById("edit_form").reset();
    });
    $("#roleId").val($(this).attr("data-id"));
    $("#titleName").html("修改角色");

    var index = $(this).closest('tr').index();
    // console.log("index", index);
    var data = xw.getTable().getData();
    // console.log("daeta2", data);
    menuSelectedIdArr=data.rows[index].menuId
    // console.log("menuSelectedIdArr", menuSelectedIdArr);
    $("#roleName").val(data.rows[index].roleName)
    $("#roleDesc").val(data.rows[index].roleDesc)
    $("#add_role").click();
    // rolemenuAction.init()
});

$(document).on("click","#roleDelete",function(){
   $("#deleteRoleId").val($(this).attr("data-id"));
});

$(document).on("click","#confirm_delete",function(){
    $("#delete_modal").modal('hide');
    var form = {};
    form["state"] = 3;
    form["roleId"] = $("#deleteRoleId").val();
    $.ajax({
        url:"/mf/sys/pbmue.do",
        headers:{
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        type:"POST",
        dateType:"json",
        data:JSON.stringify(form),
        success:function(data){
            if(data.errcode==1){
                bootbox.alert(data.msg,function(){
                    location.reload();
                })
            }else {
                bootbox.alert(data.msg,function(){
                    location.reload();
                })
            }
        }
        ,error: function(err) {
            if(err.status==406||err.status==401){
                bootbox.alert("超时，请重新登录!", function() {
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


$('#add_role').on('click',function(e){
    rolemenuAction.init()
});
var rolemenuAction = function () {
    return {

        init: function () {
            var user_info = localStorage.getItem("user_info");
            //获取后先转为json
            var userInfo = eval('(' + user_info + ')');
            var businessId = userInfo.businessId;
            var queryCondion = RQLBuilder.and([
                RQLBuilder.equal("createdBy",businessId),
            ]).rql();
            typeHelper=RefHelper.create({
                ref_url:'mfsysrole/?query='+queryCondion,
                ref_col:"roleId",
                ref_display:"roleName"
            });
            $.each(typeHelper.getData(), function(key,value) {
                $('#sel_rolecode').append('<option value="'+key+'">'+value+'</option>');
            });
            // 顺序有影响 (先抓选单, 再抓暂存选单, 再执行其他)
            //this.initHelper();
            this.initUnitTree();
        },
        initUnitTree : function(){
            var roleselect=$('#sel_rolecode');
            var rolepermMap={};
            var reloadRolePerm=function(){
                var data = Restful.findNQ("/ugrest/mfsysrolemenu");
                $.map(data,function(index,val){
                    rolepermMap[index["roleId"]+"___"+index["menuId"]] = val;
                })
            };

            reloadRolePerm();
            var isPermit=function (role,permissionid){
                return rolepermMap[role+"___"+permissionid];
            };
            var menuMap={};
            var menuData=[];
            var ss=[];
            var rolemenuId = [];
            var buildMenuData=function(){
                rolemenuId = [];
                var roleid = $("#sel_rolecode").val();
                var data = Restful.findNQ('/ugrest/mfsysmenu?query={"reservedField1":"1"}');
                var data1 = Restful.findNQ("/ugrest/mfsysrolemenu");
                // console.log("拿到的菜单",data);
                // console.log("data1",data1);
                $.each(data1,function(index,item){
                    if(item["roleId"] == roleid){
                        rolemenuId.push(item["menuId"]);
                    }
                })

                var menuid = [];
                $.each(data1,function(index,item){
                    if(item["roleId"] == roleid){
                        menuid.push(item["menuId"])
                    }
                });
                $.each(data, function(index, item) {
                    ss.push(menuMap[item.menuId]={
                        "text": item["menuName"],
                        "icon": item["icon"],
                        "url": item["menuUrl"],
                        "id": item.menuId
                    });
                });
                var menutree = [];
                var menuT = [];
                $.each(data,function(index,item){
                    var aa={
                        "text": item["menuName"],
                        //"icon": item["icon"],
                        "url": item["menuUrl"],
                        "parentId":item["parentMenuId"],
                        "id": item.menuId
                    };

                    if($.inArray(item['menuId'],menuSelectedIdArr)!= '-1'){   //判断selected！！
                        //console.log(menuid[index])
                        aa["state"] = {"selected":true}
                    }else{
                        aa["state"] = {"selected":false}
                    }
                    menuT.push(aa);
                });
                //一级菜单添加children
                $.each(menuT,function(index,item){
                    if(item["parentId"] == "#"){
                        item["children"]=[];
                        menutree.push(item);
                    }
                });
                //二级菜单
                $.each(menutree,function(index,item){
                    //console.log(item["id"]);
                    $.each(menuT,function(inde,ite){
                        if(ite["parentId"] == item["id"]){
                            ite["children"] = [];
                            item["children"].push(ite);
                        }
                    })
                });
                //三级菜单
                $.each(menutree,function(index,item){
                    $.each(item["children"],function(inde,ite){
                        $.each(menuT,function(ind,it){
                            if(it["parentId"] == ite["id"]){
                                ite.children.push(it);
                            }
                        })
                    })
                });
                return menutree;
            }
            var permtree;
            var createTree=function(){
                permtree=$('#role_tree').jstree({
                    'plugins': ["wholerow", "checkbox", "types"],
                    'core': {
                        "themes" : {
                            "responsive": true
                        },
                        'data':
                            function (obj, cb) {
                                cb.call(this,buildMenuData());
                            }
                    },
                    "types" : {
                        "default" : {
                            "icon" : "fa fa-folder icon-state-warning icon-lg"
                        },
                        "file" : {
                            "icon" : "fa fa-file icon-state-warning icon-lg"
                        }
                    }
                });
            };
            $('#addrole').on('click',function(e){   //保存
                if(!(/^[A-Za-z0-9\u4e00-\u9fa5]{2,15}$/.test($("#roleName").val()))){
                    bootbox.alert("角色名称应为2-15位字母数字或汉字");
                    return;
                }
                if(!(/^[\u4e00-\u9fa5]{2,30}$/.test($("#roleDesc").val()))){
                    bootbox.alert("角色描述应为2-30位汉字");
                    return;
                }
                var selected=permtree.jstree().get_selected(true);
                var selectdata ="";
                for(var i=0;i<selected.length;i++){
                    if(!selected[i].children.length){
                        selectdata+=selected[i].id+",";
                    }
                }
                if(selectdata.split(",").length==0){
                    bootbox.alert("请选择菜单");
                    return;
                }

                var form = {};
                form["state"] = 2;
                form["menuId"] = selectdata;
                form["roleName"] = $("#roleName").val();
                form["roleDesc"] = $("#roleDesc").val();
                form["roleId"] = $("#roleId").val()
                $.ajax({
                    url:"/mf/sys/pbmue.do",
                    headers:{
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    type:"POST",
                    dateType:"json",
                    data:JSON.stringify(form),
                    success:function(data){
                        if(data.errcode){
                            bootbox.alert(data.msg,function(){
                                location.reload();
                            })
                        }else {
                            bootbox.alert(data.msg,function(){
                                location.reload();
                            })
                        }
                    }
                    ,error: function(err) {
                        if(err.status==406||err.status==401){
                            bootbox.alert("超时，请重新登录!", function() {
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
            roleselect.change(function(){
                permtree.jstree().destroy();
                ss=[];
                createTree();
            });
            createTree();
        }
    }
}();
$('#add_user_role').on('hide.bs.modal', function () {
    location.reload();
});





