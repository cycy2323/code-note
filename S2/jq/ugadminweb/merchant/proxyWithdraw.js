var xw;


var IsMerchantsTrade = function(val) {
    return {
        f: function(val) {
            if(val == 1) {
                return "是";
            } else if(val == 2) {
                return "否"
            }
        },
    }
}();

var Merchant = function() {


    return {

        init: function() {
            // 顺序有影响 (先抓选单, 再抓暂存选单, 再执行其他)

            this.reload();
        },

        reload: function() {

            $('#divtable').html('');
            var useridFormat = function () {
                return {
                    f: function (val,row) {
                        if (row.status == 1) {
                            return "<Button id='passWord' class='btn green check' data-target='#input_many_modal' data-toggle='modal' data-id='"+row.userid+"'>审批</Button>";
                        } else {
                            return "<Button id='passWord' class='btn green check' disabled data-target='#input_many_modal' data-toggle='modal' data-id='"+row.userid+"'>审批</Button>";
                        }
                    }
                }
            }();
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
                restURL: "/ug/owh/pbwsl.do?bd={'':''}",
                coldefs: [{
                    col: "shroffAccountNumber",
                    friendly: "商户主键ID",
                    validate: "shroffAccountNumber",
                    nonedit: "nosend",
                    hidden:"true",
//						unique: "true",
                    index: 1
                },
                    {
                        col: "withdrawalRecordId",
                        friendly: "订单ID",
                        validate: "withdrawalRecordId",
                        index: 2
                    },
                    {
                        col: "withdrawalMerchantId",
                        friendly: "商户ID",
                        validate: "withdrawalMerchantId",
                        index: 3
                    },
                    {
                        col: "withdrawAmount",
                        friendly: "提现金额",
                        index: 4
                    },
                    {
                        col: "withdrawDate",
                        friendly: "提现日期",
                        validate: "withdrawDate",
                        index: 5
                    },
                    {
                        col: "status",
                        friendly: "订单状态",
                        validate: "status",
                        format:GasSysBasic.examineFormat,
                        index: 6
                    },
                    {
                        col: "auditRemarks",
                        friendly: "备注信息",
                        validate: "auditRemarks",
                        index: 7
                    },
                    // {
                    //     col: "auditRemarks",
                    //     friendly: "审核备注",
                    //     hidden: 'true',
                    //     validate: "auditRemarks",
                    //     index: 8
                    // },
                    {
                        col:"userId_op",
                        friendly:"操作",
                        nonedit:"nosend",
                        format:useridFormat,
                        index:11
                    }

                ],
                // 查询过滤条件
                findFilter: function() {
                    var withdrawalRecordId,withdrawalMerchantId;
                    if($('#withdrawalRecordId').val()) {
                        withdrawalRecordId = RQLBuilder.equal("withdrawalRecordId", $.trim($('#withdrawalRecordId').val()));
                    }
                    if($('#merchantId').val()) {
                        withdrawalMerchantId = RQLBuilder.equal("withdrawalMerchantId", $.trim($('#merchantId').val()));
                    }
                    if(withdrawalRecordId == undefined) {
                        withdrawalRecordId = '"withdrawalRecordId":""';
                    }
                    if(withdrawalMerchantId == undefined) {
                        withdrawalMerchantId = '"withdrawalMerchantId":""';
                    }
                    xw.setRestURL("/ug/owh/pbwsl.do?bd={" +withdrawalRecordId+","+withdrawalMerchantId+"}");
                }

            })
        }
    }

}();
$(document).on("click","#passWord",function(){
    $(".modal-body").find("#prefix_860037789915").remove()
    $("#orderID").val($(this).attr("data-id"));
    var index = $(this).closest('tr').index();
    var data = xw.getTable().getData();
    if(data.rows[index].status == 1) {
        document.getElementById('modalFooter').style.display = 'block'
        document.getElementById('modalFooter2').style.display = 'none'
        document.getElementById('orderListID').value = data.rows[index].withdrawalRecordId
        document.getElementById('remarkInfo').value = data.rows[index].auditRemarks
        var RecordId = data.rows[index].withdrawalRecordId
        var stats = data.rows[index].status
        $('#remarkInfo').attr('readonly',false)
    }
    else {
        document.getElementById('modalFooter').style.display = 'none'
        document.getElementById('orderListID').value = data.rows[index].withdrawalRecordId
        document.getElementById('remarkInfo').value = data.rows[index].auditRemarks
        $('#remarkInfo').attr('readonly',true)
    }
})
$(document).on('click','#confirm1',function () {
    // var _this = this;
    // var index = $(_this).closest('tr').index();
    // var data = xw.getTable().getData();
    // var remark = $('#remarkInfo').val();
    // var edit_form1 = {'withdrawalRecordId': RecordId,'auditStatus':1,'auditRemarks':remark}
    var edit_form1 = $("#edit_form1").serializeObject();
    edit_form1.auditStatus = 1;
    $.ajax({
        type: 'POST',
        url: "/ug/owh/pbwau.do",
        dataType: 'json',
        contentType: "application/json;charset=utf-8",
        async: false,
        isMask: true,
        data: JSON.stringify(edit_form1),
        success: function(data) {
            if (data.err_code == '1') {
                bootbox.alert("审批成功");
                xw.update();
            } else {
                bootbox.alert(data.msg)
                xw.update();
            }
        },
        // error: function() {
        //     bootbox.alert("审批失败");
        // }
    });
})
$(document).on('click','#rejectInfo',function () {
    var edit_form1 = $("#edit_form1").serializeObject();
    edit_form1.auditStatus = 2;
    $.ajax({
        type: 'POST',
        url: "/ug/owh/pbwau.do",
        dataType: 'json',
        contentType: "application/json;charset=utf-8",
        async: false,
        isMask: true,
        data: JSON.stringify(edit_form1),
        success: function(data) {
            if(data.err_code == '1') {
                bootbox.alert("驳回成功");
                xw.update();
            }else {
                bootbox.alert(data.msg);
                xw.update();
            }
        },
        // error: function() {
        //     bootbox.alert("驳回失败");
        // }
    });
})
$(document).on('click',"#confirm",function(){
    var index = $(this).closest('tr').index();
    var data = xw.getTable().getData();
    var orderListID = data.rows[index].withdrawalRecordId
    var examineStats = data.rows[index].status
    var remarkInfo = data.rows[index].auditRemarks
    // console.log(data)
    // var userId = $("#userId").val();
    // var password = $.md5("填充数据");
    var form = {'withdrawalRecordId':orderListID,'auditStatus':examineStats,'auditRemarks':remarkInfo};
    // form["password"] = password;
    $.ajax({
        url:'/ug/owh/pbwau.do',
        type:"POST",
        dateType:"json",
        data:JSON.stringify(form),
        success:function(data){
            location.reload();
            // if(data.success){
            //     $("#input_many_modal").modal('hide');
            //     bootbox.alert("通过",function(){
            //         $("#userId").val("");
            //         location.reload();
            //     })
            // }else {
            //     bootbox.alert("驳回")
            // }
        }
    })
});

