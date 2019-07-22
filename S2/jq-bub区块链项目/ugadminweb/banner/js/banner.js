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
/*上传图片到阿里云*/
// $("#uploadImage").click(function(){
// 	var filepath = $('#filepath').val();
// 	var data = {'filepath':filepath};
// 	$.ajax({
//             type: 'POST',
// 			// url:"/otc/pay/pbuis.do",
// 			url:"/otc/pay/pbpls.do",
//             dataType: 'json',
//             contentType: "application/json;charset=utf-8",
//             async: false,
//             isMask: true,
//             data: JSON.stringify(data),
//             success: function(result) {
// 				// console.log(result);
// 				if(result.err_code==1){
// 					$('#imageUrl').val(result.osspath);
//             		bootbox.alert("上传成功");
// 				}else{
// 					bootbox.alert("上传失败");
// 				}
//
//             },
//             error: function(result) {
// 				bootbox.alert("接口访问异常");
//             }
//         });
// });
/**保存添加的Banner图 */
$("#sure").click(function(){
	//验证表单信息
	// var clickUrl = $("#clickUrl").val();
	// if(strUtil.isEmpty(clickUrl)){
	// 	bootbox.alert("请填写跳转路径");
	// 	return;
	// }
    var imageUrl = $('#imageUrl').val();
    // var imageUrl = $("form[name='edit_form'] input[name='imageUrl']").val();
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
				bootbox.alert("添加失败");
            }
        });
});
// 修改
$(document).on('click','#update_btn',function () {
    var index = $(this).closest('tr').index();
    var data = xw.getTable().getData();
    // $("#edit_gp_btn1").on("hidden.bs.modal", function() {
    //     document.getElementById("edit_form1").reset();
    // });
    // $.each(data.rows, function(key, val) {
    //     /*模态框关闭后清空模态框里填写的数据*/
    //     $("#edit_gp_btn1").on("hidden.bs.modal", function() {
    //         document.getElementById("edit_form1").reset();
    //         $('#imageUrl1').html('');
    //     });
    //     $("form[name='edit_form1'] input[name='" + key + "']").val();
    //     // $('#menuParent').append('<option>'+ data.rows.parentMenuId +'</option>')
    // });
    $('#clickUrl1').val(data.rows[index].clickUrl);
    $('#sort1').val(data.rows[index].sort);
    $('#status1').val(data.rows[index].status);
    $('#ugOtcBannerId').val(data.rows[index].ugOtcBannerId);
    $('#imageUrl1').val(data.rows[index].imageUrl);
});
/**修改Banner图*/
$("#sure1").click(function(){
	//验证表单信息
	// var clickUrl = $("form[name='edit_form1'] input[name='clickUrl']").val();
	// if(strUtil.isEmpty(clickUrl)){
	// 	bootbox.alert("请填写跳转路径");
	// 	return;
	// }
	var imageUrl = $("form[name='edit_form1'] input[name='imageUrl']").val();
	// var imageUrl = $('#imageUrl1').val();
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
				bootbox.alert("修改失败");
            }
        });
});
// 删除
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
    bootbox.confirm({
        size: "small",
        title: "提示",
        message: "确定要删除该条数据吗？",
        buttons: {confirm: {label: '确定',className: 'btn-success'},
					cancel: {label: '取消',className: 'btn-danger'}},
        callback: function(result){
            var edit_form1 = $("#edit_form1").serializeObject();
            var ugOtcBannerId = data.rows[index].ugOtcBannerId;
        	if (result) {
                $.ajax({
                    type: 'DELETE',
                    url:"/ugrest/ugotcbanner/"+ ugOtcBannerId,
                    dataType: 'json',
                    contentType: "application/json;charset=utf-8",
                    async: false,
                    isMask: false,
                    data: JSON.stringify(edit_form1),
                    success: function(result) {
                        bootbox.alert("删除成功");
                        xw.update()
                    },
                    error: function(result) {
                        bootbox.alert("删除失败");
                    }
                })
			} else return
		}
    })

});
