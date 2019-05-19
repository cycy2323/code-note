

var typeHelper;

var fcsysparametertypeFM=function(){
    return {
        f: function(val){
            return typeHelper.getDisplay(val);
        },
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

		    this.xw=XWATable.init(
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
							/*
	                        {
	                            col:"operator",
	                            friendly: "建立人",
	                            nonedit:"nosend",
								hidden:true,
								index:9
	                        },
	                        {
	                            col:"updatedTime",
	                            friendly: "修改时间",
								format:dateFormat,
	                            nonedit:"nosend",
								hidden:true,
								index:10
	                        },
	                        {
	                            col:"updator",
	                            friendly: "修改人",
	                            nonedit:"nosend",
								hidden:true,
								index:11
	                        },*/
	                ],
	            //---------------查询时过滤条件
				findFilter: function(){
					var paramId , paramVal;

					if($('#paramId').val())
					{
						console.log($('#paramId').val())
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
