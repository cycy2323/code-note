//初始化页面
var init = function(data){
    var param = {};
    var time = $('#time').val();
    if(data==1){
        param["time"] = '';
    }else{
        param["time"] = time;
    }
    $.ajax({
        type: 'POST',
        url: "/mf/fin/pbfcs.do",
        dataType: 'json',
        contentType: "application/json;charset=utf-8",
        data:JSON.stringify(param),
        success: function(result) {
        //    console.log(result);
           var totalrevenue = result.totalrevenue;
           if(totalrevenue>0){
               totalrevenue = "+"+totalrevenue;
           }
           $('#totalrevenue').html(totalrevenue);
           var poundageAll = result.poundageAll;
           if(poundageAll<0){
               poundageAll = "-"+result.poundageAll;
           }
           $('#poundageAll').html(poundageAll);
           //交易额
           var hamount = result.hamount;
           var appamount = result.appamount;
           var dom = document.getElementById("container");
		   var myChart = echarts.init(dom);
           myChart.setOption({//加载数据图表
            title:{
				text:'交易额',
				left:'center',
        		top:'45%'
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
                            name:'访问来源',
                            type:'pie',
                            radius: ['50%', '70%'],
                            avoidLabelOverlap: false,
                            color: ['#0cc2aa','#000000'],
                            labelLine:{  
                                show: true,             // 是否显示视觉引导线。
                                position:'top',
                                length: 25,             // 在 label 位置 设置为'outside'的时候会显示视觉引导线。
                                length2: 50,            // 视觉引导项第二段的长度。
                                lineStyle: {           // 视觉引导线的样式
                                  width: 1
                                },
                            }, 
                            data:[
                                {value:appamount, name:'App支付'},
                                {value:hamount, name:'H5支付'}
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
                title:{
                    text:'订单量',
                    left:'center',
                    top:'45%'
                },
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b}: {c} ({d}%)"
                },
                series: [{
                    name:'访问来源',
                        type:'pie',
                        radius: ['50%', '70%'],
                        avoidLabelOverlap: false,
                        color: ['#0cc2aa','#000000'],
                        labelLine:{  
                            show: true,             // 是否显示视觉引导线。
                            position:'top',
                            length: 25,             // 在 label 位置 设置为'outside'的时候会显示视觉引导线。
                            length2: 50,            // 视觉引导项第二段的长度。
                            lineStyle: {           // 视觉引导线的样式
                              width: 1
                            },
                    }, 
                    // 根据名字对应到相应的系列
                    data:[
                        {value:appordersum, name:'App支付'},
                        {value:hordersum, name:'H5支付'}
                    ]
                }]
            });
            //初始化折线图
            var orderMessage = result.orderMessage;
            var hourArray= new Array();
            var amountArray = new Array();
            if(orderMessage!=null){
                orderMessage.forEach(function(data){  
                    var hour = data.hour;
                    hourArray.push(hour);
                    var amount = data.amount;
                    amountArray.push(amount);
                });
            }
            var myChart = echarts.init(document.getElementById("box"));
            myChart.setOption({
                xAxis: {
                    type: 'category',
                    data: hourArray
                },
                yAxis: {
                    type: 'value'
                },
                series: [{
                    data: amountArray,
                    type: 'line'
                }]
            });
        },
        error: function() {
            bootbox.alert("接口异常");
            // window.location="login.html"
        }
    });
};
$(function(){
    init(1);
});
//查询
$('#find').click(function(){
    init(2);
});