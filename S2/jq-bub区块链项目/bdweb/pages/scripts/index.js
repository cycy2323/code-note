/**
 * Created by Reid on 25/11/16.
 */
var userinfo = JSON.parse(localStorage.getItem('user_info'));
var Index = function(){
    return {

        noticeView:$("#notice_view"),
        mainView:$("#main_view"),

        init:function(){
            
//          this.bingdem();

            setInterval(this.loadToDoTask, 10000);  
        },

        bingdem:function(){ 
           // $("#divtable2").hide();
            if($("#__todolist").attr('id') != undefined){
                dust.loadSource( dust.compile($("#__dust_todolist").html(),"todo"));
            }
            if($("#__donelist").attr('id') != undefined){
                dust.loadSource( dust.compile($("#__dust_donelist").html(),"done"));
            } 
 
             
        },
        noticeViewCloseClick:function(){
            Index.noticeView.fadeOut(500,'swing');
            Index.mainView.delay(300).fadeIn(1000);
        },
        showNews:function(noticeId){
            NoticeView.loadNoticeData(noticeId);
            Index.mainView.fadeOut(500,'swing');
            Index.noticeView.delay(300).fadeIn(1000);
        },
    };
}();
