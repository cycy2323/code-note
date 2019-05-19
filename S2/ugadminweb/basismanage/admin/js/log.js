/**
 * Created by Administrator on 2017/4/25 0025.
 */
var accesslog = function () {
    return {

        init: function () {
            this.reload();
        },
        reload:function(){

            $('#divtable').html('');

            this.xw=XWATable.init(
                {
                    divname: "divtable",
                    //----------------table的选项-------
                    pageSize:50,
                    columnPicker: true,
                    transition: 'fade',
                    checkboxes: true,
                    checkAllToggle:false,
                    //----------------基本restful地址---
                    restbase: 'ugsysaccesslog?sort=-insertTime',
                    key_column: "id",
                    //---------------行定义
                    coldefs: [
                    	{
                            col:"id",
                            friendly: "ID",
                            //sorting:false,
                            index:1
                        },
                        {
                            col:"userId",
                            friendly: "用户ID",
                            //sorting:false,
                            index:1
                        },
                        {
                            col:"pbAction",
                            friendly:"请求路径",
                            index:2
                        },
                        {
                            col:"reqStr",
                            friendly:"请求参数",
                            index:3
                        },
                        {
                            col:"resStr",
                            friendly:"返回数据",
                            index:4
                        },
                        {
                            col:"状态码",
                            friendly:"retCode",
                            index:5
                        },
                        {
                            col:"retMsg",
                            friendly:"错误信息",
                            index:6
                        },
                        {
                            col:"insertTime",
                            friendly:"访问时间",
                            index:7
                        },
                        {
                            col:"userIp",
                            friendly:"请求发起ip",
                            index:8
                        },
                        {
                            col:"reqTime",
                            friendly:"响应返回时间",
                            index:8
                        }
                        /*{
                            col:"pbAction",
                            friendly:"PB用户",
                            index:2
                        },
                        {
                            col:"reqStr",
                            friendly:"请求报文",
                            index:3
                        },
                        {
                            col:"resStr",
                            friendly: "响应报文",
                            index:4
                        },
                        {
                            col:"urlLogOut",
                            friendly:"日志标记",
                            // format:yandNEnum,
                            index:5
                        },
                        {
                            col:"retcode",
                            friendly:"处理结果CODE",
                            index:6
                        },
                        {
                            col:"retMgs",
                            friendly:"处理结果MGS",
                            index:7
                        },
                        {
                            col:"insertTime",
                            friendly:"创建时间",
                            format:dateFormat,
                            index:8
                        },
                        {
                            col:"reqTime",
                            friendly:"接受请求时间",
                            format:dateFormat,
                            index:9
                        },
                        {
                            col:"proxyTime",
                            friendly:"发送到后台时间",
                            format:dateFormat,
                            index:10
                        },
                        {
                            col:"resTime",
                            friendly:"响应时间",
                            format:dateFormat,
                            index:11
                        },
                        {
                            col:"userCookies",
                            friendly:"用户的SMID等COOKIES",
                            hidden:true,
                            index:12
                        },
                        {
                            col:"userIp",
                            friendly:"用户的IP",
                            index:13
                        },
                        {
                            col:"platform",
                            friendly:"用户的平台",
                            index:14
                        },
                        {
                            col:"clientOsver",
                            friendly:"用户AGENT",
                            index:15
                        },
                        {
                            col:"costMs",
                            friendly:"耗时",
                            index:16
                        }*/
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