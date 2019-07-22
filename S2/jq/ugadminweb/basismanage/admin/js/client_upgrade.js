var xw;
var modelBuilder = function () {
    return "<select id='model' name='model' class='form-control'>" +
        "<option value='android' selected>android</option>" +
        "<option value='ios' >ios</option>"
};
var typeBuilder = function () {
    return "<select id='type' name='type' class='form-control'>" +
        "<option value='0'>否</option>" +
        "<option value='1'>是</option>"
};
var ClientUpGradeAction = function () {
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
                    // columnPicker: true,
                    transition: 'fade',
                    checkboxes: true,
                    checkAllToggle: true,
                    saveColumn: false,
                    //----------------基本restful地址---
                    basePath: "/ug/cli/",
                    restbase: 'pbsel.do',
                    addurl: "/ug/cli/pbadd.do",
                    key_column: "clientUpgradeId",
                    //---------------行定义
                    coldefs: [
                        {
                            col: "id",
                            friendly: "序号",
                            unique: true,
                            hidden: true,
                            readonly: "readonly",
                            nonedit: "nosend",
                            index: 1
                        },
                        {
                            col: "model",
                            friendly: "适用系统",
                            format: GasSysBasic.modelFormat,
                            validate: "required",
                            inputsource: "custom",
                            inputbuilder: "modelBuilder",
                            hidden: true,
                            index: 2
                        },
                        {
                            col: "version",
                            friendly: "升级文件版本号",
                            validate: "required",
                            index: 3
                        },
                        {
                            col: "url",
                            friendly: "升级文件地址",
                            validate: "required",
                            index: 4
                        },
                        {
                            col: "type",
                            friendly: "强制升级",
                            validate: "required",
                            inputsource: "custom",
                            inputbuilder: "typeBuilder",
                            index: 5
                        },
                        {
                            col: "changelog",
                            friendly: "升级日志",
                            validate: "required",
                            index: 6
                        },
                        {
                            col: "createdTime",
                            friendly: "创建时间",
                            format: dateFormat,
                            hidden: true,
                            nonedit: "nosend",
                            index: 8
                        }
                    ],
                    // 查询过滤条件
                    findFilter: function () {
                        var filter = RQLBuilder.equal("model", $("#status1").val());
                        return filter.rql();
                    },

                    onAdded: function (ret, jsondata) {
                        return validateForm(jsondata);
                    },
                    onUpdated: function (ret, jsondata) {
                        return validateForm(jsondata);
                    },
                    onDeleted: function (ret, jsondata) {
                    },
                })
        }

    }
}();
