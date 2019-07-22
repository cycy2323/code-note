var roleTypes = function(val){
    if(val == 1){
        return "<select id='roleType' name='roleType' class='form-control select2me'><option value='1' selected>菜单角色</option><option value='2'>流程角色</option><option value='3'>数据角色</option></select>";
    }else if(val == 2){
        return "<select id='roleType' name='roleType' class='form-control select2me'><option value='1'>菜单角色</option><option value='2' selected>流程角色</option><option value='3'>数据角色</option></select>";

    }else if(val == 3){
        return "<select id='roleType' name='roleType' class='form-control select2me'><option value='1'>菜单角色</option><option value='2' >流程角色</option><option value='3' selected>数据角色</option></select>";

    }else{
        return "<select id='roleType' name='roleType' class='form-control select2me'><option value='1'>菜单角色</option><option value='2'>流程角色</option><option value='3'>数据角色</option></select>";

    }
};

var roleAction = function () {
    return {
        init: function () {
            this.reload();
        },
        reload: function () {

            $('#divtable').html('');

            var statusStr = "",roleTypeStr = "";
            $.map(GasSysBasic.enumStatus,function(value,key){
                statusStr +=","+key+":"+value;
            });
            statusStr = statusStr.substring(1,statusStr.length);

            $.map(GasSysBasic.enumRoleType,function(value,key){
                roleTypeStr +=","+key+":"+value;
            });
            roleTypeStr = roleTypeStr.substring(1,roleTypeStr.length);

            var global_remap = {
                "roleType":roleTypeStr,
                "status":statusStr
            };
                     
            this.xw = XWATable.init(
                {
                    divname: "divtable",
                    //----------------table的选项-------
                    pageSize: 50,
                    columnPicker: true,
                    transition: 'fade',
                    exportxls: {
                        title:"商户接入参数管理",
                        remap:global_remap,
                        hidden:false,
                        ci:{}
                    },
                    checkboxes: true,
                    checkAllToggle: true,
                    //----------------基本restful地址---
                    restbase: 'debasicmerchantparams',
                    key_column: 'id',
                    coldefs: [
                        {
                            col: "id",
                            friendly: "参数ID",
                            unique: "true",
                            hidden: true,
                            nonedit: "nosend",
                            readonly: "readonly",
                            index: 1
                        },
                        {
                            col: "merchantNo",
                            friendly: "商户编号",
                            validate:"required",
                            index: 2
                        },
                        {
                            col: "merchantSecretKeyNew",
                            friendly: "商户密钥",
                            validate:"required",
                            index: 3
                        },
                        {
                            col: "channelPubKey",
                            friendly: "SEC公钥",
                            validate:"required",
                            index: 3
                        },
                        {
                            col: "channelPriKey",
                            friendly: "SEC私钥",
                            validate:"required",
                            index: 5
                        },
                        {
                            col: "channelKey",
                            friendly: "AES密钥",
                            index: 6
                        },
                        {
                            col: "merchantInIp",
                            friendly: "商户接入ip",
                            index: 6
                        },
                        {
                            col: "merchantInPort",
                            friendly: "商户接入端口",
                            index: 6
                        },
                        {
                            col: "maxDailyTransUsdt",
                            friendly: "每天最大的交易量",
                            index: 6
                        },
                        {
                            col: "minUsdtPoolSize",
                            friendly: "USDT池的最小值",
                            index: 6
                        },
                        {
                            col: "maxUsdtPoolSize",
                            friendly: "USDT池的最大值",
                            index: 6
                        },
                        {
                            col: "encryType",
                            friendly: "加密方式",
                            index: 6
                        },
                        {
                            col: "activeTimeOld",
                            friendly: "生效时间（旧）",
                            format:dateFormat,
                            index: 6
                        },
                        {
                            col: "effectiveTimeOld",
                            friendly: "有效时间（旧）",
                            format:dateFormat,
                            index: 6
                        },
                        {
                            col: "activeTimeNew",
                            friendly: "生效时间（新）",
                            format:dateFormat,
                            index: 6
                        },
                        {
                            col: "effectiveTimeNew",
                            friendly: "有效时间（新）",
                            format:dateFormat,
                            index: 6
                        }

                    ],
                    // 查询过滤条件
                    findFilter: function () {
                        var find_roleName;
                        if ($('#find_roleName').val()) {
                            find_roleName = RQLBuilder.like("roleName", $.trim($('#find_roleName').val()));
                        }
                        var filter = RQLBuilder.and([
                            find_roleName
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


