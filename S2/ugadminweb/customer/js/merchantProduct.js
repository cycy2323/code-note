var MerchantProductAction = function () {
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
                    restbase: 'debasicmerchantinfo',
                    key_column: 'tdBasicMerchantProductResNo',
                    coldefs: [
                        {
                            col: "tdBasicMerchantProductResNo",
                            friendly: "ID",
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
                            col: "productNo",
                            friendly: "产品编码",
                            validate:"required",
                            index: 3
                        },
                        {
                            col: "fee",
                            friendly: "单条费用",
                            validate:"required",
                            index: 3
                        },
                        {
                            col: "agencyFee",
                            friendly: "单条分销商分润费用",
                            validate:"required",
                            index: 5
                        },
                        {
                            col: "serstartTime",
                            friendly: "服务开始时间",
                            index: 6
                        },
                        {
                            col: "serendTime",
                            friendly: "服务结束时间",
                            index: 6
                        },
                        {
                            col: "limitNumDay",
                            friendly: "单日次数限制",
                            index: 6
                        },
                        {
                            col: "limitNumAll",
                            friendly: "累计次数限制",
                            index: 6
                        },
                        {
                            col: "description",
                            friendly: "描述",
                            index: 6
                        },
                        {
                            col: "status",
                            friendly: "状态",
                            index: 6
                        },
                        {
                            col: "rechargeMoney",
                            friendly: "充值金额",
                            index: 6
                        },
                        {
                            col: "surplusMoney",
                            friendly: "剩余金额",
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


