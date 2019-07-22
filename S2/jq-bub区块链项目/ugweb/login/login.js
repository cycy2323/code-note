// console.log(location.href)
var LoginAction = function() {
    $.ajax({
        url:'/ug/use/pbsis.do',
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
        passwordTxt:$( "#password" ),
        loginnameTxt:$( "#loginname" ),
        loginBtn:  $('#submitbtn'),
        keys:null,
        init:function(){
            // 拿cookie
            var remember = $.cookie('pm[remember]');
            if (remember==true) {
                $("#loginname").val($.cookie('pm[loginname]'));
                $('#password').val($.cookie('pm[password]'));
                $('#remember').attr("checked", true);
            }


//          $.backstretch([
//                  "assets/admin/bg/1.jpg",
//                  "assets/admin/bg/2.jpg",
//                  "assets/admin/bg/3.jpg",
//                  "assets/admin/bg/4.jpg",
//                  "assets/admin/bg/5.jpg",
//                  "assets/admin/bg/6.jpg"
//              ], {
//                  fade: 2000,
//                  duration: 3000
//              }
//          );
            // this.getKeys();
            this.bind(remember);
        },
        bind:function(remember){
            this.passwordTxt.on('keypress',this.passwordKeyPress);
            this.loginnameTxt.on('keypress',this.passwordKeyPress);
            if(remember==true){
                this.loginBtn.on('click',this.loginClick());
            }else{
                this.loginBtn.on('click',this.loginClick);
            }
        },
        passwordKeyPress:function(event){
            console.log("passwordKeyPress:"+$('.bootbox').hasClass('in'));
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
                bootbox.alert("请输入密码！",callback)
            }else if(LoginAction.passwordTxt.val() && !LoginAction.loginnameTxt.val()){
                bootbox.alert("请输入用户名fasf！",callback)
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
                title: "首次登录,请您进行密码修改",
                buttons: {
                    success: {
                        label: "修改",
                        className: "green",
                        callback: function() {
                            var userinfo = JSON.parse(localStorage.getItem('user_info'));
                            // console.log(userinfo.userId);
                            var userid = Restful.findNQ(hzq_rest+"ugsysuser/"+userinfo.userId);
                            // console.log(userid.password)
                            var moditem = {};
                            $.each($('#__editform input'), function(index, val) {
                                if (val.name == "_id" || !val.name || val.name.length == 0) return;
                                moditem[val.name] = val.value;
                            });
                            console.log(moditem)

                            if (moditem["oldpass"] == "") {
                                alert("请输入原密码");
                                $("#oldpass").focus();
                                return false;
                            }else if($.md5(moditem.oldpass) != userid.password){
                                alert("原密码输入错误");
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
                            var username = $.cookie('username');
                            var accountid = $.cookie('accountid');
                            var oldpass = $("#oldpass").val();
                            var password = $("#newpass").val();
                            var dl_conpass = $("#conpass").val();
                            var passw = {};
                            passw["newpassword"] = $.md5(dl_conpass);
                            passw["oldpassword"] = $.md5(oldpass);
                            console.log(passw);
                            $.ajax({
                                url:'/ug/use/pbupu.do',
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
            // console.log("bootboxdis = "+$('.bootbox').hasClass('in'))
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
            //console.log($.md5('123456'));

            // modify by sean
            // 修改重定向不跳转到来源页面
            // var prelocation=Metronic.getURLParameter("redirect");
            // if(!prelocation||prelocation=="/login.html"){
            //     prelocation="index.html"
            // }
            var prelocation="index.html"
            prelocation=prelocation.split(",")[0]
            // console.log("redirect to :"+prelocation)
            //console.log(LoginAction.loginnameTxt.val() +"====="+mdPw)
            dologin = true;

          //  $('body').modalmanager({  backdrop: 'static',keyboard: false});
            //console.log("do loading")

            $.ajax({
                url:'/ug/usr/pblib.do',
                type: 'POST',
                dataType:'json',
                contentType:"application/json; charset=utf-8",
                data: JSON.stringify({"loginname": LoginAction.loginnameTxt.val() , "pwd": mdPw }),
                async:false,
                success:function(data, textStatus, xhr) {
                    // console.log("@@@@data="+JSON.stringify(data));
                   // localStorage.setItem("menu_info",JSON.stringify(data.menu_info));
                   var menustr = [
                   // {"menuId":"100","menuName":"首页","menuDesc":"首页","menuSeq":"1","menuUrl":"#","parentMenuId":"#","leafFlag":"0","menuLevel":"0","children":[]},
                    {"menuId":"200","menuName":"订单管理","menuDesc":"订单管理","menuSeq":"2","menuUrl":"/order/order.html","parentMenuId":"#","leafFlag":"0","menuLevel":"0","children":[]},
                    {"menuId":"300","menuName":"广告管理","menuDesc":"广告管理","menuSeq":"3","menuUrl":"/advert/advert.html","parentMenuId":"#","leafFlag":"0","menuLevel":"0","children":[]},
                    {"menuId":"400","menuName":"收款方式","menuDesc":"收款方式","menuSeq":"4","menuUrl":"/paymentManager/paymentlist.html","parentMenuId":"#","leafFlag":"0","menuLevel":"0","children":[]},
                    {"menuId":"500","menuName":"资料管理","menuDesc":"资料管理","menuSeq":"5","menuUrl":"/information/information.html","parentMenuId":"#","leafFlag":"0","menuLevel":"0","children":[]},
                    {"menuId":"600","menuName":"充值管理","menuDesc":"充值管理","menuSeq":"6","menuUrl":"/cashierDesk/cashierDesk.html","parentMenuId":"#","leafFlag":"0","menuLevel":"0","children":[]}
                    ];
                   // console.log(menustr)
                    localStorage.setItem("menu_info",JSON.stringify(menustr));
                    localStorage.setItem("user_info",JSON.stringify(data.userinfo));
                    if(data.errcode && data.errcode == "1"){
                        $.cookie.json = true;
                        $.cookie('userinfo', JSON.stringify(data.userinfo));

                        var expires_day = 7;
                        if ($('#remember').is(':checked')) {
                            //cookie有效天数
                            $.cookie('pm[loginname]', $("#loginname").val(), { expires: expires_day });
                            $.cookie('pm[password]', $("#password").val(), { expires: expires_day });
                            $.cookie('pm[remember]', true, { expires: expires_day });
                        }
                        else {
                            // reset cookies.
                            $.cookie('pm[loginname]', '');
                            $.cookie('pm[password]', '');
                            $.cookie('pm[remember]', false);
                        }
                        window.location.replace("index.html");
                        //判断是否首次登陆
                        // var flag = data.UserInfo.flag;
                        // if(flag==0){
                        //     LoginAction.updatePassword();
                        // }else{
                        //     //判断登陆是否为admin
                        //     var loginname = data.user_info.login_name;
                        //     if(loginname=="admin"){
                        //         window.location.replace("index_v.html");
                        //     }else{
                        //         window.location.replace("index.html");
                        //     }
                        // }
                    }else{
                       // if(data.description && data.description=='0'){
                            LoginAction.loginnameTxt.val('');
                            LoginAction.passwordTxt.val('');
                            $.cookie('pm[loginname]', '');
                            $.cookie('pm[password]', '');
                            $.cookie('pm[remember]', false);
                            if(data.errcode==-9998)
                                bootbox.alert("用户无权限使用该系统！",callback);
                            else if(data.errcode==-9997)
                                bootbox.alert("用户或密码错误！",callback);
                            else if(data.errcode==-9996)
                                bootbox.alert("1密码规则需符合以下条件：</br>密码不能为空</br>密码,callback长度必须在6至8之间</br>请输入有效的密码,如:PasSw0rD_",callback);
                            else if(data.errcode==-9999)
                                bootbox.alert("登入错误,请重新登入！",callback);
                            else if(data.errcode=="2"){
                                bootbox.alert("<b>登录失败,可能的原因如下：</b></br></br> 1.用户名或密码错误；</br> 2.账户已停用或已删除；</br> 3.用户无权限使用该系统。");
                                //bootbox.alert(data.msg,callback);
                            }
                       // }
                       //  else{
                       //      bootbox.alert("用户或密码错误！");
                       //  }
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
