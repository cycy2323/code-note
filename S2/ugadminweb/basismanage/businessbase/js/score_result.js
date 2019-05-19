var areaId = JSON.parse(localStorage.getItem("user_info")).area_id;
var TypeBuilder=function(val){
    if(val=="0"){
        return "<select id='scoreType' name='scoreType' class='form-control select2me'>" +
            "<option value='1' selected>用气量</option>" +
            "<option value='2' selected>平均差价</option>" +
            "<option value='3' selected>贷款</option>" +
            "<option value='4' selected>企业</option>" +
            "<option value='5' >业务</option></select>" ;
    }else if(val=="1"){
        return "<select id='scoreType' name='scoreType' class='form-control select2me'>" +
            "<option value='1' selected>用气量</option>" +
            "<option value='2' selected>平均差价</option>" +
            "<option value='3' selected>贷款</option>" +
            "<option value='4' selected>企业</option>" +
            "<option value='5' >业务</option></select>" ;
    }else if(val=="2"){
        return "<select id='scoreType' name='scoreType' class='form-control select2me'>" +
            "<option value='1' selected>用气量</option>" +
            "<option value='2' selected>平均差价</option>" +
            "<option value='3' selected>贷款</option>" +
            "<option value='4' selected>企业</option>" +
            "<option value='5' >业务</option></select>" ;
    }else{
        return "<select id='scoreType' name='scoreType' class='form-control select2me'>" +
            "<option value='1' selected>用气量</option>" +
            "<option value='2' selected>平均差价</option>" +
            "<option value='3' selected>贷款</option>" +
            "<option value='4' selected>企业</option>" +
            "<option value='5' >业务</option></select>" ;
    }
};

var xw;
var scoreAction = function () {
    var scoreTypeFormat = function () {
        return {
            f: function (val) {
                if (val === "1") return "用气量";
                else if (val === "2") return "平均差价";
                else if (val === "3") return "贷款";
                else if (val === "4") return "企业";
                else if (val === "5") return "业务";
                else return "error";
            }
        }
    }();
    return {

        init: function () {
            this.reload();
        },
        reload: function () {
            $('#divtable').html('')
            var queryCondion;
            if(areaId == "1"){
                queryCondion = RQLBuilder.and([
                    RQLBuilder.equal("status","1"),
                ]).rql()

            }else{
                queryCondion = RQLBuilder.and([
                    RQLBuilder.equal("areaId",areaId),
                    RQLBuilder.equal("status","1")
                ]).rql()
            }

            xw = XWATable.init(
                {
                    divname: "divtable",
                    //----------------table的选项-------
                    pageSize: 50,
                    columnPicker: true,
                    transition: 'fade',
                    checkboxes: true,
                    checkAllToggle: true,
                    //----------------基本restful地址---
                    restbase: 'gasbizlevelscore/?query='+queryCondion,
                    key_column: 'scoreId',
                    coldefs: [
                        {
                            col: "scoreId",
                            friendly: "Id",
                            unique: true,
                            hidden: true,
                            readonly: "readonly",
                            nonedit: "nosend",
                            index: 1
                        },
                        {

                            col: "scoreType",
                            friendly: "评价指标",
                            validate:"required",
                            inputsource:"select",
                            format:scoreTypeFormat,
                            inputsource: "custom",
                            inputbuilder: "TypeBuilder",
                            sorting:false,
                            index: 2
                        },
                        {
                            col: "scoreWeight",
                            friendly: "权重",
                            validate:"required",
                            index: 3
                        },
                        {
                            col: "score",
                            friendly: "得分",
                            validate:"required",
                            index: 4
                        },
                        {
                            col: "numMin",
                            friendly: "最小量",
                            index: 5
                        },
                        {
                            col: "numMax",
                            friendly: "最大量",
                            index: 6
                        },
                        {
                            col: "scoreName",
                            friendly: "评分标准",
                            validate:"required",
                            index: 7
                        }
                    ],
                    // 查询过滤条件
                    findFilter: function () {
                        var find_scoreType;


                        if ($('#find_scoreType option:selected').val()) {
                            find_scoreType = RQLBuilder.equal('scoreType', $('#find_scoreType option:selected').val());
                        }

                        var filter = RQLBuilder.and([
                            find_scoreType
                        ]);

                        xw.setRestURL(hzq_rest + 'gasbizlevelscore');
                        return filter.rql();
                    },

                    onAdded: function(ret,jsondata){
                        return  validateForm(jsondata);
                    },
                    onUpdated: function(ret,jsondata){
                        return  validateForm(jsondata);
                    },
                    onDeleted: function(ret,jsondata){
                    }
                }
            )
        }

    }
}();

