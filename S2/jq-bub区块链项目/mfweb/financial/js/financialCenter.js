//初始化页面
var init = function (data) {
    var param = {};
    var time = $('#startTime').val();
    var endTime = $('#endTime').val();
    if (data == 1) {
        param["endTime"] = new Date();
        var date = new Date();
        date.setDate(date.getDate() - 30);
        param["startTime"] = date;
    } else {
        param["startTime"] = time;
        param["endTime"] = endTime;
    }
    /**bug T752*/
    $("#startTime").val($.format.date(param["startTime"], 'yyyy-MM-dd'));
    $("#endTime").val($.format.date(param["endTime"], 'yyyy-MM-dd'));
    $.ajax({
        type: 'POST',
        url: "/mf/fin/pbfcs.do",
        dataType: 'json',
        contentType: "application/json;charset=utf-8",
        data: JSON.stringify(param),
        success: function (result) {
            var totalrevenue = result.totalrevenue;
            if (totalrevenue > 0) {
                totalrevenue = "+" + totalrevenue;
            }
            $('#totalrevenue').html(totalrevenue);
            var poundageAll = result.poundageAll;
            if (poundageAll < 0) {
                poundageAll = "-" + result.poundageAll;
            }
            $('#poundageAll').html(poundageAll);
            //交易额
            var hamount = result.hamount;
            var appamount = result.appamount;
            var dom = document.getElementById("container");
            var myChart = echarts.init(dom);
            myChart.setOption({//加载数据图表  支付方式占比
                title: {
                    text: '交易额',
                    left: 'center',
                    top: '45%'
                },
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b}: {c} ({d}%)"
                },
                // legend: {
                // 	orient: 'vertical',
                // 	x: 'left',
                // 	data:['H5支付','App支付']
                // },
                series: [
                    {
                        name: '访问来源',
                        type: 'pie',
                        radius: ['50%', '70%'],
                        avoidLabelOverlap: false,
                        color: ['#0cc2aa', '#000000'],
                        labelLine: {
                            show: true,             // 是否显示视觉引导线。
                            position: 'top',
                            length: 25,             // 在 label 位置 设置为'outside'的时候会显示视觉引导线。
                            length2: 50,            // 视觉引导项第二段的长度。
                            lineStyle: {           // 视觉引导线的样式
                                width: 1
                            },
                        },
                        data: [
                            {value: appamount, name: 'App支付'},
                            {value: hamount, name: 'H5支付'}
                        ]
                    }
                ]
            });

            //订单量
            var hordersum = result.hordersum;
            var appordersum = result.appordersum;
            var dom = document.getElementById("container1");
            var myChart = echarts.init(dom);
            myChart.setOption({//加载数据图表
                // xAxis: {
                //     data: names
                // },
                title: {
                    text: '订单量',
                    left: 'center',
                    top: '45%'
                },
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b}: {c} ({d}%)"
                },
                series: [{
                    name: '访问来源',
                    type: 'pie',
                    radius: ['50%', '70%'],
                    avoidLabelOverlap: false,
                    color: ['#0cc2aa', '#000000'],
                    labelLine: {
                        show: true,             // 是否显示视觉引导线。
                        position: 'top',
                        length: 25,             // 在 label 位置 设置为'outside'的时候会显示视觉引导线。
                        length2: 50,            // 视觉引导项第二段的长度。
                        lineStyle: {           // 视觉引导线的样式
                            width: 1
                        },
                    },
                    // 根据名字对应到相应的系列
                    data: [
                        {value: appordersum==null?0:appordersum, name: 'App支付'},
                        {value: hordersum==null?0:appordersum, name: 'H5支付'}
                    ]
                }]
            });
            //初始化折线图
            var orderMessage = result.orderMessage;
            var hourArray = new Array();
            var amountArray = new Array();
            if (orderMessage != null) {
                orderMessage.forEach(function (data) {
                    var hour = data.hour;
                    hourArray.push(hour);
                    var amount = data.amount;
                    amountArray.push(amount);
                });
            }
            // 订单量折线图
            var myChart = echarts.init(document.getElementById("box"));
            myChart.setOption({
                xAxis: {
                    name: '日期',
                    type: 'category',
                    // data: hourArray
                    data: hourArray.sort()
                },
                yAxis: {
                    type: 'value',
                    name: '成交量',
                },
                series: [{
                    name: '日期',
                    data: amountArray,
                    type: 'line',
                    itemStyle: {
                        normal: {
                            label: {
                                show: true, //开启显示
                                position: 'top', //在上方显示
                                textStyle: { //数值样式
                                    color: 'black',
                                    fontSize: 12
                                }
                            }
                        }
                    }
                }]
            });
        },
        error: function (result) {
            bootbox.alert("登录超时,请重新登陆", function () {
                $.removeCookie('userinfo');
                location.href = "login.html";
            });
        }
    });
};
$(function () {
    init(1);
});
//查询
$('#find').click(function () {
    init(2);
});
