var xw,detailform,selrow_obj;
var passOrder = function(val){
    //ug/ord/pbcrs.do
    bootbox.confirm("确认收款放币吗?", function(result) {
        if(result===false){
        }else {
            var datapost = {};
            datapost.orderNo = val;
            $.ajax({
                url: "ug/ord/pbcrs.do",
                type: "POST",
                contentType: "application/json;charset=utf-8",
                data:JSON.stringify(datapost),
                dataType: "json",
                success: function (data) {
                    //console.log(data);
                    if(data.errcode == '1'){
                        //上架成功
                        bootbox.alert("成功放币");
                        xw.update();
                    }else{
                        console.log(data.msg);//错误信息
                        bootbox.alert('放币失败，请重试或联系客服');
                        return false;
                    }
                },
                error: function () {

                    bootbox.alert('放币失败，请重试或联系客服');
                    return false;
                }
            });
            // window.location="serviceManage/openSwitch_Audit2.html";
        }
    });

}
var payMessage = function(val){
    bootbox.alert("暂未开放～");
    return;
}
var viewDetail = function(val){
    //清空
    doClearForView();
    // var objorder = Restful.getByID(hzq_rest+"ugotcorder",val);
    // $.each(downMeter, function(key,val) {
    // 	$("form[name='orderFormView'] input[name='"+key+"']").val(val);
    // 	$("form[name='orderFormView'] select[name='"+key+"']").val(val).trigger("change");
    // });
    // 查看订单详情
    var orderdetaildata = {};
    orderdetaildata.orderId = val;
    $.ajax({
        url: "ug/ord/pbquo.do",
        type: "POST",
        contentType: "application/json;charset=utf-8",
        data:JSON.stringify(orderdetaildata),
        dataType: "json",
        success: function (data) {
            //console.log(data);
            if(data.errcode == '1'){
                //上架成功

                $.each(data, function(key,val) {
                    $("form[name='orderFormView'] input[data-name='"+key+"']").val(val);
                    // if(key == 'paymentWay'){
                    // 	if(val!= 'undifined'){
                    // 		$("#detail_paymentway").val(val[0].paymentWay).trigger("change");
                    // 	}else{
                    // 		$('#detail_paymentway').val("0").trigger("change");
                    // 	}

                    // }else{
                    $("form[name='orderFormView'] select[data-name='"+key+"']").val(val).trigger("change");
                    // }
                });

                $('#order_edit_modal').modal("show");
            }else{
                console.log(data.msg);//错误信息
                bootbox.alert('订单查询失败');
                return false;
            }
        },
        error: function () {

            bootbox.alert('订单查询失败');
            return false;
        }
    });

}
var doClearForView = function(){
    //restful 接口 按照订单id查询订单
    document.getElementById("edit_form").reset();
    // detail_ugotcorderid
    // detail_orderno
    // detail_advertid
    // detail_buyuserid
    // detail_selluserid
    // detail_number
    // detail_price
    // detail_brokerage
    // detail_paymentway
    // detail_status
    // detail_createdtime
    // detail_modifytime
    // detail_paymenttime
    // detial_finishtime
    // detail_confirmtime
    // detail_closetime
    // detail_cancletime
    // detail_isevaluation
}
var OrderList = function() {
    var OperateFunc = function () {
        return {
            f: function (val, row) {
                //var balance_date = row.balanceDate
                var returnstr = '';
                //edit_gp_btn
                returnstr +='<a data-id="' + val + '" href=javascript:viewDetail("' + row.otcOrderId + '")  style="color:#0cc2aa">查看</a>'

                if(row.status == '2'){//已付款-待放行
                    returnstr +=' <a data-id="' + val + '" onclick="passOrder(\'' + row.orderNo + '\')" href="javascript:void(0)" style="color:#167cf9">放行订单</a>'
                }
                if(row.status == '1'){//待付款
                    returnstr +=' <a data-id="' + val + '" onclick="payMessage(\'' + val + '\')" href="javascript:void(0)" style="color:#df2d2d">提醒付款</a>'
                }
                return returnstr;
            }
        }
    }();
//带支付订单 -- 提醒付款

    // var editcoldefs = [
    // 	"buyUserId:买方,orderNo:订单编号,number:放币数量,number:应收款",
    // 	"paymentWay:支付方式,createdTime:创建时间,status@ENOtcOrdBas.enumStatus:订单状态"//isBll@ENGasModMrd.enumIsBll:是否已计费
    // ]

    // var viewDetail = function(selrows,row_id){
    // 	if(!selrows){
    // 		var rows = new Array();
    // 		selrows = wx.getTable.getData()
    // 		$.each(selrows.rows,function(idx,row){
    // 			if(row.otcOrderId == row_id){
    // 				rows.push(row);
    // 			}
    // 		});
    // 		selrows.rows = rows;
    // 		selrow_obj = rows[0];
    // 	}
    // 	{
    // 		datailform = Duster.buildarr($('#__dust_simpleform'));
    // 	}
    // 	view_recs = new Array();
    // 	$.each(selrows.rows,function(rowidx,row){
    // 		var viewdata = new Array();
    // 		var viewGroup;
    // 		$.each(editcoldefs,function(idx,textrow){
    // 			viewGroup = new Array();
    // 			viewdata.push(viewGroup);
    // 			viewGroup.grp_rows = new Array();
    // 			var grouplength = textrow.split(",").length;//12 删格  每行4个

    // 			$.each(textrow.split(","),function(colidx,col){
    // 				if(col.indexof(":") < 0) return;
    // 				var coldef = col.split(":")[0];
    // 				var title = col.split(":")[1];
    // 				var colname = coldef;
    // 				var value = row[colname];
    // 				if(colfunc.startsWith("EN")){
    // 					console.log("EN=="+colfunc.substr(2))
    // 					value = eval(colfunc.substr(2)+"['"+row[colname]+"']");
    // 				}
    // 			})

    // 			viewGroup.grp_rows.push({
    // 				title:title,
    // 				"value":value,
    // 				"col":12 / grouplength,
    // 				"colname":rowidx+"_"+colname
    // 			})
    // 		})
    // 	})
    // 	select_row = row;
    // 	viewGroup = new Array();
    // 	viewdata.push(viewGroup);
    // 	viewGroup.grp_rows = new Array();
    // 	var extprops = {
    // 		cols:[0,12,0],
    // 		refId:row.otcOrderId,
    // 		groups:"sf_"+rowidx
    // 	}
    // 	var inhtml = detailform(viewdata,extprops);

    // 	view_recs.push(inhtml);
    // }


    return {

        init: function() {
            // 顺序有影响 (先抓选单, 再抓暂存选单, 再执行其他)
            this.initHelper();
            this.reload();
        },
        initHelper:function(){

        },
        reload: function() {

            $('#divtable').html('');


            var selecturl = "/ug/ing/pbiqs.do"

            var bd = {}

            xw = XWATable.init({
                divname: "divtable",
                //----------------table的选项-------
                pageSize: 50,
                columnPicker: true,
                transition: 'fade',
                checkboxes: false,
                checkAllToggle: true,
                //----------------基本restful地址---
                restURL:selecturl+"?bd="+encodeURIComponent(JSON.stringify(bd)),
                // restURL: "/ug/ord/pbder.do?bd={'':''}",
                coldefs: [

                    {
                        col: "orderNo",
                        friendly: "订单编号",
                        index: 2
                    },
                    {
                        col: "buyUserId",
                        friendly: "用户ID",
                        index: 3
                    },
                    {
                        col: "createdTime",
                        friendly: "创建时间",
                        validate: "createdtime",
                        index: 4
                    },
                    {
                        col: "paymentWay",
                        friendly: "银行名称",
                        format:OtcOrdBas.paymentWayFormat,
                        index: 5
                    },
                    // {
                    //     col: "paymentWayAccount",
                    //     friendly: "收款方式",
                    //     format:{
                    //         f:function(val){
                    //             if(val){
                    //                 return val;
                    //             }else{
                    //                 return "--";
                    //             }
                    //         }
                    //     },
                    //
                    //     index: 5
                    // },
                    {
                        col: "price",
                        friendly: "应收款",
                        format:{
                            f:function(val){
                                if(val){
                                    return val;
                                }else{
                                    return "--";
                                }
                            }
                        },
                        index:7
                    },

                    {
                        col: "number",
                        friendly: "放行数量",
                        format:{
                            f:function(val){
                                if(val){
                                    return val;
                                }else{
                                    return "--";
                                }
                            }
                        },
                        // format:{
                        // 	f: function(val, row) {
                        // 		if(val){
                        // 			if(row.status == '3'){
                        // 				return row.number;
                        // 			}else{
                        // 				return "--";
                        // 			}
                        // 		}else{
                        // 			return "--";
                        // 		}

                        // 	},

                        // },
                        index: 8
                    },
                    {
                        col: "status",
                        friendly: "状态",
                        format:OtcOrdBas.orderStatusFormat,
                        index: 11
                    },
                    {
                        col: "otcOrderId",
                        friendly: "操作",//查看 提醒付款，放行订单
                        // validate: ,
                        format:OperateFunc,
                        index: 12
                    }

                ],
                // 查询过滤条件
                findFilter: function() {
                    var findbd = {};
                    if($('#find_orderno').val()){
                        findbd.orderno = $('#find_orderno').val();
                    }
                    if($('#find_buyuserid').val()){
                        findbd.buyuserid = $('#find_buyuserid').val();
                    }
                    if($('#find_status').val()){
                        findbd.type = $('#find_status').val();
                    }
                    if($('#find_begintime').val() && $('#find_endtime').val()){
                        findbd.begintime = $('#find_begintime').val();
                        findbd.endtime = $('#find_endtime').val();
                    }
                    if($('#find_paymentwayaccount').val()){
                        findbd.paymentwayaccount = $('#find_paymentwayaccount').val();
                    }
                    //encodeURIComponent
                    xw.setRestURL(selecturl+"?bd="+(JSON.stringify(findbd)));
                    return "";//filter.rql();

                    //xw.setRestURL("/ug/ord/pbder.do?bd={" + orderno + "," + buyuserid + "," + selluserid + "," + isevaluation + "," + status + "," + paymentway + "}");
                }

            })
        }
    }

}();

