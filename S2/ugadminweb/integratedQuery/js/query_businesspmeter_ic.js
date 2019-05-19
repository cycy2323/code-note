/**
 * Created by Administrator on 2018/1/9.
 */
var userInfo = JSON.parse(localStorage.getItem('user_info'));
var area_id = userInfo.area_id;
var areas = new Array();
areas.push(area_id);
$.ajax({
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    type: 'get',
    async: false,
    url: hzq_rest + "gasbizarea?query={\"parentAreaId\":\"" + area_id + "\"}",
    success: function (data) {
        for (var i = 0; i < data.length; i++) {
            areas.push(data[i].areaId);
        }
    }
});
console.log(areas);
//规格型号
var meterSpecIdHelper = RefHelper.create({
    ref_url: 'gasmtrmeterspec',
    ref_col: 'meterModelId',
    ref_display: 'meterModelName'
});
//额定流量
var meterFlowHelper = RefHelper.create({
    ref_url: 'gasmtrmeterflow',
    ref_col: "meterFlowId",
    ref_display: "ratingFlux"
});
//流量范围
var meterFlowRangeHelper = RefHelper.create({
    ref_url: 'gasmtrmeterflow',
    ref_col: "meterFlowId",
    ref_display: "flowName"
});
//额定流量
var meterFlowRangeHelper1 = RefHelper.create({
    ref_url: 'gasmtrmeterflow',
    ref_col: "meterFlowId",
    ref_display: "ratingFlux"
});
//用气性质
var gasTypeHelper = RefHelper.create({
    ref_url: 'gasbizgastype',
    ref_col: "gasTypeId",
    ref_display: "gasTypeName"
});
var userState = {
    "00": "未开栓", "01": "正常，", "02": "暂停用气", "03": "拆除状态", "04": "长期不用", "99": "删除"
};
var invoiceTypeEnum = {
    "1": "普通发票", "2": "增值税发票"
};
$(".export-excel").attr("data-table", ".tabPrint");
//    $(".export-excel").attr("data-filename","");
$(".export-excel").on("click", function (e) {
    e.preventDefault();
    var exportTable = $(this).data("table");
    var filename = $("#title").html();//$(this).data("filename");
    var ignoreColumn = "";//$(this).data("ignorecolumn");
    $(exportTable).tableExport({
        fileName: filename,
        type: 'excel',
        escape: 'false',
        excelstyles: ['border-bottom', 'border-top', 'border-left', 'border-right'],
        ignoreColumn: '[' + ignoreColumn + ']'
    });
});
$("#find_sign").click(function () {
    var customerCode = $('#find_customerCode').val();
    var year = $('#find_date').val();
    var fromYear = year.substring(0, 4);
    console.log(fromYear);

    if (!customerCode) {
        bootbox.alert("请您填写要查询的客户编号！");
        return;
    }
    if (!year) {
        bootbox.alert("请先选择时间！");
        return;
    }
    var flag = 0;
    var bd4 = {
        "cols": "*",
        "froms": "gas_ctm_archive",
        "wheres": "customer_code='" + customerCode + "'",
        "page": false
    };
    $.ajax({
        type: 'get',
        url: '/txs/dbc/pbsel.do?bd=' + JSON.stringify(bd4),
        dataType: 'json',
        async: false,
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            if (data.rows[0]) {
                if (data.rows[0].customerType == 'I') {
                    for (var i = 0; i < areas.length; i++) {
                        if ((data.rows[0].areaId) == areas[i]) {
                            flag = 1;
                            return;
                        }
                    }
                } else {
                    bootbox.alert("此客户不是IC卡用户，请重新填写表编号！");
                    return false;
                }

            } else {
                bootbox.alert("无此客户信息，请重新填写客户编号！");
                return false;
            }
        }
    });
    console.log(flag);
    if (flag == 1) {
        var bd = {
            "cols": "*",
            "froms": "gas_ctm_archive a left join gas_chg_account ch on a.ctm_archive_id=ch.ctm_archive_id left join gas_mrd_book b on a.book_id=b.book_id",
            "wheres": "customer_code='" + customerCode + "'",
            "page": false
        };
        var bd5 = {
            "cols": "*",
            "froms": "gas_csr_work_bill_result r left join(select work_bill_id,created_time,complete_date,customer_code from gas_csr_work_bill where bill_state='4' and bill_type in('WB_CHANGEM','B_CHANGEM')) b on r.work_bill_id=b.work_bill_id",
            "wheres": "customer_code='" + customerCode + "' and change_meter_reason <>'2'",
            "page": false
        };
        $.ajax({
            type: 'get',
            url: '/txs/dbc/pbsel.do?bd=' + JSON.stringify(bd5),
            dataType: 'json',
            async: false,
            contentType: "application/json; charset=utf-8",
            success: function (data) {
                if (data.rows) {
                    $('#r18_c2').html(data.rows[0].completeDate);
                }
            }
        });
        var zbl;
        var sumZBQL = 0;
        var zbqf;
        var sumZBQF = 0;
        var xyl;
        var sumXYQL = 0;
        var xyf;
        var sumXYQF = 0;
        var jfgzql;
        var sumJFGZQL = 0;
        var jfgzje;
        var sumJFGZJE = 0;
        var ysl;
        var sumYSL = 0;
        var ssl;
        var sumSSL = 0;
        var yse;
        var sumYSE = 0;
        var sse;
        var sumSSE = 0;
        $.ajax({
            type: 'get',
            url: '/txs/dbc/pbsel.do?bd=' + JSON.stringify(bd),
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            success: function (customerInfo) {
                $('#thead_r1_c2').html(customerInfo.rows[0].customerName);
                $('#r2_c2').html(customerInfo.rows[0].bookCode);
                $('#r3_c2').html(customerCode);
                $('#r4_c2').html(customerInfo.rows[0].customerAddress);
                $('#r6_c2').html(gasTypeHelper.getDisplay(customerInfo.rows[0].gasTypeId));
                $('#r22_c2').html(invoiceTypeEnum[customerInfo.rows[0].invoiceType]);
                $('#r26_c2').html(customerInfo.rows[0].remark);
                var bd1 = {
                    "cols": "meter_user_state,cm.unbolt_time,cm.meter_user_name,station,m1.meter_no as meter_no1,m1.meter_model_id as meter_model_id1 ,m1.meter_digit as meter_digit1,m1.flow_range,m1.bore",
                    "froms": "gas_ctm_archive a inner join gas_ctm_meter cm on cm.ctm_archive_id=a.ctm_archive_id left join gas_mtr_meter m1 on m1.meter_id=cm.meter_id",
                    "wheres": "customer_code='" + customerCode + "' and meter_user_state<>'99'",
                    "page": false
                };
                $.ajax({
                    type: 'get',
                    url: '/txs/dbc/pbsel.do?bd=' + JSON.stringify(bd1),
                    dataType: 'json',
                    contentType: "application/json; charset=utf-8",
                    success: function (data) {
                        console.log(data)
                        $('#r5_c2').html(data.rows[0].unboltTime.substring(0, 10));
                        $('#r7_c2').html(data.rows[0].meterUserName);
                        $('#r8_c2').html(data.rows[0].meterNo1);
                        $('#r9_c2').html(meterSpecIdHelper.getDisplay(data.rows[0].meterModelId1));
                        $('#r10_c2').html(data.rows[0].meterDigit1);
                        $('#r11_c2').html(data.rows[0].station);
                        $('#r12_c2').html(meterFlowRangeHelper.getDisplay(data.rows[0].flowRange));
                        $('#r13_c2').html(data.rows[0].bore);
                        $('#r14_c2').html(meterFlowRangeHelper1.getDisplay(data.rows[0].flowRange));
                        $('#r21_c2').html(userState[data.rows[0].meterUserState]);
                    }
                });
            }
        });
        var datayearmonthday = GasModMrd.enumStatisticsMonth;
        var totalyear = GasModMrd.enumOneYear;
        for (var j = 0; j <= 12; j++) {
            var whereInfo = "";
            if (j == 0) {
                whereInfo += "(copy_time between to_date('" + (fromYear - 1) + "-11-26','yyyy-mm-dd') and to_date('" + (fromYear - 1) + "-12-25 23:59:59','yyyy-mm-dd hh24:mi:ss'))" +
                    "and ctm_archive_id in (select ctm_archive_id from gas_ctm_archive where customer_code='" + customerCode + "')";
            } else if (j == 1) {
                whereInfo += "(copy_time between to_date('" + (fromYear - 1) + "-" + datayearmonthday[(j)][0] + "','yyyy-mm-dd hh24:mi:ss') and to_date('" + fromYear + "-" + datayearmonthday[(j)][1] + "','yyyy-mm-dd hh24:mi:ss'))" +
                    "and ctm_archive_id in (select ctm_archive_id from gas_ctm_archive where customer_code='" + customerCode + "')";
            } else {
                whereInfo += "(copy_time between to_date('" + fromYear + "-" + datayearmonthday[(j)][0] + "','yyyy-mm-dd hh24:mi:ss') and to_date('" + fromYear + "-" + datayearmonthday[(j)][1] + "','yyyy-mm-dd hh24:mi:ss'))" +
                    "and ctm_archive_id in (select ctm_archive_id from gas_ctm_archive where customer_code='" + customerCode + "')";
            }
            // console.log(whereInfo);
            var bd1 = {
                "cols": "*",
                "froms": "gas_mrd_meter_reading",
                "wheres": whereInfo,
                "page": false
            };
            $.ajax({
                type: 'get',
                url: '/txs/dbc/pbsel.do?bd=' + JSON.stringify(bd1),
                dataType: 'json',
                contentType: "application/json; charset=utf-8",
                para: j,
                success: function (meterUserInfo) {
                    if (meterUserInfo.rows) {
                        if (meterUserInfo.rows[0].chargingMeter == 2) {
                            $('#r2_c' + (this.para + 4)).html("二次表计费");
                        } else {
                            $('#r2_c' + (this.para + 4)).html("一次表计费");
                        }
                        $('#r3_c' + (this.para + 4)).html(meterUserInfo.rows[0].sysBuyMeasure);
                        $('#r4_c' + (this.para + 4)).html(meterUserInfo.rows[0].accumulatedGas);
                        $('#r27_c' + (this.para + 4)).html(meterUserInfo.rows[0].remaingAsnum);
                        $('#r5_c' + (this.para + 4)).html(meterUserInfo.rows[0].meterReading);
                        $('#r7_c' + (this.para + 4)).html(meterUserInfo.rows[0].budgetMeasure ? meterUserInfo.rows[0].budgetMeasure : "0");
                        $('#r8_c' + (this.para + 4)).html(meterUserInfo.rows[0].budgetGasFee ? meterUserInfo.rows[0].budgetGasFee : "0");
                        $('#r9_c' + (this.para + 4)).html(meterUserInfo.rows[0].dailyMeasure);
                    }
                }
            });


            var whereInfo1 = "";
            if (j == 0) {
                whereInfo1 += "(trade_date between to_date('" + (fromYear - 1) + "-11-26','yyyy-mm-dd') and to_date('" + (fromYear - 1) + "-12-25 23:59:59','yyyy-mm-dd hh24:mi:ss'))" +
                    "and customer_code='" + customerCode + "'";
            } else if (j == 1) {
                whereInfo1 += "(trade_date between to_date('" + (fromYear - 1) + "-" + datayearmonthday[(j)][0] + "','yyyy-mm-dd hh24:mi:ss') and to_date('" + fromYear + "-" + datayearmonthday[(j)][1] + "','yyyy-mm-dd hh24:mi:ss'))" +
                    "and customer_code='" + customerCode + "'";
            } else {
                whereInfo1 += "(trade_date between to_date('" + fromYear + "-" + datayearmonthday[(j)][0] + "','yyyy-mm-dd hh24:mi:ss') and to_date('" + fromYear + "-" + datayearmonthday[(j)][1] + "','yyyy-mm-dd hh24:mi:ss'))" +
                    "and customer_code='" + customerCode + "'";
            }
            // var bd2 = {
            //     "cols": "sum(money)sse,sum(ysl)ssl,sum(recover_money)zbe,sum(correct_money)jfgze,sum(agree_money)xye",
            //     "froms": "gas_report_sse_new",
            //     "wheres": whereInfo1,
            //     "page": false
            // };
            // $.ajax({
            //     type: 'get',
            //     url: '/txs/dbc/pbsel.do?bd=' + JSON.stringify(bd2),
            //     dataType: 'json',
            //     contentType: "application/json; charset=utf-8",
            //     para: j,
            //     success: function (ssInfo) {
            //         if (ssInfo.rows) {
            //             zbqf = (ssInfo.rows[0].zbe ? ssInfo.rows[0].zbe : "0");
            //             sumZBQF = parseFloat(sumZBQF).toFixed(2) * 1 + parseFloat(zbqf).toFixed(2) * 1;
            //             $('#r11_c' + (this.para + 4)).html(zbqf);
            //             $('#r11_c17').html(sumZBQF.toFixed(2));
            //
            //             xyf = (ssInfo.rows[0].xye ? ssInfo.rows[0].xye : "0");
            //             sumXYQF = parseFloat(sumXYQF).toFixed(2) * 1 + parseFloat(xyf).toFixed(2) * 1;
            //             $('#r13_c' + (this.para + 4)).html(xyf);
            //             $('#r13_c17').html(sumXYQF.toFixed(2));

            // jfgzje = (ssInfo.rows[0].jfgze ? ssInfo.rows[0].jfgze : "0");
            // sumJFGZJE = parseFloat(sumJFGZJE).toFixed(2) * 1 + parseFloat(jfgzje).toFixed(2) * 1;
            // $('#r17_c' + (this.para + 4)).html(jfgzje);
            // $('#r17_c17').html(sumJFGZJE.toFixed(2));

            // sse = (ssInfo.rows[0].sse ? ssInfo.rows[0].sse : "0");
            // sumSSE = parseFloat(sumSSE).toFixed(2) * 1 + parseFloat(sse).toFixed(2) * 1;
            // $('#r21_c' + (this.para + 4)).html(sse);
            // $('#r21_c17').html(sumSSE.toFixed(2));

            // ssl = (ssInfo.rows[0].ssl ? ssInfo.rows[0].ssl : "0");
            // sumSSL = parseInt(sumSSL) + parseInt(ssl);
            // $('#r23_c' + (this.para + 4)).html(ssl);
            // $('#r23_c17').html(sumSSL);
            //         }
            //     }
            // });
            var whereInfo4 = "";
            if (j == 0) {
                whereInfo4 += "(trade_date between to_date('" + (fromYear - 1) + "-11-26','yyyy-mm-dd') and to_date('" + (fromYear - 1) + "-12-25 23:59:59','yyyy-mm-dd hh24:mi:ss'))" +
                    "and customer_code='" + customerCode + "'";
            } else if (j == 1) {
                whereInfo4 += "(trade_date between to_date('" + (fromYear - 1) + "-" + datayearmonthday[(j)][0] + "','yyyy-mm-dd hh24:mi:ss') and to_date('" + fromYear + "-" + datayearmonthday[(j)][1] + "','yyyy-mm-dd hh24:mi:ss'))" +
                    "and customer_code='" + customerCode + "'";
            } else {
                whereInfo4 += "(trade_date between to_date('" + fromYear + "-" + datayearmonthday[(j)][0] + "','yyyy-mm-dd hh24:mi:ss') and to_date('" + fromYear + "-" + datayearmonthday[(j)][1] + "','yyyy-mm-dd hh24:mi:ss'))" +
                    "and customer_code='" + customerCode + "' and trade_type_desc='ZBBLL'";
            }
            var bd4 = {
                "cols": "sum(money)zbe,sum(gas)zbl",
                "froms": "gas_act_gasfee_atl",
                "wheres": whereInfo4,
                "page": false
            };
            $.ajax({
                type: 'get',
                url: '/txs/dbc/pbsel.do?bd=' + JSON.stringify(bd4),
                dataType: 'json',
                contentType: "application/json; charset=utf-8",
                para: j,
                success: function (zbInfo) {
                    if (zbInfo.rows) {
                        zbqf = (zbInfo.rows[0].zbe ? zbInfo.rows[0].zbe : "0");
                        sumZBQF = parseFloat(sumZBQF).toFixed(2) * 1 + parseFloat(zbqf).toFixed(2) * 1;
                        $('#r11_c' + (this.para + 4)).html(zbqf);
                        $('#r11_c17').html(sumZBQF.toFixed(2));

                        zbl = (zbInfo.rows[0].zbl ? zbInfo.rows[0].zbl : "0");
                        sumZBQL = parseInt(sumZBQL) + parseInt(zbl);
                        $('#r10_c' + (this.para + 4)).html(zbl);
                        $('#r10_c17').html(sumZBQL);

                    }
                }
            });
            var whereInfo6 = "";
            if (j == 0) {
                whereInfo6 += "(trade_date between to_date('" + (fromYear - 1) + "-11-26','yyyy-mm-dd') and to_date('" + (fromYear - 1) + "-12-25 23:59:59','yyyy-mm-dd hh24:mi:ss'))" +
                    "and gasfee_atl_id in(select atl_id from gas_act_agree_gas_flow f left join gas_ctm_archive a on a.ctm_archive_id=f.ctm_archive_id  where status='2' and a.customer_code='" + customerCode + "')";
            } else if (j == 1) {
                whereInfo6 += "(trade_date between to_date('" + (fromYear - 1) + "-" + datayearmonthday[(j)][0] + "','yyyy-mm-dd hh24:mi:ss') and to_date('" + fromYear + "-" + datayearmonthday[(j)][1] + "','yyyy-mm-dd hh24:mi:ss'))" +
                    "and gasfee_atl_id in(select atl_id from gas_act_agree_gas_flow f left join gas_ctm_archive a on a.ctm_archive_id=f.ctm_archive_id  where status='2' and a.customer_code='" + customerCode + "')";
            } else {
                whereInfo6 += "(trade_date between to_date('" + fromYear + "-" + datayearmonthday[(j)][0] + "','yyyy-mm-dd hh24:mi:ss') and to_date('" + fromYear + "-" + datayearmonthday[(j)][1] + "','yyyy-mm-dd hh24:mi:ss'))" +
                    "and gasfee_atl_id in(select atl_id from gas_act_agree_gas_flow f left join gas_ctm_archive a on a.ctm_archive_id=f.ctm_archive_id  where status='2' and a.customer_code='" + customerCode + "')";
            }
            var bd6 = {
                "cols": "sum(money)xye,sum(gas)xyl",
                "froms": "gas_act_gasfee_atl",
                "wheres": whereInfo6,
                "page": false
            };

            $.ajax({
                type: 'get',
                url: '/txs/dbc/pbsel.do?bd=' + JSON.stringify(bd6),
                dataType: 'json',
                contentType: "application/json; charset=utf-8",
                para: j,
                success: function (xyInfo) {
                    if (xyInfo.rows) {
                        xyf = (xyInfo.rows[0].xye ? xyInfo.rows[0].xye : "0");
                        sumXYQF = parseFloat(sumXYQF).toFixed(2) * 1 + parseFloat(xyf).toFixed(2) * 1;
                        $('#r13_c' + (this.para + 4)).html(xyf);
                        $('#r13_c17').html(sumXYQF.toFixed(2));

                        xyl = (xyInfo.rows[0].xyl ? xyInfo.rows[0].xyl : "0");
                        sumXYQL = parseInt(sumXYQL) + parseInt(xyl);
                        $('#r12_c' + (this.para + 4)).html(xyl);
                        $('#r12_c17').html(sumXYQL);

                    }
                }
            });

            var bd3 = {
                "cols": "sum(gas)ysl,sum(agree_gas)xyl,sum(sse)yse",
                "froms": "gas_report_ysl_new",
                "wheres": whereInfo1,
                "page": false
            };
            $.ajax({
                type: 'get',
                url: '/txs/dbc/pbsel.do?bd=' + JSON.stringify(bd3),
                dataType: 'json',
                contentType: "application/json; charset=utf-8",
                para: j,
                success: function (ysInfo) {
                    if (ysInfo.rows) {
                        // jfgzql = (ysInfo.rows[0].jfgzl ? ysInfo.rows[0].jfgzl : "0");
                        // sumJFGZQL = parseInt(sumJFGZQL) + parseInt(jfgzql);
                        // $('#r16_c' + (this.para + 4)).html(jfgzql);
                        // $('#r16_c17').html(sumJFGZQL);

                        ysl = (ysInfo.rows[0].ysl ? ysInfo.rows[0].ysl : "0");
                        sumYSL = parseInt(sumYSL) + parseInt(ysl);
                        $('#r16_c' + (this.para + 4)).html(ysl);
                        $('#r16_c17').html(sumYSL);

                        yse = (ysInfo.rows[0].yse ? ysInfo.rows[0].yse : "0");
                        sumYSE = parseFloat(sumYSE).toFixed(2) * 1 + parseFloat(yse).toFixed(2) * 1;
                        $('#r17_c' + (this.para + 4)).html(yse);
                        $('#r17_c17').html(sumYSE.toFixed(2));
                    }
                }
            });
        }
        $("#btn_down_detail").removeClass("disabled");
        $("#btn_down_detail").removeClass("gray");
        $("#btn_down_detail").addClass("green");

        $("#btn_print_page").removeClass("disabled");
        $("#btn_print_page").removeClass("gray");
        $("#btn_print_page").addClass("green");
    } else {
        bootbox.alert("此客户非本区域客户，请重新填写客户编号！");
        return false;
    }

});

