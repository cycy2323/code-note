var xw;

var Trade_valiIdNumber = function(val) {
    return {
        f: function(val) {
            if(val == 0) {
                return "未审核";
            } else if(val == 1) {
                return "待审核"
            } else if(val == 2) {
                return "审核未通过"
            } else if(val == 3) {
                return "审核通过"
            }
        },
    }
}();

var Trade_status = function(val) {
    return {
        f: function(val) {
            if(val == 0) {
                return "待审核";
            } else if(val == 1) {
                return "审核通过"
            } else if (val == 2) {
                return "已驳回"
            }
        },
    }
}();

var Trade_isTrPwd = function(val) {
    return {
        f: function(val) {
            if(val == 0) {
                return "否";
            } else if(val == 1) {
                return "是"
            }
        },
    }
}();

var Trade_googleVerify = function(val) {
    return {
        f: function(val) {
            if(val == 0) {
                return "关";
            } else if(val == 1) {
                return "开"
            }
        },
    }
}();

var Trade_valiGooglesecret = function(val) {
    return {
        f: function(val) {
            if(val == 0) {
                return "未绑定";
            } else if(val == 1) {
                return "已绑定"
            }
        },
    }
}();

var Trade_userType = function(val) {
    return {
        f: function(val) {
            if(val == 1) {
                return "普通用户";
            } else if(val == 2) {
                return "商家"
            }
        },
    }
}();
var aac = "<div class='btn-group form-group'>" +
    "<button id='edit_gp' class='btn green check' data-target='#edit_gp_btn1' data-toggle='modal'>" +
    "<i class='fa fa-eye'></i> 查看&nbsp;" +
    "</button>" +
    "</div>";
var content = "<div class='btn-group form-group'>" +
    "<button id='edit_gp' class='btn blue' data-target='#edit_gp_btn1' data-toggle='modal'>" +
    "<i class='fa fa-pencil'></i> 审批&nbsp;" +
    "</button>" +
    "</div>";
var Caozuo = function(val,rowItem) {
    return {
        f: function(val,rowItem) {
            if(rowItem.status == 0) {
                return content;
            } else if(rowItem.status == 1) {
                return aac
            } else if(rowItem.status == 2) {
                return aac
            }
        },
    }

}();
var Name = function() {

    // var nameHelper = RefHelper.create({
    // 	ref_url: "ugotcuser",
    // 	ref_col: "userType",
    // });

    var roleFormat = function() {
        return {
            f: function(val) {
                return roleHelper.getDisplay(val);
            }
        }
    }();

    return {

        init: function() {
            // 顺序有影响 (先抓选单, 再抓暂存选单, 再执行其他)

            this.reload();
        },

        reload: function() {

            $('#divtable').html('');
            // var gUserType = RQLBuilder.equal("userType", "1");
            // var filter = RQLBuilder.and([ gUserType ]);
            var userTy = new Array();
            userTy.push(1);
            xw = XWATable.init({
                divname: "divtable",
                //----------------table的选项-------
                pageSize: 10,
                // columnPicker: true,
                transition: 'fade',
                checkboxes: true,
                checkAllToggle: true,
                saveColumn:false,
                //----------------基本restful地址---
                restURL: '/ug/rma/pbrqp.do?bd={}',
                key_column: 'creatorId',
                coldefs: [{
                    col: "creatorId",
                    friendly: "用户ID",
                    validate: "creatorId",
                    nonedit: "nosend",
                    // unique: "true",
                    index: 1
                },
                    {
                        col: "creatorName",
                        friendly: "用户名",
                        validate: "creatorName",
                        index: 2
                    },
                    {
                        col: "creatorNickName",
                        friendly: "用户昵称",
                        validate: "creatorNickName",
                        index: 3
                    },
                    {
                        col: "creatorRealName",
                        friendly: "用户实名",
                        validate: "creatorRealName",
                        index: 4
                    },
                    {
                        col: "idPhotoLegality",
                        friendly: "正式身份证概率",
                        validate: "idPhotoLegality",
                        index: 5
                    },
                    {
                        col: "status",
                        friendly: "状态",
                        validate: "status",
                        format: Trade_status,
                        index: 6
                    },
                    {
                        col: "createTime",
                        friendly: "申请时间",
                        validate: "createTime",
                        index: 7
                    },
                    {
                        col: "auditTime",
                        friendly: "审核时间",
                        validate: "auditTime",
                        index: 8
                    },
                    {
                        friendly: "操作",
                        validate: "status",
                        format: Caozuo,
                        index: 10
                    }

                ],
                // 查询过滤条件
                findFilter: function() {
                    var status, userId,userName;

                    if($('#status1 option:selected').val()) {
                        status = RQLBuilder.equal("status", $('#status1  option:selected').val());
                    }
                    if($('#ugOtcUserId1').val()) {
                        userId = RQLBuilder.equal("userId", $('#ugOtcUserId1').val());
                    }
                    if($('#userName1').val()) {
                        userName = RQLBuilder.equal("userName", $('#userName1').val());
                    }
                    // var find_userType = RQLBuilder.equal("userType", "1");
                    if(status == undefined) {status = '"status":""';}
                    if(userId == undefined) {userId = '"userId":""';}
                    if(userName == undefined) {userName = '"versionNo":""';}

                    var filter = RQLBuilder.and([
                        status,userId,userName
                    ]);
                    xw.setRestURL("/ug/rma/pbrqp.do?bd={" + userId + "," + userName + "," + status+ "}");
                    return filter.rql();
                }

            })
        }
    }

}();
//根据用户角色初始化按钮
var button_init = function() {
    var user_info = localStorage.getItem("user_info");
    //获取后先转为json
    var userInfo = eval('(' + user_info + ')');
    //获取登陆名
    var login_name = userInfo.login_name;
//	var content = "<div class='btn-group form-group'>" +
//		"<button id='edit_gp' class='btn blue' data-target='#edit_gp_btn1' data-toggle='modal'>" +
//		"<i class='fa fa-pencil'></i> 审批&nbsp;" +
//		"</button>" +
//		"</div>";
//	if(login_name == "admin") {
//		$('#find').append(content);
//	}
}();

