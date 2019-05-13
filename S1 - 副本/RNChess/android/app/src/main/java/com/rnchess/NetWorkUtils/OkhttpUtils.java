package com.rnchess.NetWorkUtils;


import android.util.Log;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;

import okhttp3.Call;
import okhttp3.FormBody;
import okhttp3.Headers;
import okhttp3.Interceptor;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;


/**
 * 简单易用的okhttp工具类
 * Created by witty on 18-10-27.
 */

public class OkhttpUtils {
    private static String TAG = "OkhttpUtils";
    private static OkHttpClient.Builder builder = null;
    private static OkHttpClient.Builder builderHttps = null;
    private static OkHttpClient.Builder builderHttp = null;


    public static Builder getInstance(String domain) {
        if (builderHttps == null) {
            synchronized (OkHttpClient.Builder.class) {
                if (builderHttps == null) {
                    builderHttps = new OkHttpClient.Builder();
                    builderHttps.connectTimeout(15, TimeUnit.SECONDS)
                            .sslSocketFactory(new TlsSniSocketFactory(domain), new SSLUtil.TrustAllManager())
                            .hostnameVerifier(new TrueHostnameVerifier(domain))
                            .readTimeout(20, TimeUnit.SECONDS)
                            .retryOnConnectionFailure(false)
                            .writeTimeout(20, TimeUnit.SECONDS);
                }
            }
        }
        builder = builderHttps;
        return new Builder();
    }

  /*  public static Builder getInstance() {
        if (builderHttp == null) {
            synchronized (OkHttpClient.Builder.class) {
                if (builderHttp == null) {
                    builderHttp = new OkHttpClient.Builder();
                    builderHttp.connectTimeout(3, TimeUnit.SECONDS)
                            .sslSocketFactory(SSLUtil.createSSLSocketFactory(), new SSLUtil.TrustAllManager())
                            .hostnameVerifier(new SSLUtil.TrustAllHostnameVerifier())
                            .readTimeout(20, TimeUnit.SECONDS)
                            .retryOnConnectionFailure(false)
                            .writeTimeout(20, TimeUnit.SECONDS);
                }
            }
        }
        builder = builderHttp;
        return new Builder();
    }*/


    public static class Builder {
        private OkhttpListerner mLineTaskBaseListener = null;
        private Call call = null;
        private Map<String, String> header = null;
        private Map<String, String> params = null;
        private String url = "";
        private RequestBody body = null;

        public Builder() {

        }

        public Builder setCall(Call call) {
            this.call = call;
            return this;
        }

        public Builder setUrl(String url) {
            this.url = url;
            return this;
        }

        public Builder setHeader(Map<String, String> header) {
            this.header = header;
            return this;
        }

        public Builder setParams(Map<String, String> params) {
            this.params = params;
            body = setBody(params);
            return this;
        }

        public Builder setOkHttpCallListerner(OkhttpListerner mOkHttpListerner) {
            this.mLineTaskBaseListener = mOkHttpListerner;
            return this;
        }


        public Builder cancelRequest() {
            if (call != null) {
                call.cancel();
            }
            return this;
        }

        public Builder post() {
            if (url.isEmpty()) {
                new Throwable("url不能为空");
                return this;
            }
            if (header == null) {
                header = setNullHeaders();
            }
            if (params == null) {
                body = setNullBody();
            }
            post("post", url, header, body);
            return this;
        }

        public Builder get() {
            if (url.isEmpty()) {
                new Throwable("url不能为空");
                return this;
            }
            if (header == null) {
                header = setNullHeaders();
            }
            if (params == null) {
                body = setNullBody();
            }
            post("get", url, header, body);
            return this;
        }

        private void post(String type, String url, Map<String, String> header, RequestBody body) {
            Request request = null;
            if (type.equals("post")) {
                request = new Request.Builder().url(url)
                        .headers(Headers.of(header))
                        .addHeader("Connection", "close")
                        .post(body)
                        .build();
            } else {
                request = new Request.Builder().url(url)
                        .headers(Headers.of(header))
                        .addHeader("Connection", "close")
                        .build();
            }


            call = builder.build().newCall(request);
            try {
                call.enqueue(new okhttp3.Callback() {
                    @Override
                    public void onFailure(Call call, IOException e) {
                         Log.e(TAG, "login Error ==> " + e.getLocalizedMessage());
                        if (mLineTaskBaseListener != null) {
                            mLineTaskBaseListener.onFailure(call, e);
                        }

                    }

                    @Override
                    public void onResponse(Call call, Response response) {
                        try {
                            //final String jsonData = response.body().string();
                            // final int mMCode = response.code();
                            // Log.e("44444登录中返回报文：", jsonData);
                            // Log.e("登录中返回报文：", jsonData);

                            if (mLineTaskBaseListener != null) {
                                mLineTaskBaseListener.onResponse(call, response);
                            }
                        } catch (Exception e) {
                            if (mLineTaskBaseListener != null) {
                                mLineTaskBaseListener.onException(e);
                            }
                        }

                    }

                });
            } catch (Exception e) {
               //  Log.e(TAG, "login 2Error ==> " + e.getLocalizedMessage());
                if (mLineTaskBaseListener != null) {
                    mLineTaskBaseListener.onException(e);
                }
            }
        }


        private Map<String, String> setNullHeaders() {
            Map<String, String> headers = new HashMap<>();
            return headers;
        }

        private RequestBody setNullBody() {
            RequestBody body = new FormBody.Builder()
                    .build();
            return body;
        }

        private RequestBody setBody(Map<String, String> map) {
            FormBody.Builder body = new FormBody.Builder();
            if (map != null) {
                for (Map.Entry entry : map.entrySet()) {
                    body.add(String.valueOf(entry.getKey()), String.valueOf(entry.getValue()));
                }
            }
            return body.build();
        }
    }

}
