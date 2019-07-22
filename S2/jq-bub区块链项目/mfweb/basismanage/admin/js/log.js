/**
 * Created by Administrator on 2017/4/25 0025.
 */
var accesslog = function () {
    // 取本地userId
    let userId = JSON.parse(localStorage.getItem("user_info")).userId
    let user_id={user_id:userId}
    return {
        init: function () {
            this.reload();
        },
        reload:function(){

            $('#divtable').html('');

            this.xw=XWATable.init(
                {
                    divname: "divtable",
                    pageSize: 10,
                    transition: 'fade',
                    checkboxes: false,
                    checkAllToggle: true,
                    saveColumn:false,
                    //----------------基本restful地址---
                    restbase: 'mfsysonlinelog?query='+(JSON.stringify(user_id))+'&sort=-loginTime',
                    key_column: "id",
                    //---------------行定义
                    coldefs: [
                        {
                            col:"loginName",
                            friendly:"登录用户名",
                            index:2
                        },
                        {
                            col:"loginTime",
                            friendly:"登录时间",
                            index:3
                        },
                        {
                            col:"clientIp",
                            friendly:"客户端IP",
                            index:5
                        }
                    ],

                    // 查询过滤条件
                    findFilter: function(){
                        var find_resource;

                        if($('#find_resource').val())
                        {
                            find_resource=RQLBuilder.equal("areaId",$('#find_resource').val());
                        }
                        var filter=RQLBuilder.and([
                            find_resource
                        ]);
                        return filter.rql();
                    },

                    onAdded: function(ret,jsondata){

                    },

                    onUpdated: function(ret,jsondata){

                    },

                    onDeleted: function(ret,jsondata){
                    },
                }) //--init
        },

    }
}();
