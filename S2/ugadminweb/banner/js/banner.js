var xw;
var Payment_Way = function(val) {
	return {
		f: function(val) {
			if(val == 1) {
				return "微信";
			} else if(val == 2) {
				return "支付宝";
			} else if(val == 3) {
				return "paypal";
			}
		},
	}
}();

var status_UC = function(val) {
	return {
		f: function(val) {
			if(val == 1) {
				return "启用";
			} else if(val == 2) {
				return "停用";
			} else if(val == 3) {
				return "-";
			}
		},
	}
}();
var content = "<div class='btn-group form-group'>" +
    "<button id='update_btn' class='btn blue' data-target='#edit_gp_btn1' data-toggle='modal'> " +
    "<i class='fa fa-pencil'></i> 修改&nbsp;" +
    "</button>" +
    "</div>";
var re = "<div class='btn-group form-group'>" +
    "<button id='del_btn' class='btn red' data-target='' data-toggle='modal'> " +
    "<i class='fa fa-trash-o'></i> 删除&nbsp;" +
    "</button>" +
    "</div>";
var Caozuo = function(val) {
    return content + re;

}();

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
 }
}
var Payment = function() {
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
				// columnPicker: true,
				transition: 'fade',
				checkboxes: true,
				checkAllToggle: true,
				saveColumn:false,
				//----------------基本restful地址---
				restbase: 'ugotcbanner',
				key_column: 'ugOtcBannerId',
				coldefs: [{
						col: "ugOtcBannerId",
						friendly: "banner主键",
						nonedit: "nosend",
                    	validate:"ugOtcBannerId",
						hidden:"true",
						unique: "true",
						index: 1
					},
                    // {
                    //     col: "imageUrl",
                    //     friendly: "imgURL",
                    //     validate:"imageUrl",
                    //     hidden:"true",
                    //     index: 10
                    // },
					{
						col:"imageUrl",
						friendly:"图片地址",
						validate:"imageUrl",
						index:2
					},
					{
						col: "clickUrl",
						friendly: "跳转地址",
						index: 3
					},
					{
						col: "status",
						friendly: "状态",
						format:status_UC,
						validate: "required",
						index: 4
					},
					{
						col: "sort",
						friendly: "排序",
						validate: "required",
						index: 5
					},
                    {
                        col: "hello",
                        friendly: "操作",
                        format: Caozuo,
                        // events: delFunction,
						width: 300,
                        index: 6
                    }
					// {
					// 	col: "createdTime",
					// 	friendly: "创建时间",
					// 	validate: "createdTime",
					// 	index: 6
					// },
				],
				findFilter: function() {
					var status;
					if($('#status option:selected').val()) {
						status = RQLBuilder.equal("status", $('#status  option:selected').val());
					}
					var filter = RQLBuilder.and([
						status
					]);
					return filter.rql();
				},

			})
		}
	}

}();
// 修改
$(document).on('click','#update_btn',function () {
    var index = $(this).closest('tr').index();
    var data = xw.getTable().getData();
    $.each(data.rows, function(key, val) {
        /*模态框关闭后清空模态框里填写的数据*/
        $("#edit_gp_btn1").on("hidden.bs.modal", function() {
            document.getElementById("edit_form1").reset();
        });
        $("form[name='edit_form1'] input[name='" + key + "']").val(val);
        // $('#menuParent').append('<option>'+ data.rows.parentMenuId +'</option>')
    });
	$('#clickUrl1').val(data.rows[index].clickUrl);
	$('#sort1').val(data.rows[index].sort);
	$('#status1').val(data.rows[index].status);
	$('#ugOtcBannerId').val(data.rows[index].ugOtcBannerId);
	$('#imgURL').val(data.rows[index].imageUrl);
});
// $(document).on('click','#delete_btn',function () {
//     var index = $(this).closest('tr').index();
//     var data = xw.getTable().getData();
//     $.each(data.rows, function(key, val) {
//     	var rows = data.rows
//         /*模态框关闭后清空模态框里填写的数据*/
//         $("#edit_gp_btn1").on("hidden.bs.modal", function() {
//             document.getElementById("edit_form1").reset();
//         });
//         $("form[name='edit_form1'] input[name='" + key + "']").val(val);
//         // $('#menuParent').append('<option>'+ data.rows.parentMenuId +'</option>')
// 		// bootbox.alert('确定删除该行数据吗？',function () {
//         //     return;
//         // });
//     });
// });

