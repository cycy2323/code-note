var xw;

var rechargeRecord = function() {
	return {
		init: function() {
			this.reload();
		},
		reload: function() {
			var Caozuo = function () {
				return {
					f: function (val,row) {
						return "<div class='btn-group form-group'><button id='deleteip' class='btn red' data-target='#input_many_modal' data-toggle='modal' data-id='"+row.ip+"'>删除</button></div>";
					}
				}
			}();
			$('#divtable').html('');
			xw = XWATable.init({
				divname: "divtable",
				pageSize: 10,
				transition: 'fade',
				checkboxes: true,
				checkAllToggle: true,
				saveColumn:false,
				restURL: '/mf/sys/pbwip.do?bd={"state":"3"}',
				coldefs: [
					{
						col: "ip",
						friendly: "允许登录IP",
						validate: "ip",
						index: 2
					},
					{
						col: "createdTime",
						friendly: "创建时间",
						validate: "createdTime",
						index: 3
					},
					{
						friendly: "删除白名单",
						format: Caozuo,
						index: 13
					}
				],
				// 查询过滤条件
				findFilter: function() {
					var ip,state;
					if($("#ipquery").val()){
						ip =RQLBuilder.equal("ip",$("#ipquery").val());
					}
					if(ip==undefined){
						ip = '"ip":""';
					}
					state = '"state":"3"';
					var filter = RQLBuilder.and([
						ip,state
					]);
					xw.setRestURL("/mf/sys/pbwip.do?bd={"+ip+','+state+"}");
					return filter.rql();
				}
			})
		}
	}

}();
$(document).on("click","#deleteip",function(){
	$(".modal-body").find("#prefix_860037789915").remove()
	$("#ip").val($(this).attr("data-id"));
});
$(document).on('click',"#confirm",function(){
	$("#input_many_modal").modal('hide');  //手动关闭
	var form = {};
	form["ip"] = $("#ip").val();
	form["state"] ="2";
	$.ajax({
		url:"/mf/sys/pbwip.do",
		headers:{
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		type:"post",
		dateType:"json",
		data:JSON.stringify(form),
		success:function(data){
				bootbox.alert(data.msg,function(){
					location.reload();
				})
		},
		error : function (err) {
			if(err.status==406||err.status==401){
				window.location.replace("/login.html");
			}else{
				bootbox.alert("服务器繁忙,请稍后再试", function() {
					location.reload();
				});
			}
		}
	})
});

$(document).on("click","#quxiao",function(){
	location.reload();
});
/*$('#input_many_modal').on('hide.bs.modal', function () {
	location.reload();
});
$('#input_many_modal2').on('hide.bs.modal', function () {
	location.reload();
});*/

$(document).on('click',"#add_confirm",function(){
	var ip = $("#addIp").val();
	if(!isIp(ip)){
		bootbox.alert("IP格式不正确,请重新输入!")
		return;
	}
	$("#input_many_modal2").modal('hide');  //手动关闭
	var form = {};
	form["ip"] = ip;
	form["state"] ="1";
	$.ajax({
		url:"/mf/sys/pbwip.do",
		headers:{
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		type:"post",
		dateType:"json",
		data:JSON.stringify(form),
		success:function(data){
			bootbox.alert(data.msg,function(){
				location.reload();
			});
		},
		error : function (err) {
			if(err.status==406||err.status==401){
				window.location.replace("/login.html");
			}else{
				bootbox.alert("服务器繁忙,请稍后再试", function() {
					location.reload();
				});
			}
		}
	})
});
/*ip号校验*/
function isIp(ip){
	var reSpaceCheck = /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/;
	if (reSpaceCheck.test(ip))
	{
		ip.match(reSpaceCheck);
		if (RegExp.$1<=255&&RegExp.$1>=0
			&&RegExp.$2<=255&&RegExp.$2>=0
			&&RegExp.$3<=255&&RegExp.$3>=0
			&&RegExp.$4<=255&&RegExp.$4>=0)
		{
			return true;
		}else
		{
			return false;
		}
	}else
	{
		return false;
	}
}
