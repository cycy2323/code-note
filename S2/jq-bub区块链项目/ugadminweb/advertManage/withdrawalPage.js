var xw;

// 添加一键买币账号
$('#add-one-key-buy').on('click', function (e) {// 添加一键买币账号
    let $hasSelect = $(".onekeybuystatus-select:checked"),
        selectedArr = []
    for (var i = 0, n; n = $hasSelect[i]; ++i) { // dom节点转数组
        selectedArr.push($(n).attr("name"));
    }
    // console.log(22, selectedArr);
    if(selectedArr.length === 0){
        bootbox.alert('没有选择的账号！')
        return
    }
    var params = {};
    params.userIds = selectedArr;

    $.ajax({
        type: 'POST',
        url: "/ug/akd/pbadd.do",
        dataType: 'json',
        contentType: "application/json;charset=utf-8",
        async: false,
        isMask: true,
        data: JSON.stringify(params),
        success: function (ret) {
            if (ret.err_code == "1") {
                bootbox.alert(ret.msg);
                xw.update();
            } else {
                bootbox.alert(ret.msg);
                return;
                // xw.update();
            }
        },
        error: function () {
            bootbox.alert("添加失败");
            return;
        }
    });
});

// 操作
let $deleteAcount = $('#delete-account'),
    $matchAccount = $('#match-account'),
    $offAccount = $('#off-account'),
    $userid1 = $('#userid1'),
    $userid2 = $('#userid2'),
    $userid3 = $('#userid3'),
    delAccount = (userid) => {
        $userid1.val(userid)
    },
    putAccount = (userid) => {
        $userid2.val(userid)
    },
    downAccount = (userid) => {
        $userid3.val(userid)
    };

// 删除
$deleteAcount.on('click', function () {
    operate($userid1.val(), "/ug/akd/pbdel.do")
});
// 启用
$matchAccount.on('click', function () {
    operate($userid2.val(), "/ug/akd/pbshe.do")
});
// 撤下
$offAccount.on('click', function () {
    operate($userid3.val(), "/ug/akd/pbobt.do")
});
// 操作接口函数
operate = (userId, url) => {
    $.ajax({
        type: 'POST',
        url: url,
        dataType: 'json',
        contentType: "application/json;charset=utf-8",
        async: false,
        isMask: true,
        data: JSON.stringify({userId: userId}),
        success: function (ret) {
            if (ret.err_code == "0") {
                bootbox.alert(ret.msg);
                xw.update();
            } else {
                bootbox.alert(ret.msg);
                xw.update();
            }
        },
        error: function () {
            bootbox.alert("操作失败");
            xw.update();
        }
    });
}

