<?php
 header('Access-Control-Allow-Origin:*');//添加：允许所有来源访问
 header("Content-Type:application/json;charset=utf-8");
 $conn = mysqli_connect("127.0.0.1","root","","xz",3306);
 mysqli_query($conn,"SET NAMES UTF8");
 ?>