/*查看详细信息*/

$(document).on('click','.check',function() {
    var index = $(this).closest('tr').index();
    var data = xw.getTable().getData();


//	if(data.rows.length == 0) {
//		bootbox.alert("<br><center><h4>请选择一条数据！</h4></center><br>");
//		return false;
//	}
//	if(data.rows.length > 1) {
//		bootbox.alert("<br><center><h4>只能选择一行！</h4></center><br>");
//		return false;
//	}

    $.each(data.rows[index], function(key, val) {
        /*模态框关闭后清空模态框里填写的数据*/
        $("#edit_gp_btn").on("hidden.bs.modal", function() {
            document.getElementById("edit_form").reset();
        });
        /*-----------------------*/

        $("form[name='edit_form'] input[name='" + key + "']").val(val);

        /*订单支付方式：1-微信，2-支付宝，3银行卡*/
        if(data.rows[index].paymentway == 1) {
            $("#paymentway option[value='" + data.rows[index].paymentway + "']").attr('selected', 'selected');
        } else if(data.rows[index].paymentway == 2) {
            $("#paymentway option[value='" + data.rows[index].paymentway + "']").attr('selected', 'selected');
        } else if(data.rows[index].paymentway == 3) {
            $("#paymentway option[value='" + data.rows[index].paymentway + "']").attr('selected', 'selected');
        }
        /*订单状态 1.未付款 2.已付款3.已完成4.已取消5.已关闭(自动 )6.申诉中7.申诉成功 8.申诉失败*/
        if(data.rows[index].status == 1) {
            $("#status option[value='" + data.rows[index].status + "']").attr('selected', 'selected');
        } else if(data.rows[index].status == 2) {
            $("#status option[value='" + data.rows[index].status + "']").attr('selected', 'selected');
        } else if(data.rows[index].status == 3) {
            $("#status option[value='" + data.rows[index].status + "']").attr('selected', 'selected');
        } else if(data.rows[index].status == 4) {
            $("#status option[value='" + data.rows[index].status + "']").attr('selected', 'selected');
        } else if(data.rows[index].status == 5) {
            $("#status option[value='" + data.rows[index].status + "']").attr('selected', 'selected');
        } else if(data.rows[index].status == 6) {
            $("#status option[value='" + data.rows[index].status + "']").attr('selected', 'selected');
        } else if(data.rows[index].status == 7) {
            $("#status option[value='" + data.rows[index].status + "']").attr('selected', 'selected');
        } else if(data.rows[index].status == 8) {
            $("#status option[value='" + data.rows[index].status + "']").attr('selected', 'selected');
        }
        /*是否评价，1-已评价,2-未评价*/
        if(data.rows[index].paymentway == 1) {
            $("#paymentway option[value='" + data.rows[index].paymentway + "']").attr('selected', 'selected');
        } else if(data.rows[index].paymentway == 2) {
            $("#paymentway option[value='" + data.rows[index].paymentway + "']").attr('selected', 'selected');
        }
    });

});