//根据用户角色初始化按钮
var button_init = function() {
    var user_info = localStorage.getItem("user_info");
    //获取后先转为json
    var userInfo = eval('(' + user_info + ')');
    //获取登陆名
    var login_name = userInfo.login_name;
    /*var content = "<div class='btn-group form-group'>" +
        "<button id='edit_gp' class='btn blue' data-target='#edit_gp_btn1' data-toggle='modal'>" +
        "<i class='fa fa-pencil'></i> 审批&nbsp;" +
        "</button>" +
        "</div>";*/
    /*if(login_name == "admin") {
        $('#find').append(content);
    }*/
}();

/*查看详细信息*/

$(document).on('click','#edit_btn',function() {
    var index = $(this).closest('tr').index();
    var data = xw.getTable().getData();
    $("#idphoto1").attr("src",data.rows[index].idPhoto)
//	if(data.rows.length == 0) {
//		bootbox.alert("<br><center><h4>请选择一条数据！</h4></center><br>");
//		return false;
//	}
//	if(data.rows.length > 1) {
//		bootbox.alert("<br><center><h4>只能选择一行！</h4></center><br>");
//		return false;
//	}

    $.each(data.rows[index], function(key, val) {
        /*模态框关闭后清空模态框里填写的数据*/
        $("#edit_gp_btn").on("hidden.bs.modal", function() {
            document.getElementById("edit_form").reset();
        });
        /*-----------------------*/
        key = key + "_select";
        $("form[name='edit_form'] input[name='" + key + "']").val(val);

        /*金额类型*/
        if(data.rows[index].amounttype == 1) {
            $("#amounttype_select option[value='" + data.rows[index].amounttype + "']").attr('selected', 'selected');
        } else if(data.rows[index].amounttype == 2) {
            $("#amounttype_select option[value='" + data.rows[index].amounttype + "']").attr('selected', 'selected');
        }
        /*类型*/
        if(data.rows[index].type == 1) {
            $("#type_select option[value='" + data.rows[index].type + "']").attr('selected', 'selected');
        } else if(data.rows[index].type == 2) {
            $("#type_select option[value='" + data.rows[index].type + "']").attr('selected', 'selected');
        }
        /*广告状态*/
        if(data.rows[index].status == 1) {
            $("#status_select option[value='" + data.rows[index].status + "']").attr('selected', 'selected');
        } else if(data.rows[index].status == 2) {
            $("#status_select option[value='" + data.rows[index].status + "']").attr('selected', 'selected');
        }

        /*货币类型*/
        if(data.rows[index].cointype == 1) {
            $("#cointype_select option[value='" + data.rows[index].cointype + "']").attr('selected', 'selected');
        }
        /*是否需要高级认证*/
        if(data.rows[index].isseniorcertification == 1) {
            $("#isseniorcertification_select option[value='" + data.rows[index].isseniorcertification + "']").attr('selected', 'selected');
        } else if(data.rows[index].isseniorcertification == 2) {
            $("#isseniorcertification_select option[value='" + data.rows[index].isseniorcertification + "']").attr('selected', 'selected');
        }
        /*是否实名制*/
        if(data.rows[index].valiidnumber == 1) {
            $("#valiidnumber_select option[value='" + data.rows[index].valiidnumber + "']").attr('selected', 'selected');
        } else if(data.rows[index].valiidnumber == 2) {
            $("#valiidnumber_select option[value='" + data.rows[index].valiidnumber + "']").attr('selected', 'selected');
        }

    });

});

