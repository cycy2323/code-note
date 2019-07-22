$(function () {

    $.ajax({
        type: 'POST',
        url: "/bd/inc/pbsel.do",
        dataType: 'json',
        contentType: "application/json;charset=utf-8",
        async: false,
        isMask: true,
        data: '',
        success: function (rest) {
            if (rest.err_code == 1) {
                var estimate = 0;
                var closing = 0;
                var sum = 0;
                var clsd = 0;
                if (undefined != rest.income) {
                    estimate = rest.income;
                }
                if (undefined != rest.close) {
                    closing = rest.close;
                }
                if (undefined != rest.generalincome) {
                    sum = rest.generalincome;
                }
                if (undefined != rest.closeincome) {
                    clsd = rest.closeincome;
                }
                $("#estimate").html(estimate);
                $("#closing").html(closing);
                $("#sum").html(sum);
                $("#clsd").html(clsd);
            }
        },
        error: function (err) {
            if(err.status==406||err.status==401){
                window.location.replace("/login.html");
            }else{
                bootbox.alert("服务器繁忙,请稍后再试", function() {
                    location.reload();
                });
            }
        }
    });
});

$("#chaxun").click(function () {
    var starttime = $("#starttime").val();
    var endtime = $("#endtime").val();
    var edit_form = {};
    edit_form.startTime = starttime;
    edit_form.endTime = endtime;
    $.ajax({
        type: 'POST',
        url: "/bd/inc/pbtim.do",
        dataType: 'json',
        contentType: "application/json;charset=utf-8",
        async: false,
        isMask: true,
        data: JSON.stringify(edit_form),
        success: function (rest) {
            if (rest.err_code == 1) {
                var ordernumber = 0;
                var ordermoney = 0;
                var sharemoney = 0;
                if (undefined != rest.ordernumber) {
                    ordernumber = rest.ordernumber;
                }
                if (undefined != rest.ordermoney) {
                    ordermoney = rest.ordermoney;
                }
                if (undefined != rest.sharemoney) {
                    sharemoney = rest.sharemoney;
                }
                $("#ordernumber").html(ordernumber);
                $("#ordermoney").html(ordermoney);
                $("#sharemoney").html(sharemoney);
            }
        },
        error: function (err) {
            if(err.status==406||err.status==401){
                window.location.replace("/login.html");
            }else{
                bootbox.alert("服务器繁忙,请稍后再试", function() {
                    location.reload();
                });
            }
        }
    });

});

$("#edit_gp").click(function () {
    $.ajax({
        type: 'POST',
        url: "/bd/inc/pbpay.do",
        dataType: 'json',
        contentType: "application/json;charset=utf-8",
        async: false,
        isMask: true,
        data: '',
        success: function (result) {
            console.log(result);
            var shroffnumber = $("#shroffnumber");
            shroffnumber.empty();
            shroffnumber.append("<option value=''>请选择商户</option>");
            $.each(result.accountMessage, function (index, itemobj) {
                var merchantId = itemobj.accountBankCard;
                shroffnumber.append("<option value='" + merchantId + "'>" + merchantId + "</option>");
            });
        },
        error: function (err) {
            if(err.status==406||err.status==401){
                window.location.replace("/login.html");
            }else{
                bootbox.alert("服务器繁忙,请稍后再试", function() {
                    location.reload();
                });
            }
        }
    });
    var clo = $("#closing").html()
    $("#depositamount").val(clo);
});
$("#update_gp1").click(function () {

    var edit_form1 = $("#edit_form").serializeObject();
    $.ajax({
        type: 'POST',
        url: "/bd/inc/pbent.do",
        dataType: 'json',
        contentType: "application/json;charset=utf-8",
        async: false,
        isMask: true,
        data: JSON.stringify(edit_form1),
        success: function (rest) {
            // console.log(rest);
            if (rest.err_code == "1") {
                bootbox.alert(rest.msg);
                xw.update();
            } else {
                bootbox.alert(rest.msg);
                xw.update();
            }
        },
        error: function (err) {
            if(err.status==406||err.status==401){
                window.location.replace("/login.html");
            }else{
                bootbox.alert("服务器繁忙,请稍后再试", function() {
                    location.reload();
                });
            }
        }
    });
});

var format = function (val) {
    return {
        f: function (val) {
            if (val == null) {
                return "";
            } else {
                return val;
            }
        },
    }
}();

