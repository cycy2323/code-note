var xw;

var aac = "<div class='btn-group form-group'>" +
    "<button id='edit_btn' class='btn green check' data-target='#edit_gp_btn' data-toggle='modal'>" +
    "<i class='fa fa-eye'></i> 查看&nbsp;" +
    "</button>" +
    "</div>";
var Caozuo = function(val) {
    return aac;

}();
//支付方式
var tradeType = function(val) {
    return {
        f: function(val) {
            if(val == 1) {
                return "APP扫码支付";
            } else if(val == 2) {
                return "H5支付"
            } else if(val == 3) {
                return "APP支付"
            } else if(val == 4) {
                return "-"
            }
        },
    }
}();
//状态
var transferStatus = function(val) {
    return {
        f: function(val) {
            if(val == 1) {
                return "成功";
            } else if(val == 2) {
                return "失败"
            }
        },
    }
}();
//金额格式化
var formatNumber = function(val) {
    return {
        f: function(val) {
            return val+" AB"
        },
    }
}();
//类型格式化
var typeStr = function(val) {
    return {
        f: function(val) {
            if(val==1){
                return '转入'
            } else if(val == 2) {
                return "转出"
            }
        },
    }
}();
var orderHistoryRecord = function() {

    return {

        init: function() {
            // 顺序有影响 (先抓选单, 再抓暂存选单, 再执行其他)

            this.reload();
        },

        reload: function() {

            var bd = {}

            $('#divtable').html('');
            xw = XWATable.init({
                divname: "divtable",
                //----------------table的选项-------
                pageSize: 10,
                // pageNumber: 1,
                columnPicker: false,
                transition: 'fade',
                checkboxes: true,
                checkAllToggle: true,
                saveColumn:false,
                //----------------基本restful地址---
                restURL: '/mf/ing/pbiqs.do'+"?bd="+encodeURIComponent(JSON.stringify(bd)),
                coldefs: [{
                    col: "orderNo",
                    friendly: "订单编号",
                    validate: "orderNo",
                    index: 1
                },
                    {
                        col: "userId",
                        friendly: "用户ID",
                        validate: "userId",
                        index: 2
                    },{
                        col: "orderAmount",
                        friendly: "订单金额",
                        validate: "orderAmount",
                        index: 3
                    },{
                        col: "realAmount",
                        friendly: "实际金额",
                        validate: "realAmount",
                        index: 4
                    },{
                        col: "createDate",
                        friendly: "创建时间",
                        validate: "createDate",
                        index: 5
                    },
                    {
                        col: "callbackDate",
                        friendly: "充值时间",
                        validate: "callbackDate",
                        index: 6,
                        format:{
                            f:function(val){
                                if(val == null){
                                    return "-";
                                }
                                return val
                            }
                        }
                    },
                    {
                        col: "orderState",
                        friendly: "订单状态",
                        validate: "orderState",
                        index: 7,
                        format:{
                            f:function(val){
                                if(val == 0){
                                    return "未支付";
                                }else if(val == 1){
                                    return "支付成功";
                                }else if(val == 2){
                                    return "支付失败";
                                }else if(val == 3){
                                    return "订单取消";
                                }else{
                                    return "未知状态";
                                }
                            }
                        },
                    },
                    {
                        col: "handState",
                        friendly: "操作状态",
                        validate: "handState",
                        index: 8,
                        format:{
                            f:function(val){
                                if(val == 0){
                                    return "未加积分";
                                }else if(val == 1){
                                    return "已加积分";
                                }else{
                                    return "未知状态";
                                }
                            }
                        },
                    },
                ],
                // 查询过滤条件
                findFilter: function() {
                    var orderNO,userID,orderState,transferStatus;
                    if($('#find_orderno').val()) {
                        orderNO = RQLBuilder.equal("orderNo", $('#find_orderno').val());
                    }
                    if(!orderNO){
                        orderNO = '"orderNo":""';
                    }
                    if($('#find_buyuserid').val()) {
                        userID = RQLBuilder.equal("userId", $('#find_buyuserid').val());
                    }
                    if(!userID){
                        userID = '"userId":""';
                    }
                    if($('#find_status').val()) {
                        orderState = RQLBuilder.equal("orderState", $('#find_status').val());
                    }
                    if(!orderState){
                        orderState = '"orderState":""';
                    }
                    var filter = RQLBuilder.and([
                        userID, orderNO,orderState
                    ]);
                    xw.setRestURL("/mf/ing/pbiqs.do?bd={"+userID+","+orderNO+","+orderState+"}");
                    return filter.rql();
                },


            })
        }
    }

}();
/*查看详细信息*/
$(document).on('click','#edit_btn',function() {
    var index = $(this).closest('tr').index();
    var data = xw.getTable().getData();
    $.each(data.rows[index], function(key, val) {
        /*模态框关闭后清空模态框里填写的数据*/
        $("#edit_gp_btn").on("hidden.bs.modal", function() {
            document.getElementById("edit_form").reset();
        });
        $("form[name='edit_form'] input[name='" + key + "']").val(val);
    });
});