$('#saveId').click(function () {
    if(!$('#scoreType option:selected').val()){
        bootbox.alert("评价指标不能为空");
        return false;
    }
    if(!$('#scoreWeight').val()){
        bootbox.alert("权重不能为空");
        return false;
    }
    if(!$('#score').val()){
        bootbox.alert("得分不能为空");
        return false;
    }
    if(!$('#numMin').val() &&
        ($('#scoreType option:selected').val() == '1' ||$('#scoreType option:selected').val()=='2')){
        bootbox.alert("最小量不能为空");
        return false;
    }
    if(!$('#numMax').val() &&
        ($('#scoreType option:selected').val() == '1' ||$('#scoreType option:selected').val()=='2')){
        bootbox.alert("最大量不能为空");
        return false;
    }
    var standard = $('#numMin').val()+"-"+$('#numMax').val();
    $.ajax({
        url: "trade/dbc/pbsel.do",
        type: "POST",
        contentType: "application/json;charset=utf-8",
        data: JSON.stringify({
            cols: "numMin,numMax",
            froms: " gasBizLevelScore",
            wheres: "scoreType='"+$('#scoreType option:selected').val()+"' " +
                    " and ((num_min<="+$('#numMin').val()+" and num_max>="+$('#numMin').val()+") " +
                    " or (num_min<="+$('#numMax').val()+" and num_max>="+$('#numMax').val()+"))",
            page: "false"
        }),
        dataType: "json",
        success: function (data) {
            if(data.rows){
                if(data.rows.length > 1){
                    bootbox.alert("最大量，最小量重复");
                    return;
                }else{
                    if(data.rows[0].numMax != 99999999 &&
                        ($('#scoreType option:selected').val() == 1 ||$('#scoreType option:selected').val() == 2)){
                        bootbox.alert("最大量，最小量重复");
                        return;
                    }else{
                        if(data.rows[0].numMin == $('#numMin').val() &&
                            ($('#scoreType option:selected').val() == 1 ||$('#scoreType option:selected').val() == 2)){
                            bootbox.alert("最大量，最小量重复");
                            return;
                        }
                    }

                }
            }
            var param={
                "scoreId":GasModService.getUuid(),
                "scoreType":$('#scoreType option:selected').val(),
                "numMin":$('#numMin').val(),
                "numMax":$('#numMax').val(),
                "score":$('#score').val(),
                "scoreName":standard,
                "scoreWeight":$('#scoreWeight').val(),
                "status":"1",
                "createdTime":new Date(moment().format('yyyy-MM-dd hh:mm:ss')+"-00:00"),//userinfo.userId,
                "createdBy":UserInfo.userId(),
                "modifiedTime":new Date(moment().format('yyyy-MM-dd hh:mm:ss')+"-00:00"),
                "modifiedBy":UserInfo.userId(),

            }

            var result = Restful.insert(hzq_rest + "gasbizlevelscore", param);
            if(result['success']){
                bootbox.alert("保存成功",function () {
                    window.location.reload();
                });
                // $("button[name='cancel']").click();
                // $(".btn .btn-default").click();

            }else{
                bootbox.alert("保存失败");

            }

        }
    });



});
$('#updateId').click(function () {
    var xwdata = xw.getTable().getData(true);
    if(!$('#scoreWeight1').val()){
        bootbox.alert("权重不能为空");
        return false;
    }
    if(!$('#score1').val()){
        bootbox.alert("得分不能为空");
        return false;
    }
    if(!$('#numMin1').val() &&
        (xwdata.rows[0].scoreType == '1' ||xwdata.rows[0].scoreType =='2')){
        bootbox.alert("最小量不能为空");
        return false;
    }
    if(!$('#numMax1').val() &&
        (xwdata.rows[0].scoreType == '1' ||xwdata.rows[0].scoreType =='2')){
        bootbox.alert("最大量不能为空");
        return false;
    }

    var standard = $('#numMin1').val()+"-"+$('#numMax1').val();
    $.ajax({
        url: "trade/dbc/pbsel.do",
        type: "POST",
        contentType: "application/json;charset=utf-8",
        data: JSON.stringify({
            cols: "numMin,numMax",
            froms: " gasBizLevelScore",
            wheres: "scoreType='"+$('#scoreType1 option:selected').val()+"' " +
            " and ((num_min<="+$('#numMin1').val()+" and num_max>="+$('#numMin1').val()+") " +
            " or (num_min<="+$('#numMax1').val()+" and num_max>="+$('#numMax1').val()+"))",
            page: "false"
        }),
        dataType: "json",
        success: function (data) {
            if(data.rows){
                if(data.rows.length > 1){
                    bootbox.alert("最大量，最小量重复");
                    return;
                }else{
                    if(data.rows[0].numMax != 99999999
                        && (data.rows[0].scoreType == '1' || data.rows[0].scoreType == '2')){
                        bootbox.alert("最大量，最小量重复");
                        return;
                    }else{
                        //年度用气量不能有交集
                        if(data.rows[0].numMin == $('#numMin1').val() && data.rows[0].scoreType == '1' ){
                            bootbox.alert("最大量，最小量重复");
                            return;
                        }
                    }

                }
            }
            var param={
                "numMin":$('#numMin1').val(),
                "numMax":$('#numMax1').val(),
                "score":$('#score1').val(),
                "scoreName":standard,
                "scoreWeight":$('#scoreWeight1').val(),
                "status":"1",
                "modifiedTime":new Date(moment().format('yyyy-MM-dd hh:mm:ss')+"-00:00"),
                "modifiedBy":UserInfo.userId(),

            }

            var ret=Restful.updateRNQ(hzq_rest+"gasbizlevelscore", xwdata.rows[0].scoreId,param);
            if(ret.success){
                bootbox.alert("<center><h4>修改成功。</h4></center>",function(){
                    window.location.reload();
                })
            }else{
                bootbox.alert("<center><h4>修改失败。</h4></center>")
            }

        }
    });



});
$("#upd_buttons").on("click",function(){
    var selrows = xw.getTable().getData(true);
    if(selrows.rows.length == "0"){
        bootbox.alert("<center><h4><br>请选择需要修改的行。</h4></center>")
        return false;
    }else if(selrows.rows.length > 1){
        bootbox.alert("<center><h4><br>只能编辑一条</h4></center>")
        return false;
    }
    $('#scoreType1').val(selrows.rows[0].scoreType).trigger("change");
    $('#scoreWeight1').val(selrows.rows[0].scoreWeight);
    $('#score1').val(selrows.rows[0].score);
    $('#numMin1').val(selrows.rows[0].numMin);
    $('#numMax1').val(selrows.rows[0].numMax);
})