/*查看详细信息*/
$("#see_btn").click(function() {
	// var index = $(this).closest('tr').index();
	var data = xw.getTable().getData(true);
	if(data.rows.length == 0) {
		bootbox.alert("<br><center><h4>请选择一条数据！</h4></center><br>");
		return false;
	}
	if(data.rows.length > 1) {
		bootbox.alert("<br><center><h4>只能选择一行！</h4></center><br>");
		return false;
	}
	if(data.rows[0].paymentWay == 3){
		console.log("123");

		$("#imagePathDiv_2").hide();
		// $("#paymentAccountDiv_1").show();
		$("#paymentWaydiv").hide();
		$("#statusdiv_1").hide();
		$("#merchantnameDiv_1").show();
	}else{
		console.log("456")
        $("#merchantnameDiv_1").hide();

		// $("#paymentAccountDiv_1").hide();
		$("#statusdiv_1").show();
		$("#imagePathDiv_2").show();
        $("#paymentWaydiv").show();
	}

	$.each(data.rows[0], function(key, val) {
		/*模态框关闭后清空模态框里填写的数据*/
		$("#find_gp_btn").on("hidden.bs.modal", function() {
			document.getElementById("find_form").reset();
		});
		$("form[name='find_form'] input[name='" + key +"_1']").val(val);
		if(key=='qrCode'){
			$("#imagePath_1").attr('src',val);
		}
        if(key=='userId'){
            $("#merchantname_1").val(merchartHelper.getDisplay(val));
        }
		/*订单支付方式：1-微信，2-支付宝，3-paypal*/
		if(data.rows[0].paymentWay == 1) {
			$("#paymentWay_1 option[value='" + data.rows[0].paymentWay + "']").attr('selected', 'selected');
			$('#paymentSee').text("微信号：");
		} else if(data.rows[0].paymentWay == 2) {
			$("#paymentWay_1 option[value='" + data.rows[0].paymentWay + "']").attr('selected', 'selected');
            $('#paymentSee').text("支付宝账号：");
		} else if(data.rows[0].paymentWay == 3) {
			$("#paymentWay_1 option[value='" + data.rows[0].paymentWay + "']").attr('selected', 'selected');
            $('#paymentSee').text("邮箱地址：");
		}
		$("#status_1 option[value='" + data.rows[0].status + "']").attr('selected', 'selected');
	});
});
/*上传图片到阿里云*/
$("#uploadImage").click(function(){
	var filepath = $('#filepath').val();
	var data = {'filepath':filepath};
	$.ajax({
            type: 'POST',
			// url:"/otc/pay/pbuis.do",
			url:"/otc/pay/pbpls.do",
            dataType: 'json',
            contentType: "application/json;charset=utf-8",
            async: false,
            isMask: true,
            data: JSON.stringify(data),
            success: function(result) {
				// console.log(result);
				if(result.err_code==1){
					$('#imageUrl').val(result.osspath);
            		bootbox.alert("上传成功");
				}else{
					bootbox.alert("上传失败");
				}

            },
            error: function(result) {
				bootbox.alert("接口访问异常");
            }
        });
});
/**保存添加的Banner图 */
$("#sure").click(function(){
	//验证表单信息
	var clickUrl = $("#clickUrl").val();
	if(strUtil.isEmpty(clickUrl)){
		bootbox.alert("请填写跳转路径");
		return;
	}
	var imageUrl = $('#imageUrl').val();
	if(strUtil.isEmpty(imageUrl)){
		bootbox.alert("请上传Banner图");
		return;
	}
	var edit_form = $("#edit_form").serializeObject();
	$.ajax({
            type: 'POST',
            url:"/ug/par/pbsba.do",
            dataType: 'json',
            contentType: "application/json;charset=utf-8",
            async: false,
            isMask: true,
            data: JSON.stringify(edit_form),
            success: function(result) {
				bootbox.alert(result.msg);
				xw.update();
            },
            error: function(result) {
				bootbox.alert("接口访问异常");
            }
        });
});
/*修改Banner图展示*/
$("#update_button").click(function() {
	var data = xw.getTable().getData(true);
	if(data.rows.length == 0) {
		bootbox.alert("<br><center><h4>请选择一条数据！</h4></center><br>");
		return false;
	}
	if(data.rows.length > 1) {
		bootbox.alert("<br><center><h4>只能选择一行！</h4></center><br>");
		return false;
    }
	$.each(data.rows[0], function(key, val) {
		/*模态框关闭后清空模态框里填写的数据*/
		$("#edit_gp_btn1").on("hidden.bs.modal", function() {
			document.getElementById("edit_form1").reset();
        });
        /*-----------------------*/
		$("form[name='edit_form1'] input[name='" + key + "']").val(val);
		if(key=="status"){
			$("form[name='edit_form1'] input[name='status'] option[value='" + data.rows[0].status + "']").attr('selected', true);
		}
	});
});
/**修改Banner图*/
$("#sure1").click(function(){
	//验证表单信息
	var clickUrl = $("form[name='edit_form1'] input[name='clickUrl']").val();
	if(strUtil.isEmpty(clickUrl)){
		bootbox.alert("请填写跳转路径");
		return;
	}
	var imageUrl = $("form[name='edit_form1'] input[name='imageUrl']").val();
	if(strUtil.isEmpty(imageUrl)){
		bootbox.alert("请上传Banner图");
		return;
	}
    var edit_form1 = $("#edit_form1").serializeObject();
	$.ajax({
            type: 'POST',
            url:"/ug/par/pbsba.do",
            dataType: 'json',
            contentType: "application/json;charset=utf-8",
            async: false,
            isMask: true,
            data: JSON.stringify(edit_form1),
            success: function(result) {
                bootbox.alert(result.msg);
                xw.update();
            },
            error: function(result) {
				bootbox.alert("接口访问异常");
            }
        });
});

$(document).on('click','#del_btn',function () {
    var index = $(this).closest('tr').index();
    var data = xw.getTable().getData();
    $.each(data.rows, function(key, val) {
        /*模态框关闭后清空模态框里填写的数据*/
        $("#edit_gp_btn1").on("hidden.bs.modal", function() {
            document.getElementById("edit_form1").reset();
        });
        $("form[name='edit_form1'] input[name='" + key + "']").val(val);
        // console.log(val)
    });
    var edit_form1 = $("#edit_form1").serializeObject();
    // console.log(data.rows[index]);
    // alert(data.rows[index].ugOtcBannerId);
    var id = data.rows[index].ugOtcBannerId;
    $.ajax({
        type: 'DELETE',
        url:"/ugrest/ugotcbanner/"+ id,
        dataType: 'json',
        contentType: "application/json;charset=utf-8",
        async: false,
        isMask: true,
        data: JSON.stringify(edit_form1),
        success: function(result) {
            bootbox.alert(result.msg);
            location.reload();
            xw.update();

        },
        error: function(result) {
            bootbox.alert(result.msg);
        }
	})
});
