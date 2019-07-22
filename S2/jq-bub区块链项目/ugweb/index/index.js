// var indexInfo = function(){
//     $.ajax({
//         type: 'POST',
//         url: "/ug/use/pbiis.do",
//         dataType: 'json',
//         contentType: "application/json;charset=utf-8",
//         async: false,
//         data:'',
//         success: function(result) {
//             var pendingOrder = '';
//             if(result.pendingOrder > 0){
//                 pendingOrder = '+'+result.pendingOrder;
//             }else{
//                 pendingOrder = '无';
//             }
//             $('#pendingOrder').html(pendingOrder);
//             $('#updateTime').html(result.updateTime);
            
//             var netaccount = result.rows[0].netaccount;
//             var orders = result.rows[0].orders;
//             var paynumbers = result.rows[0].paynumbers;
//             var poundageaccount = result.rows[0].poundageaccount;
//             if(netaccount == null){
//                 netaccount = 0;
//             }
//             if(orders == null){
//                 orders = 0;
//             }
//             if(paynumbers == null){
//                 paynumbers = 0;
//             }
//             if(poundageaccount == null){
//                 poundageaccount = 0;
//             }
//             $('#netaccount').html(netaccount);
//             $('#orders').html(orders);
//             $('#paynumbers').html(paynumbers);
//             $('#poundageaccount').html(poundageaccount);
//             // console.log(result);
//         },
//         error: function() {
//             bootbox.alert("接口异常");
//         }
//     });
// }();
