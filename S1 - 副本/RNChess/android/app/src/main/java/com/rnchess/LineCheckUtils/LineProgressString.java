package com.rnchess.LineCheckUtils;


public class LineProgressString {
    /**
     * code
     */
    public static final String CODE_001 = "1";//当阿里云连接失败时，返回错误代码001;
    public static final String CODE_002 = "2";//当boss-api请求失败，返回错误代码002;
    public static final String CODE_003 = "3";//当check不通过，返回003，并将check的url地址输出;

    /**
     * string
     */
    public static final String LINE_RESULT_GET_ALIYUN_FAILURE = "线路服务器获取失败";

    public static final String LINE_RESULT_GET_FAILURE = "线路获取失败";

    public static final String LINE_RESULT_RETURN_EMPTY = "线路返回为空";

    public static final String LINE_RESULT_RETURN_IPS_EMPTY = "ip返回为空";

    public static final String LINE_RESULT_RETURN_EXCEPTION = "线路返回异常";

    public static final String LINE_RESULT_CHECK_IP_UNPASS = "ip检测未通过";



}
