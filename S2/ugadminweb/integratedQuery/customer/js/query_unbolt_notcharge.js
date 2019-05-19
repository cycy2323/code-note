/**
 * Created by alex on 2018/3/5.
 */
ComponentsPickers.init();
var area_id = JSON.parse(localStorage.getItem("user_info")).area_id;
var xw;
var areas = new Array();
areas.push(area_id);
//查询areaId下级areaId
var queryCondion = RQLBuilder.and([
    RQLBuilder.equal("status", "1"),
    RQLBuilder.equal("parentAreaId", area_id)
]).rql();
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
$.each(AreaHelper1.getRawData(), function (index, row) {
    $('#find_unit').append('<option value="' + row.areaId + '">' + row.areaName + '</option>');
});

var gasTypeHelper1 = RefHelper.create({
    ref_url: 'gasbizgastype',
    ref_col: "gasTypeId",
    ref_display: "gasTypeName",
});
var gasTypeFormat = function () {
    return {
        f: function (val) {
            return gasTypeHelper1.getDisplay(val);
        }
    }
}();
//供气区域级联
$('#find_unit').on('change', function (e) {
    console.log("change area:" + e + "." + $('#find_unit').val());
    GasModSys.counterUsersInArea({
        "areaId": $('#find_unit').val(),
        "cb": function (data) {
            var inhtml = "<option value=''>全部</option>";
            $.each(data, function (idx, row) {
                inhtml += '<option value="' + row.userId + '">' + row.employeeName + '</option>';
            });
            $("#find_countPer").html(inhtml);
            $("#find_countPer").val("").change();

        }
    })
});
$('#find_countPer').on('change', function (e) {
    console.log("change counter:" + e + "." + $('#find_countPer').val());
    $("#find_servicePer").html("");
    $("#find_servicePer").html("<option value=''>全部</option>");
    GasModSys.copyUsersInArea({
        "areaId": $('#find_unit').val(),
        "countperId": $('#find_countPer').val(),
        "cb": function (data) {
            var inhtml = "<option value=''>全部</option>";
            $.each(data, function (idx, row) {
                inhtml += '<option value="' + row.userId + '">' + row.employeeName + '</option>';
            })
            $("#find_servicePer").html(inhtml);
            $("#find_servicePer").val("").change();

        }
    })
});
var queryUnboltNotChargeAction = function () {
    var AreaHelper = RefHelper.create({
        ref_url: 'gasbizarea',
        ref_col: 'areaId',
        ref_display: 'areaName'
    });
    //抄表员
    var servicePerHelper = RefHelper.create({
        ref_url: "gassysuser",
        ref_col: "userId",
        ref_display: "employeeName",
    });
    //核算员
    var countPerHelper = RefHelper.create({
        ref_url: "gassysuser",
        ref_col: "userId",
        ref_display: "employeeName",
    });
    var AreaFormat = function () {
        return {
            f: function (val) {
                return AreaHelper.getDisplay(val);
            }
        }
    }();
    var CountPerFormat = function () {
        return {
            f: function (val) {
                return countPerHelper.getDisplay(val);
            }
        }
    }();
    var ServicePerFormat = function () {
        return {
            f: function (val) {
                return servicePerHelper.getDisplay(val);
            },
        }
    }();
    return {
        init: function () {
            this.reload();
        },
        reload: function () {
            $('#divtable').html('');
            var bd = {
                "cols": "*",
                "froms": "gas_ctm_archive a left join gas_mrd_book b on a.book_id=b.book_id",
                "wheres": '1=0 and a.area_id in(' + areas + ')',
                "page": true,
                "limit": 50
            };
            xw = XWATable.init(
                {
                    //----------------table的选项-------
                    pageSize: 50, 			//Initial pagesize
                    columnPicker: true,         //Show the columnPicker button
                    sorting: false,
                    transition: 'fade',  //(bounce, fade, flip, rotate, scroll, slide).
                    checkboxes: false,           //Make rows checkable. (Note. You need a column with the 'unique' property)
                    checkAllToggle: false,        //Show the check-all toggle//+RQLBuilder.like("KEYY", "a").rql()
                    rowClicked: function (data) {
                        console.log('row clicked');   //data.event holds the original jQuery event.
                        console.log(data);            //data.row holds the underlying row you supplied.
                    },
                    //----------------基本restful地址---
                    // restbase: "gasmrdowe/queryByCondi?areaId=" + $('#findArea').val() + "&accountPerson=" + $('#accountPerson').val() + "&meterReadingPerson=" + $('#meterReadingPerson').val() + "&meterReadingCode=" + $('#meterReadingCode').val()
                    // + "&customerCode=" + $('#customerCode').val() + "&customerName=" + $('#customerName').val(),
                    // restbase:  "gasmrdowe/queryByCondi?areaId="+$('#findArea').val()+select,
                    //---------------行定义
                    restURL: "/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd=" + encodeURIComponent(JSON.stringify(bd)),
                    coldefs: [
                        {
                            col: "ctmArchiveId",
                            // format: archiveIdFormat,
                            sorting: false,
                            unique: true,
                            hidden: true,
                            nonedit: "nosend",
                            index: 1
                        },
                        {
                            col: "areaId",
                            friendly: "供气区域",
                            format: AreaFormat,
                            readonly: "readonly",
                            index: 2
                        },
                        {
                            col: "countperId",
                            friendly: "核算员",
                            format: CountPerFormat,
                            sorting: false,
                            index: 3
                        },
                        {
                            col: "serviceperId",
                            friendly: "抄表员",
                            format: ServicePerFormat,
                            inputsource: "select",
                            sorting: false,
                            index: 4
                        },
                        {
                            col: "customerCode",
                            friendly: "客户编号",
                            readonly: "readonly",
                            index: 5
                        },
                        {
                            col: "customerName",
                            friendly: "客户名称",
                            readonly: "readonly",
                            index: 6
                        },
                        {
                            col: "customerAddress",
                            friendly: "客户地址",
                            readonly: "readonly",
                            index: 7
                        },
                        {
                            col: "bookCode",
                            friendly: "本号",
                            readonly: "readonly",
                            index: 8
                        },
                        {
                            col: "tel",
                            friendly: "电话",
                            readonly: "readonly",
                            index: 9
                        },
                        {
                            col: "unboltTime",
                            friendly: "开栓时间",
                            readonly: "readonly",
                            index: 10
                        }
                    ],
                    findFilter: function () {

                        var areaId_select = $('#find_unit option:selected').val();
                        var find_countPer = $('#find_countPer option:selected').val();
                        var find_servicePer = $("#find_servicePer option:selected").val();
                        // var copyerid = $("find_countperId").val()
                        var whereinfo = "";
                        if (areaId_select) {
                            whereinfo += " a.area_id='" + areaId_select + "' and ";
                        }
                        if (find_countPer) {
                            whereinfo += " countper_id='" + find_countPer + "' and ";
                        }
                        if (find_servicePer) {
                            whereinfo += " serviceper_id='" + find_servicePer + "' and ";
                        }
                        if ($('#find_customerCode').val()) {
                            whereinfo += " a.customer_code='" + $('#find_customerCode').val() + "' and ";
                        }
                        if ($('#find_bookCode').val()) {
                            whereinfo += " book_code='" + $('#find_bookCode').val() + "' and ";
                        }
                        if ($('#find_customerName').val()) {
                            whereinfo += " customer_name like '" + $('#find_customerName').val() + "%' and ";
                            //var find_customerCode=RQLBuilder.equal("customerCode",$.trim($('#find_customerCode').val()));
                        }
                        var bd2 = {
                            "cols": "*",
                            "froms": "gas_ctm_archive a left join gas_mrd_book b on a.book_id=b.book_id",
                            "wheres": whereinfo+' a.unbolt_time is not null and a.ctm_archive_id not in (select  ctm_archive_id from gas_chg_iccard_charge) and a.area_id in(' + areas + ')',
                            "page": true,
                            "limit": 50
                        };
                        xw.setRestURL("/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd=" + encodeURIComponent(JSON.stringify(bd2)));

                    }
                }
            );


        }

    }
}();


