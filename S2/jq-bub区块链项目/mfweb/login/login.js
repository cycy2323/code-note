var oldpwd="";
var loginName="";
var LoginAction = function() {
    $.ajax({
        url:'/mf/use/pbsis.do',
        type: 'POST',
        success:function(data){
            if(data.error_code=="599"){
                var keys = document.cookie.match(/[^ =;]+(?=\=)/g);
                if (keys) {
                    for (var i = keys.length; i--;) {
                        document.cookie = keys[i] + '=0;path=/;expires=' + new Date(0).toUTCString();//清除当前域名下的,例如：m.kevis.com
                    }
                }
            }else if(data.error_code=="699"){
                window.location="index.html"
            }
        }
    })
    var lostLogin=0;
    var callback = function(){
        lostLogin=new Date().getTime();
        // console.log("callback")
    }
    return {
        passwordTxt:$("#password"),
        loginnameTxt:$("#loginname"),
        loginBtn:$('#submitbtn'),
        keys:null,
        init:function(){
            this.passwordTxt.on('keypress',this.passwordKeyPress);
            this.loginnameTxt.on('keypress',this.passwordKeyPress);
            this.loginBtn.on('click',this.loginClick);
        },
        passwordKeyPress:function(event){
            if ( event.keyCode == 13 ) {
                LoginAction.loginClick();
                event.stopPropagation();
                event.preventDefault();
            }
        },
        loginClick:function(){
            if(!LoginAction.passwordTxt.val() && !LoginAction.loginnameTxt.val()){
                bootbox.alert("请输入用户名和密码！")
            }else if(!LoginAction.passwordTxt.val() && LoginAction.loginnameTxt.val()){
                bootbox.alert("请输入密码！")
            }else if(LoginAction.passwordTxt.val() && !LoginAction.loginnameTxt.val()){
                bootbox.alert("请输入用户名！")
            }else{
                LoginAction.login();
            }
        },
        login:function(){
            oldpwd=$.md5(LoginAction.passwordTxt.val());
            loginName=LoginAction.loginnameTxt.val();
            LoginAction.callLogin($.md5(LoginAction.passwordTxt.val()));
        },
        updatePassword: function() {
            var diag = bootbox.dialog({
                message: "<form class=\"bootbox-form form-horizontal form-bordered form-label-stripped\" onsubmit=\"return false\" role=\"form\" id=\"_updatePassword\">" +
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
                title: "首次登录,请您进行密码修改",
                buttons: {
                    success: {
                        label: "修改",
                        className: "green",
                        callback: function() {
                            var moditem = {};
                            $.each($('#_updatePassword input'), function(index, val) {
                                if (val.name == "_id" || !val.name || val.name.length == 0) return;
                                moditem[val.name] = val.value;
                            });
                            var pattern =(/^(?=.*[0-9].*)(?=.*[A-Z].*)(?=.*[a-z].*).{6,20}$/);
                            if ((!pattern.test(moditem["newpass"]))||moditem["newpass"].length<8) {
                                bootbox.alert("新密码长度须大于7位包含数字大小写字母");
                                $("#newpass").focus();
                                return;
                            } else if ((!pattern.test(moditem["conpass"]))||moditem["conpass"].length<8) {
                                bootbox.alert("确认密码长度须大于7位包含数字大小写字母");
                                $("#conpass").focus();
                                return;
                            } else if (moditem["newpass"] != moditem["conpass"]) {
                                bootbox.alert("输入新密码不一致");
                                $("#conpass").val("");
                                $("#conpass").focus();
                                return false;
                            }
                            var dl_conpass = $("#conpass").val();
                            var passw = {};
                            passw["newpassword"] = $.md5(dl_conpass);
                            passw["oldpassword"] = oldpwd;
                            passw["logInName"] = loginName;
                            $.ajax({
                                url:'/mf/use/pbupu.do',
                                type: 'POST',
                                dateType:"json",
                                data:JSON.stringify(passw),
                                success:function(data){
                                    bootbox.alert(data.resultmsg,function(){
                                        prelocation = "/login.html";
                                        window.location.replace(prelocation);
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
        callLogin:function(mdPw){
            $.ajax({
                url:'/mf/lio/pblin.do',
                type: 'POST',
                dataType:'json',
                contentType:"application/json; charset=utf-8",
                data: JSON.stringify({"user_name": LoginAction.loginnameTxt.val() , "password": mdPw }),
                async:false,
                success:function(data, textStatus, xhr) {
                    localStorage.setItem("menu_info",JSON.stringify(data.menu_info));
                    localStorage.setItem("user_info",JSON.stringify(data.user_info));
                    if(data.err_code && data.err_code == "1"){
                        //判断是否首次登陆
                        var flag = data.user_info.flag;
                        if(flag==0){
                            LoginAction.updatePassword();
                        }else{
                            window.location.replace("index.html");
                        }
                    }else{
                        bootbox.alert(data.msg);
                    }
                }
            })
            ,error(function(err){
                bootbox.alert("服务器繁忙,请稍后再试", function() {
                    location.reload();
                });
            });
        }
    };
}();