var pageOne = function () {
    return {
        init: function () {
            this.reload();
        },

        reload: function () {

            $('#divtable').html('');
            $('#divtable1').html('');
            let orderStatus = function (val) {
                return {
                    // 	2-匹配中,3-撤下
                    f: function (val) {
                        if (val === 2) {
                            return "匹配中"
                        } else if (val === 3) {
                            return "撤下";
                        }
                    }
                }
            }();
            let turnoverrate = function () {
                return {
                    f: function (val) {
                        return val + "%"
                    }
                }
            }();
            let isSelect = function () {
                return {
                    // 	除了1都是加入：wing
                    f: function (val) {
                        if (val === 1) {
                            return "未添加"
                        } else {
                            return "已添加";
                        }
                    }
                }
            }();


            let Caozuo = function () {
                return {
                    f: function (val, row) {
                        let aac = `<div class="btn-group form-group"> 
                            <button class="btn green check" data-target="#edit_gp_btn2" data-toggle="modal" onclick="putAccount(${row.userid})" > 
                            &nbsp;启用配对&nbsp; 
                            </button> 
                            </div>`,

                            deleteAcount = `<div class="btn-group form-group"> 
                                <button class="btn" data-target="#edit_gp_btn1" data-toggle="modal" onclick="delAccount (${row.userid})" > 
                                &nbsp;删除&nbsp; 
                                </button> 
                            </div>`,

                            remove = `<div class="btn-group form-group"> 
                                <button class="btn blue" onclick="downAccount(${row.userid})" data-target="#edit_gp_btn3" data-toggle="modal"> 
                                 &nbsp;撤下&nbsp; 
                                </button> 
                            </div>`;

                        if (row.onekeybuystatus === 2) {
                            return remove;
                        } else {
                            return aac + deleteAcount
                        }
                    }
                }
            }();
            let Xuanze = function () {
                return {
                    f: function (val, rows) {
                        if (rows.onekeybuystatus === 1) {
                            return `<input class="onekeybuystatus-select" name="${rows.userid}" type="checkbox"  placeholder="">`
                        }
                    }
                }
            }();
            let accountStatus = function () {
                return {
                    f: function (val, rows) {
                        if (val == '1') {
                            return "普通用户"
                        } else if (val == '2') {
                            return "分销商";
                        } else {
                            return "合作商绑定账户";
                        }
                    }
                }
            }();
            xw = firstPage ? XWATable.init({
                    divname: "divtable",
                    //----------------table的选项-------
                    pageSize: 10,
                    // columnPicker: true,
                    transition: 'fade',
                    checkboxes: false,
                    checkAllToggle: true,
                    saveColumn: false,
                    //----------------基本restful地址---
                    restURL: "/ug/akd/pbget.do?bd={'':''}",
                    coldefs: [
                        {
                            col: "userid",
                            friendly: "账号ID",
                            validate: "userid",
                            nonedit: "nosend",
                            // hidden:"true",
                            unique: "true",
                            // format:"",
                            index: 1
                        },
                        {
                            col: "usertype",
                            friendly: "账号类型",
                            validate: "usertype",
                            format: accountStatus,
                            index: 2
                        },
                        {
                            col: "nickname",
                            friendly: "账号昵称",
                            validate: "nickname",
                            index: 3
                        },
                        {
                            col: "volume",
                            friendly: "历史成交量(BUB)",
                            validate: "volume",
                            index: 4
                        },
                        {
                            col: "turnoverrate",
                            friendly: "历史成交率",
                            validate: "turnoverrate",
                            format: turnoverrate,
                            index: 5
                        },
                        {
                            col: "onekeybuystatus",
                            friendly: "状态",
                            validate: "onekeybuystatus",
                            format: orderStatus,
                            index: 6
                        },
                        {
                            friendly: "操作",
                            format: Caozuo,
                            index: 7
                        }
                    ],
                    // 查询过滤条件
                    findFilter: function () {
                        var finddb = {};
                        if ($('#userType').val()) {
                            finddb.userType = $('#userType').val();
                        }
                        if ($('#status option:selected').val()) {
                            finddb.status = $('#status option:selected').val();
                        }
                        if ($('#userId').val()) {
                            finddb.userId = $('#userId').val();
                        }

                        xw.setRestURL("/ug/akd/pbget.do?bd=" + (JSON.stringify(finddb)));
                    },

                })
                :
                XWATable.init({
                    divname: "divtable1",
                    findbtn: 'find_button1',
                    //----------------table的选项-------
                    pageSize: 10,
                    // columnPicker: true,
                    onekeybuystatus: true,
                    transition: 'fade',
                    checkboxes: false,
                    checkAllToggle: true,
                    saveColumn: false,
                    //----------------基本restful地址---
                    restURL: "/ug/akd/pbgad.do?bd={'':''}",
                    coldefs: [
                        {
                            col: "userid",
                            friendly: "账号ID",
                            validate: "userid",
                            nonedit: "nosend",
                            // hidden:"true",
                            unique: "true",
                            // format:"",
                            index: 1
                        },
                        {
                            col: "usertype",
                            friendly: "账号类型",
                            validate: "usertype",
                            format: accountStatus,
                            index: 2
                        },
                        {
                            col: "nickname",
                            friendly: "账号昵称",
                            validate: "nickname",
                            index: 3
                        },
                        {
                            col: "volume",
                            friendly: "历史成交量(BUB)",
                            validate: "volume",
                            index: 4
                        },
                        {
                            col: "turnoverrate",
                            friendly: "历史成交率",
                            validate: "turnoverrate",
                            format: turnoverrate,
                            index: 5
                        },
                        {
                            col: "onekeybuystatus",
                            friendly: "是否已添加配对",
                            validate: "onekeybuystatus",
                            format: isSelect,
                            index: 6
                        },
                        {
                            friendly: "选择",
                            format: Xuanze,
                            index: 7
                        }
                    ],
                    // 查询过滤条件
                    findFilter: function () {
                        var finddb = {};
                        if ($('#userType1').val()) {
                            finddb.userType = $('#userType1 option:selected').val();
                        }
                        if ($('#id1').val()) {
                            finddb.userId = $('#id1').val();
                        }
                        if ($('#volume').val()) {
                            finddb.volume = $('#volume').val();
                        }
                        if ($('#turnoverRate').val()) {
                            finddb.turnoverRate = $('#turnoverRate').val();
                        }

                        xw.setRestURL("/ug/akd/pbgad.do?bd=" + (JSON.stringify(finddb)));
                    },

                })
        }
    }
}();
