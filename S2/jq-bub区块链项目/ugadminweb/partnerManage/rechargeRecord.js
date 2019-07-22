var xw;
var Status = function(val) {
    return {
        f: function(val) {
            if(val == 0) {
                return "未支付";
            } else if(val == 1) {
                return "支付成功";
            } else if(val == 2) {
                return "支付失败";
            } else if(val == 3) {
                return "订单取消";
            }
        },
    }
}();
var Order = function() {

    return {

        init: function() {
            // 顺序有影响 (先抓选单, 再抓暂存选单, 再执行其他)

            this.reload();
        },

        reload: function() {

            $('#divtable').html('');

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
                restURL: "/ug/bus/pbqmr.do?bd={'':''}",
                coldefs: [
                    /*{
                        col: "ugotcorderid",
                        friendly: "订单ID",
                        validate: "ugotcorderid",
                        nonedit: "nosend",

                        unique: "true",
                        index: 1
                    },*/
                    {
                        col: "orderNo",
                        friendly: "充值订单号",
                        "class": "orderNo",
                        validate: "orderNo",
                        index: 2
                    },
                    {
                        col: "userId",
                        friendly: "合作商ID",
                        validate: "userId",
                        index: 3
                    },
                    {
                        col: "orderAmount",
                        friendly: "充值BUB数量",
                        validate: "orderAmount",
                        index: 4
                    },
                    {
                        col: "realAmount",
                        friendly: "实际支付金额(CNY)",
                        validate: "realAmount",
                        index: 5
                    },
                    { //
                        col: "rewardNum",
                        friendly: "奖励BUB数量",
                        validate: "rewardNum",
                        index: 6
                    },
                    {
                        col: "orderState",
                        friendly: "订单状态",
                        validate: "orderState",
                        format: Status,
                        index: 7
                    },
                    {
                        col: "createDate",
                        friendly: "订单发起时间",
                        validate: "createDate",
                        index: 8
                    },
                    { //
                        col: "callbackDate",
                        friendly: "完成时间",
                        validate: "callbackDate",
                        index: 9
                    }
                ],
                // 查询过滤条件
                findFilter: function() {
                    var orderNo, startDate, endDate, orderState;
                    if($('#orderNo').val()) {
                        orderNo = RQLBuilder.equal("orderNo", $.trim($('#orderNo').val()));
                    }
                    if($('#createTimeStart').val()) {
                        startDate = RQLBuilder.equal("startDate", $.trim($('#createTimeStart').val()));
                    }
                    if($('#createTimeEnd').val()) {
                        endDate = RQLBuilder.equal("endDate", $.trim($('#createTimeEnd').val()));
                    }
                    if($('#orderState option:selected').val()) {
                        orderState = RQLBuilder.equal("orderState", $('#orderState  option:selected').val());
                    }

                    if(orderNo == undefined) {
                        orderNo = '"orderNo":""';
                    }
                    if(startDate == undefined) {
                        startDate = '"startDate":""';
                    }
                    if(endDate == undefined) {
                        endDate = '"endDate":""';
                    }

                    if(orderState == undefined) {
                        orderState = '"orderState":""';
                    }

                    xw.setRestURL("/ug/bus/pbqmr.do?bd={" + orderNo + "," + startDate + "," + endDate + "," + orderState + "}");
                },

            })
        }
    }

}();

layui.use('laydate', function(){
    var laydate = layui.laydate;
    //常规用法
    laydate.render({
        elem: '#createTimeEnd'
        ,type: 'datetime'
    });
    laydate.render({
        elem: '#createTimeStart'
        ,type: 'datetime'
    });
});
