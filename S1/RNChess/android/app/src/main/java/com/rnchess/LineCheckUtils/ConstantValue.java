package com.rnchess.LineCheckUtils;

/**
 * 常量
 */

public interface ConstantValue {


    /**
     * 阿里云总线路服务器
     */
    String BASE_URL_1_IP = "http://203.107.1.33/194768/d?host=apiplay.info";
    String BASE_URL_2_IP = "http://203.107.1.33/194768/d?host=hpdbtopgolddesign.com";
    String BASE_URL_3_IP = "http://203.107.1.33/194768/d?host=agpicdance.info";



    /**
     * 线路服务器
     */
    String BASE_URL_1 = "https://apiplay.info:1344/boss-api/app/line.html";
    String BASE_URL_2 =  "https://agpicdance.info:1344/boss-api/app/line.html";
    String BASE_URL_3 = "https://hpdbtopgolddesign.com:1344/boss-api/app/line.html";

    String[] fecthUrl = {BASE_URL_1 , BASE_URL_2 , BASE_URL_3};


    String BASE_URL =  "https://apiplay.info:1344/boss/facade/collectAppDomainError.html";











}
