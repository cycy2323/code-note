var statusFM = function (val) {
	return {
        f: function (val) {
        	if(val==0){
            	return "启用";
		    }else if(val==1){
		    	return "停用"
		    }else{
		    	return "-";
		    }
        },
    }
}();

var NoticeInfoAction = function () {
    return {
        init: function () {
            this.reload();
        },
        reload: function () {

            $('#divtable').html('');


                     
            this.xw = XWATable.init(
                {
                    divname: "divtable",
                    //----------------table的选项-------
                    pageSize: 50,
                    columnPicker: true,
                    transition: 'fade',
                    checkboxes: true,
                    checkAllToggle: true,
                    //----------------基本restful地址---
                    restbase: 'mfsysannouncement',
                    key_column: 'mfsysAnnouncementId',
                    coldefs: [
                        {
                            col: "mfsysAnnouncementId",
                            friendly: "公告ID",
                            unique: "true",
                            hidden: true,
                            nonedit: "nosend",
                            readonly: "readonly",
                            index: 1
                        },
                        {
                            col: "announcementTitle",
                            friendly: "标题",
                            validate:"required",
                            index: 2
                        },
                        {
                            col: "announcementDesc",
                            friendly: "内容",
                            validate:"required",
                            index: 3
                        },
                        {
                            col: "status",
                            friendly: "状态",
                            validate:"required",
                            format:statusFM,
                            nonedit: "nosend",
                            index: 4
                        },
                        {
                            col: "coinCode",
                            friendly: "币种代码",
                            validate:"required",
                            index: 5
                        },
                        {
                            col: "coinName",
                            friendly: "币种名称",
                            index: 6
                        },
                        {
                            col: "createdTime",
                            friendly: "创建时间",
                            nonedit: "nosend",
                            readonly: "readonly",
                            index: 14
                        },
                        {
                            col: "modifiedTime",
                            friendly: "变更时间",
                            nonedit: "nosend",
                            hidden: true,
                            readonly: "readonly",
                            index: 14
                        }
                        

                    ],
                    // 查询过滤条件
                    findFilter: function () {
                        var find_coin,find_tradecoin;
                        if ($('#find_coin').val()) {
                            find_coin = RQLBuilder.like("coinCode", $.trim($('#find_coin').val()));
                        }
                        var filter = RQLBuilder.and([
                            find_coin,find_tradecoin
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
        }
    }
}();


