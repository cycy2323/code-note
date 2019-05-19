var xw
var leafFlagEditBuilder=function(val){
    if(val == "0"){
        return "<select id='leafFlag' name='leafFlag' class='form-control select2me'><option value='0' selected>否</option><option value='1' >是</option></select>";
    }else if(val == "1"){
        return "<select id='leafFlag' name='leafFlag' class='form-control select2me'><option value='0' >否</option><option value='1' selected>是</option></select>";
    }else{
        return "<select id='leafFlag' name='leafFlag' class='form-control select2me'><option value='0' >否</option><option value='1' >是</option></select>";
    }

};
var statusEditBuilder=function(val){
    if(val == "1"){
        return "<select id='status' name='status' class='form-control'><option value='1' selected>启用</option><option value='2' >停用</option><option value='3' >已删除</option></select>";
    }else if(val == "2"){
        return "<select id='status' name='status' class='form-control'><option value='1' >启用</option><option value='2' selected>停用</option><option value='3' >已删除</option></select>";
    }else{
        return "<select id='status' name='status' class='form-control'><option value='1' >启用</option><option value='2' >停用</option><option value='3' selected>已删除</option></select>";
    }

};
 var statusUC = function (val) {
	return {
        f: function (val) {
        	if(val==1){
            	return "启用";
		    }else if(val==2){
		    	return "停用";
		    }else{
		    	return "已删除";
		    }
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
var MenuAction = function () {

    // 父菜单helper
    var MenuHelper = RefHelper.create({
        ref_url: "ugsysmenu",
        ref_col: "menuId",
        ref_display: "menuName"
    });


    var MenuFormat = function () {
        return {
            f: function (val) {
                return MenuHelper.getDisplay(val);
            }
        }
    }();
    return {

        init: function () {
            this.initHelper();
            this.reload();
        },

        initHelper: function () {

        },

        reload: function () {

            $('#divtable').html('');

            var leafFlagStr = "";
            $.map(GasSysBasic.enumIsOrNo,function(value,key){
                leafFlagStr +=","+key+":"+value;
            });
            leafFlagStr = leafFlagStr.substring(1,leafFlagStr.length);
            //console.log(leafFlagStr);
            var global_remap={
                "parentMenuId":"db@TX_SYS_MENU,menuId,menuName",
                "leafFlag":leafFlagStr
            }

            xw = XWATable.init(
                {
                    divname: "divtable",
                    //----------------table的选项-------
                    pageSize: 10,
                    // columnPicker: true,
                    transition: 'fade',
                    exportxls: {
                        title:"菜单列表",
                        remap:global_remap,
                        hidden:false,
                        ci:{}
                    },
                    checkboxes: true,
                    checkAllToggle: true,
                    saveColumn:false,
                    //----------------基本restful地址---
                    restbase: 'ugsysmenu/?sort=menuId',
                    key_column: 'menuId',
                    coldefs: [
                        {
                            col: "menuId",
                            friendly: "菜单ID",
                            validate:"required",
                            unique: "true",
                            index: 1
                        },
                        {
                            col: "menuName",
                            friendly: "菜单名称",
                            validate:"required",
                            sorting: false,
                            index: 2
                        },
                        {
                            col:"parentMenuId",
                            friendly: "父菜单",
                            format:MenuFormat,
                            inputsource: "select",
                            validate:"required",
                            ref_url:  "ugsysmenu",
                            ref_name: "menuName",
                            ref_value: "menuId",
                            index: 3
                        },
                        {
                            col: "menuLevel",
                            friendly: "层级",
                            validate:"required",
                            index: 5
                        },
                        {
                            col: "menuDesc",
                            friendly: "菜单描述",
                            sorting:false,
                            index: 6
                        },
                        {
                            col: "menuSeq",
                            friendly: "菜单顺序",
                            validate:"required",
                            index: 7
                        },

                        {
                            col: "menuUrl",
                            friendly: "菜单地址",
                            validate:"required",
                            sorting:false,
                            index: 8
                        },
                        {
                            col: "icon",
                            friendly: "菜单图标",
                            sorting:false,
                            index: 9
                        },
                        {
                            col: "leafFlag",
                            friendly: "是否有子节点",
                            validate:"required",
                            // inputsource:"select
                            format:GasSysBasic.IsOrNoFormat,
                            inputsource: "custom",
                            inputbuilder: "leafFlagEditBuilder",
                            sorting:false,
                            index: 10
                        },
                        {
                        	col: "status",
                            friendly: "状态",
                            validate:"required",
                            inputsource: "custom",
                            inputbuilder: "statusEditBuilder",
                            format:statusUC,
                            sorting:false,
                            index: 12
                        },
                        {
                            col: '',
                            friendly: '操作',
                            format: Caozuo
                        }
                    ],
                    // 查询过滤条件
                    findFilter: function () {
                        var find_menuId,find_menuName,isLeaf,status;
                        if ($('#find_menuId').val()) {
                            find_menuId = RQLBuilder.like("menuId",$.trim($('#find_menuId').val()));
                        }
                        if ($('#find_menuName').val()) {
                            find_menuName = RQLBuilder.like("menu_name",$.trim($('#find_menuName').val()));
                        }
                        if ($('#isLeaf').val()) {
                            isLeaf = RQLBuilder.equal("leafFlag",$.trim($('#isLeaf').val()));
                        }
                        if ($('#status').val()) {
                            status = RQLBuilder.equal("status",$.trim($('#status').val()));
                        }
                        var filter = RQLBuilder.and([
                            find_menuId,find_menuName,isLeaf,status
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
                }) //--init
        },

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
					//     "<button id='upd_button' class='btn blue' data-target='#stack1' data-toggle='modal'>"+
					//         "<i class='fa fa-pencil'></i> 修改&nbsp;"+
					//     "</button>"+
					// "</div>";
	if(login_name=="admin"){
		$('#find').append(content);
	}
}();

//修改
$(document).on('click','#update_btn',function() {
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
        // $('#menuParent').append('<option>'+ data.rows.parentMenuId +'</option>')
    });
    $('#menuID').val(data.rows[index].menuId);
    $('#menuName').val(data.rows[index].menuName);
    $('#menuHierarchy').val(data.rows[index].menuLevel);
    $('#menuRemarks').val(data.rows[index].menuDesc);
    $('#menuSort').val(data.rows[index].menuSeq);
    $('#menuAddress').val(data.rows[index].menuUrl);
    $('#menuIcon').val(data.rows[index].icon);
    $('#isChild').val(data.rows[index].leafFlag);
    $('#stats').val(data.rows[index].status);
    $('#menuParent').html('');
    $.ajax({
        url: 'ugrest/ugsysmenu?fields={"menuId": 1,"menuName": 1}',
        type: 'GET',
        dataType: 'json',
        contentType: "application/json;charset=utf-8",
        async: false,
        isMask: true,
        success: function(data) {
            $.each(data,function (index,val) {
                $('#menuParent').append('<option>' + val.menuName + '</option>')
            })
        }
    })
});
$("#update_gp").click(function() {
    var edit_form1 = $("#edit_form1").serializeObject();
    // var index = $(this).closest('tr').index();
    var data = xw.getTable().getData();
    // var id = data.rows[index].menuId;
    $.ajax({
        type: 'PUT',
        url: "/ugrest/ugsysmenu/"+ '/100?sort=menuId',
        dataType: 'json',
        contentType: "application/json;charset=utf-8",
        async: false,
        isMask: true,
        data: JSON.stringify(edit_form1),
        success: function() {
            bootbox.alert('修改成功');
            xw.update();
        },
        error: function() {
            bootbox.alert("修改失败");
            xw.update();
        }
    });

});
////添加菜单 (保存)
//$("#save_menu").click(function(){
//	var edit_menu_info = $("#edit_menu_info").serializeObject();
//	console.log(edit_menu_info);
////	$.ajax(
////		{
////		type: 'POST',
////      url: '/tx/smu/pbsmi.do',
////      dataType: 'json',
////      contentType: "application/json; charset=utf-8",
////      async: true,
////      data:JSON.stringify(edit_menu_info),
////      success: function(result) {
////      	console.log(result.menuMap);
////      },
////      error: function(err) {
////			bootbox.alert("服务异常");
////		}
////  });
//});
////添加菜单(初始化父菜单)
//$("#add_menu").click(function(){
//	$.ajax(
//		{
//		type: 'POST',
//      url: '/tx/smu/pbsmp.do',
//      dataType: 'json',
//      contentType: "application/json; charset=utf-8",
//      async: true,
//      success: function(result) {
//      	//console.log(result.menuMap);
//      	$.each(result.menuMap,function(key,values){ 
//      		$("#parentMenu").append('<option value="'+key+'">'+values.mapValue+'</option>')
//      	}); 
//      },
//      error: function(err) {
//			bootbox.alert("服务异常");
//		}
//  });
//});

