var xw;
var opType = function(val){
	return{
		f: function(val){
			if(val == 1){
				return "下单验证";
			}else if(val == 2){
				return "提币验证";
			}else if(val == 3){
				return "手机验证";
			}else{
				return "邮箱验证";
			}
		}
	}
}();
var opStatus = function(val){
	return{
		f: function(val){
			if(val == 1){
				return "开";
			}else{
				return "关";
			}
		}
	}
}();
var UserSwitchLogs = function () {
    return {
        init: function () {
            this.reload();
        },
        reload: function () {

            $('#divtable').html('');
            xw = XWATable.init(
                {
                    divname: "divtable",
                    //----------------table的选项-------
                    pageSize: 50,
                    columnPicker: true,
                    transition: 'fade',
                    checkboxes: true,
                    checkAllToggle: true,
                    //----------------基本restful地址---
                    restbase: 'txtpsswitchlogs?sort=-createdTime',
                    key_column: 'logId',
                    coldefs: [
                        {
                            col: "logId",
                            friendly: "ID",
                            unique: "true",
                            hidden: false,
                            nonedit: "nosend",
                            readonly: "readonly",
                            index: 1
                        },
                        {
                            col: "txTpsUserId",
                            friendly: "用户ID",
                            validate:"required",
                            index: 2
                        },
                        {
                            col: "opType",
                            friendly: "操作名称",
                            format: opType,
                            validate:"required",
                            index: 3
                        },
                        {
                            col: "opStatus",
                            friendly: "验证状态",
                            format: opStatus,
                            validate:"required",
                            index: 4
                        },
                        {
                            col: "createdTime",
                            friendly: "创建时间",
                            index: 6
                        },
                    ],
                    // 查询过滤条件
                    findFilter: function () {
                        var txTpsUserId,opType,opStatus;
                        if ($('#txTpsUserId').val()) {
                            txTpsUserId = RQLBuilder.equal("txTpsUserId", $.trim($('#txTpsUserId').val()));
                        }
                         if ($('#opType').val()) {
                            opStatus = RQLBuilder.equal("opType", $.trim($('#opType').val()));
                        }
                        if ($('#opStatus').val()) {
                            opStatus = RQLBuilder.equal("opStatus", $.trim($('#opStatus').val()));
                        }
                        var filter = RQLBuilder.and([
                            txTpsUserId,opType,opStatus
                        ]);
                        return filter.rql();
                    }
                })
        }
    }
}();
