var xw;

var transferstatusf = function(val) {
	return {// 1-成功 2-失败 3-未支付
		f: function(val) {
			if(val == 1) {
				return "成功";
			} else if(val == 2) {
				return "失败";
			}else if(val == 3) {
				return "未支付";
			}else if (val == 4) {
				return "超时关闭";
			}
		},
	}
}();

var paytypef = function(val) {
	return {
		f: function(val) {
			if(val == 1) {
				return "APP扫码支付";
			} else if(val == 2) {
				return "H5"
			} else if(val == 3) {
				return "APP支付"
			}else{
				return "";
			}
		},
	}
}();

var closestatusf = function(val) {
	return {
		f: function(val) {
			if(val == 1) {
				return "可结算";
			} else if(val == 2) {
				return "已结算"
			}else if(val == 0) {
				return "预估收入"
			}else{
				return "";
			}
		},
	}
}();
var notifystatusformat = function(val) {
	return {
		f: function(val) {
			if(val == 1) {
				return "成功";
			} else if(val == 2) {
				return "失败"
			}else{
				return "";
			}
		},
	}
}();

var format = function(val) {
	return {
		f: function(val) {
			if(val == null) {
				return "";
			} else{
				return val;
			}
		},
	}
}();

var SelOrder = function() {
	return {

		init: function() {
			// 顺序有影响 (先抓选单, 再抓暂存选单, 再执行其他)

			this.reload();
		},

		reload: function() {

			$('#divtable').html('');

			xw = XWATable.init({
				divname: "divtable",
				//----------------table的选项-------
				pageSize: 10,
				//columnPicker: true,
				transition: 'fade',
				checkboxes: true,
				checkAllToggle: true,
				saveColumn:false,
				//----------------基本restful地址---
				restURL: "/bd/bus/pbsod.do?bd={\"\":\"\"}",
				coldefs: [
					/*{
						col: "ugotctransferrecordid",
						friendly: "转帐ID",
						validate: "ugotctransferrecordid",
						nonedit: "nosend",
						format: format,
						index: 1
					},*/
					{
						col: "loginname",
						friendly: "商户账号",
						validate: "loginname",
						format: format,
						index: 2
					},
					{
						col: "outtradeno",
						friendly: "商户订单号",
						validate: "outtradeno",
						format: format,
						index: 3
					},
					{
						col: "paytype",
						friendly: "支付类型",
						validate: "paytype",
						format: paytypef,
						index: 4
					},
					{
						col: "closestatus",
						friendly: "结算状态",
						validate: "closestatus",
						format: closestatusf,
						index: 5
					},
					{
						col: "transferstatus",
						friendly: "转账状态",
						validate: "transferstatus",
						format: transferstatusf,
						index: 6
					},
					{
						col: "merrealamount",
						friendly: "实际支付金额",
						validate: "totleamount",
						index: 7
					},
					{
						col: "transfertime",
						friendly: "付款时间",
						validate: "transfertime",
						format: format,
						index: 8
					},
					{
						col: "poundage",
						friendly: "转账手续费",
						validate: "poundage",
						format: format,
						index: 9
					},
					{
						col: "createdtime",
						friendly: "创建时间",
						validate: "createdtime",
						format: format,
						index: 10
					},
					/*{
						col: "notifystatus",
						friendly: "通知状态",
						validate: "notifystatus",
						format:notifystatusformat,
						index: 10
					},*/
					/*
					{
						col: "rechargetime",
						friendly: "充值时间",
						validate: "rechargetime",
						format: format,
						index: 12
					}*/
				],
				// 查询过滤条件
				findFilter: function() {
					var ugotctransferrecordid,loginname,outtradeno,paytype,transferstatus,endtime,starttime
					if($('#ugotctransferrecordid').val()) {
						ugotctransferrecordid = RQLBuilder.equal("ugotctransferrecordid", $.trim($('#ugotctransferrecordid').val()));
					}
					if($('#loginname').val()) {
						loginname = RQLBuilder.equal("loginname", $.trim($('#loginname').val()));
					}
					if($('#outtradeno').val()) {
						outtradeno = RQLBuilder.equal("outtradeno", $.trim($('#outtradeno').val()));
					}
					if($('#paytype option:selected').val()) {
						paytype = RQLBuilder.equal("paytype", $('#paytype  option:selected').val());
					}
					if($('#transferstatus option:selected').val()) {
						transferstatus = RQLBuilder.equal("transferstatus", $('#transferstatus  option:selected').val());
					}

					if($('#starttime').val()) {
						starttime = RQLBuilder.equal("starttime", $.trim($('#starttime').val()));
					}
					if($('#endtime').val()) {
						endtime = RQLBuilder.equal("endtime", $.trim($('#endtime').val()));
					}
					if(starttime == undefined) {
						starttime = '"starttime":""';
					}
					if(endtime == undefined) {
						endtime = '"endtime":""';
					}
					if(ugotctransferrecordid == undefined) {
						ugotctransferrecordid = '"ugotctransferrecordid":""';
					}
					if(loginname == undefined) {
						loginname = '"loginname":""';
					}
					if(outtradeno == undefined) {
						outtradeno = '"outtradeno":""';
					}
					if(paytype == undefined) {
						paytype = '"paytype":""';
					}
					if(transferstatus == undefined) {
						transferstatus = '"transferstatus":""';
					}
					xw.setRestURL("/bd/bus/pbsod.do?bd={"+ ugotctransferrecordid+ "," +loginname+ "," +outtradeno+ "," +paytype+ "," +transferstatus+ "," +starttime+ "," +endtime+"}");
				},

			})
		}
	}

}();
layui.use('laydate', function(){
	var laydate = layui.laydate;
	//常规用法
	laydate.render({
		elem: '#starttime'
	});
	laydate.render({
		elem: '#endtime'
	});
});


