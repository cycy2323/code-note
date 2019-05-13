package com.rnchess;


import android.util.Base64;
import android.util.Log;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.rnchess.NetWorkUtils.OkhttpListerner;
import com.rnchess.NetWorkUtils.OkhttpUtils;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import okhttp3.Call;
import okhttp3.Response;

public class AndroidNativeNetModule extends ReactContextBaseJavaModule {

    public AndroidNativeNetModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "AndroidNativeNetModule";
    }

    private String TAG = "AndroidNativeNetModule";

    @ReactMethod
    public void get(final String url, ReadableMap header, final Callback responseCallback,
                    final Callback failureCallback) {
        Log.e("getxx get的url：", url);

        HashMap<String, Object> hashMapHeader = new HashMap<>();
        final Map<String, String> mapHeaders = new HashMap<>();

        if (header != null) {
            hashMapHeader = header.toHashMap();
            Log.e(TAG, "rnsendReadableHeaderMap:" + hashMapHeader);


            if (hashMapHeader != null) {
                for (Map.Entry entry : hashMapHeader.entrySet()) {
                    mapHeaders.put(String.valueOf(entry.getKey()), String.valueOf(entry.getValue()));
                }
            }
        }

        String host = "";
        if (url.startsWith("https://")) {
            host = header.getString("Host");
        }
        Log.e(TAG, "getxx get url ==> " + url + " host:" + host);

        OkhttpUtils.getInstance(host)
                .setHeader(mapHeaders)
                .setUrl(url)
                .get()
                .setOkHttpCallListerner(new OkhttpListerner() {
                    @Override
                    public void onFailure(Call call, IOException e) {
                        Log.e(TAG, "getxx get onFailure  map ==> " + e.getLocalizedMessage() + "   url=> " + mapHeaders.toString());
                        Log.e(TAG, "getxx get onFailure ==> " + e.getLocalizedMessage() + "   url=> " + url);
                        if (e != null) {
                            if (e.getLocalizedMessage() != null) {
                                if (e.getLocalizedMessage().contains("failed to connect to")) {
                                    return;
                                }
                            }
                        }

                        failureCallback.invoke(e.getLocalizedMessage(), 0);
                    }

                    @Override
                    public void onResponse(Call call, Response response) throws Exception {
                        List<String> headerStatusList = response.headers().values("headerStatus");
                        int headerStatus = -100;//-100代表header中没有状态码
                        if (headerStatusList.size() != 0 && !headerStatusList.isEmpty()) {
                            headerStatus = Integer.parseInt(response.headers().values("headerStatus").get(0).toString());
                        }

                        Log.e("getxx Response：", response.toString());
                        if (response.code() == 200 && (headerStatus == -100 || headerStatus == 200)) {
                            String jsonData = response.body().string();
                            int mMCode = response.code();
                            String header = response.headers().toString();
                            Log.e("getxx get中返回报文：", jsonData);
                            Log.e("getxx get中返回报文CODE：", mMCode + "");
                            Log.e("getxx get中返回header：", header);
                            List<String> cookies = response.headers().values("Set-Cookie");
                            Log.e("getxx get中返回cookies：", cookies.toString());
                            WritableMap cookieMap = Arguments.createMap();
                            if (cookies != null) {

                                for (String cookie : cookies) {
                                    if (cookie.startsWith("SID=") && cookie.endsWith("HttpOnly")) {
                                        cookieMap.putString("Set-Cookie", cookie);
                                    }
                                }

                                Log.e("getxx get中返回maps：", " url:" + response.request().url().toString() + " cookie:" + cookieMap.toString());
                            }


                            responseCallback.invoke(jsonData, cookieMap);
                        } else {
                            Log.e("eeeeeeeeeerrr：", response.request().url().toString() + " " + " " + response.code() + " " + response.headers().toString());
                            if (response.code() == 200) {
                                failureCallback.invoke("请求失败", headerStatus);
                            } else {
                                failureCallback.invoke("请求失败", response.code());
                            }
                        }
                    }

                    @Override
                    public void onException(Exception e) {
                        Log.e(TAG, "getxx get onException ==> " + e.getLocalizedMessage());
                        failureCallback.invoke(e.getLocalizedMessage(), 0);
                    }
                });

    }

    @ReactMethod
    public void post(final String url, ReadableMap header, ReadableMap params, final Callback responseCallback,
                     final Callback failureCallback) {
        Log.e("postxx post的url：", url);
        Log.e("postxx post的header：", header.toString());
        Log.e("postxx post的params：", params.toString());

        HashMap<String, Object> hashMapHeader = new HashMap<>();
        Map<String, String> mapHeaders = new HashMap<>();

        if (header != null) {
            hashMapHeader = header.toHashMap();
            Log.e(TAG, "rnsendReadableHeaderMap:" + hashMapHeader.toString());


            if (hashMapHeader != null) {
                for (Map.Entry entry : hashMapHeader.entrySet()) {
                    mapHeaders.put(String.valueOf(entry.getKey()), String.valueOf(entry.getValue()));
                }
            }

            Log.e(TAG, "inputheader:" + mapHeaders.toString());

        }


        HashMap<String, Object> hashMapParams = new HashMap<>();
        Map<String, String> mapParams = new HashMap<>();
        if (params != null) {
            hashMapParams = params.toHashMap();
            Log.e(TAG, "rnsendReadableParamsMap:" + hashMapParams.toString());


            if (hashMapParams != null) {
                for (Map.Entry entry : hashMapParams.entrySet()) {
                    mapParams.put(String.valueOf(entry.getKey()), String.valueOf(entry.getValue()));
                }
            }

            Log.e(TAG, "inputparams:" + mapParams.toString());
        }

        String host = "";
        if (url.startsWith("https://")) {
            host = header.getString("Host");
        }

        Log.e(TAG, "postxx post url ==> " + url + " host:" + host);
        OkhttpUtils.getInstance(host)
                .setHeader(mapHeaders)
                .setUrl(url)
                .setParams(mapParams)
                .post()
                .setOkHttpCallListerner(new OkhttpListerner() {
                    @Override
                    public void onFailure(Call call, IOException e) {
                        Log.e(TAG, "postxx post onFailure ==> " + e.getLocalizedMessage() + "onFilure" + e.getMessage() + "    url=>" + url);
                        if (e != null) {
                            if (e.getLocalizedMessage() != null) {
                                if (e.getLocalizedMessage().contains("failed to connect to")) {
                                    return;
                                }
                            }
                        }

                        failureCallback.invoke(e.getLocalizedMessage(), 0);
                    }

                    @Override
                    public void onResponse(Call call, Response response) throws Exception {
                        List<String> headerStatusList = response.headers().values("headerStatus");
                        int headerStatus = -100;//-100代表header中没有状态码
                        if (headerStatusList.size() != 0 && !headerStatusList.isEmpty()) {
                            headerStatus = Integer.parseInt(response.headers().values("headerStatus").get(0).toString());
                        }

                        if (response.code() == 200 && (headerStatus == -100 || headerStatus == 200)) {
                            if (response.request().url().toString().contains("captcha/pmregister.html") || response.request().url().toString().contains("captcha/securityPwd.html") || response.request().url().toString().contains("captcha/code.html")) {
                                byte[] byteBody = response.body().bytes();
                                String base64 = Base64.encodeToString(byteBody, Base64.DEFAULT);

                                int mMCode = response.code();
                                String header = response.headers().toString();
                                Log.e("postxx post中返回报文：", base64);
                                Log.e("postxx post中返回报文CODE：", mMCode + "");
                                Log.e("postxx post中返回header：", header);
                                List<String> cookies = response.headers().values("Set-Cookie");
                                Log.e("postxx get中返回cookies：", cookies.toString());
                                WritableMap cookieMap = Arguments.createMap();
                                if (cookies != null) {

                                    for (String cookie : cookies) {
                                        if (cookie.startsWith("SID=") && cookie.endsWith("HttpOnly")) {
                                            cookieMap.putString("Set-Cookie", cookie);
                                        }
                                    }

                                    Log.e("postxx get中返回maps：", " url:" + response.request().url().toString() + " cookie:" + cookieMap.toString());
                                }
                                responseCallback.invoke(base64, cookieMap);
                            } else {
                                Log.e("postxx Response：", response.toString());

                                String jsonData = response.body().string();
                                int mMCode = response.code();
                                String header = response.headers().toString();
                                Log.e("postxx post中返回报文：", jsonData);
                                Log.e("postxx post中返回报文CODE：", mMCode + "");
                                Log.e("postxx post中返回header：", header);
                                List<String> cookies = response.headers().values("Set-Cookie");
                                Log.e("postxx get中返回cookies：", cookies.toString());
                                WritableMap cookieMap = Arguments.createMap();
                                if (cookies != null) {

                                    for (String cookie : cookies) {
                                        if (cookie.startsWith("SID=") && cookie.endsWith("HttpOnly")) {
                                            cookieMap.putString("Set-Cookie", cookie);
                                        }
                                    }

                                    Log.e("postxx get中返回maps：", "url:" + response.request().url().toString() + " cookie:" + cookieMap.toString());
                                }
                                responseCallback.invoke(jsonData, cookieMap);

                            }
                        } else {
                            Log.e("eeeeeeeeeerrr：", response.request().url().toString() + " " + " " + response.code() + " " + response.headers().toString());
                            if (response.code() == 200) {
                                failureCallback.invoke("请求失败", headerStatus);
                            } else {
                                failureCallback.invoke("请求失败", response.code());
                            }
                        }

                    }

                    @Override
                    public void onException(Exception e) {
                        Log.e(TAG, "postxx post onException ==> " + e.getLocalizedMessage());
                        failureCallback.invoke(e.getLocalizedMessage(), 0);
                    }
                });

    }
}
