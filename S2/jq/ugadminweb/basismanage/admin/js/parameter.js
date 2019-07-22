var xw

var typeHelper;

var fcsysparametertypeFM=function(){
    return {
        f: function(val){
            return typeHelper.getDisplay(val);
        },
    }
}();
var modify = "<div class='btn-group form-group'>" +
    "<button id='edit_gp' class='btn blue' data-target='#edit_gp_btn1' data-toggle='modal'>" +
    "<i class='fa fa-pencil'></i> 修改&nbsp;" +
    "</button>" +
    "</div>";
// var del = "<div class='btn-group form-group'>" +
//     "<button id='delete_btn' class='btn green check' data-target='#edit_gp_btn' data-toggle='modal'>" +
//     "<i class='fa fa-eye'></i> 删除&nbsp;" +
//     "</button>" +
//     "</div>";
var Caozuo = function(val) {
    return modify;
}();
let tips1='参数值格式:{"merNo":"商户号","callbackUrl":"回调地址","des3Key":"对称秘钥","md5Key":"验签秘钥","payUrl":"代付地址","publicKey":"上游公钥","privateKey":"上游私钥"}'
	, tips2='参数值格式:{"merNo":"商户号","callbackUrl":"回调地址","signKey":"签名秘钥","payUrl":"支付地址","publicKey":"公钥","privateKey":"私钥"}';
var pramsFormat = function (val) {
	return {
		f: function(val) {
			return  '<div style="width: 300px;word-wrap:break-word;max-height: 80px;overflow: auto">'+val+'</div>'
		}
	}
}();