var amountformat = function (val) {
    return {
        f: function (val) {
            if (val == null) {
                return "";
            } else {
                return val+'¥';
            }
        },
    }
}();

var statusformat = function (val) {
    return {
        f: function (val) {
            if (val == 1) {
                return "待审核";
            }
            else if (val == 2) {
                return "放款中";
            }
            else if (val == 3) {
                return "驳回"
            } else if (val == 4) {
                return "成功";
            }else{
                return "放款失败";
            }
        },
    }
}();

var xw;

var Transfe = function () {
    return {
        init: function () {
            this.reload();
        },
        reload: function () {
            $('#divtable').html('');
            xw = XWATable.init({
                divname: "divtable",
                //----------------table的选项-------
                pageSize: 50,
                //columnPicker: true,
                transition: 'fade',
                checkboxes: true,
                checkAllToggle: true,
                saveColumn: false,
                //----------------基本restful地址---
                restURL: "/bd/inc/pbrec.do?bd={\"\":\"\"}",
                coldefs: [
                    {
                        col: "withdrawalRecordId",
                        friendly: "提现单号",
                        validate: "withdrawalRecordId",
                        format: format,
                        index: 1
                    },
                    {
                        col: "withdrawAmount",
                        friendly: "提现金额",
                        validate: "withdrawAmount",
                        format: amountformat,
                        index: 2
                    },
                    {
                        col: "status",
                        friendly: "状态",
                        validate: "status",
                        format: statusformat,
                        index: 3
                    },
                    {
                        col: "withdrawDate",
                        friendly: "提现日期",
                        validate: "withdrawDate",
                        format: format,
                        index: 4
                    }
                ],
                // 查询过滤条件
                findFilter: function () {
                    var withdrawalRecordId, status;
                    if ($('#withdrawalRecordId').val()) {
                        withdrawalRecordId = RQLBuilder.equal("withdrawalRecordId", $('#withdrawalRecordId').val());
                    }
                    if (withdrawalRecordId == undefined) {
                        withdrawalRecordId = '"withdrawalRecordId":""';
                    }
                    if ($('#status option:selected').val()) {
                        status = RQLBuilder.equal("status", $('#status  option:selected').val());
                    }
                    if (status == undefined) {
                        status = '"status":""';
                    }
                    xw.setRestURL("/bd/inc/pbrec.do?bd={" + status + ',' + withdrawalRecordId + "}");
                },
            })
        }
    }

}();

/*查看详细信息*/

$(document).on('click', '#edit_btn', function () {
    var index = $(this).closest('tr').index();
    var data = xw.getTable().getData();
    $.each(data.rows[index], function (key, val) {
        /*模态框关闭后清空模态框里填写的数据*/
        $("#edit_gp_btn").on("hidden.bs.modal", function () {
            document.getElementById("edit_form").reset();
        });
        /*-----------------------*/

        $("form[name='edit_form'] input[name='" + key + "']").val(val);

    });

});

/*修改*/

$("#update_gp").click(function () {
    var edit_form1 = $("#edit_form1").serializeObject();

    if ($("#status").val() == "") {
        alert('状态不能为空');

        return false;
    }
    if ($("#sort").val() == "") {
        alert('不能为空');

        return false;
    }

    //	$.ajax({
    //		type: 'POST',
    //		url: "/tx/art/pbcle.do",
    //		dataType: 'json',
    //		contentType: "application/json;charset=utf-8",
    //		async: false,
    //		isMask: true,
    //		data: JSON.stringify(edit_form1),
    //		success: function() {
    //			bootbox.alert("修改成功");
    //			xw.update();
    //		},
    //		error: function() {
    //			bootbox.alert("修改失败");
    //			xw.update();
    //		}
    //	});
    //
});
/**转账记录下载 */
$('#down_button').click(function () {
    $.ajax({
        type: 'POST',
        url: "/bd/tra/pbtrs.do",
        dataType: 'json',
        contentType: "application/json;charset=utf-8",
        async: false,
        isMask: true,
        data: JSON.stringify(edit_form1),
        success: function () {
            bootbox.alert("下载成功");
        },
        error: function (err) {
            if(err.status==406||err.status==401){
                window.location.replace("/login.html");
            }else{
                bootbox.alert("服务器繁忙,请稍后再试", function() {
                    location.reload();
                });
            }
        }
    });
});

$("#chaxun").click();
