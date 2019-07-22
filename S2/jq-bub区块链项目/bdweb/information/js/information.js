//工具函数
var strUtil = {
    /*
     * 判断字符串是否为空
     */
    isEmpty:function(str){
        if(str == null||str.length == 0){
            return true;
        }else{
            return false;
        }
    },
    /*
     * 判断字符串是否为手机号
     */
    isPhoneNumber:function(str) {
        var reg=/^[1][3,4,5,7,8][0-9]{9}$/;
        if (!reg.test(str)) {
            return false;
        } else {
            return true;
        }
    },
    /*
     * 判断字符串是不是邮箱
     */
    isEmail:function(str){
    　　var reg=/^[a-zA-Z0-9_-]+@([a-zA-Z0-9]+\.)+(com|cn|net|org)$/;
    　　if(reg.test(str)){
    　　　　return true;
    　　}else{
    　　　　return false;
        }
    }
}
$(function(){
    $.ajax({
        type: 'POST',
        url: "/bd/use/pbusm.do",
        dataType: 'json',
        contentType: "application/json;charset=utf-8",
        async: false,
        isMask: true,
        data:'',
        success: function(result) {
            //console.log(result.googlesecret);
           $('#userId').html(result.userId);
           $('#loginName').html(result.loginName);
          // var date = new Date(result.createdTime);
    		//date_value=date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();

           $('#createdTime').html(result.createdTime);
           $('#transferRate').html(result.transferRate);
           $('#employeeName').html(result.employeeName);
           $('#distributor').html(result.walletAddress);
          // $('#transferRate').html(result.transferRate+'%');
           //$('#moneyPassword').html(result.moneypassword);
           var mobile = result.mobile;
           if(!strUtil.isEmpty(mobile)){
                $('#mobile').html(mobile);
                $('#updateMobile').html('修改');
           }else{
                $('#mobile').html('无');
                $('#updateMobile').html('绑定');
           }
           var email = result.email;
           if(!strUtil.isEmpty(email)){
                $('#email').html(email);
                $('#updateEmail').html('修改');
           }else{
                $('#email').html('无');
                $('#updateEmail').html('绑定');
           }
           var moneypassword = result.moneypassword;
           if(!strUtil.isEmpty(moneypassword)){
                $('#moneyPassword').html(moneypassword);
                $('#dockingKeyFind').html('修改');
           }else{
                $('#moneyPassword').html('无');
                $('#dockingKeyFind').html('绑定');
           }
           if(result.valiGoogleSecret==0){
                $('#valiGoogleSecret').html('未绑定');
                $('#bindGoogle').show();
           }else{
                var googlesecret = result.googlesecret;
                $('#valiGoogleSecret').html(googlesecret);
                $('#bindGoogle').hide();
           }
           var valiIdNumber = result.valiIdNumber;
           if(valiIdNumber==0||valiIdNumber==2){
                $('#realname').html('未实名');
                $('#authentication').show();
            }else if(valiIdNumber==3){
                $('#realname').html(result.realName);
                $('#authentication').hide();
            }else{
                $('#realname').html("审核中");
                $('#authentication').hide();
            }
           $('#password').html(result.password);
        },
        error: function(err) {
            if(err.status==406||err.status==401){
                window.location.replace("/login.html");
            }else{
                bootbox.alert("服务器繁忙,请稍后再试", function() {
                    location.reload();
                });
            }
        }
    });
});
/**修改手机号 */
$('#updateMobile').click(function(){
    // var mobile = $('#mobile').text();
    // $("#newmobile").val(mobile);

    common.updateMobile();
});
/**手机号 */
var common = function() {
    return {
        updateMobile: function() {
            var diag = bootbox.dialog({
                message:
                    "<form class=\"bootbox-form form-horizontal form-bordered form-label-stripped\" onsubmit=\"return false\" role=\"form\" id=\"__editform\">" +
                    "<div class=\"form-group\" id=\"dg_confirmpwd\">" +
                    "<label class=\"col-md-4 control-label\" id=\"dl_newpass\">手机号</label>" +
                    "<div class=\"col-md-8\" id=\"di_confirmpwd\">" +
                    "<div class=\"input-icon right\">" +
                    " <i class=\"fa fa-info-circle tooltips\" data-container=\"body\"></i>" +
                    "<input type=\"text\" onkeyup=\"this.value=this.value.replace(/\\D/g,'')\" maxlength=\"11\" class=\"bootbox-input bootbox-input-text form-control\" id=\"confirmpwd\" name=\"confirmpwd\" value=\"\"/>" +
                    "</div>" +
                    "</div>" +
                    "</div>" +
                    "<div class=\"form-group\" id=\"dg_goocode\">" +
                    "<label class=\"col-md-4 control-label\" id=\"dl_conpass\">谷歌验证码</label>" +
                    "<div class=\"col-md-8\" id=\"di_goocode\">" +
                    "<div class=\"input-icon right\">" +
                    " <i class=\"fa fa-info-circle tooltips\" data-container=\"body\"></i>" +
                    "<input type=\"text\" onkeyup=\"this.value=this.value.replace(/\\D/g,'')\" maxlength=\"6\" class=\"bootbox-input bootbox-input-text form-control\" id=\"goocode\" name=\"goocode\" value=\"\"/>" +
                    "</div>" +
                    "</div>" +
                    "</div>" +
                    "<input type=\"hidden\" class=\"_mod_id\" id=\"_id\" name=\"_id\" value=\"\"/>" +
                    "</div>" +
                    "</form>",
                title: "手机号",
                buttons: {
                    success: {
                        label: "确定",
                        className: "green",
                        callback: function() {
                            var newmobile = $("#confirmpwd").val();
                            var goocode = $("#goocode").val();
                            if(!(/^1[34578]\d{9}$/.test(newmobile))){
                                bootbox.alert('请输入正确的手机号');
                                // $("#confirmpwd").focus();
                                return false;
                            }
                            if(!(/^[0-9]{6}$/.test(goocode))){
                                bootbox.alert('请输入正确谷歌验证码!');
                                $("#goocode").focus();
                                return false;
                            }
                            var passw = {};
                            passw["goocode"] = goocode;
                            passw["phone"] = newmobile;
                            passw["state"] = 1;
                            $.ajax({
                                url:'/bd/use/pbvcs.do',
                                type: 'POST',
                                dateType:"json",
                                data:JSON.stringify(passw),
                                success:function(data){
                                    if(data.errcode == "1") {
                                        bootbox.alert("修改成功", function() {
                                            location.reload();
                                        });
                                    }else {
                                        bootbox.alert(data.msg,function(){
                                            location.reload();
                                        });
                                    }
                                },error: function(err) {
                                    if(err.status==406||err.status==401){
                                        window.location.replace("/login.html?redirect="+window.location.pathname);
                                    }else{
                                        bootbox.alert("服务器繁忙,请稍后再试", function() {
                                            location.reload();
                                        });
                                    }
                                }
                            })
                        }
                    },
                    danger: {
                        label: "取消",
                        className: "gray",
                        callback: function() {}
                    },

                }
            }, {
                show: false,
                "keyboard": true
            });
            diag.show();
            $("#oldpass").focus();
        },
        updateEmail: function() {
            var diag = bootbox.dialog({
                message:
                    "<form class=\"bootbox-form form-horizontal form-bordered form-label-stripped\" onsubmit=\"return false\" role=\"form\" id=\"__editform\">" +
                    "<div class=\"form-group\" id=\"dg_confirmpwd\">" +
                    "<label class=\"col-md-4 control-label\" id=\"dl_newpass\">邮箱</label>" +
                    "<div class=\"col-md-8\" id=\"di_confirmpwd\">" +
                    "<div class=\"input-icon right\">" +
                    " <i class=\"fa fa-info-circle tooltips\" data-container=\"body\"></i>" +
                    "<input type=\"text\" maxlength=\"30\" class=\"bootbox-input bootbox-input-text form-control\" id=\"newemail\" name=\"confirmpwd\" value=\"\"/>" +
                    "</div>" +
                    "</div>" +
                    "</div>" +
                    "<div class=\"form-group\" id=\"dg_goocode\">" +
                    "<label class=\"col-md-4 control-label\" id=\"dl_conpass\">谷歌验证码</label>" +
                    "<div class=\"col-md-8\" id=\"di_goocode\">" +
                    "<div class=\"input-icon right\">" +
                    " <i class=\"fa fa-info-circle tooltips\" data-container=\"body\"></i>" +
                    "<input type=\"text\" maxlength='6' onkeyup=\"this.value=this.value.replace(/\\D/g,'')\" class=\"bootbox-input bootbox-input-text form-control\" id=\"goocode\" name=\"goocode\" value=\"\"/>" +
                    "</div>" +
                    "</div>" +
                    "</div>" +
                    "<input type=\"hidden\" class=\"_mod_id\" id=\"_id\" name=\"_id\" value=\"\"/>" +
                    "</div>" +
                    "</form>",
                title: "邮箱",
                buttons: {
                    success: {
                        label: "确定",
                        className: "green",
                        callback: function() {
                            var newemail = $("#newemail").val();
                            if(!(/\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/.test(newemail))){
                                bootbox.alert('请输入正确的邮箱');
                                $("#newemail").focus();
                                return false;
                            }
                            var goocode = $("#goocode").val();
                            if(!(/^[0-9]{6}$/.test(goocode))){
                                bootbox.alert('请输入正确谷歌验证码!');
                                $("#goocode").focus();
                                return false;
                            }
                            var passw = {};
                            passw["email"] = newemail;
                            passw["goocode"] = goocode;
                            passw["state"] = 2;
                            $.ajax({
                                url:'/bd/use/pbvcs.do',
                                type: 'POST',
                                dateType:"json",
                                data:JSON.stringify(passw),
                                success:function(data){
                                    if(data.success){
                                        bootbox.alert("修改成功",function(){
                                            location.reload();
                                        })
                                    }else{
                                        bootbox.alert(data.msg,function(){
                                            location.reload();
                                        })
                                    }
                                },error: function(err) {
                                    if(err.status==406||err.status==401){
                                        window.location.replace("/login.html?redirect="+window.location.pathname);
                                    }else{
                                        bootbox.alert("服务器繁忙,请稍后再试", function() {
                                            location.reload();
                                        });
                                    }
                                }
                            })
                        }
                    },
                    danger: {
                        label: "取消",
                        className: "gray",
                        callback: function() {}
                    },

                }
            }, {
                show: false,
                "keyboard": true
            });
            diag.show();
            $("#oldpass").focus();
        },
        bindGoogle: function() {
            var diag = bootbox.dialog({
                message: "<form class=\"bootbox-form form-horizontal form-bordered form-label-stripped\" onsubmit=\"return false\" role=\"form\" id=\"__editform\">" +
                            "<div class=\"form-body\">" +
                                "<div class=\"form-group\" id=\"dg_oldpass\">" +
                                    "<label class=\"col-md-4 control-label\" id=\"dl_oldpass\">你的谷歌密钥是:</label>" +
                                    "<div class=\"col-md-8\" id=\"di_oldpass\">" +
                                        "<div class=\"input-icon right\">" +
                                        " <i class=\"fa fa-info-circle tooltips\" data-container=\"body\"></i>" +
                                        "<input type=\"text\" class=\"bootbox-input bootbox-input-text form-control\" id=\"googlekey\" name=\"googlekey\" value=\"\"/>" +
                                    "</div>" +
                                "</div>" +
                                "<div class=\"form-group\" id=\"dg_oldpass\">" +
                                    "<label class=\"col-md-4 control-label\" id=\"dl_oldpass\">谷歌验证码图片</label>" +
                                    "<div class=\"col-md-8\" id=\"di_oldpass\">" +
                                        "<div class=\"input-icon right\" id=\"qrcode\">" +
                                        // " <i class=\"fa fa-info-circle tooltips\" data-container=\"body\"></i>" +
                                        // "<img id=\"googleImg\" src=\"\" width=\"200\" height=\"100\"/>"+
                                        "</div>" +
                                    "</div>" +
                                "<div class=\"form-group\" id=\"dg_oldpass\">" +
                                    "<label class=\"col-md-4 control-label\" id=\"dl_oldpass\">谷歌验证码</label>" +
                                    "<div class=\"col-md-8\" id=\"di_oldpass\">" +
                                        "<div class=\"input-icon right\">" +
                                        " <i class=\"fa fa-info-circle tooltips\" data-container=\"body\"></i>" +
                                        "<input type=\"text\" class=\"bootbox-input bootbox-input-text form-control\" id=\"googlecode\" name=\"googlecode\" value=\"\"/>" +
                                    "</div>" +
                                "</div>" +
                            "</div>" +
                            "</div>" +
                                "<input type=\"hidden\" class=\"_mod_id\" id=\"_id\" name=\"_id\" value=\"\"/>" +
                            "</div>" +
                        "</form>",
                title: "谷歌验证绑定",
                buttons: {
                    success: {
                        label: "绑定",
                        className: "green",
                        callback: function() {
                            var userinfo = JSON.parse(localStorage.getItem('user_info'));
                            var googlekey = $("#googlekey").val();
                            console.log(googlekey);
                            var googlecode = $("#googlecode").val();
                            if (strUtil.isEmpty(googlecode)) {
                                bootbox.alert("谷歌验证码不能为空");
                                $("#googlecode").focus();
                                return false;
                            }
                            var param = {};
                            param["googlesecret"] = googlekey;
                            param["googlecode"] = googlecode;
                            $.ajax({
                                url:'/bd/usr/pbbgg.do',
                                type: 'POST',
                                dateType:"json",
                                data:JSON.stringify(param),
                                success:function(data){
                                    bootbox.alert(data.msg,function(){
                                        location.reload();
                                    });
                                },error: function(err) {
                                    if(err.status==406||err.status==401){
                                        window.location.replace("/login.html?redirect="+window.location.pathname);
                                    }else{
                                        bootbox.alert("服务器繁忙,请稍后再试", function() {
                                            location.reload();
                                        });
                                    }
                                }
                            })
                        }
                    },
                    danger: {
                        label: "取消",
                        className: "gray",
                        callback: function() {}
                    },

                }
            }, {
                show: false,
                "keyboard": true
            });
            diag.show();
            $("#oldpass").focus();
        },
        authentication: function() {
            var diag = bootbox.dialog({
                message: "<form class=\"bootbox-form form-horizontal form-bordered form-label-stripped\" onsubmit=\"return false\" role=\"form\" id=\"__editform\">" +
                            "<div class=\"form-body\">" +
                                "<div class=\"form-group\" id=\"dg_oldpass\">" +
                                    "<label class=\"col-md-4 control-label\" id=\"dl_oldpass\">真实姓名</label>" +
                                    "<div class=\"col-md-8\" id=\"di_oldpass\">" +
                                        "<div class=\"input-icon right\">" +
                                        " <i class=\"fa fa-info-circle tooltips\" data-container=\"body\"></i>" +
                                        "<input type=\"text\" class=\"bootbox-input bootbox-input-text form-control\" id=\"realName\" name=\"realName\" value=\"\"/>" +
                                    "</div>" +
                                "</div>" +
                                "<div class=\"form-group\" id=\"dg_oldpass\">" +
                                    "<label class=\"col-md-4 control-label\" id=\"dl_oldpass\">身份证号</label>" +
                                    "<div class=\"col-md-8\" id=\"di_oldpass\">" +
                                        "<div class=\"input-icon right\">" +
                                        " <i class=\"fa fa-info-circle tooltips\" data-container=\"body\"></i>" +
                                        "<input type=\"text\" class=\"bootbox-input bootbox-input-text form-control\" id=\"idnumber\" name=\"idnumber\" value=\"\"/>" +
                                    "</div>" +
                                "</div>" +
                            "</div>" +
                            "</div>" +
                                "<input type=\"hidden\" class=\"_mod_id\" id=\"_id\" name=\"_id\" value=\"\"/>" +
                            "</div>" +
                        "</form>",
                title: "实名认证",
                buttons: {
                    success: {
                        label: "确定",
                        className: "green",
                        callback: function() {
                            var userinfo = JSON.parse(localStorage.getItem('user_info'));
                            var realName = $("#realName").val();
                            var idnumber = $("#idnumber").val();
                            if (strUtil.isEmpty(realName)) {
                                bootbox.alert("请输入姓名");
                                $("#realName").focus();
                                return false;
                            }
                            if(strUtil.isEmpty(idnumber)){
                                bootbox.alert('请输入身份证号');
                                $("#idnumber").focus();
                                return false;
                            }
                            var param = {};
                            param["realname"] = realName;
                            param["certificateno"] = idnumber;
                            $.ajax({
                                url:'/bd/usr/pbuas.do',
                                type: 'POST',
                                dateType:"json",
                                data:JSON.stringify(param),
                                success:function(data){
                                    bootbox.alert(data.msg);
                                    location.reload();
                                },error: function(err) {
                                    if(err.status==406||err.status==401){
                                        window.location.replace("/login.html?redirect="+window.location.pathname);
                                    }else{
                                        bootbox.alert("服务器繁忙,请稍后再试", function() {
                                            location.reload();
                                        });
                                    }
                                }
                            })
                        }
                    },
                    danger: {
                        label: "取消",
                        className: "gray",
                        callback: function() {}
                    },

                }
            }, {
                show: false,
                "keyboard": true
            });
            diag.show();
            $("#oldpass").focus();
        },
        seniorCertification: function() {
            var diag = bootbox.dialog({
                message: "<form class=\"bootbox-form form-horizontal form-bordered form-label-stripped\" onsubmit=\"return false\" role=\"form\" id=\"__editform\">" +
                            "<div class=\"form-body\">" +
                                "<div class=\"form-group\" id=\"dg_oldpass\">" +
                                    "<label class=\"col-md-4 control-label\" id=\"dl_oldpass\"></label>" +
                                    "<div class=\"col-md-8\" id=\"di_oldpass\">" +
                                        "<div class=\"input-icon right\">" +
                                        " <i class=\"fa fa-info-circle tooltips\" data-container=\"body\"></i>" +
                                        "<input type=\"text\" class=\"bootbox-input bootbox-input-text form-control\" id=\"realname\" name=\"realname\" value=\"\"/>" +
                                    "</div>" +
                                "</div>" +
                                "<div class=\"form-group\" id=\"dg_oldpass\">" +
                                    "<label class=\"col-md-4 control-label\" id=\"dl_oldpass\"></label>" +
                                    "<div class=\"col-md-8\" id=\"di_oldpass\">" +
                                        "<div class=\"input-icon right\">" +
                                        " <i class=\"fa fa-info-circle tooltips\" data-container=\"body\"></i>" +
                                        "<input type=\"text\" class=\"bootbox-input bootbox-input-text form-control\" id=\"idnumber\" name=\"idnumber\" value=\"\"/>" +
                                    "</div>" +
                                "</div>" +
                            "</div>" +
                            "</div>" +
                                "<input type=\"hidden\" class=\"_mod_id\" id=\"_id\" name=\"_id\" value=\"\"/>" +
                            "</div>" +
                        "</form>",
                title: "高级认证",
                buttons: {
                    success: {
                        label: "确定",
                        className: "green",
                        callback: function() {
                            var userinfo = JSON.parse(localStorage.getItem('user_info'));
                            var realname = $("#realname").val();
                            var idnumber = $("#idnumber").val();
                            if (strUtil.isEmpty(realname)) {
                                bootbox.alert("请输入姓名");
                                $("#realname").focus();
                                return false;
                            }
                            if(!strUtil.isEmail(idnumber)){
                                bootbox.alert('请输入身份证号');
                                $("#idnumber").focus();
                                return false;
                            }
                            var param = {};
                            param["realname"] = realname;
                            param["certificateno"] = idnumber;
                            $.ajax({
                                url:'/bd/usr/pbuas.do',
                                type: 'POST',
                                dateType:"json",
                                data:JSON.stringify(param),
                                success:function(data){
                                    bootbox.alert(data.msg,function(){
                                        location.reload();
                                    })
                                },error: function(err) {
                                    if(err.status==406||err.status==401){
                                        window.location.replace("/login.html?redirect="+window.location.pathname);
                                    }else{
                                        bootbox.alert("服务器繁忙,请稍后再试", function() {
                                            location.reload();
                                        });
                                    }
                                }
                            })
                        }
                    },
                    danger: {
                        label: "取消",
                        className: "gray",
                        callback: function() {}
                    },

                }
            }, {
                show: false,
                "keyboard": true
            });
            diag.show();
            $("#oldpass").focus();
        },
        dockingKey: function() {
            var diag = bootbox.dialog({
                message: "<form class=\"bootbox-form form-horizontal form-bordered form-label-stripped\" onsubmit=\"return false\" role=\"form\" id=\"__editform\">" +
                            "<div class=\"form-body\">" +
                                "<div class=\"form-group\" id=\"dg_newpassword\">" +
                                    "<label class=\"col-md-4 control-label\" id=\"dl_oldpass\">新密码</label>" +
                                    "<div class=\"col-md-8\" id=\"di_newpassword\">" +
                                        "<div class=\"input-icon right\">" +
                                        " <i class=\"fa fa-info-circle tooltips\" data-container=\"body\"></i>" +
                                        "<input type=\"password\" maxlength=\"15\" class=\"bootbox-input bootbox-input-text form-control\" id=\"newpassword\" name=\"newpassword\" value=\"\"/>" +
                                    "</div>" +
                                "</div>" +
                            "</div>" +
                            "<div class=\"form-group\" id=\"dg_confirmpwd\">" +
                            "<label class=\"col-md-4 control-label\" id=\"dl_newpass\">确认新密码</label>" +
                                "<div class=\"col-md-8\" id=\"di_confirmpwd\">" +
                                "<div class=\"input-icon right\">" +
                                    " <i class=\"fa fa-info-circle tooltips\" data-container=\"body\"></i>" +
                                    "<input type=\"password\" maxlength=\"15\" class=\"bootbox-input bootbox-input-text form-control\" id=\"confirmpwd\" name=\"confirmpwd\" value=\"\"/>" +
                                "</div>" +
                            "</div>" +
                            "</div>" +
                            "<div class=\"form-group\" id=\"dg_goocode\">" +
                                "<label class=\"col-md-4 control-label\" id=\"dl_conpass\">谷歌验证码</label>" +
                                "<div class=\"col-md-8\" id=\"di_goocode\">" +
                                "<div class=\"input-icon right\">" +
                                    " <i class=\"fa fa-info-circle tooltips\" data-container=\"body\"></i>" +
                                    "<input type=\"password\" class=\"bootbox-input bootbox-input-text form-control\" id=\"goocode\" name=\"goocode\" value=\"\"/>" +
                                "</div>" +
                            "</div>" +
                            "</div>" +
                                "<input type=\"hidden\" class=\"_mod_id\" id=\"_id\" name=\"_id\" value=\"\"/>" +
                            "</div>" +
                        "</form>",
                title: "资金密码",
                buttons: {
                    success: {
                        label: "修改",
                        className: "green",
                        callback: function() {
                            var moditem = {};
                            $.each($('#__editform input'), function(index, val) {
                                if (val.name == "_id" || !val.name || val.name.length == 0) return;
                                moditem[val.name] = val.value;
                            });
                            if (moditem["goocode"] == "") {
                                alert("谷歌验证码");
                                $("#goocode").focus();
                                return false;
                            }else if (!(/^\d{6}$/.test(moditem["confirmpwd"]))) {
                                alert("密码为6位数字,请重新输入!");
                                $("#confirmpwd").focus();
                                return false;
                            } else if (!(/^\d{6}$/.test(moditem["newpassword"]))){
                                alert("密码为6位数字,请重新输入!");
                                $("#newpassword").focus();
                                return false;
                            } else if (moditem["confirmpwd"] != moditem["newpassword"]) {
                                alert("输入新密码不一致");
                                $("#newpassword").val("");
                                $("#newpassword").focus();
                                return false;
                            }
                            var newpassword = $("#newpassword").val();
                            var confirmpwd = $("#confirmpwd").val();
                            var goocode = $("#goocode").val();
                            var passw = {};
                            passw["goocode"] = goocode;
                            passw["newpassword"] = $.md5(newpassword);
                            passw["confirmpwd"] = $.md5(confirmpwd);
                            passw["state"] = 3;
                            $.ajax({
                                url:'/bd/use/pbvcs.do',
                                type: 'POST',
                                dateType:"json",
                                data:JSON.stringify(passw),
                                success:function(data){
                                    if(data.errcode == "1") {
										bootbox.alert("修改成功", function() {
										location.reload();
									    });
								    }else{
                                        bootbox.alert(data.msg, function() {
                                            location.reload();
                                        });
                                    }
                                },
                                error: function(err) {
                                    if(err.status==406||err.status==401){
                                        window.location.replace("/login.html?redirect="+window.location.pathname);
                                    }else{
                                        bootbox.alert("服务器繁忙,请稍后再试", function() {
                                            location.reload();
                                        });
                                    }
                                }
                            })
                        }
                    },
                    danger: {
                        label: "取消",
                        className: "gray",
                        callback: function() {}
                    },

                }
            }, {
                show: false,
                "keyboard": true
            });
            diag.show();
            $("#oldpass").focus();
        },
    };
}();
/**修改邮箱 */
$('#updateEmail').click(function(){
    // var email = $('#email').text();
    // $("#newemail").val(email);
    common.updateEmail();
});
/**绑定谷歌验证码 */
$('#bindGoogle').click(function(){
    common.bindGoogle();
    var param = {};
    var userinfo = JSON.parse(localStorage.getItem('user_info'));
    param["name"] = userinfo.login_name;
    param["host"] = "cwv.com";
    $.ajax({
        type: 'POST',
        url: "/bd/usr/pbggg.do",
        dataType: 'json',
        contentType: "application/json;charset=utf-8",
        data:JSON.stringify(param),
        success: function(result) {
            var secret = result.resultinfo.secret;
            var qrcodeurl = result.resultinfo.qrcodeurl;
            // new QRCode(document.getElementById('qrcode'), qrcodeurl);
            var qrcode = new QRCode('qrcode', {
                text: qrcodeurl,
                width: 150,
                height: 150,
                colorDark: '#000000',
                colorLight: '#ffffff',
                correctLevel: QRCode.CorrectLevel.H
              });
            // $("#googleImg").attr("src",qrcodeurl);
            $('#googlekey').val(secret);
        },
        error: function() {
            if(err.status==406||err.status==401){
                window.location.replace("/login.html?redirect="+window.location.pathname);
            }else{
                bootbox.alert("服务器繁忙,请稍后再试", function() {
                    location.reload();
                });
            }
        }
    });
});
/**实名认证 */
/*$('#authentication').click(function(){
    common.authentication();
});*/
/**高级认证 */
/*$('#seniorCertification').click(function(){
    common.seniorCertification();
});*/
/**修改资金密码 */
$('#dockingKeyFind').click(function(){
    common.dockingKey();
});


