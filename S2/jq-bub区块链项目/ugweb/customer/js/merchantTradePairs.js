var MerchantTradePairAction = function () {
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
                    restbase: 'debasicmerchanttradepairs',
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
                            col: "coinTypeP1",
                            friendly: "交易对币1",
                            validate:"required",
                            index: 3
                        },
                        {
                            col: "coinTypeP2",
                            friendly: "交易对币2",
                            validate:"required",
                            index: 3
                        },
                        {
                            col: "createTime",
                            friendly: "创建时间",
                            index: 5
                        },
                        {
                            col: "creater",
                            friendly: "创建人",
                            index: 6
                        },
                        {
                            col: "updateTime",
                            friendly: "修改时间",
                            index: 6
                        },
                        {
                            col: "updater",
                            friendly: "修改人",
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


