

var ctmSpecialAction = function () {
    // 供气区域helper
    var areaHelper=RefHelper.create({
        ref_url:"gasbizarea",
        ref_col:"areaId",
        ref_display:"areaName"
    });
    var areaFormat=function(){
        return {
            f: function(val){
                return areaHelper.getDisplay(val);
            }
        }
    }();
    var loginarea = [];
    var areaId = JSON.parse(localStorage.getItem("user_info")).area_id
    GasModSys.areaList({
        "areaId":areaId,
        "cb":function(data){
            console.log(data)
            $.each(data,function(key,val){
                loginarea.push(val.areaId);
                $('#find_unit').append('<option value="'+val.areaId+'" name="'+val.areaId+'">'+val.areaName+'</option>');
                $('#find_units').append('<option value="'+val.areaId+'" name="'+val.areaId+'">'+val.areaName+'</option>');
            })
        }
    });
    return {

        init: function () {
            this.reload();
            this.reload2();
        },

        reload:function(){
            $('#divtable').html('');
            var lowerProtectionFormat = function(){
                return{
                    f:function(val){
                        if(val == 1){
                            return "低保"
                        }else if(val == 2){
                            return "低收入"
                        }else if(val == 3){
                            return "低困（困难家庭）"
                        }
                    }
                }
            }();
            var bd = {
                "cols":"a.specific_id,a.social_account,a.customer_code,a.specific_type,b.ctm_archive_id,b.customer_address,b.customer_name,b.area_id,a.createdTime",
                "froms":"gas_ctm_specific a left join gas_ctm_archive b on b.customer_code=a.customer_code",
                "wheres":"1=1 and b.area_id in ("+loginarea.join()+")",
                "page":true,
                "limit":50
            }
            var ss={
                "areaId":"db@GAS_BIZ_AREA,areaId,areaName",
                "specificType":"1:低保,2:低收入,3:低困"
            }
            xw=XWATable.init(
                {
                    divname: "divtable",
                    //----------------table的选项-------
                    pageSize:50,
                    columnPicker: true,
                    transition: 'fade',
                    findbtn: "find_button1",
                    tableId: "tableId",
                    checkboxes: true,
                    checkAllToggle:true,
                    //----------------基本restful地址---
                    // restbase: 'gascsrlowincome',
                    exportxls: {
                        title:"导出数据",
                        remap: ss,
                        hidden:false,
                        ci:{}
                    },

                    restURL: "/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd=" + encodeURIComponent(JSON.stringify(bd)),
                    key_column: "specificId",
                    //---------------行定义
                    coldefs:[

                        {
                            col:"areaId",
                            friendly:"供气区域",
                            format:areaFormat,
                            index:1
                        },
                        {
                            col:"customerName",
                            friendly:"客户姓名",
                            index:2
                        },
                        {
                            col:"customerCode",
                            friendly:"客户编号",
                            index:3
                        },
                        {
                            col:"socialAccount",
                            friendly:"保障号",
                            index:4
                        },

                        {
                            col:"customerAddress",
                            friendly:"客户地址",
                            index:5
                        },
                        {
                            col:"specificType",
                            format:lowerProtectionFormat,
                            friendly:"特殊用户类型",
                            index:6
                        },{
                            col:"createdTime",
                            friendly:"时间",
                            index:7,
                            format:function(){
                                return {
                                    f:function(val){
                                        return val.split("T").join(" ")
                                    }
                                }
                            }()
                        }

                    ],
                    findFilter: function(){
                        var whereinfo = "";
                        if ($("#find_unit").val()) {
                            whereinfo += " b.area_id = '" + $("#find_unit").val() + "' and ";
                        }

                        if ($("#find_customerName").val()) {
                            whereinfo += " b.customer_name like  '%" + $("#find_customerName").val() + "%' and ";
                        }
                        if ($("#find_customerAddress").val()) {
                            whereinfo += " b.customer_address like  '%" + $("#find_customerAddress").val() + "%' and ";
                        }
                        if ($("#find_customerCode").val()) {
                            whereinfo += " a.customer_code like '%" + $('#find_customerCode').val() + "%' and ";
                        }

                        if ($("#find_idcardno").val()) {
                            whereinfo += " a.social_account like '%" + $('#find_idcardno').val() + "%' and ";
                        }
                        if ($("#find_specificType").val()) {
                            whereinfo += " a.specific_type = '" + $('#find_specificType').val() + "' and ";
                        }

                        var bd = {
                            "cols":"a.specific_id,a.social_account,a.customer_code,a.specific_type,b.ctm_archive_id,b.customer_address,b.customer_name,b.area_id,a.createdTime",
                            "froms":"gas_ctm_specific a left join gas_ctm_archive b on b.customer_code=a.customer_code",
                            "wheres":whereinfo + " b.area_id in ("+loginarea.join()+")",
                            "page":true,
                            "limit":50
                        }

                        xw.setRestURL("/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd=" + encodeURIComponent(JSON.stringify(bd)));
                    }

                })
        },
        reload2:function(){
            $('#divtable1').html('');
            var gasTypeIdFormat =function(){
                return{
                    f:function(val){
                        if(val=="202"){
                            return "居民低保"
                        }else if(val == "203"){
                            return "居民低收入"
                        }else if(val == "204"){
                            return "居民低困难"
                        }
                    }
                }
            }();

            var db = {
                "cols":"a.*",
                "froms":"gas_ctm_archive a",
                "wheres":"not exists (select customer_code from gas_ctm_specific b where customer_code= a.customer_code) and a.area_id in ("+loginarea.join()+") and a.gas_type_id in ('202','203','204')",
                "page":true,
                "limit":50
            }
            xws=XWATable.init({
                divname: "divtable1",
                //----------------table的选项-------
                pageSize:50,
                columnPicker: true,
                transition: 'fade',
                tableId: "tableId1",
                findbtn: "find_buttons",
                checkboxes: true,
                checkAllToggle:true,
                //----------------基本restful地址---
                // restbase: 'gasctmarchive',
                restURL: "/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd=" + encodeURIComponent(JSON.stringify(db)),
                key_column: "ctmArchiveId",
                //---------------行定义
                coldefs:[

                    {
                        col:"areaId",
                        friendly:"供气区域",
                        format:areaFormat,
                        index:1
                    },
                    {
                        col:"customerName",
                        friendly:"客户姓名",
                        index:2
                    },
                    {
                        col:"customerCode",
                        friendly:"客户编号",
                        index:3
                    },
                    {
                        col:"customerAddress",
                        friendly:"客户地址",
                        index:4
                    },
                    {
                        col:"gasTypeId",
                        format:gasTypeIdFormat,
                        friendly:"用气性质",
                        index:6
                    }
                ],
                findFilter: function(){
                    var whereinfo = "";
                    if ($("#find_units").val()) {
                        whereinfo += " a.area_id = '" + $("#find_units").val() + "' and ";
                    }

                    if ($("#find_customerNames").val()) {
                        whereinfo += " a.customer_name like  '%" + $("#find_customerNames").val() + "%' and ";
                    }
                    if ($("#find_customerAddresss").val()) {
                        whereinfo += " a.customer_address like  '%" + $("#find_customerAddresss").val() + "%' and ";
                    }
                    if ($("#find_customerCodes").val()) {
                        whereinfo += " a.customer_code like '%" + $('#find_customerCodes').val() + "%' and ";
                    }

                    var db = {
                        "cols":"a.*",
                        "froms":"gas_ctm_archive a",
                        "wheres":whereinfo + "not exists (select customer_code from gas_ctm_specific b where customer_code= a.customer_code) and a.area_id in ("+loginarea.join()+") and a.gas_type_id in ('202','203','204')",
                        "page":true,
                        "limit":50
                    }

                    xws.setRestURL("/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd=" + encodeURIComponent(JSON.stringify(db)));
                }

            })
        }


    }
}();


