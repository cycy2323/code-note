var MerchantChargeParamAction = function () {
    return {
        init: function () {
            this.reload();
        },
        reload: function () {

            $('#divtable').html('');


                     
            this.xw = XWATable.init(
                {
                    divname: "divtable",
                    //----------------table的选项-------
                    pageSize: 50,
                    columnPicker: true,
                    transition: 'fade',
                    checkboxes: true,
                    checkAllToggle: true,
                    //----------------基本restful地址---
                    restbase: 'debasicmerchantcharge',
                    key_column: 'id',
                    coldefs: [
                        {
                            col: "id",
                            friendly: "商户ID",
                            unique: "true",
                            hidden: true,
                            nonedit: "nosend",
                            readonly: "readonly",
                            index: 1
                        },
                        {
                            col: "merchantNo",
                            friendly: "商户编码",
                            validate:"required",
                            index: 2
                        },
                        {
                            col: "chargeType",
                            friendly: "充值币",
                            validate:"required",
                            index: 3
                        },
                        {
                            col: "sumDailyDeposit",
                            friendly: "平台每天最大的充入量",
                            validate:"required",
                            index: 3
                        },
                        {
                            col: "sumDailyWithdraw",
                            friendly: "平台每天最大的提出量",
                            index: 5
                        },
                        {
                            col: "sumDailyDepositPreperson",
                            friendly: "个人每天最大的充入量",
                            index: 6
                        },
                        {
                            col: "sumDailyWithdrawPreperson",
                            friendly: "个人每天最大的提出量",
                            index: 6
                        },
                        {
                            col: "countDailyDepositPreperson",
                            friendly: "个人每天最大的充入次数",
                            index: 6
                        }
                        ,
                        {
                            col: "countDailyWithdrawPrepersion",
                            friendly: "个人每天最大的提出次数",
                            index: 6
                        }
                        ,
                        {
                            col: "maxAmountEachDepositPreperson",
                            friendly: "个人每次最大的充入次数",
                            index: 6
                        }
                        ,
                        {
                            col: "maxAmountEachWithdrawPrepersion",
                            friendly: "个人每次最大的提出次数",
                            index: 6
                        }
                        ,
                        {
                            col: "BLOCKS_CONFIRM",
                            friendly: "区块确认的块数",
                            index: 6
                        }
                        
                    ],
                    // 查询过滤条件
                    findFilter: function () {
                        var find_roleName;
                        if ($('#find_roleName').val()) {
                            find_roleName = RQLBuilder.like("roleName", $.trim($('#find_roleName').val()));
                        }
                        var filter = RQLBuilder.and([
                            find_roleName
                        ]);
                        return filter.rql();
                    },

                    onAdded: function(ret,jsondata){
                        return  validateForm(jsondata);
                    },
                    onUpdated: function(ret,jsondata){
                        return  validateForm(jsondata);
                    },
                    onDeleted: function(ret,jsondata){
                    },
                })
        }
    }
}();


