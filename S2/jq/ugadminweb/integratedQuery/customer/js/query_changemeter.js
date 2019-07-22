var customerTypeFormat = function () {
    return {
        f: function (data, row) {
            if (data == "P") {
                return "普表";
            } else if (data == "I") {
                return "IC卡表";
            } else {
                return "";
            }
        }
    }
}();
var timeFormat = function () {
    return {
        f: function (data, row) {
            if (data == "" || data == undefined) {
                return "—";
            } else {
                return moment(data).format("YYYY-MM-DD HH:mm:ss");
            }
            return "";
        }
    }
}();
var customerKindFormat = function () {
    return {
        f: function (data, row) {
            if (data == "1") {
                return "居民";
            } else if (data == "9") {
                return "非居民";
            } else {
                return "";
            }
        }
    }
}();

var moneyFormat = function () {
    return {
        f: function (data, row) {
            var m = parseFloat(data);
            if (!isNaN(m)) {
                m = -m;
                return m.toFixed(2);
            } else {
                return 0.00;
            }
        }
    }
}();
$(function () {
    ComponentsPickers.init();

    var areas = new Array();
    var area_id = JSON.parse(localStorage.getItem("user_info")).area_id;
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
    var AreaHelper1 = RefHelper.create({
        ref_url: 'gasbizarea?query={"areaId":{"$in":' + JSON.stringify(areas) + '}}',
        ref_col: "areaId",
        ref_display: "areaName",
        "sort": "posCode"
    });
    var gs = AreaHelper1.getRawData();
    var opts = '<option value=""></option>';
    //var rows = data;
    console.log(gs.length);
    for (var i = 0; i < gs.length; i++) {
        //console.log("aaaaaaaaaaaaaaaaaaa");
        opts += '<option value="' + gs[i].areaId + '">' + gs[i].areaName + '</option>';
        // console.log(opts);
    }
    $("#find_area").html(opts);

    $("#find_changemeter").click(function () {
        var wheres = " operate='S' and copy_type='82' ";
        if ($("#find_area").val() != "") {
            wheres += " and atl.areaId='" + $("#find_area").val() + "' ";
        }

        if ($("#find_customer_code").val() != "") {
            wheres += " and atl.customerCode='" + $("#find_customer_code").val() + "' ";
        }

        if ($("#find_customer_kind").val() != "") {
            wheres += " and atl.customerKind='" + $("#find_customer_kind").val() + "' ";
        }

        if ($("#find_customer_type").val() != "") {
            wheres += " and atl.customerType='" + $("#find_customer_type").val() + "' ";
        }

        if ($("#find_start_date").val() == "" || $("#find_end_date").val() == "") {
            if ($("#find_customer_code").val() == "") {
                bootbox.alert("请您选择时间范围！");
                return;
            }
        } else {
            wheres += " and atl.tradeDate >= to_date('" + $("#find_start_date").val() + " 00:00:00','yyyy-MM-dd hh24:mi:ss') ";
            wheres += " and atl.tradeDate <= to_date('" + $("#find_end_date").val() + " 23:59:59','yyyy-MM-dd hh24:mi:ss') ";
        }

        if ($("#find_min_gas").val() != "") {
            wheres += " and atl.gas >= " + $("#find_min_gas").val();
        }

        if ($("#find_max_gas").val() != "") {
            wheres += " and atl.gas <= " + $("#find_max_gas").val();
        }
        wheres += " order by atl.trade_date desc"
        var bd = {
            "cols": "'' userName,area.area_name,arch.customer_name,arch.customer_address,atl.*,gtype.gas_type_name",
            "froms": "gas_mrd_meter_reading reading inner join gas_bll_detail detail on reading.meter_reading_id = detail.meter_reading_id inner join gas_act_gasfee_atl atl on detail.reserved_field2 = atl.gasfee_atl_id inner join gas_biz_area area on area.area_id = atl.area_id inner join gas_ctm_archive arch on atl.customer_code = arch.customer_code inner join gas_biz_gas_type gtype on atl.gas_type_id = gtype.gas_type_id            ",
            "wheres": wheres,
            "page": true,
            "limit": 50
        };
        $('#divtable').html('');

        var dialog = bootbox.dialog({
            message: '<p class="text-center">查询中...</p>',
            closeButton: false
        });

        window.setTimeout(function () {
            var xwa = XWATable.init(
                {
                    //----------------table的选项-------
                    divname: 'divtable',
                    pageSize: 50, 			//Initial pagesize
                    columnPicker: true,         //Show the columnPicker button
                    sorting: true,
                    transition: 'fade',  //(bounce, fade, flip, rotate, scroll, slide).
                    checkboxes: false,           //Make rows checkable. (Note. You need a column with the 'unique' property)
                    checkAllToggle: false,        //Show the check-all toggle//+RQLBuilder.like("KEYY", "a").rql()
                    rowClicked: function (data) {
                    },
                    //----------------基本restful地址---
                    //restbase: '../json/collectfee/gasdayreportdetail.json',
                    restURL: 'hzqs/dbc/pbsel.do?fh=SELDBC0000000J00&resp=bd&proxy=VSELDBC000000J00&bd=' + encodeURIComponent(JSON.stringify(bd)),
                    //---------------行定义
                    coldefs: [
                        {
                            col: "areaName",
                            friendly: "供气区域",
                            unique: true,
                            readonly: "readonly",
                            index: 1
                        },
                        {
                            col: "customerCode",
                            friendly: "客户编号",
                            unique: true,
                            readonly: "readonly",
                            index: 1
                        },
                        {
                            col: "customerName",
                            friendly: "客户姓名",
                            readonly: "readonly",
                            index: 2
                        },
                        {
                            col: "customerAddress",
                            friendly: "客户地址",
                            readonly: "readonly",
                            index: 3
                        },
                        {
                            col: "customerKind",
                            friendly: "客户类别",
                            readonly: "readonly",
                            index: 4,
                            format: customerKindFormat
                        },
                        {
                            col: "customerType",
                            friendly: "下线表具类型",
                            readonly: "readonly",
                            index: 5,
                            format: customerTypeFormat
                        },
                        {
                            col: "gasTypeName",
                            friendly: "用气性质",
                            readonly: "readonly",
                            index: 6
                        },
                        {
                            col: "gas",
                            friendly: "换表计费气量",
                            readonly: "readonly",
                            index: 7
                        },
                        {
                            col: "money",
                            friendly: "换表计费金额",
                            readonly: "readonly",
                            index: 8,
                            format: moneyFormat
                        },
                        {
                            col: "tradeDate",
                            friendly: "换表时间",
                            readonly: "readonly",
                            index: 9,
                            format: timeFormat
                        }
                        // ,
                        // {
                        //     col: "userName",
                        //     friendly: "换表人",
                        //     readonly: "readonly",
                        //     index: 10
                        // }
                    ],
                    //---------------查询时过滤条件
                    findFilter: function () {//find function
                        return null;
                    }//--findFilter
                }//--init
            );//--end init
            dialog.modal('hide');
        }, 500);
    });
})