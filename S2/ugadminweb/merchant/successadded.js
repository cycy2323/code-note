//$(function(){
//  String loginName = request.getParameter(loginName);
//  String userId = request.getParameter("userId");
//  String password = request.getParameter("password");
//  $('#loginName').html(loginName);
//  $('#userid').html(userId);
//  $('#password').html(password);
//});


function getParameterByName(name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
     };
var loginName = getParameterByName("loginName");
var userId = getParameterByName("userId");
var password = getParameterByName("password");
$('#loginName').val(loginName);
$('#userid').val(userId);
$('#password').val(password);
$("#fanhui").click(function(){
	window.location.href="merchant/addMerchant.html";
});

$("#copy1").click(function()
    {
    var Url2=document.getElementById("loginName");
    Url2.select(); // 选择对象
    document.execCommand("Copy"); // 执行浏览器复制命令
    alert("已复制好，可贴粘。");
    });
    
$("#copy2").click(function()
    {
    var Url2=document.getElementById("userid");
    Url2.select(); // 选择对象
    document.execCommand("Copy"); // 执行浏览器复制命令
    alert("已复制好，可贴粘。");
    });
    
$("#copy3").click(function(){
    var Url2=document.getElementById("password");
    Url2.select(); // 选择对象
    document.execCommand("Copy"); // 执行浏览器复制命令
    alert("已复制好，可贴粘。");
    });