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
        url: "/mf/use/pbusm.do?time="+Date.now(),
        dataType: 'json',
        contentType: "application/json;charset=utf-8",
        async: false,
        data:'',
        success: function(result) {
            if(result.resultcode==5){
                bootbox.alert("session超时,请重新登陆",function(){
                    $.removeCookie('userinfo');
                    location.href= "login.html";
                });
            }
            $('#loginName').html(result.loginName);
           $('#businessId').html(result.businessId);
           $('#distributorId').html(result.distributorId);
           $('#walletAddress').html(result.walletAddress);
           $('#transferRate').html(result.transferRate);
           $('#mfSignKey').html(result.mfSignKey);
           $('#mfPublicKey').html(result.mfPublicKey);
           $('#mfPrivateKey').html(result.mfPrivateKey);
           if(!strUtil.isEmpty(result.moneypassword)){
               $('#moneyPassword').html(result.moneypassword);
           }
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
           if(result.valiGoogleSecret==0||result.valiGoogleSecret==null){
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
    common.updateMobile();
});
/**修改资金密码 */
$('#moneyPasswordEdit').click(function(){
    common.dockingKey();
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
                            var moditem = {};
                            $.each($('#__editform input'), function(index, val) {
                                if (val.name == "_id" || !val.name || val.name.length == 0) return;
                                moditem[val.name] = val.value;
                            });
                            if (moditem["goocode"] == ""||moditem["goocode"].length!=6) {
                                bootbox.alert("谷歌验证码不正确!");
                                return;
                            }
                            if (!( /0?(13|14|15|18|17|16)[0-9]{9}/.test(moditem["confirmpwd"]))) {
                                bootbox.alert("手机号格式不正确!");
                                return;
                            }
                            var phone = $("#confirmpwd").val();
                            var goocode = $("#goocode").val();
                            var passw = {};
                            passw["googleCode"] = goocode;
                            passw["phone"] = phone;
                            passw["state"] = 3;
                            $.ajax({
                                url:'mf/use/pbqus.do',
                                type: 'POST',
                                dateType:"json",
                                data:JSON.stringify(passw),
                                success:function(data){
                                    if(data.errcode == "1") {
                                        bootbox.alert(data.msg, function() {
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
                                        window.location.replace("/login.html");
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
                    "<input type=\"text\" maxlength=\"30\" class=\"bootbox-input bootbox-input-text form-control\" id=\"confirmpwd\" name=\"confirmpwd\" value=\"\"/>" +
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
                            var moditem = {};
                            $.each($('#__editform input'), function(index, val) {
                                if (val.name == "_id" || !val.name || val.name.length == 0) return;
                                moditem[val.name] = val.value;
                            });
                            if (moditem["goocode"] == ""||moditem["goocode"].length!=6) {
                                bootbox.alert("谷歌验证码不正确!");
                                return;
                            }
                            if (!( /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/.test(moditem["confirmpwd"]))) {
                                bootbox.alert("邮箱格式不正确!");
                                return;
                            }
                            var email = $("#confirmpwd").val();
                            var goocode = $("#goocode").val();
                            var passw = {};
                            passw["googleCode"] = goocode;
                            passw["email"] = email;
                            passw["state"] = 4;
                            $.ajax({
                                url:'mf/use/pbqus.do',
                                type: 'POST',
                                dateType:"json",
                                data:JSON.stringify(passw),
                                success:function(data){
                                    if(data.errcode == "1") {
                                        bootbox.alert(data.msg, function() {
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
                                        window.location.replace("/login.html");
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
                                    "<div class=\"col-md-12\" id=\"di_oldpass\" style=\"text-align:center;color:red;font-size: 14px;\">请绑定谷歌验证码</div>" +
                                "</div>" +
                                "<div class=\"form-group\" id=\"dg_oldpass\">" +
                                    "<div class=\"col-md-12\" id=\"di_oldpass\" style=\"font-size: 14px;\">1. 下载谷歌验证码 App</div>" +
                                "</div>" +
                                "<div class=\"form-group\" id=\"dg_oldpass\">" +
                                    "<div class=\"col-md-12\" id=\"di_oldpass\" style=\"font-size: 14px;\">2. 输入以下16位字符或使用谷歌验证码 App 扫码二维码绑定</div>" +
                                "</div>" +
                                "<div class=\"form-group\" id=\"dg_oldpass\">" +
                                    "<div class=\"col-md-5\" id=\"di_oldpass\">" +
                                        "<div class=\"input-icon right\" id=\"qrcode\"></div>" +
                                    "</div>" +
                                    "<div class=\"col-md-7\" id=\"di_oldpass\" style=\"height:100%;line-height: 150px;\">" +
                                        "<span id=\"googlekey\"></span>"+
                                        // "<input type=\"text\" class=\"bootbox-input bootbox-input-text form-control\" id=\"googlekey\" name=\"googlekey\" value=\"\"/>" +
                                    "</div>" +
                                "</div>" +  
                                "<div class=\"form-group\" id=\"dg_oldpass\">" +
                                    "<label class=\"col-md-5 control-label\" id=\"dl_oldpass\" style=\"font-size:14px;\">3. 绑定成功后请输入谷歌验证码</label>" +
                                    "<div class=\"col-md-7\" id=\"di_oldpass\">" +
                                        "<input type=\"text\" class=\"bootbox-input bootbox-input-text form-control\" id=\"googlecode\" name=\"googlecode\" value=\"\"/>" +
                                    "</div>" +
                                "</div>" +
                                "</div>" +
                                    "<input type=\"hidden\" class=\"_mod_id\" id=\"_id\" name=\"_id\" value=\"\"/>" +
                                "</div>" +
                            "</div>" +
                        "</form>",
                title: "谷歌验证绑定",
                buttons: {
                    success: {
                        label: "绑定",
                        className: "green",
                        callback: function() {
                            var userinfo = JSON.parse(localStorage.getItem('user_info'));
                            var googlekey = $("#googlekey").text();
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
                                url:'/mf/usr/pbbgg.do',
                                type: 'POST',
                                dateType:"json",
                                data:JSON.stringify(param),
                                success:function(data){
                                    bootbox.alert(data.msg,function(){
                                        location.reload();
                                    });
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
        updatePassword: function() {
            var diag = bootbox.dialog({
                message: "<form class=\"bootbox-form form-horizontal form-bordered form-label-stripped\" onsubmit=\"return false\" role=\"form\" id=\"__editform\">" +
                            "<div class=\"form-body\">" +
                                "<div class=\"form-group\" id=\"dg_oldpass\">" +
                                    "<label class=\"col-md-4 control-label\" id=\"dl_oldpass\">原密码</label>" +
                                    "<div class=\"col-md-8\" id=\"di_oldpass\">" +
                                        "<div class=\"input-icon right\">" +
                                        " <i class=\"fa fa-info-circle tooltips\" data-container=\"body\"></i>" +
                                        "<input type=\"password\" class=\"bootbox-input bootbox-input-text form-control\" id=\"oldpass\" name=\"oldpass\" value=\"\"/>" +
                                    "</div>" +
                                "</div>" +
                            "</div>" +
                            "<div class=\"form-group\" id=\"dg_newpass\">" +
                            "<label class=\"col-md-4 control-label\" id=\"dl_newpass\">新密码</label>" +
                                "<div class=\"col-md-8\" id=\"di_newpass\">" +
                                "<div class=\"input-icon right\">" +
                                    " <i class=\"fa fa-info-circle tooltips\" data-container=\"body\"></i>" +
                                    "<input type=\"password\" class=\"bootbox-input bootbox-input-text form-control\" id=\"newpass\" name=\"newpass\" value=\"\"/>" +
                                "</div>" +
                            "</div>" +
                            "</div>" +
                            "<div class=\"form-group\" id=\"dg_conpass\">" +
                                "<label class=\"col-md-4 control-label\" id=\"dl_conpass\">确认新密码</label>" +
                                "<div class=\"col-md-8\" id=\"di_conpass\">" +
                                "<div class=\"input-icon right\">" +
                                    " <i class=\"fa fa-info-circle tooltips\" data-container=\"body\"></i>" +
                                    "<input type=\"password\" class=\"bootbox-input bootbox-input-text form-control\" id=\"conpass\" name=\"conpass\" value=\"\"/>" +
                                "</div>" +
                            "</div>" +
                            "</div>" +
                                "<input type=\"hidden\" class=\"_mod_id\" id=\"_id\" name=\"_id\" value=\"\"/>" +
                            "</div>" +
                        "</form>",
                title: "登陆密码修改",
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
                            if (moditem["oldpass"] == "") {
                                alert("请输入原密码");
                                $("#oldpass").focus();
                                return false;
                            }else if (moditem["newpass"] == "") {
                                alert("请输入新密码");
                                $("#newpass").focus();
                                return false;
                            } else if (moditem["conpass"] == "") {
                                alert("请输入确认新密码");
                                $("#conpass").focus();
                                return false;
                            } else if (moditem["newpass"] != moditem["conpass"]) {
                                alert("输入新密码不一致");
                                $("#conpass").val("");
                                $("#conpass").focus();
                                return false;
                            }
                            var oldpass = $("#oldpass").val();
                            var dl_conpass = $("#conpass").val();
                            var passw = {};
                            passw["newpassword"] = $.md5(dl_conpass);
                            passw["oldpassword"] = $.md5(oldpass);
                            $.ajax({
                                url:'/mf/use/pbupu.do',
                                type: 'POST',
                                dateType:"json",
                                data:JSON.stringify(passw),
                                success:function(data){
                                    bootbox.alert(data.resultmsg,function(){
                                        if(data.resultcode==1){
                                            prelocation = "/login.html";
                                            window.location.replace(prelocation);
                                        }
                                    });
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
                                url:'/mf/usr/pbuas.do',
                                type: 'POST',
                                dateType:"json",
                                data:JSON.stringify(param),
                                success:function(data){
                                    bootbox.alert(data.msg);
                                    location.reload();
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
                                url:'/mf/usr/pbuas.do',
                                type: 'POST',
                                dateType:"json",
                                data:JSON.stringify(param),
                                success:function(data){
                                    bootbox.alert(data.msg);
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
        userKey: function() {
            var diag = bootbox.dialog({
                message: "<form class=\"bootbox-form form-horizontal form-bordered form-label-stripped\" onsubmit=\"return false\" role=\"form\" id=\"__editform\">" +
                            "<div class=\"form-body\">" +
                                "<div class=\"form-group\" id=\"dg_oldpass\">" +
                                    "<label class=\"col-md-4 control-label\" id=\"dl_oldpass\">谷歌验证码</label>" +
                                    "<div class=\"col-md-8\" id=\"di_oldpass\">" +
                                        "<div class=\"input-icon right\">" +
                                        " <i class=\"fa fa-info-circle tooltips\" data-container=\"body\"></i>" +
                                        "<input type=\"text\" maxlength='6'  onkeyup=\"this.value=this.value.replace(/\\D/g,'')\" class=\"bootbox-input bootbox-input-text form-control\" id=\"googleCode\" name=\"googleCode\" value=\"\"/>" +
                                    "</div>" +
                                "</div>" +
                            "</div>" +
                            "</div>" +
                                "<input type=\"hidden\" class=\"_mod_id\" id=\"_id\" name=\"_id\" value=\"\"/>" +
                            "</div>" +
                        "</form>",
                title: "查看商户签名KEY",
                buttons: {
                    success: {
                        label: "确定",
                        className: "green",
                        callback: function() {
                            var googleCode = $("#googleCode").val();
                            if (googleCode == ""||googleCode.length!=6) {
                                bootbox.alert("谷歌验证码不正确!");
                                return;
                            }
                            var param = {};
                            param["googleCode"] = googleCode;
                            param["state"] = 1;
                            $.ajax({
                                url:"mf/use/pbqus.do",
                                headers:{
                                    'Accept': 'application/json',
                                    'Content-Type': 'application/json'
                                },
                                type:"POST",
                                dateType:"json",
                                data:JSON.stringify(param),
                                success:function(data){
                                    if(data.errcode==1){
                                        bootbox.alert("你的签名KEY:"+data.mfSignKey);;
                                    }else{
                                        bootbox.alert(data.msg);
                                    }
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
        userResetSecret: function(type) {
            var diag = bootbox.dialog({
                message: "<form class=\"bootbox-form form-horizontal form-bordered form-label-stripped\" onsubmit=\"return false\" role=\"form\" id=\"__editform\">" +
                    "<div class=\"form-body\">" +
                    "<div class=\"form-group\" id=\"dg_oldpass\">" +
                    "<label class=\"col-md-4 control-label\" id=\"dl_oldpass\">谷歌验证码</label>" +
                    "<div class=\"col-md-8\" id=\"di_oldpass\">" +
                    "<div class=\"input-icon right\">" +
                    " <i class=\"fa fa-info-circle tooltips\" data-container=\"body\"></i>" +
                    "<input type=\"text\" maxlength='6'  onkeyup=\"this.value=this.value.replace(/\\D/g,'')\" class=\"bootbox-input bootbox-input-text form-control\" id=\"googleCode\" name=\"googleCode\" value=\"\"/>" +
                    "</div>" +
                    "</div>" +
                    "</div>" +
                    "</div>" +
                    "<input type=\"hidden\" class=\"_mod_id\" id=\"_id\" name=\"_id\" value=\"\"/>" +
                    "</div>" +
                    "</form>",
                title: "重置对接密钥",
                buttons: {
                    success: {
                        label: "确定",
                        className: "green",
                        callback: function() {
                            var googleCode = $("#googleCode").val();
                            if (googleCode==""||googleCode.length!=6) {
                                bootbox.alert("谷歌验证码不正确!");
                                return;
                            }
                            var param = {};
                            param["googleCode"] = googleCode;
                            param["state"] = 2;
                            param["type"] = type;
                            $.ajax({
                                url:"mf/use/pbqus.do",
                                headers:{
                                    'Accept': 'application/json',
                                    'Content-Type': 'application/json'
                                },
                                type:"POST",
                                dateType:"json",
                                data:JSON.stringify(param),
                                success:function(data){
                                    if(data.errcode==1){
                                        bootbox.alert(data.msg,function () {
                                            window.location.reload();
                                        });
                                    }else{
                                        bootbox.alert(data.msg);
                                    }
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
        mfPublicKeyFind: function() {
            var diag = bootbox.dialog({
                message: "<form class=\"bootbox-form form-horizontal form-bordered form-label-stripped\" onsubmit=\"return false\" role=\"form\" id=\"__editform\">" +
                            "<div class=\"form-body\">" +
                                "<div class=\"form-group\" id=\"dg_oldpass\">" +
                                    "<label class=\"col-md-4 control-label\" id=\"dl_oldpass\">谷歌验证码</label>" +
                                    "<div class=\"col-md-8\" id=\"di_oldpass\">" +
                                        "<div class=\"input-icon right\">" +
                                        " <i class=\"fa fa-info-circle tooltips\" data-container=\"body\"></i>" +
                                        "<input type=\"text\" maxlength='6' onkeyup=\"this.value=this.value.replace(/\\D/g,'')\" class=\"bootbox-input bootbox-input-text form-control\" id=\"googleCode\" name=\"googleCode\" value=\"\"/>" +
                                    "</div>" +
                                "</div>" +
                            "</div>" +
                            "</div>" +
                                "<input type=\"hidden\" class=\"_mod_id\" id=\"_id\" name=\"_id\" value=\"\"/>" +
                            "</div>" +
                        "</form>",
                title: "查看商户公钥",
                buttons: {
                    success: {
                        label: "确定",
                        className: "green",
                        callback: function() {
                            var googleCode = $("#googleCode").val();
                            if (googleCode== ""||googleCode.length!=6) {
                                bootbox.alert("谷歌验证码不正确!");
                                return;
                            }
                            var param = {};
                            param["googleCode"] = googleCode;
                            param["state"] = 1;
                            $.ajax({
                                url:"mf/use/pbqus.do",
                                headers:{
                                    'Accept': 'application/json',
                                    'Content-Type': 'application/json'
                                },
                                type:"POST",
                                dateType:"json",
                                data:JSON.stringify(param),
                                success:function(data){
                                    if(data.errcode==1){
                                        bootbox.alert("你的公钥:"+data.mfPublicKey);;
                                    }else{
                                        bootbox.alert(data.msg);
                                    }
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
        mfPrivateKeyFind: function() {
            var diag = bootbox.dialog({
                message: "<form class=\"bootbox-form form-horizontal form-bordered form-label-stripped\" onsubmit=\"return false\" role=\"form\" id=\"__editform\">" +
                            "<div class=\"form-body\">" +
                                "<div class=\"form-group\" id=\"dg_oldpass\">" +
                                    "<label class=\"col-md-4 control-label\" id=\"dl_oldpass\">谷歌验证码</label>" +
                                    "<div class=\"col-md-8\" id=\"di_oldpass\">" +
                                        "<div class=\"input-icon right\">" +
                                        " <i class=\"fa fa-info-circle tooltips\" data-container=\"body\"></i>" +
                                        "<input type=\"text\" maxlength='6' onkeyup=\"this.value=this.value.replace(/\\D/g,'')\" class=\"bootbox-input bootbox-input-text form-control\" id=\"googleCode\" name=\"googleCode\" value=\"\"/>" +
                                    "</div>" +
                                "</div>" +
                            "</div>" +
                            "</div>" +
                                "<input type=\"hidden\" class=\"_mod_id\" id=\"_id\" name=\"_id\" value=\"\"/>" +
                            "</div>" +
                        "</form>",
                title: "查看商户私钥",
                buttons: {
                    success: {
                        label: "确定",
                        className: "green",
                        callback: function() {
                            var googleCode = $("#googleCode").val();
                            if (googleCode== ""||googleCode.length!=6) {
                                bootbox.alert("谷歌验证码不正确!");
                                return;
                            }
                            var param = {};
                            param["googleCode"] = googleCode;
                            param["state"] = 1;
                            $.ajax({
                                url:"mf/use/pbqus.do",
                                headers:{
                                    'Accept': 'application/json',
                                    'Content-Type': 'application/json'
                                },
                                type:"POST",
                                dateType:"json",
                                data:JSON.stringify(param),
                                success:function(data){
                                    if(data.errcode==1){
                                        bootbox.alert("你的私钥:"+data.mfPrivateKey);;
                                    }else{
                                        bootbox.alert(data.msg);
                                    }
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
                message:
                    "<form class=\"bootbox-form form-horizontal form-bordered form-label-stripped\" onsubmit=\"return false\" role=\"form\" id=\"__editform\">" +
                    "<div class=\"form-body\">" +
                    "<div class=\"form-group\" id=\"dg_newpassword\">" +
                    "<label class=\"col-md-4 control-label\" id=\"dl_oldpass\">新密码</label>" +
                    "<div class=\"col-md-8\" id=\"di_newpassword\">" +
                    "<div class=\"input-icon right\">" +
                    " <i class=\"fa fa-info-circle tooltips\" data-container=\"body\"></i>" +
                    "<input type=\"password\" maxlength='6' onkeyup=\"this.value=this.value.replace(/\\D/g,'')\" class=\"bootbox-input bootbox-input-text form-control\" id=\"newpassword\" name=\"newpassword\" value=\"\"/>" +
                    "</div>" +
                    "</div>" +
                    "</div>" +
                    "<div class=\"form-group\" id=\"dg_confirmpwd\">" +
                    "<label class=\"col-md-4 control-label\" id=\"dl_newpass\">确认新密码</label>" +
                    "<div class=\"col-md-8\" id=\"di_confirmpwd\">" +
                    "<div class=\"input-icon right\">" +
                    " <i class=\"fa fa-info-circle tooltips\" data-container=\"body\"></i>" +
                    "<input type=\"password\" maxlength='6' onkeyup=\"this.value=this.value.replace(/\\D/g,'')\" class=\"bootbox-input bootbox-input-text form-control\" id=\"confirmpwd\" name=\"confirmpwd\" value=\"\"/>" +
                    "</div>" +
                    "</div>" +
                    "</div>" +
                    "<div class=\"form-group\" id=\"dg_goocode\">" +
                    "<label class=\"col-md-4 control-label\" id=\"dl_conpass\">谷歌验证码</label>" +
                    "<div class=\"col-md-8\" id=\"di_goocode\">" +
                    "<div class=\"input-icon right\">" +
                    " <i class=\"fa fa-info-circle tooltips\" data-container=\"body\"></i>" +
                    "<input type=\"password\" maxlength='6' onkeyup=\"this.value=this.value.replace(/\\D/g,'')\" class=\"bootbox-input bootbox-input-text form-control\" id=\"goocode\" name=\"goocode\" value=\"\"/>" +
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
                            if (moditem["goocode"] == ""||moditem["goocode"].length!=6) {
                                bootbox.alert("谷歌验证码不正确!");
                                return;
                            }
                            if (moditem["confirmpwd"] == ""||moditem["confirmpwd"].length!=6) {
                                bootbox.alert("密码必须为6位数字!");
                                $("#confirmpwd").focus();
                                return false;
                            }
                            if (moditem["newpassword"] == ""||moditem["newpassword"].length!=6) {
                                bootbox.alert("密码必须为6位数字!");
                                $("#newpassword").focus();
                                return false;
                            }
                            if (moditem["confirmpwd"] != moditem["newpassword"]) {
                                bootbox.alert("两次密码不一致!");
                                $("#newpassword").val("");
                                $("#newpassword").focus();
                                return false;
                            }
                            var newpassword = $("#newpassword").val();
                            var confirmpwd = $("#confirmpwd").val();
                            var goocode = $("#goocode").val();
                            var passw = {};
                            passw["googleCode"] = goocode;
                            passw["moneyPasswordFirst"] =  $.md5(newpassword);
                            passw["moneyPasswordSecond"] = $.md5(confirmpwd);
                            passw["state"] = 2;
                            $.ajax({
                                url:'mf/use/pbqus.do',
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
                                        window.location.replace("/login.html");
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
        walletAddressFind: function() {
            var diag = bootbox.dialog({
                message: "<form class=\"bootbox-form form-horizontal form-bordered form-label-stripped\" onsubmit=\"return false\" role=\"form\" id=\"__editform\">" +
                    "<div class=\"form-body\">" +
                    "<div class=\"form-group\" id=\"dg_oldpass\">" +
                    "<label class=\"col-md-4 control-label\" id=\"dl_oldpass\">谷歌验证码</label>" +
                    "<div class=\"col-md-8\" id=\"di_oldpass\">" +
                    "<div class=\"input-icon right\">" +
                    " <i class=\"fa fa-info-circle tooltips\" data-container=\"body\"></i>" +
                    "<input type=\"text\" class=\"bootbox-input bootbox-input-text form-control\" id=\"newmobile\" name=\"newmobile\" value=\"\"/>" +
                    "</div>" +
                    "</div>" +
                    "</div>" +
                    "</div>" +
                    "<input type=\"hidden\" class=\"_mod_id\" id=\"_id\" name=\"_id\" value=\"\"/>" +
                    "</div>" +
                    "</form>",
                title: "查看钱包地址",
                buttons: {
                    success: {
                        label: "确定",
                        className: "green",
                        callback: function() {
                            var newmobile = $("#newmobile").val();
                            if (strUtil.isEmpty(newmobile)) {
                                bootbox.alert("请输入谷歌验证码");
                                $("#newmobile").focus();
                                return false;
                            }
                            var passw = {};
                            passw["googlecode"] = newmobile;
                            $.ajax({
                                url:"mf/use/pbusm.do",
                                headers:{
                                    'Accept': 'application/json',
                                    'Content-Type': 'application/json'
                                },
                                type:"POST",
                                dateType:"json",
                                data:JSON.stringify(passw),
                                success:function(data){
                                    if(data.resultcode==1){
                                        $('#walletAddress').html(data.walletAddress);
                                    }else{
                                        bootbox.alert(data.resultmsg);
                                    }
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
        url: "/mf/usr/pbggg.do",
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
            $('#googlekey').html(secret);
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

/**查看对接KEY */
$('#mfSignKeyFind').click(function(){
    common.userKey();
});
/**查看公有密钥 */
$('#mfPublicKeyFind').click(function(){
    common.mfPublicKeyFind();
});
/**查看私有密钥 */
$('#mfPrivateKeyFind').click(function(){
    common.mfPrivateKeyFind();
});
/**查看钱包地址 */
$('#walletAddressFind').click(function(){
    common.walletAddressFind();
});
/**重置商户公有密钥 */
$('#mfPublicKeyFindReset').click(function(){
    common.userResetSecret("public");
});

/**重置商户私有密钥 */
$('#mfPrivateKeyReset').click(function(){
    common.userResetSecret("private");
});
