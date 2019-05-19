/**
 * Created by anne on 2017/6/3.
 */
var loginarea = [];
var areaId = JSON.parse(localStorage.getItem("user_info")).area_id
GasModSys.areaList({
    "areaId":areaId,
    "cb":function(data){
        console.log(data)
        $.each(data,function(key,val){
            loginarea.push("'"+val.areaId+"'");
            $('#find_areaId').append('<option value="' + val.areaId + '" name="' + val.areaId + '">' + val.areaName + '</option>');
        })
    }
});

var ChargeCorrectAction= function () {
    //用户helper
    var userHelper=RefHelper.create({
        ref_url:"gassysuser",
        ref_col:"userId",
        ref_display:"employeeName",
    });

    var userHelperFormat=function () {
        return{
            f:function(val){
                return userHelper.getDisplay(val)
            }
        }
    }();
    //抄表本helper
    var bookHelper=RefHelper.create2({
        ref_url:"gasmrdbook",
        ref_col:"bookId",
        ref_display:"bookCode",
    });

    var bookHelperFormat=function () {
        return{
            f:function(val){
                return bookHelper.getDisplay(val)
            }
        }
    }();
    //供气区域helper
    var areaHelper=RefHelper.create({
        ref_url:"gasbizarea",
        ref_col:"areaId",
        ref_display:"areaName",
    });

    var areaHelperFormat=function () {
        return{
            f:function(val){
                return areaHelper.getDisplay(val)
            }
        }
    }();

    var dateFormat = function () {
        return{
            f: function (val) {
                if(val){
                    var data= val.split("T");
                    return data.join(" ");
                }
            }
        }
    }();

    //审核状态
    var examineState= function () {
        return {
            f: function (val,row) {
                console.log(row)
                if(val==="1") return "<font color=''>审核中</font>";
                else if(val==="2") return "<font color=''>审核通过</font>";
                else if(val==="3") return "<font color=''>审核未通过</font>";
                else if(val==="4") return "<font color=''>待审批</font>";
                else if(val==="5") return "<font color=''>已撤销</font>";
                else return "error";
            }
        }
    }()

    return {

        init: function () {
            // 顺序有影响 (先抓选单, 再抓暂存选单, 再执行其他)
            this.reload();
            this.initHelper();

        },

        initHelper:function(){
            //correct_reason select init
            //
            // $.each(GasModSys.areaHelper.getRawData(), function (idx, row) {
            //     $('#find_areaId').append('<option value="' + row.areaId + '" name="' + row.areaId + '">' + row.areaName + '</option>');
            // });

            $('#find_areaId').on('change',function(e){
                console.log("change area:"+e+"."+$('#find_areaId').val());
                GasModSys.counterUsersInArea({
                    "areaId":$('#find_areaId').val(),
                    "cb":function(data){
                        var inhtml = "<option value=''>全部</option>";
                        $.each(data,function(idx,row){
                            inhtml += '<option value="'+row.userId+'">'+row.employeeName+'</option>';
                        })
                        $("#find_countperId").html(inhtml);
                        $("#find_countperId").val("").change();

                    }
                })
                xw.autoResetSearch();
            })

            $('#find_countperId').on('change',function(e){
                console.log("change counter:"+e+"."+$('#find_countperId').val());
                GasModSys.copyUsersInArea({
                    "areaId":$('#find_areaId').val(),
                    "countperId":$('#find_countperId').val(),
                    "cb":function(data){
                        var inhtml = "<option value=''>全部</option>";
                        if(data){
                            $.each(data,function(idx,row){
                                inhtml += '<option value="'+row.userId+'">'+row.employeeName+'</option>';
                            })
                        }
                        $("#find_serviceperId").html(inhtml);
                        $("#find_serviceperId").val("").change();

                    }
                })
                xw.autoResetSearch();
            })
            $('#find_serviceperId').on('change',function(e){
                xw.autoResetSearch();
            });

        },


        reload : function(){
            $('#divtable').html('');

            /*
             select a.* from (select * from  psm_step_inst d where d.GS_ECODE='PFIVE' and d.step_status='8' and D.FLOW_DEF_ID ='CHSQ' AND D.RESULTS='0') t LEFT JOIN gas_csr_busi_register a on a.FLOW_INSTANCE = t.flow_inst_id
             left join gas_ctm_archive b on b.customer_code = a.customer_code left join gas_mrd_book c on c.book_id=b.book_id*/
            var bd={
                "cols":"a.*,c.book_code,b.gas_type_id,c.countper_id,c.serviceper_id",// and d.step_status='8'
                "froms":"gas_csr_busi_register a left join gas_ctm_archive b on b.customer_code = a.customer_code " +
                "left join gas_mrd_book c on c.book_id=b.book_id",
                "wheres":"a.area_id in ("+loginarea.join()+") and a.business_type_id ='CHSQ' and a.bill_state='3' order by a.accept_date desc,a.finish_date desc",
                "page":true,
                "limit":50
            }
            console.log(bd)
            /* rf= RFTable.init(*/
            $('#divtable').html('');
            var reasonTypeFormat = function () {
                return {
                    f: function (val) {
                        if (val == "1") {
                            return "死表"
                        } else if (val == "2") {
                            return "下线表用量未收回"
                        } else if (val == "3") {
                            return "其他"
                        }
                    }
                }
            }();
            var businessTypeHelper = RefHelper.create({
                ref_url: 'gascsrbusinesstype/?query={"busiType":"0"}',
                ref_col: "businessTypeId",
                ref_display: "name",
                "sort":"no"
            });
            var businessTypeFormat= function () {
                return {
                    f: function (val,row) {
                        console.log(row)
                        return businessTypeHelper.getDisplay(val);
                    },
                }
            }();
            var gasTypeHelper = RefHelper.create({
                ref_url: "gasbizgastype",
                ref_col: "gasTypeId",
                ref_display: "gasTypeName",
            });
            var gasTypeHelperFormat= function () {
                return {
                    f: function (val) {
                        return gasTypeHelper.getDisplay(val);
                    },
                }
            }();
            var oldFormat= function () {
                return {
                    f: function (val,row) {
                        var oldGsatype = JSON.parse(row.reservedField1).customerCodeBefore
                        return oldGsatype;
                    },
                }
            }();

             var baforenameFormat= function () {
                return {
                    f: function (val,row) {
                        var oldGsatypes = JSON.parse(row.reservedField1).customerNameBefore
                        return oldGsatypes;
                    },
                }
            }();
            var moneyFormat= function () {
                return {
                    f: function (val,row) {
                        if(JSON.parse(row.reservedField1)){
                            var oldGsatype = Number(JSON.parse(row.reservedField1).strandMoney).toFixed(2)
                            return oldGsatype;
                        }

                    },
                }
            }();
             var descriptionssFormat= function () {
                        return {
                            f: function (val,row) {
                                if(JSON.parse(row.reservedField1)){
                                    var oldGsatype = JSON.parse(row.reservedField1).remark
                                    return oldGsatype;
                                }

                            },
                        }
                    }();

            var global_remap = {
                "businessTypeId":"CHANGEGT:用气性质变更,CHANGEGT2B:用气性质变更转商,CHANGEGT2R:用气性质变更转民",
                "gasTypeId":"db@GAS_BIZ_GAS_TYPE,gasTypeId,gasTypeName"
            }
            // xw=XWATable.init(
            xw = XWATable.init(
                {
                    divname : "divtable",
                    //----------------table的选项-------
                    pageSize : 50,
                    // pageSize : 200,
                    columnPicker : true,
                    transition : 'fade',
                    checkAllToggle:true,
                    exportxls: {
                        title:"用气性质变更",
                        remap:global_remap,
                        hidden:true,
                        ci:{}
                    },
                    restURL : "/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd="+encodeURIComponent(JSON.stringify(bd)),
                    coldefs:[
                        {
                            col: "areaId",
                            friendly: "供气区域",
                            format:areaHelperFormat,
                            sorting: false,
                            index: 1
                        },
                        {
                            col: "businessTypeId",
                            friendly: "类型",
                            sorting: false,
                            format:businessTypeFormat,
                            index: 2
                        },
                        {
                            col: "customerName",
                            friendly: "客户名称",
                            sorting: false,
                            index: 4
                        },
                        {
                            col: "customerCode",
                            friendly: "客户编号",
                            sorting: false,
                            index: 5
                        },
                        {
                            col : 'countperId',
                            format:userHelperFormat,
                            friendly : '核算员',
                            sorting:false,
                            index : 5
                        },
                        {
                            col : 'serviceperId',
                            format:userHelperFormat,
                            friendly : '抄表员',
                            sorting:false,
                            index : 6
                        },
                        {
                            col: "bookCode",
                            friendly: "抄表本",
                            sorting: false,
                            index: 7
                        },
                        {
                            col: "customerAddr",
                            friendly: "客户地址",
                            sorting: false,
                            index: 8
                        },
                        {
                            col: "customerAddr",
                            friendly: "客户地址",
                            sorting: false,
                            index: 9
                        },
                        {
                            col: "gasTypeId",
                            friendly: "用气性质",
                            format:gasTypeHelperFormat,
                            sorting: false,
                            index: 10
                        },
                        {
                            col: "oldgasTypeId",
                            friendly: "串前客户号",
                            format:oldFormat,
                            sorting: false,
                            index: 11
                        },
                        {
                            col: "acceptDatess",
                            friendly: "串前客户名称",
                            format:baforenameFormat,
                            sorting: false,
                            index: 12
                        },
                         {
                            col: "beforename",
                            friendly: "串款金额",
                            format:moneyFormat,
                            sorting: false,
                            index: 13
                        },
                        {
                            col: "acceptDate",
                            friendly: "受理时间",
                            index: 14
                        },
                        {
                            col: "finishDate",
                            friendly: "完成时间",
                            // format:dateForat,
                            index: 15
                        },
                        {
                            col: "linkMan",
                            friendly: "联系人",
                            sorting: false,
                            index: 16
                        },
                        {
                            col: "linkPhone",
                            friendly: "联系电话",
                            sorting: false,
                            index: 17
                        },
                        {
                            col: "descriptionss",
                            friendly: "业务说明",
                            format:descriptionssFormat,
                            sorting: false,
                            index: 18
                        }
                    ],
                    // 查询过滤条件
                    findFilter : function(){
                        var sql= " 1=1 ";

                        if ($('#find_customerCode').val()) {
                            sql+=" and a.customer_code like '%"+$('#find_customerCode').val()+"%'";
                        }
                        if ($('#find_customerName').val()) {
                            sql+=" and a.customer_name like '%"+$('#find_customerName').val()+"%'";
                        }
                        if ($('#find_areaId option:selected').val()) {
                            sql+= " and a.area_id = '"+$('#find_areaId').val()+"'"
                        }else{
                            sql+= " and a.area_id in ("+loginarea.join()+") "
                        }
                        if ($("#find_countperId").val()) {
                            sql+= " and c.countper_id = '"+$("#find_countperId").val()+"'"
                        }
                        if ($("#find_serviceperId").val()) {
                            sql+= " and c.serviceper_id = '"+$("#find_serviceperId").val()+"'"
                        }
                        if ($("#find_customerKind").val()) {
                            sql+= " and b.customer_kind = '"+$("#find_customerKind").val()+"'"
                        }


                        if ($("#find_start_date1").val() && $("#find_end_date1").val()) {
                            sql += " and to_char(a.accept_date,'yyyy-mm-dd')  between '" + $('#find_start_date1').val() + "' and '" + $("#find_end_date1").val() + "'";
                        } else if ($("#find_start_date1").val() && !$("#find_end_date1").val()) {
                            bootbox.alert("请输入截止日期")
                        } else if (!$("#find_start_date1").val() && $("#find_end_date1").val()) {
                            bootbox.alert("请输入起始日期")
                        }

                        if ($("#book_code").val()) {
                            sql+= " and c.book_code = '"+$("#book_code").val()+"'"
                        }


                        bd={
                            "cols":"a.*,c.book_code,b.gas_type_id,c.countper_id,c.serviceper_id",
                            "froms":"gas_csr_busi_register a left join gas_ctm_archive b on b.customer_code = a.customer_code " +
                            "left join gas_mrd_book c on c.book_id=b.book_id",
                            "wheres":sql + "  and a.business_type_id ='CHSQ' and a.bill_state='3'  order by a.accept_date desc,a.finish_date desc",
                            "page":true,
                            "limit":50
                        }

                       /* bd={
                            "cols":"a.*,c.book_code,b.gas_type_id,c.countper_id,c.serviceper_id",
                            "froms":"gas_csr_busi_register a left join gas_ctm_archive b on b.customer_code = a.customer_code " +
                            "left join gas_mrd_book c on c.book_id=b.book_id  left join psm_step_inst d on a.busi_register_id = d.flow_inst_id",
                            "wheres": sql + " and d.step_status='8' and a.business_type_id = 'CHSQ' order by a.accept_date desc,a.finish_date desc",
                            "page":true,
                            "limit":50
                        }
*/
                        xw.setRestURL("/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd="+encodeURIComponent(JSON.stringify(bd)));
                        return null;
                    }
                }); // --init

        }

    }
}();





