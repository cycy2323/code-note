var Trans2clogsAction = function () {
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
                    restbase: 'deact2ctranslogs',
                    key_column: 'txid',
                    coldefs: [
                        {
                            col: "txid",
                            friendly: "ID",
                            unique: "true",
                            hidden: true,
                            nonedit: "nosend",
                            readonly: "readonly",
                            index: 1
                        },
                        {
                            col: "consDate",
                            friendly: "委托日期",
                            validate:"required",
                            index: 2
                        },
                        {
                            col: "txSno",
                            friendly: "交易序号",
                            validate:"required",
                            index: 3
                        },
                        {
                            col: "subTransCode",
                            friendly: "币种",
                            validate:"required",
                            index: 3
                        },
                        {
                            col: "bizType",
                            friendly: "业务类型",
                            validate:"required",
                            index: 5
                        },
                        {
                            col: "bizDtlType",
                            friendly: "业务种类",
                            index: 6
                        },
                        {
                            col: "fromFundNo",
                            friendly: "借出方",
                            index: 6
                        },
                        {
                            col: "toFundNo",
                            friendly: "接收方",
                            index: 6
                        },
                        {
                            col: "dcType",
                            friendly: "借贷类型",
                            index: 6
                        },
                        {
                            col: "amt",
                            friendly: "发生额",
                            index: 6
                        },
                        {
                            col: "cnt",
                            friendly: "发生笔数",
                            index: 6
                        },
                        {
                            col: "merchantNo",
                            friendly: "商户编码",
                            index: 6
                        },
                        {
                            col: "status",
                            friendly: "状态",
                            index: 6
                        },
                        {
                            col: "gas",
                            friendly: "gas费用",
                            index: 6
                        }

                    ],
                    // 查询过滤条件
                    findFilter: function () {
                        var merchantNo,status;
                        if ($('#merchantNo').val()) {
                            merchantNo = RQLBuilder.equal("merchantNo", $.trim($('#merchantNo').val()));
                        }
                        if ($('#status').val()) {
                            status = RQLBuilder.equal("status", $.trim($('#status').val()));
                        }
                        var filter = RQLBuilder.and([
                            merchantNo,status
                        ]);
                        return filter.rql();
                    }
                })
        }
    }
}();


