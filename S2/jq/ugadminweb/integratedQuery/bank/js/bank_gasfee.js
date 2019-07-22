/**
 * Created by alex on 2018/1/31.
 */
ComponentsPickers.init();
var xw;
var userInfo = JSON.parse(localStorage.getItem('user_info'));
var area_id = userInfo.area_id;
var user_id = userInfo.userId;
var areas = new Array();
areas.push(area_id);
//查询areaId下级areaId
var queryCondion = RQLBuilder.and([
    RQLBuilder.equal("status", "1"),
    RQLBuilder.equal("parentAreaId", area_id)
]).rql()
$.ajax({
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    type: 'get',
    async: false,
    url: hzq_rest + "gasbizarea?query=" + queryCondion,
    success: function (data) {
        for (var i = 0; i < data.length; i++) {
            areas.push(data[i].areaId);
        }
    }
});
var AreaHelper = RefHelper.create({
    ref_url: 'gasbizarea?query={"areaId":{"$in":' + JSON.stringify(areas) + '}}',
    ref_col: "areaId",
    ref_display: "areaName",
    "sort": "posCode"
});
//银行Helper
var bankHelper = RefHelper.create({
    ref_url: 'gasbasbank?query={"status":"1"}',
    ref_col: 'bankCode',
    ref_display: 'bankName'
});
$.each(AreaHelper.getRawData(), function (index, row) {
    $('#find_unit').append('<option value="' + row.areaId + '">' + row.areaName + '</option>');
});
var AreaFormat = function () {
    return {
        f: function (val) {
            return AreaHelper.getDisplay(val);
        }
    }
}();
var bankFormat = function () {
    return {
        f: function (val) {
            return bankHelper.getDisplay(val);
        }
    }
}();
var gasfeeAction = function () {
    return {
        init: function () {
            this.initHelper();
            this.reload();
        },
        initHelper: function () {
            $.map(bankHelper.getData(),function(value,key){
                $('#find_bank').append('<option value="' + key + '">' + value + '</option>');
            });
        },
        reload:function(){
            $('#divtable').html('');
            var bd = {
                "cols": "a.area_id,a.customer_code,a.customer_name,a.customer_type,bd.bank_code,atl.trade_date,bd.trade_money",
                "froms": "gas_chg_bank_balance bb inner join gas_chg_gas_balance_detail bd on bb.balance_id = bd.balance_id inner join gas_act_gasfee_atl atl on bd.trade_atl_id = atl.gasfee_atl_id left join gas_ctm_archive a on atl.customer_code=a.customer_code",
                "wheres": "1=0 and bb.balance_status in ('3','4')",
                "pade": true,
                "limit":50
            }

            xw=XWATable.init(
                {
                    divname: "divtable",
                    //----------------table的选项-------
                    pageSize:50,
                    columnPicker: true,
                    transition: 'fade',
                    checkboxes: false,
                    checkAllToggle:false,
                    exportxls: {
                        title:"导出数据",
                        remap: {
                            "bankCode":"db@GAS_BAS_BANK,bankCode,bankName",
                            "customerType":"P:普标,I:IC卡表"
                        },
                        hidden:false,
                        ci:{}
                    },
                    //----------------基本restful地址---
                    // restURL: "/txs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd=" + encodeURIComponent(JSON.stringify(bd)),
                    //---------------行定义
                    coldefs: [
                        {
                            col:"customerCode",
                            friendly:"客户编号",
                            readonly: "readonly",
                            index:1
                        },
                        {
                            col:"customerName",
                            friendly:"客户名称",
                            readonly: "readonly",
                            index:2
                        },
                        {
                            col:"customerType",
                            friendly:"表类别",
                            readonly: "readonly",
                            format: GasModCtm.customerTypeFormat,
                            index:3
                        },
                        {
                            col:"bankCode",
                            friendly: "缴费银行",
                            format:bankFormat,
                            readonly: "readonly",
                            index:4
                        },
                        {
                            col:"tradeDate",
                            friendly: "缴费日期",
                            readonly: "readonly",
                            index:5
                        },
                        {
                            col:"tradeMoney",
                            friendly: "缴费金额",
                            readonly: "readonly",
                            index:5
                        }
                    ],

                    // 查询过滤条件

                    findFilter: function(){
                        console.log("dd")
                        var whereinfo = "";
                        if ($('#find_unit').val()) {
                            whereinfo += " a.area_id='" + $('#find_unit').val() + "' and ";
                        }
                        if ($('#find_customerCode').val()) {
                            whereinfo += " a.customer_code='" + $('#find_customerCode').val() + "' and ";
                        }
                        if ($('#find_customerType').val()) {
                            whereinfo += " a.customer_type='" + $('#find_customerType').val() + "' and ";
                        }
                        if ($('#find_bank').val()) {
                            whereinfo += " bd.bank_code='" + $('#find_bank').val() + "' and ";
                        }
                        if ($("#find_start_date1").val() && $("#find_end_date1").val()) {
                            // whereinfo += " to_char(atl.trade_date,'yyyy-mm-dd')  between '" + $('#find_start_date1').val() + "' and '" + $("#find_end_date1").val() + "' and ";
                            whereinfo += " (atl.trade_date between to_date('"+$('#find_start_date1').val()+" 00:00:00','yyyy-mm-dd hh24:mi:ss') and to_date('"+$("#find_end_date1").val()+" 23:59:59','yyyy-mm-dd hh24:mi:ss')) and";
                        } else if ($("#find_start_date1").val() && !$("#find_end_date1").val()) {
                            bootbox.alert("请输入截止日期")
                        } else if (!$("#find_start_date1").val() && $("#find_end_date1").val()) {
                            bootbox.alert("请输入起始日期")
                        }
                        var bd = {
                            "cols": "a.area_id,a.customer_code,a.customer_name,a.customer_type,bd.bank_code,atl.trade_date,bd.trade_money",
                            "froms": "gas_chg_bank_balance bb inner join gas_chg_gas_balance_detail bd on bb.balance_id = bd.balance_id inner join gas_act_gasfee_atl atl on bd.trade_atl_id = atl.gasfee_atl_id left join gas_ctm_archive a on atl.customer_code=a.customer_code",
                            "wheres": whereinfo+"  bb.balance_status in ('3','4') and a.area_id in(" + areas + ")",
                            "pade": true,
                            "limit":50
                        };
                        var bd1 = {
                            "cols": "sum(bd.trade_money)money",
                            "froms": "gas_chg_bank_balance bb inner join gas_chg_gas_balance_detail bd on bb.balance_id = bd.balance_id inner join gas_act_gasfee_atl atl on bd.trade_atl_id = atl.gasfee_atl_id left join gas_ctm_archive a on atl.customer_code=a.customer_code",
                            "wheres": whereinfo+"  bb.balance_status in ('3','4') and a.area_id in(" + areas + ")",
                            "pade": true,
                            "limit":50
                        };
                        // $.ajax({
                        //     type: 'get',
                        //     url: '/txs/dbc/pbsel.do?fh=SELDBC0000000J00&resp=bd&bd=' + encodeURIComponent(JSON.stringify(bd1)),
                        //     dataType: 'json',
                        //     contentType: "application/json; charset=utf-8",
                        //     async: false,
                        //     success: function (data) {
                        //         $('#sumPrice1').val(data.rows[0].money);
                        //     }
                        // });
                        // xw.setRestURL("/txs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd=" + encodeURIComponent(JSON.stringify(bd)));
                    }


                })
        }

    }
}();