/*审批*/
$(document).on('click','#edit_gp',function() {
    var index = $(this).closest('tr').index();
    var data = xw.getTable().getData();

    $("#amounttype").attr("disabled", true);
    $("#type").attr("disabled", true);
    $("#paymentway").attr("disabled", true);
    $.each(data.rows[index], function(key, val) {

        /*模态框关闭后清空模态框里填写的数据*/
        $("#edit_gp_btn1").on("hidden.bs.modal", function() {
            document.getElementById("edit_form1").reset();
        });
        /*-----------------------*/

        $("form[name='edit_form1'] input[name='" + key + "']").val(val);

        /*金额类型*/
        if(data.rows[index].amounttype == 1) {
            $("#amounttype option[value='" + data.rows[index].amounttype + "']").attr('selected', 'selected');
        } else if(data.rows[index].amounttype == 2) {
            $("#amounttype option[value='" + data.rows[index].amounttype + "']").attr('selected', 'selected');
        }
        /*类型*/
        if(data.rows[index].type == 1) {
            $("#type option[value='" + data.rows[index].type + "']").attr('selected', 'selected');
        } else if(data.rows[index].type == 2) {
            $("#type option[value='" + data.rows[index].type + "']").attr('selected', 'selected');
        }
        /*广告状态*/
        if(data.rows[index].status == 1) {
            $("#status option[value='" + data.rows[index].status + "']").attr('selected', 'selected');
        } else if(data.rows[index].status == 2) {
            $("#status option[value='" + data.rows[index].status + "']").attr('selected', 'selected');
        }
        /*支付方式*/
        if(data.rows[index].paymentway == 1) {
            $("#paymentway option[value='" + data.rows[index].paymentway + "']").attr('selected', 'selected');
        } else if(data.rows[index].paymentway == 2) {
            $("#paymentway option[value='" + data.rows[index].paymentway + "']").attr('selected', 'selected');
        } else if(data.rows[index].paymentway == 3) {
            $("#paymentway option[value='" + data.rows[index].paymentway + "']").attr('selected', 'selected');
        } else if(data.rows[index].paymentway == 1,2) {
            $("#paymentway option[value='" + data.rows[index].paymentway + "']").attr('selected', 'selected');
        } else if(data.rows[index].paymentway == 1,3) {
            $("#paymentway option[value='" + data.rows[index].paymentway + "']").attr('selected', 'selected');
        } else if(data.rows[index].paymentway == 2,3) {
            $("#paymentway option[value='" + data.rows[index].paymentway + "']").attr('selected', 'selected');
        } else if(data.rows[index].paymentway == 1,2,3) {
            $("#paymentway option[value='" + data.rows[index].paymentway + "']").attr('selected', 'selected');
        }
        /*货币类型*/
        if(data.rows[index].cointype == 1) {
            $("#cointype option[value='" + data.rows[index].cointype + "']").attr('selected', 'selected');
        }
        /*是否需要高级认证*/
        if(data.rows[index].isseniorcertification == 1) {
            $("#isseniorcertification option[value='" + data.rows[index].isseniorcertification + "']").attr('selected', 'selected');
        } else if(data.rows[index].isseniorcertification == 2) {
            $("#isseniorcertification option[value='" + data.rows[index].isseniorcertification + "']").attr('selected', 'selected');
        }
        /*是否与平台商家交易*/
        if(data.rows[index].ismerchantstrade == 1) {
            $("#ismerchantstrade option[value='" + data.rows[index].ismerchantstrade + "']").attr('selected', 'selected');
        } else if(data.rows[index].ismerchantstrade == 2) {
            $("#ismerchantstrade option[value='" + data.rows[index].ismerchantstrade + "']").attr('selected', 'selected');
        }

    });

});

$("#update_gp").click(function() {

    var edit_form1 = $("#edit_form1").serializeObject();

    if(edit_form1.employeename == "" || edit_form1.employeename == null){
        bootbox.alert("商户登录名不能为空");
        return;
    }

    $.ajax({
        type: 'POST',
        url: "/ug/bus/pbadd.do",
        dataType: 'json',
        contentType: "application/json;charset=utf-8",
        async: false,
        isMask: true,
        data: JSON.stringify(edit_form1),
        success: function(ret) {
            if(ret.err_code == "1"){

                var string1 = ret.loginName;
                var string2 = ret.userId;
                var string3 = ret.password;
                window.location.href="merchant/successadded.html?loginName="+string1+"&userId="+string2+"&password="+string3;

            }else{
                bootbox.alert("添加成功");
                xw.update();
            }
        },
        error: function() {
            bootbox.alert("添加失败");
            xw.update();
        }
    });

});

