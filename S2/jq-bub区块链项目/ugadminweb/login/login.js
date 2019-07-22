console.log(location.href)
var LoginAction = function() {
    var lostLogin=0;
    var callback = function(){
        lostLogin=new Date().getTime();
    }
    return {
        passwordTxt:$( "#password" ),
        loginnameTxt:$( "#loginname" ),
        loginBtn:  $('#submitbtn'),
        googlecodeTxt:$( "#googlecode" ),
        keys:null,
        init:function(){
            this.bind();
        },
        bind:function(){
            this.passwordTxt.on('keypress',this.passwordKeyPress);
            this.loginnameTxt.on('keypress',this.passwordKeyPress);
            this.loginBtn.on('click',this.loginClick);
            this.googlecodeTxt.on('keypress',this.passwordKeyPress);
        },
        passwordKeyPress:function(event){
             if($('.bootbox').hasClass('in')){
                bootbox.hideAll();
                lostLogin = new Date().getTime();
                return;
            }
            if(new Date().getTime()-lostLogin<300){
                //bootbox.alert("不要登陆太频繁了哦",callback);
                //lostLogin = new Date().getTime();
                return;
            }
            if ( event.keyCode == 13 ) {
                LoginAction.loginClick();
                event.stopPropagation();
                event.preventDefault();
            }
        },
        loginClick:function(){
            //console.log(0);
            if($('.bootbox').hasClass('in')){
                bootbox.hideAll();
                lostLogin = new Date().getTime();
                return;
            }
            if(new Date().getTime()-lostLogin<300){
                //bootbox.alert("不要登陆太频繁了哦",callback);
                //lostLogin = new Date().getTime();
                return;
            }
            if(!LoginAction.passwordTxt.val() && !LoginAction.loginnameTxt.val()){
                bootbox.alert("请输入用户名和密码！")
            }else if(!LoginAction.passwordTxt.val() && LoginAction.loginnameTxt.val()){
                bootbox.alert("请输入密码！")
            }else if(LoginAction.passwordTxt.val() && !LoginAction.loginnameTxt.val()){
                bootbox.alert("请输入用户名！")
            }else if(LoginAction.googlecodeTxt.val() && !LoginAction.googlecodeTxt.val()){
                bootbox.alert("请输入谷歌验证码！")
            }else{
                LoginAction.login();
            }

        },
        login:function(){
            //console.log(1)
            var pwd=$.cookie('pm[password]');
            if($('.bootbox').hasClass('in')){
                bootbox.hideAll();
                lostLogin = new Date().getTime();
                return;
            }
            if(new Date().getTime()-lostLogin<300){
                //bootbox.alert("不要登陆太频繁了哦",callback);
                //lostLogin = new Date().getTime();
                return;
            }
            if(pwd !=LoginAction.passwordTxt.val()){

                if(validateCustom("#target")==1){
                    bootbox.alert("密码规则需符合以下条件：</br>密码不能为空</br>密码长度必须在6至8之间</br>请输入有效的密码,如:PasSw0rD_",callback);
                    return;
                }

                LoginAction.callLogin($.md5(LoginAction.passwordTxt.val()));
                /*$.jCryption.encrypt(LoginAction.passwordTxt.val(), LoginAction.keys, function(encrypted) {
                    LoginAction.callLogin(encrypted);
                });*/
            }else{
                //console.log($.md5(pwd));
                LoginAction.callLogin($.md5(pwd));
            }
        },
        updatePassword: function() {
            var diag = bootbox.dialog({
                message: "<form class=\"bootbox-form form-horizontal form-bordered form-label-stripped\" onsubmit=\"return false\" role=\"form\" id=\"_updatePassword\">" +
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
                            if (moditem["oldpass"] == "") {
                                bootbox.alert("请输入原密码");
                                $("#oldpass").focus();
                                return false;
                            }/*else if($.md5(moditem.oldpass) != userid.password){
                                bootbox.alert("原密码输入错误");
                                $("#oldpass").focus();
                                return false;
                            }*/else if ((!pattern.test(moditem["newpass"]))||moditem["newpass"].length<8) {
                                bootbox.alert("新密码长度须大于7位包含数字大小写字母");
                                $("#newpass").focus();
                                return false;
                            } /*else if (moditem["newpass"] == "") {
                                bootbox.alert("请输入新密码");
                                $("#newpass").focus();
                                return false;
                            }*/ else if ((!pattern.test(moditem["conpass"]))||moditem["conpass"].length<8) {
                                bootbox.alert("确认密码长度须大于7位包含数字大小写字母");
                                $("#conpass").focus();
                                return false;
                            } else if (moditem["newpass"] != moditem["conpass"]) {
                                bootbox.alert("输入新密码不一致");
                                $("#conpass").val("");
                                $("#conpass").focus();
                                return false;
                            }
                            var username = $.cookie('username');
                            var accountid = $.cookie('accountid');
                            var oldpass = $("#oldpass").val();
                            var password = $("#newpass").val();
                            var dl_conpass = $("#conpass").val();
                            var loginname = $("#loginname").val();
                            var passw = {};
                            passw["newpassword"] = $.md5(dl_conpass);
                            passw["oldpassword"] = $.md5(oldpass);
                            passw["loginname"] = loginname;
                            // console.log(passw);
                            $.ajax({
                                url:'/ug/use/pbpwd.do',
                                type: 'POST',
                                dateType:"json",
                                data:JSON.stringify(passw),
                                success:function(data){
                                    bootbox.alert(data.resultmsg,function(){
                                        prelocation = "/login.html";
                                        window.location.replace(prelocation);
                                    });
                                }
                            })
                        }
                    },
                    danger: {
                        label: "取消",
                        className: "gray",
                        callback: function() {}
                    }

                }
            }, {
                show: false,
                "keyboard": true
            });
            diag.show();
            $("#oldpass").focus();
        },
        callLogin:function(mdPw){
            if($('.bootbox').hasClass('in')){
                bootbox.hideAll();
                lostLogin = new Date().getTime();
                return;
            }
            if(new Date().getTime()-lostLogin<300){
                //bootbox.alert("不要登陆太频繁了哦",callback);
                //lostLogin = new Date().getTime();
                return;
            }
            lostLogin = new Date().getTime();
            var prelocation="index.html"
            prelocation=prelocation.split(",")[0]
            dologin = true;
            $.ajax({
                url:'/ug/lio/pblin.do',
                type: 'POST',
                dataType:'json',
                contentType:"application/json; charset=utf-8",
                data: JSON.stringify({"user_name": LoginAction.loginnameTxt.val() , "password": mdPw, "googlecode": LoginAction.googlecodeTxt.val()  }),
                async:false,
                success:function(data, textStatus, xhr) {
                    localStorage.setItem("menu_info",JSON.stringify(data.menu_info));
                    localStorage.setItem("user_info",JSON.stringify(data.user_info));
                    // sessionStorage.setItem("loginStatu","1") //登录成功，设置session的loginStatu="1"
                    if(data.err_code && data.err_code == "1"){
                        $.cookie.json = true;
                        $.cookie('userinfo', JSON.stringify(data.retObj));

                        //window.location.replace("index.html");
                        //  window.location.replace(prelocation);
                        var expires_day = 7;
                        if ($('#remember').is(':checked')) {
                            //cookie有效天数
                            $.cookie('pm[loginname]', $("#loginname").val(), { expires: expires_day });
                            $.cookie('pm[password]', data.description, { expires: expires_day });
                            $.cookie('pm[remember]', true, { expires: expires_day });
                        }
                        else {
                            // reset cookies.
                            $.cookie('pm[loginname]', '');
                            $.cookie('pm[password]', '');
                            $.cookie('pm[remember]', false);
                        }
                        //判断是否首次登陆
                        var flag = data.user_info.flag;
                        if(flag==0){
                            LoginAction.updatePassword();
                        }else{
                            window.location.replace(prelocation);
                        }
                    }else{
                        if(data.msg == "001"){
                            LoginAction.updatePassword();
                        }else {
                            bootbox.alert(data.msg)
                            return;
                        }
                    }
                }
            }).error(function(data,status){
                bootbox.alert("网络故障，无法访问服务～<br>"+status,callback);
            });
            dologin = false;

        }/*,
        getKeys:function(){
            $.jCryption.getKeys(hzq_rest+'security/key', function(receivedKeys) {
                LoginAction.keys = receivedKeys;
            });
        }*/
    };
}();