var Parameter = function () {
	return {
		init: function () {
			// this.initHelper();
	    	this.reload();
	    	// this.cancelFilter();
	    },



	    // initHelper:function(){
			// parameterModelHelper=RefHelper.create({
				// ref_url: "ugsysparams",
				// ref_col:"parameterId",
				// ref_display:"parameterModel",
			// });

			// $.map(parameterModelHelper.getData(), function(value, key) {
			// 	$('#find_parameterModel').append('<option value="'+key+'">'+value+'</option>');
			// });
			// typeHelper=RefHelper.create({
			//     ref_url: "gassysparametertype",
			//     ref_col:"parameterTypeId",
			//     ref_display:"parameterTypeName",
			// });
			// console.log(typeHelper)
			// $.map(typeHelper.getData(), function(value, key) {
            //     console.log(value)
            //     if(value == 1){
            //         value = "技术参数"
            //     }else if(value == 2){
            //     	value = "业务参数"
			// 	}else if(value == 3){
            //     	value = "流程参数"
			// 	}
		    //     $('#find_parameterTypeId').append('<option value="'+key+'">'+value+'</option>');
		    // });

			// 2015-05-05
			// $('#find_parameterTypeId').select2({ placeholder: "请选择", maximumSelectionSize: 12 });
		// },

		reload:function(){
		   	$('#divtable').html('');

		    xw=XWATable.init(
	        {
	        	divname: "divtable",
	        	//----------------table的选项-------
	            pageSize: 10,                //Initial pagesize
	            // columnPicker: true,         //Show the columnPicker button
	            transition: 'fade',  //(bounce, fade, flip, rotate, scroll, slide).
	            checkboxes: true,           //Make rows checkable. (Note. You need a column with the 'unique' property)
	            checkAllToggle:true,        //Show the check-all toggle//+RQLBuilder.like("KEYY", "a").rql()
				saveColumn:false,
				//----------------基本restful地址---
	            restbase: 'ugsysparams?sort=-createdTime',
	            key_column: "ugSysParamId",
	            //---------------行定义
	            coldefs: [
	                        {
	                            col:"ugSysParamId",
	                            friendly: "参数ID",
	                            unique: true,
	                            // hidden:true,
								// nonedit:"nosend",
								validate:"required",
								index:1
	                        },
	                        {
	                            col:"paramVal",
	                            friendly: "参数值",
								format:pramsFormat,
	                            validate:"required",
								index:2
	                        },
	                        {
	                            col:"paramDesc",
	                            friendly: "参数描述",
	                            validate:"required",
								index:3
	                        },

	                        {
	                            col:"createdTime",
	                            friendly: "创建时间",
								format:dateFormat,
	                            nonedit:"nosend",
								hidden:false,
								index:8
							},
							{
								friendly: "操作",
								format: Caozuo,
								index: 13
							}
							//
	                        // {
	                        //     col:"operator",
	                        //     friendly: "建立人",
	                        //     nonedit:"nosend",
							// 	hidden:true,
							// 	index:9
	                        // },
	                        // {
	                        //     col:"updatedTime",
	                        //     friendly: "修改时间",
							// 	format:dateFormat,
	                        //     nonedit:"nosend",
							// 	hidden:true,
							// 	index:10
	                        // },

	                ],
	            //---------------查询时过滤条件
				findFilter: function(){
					var paramId , paramVal;

					if($('#paramId').val())
					{
						// console.log($('#paramId').val())
						paramId=RQLBuilder.equal("ugSysParamId",$('#paramId').val());
					}

					if($('#paramVal').val())
					{
						paramVal=RQLBuilder.like("paramVal",$('#paramVal').val());
					}


					var filter=RQLBuilder.and([
						paramId , paramVal,
					]);
					return filter.rql();
				},
	            onAdded: function(ret,jsondata){
	                return  validateForm(jsondata);
	            },
	            onUpdated: function(ret,jsondata){
	                return  validateForm(jsondata);
	            },
	            onDeleted: function(ret,jsondata){
	            },
	        })
		},

		cancelFilter:function(){
			$('.searchinput').on('input',function(e){
		        if(!e.target.value){
		            Parameter.xw.autoResetSearch();
		        }
		    });
		},
    }
}();
// 修改弹框
$(document).on('click','#edit_gp',function() {
    $("#edit_gp_btn").show();
    $("#update_gp1").hide();
    var index = $(this).closest('tr').index();
    var data = xw.getTable().getData();
    $('#ugSysParamId').val(data.rows[index].ugSysParamId);
    $('#paramVal1').val(data.rows[index].paramVal);
    $('#paramDesc').val(data.rows[index].paramDesc);

	// 判断当前数据是否为SYS.REMIT.CONFIG / SYS.UPCHANNEL.CONFIG
	// console.log("data.rows[index]", data.rows[index]);
	if(data.rows[index].ugSysParamId=='SYS.REMIT.CONFIG'){
		$("#tips").html(tips1)
	}else if(data.rows[index].ugSysParamId=='SYS.UPCHANNEL.CONFIG'){
		$("#tips").html(tips2)
	}else{
		$("#tips").html('')
	}

	$.each(data.rows[index], function(key, val) {
        /*模态框关闭后清空模态框里填写的数据*/
        $("#edit_gp_btn1").on("hidden.bs.modal", function() {
            document.getElementById("edit_form1").reset();
            $('#idcard3').attr('src','');
            $('#idcard4').attr('src','');
        });
        $("form[name='edit_form1'] input[name='" + key + "']").val(val);
    });
});
// 修改提交
$("#update_gp").click(function() {
    $('[disabled]').attr("disabled", false);
    var edit_form1 = $("#edit_form1").serializeObject();

    $.ajax({
        type: 'POST',
        url: "/ug/par/pbups.do",
        dataType: 'json',
        contentType: "application/json;charset=utf-8",
        async: false,
        isMask: true,
        data: JSON.stringify(edit_form1),
        success: function() {
            bootbox.alert("修改成功");
            // xw.update();
        },
        error: function() {
            bootbox.alert("修改失败");
            // xw.update();
        }
    });
});

// // 删除
// $(document).on('click','#delete_btn',function () {
//     var index = $(this).closest('tr').index();
//     var data = xw.getTable().getData();
//     $.each(data.rows, function(key, val) {
//         /*模态框关闭后清空模态框里填写的数据*/
//         $("#edit_gp_btn1").on("hidden.bs.modal", function() {
//             document.getElementById("edit_form1").reset();
//         });
//         $("form[name='edit_form1'] input[name='" + key + "']").val(val);
//         // console.log(val)
//     });
//     // var edit_form1 = $("#edit_form1").serializeObject();
//     var id = data.rows[index].ugSysParamId;
//     $.ajax({
//         type: 'DELETE',
//         url:"/ugrest/ugotcbanner/"+ id,
//         dataType: 'json',
//         contentType: "application/json;charset=utf-8",
//         async: false,
//         isMask: false,
//         data: JSON.stringify(edit_form1),
//         success: function(result) {
//             bootbox.alert('确定删除该行数据吗？',function () {
//                 location.reload();
//                 return result.msg;
//             });
//             // bootbox.alert(result.msg);
//             // location.reload();
//             // xw.update();
//         },
//         error: function(result) {
//             bootbox.alert(result.msg);
//         }
//     })
// });
