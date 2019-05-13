package com.rnchess.LineCheckUtils;



/**
 * 数据中心
 * Created by witty on 18-10-26.
 */

public class DataCenter {
    private static DataCenter instance;
    private static User mUser = new User();
    public static DataCenter getInstance() {
        if (instance == null) {
            synchronized (DataCenter.class) {
                if (instance == null) {
                    instance = new DataCenter();
                }
            }
        }
        return instance;
    }


    public String getDomain() {
        String domain = mUser.getDomain();
            domain = NetUtil.leftOutHttpFromDomain(domain);
        return domain;
    }

    public void setDomain(String domain) {
        mUser.setDomain(domain);
    }



    public void setIp(String ip) {
        mUser.setIp(ip);
    }

    public String getIp() {
        return mUser.getIp();
    }







}
