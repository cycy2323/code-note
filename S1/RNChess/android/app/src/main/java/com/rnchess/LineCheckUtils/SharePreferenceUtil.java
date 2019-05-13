package com.rnchess.LineCheckUtils;

import android.content.Context;
import android.content.SharedPreferences;
import android.support.v4.content.SharedPreferencesCompat;
import android.util.Log;

import com.rnchess.MainApplication;


/**
 * 保存一些基本信息
 * Created by witty on 18-10-27.
 */

public class SharePreferenceUtil {
    public static final String GESTURE_TIME = "gesture_time"; // 手势密码输入错误超过5次时间

    private static SharedPreferences getSharedPreferences() {
        MainApplication app = (MainApplication) MainApplication.getContext();
        return app.getSharedPreferences("Box_Base_NetInfo", Context.MODE_PRIVATE);
    }

    /**
     * 获取保存的域名
     *
     * @param context
     * @return
     */
    public static String getDomain(Context context) {
        SharedPreferences sp = context.getSharedPreferences("Box_Base_NetInfo", Context.MODE_PRIVATE);
        return sp.getString("domain", "");
    }

    /**
     * 保存检测成功后的域名
     *
     * @param context
     * @param domain
     */
    public static void saveDomain(Context context, String domain) {
        Log.e("LineHelpUtil","保存数据 domain---->"+domain);
        SharedPreferences sp = context.getSharedPreferences("Box_Base_NetInfo", Context.MODE_PRIVATE);
        SharedPreferences.Editor editor = sp.edit();
        editor.putString("domain", domain);
        editor.apply();
    }

    /**
     * 获取保存的boss域名
     *
     * @param context
     * @return
     */
    public static String getBossDomain(Context context) {
        SharedPreferences sp = context.getSharedPreferences("Box_Base_NetInfo", Context.MODE_PRIVATE);
        return sp.getString("bossDomain", "");
    }

    /**
     * 保存检测成功后的总控域名
     *
     * @param context
     * @param bossDomain
     */
    public static void saveBossDomain(Context context, String bossDomain) {
        SharedPreferences sp = context.getSharedPreferences("Box_Base_NetInfo", Context.MODE_PRIVATE);
        SharedPreferences.Editor editor = sp.edit();
        editor.putString("bossDomain", bossDomain);
        editor.apply();
    }

    /**
     * 获取保存的boss ip列表
     *
     * @param context
     * @return
     */
    public static String getBossIpDomain(Context context) {
        SharedPreferences sp = context.getSharedPreferences("Box_Base_NetInfo", Context.MODE_PRIVATE);
      //  Log.e("LineHelperUtil","getBossIpDomain=> "+sp.getString("bossIpDomain", ""));
        return sp.getString("bossIpDomain", "");
    }

    /**
     * 保存检测成功后的boss ip列表
     *
     * @param context
     * @param bossIpDomain
     */
    public static void saveBossIpDomain(Context context, String bossIpDomain) {
        SharedPreferences sp = context.getSharedPreferences("Box_Base_NetInfo", Context.MODE_PRIVATE);
        SharedPreferences.Editor editor = sp.edit();
        editor.putString("bossIpDomain", bossIpDomain);
        editor.apply();
      //  Log.e("LineHelperUtil","saveBossIpDomain=> "+bossIpDomain);
    }

    /**
     * 获取保存的域名ip
     *
     * @param context
     * @return
     */
    public static String getIp(Context context) {
        SharedPreferences sp = context.getSharedPreferences("Box_Base_NetInfo", Context.MODE_PRIVATE);
        return sp.getString("ip", "");
    }

    /**
     * 保存检测成功后的域名ip
     *
     * @param context
     * @param ip
     */
    public static void saveIp(Context context, String ip) {
        SharedPreferences sp = context.getSharedPreferences("Box_Base_NetInfo", Context.MODE_PRIVATE);
        SharedPreferences.Editor editor = sp.edit();
        editor.putString("ip", ip);
        editor.apply();
    }

    /**
     * 获取保存的域名ip 前段自定义时间
     *
     * @param context
     * @return
     */
    public static long getTime(Context context) {
        SharedPreferences sp = context.getSharedPreferences("Box_Base_NetInfo", Context.MODE_PRIVATE);
        return sp.getLong("time_diy", 0);
    }

    /**
     * 保存检测成功后的域名ip 前段自定义时间
     *
     * @param context
     * @param time
     */
    public static void saveTime(Context context, long time) {
        SharedPreferences sp = context.getSharedPreferences("Box_Base_NetInfo", Context.MODE_PRIVATE);
        SharedPreferences.Editor editor = sp.edit();
        editor.putLong("time_diy", time);
        editor.apply();
    }





    /**
     * 保存是否需要开启前段获取最优service
     *
     * @param context
     * @param b
     */
    public static void saveisStartBestLineService(Context context, boolean b) {
        SharedPreferences sp = context.getSharedPreferences("Box_Base_NetInfo", Context.MODE_PRIVATE);
        SharedPreferences.Editor editor = sp.edit();
        editor.putBoolean("isStartBestLineService", b);
        editor.apply();
    }



    /**
     * 清空数据
     */
    public static void clear(Context context) {
        SharedPreferences sp = context.getSharedPreferences("Box_Base_NetInfo", Context.MODE_PRIVATE);
        SharedPreferences.Editor editor = sp.edit();
        editor.clear();
        SharedPreferencesCompat.EditorCompat.getInstance().apply(editor);
    }

}