//var button_init = function() {
//	var user_info = localStorage.getItem("user_info");
//	//获取后先转为json
//	var userInfo = eval('(' + user_info + ')');
//	//获取登陆名
//	var login_name = userInfo.login_name;
//
////	var content = "<div class='btn-group form-group'>" +
////		"<button id='add_ann' class='btn green' data-target='#edit_gp_btn' data-toggle='modal'>" +
////		"<i class='fa fa-plus'></i> 添加&nbsp;" +
////		"</button>" +
////		"</div>" + "&nbsp" +
////		"<div class='btn-group form-group'>" +
////		"<button id='edit_gp' class='btn blue' data-target='#edit_gp_btn1' data-toggle='modal'>" +
////		"<i class='fa fa-pencil'></i> 修改&nbsp;" +
////		"</button>" +
////		"</div>";
//	if(login_name == "admin") {
//		$('#find').append(content);
//	}
//}();

/*修改*/
$("#edit_gp").click(function() {

    var data = xw.getTable().getData(true);

    if(data.rows.length == 0) {
        bootbox.alert("<br><center><h4>请选择一条数据！</h4></center><br>");
        return false;
    }
    if(data.rows.length > 1) {
        bootbox.alert("<br><center><h4>只能选择一行！</h4></center><br>");
        return false;
    }

    $.each(data.rows[index], function(key, val) {
        /*模态框关闭后清空模态框里填写的数据*/
        $("#edit_gp_btn1").on("hidden.bs.modal", function() {
            document.getElementById("edit_form1").reset();
        });
        /*-----------------------*/
        $("form[name='edit_form1'] input[name='" + key + "']").val(val);
        if(data.rows[index].status == 0) {
            $("#status option[value='" + data.rows[index].status + "']").attr('selected', 'selected');
        } else if(data.rows[index].status == 1) {
            $("#status option[value='" + data.rows[index].status + "']").attr('selected', 'selected');
        }
    });

});

