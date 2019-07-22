var xw;

var Advert = function () {
    return {
        init: function () {
            // 顺序有影响 (先抓选单, 再抓暂存选单, 再执行其他)
            this.initHelper();
            this.reload();
        },
        initHelper: function () {
            //新增前检查用户id和用户名是否匹配
            $('#add_advert_button').on('click', function (e) {
                //先清空所有信息
                document.getElementById("add_advert_form").reset();
                $('#add_advert_modal').modal("show");
            });

            // 验证--币友APP用户ID
            $('#ugotcuserid1').on('blur', function () {
                let ugotcuserid1 = $('#ugotcuserid1').val(),
                    $ugotcuseridVerify = $('#ugotcuseridVerify')
                //校验是否为空
                if (!ugotcuserid1) {
                    $ugotcuseridVerify.html('请填写币友APP用户ID')
                } else {
                    let params = {};
                    params.ugotcuserid = ugotcuserid1;
                    $.ajax({
                        type: 'POST',
                        url: "/mf/usr/pbcwa.do",
                        dataType: 'json',
                        contentType: "application/json;charset=utf-8",
                        async: false,
                        isMask: true,
                        data: JSON.stringify(params),
                        success: function (ret) {
                            if (ret.err_code == "1") {
                                $ugotcuseridVerify.html('')
                            } else {
                                $ugotcuseridVerify.html('')
                                if ('用户不存在' === ret.msg) {
                                    $ugotcuseridVerify.html(ret.msg)
                                }
                                return;
                            }
                        },
                        error: function () {
                            bootbox.alert("访问失败");
                            return;
                        }
                    });
                }

            })
            $('#submit_advert').on('click', function () {
                let ugotcuserid1 = $('#ugotcuserid1').val(),
                    $ugotcuseridVerify = $('#ugotcuseridVerify')
                if ('用户不存在' === $ugotcuseridVerify.html()) {
                    return;
                }
                //校验信息 -- 是否为空
                let username = $('#username').val();
                //校验是否是数字
                if (!ugotcuserid1) {
                    bootbox.alert("填写币友APP用户ID");
                    return;
                }
                if (!username) {
                    bootbox.alert("填写币友APP登录帐号");
                    return;
                }
                let params = {};
                params.ugotcuserid = ugotcuserid1;
                params.username = username
                $.ajax({
                    type: 'POST',
                    url: "/mf/usr/pbcwa.do",
                    dataType: 'json',
                    contentType: "application/json;charset=utf-8",
                    async: false,
                    isMask: true,
                    data: JSON.stringify(params),
                    success: function (ret) {
                        if (ret.err_code == "1") {
                            $("#add_advert_modal").modal("hide");
                            // 弹框回调
                            // bootbox.alert(ret.msg,()=>{
                            // 	//先清空所有信息
                            // 	document.getElementById("add_account_form").reset();
                            // 	$('#add_account_modal').modal("show");
                            // });
                            // 验证成功之后，直接拿ugotcuserid添加账号
                            let ugotcuserid = params.ugotcuserid
                            $.ajax({
                                type: 'POST',
                                url: "/mf/usr/pbawa.do",
                                dataType: 'json',
                                contentType: "application/json;charset=utf-8",
                                async: false,
                                isMask: true,
                                data: JSON.stringify({'ugotcuserid': ugotcuserid}),
                                success: function (ret) {
                                    if (ret.err_code == "1") {
                                        bootbox.alert(ret.msg);
                                        xw.update();
                                    } else {
                                        bootbox.alert(ret.msg);
                                        return;
                                    }
                                },
                                error: function () {
                                    bootbox.alert("操作失败");
                                    // xw.update();
                                    return;
                                }
                            });
                        } else {
                            bootbox.alert(ret.msg);
                            return;
                        }
                    },
                    error: function () {
                        bootbox.alert("操作失败");
                        // xw.update();
                        return;
                    }
                });

            });
        },

        reload: function () {
            var Caozuo = function () {
                return {
                    f: function (val, row) {
                        return "<div class='btn-group form-group'><button id='deleteid' class='btn red' data-target='#input_many_modal' data-toggle='modal' data-id='" + row.ugotcuserid + "'>删除</button></div>";
                    }
                }
            }();
            $('#divtable').html('');

            xw = XWATable.init({
                divname: "divtable",
                //----------------table的选项-------
                pageSize: 10,
                // columnPicker: true,
                transition: 'fade',
                checkboxes: false,
                checkAllToggle: true,
                //----------------基本restful地址---
                restURL: "/mf/usr/pblwa.do?bd={'':''}",
                coldefs: [
                    {
                        col: "mfbusinessid",
                        friendly: "合作商ID",
                        validate: "mfbusinessid",
                        nonedit: "nosend",
                        // hidden:"true",
                        unique: "true",
                        // format:"",
                        index: 1
                    },
                    {
                        col: "ugotcuserid",
                        friendly: "收款账号ID",
                        validate: "ugotcuserid",
                        index: 2
                    },
                    {
                        col: "username",
                        friendly: "登录账号",
                        validate: "username",
                        index: 3
                    },
                    {
                        col: "bindtime",
                        friendly: "绑定时间",
                        validate: "bindtime",
                        index: 4
                    },
                    {
                        friendly: "操作",
                        format: Caozuo,
                        index: 5
                    }
                ],
                // 查询过滤条件
                // findFilter: function() {
                // 	var finddb = {};
                // 	if($('#searchKey').val()){
                // 		finddb.searchKey = $('#searchKey').val();
                // 	}
                // 	if($('#status option:selected').val()){
                // 		finddb.status = $('#status option:selected').val();
                // 	}
                // 	if($('#endDate').val()){
                // 		finddb.endDate = $('#endDate').val();
                // 	}
                // 	if($('#startDate').val()){
                // 		finddb.startDate = $('#startDate').val();
                // 	}
                //
                // 	xw.setRestURL("/mf/usr/pblwa.do?bd="+(JSON.stringify(finddb)));
                // },

            })
        }
    }
}();

// 删除账号
$(document).on("click", "#deleteid", function () {
    // $(".modal-body").find("#prefix_860037789915").remove()
    $("#ugotcuserid").val($(this).attr("data-id"));
});
$(document).on('click', "#confirm", function () {
    $("#input_many_modal").modal('hide');  //手动关闭
    var form = {};
    form["ugotcuserid"] = $("#ugotcuserid").val();
    $.ajax({
        url: "/mf/usr/pbdwa.do",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        type: "post",
        dateType: "json",
        data: JSON.stringify(form),
        success: function (data) {
            if (data.err_code == '1') {
                bootbox.alert(data.msg);
                xw.update();
            } else {
                bootbox.alert(data.msg);
            }
        },
        error: function (err) {
            if (err.status == 406 || err.status == 401) {
                window.location.replace("/login.html");
            } else {
                bootbox.alert("服务器繁忙,请稍后再试", function () {
                    location.reload();
                });
            }
        }
    })
});