/*查看与审批*/
$(document).on('click','#edit_gp',function() {
    // 重新请求详情
    var index = $(this).closest('tr').index();
    var data = xw.getTable().getData();
    let id = data.rows[index].id
    $.ajax({
        type: 'POST',
        url: "/ug/rma/pbrio.do",
        dataType: 'json',
        contentType: "application/json;charset=utf-8",
        async: false,
        isMask: true,
        data: JSON.stringify({ id:id }),
        success: function(ret) {
            let $elems=$("span:has(input[type=radio])"),
                $status1Result=$("#status1-result")
            // console.log("ret",ret);
            $.each(ret, function(key, val) {
                /*模态框关闭后清空模态框里填写的数据*/
                $("#edit_gp_btn1").on("hidden.bs.modal", function() {
                    document.getElementById("edit_form1").reset();
                    $('#idcard3').attr('src','');
                    $('#idcard4').attr('src','');
                    // 清空单选按钮
                    for(let i=0;i<$elems.length;i++){
                        $elems[i].removeAttribute("class")
                    }
                    // 初始化所有元素
                    $status1Result.show()
                    $("#reason").show()
                    $("#status0-reason").show()
                    $("#status0-result").show()
                    $(".modal-footer").show()
                    $("#status2-reason-select").show()
                });
                /*-----------------------*/
                if(key!="status"){
                    $("form[name='edit_form1'] input[name='" + key + "']").val(val);
                }
                if(key==='idCardFront'){
                    $("#idcard3").attr("src",val)
                }
                if(key==='idCardBack'){
                    $("#idcard4").attr("src",val)
                }
                if(key==='status'){
                    // 分情况展示字段：0 未审核——选择审核结果radio、原因； 1 审核通过——只显示审核成功span； 3 驳回——radio 2个、原因（无法修改）
                    if(val=="0"){
                        for(let i=0;i<$elems.length;i++){
                            $elems[i].removeAttribute("class")
                        }
                        $status1Result.hide()
                        $("#reason").hide()
                    }else if(val=="1"){
                        $status1Result.show()
                        $("#status0-reason").hide()
                        $("#status0-result").hide()
                        $(".modal-footer").hide()
                    }else if(val=="2"){
                        $status1Result.hide()
                        $("#status2-reason-select").hide()
                        $("span:has(input#sd)").prop("class","checked")
                        $("span:has(input#sd1)").removeClass("class")
                        // console.log("ret.reason", ret.reason);
                        $("#reason").html(ret.reason)
                    }
                }
            });
        },
        error: function() {
            bootbox.alert("详细信息查询失败",function(){
                location.reload();
            });
            xw.update();
        }
    })
});

$("#update_gp").click(function() {

    var edit_form1 = $("#edit_form1").serializeObject();
    // console.log("edit_form1", edit_form1);
    if(!edit_form1.status){ //不改动
        return
    }
    $.ajax({
        type: 'POST',
        url: "/ug/rma/pbscv.do",
        dataType: 'json',
        contentType: "application/json;charset=utf-8",
        async: false,
        isMask: true,
        data: JSON.stringify(edit_form1),
        success: function(res) {
            if(res.code=="1"){
                bootbox.alert("审核成功");
                xw.update();
            }else{
                bootbox.alert(res.msg);
                xw.update();
            }
        },
        error: function() {
            bootbox.alert("审核驳回");
            xw.update();
        }
    });

});

$("#update_gper").click(function() {

    var edit_form1 = $("#edit_form1").serializeObject();

    $.ajax({
        type: 'POST',
        url: "/ug/app/pbqux.do",
        dataType: 'json',
        contentType: "application/json;charset=utf-8",
        async: false,
        isMask: true,
        data: JSON.stringify(edit_form1),
        success: function() {
            bootbox.alert("审批不通过成功");
            xw.update();
        },
        error: function() {
            bootbox.alert("审批不通过失败");
            xw.update();
        }
    });

});
