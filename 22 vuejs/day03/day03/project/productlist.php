<?php
//1:加载init.php文件
require_once("init.php");
//2:获取参数pno pageSize
@$pno=$_REQUEST["pno"];
@$pageSize=$_REQUEST["pageSize"];
//3:如二个参娄进行判断，如果参数无效设置默认值 pno=1 pageSize=8
if(!$pno){
    $pno=1;
}else{      //请求消息中的请求数据都是string，此处需要转换为int
    $pno = intval($pno);    //string=>int
}
if(!$pageSize){
    $pageSize=8;
}else {
    $pageSize = intval($pageSize);   //string=>int
}
//4:创建正则表达式对参数进行验证
$reg='/^[0-9]{1,}$/';
$rs=preg_match($reg,$pno);
if(!$rs){
    die('{"code":-1,"msg":"页码格式不正确"}');
}
$rs=preg_match($reg,$pageSize);
if(!$rs){
    die('{"code":-1,"msg":"页大小格式不正确"}');
}
//5:创建sql语句查询总记录
$sql="SELECT count(lid) as c FROM xz_laptop";
$rs=mysqli_query($conn,$sql);
$row=mysqli_fetch_row($rs);
$pageCount=ceil($row[0]/$pageSize);
//6:创建sql语句查询当前页内容
$offset=($pno-1)*$pageSize;
$sql=" SELECT lid,lname,price,title,spec FROM xz_laptop LIMIT $offset,$pageSize";
$rs=mysqli_query($conn,$sql);
$rows=mysqli_fetch_all($rs,MYSQLI_ASSOC);
//7:返回结果 json
$output=["pno"=>$pno,"pageSize"=>$pageSize,"pageCount"=>$pageCount,"data"=>$rows];
echo json_encode($output);