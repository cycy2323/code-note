package com.rnchess.LineCheckUtils;

import android.content.Context;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.net.wifi.WifiInfo;
import android.net.wifi.WifiManager;
import android.os.Build;
import android.text.TextUtils;
import android.util.Log;

import com.rnchess.MainApplication;
import com.rnchess.NetWorkUtils.SSLUtil;

import java.io.IOException;
import java.net.Inet4Address;
import java.net.InetAddress;
import java.net.NetworkInterface;
import java.net.SocketException;
import java.util.Enumeration;

import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.FormBody;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

/**
 * Created by witty on 18-10-25.
 * <p>
 * 上传所有的错误线路信息
 */

public class UploadErrorLinesUtil {

    private static int count = 0;



    /**
     * 上传域名检测
     *
     * @param domains
     * @param ip
     * @param errorMessages
     * @param codes
     * @param mark
     */
    public static void upload(String domains, String ip, String errorMessages, String codes, String mark) {
        String siteId = resolvePackgeName();
        String userName = (String) SPTool.get(MainApplication.getContext(), "KEY_USERNAME", "");
        String lastLoginTime = "";
        doUpload(siteId, userName, lastLoginTime, domains, ip, errorMessages, codes, mark, false);
    }


    /**
     * 发起请求
     *
     * @param siteId
     * @param userName
     * @param lastLoginTime
     * @param domain
     * @param ip
     * @param errorMessages
     * @param codes
     * @param mark
     * @param isApp
     */
    public static void doUpload(String siteId, String userName, String lastLoginTime, String domain, String ip,
                                String errorMessages, String codes, String mark, boolean isApp) {
        if (TextUtils.isEmpty(domain)) {
            return;
        }
        if (count > 0) return;
        String url = ConstantValue.BASE_URL;


        Log.e("UploadErrorLinesUtil", "siteId -> " + siteId);
        OkHttpClient okHttpClient = new OkHttpClient();
        okHttpClient.newBuilder().sslSocketFactory(SSLUtil.createSSLSocketFactory(), new SSLUtil.TrustAllManager());

        String errorType;
        if (isApp) {
            errorType = "错误类型: crash 闪退";
        } else {
            errorType = "错误类型: 线路错误信息";
        }

        RequestBody body = new FormBody.Builder()
                .add("siteId", siteId) // 站点
                .add("username", userName + "  |版本号: " + PackageInfoUtil.getVersionCode(MainApplication.getContext()))
                .add("lastLoginTime", lastLoginTime) // 最后登录时间
                .add("domain", domain) // 域名
                .add("ip", ip) // ip
                .add("errorMessage", errorType + "\n" + errorMessages) // 错误信息
                .add("code", codes) // 站点标示 或者错误域名的code
                .add("mark", mark) // 标记随机码
                .add("type", isApp ? "2" : "1")//1域名 2crash
                .add("versionName", PackageInfoUtil.getVersionName(MainApplication.getContext()) +
                        " / " + PackageInfoUtil.getVersionCode(MainApplication.getContext())) // 版本号
                .add("channel", "android")// 不同系统
                .add("sysCode", Build.VERSION.RELEASE)// 系统版本号
                .add("brand", Build.BRAND)//手机品牌
                .add("model", Build.MODEL)// 手机型号
                .build();
        Request request = new Request.Builder().url(url).post(body).build();
        count++;
        okHttpClient.newCall(request).enqueue(new Callback() {
            @Override
            public void onFailure(Call call, IOException e) {
                Log.e("UploadErrorLinesUtil", "上传错误线路信息失败: " + e.getMessage());
            }

            @Override
            public void onResponse(Call call, Response response) throws IOException {
                Log.e("UploadErrorLinesUtil  ", "上传错误线路信息结果 response:" + response.toString());
                Log.e("UploadErrorLinesUtil  ", "上传错误线路信息结果 code:" + response.code());
            }
        });
    }


    /**
     * 处理站点id
     *
     * @return
     */
    public static String resolvePackgeName() {
        String packageName = MainApplication.getContext().getPackageName();

        String subStr = packageName.substring(packageName.indexOf("sid"));
        if (subStr.contains("debug")) {
            return subStr.substring(3, subStr.lastIndexOf("."));
        } else {
            return subStr.substring(3);
        }
    }


}
