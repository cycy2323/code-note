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
        url: "/ug/usr/pbpis.do?reqresource='1'",
        dataType: 'json',
        contentType: "application/json;charset=utf-8",
        async: false,
        data:'',
        success: function(result) {
           // console.log(result);
           if(result && result.errcode == '1'){
               var userInfo = result.userinfo;
               if(userInfo.istrpwd == '1') {
                    document.getElementById('updatePWD').style.display = 'block';
                    document.getElementById('setPWD').style.display = 'none';
               } else {
                   document.getElementById('updatePWD').style.display = 'none';
                   document.getElementById('setPWD').style.display = 'block';
               }
                $('#userId').html(userInfo.userid);
                // $('#').html();
                $('#nickname').html(userInfo.nickname);

                if(userInfo.valigooglesecret==0){
                        $('#valiGoogleSecret').html('未绑定');
                        $('#bindGoogle').show();
                }else{
                        var googlesecret = userInfo.googlesecret;
                        $('#valiGoogleSecret').html(googlesecret);
                        $('#bindGoogle').hide();
                }
                // 高级认证根据返回字段判断是否已认证
               if (result.userinfo.isSeniorCertification === '1') {
                   $('#isApprove').html('已认证');
               } else {
                   $('#isApprove').html('未认证');
               }
                var valiIdNumber = userInfo.valiidnumber;
                if(valiIdNumber==0){
                        $('#realname').html('未实名认证');
                        $('#authentication').show();
                    }else if(valiIdNumber==1){
                        $('#realname').html('待审核');
                        $('#authentication').hide();
                    }else if(valiIdNumber==2){
                        $('#realname').html('审核未通过');
                        $('#authentication').show();
                    }else if(valiIdNumber==3){
                        $('#realname').html("审核通过");
                        $('#authentication').hide();
                    }
                $('#password').html(result.password);
                }
        },
        error: function() {
            bootbox.alert("接口异常");
            // window.location="login.html"
        }
    });
});
/**修改手机号 */
$('#updateMobile').click(function(){
    common.updateMobile();
    var mobile = $('#mobile').text();
    $("#newmobile").val(mobile);
});
/**手机号 */
var common = function() {
    return {
        // updateMobile: function() {
        //     var diag = bootbox.dialog({
        //         message: "<form class=\"bootbox-form form-horizontal form-bordered form-label-stripped\" onsubmit=\"return false\" role=\"form\" id=\"__editform\">" +
        //                     "<div class=\"form-body\">" +
        //                         "<div class=\"form-group\" id=\"dg_oldpass\">" +
        //                             "<label class=\"col-md-4 control-label\" id=\"dl_oldpass\">手机号</label>" +
        //                             "<div class=\"col-md-8\" id=\"di_oldpass\">" +
        //                                 "<div class=\"input-icon right\">" +
        //                                 " <i class=\"fa fa-info-circle tooltips\" data-container=\"body\"></i>" +
        //                                 "<input type=\"text\" class=\"bootbox-input bootbox-input-text form-control\" id=\"newmobile\" name=\"newmobile\" value=\"\"/>" +
        //                             "</div>" +
        //                         "</div>" +
        //                     "</div>" +
        //                     "</div>" +
        //                         "<input type=\"hidden\" class=\"_mod_id\" id=\"_id\" name=\"_id\" value=\"\"/>" +
        //                     "</div>" +
        //                 "</form>",
        //         title: "手机号",
        //         buttons: {
        //             success: {
        //                 label: "确定",
        //                 className: "green",
        //                 callback: function() {
        //                     var userinfo = JSON.parse(localStorage.getItem('user_info'));
        //                     // console.log(userinfo.userId)
        //                     var newmobile = $("#newmobile").val();
        //                     if (strUtil.isEmpty(newmobile)) {
        //                         bootbox.alert("请输入手机号");
        //                         $("#newmobile").focus();
        //                         return false;
        //                     }
        //                     if(!strUtil.isPhoneNumber(newmobile)){
        //                         bootbox.alert('请输入正确的手机号');
        //                         $("#newmobile").focus();
        //                         return false;
        //                     }
        //                     var passw = {};
        //                     passw["mobile"] = newmobile;
        //                     $.ajax({
        //                         url:hzq_rest + "mfsysuser/"+userinfo.userId,
        //                         headers:{
        //                             'Accept': 'application/json',
        //                             'Content-Type': 'application/json'
        //                         },
        //                         type:"PUT",
        //                         dateType:"json",
        //                         data:JSON.stringify(passw),
        //                         success:function(data){
        //                             if(data.success){
        //                                 bootbox.alert("修改成功",function(){
        //                                     location.reload();
        //                                 })
        //                             }
        //                         }
        //                     })
        //                 }
        //             },
        //             danger: {
        //                 label: "取消",
        //                 className: "gray",
        //                 callback: function() {}
        //             },

        //         }
        //     }, {
        //         show: false,
        //         "keyboard": true
        //     });
        //     diag.show();
        //     $("#oldpass").focus();
        // },
        // updateEmail: function() {
        //     var diag = bootbox.dialog({
        //         message: "<form class=\"bootbox-form form-horizontal form-bordered form-label-stripped\" onsubmit=\"return false\" role=\"form\" id=\"__editform\">" +
        //                     "<div class=\"form-body\">" +
        //                         "<div class=\"form-group\" id=\"dg_oldpass\">" +
        //                             "<label class=\"col-md-4 control-label\" id=\"dl_oldpass\">邮箱</label>" +
        //                             "<div class=\"col-md-8\" id=\"di_oldpass\">" +
        //                                 "<div class=\"input-icon right\">" +
        //                                 " <i class=\"fa fa-info-circle tooltips\" data-container=\"body\"></i>" +
        //                                 "<input type=\"text\" class=\"bootbox-input bootbox-input-text form-control\" id=\"newemail\" name=\"newemail\" value=\"\"/>" +
        //                             "</div>" +
        //                         "</div>" +
        //                     "</div>" +
        //                     "</div>" +
        //                         "<input type=\"hidden\" class=\"_mod_id\" id=\"_id\" name=\"_id\" value=\"\"/>" +
        //                     "</div>" +
        //                 "</form>",
        //         title: "邮箱",
        //         buttons: {
        //             success: {
        //                 label: "确定",
        //                 className: "green",
        //                 callback: function() {
        //                     var userinfo = JSON.parse(localStorage.getItem('user_info'));
        //                     // console.log(userinfo.userId)
        //                     var newemail = $("#newemail").val();
        //                     if (strUtil.isEmpty(newemail)) {
        //                         bootbox.alert("请输入邮箱");
        //                         $("#newemail").focus();
        //                         return false;
        //                     }
        //                     if(!strUtil.isEmail(newemail)){
        //                         bootbox.alert('请输入正确的邮箱');
        //                         $("#newemail").focus();
        //                         return false;
        //                     }
        //                     var passw = {};
        //                     passw["email"] = newemail;
        //                     $.ajax({
        //                         url:hzq_rest + "mfsysuser/"+userinfo.userId,
        //                         headers:{
        //                             'Accept': 'application/json',
        //                             'Content-Type': 'application/json'
        //                         },
        //                         type:"PUT",
        //                         dateType:"json",
        //                         data:JSON.stringify(passw),
        //                         success:function(data){
        //                             if(data.success){
        //                                 bootbox.alert("修改成功",function(){
        //                                     location.reload();
        //                                 })
        //                             }
        //                         }
        //                     })
        //                 }
        //             },
        //             danger: {
        //                 label: "取消",
        //                 className: "gray",
        //                 callback: function() {}
        //             },

        //         }
        //     }, {
        //         show: false,
        //         "keyboard": true
        //     });
        //     diag.show();
        //     $("#oldpass").focus();
        // },
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
                                url:'/ug/usr/pbbgg.do',
                                type: 'POST',
                                dateType:"json",
                                data:JSON.stringify(param),
                                success:function(data){
                                    bootbox.alert(data.msg,function(){
                                        location.reload();
                                    });
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
                                    "<label class=\"col-md-4 control-label\" id=\"dl_oldpass\">谷歌验证码</label>" +
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
                title: "登录密码修改",
                buttons: {
                    success: {
                        label: "修改",
                        className: "green",
                        callback: function() {
                            var userinfo = JSON.parse(localStorage.getItem('user_info'));
                            // console.log(userinfo.userId);
                            // var userid = Restful.findNQ(hzq_rest+"mfsysuser/"+userinfo.userId);
                            // console.log(userid.password)
                            var moditem = {};
                            $.each($('#__editform input'), function(index, val) {
                                if (val.name == "_id" || !val.name || val.name.length == 0) return;
                                moditem[val.name] = val.value;
                            });
                            // console.log(moditem)
                            if (moditem["oldpass"] == "") {
                                alert("请输入谷歌验证码");
                                $("#oldpass").focus();
                                return false;
                            }
                            if (moditem["newpass"] == "") {
                                alert("请输入新密码");
                                $("#newpass").focus();
                                return false;
                            }
                            // //校验新密码
                            // if(OtcOrdBas.checkStrong(moditem["newpass"])<2){
                            //     bootbox.alert("新密码必须包含数字、大小写字母，长度8~16位");
                            //     $("#newpass").focus();
                            //     return false;
                            // }
                            if (moditem["conpass"] == "") {
                                alert("请输入确认新密码");
                                $("#conpass").focus();
                                return false;
                            }
                            if (moditem["newpass"] != moditem["conpass"]) {
                                alert("输入新密码不一致");
                                $("#conpass").val("");
                                $("#conpass").focus();
                                return false;
                            }

                            var username = $.cookie('username');
                            var accountid = $.cookie('accountid');
                            var oldpass = $("#oldpass").val();
                            var password = $("#newpass").val();
                            var dl_conpass = $("#conpass").val();
                            var passw = {};
                            passw["newpwd"] = $.md5(password);
                            passw["googlecode"] =oldpass;
                            passw["confirmpwd"] = $.md5(dl_conpass);
                            passw["type"]='loginpwd';

                            $.ajax({
                                url:'/ug/usr/pbvcs.do',
                                type: 'POST',
                                dateType:"json",
                                data:JSON.stringify(passw),
                                success:function(data){
                                    if(data.errcode == '1'){
                                        bootbox.alert(data.msg,function(){
                                        });
                                    }else if(data.errcode=="599"){//回话超时，转回登录
                                        bootbox.alert(data.msg,()=>{
                                            window.location.replace("/login.html");
                                        });
                                        return;
                                    }else{
                                        bootbox.alert(data.msg)
                                        return
                                    }

                                },
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
        updatePassword2: function() {
            var diag = bootbox.dialog({
                message: "<form class=\"bootbox-form form-horizontal form-bordered form-label-stripped\" onsubmit=\"return false\" role=\"form\" id=\"__editform\">" +
                    "<div class=\"form-body\">" +
                    "<div class=\"form-group\" id=\"dg_oldpass\">" +
                    "<label class=\"col-md-4 control-label\" id=\"dl_oldpass\">谷歌验证码</label>" +
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
                title: "支付密码修改",
                buttons: {
                    success: {
                        label: "确定",
                        className: "green",
                        callback: function() {
                            var username = $.cookie('username');
                            var accountid = $.cookie('accountid');
                            var oldpass = $("#oldpass").val();
                            var password = $("#newpass").val();
                            var dl_conpass = $("#conpass").val();
                            var passw = {};
                            passw["pwd"] = $.md5(password);
                            passw["googlecode"] =oldpass;
                            passw["confirmpwd"] =$.md5(dl_conpass);
                            passw["type"]='loginpwd';
                            var userinfo = JSON.parse(localStorage.getItem('user_info'));

                            // console.log(userinfo.userId);
                            // var userid = Restful.findNQ(hzq_rest+"mfsysuser/"+userinfo.userId);
                            // console.log(userid.password)
                            var moditem = {};
                            $.each($('#__editform input'), function(index, val) {
                                if (val.name == "_id" || !val.name || val.name.length == 0) return;
                                moditem[val.name] = val.value;
                            });
                            // console.log(moditem)
                            if (moditem["oldpass"] == "") {
                                alert("请输入谷歌验证码");
                                $("#oldpass").focus();
                                return false;
                            }
                            if (moditem["newpass"] == "") {
                                alert("请输入新密码");
                                $("#newpass").focus();
                                return false;
                            }
                            // //校验新密码
                            // if(OtcOrdBas.checkStrong(moditem["newpass"])<2){
                            //     bootbox.alert("新密码必须包含数字、大小写字母，长度8~16位");
                            //     $("#newpass").focus();
                            //     return false;
                            // }
                            if (moditem["conpass"] == "") {
                                alert("请输入确认新密码");
                                $("#conpass").focus();
                                return false;
                            }
                            if (moditem["newpass"] != moditem["conpass"]) {
                                alert("输入新密码不一致");
                                $("#conpass").val("");
                                $("#conpass").focus();
                                return false;
                            }
                            $.ajax({
                                url:'/ug/usr/pbrpp.do',
                                type: 'POST',
                                dateType:"json",
                                data:JSON.stringify(passw),
                                success:function(data){
                                    if(data.errcode == '1'){
                                        bootbox.alert(data.msg,function () {
                                            location.reload();
                                        });
                                        // bootbox.alert(data.msg,function(){
                                        //     if(data.errcode==1){
                                        //         prelocation = "/login.html";
                                        //         window.location.replace(prelocation);
                                        //     }
                                        // });
                                    }else{
                                        bootbox.alert(data.msg);
                                        return;
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
        setPassword: function() {
            var diag = bootbox.dialog({
                message: "<form class=\"bootbox-form form-horizontal form-bordered form-label-stripped\" onsubmit=\"return false\" role=\"form\" id=\"__editform\">" +
                    // "<div class=\"form-body\">" +
                    // "<div class=\"form-group\" id=\"dg_oldpass\">" +
                    // "<label class=\"col-md-4 control-label\" id=\"dl_oldpass\">原密码</label>" +
                    // "<div class=\"col-md-8\" id=\"di_oldpass\">" +
                    // "<div class=\"input-icon right\">" +
                    // " <i class=\"fa fa-info-circle tooltips\" data-container=\"body\"></i>" +
                    // "<input type=\"password\" class=\"bootbox-input bootbox-input-text form-control\" id=\"oldpass\" name=\"oldpass\" value=\"\"/>" +
                    // "</div>" +
                    // "</div>" +
                    // "</div>" +
                    "<div class=\"form-group\" id=\"dg_newpass\">" +
                    "<label class=\"col-md-4 control-label\" id=\"dl_newpass\">密码</label>" +
                    "<div class=\"col-md-8\" id=\"di_newpass\">" +
                    "<div class=\"input-icon right\">" +
                    " <i class=\"fa fa-info-circle tooltips\" data-container=\"body\"></i>" +
                    "<input type=\"password\" class=\"bootbox-input bootbox-input-text form-control\" id=\"newpass\" name=\"newpass\" value=\"\"/>" +
                    "</div>" +
                    "</div>" +
                    "</div>" +
                    "<div class=\"form-group\" id=\"dg_conpass\">" +
                    "<label class=\"col-md-4 control-label\" id=\"dl_conpass\">确认密码</label>" +
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
                title: "设置支付密码",
                buttons: {
                    success: {
                        label: "确定",
                        className: "green",
                        callback: function() {
                            var username = $.cookie('username');
                            var accountid = $.cookie('accountid');
                            var oldpass = $("#oldpass").val();
                            var password = $("#newpass").val();
                            var dl_conpass = $("#conpass").val();
                            var passw = {};
                            passw["pwd"] = $.md5(password);
                            // passw["oldpwd"] = $.md5(oldpass);
                            passw["confirmpwd"] = $.md5(dl_conpass);
                            passw["type"]='loginpwd';
                            $.ajax({
                                url:'/ug/usr/pbstg.do',
                                type: 'POST',
                                dateType:"json",
                                data:JSON.stringify(passw),
                                success:function(data){
                                    if(data.errcode == '1'){
                                        bootbox.alert(data.msg,function () {
                                            location.reload();
                                        });
                                    }else{
                                        bootbox.alert(data.msg);
                                        return;
                                    }

                                }
                            })
                            var userinfo = JSON.parse(localStorage.getItem('user_info'));

                            // console.log(userinfo.userId);
                            // var userid = Restful.findNQ(hzq_rest+"mfsysuser/"+userinfo.userId);
                            // console.log(userid.password)
                            var moditem = {};
                            $.each($('#__editform input'), function(index, val) {
                                if (val.name == "_id" || !val.name || val.name.length == 0) return;
                                moditem[val.name] = val.value;
                            });
                            // console.log(moditem)
                            if (moditem["oldpass"] == "") {
                                alert("请输入原密码");
                                $("#oldpass").focus();
                                return false;
                            }
                            if (moditem["newpass"] == "") {
                                alert("请输入新密码");
                                $("#newpass").focus();
                                return false;
                            }
                            //校验新密码
                            if(OtcOrdBas.checkStrong(moditem["newpass"])<2){
                                bootbox.alert("新密码必须包含数字、大小写字母，长度8~16位");
                                $("#newpass").focus();
                                return false;
                            }
                            if (moditem["conpass"] == "") {
                                alert("请输入确认新密码");
                                $("#conpass").focus();
                                return false;
                            }
                            if (moditem["newpass"] != moditem["conpass"]) {
                                alert("输入新密码不一致");
                                $("#conpass").val("");
                                $("#conpass").focus();
                                return false;
                            }

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
        // seniorCertification: function() {
        //     var diag = bootbox.dialog({
        //         message: "<form class=\"bootbox-form form-horizontal form-bordered form-label-stripped\" onsubmit=\"return false\" role=\"form\" id=\"__editform\">" +
        //                     "<div class=\"form-body\">" +
        //                         "<div class=\"form-group\" id=\"dg_oldpass\">" +
        //                             "<label class=\"col-md-4 control-label\" id=\"dl_oldpass\"></label>" +
        //                             "<div class=\"col-md-8\" id=\"di_oldpass\">" +
        //                                 "<div class=\"input-icon right\">" +
        //                                 " <i class=\"fa fa-info-circle tooltips\" data-container=\"body\"></i>" +
        //                                 "<input type=\"text\" class=\"bootbox-input bootbox-input-text form-control\" id=\"realname\" name=\"realname\" value=\"\"/>" +
        //                             "</div>" +
        //                         "</div>" +
        //                         "<div class=\"form-group\" id=\"dg_oldpass\">" +
        //                             "<label class=\"col-md-4 control-label\" id=\"dl_oldpass\"></label>" +
        //                             "<div class=\"col-md-8\" id=\"di_oldpass\">" +
        //                                 "<div class=\"input-icon right\">" +
        //                                 " <i class=\"fa fa-info-circle tooltips\" data-container=\"body\"></i>" +
        //                                 "<input type=\"text\" class=\"bootbox-input bootbox-input-text form-control\" id=\"idnumber\" name=\"idnumber\" value=\"\"/>" +
        //                             "</div>" +
        //                         "</div>" +
        //                     "</div>" +
        //                     "</div>" +
        //                         "<input type=\"hidden\" class=\"_mod_id\" id=\"_id\" name=\"_id\" value=\"\"/>" +
        //                     "</div>" +
        //                 "</form>",
        //         title: "高级认证",
        //         buttons: {
        //             success: {
        //                 label: "确定",
        //                 className: "green",
        //                 callback: function() {
        //                     var userinfo = JSON.parse(localStorage.getItem('user_info'));
        //                     var realname = $("#realname").val();
        //                     var idnumber = $("#idnumber").val();
        //                     if (strUtil.isEmpty(realname)) {
        //                         bootbox.alert("请输入姓名");
        //                         $("#realname").focus();
        //                         return false;
        //                     }
        //                     if(!strUtil.isEmail(idnumber)){
        //                         bootbox.alert('请输入身份证号');
        //                         $("#idnumber").focus();
        //                         return false;
        //                     }
        //                     var param = {};
        //                     param["realname"] = realname;
        //                     param["certificateno"] = idnumber;
        //                     $.ajax({
        //                         url:'/mf/usr/pbuas.do',
        //                         type: 'POST',
        //                         dateType:"json",
        //                         data:JSON.stringify(param),
        //                         success:function(data){
        //                             bootbox.alert(data.msg);
        //                         }
        //                     })
        //                 }
        //             },
        //             danger: {
        //                 label: "取消",
        //                 className: "gray",
        //                 callback: function() {}
        //             },
        //
        //         }
        //     }, {
        //         show: false,
        //         "keyboard": true
        //     });
        //     diag.show();
        //     $("#oldpass").focus();
        // },
        dockingKey: function() {
            var diag = bootbox.dialog({
                message: "<form class=\"bootbox-form form-horizontal form-bordered form-label-stripped\" onsubmit=\"return false\" role=\"form\" id=\"__editform\">" +
                            "<div class=\"form-body\">" +
                                "<div class=\"form-group\" id=\"dg_oldpass\">" +
                                    "<label class=\"col-md-4 control-label\" id=\"dl_oldpass\">对称密钥</label>" +
                                    "<div class=\"col-md-8\" id=\"di_oldpass\">" +
                                        "<div class=\"input-icon right\">" +
                                        " <i class=\"fa fa-info-circle tooltips\" data-container=\"body\"></i>" +
                                        "<input type=\"text\" class=\"bootbox-input bootbox-input-text form-control\" id=\"dockingKeyInput\" name=\"dockingKeyInput\" value=\"\"/>" +
                                    "</div>" +
                                "</div>" +
                            "</div>" +
                            "</div>" +
                                "<input type=\"hidden\" class=\"_mod_id\" id=\"_id\" name=\"_id\" value=\"\"/>" +
                            "</div>" +
                        "</form>",
                title: "查看对称密钥",
                buttons: {
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
    var email = $('#email').text();
    $("#newemail").val(email);
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
        url: "ug/usr/pbggg.do",
        dataType: 'json',
        contentType: "application/json;charset=utf-8",
        data:JSON.stringify(param),
        success: function(result) {
            var secret =result.resultinfo && result.resultinfo.secret;
            var qrcodeurl =result.resultinfo &&  result.resultinfo.qrcodeurl;
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
        error: function() {
            bootbox.alert("接口异常");
            // window.location="login.html"
        }
    });
});
/**修改登陆密码 */
$('#updatePassword').click(function(){
    common.updatePassword();
});
/**实名认证 */
$('#authentication').click(function(){
    common.authentication();
});
/**高级认证 */
// $('#seniorCertification').click(function(){
//     common.seniorCertification();
// });
/**查看对称密钥 */
$('#dockingKeyFind').click(function(){
    common.dockingKey();
    var result = $('#dockingKey').text();
    $('#dockingKeyInput').val(result);
});

$('#updatePWD').click(function(){
    common.updatePassword2();
});

$('#setPWD').click(function(){
    common.setPassword();
});