$("#update_gp").click(function() {

    /*var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hour = date.getHours();
    var minute = date.getMinutes();
    var second = date.getSeconds();
    var sj = year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
    $("#modifiedTime").val(sj);
    */
    var edit_form1 = $("#edit_form1").serializeObject();

    if($("#status").val() == "") {
        alert('状态不能为空');

        return false;
    }
    if($("#sort").val() == "") {
        alert('不能为空');

        return false;
    }

    //	$.ajax({
    //		type: 'POST',
    //		url: "/tx/art/pbcle.do",
    //		dataType: 'json',
    //		contentType: "application/json;charset=utf-8",
    //		async: false,
    //		isMask: true,
    //		data: JSON.stringify(edit_form1),
    //		success: function() {
    //			bootbox.alert("修改成功");
    //			xw.update();
    //		},
    //		error: function() {
    //			bootbox.alert("修改失败");
    //			xw.update();
    //		}
    //	});
    //
});

/*新增*/
/*   $("#add_ann").click(function(){


	var data = xw.getTable().getData(true);








});*/

//$("#update_gp1").click(function() {
//
//	/*var date = new Date();
//	var year = date.getFullYear();
//	var month = date.getMonth() + 1;
//	var day = date.getDate();
//	var hour = date.getHours();
//	var minute = date.getMinutes();
//	var second = date.getSeconds();
//	var sj = year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
//	$("#createTime_select").val(sj);*/
//
//	var edit_form = $("#edit_form").serializeObject();
//
//	$.ajax({
//		type: 'POST',
//		url: "/tx/art/pbadd.do",
//		dataType: 'json',
//		contentType: "application/json;charset=utf-8",
//		async: false,
//		isMask: true,
//		data: JSON.stringify(edit_form),
//		success: function() {
//
//			bootbox.alert("新增成功");
//			xw.update();
//		},
//		error: function() {
//
//			bootbox.alert("新增失败");
//			xw.update();
//		}
//	});
//
//});

/*点击新增查看分类*/
/*$("#add_ann").click(function(){


	$.ajax({
            type: 'POST',
            url:"/tx/art/pbory.do",
            dataType: 'json',
            contentType: "application/json;charset=utf-8",
            async: false,
            isMask: true,
            data: JSON.stringify(edit_form),
            success: function(result) {

            	bootbox.alert("查询成功");
            	xw.update();
            },
            error: function(result) {

				bootbox.alert("查询失败");
				xw.update();
            }
        });


});*/
