package com.rnchess.UpDataUtils;

import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.os.Environment;
import android.support.v4.content.FileProvider;
import android.util.Log;

import com.rnchess.BuildConfig;
import com.rnchess.LineCheckUtils.DataCenter;
import com.rnchess.NetWorkUtils.SSLUtil;
import com.rnchess.NetWorkUtils.TlsSniSocketFactory;
import com.rnchess.NetWorkUtils.TrueHostnameVerifier;
import com.rnchess.LineCheckUtils.ProgressResponseBody;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.concurrent.TimeUnit;

import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.Interceptor;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;

/**
 * 应用更新工具
 * Created by witty on 17-11-19.
 * http://47.88.150.81:8787/android/1.0.0/app_ty3a_1.0.0.apk
 */
public class UpdateTool {
    @SuppressWarnings("unused")
    private static final String TAG = "AppUpdate";


    public static void downloadApk(String apkUrl, String fileName, final DownLoadCallBack downLoadCallBack) {
        Log.e(TAG, "下载app地址 " + apkUrl);

        String filePath = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS).getAbsolutePath();
        File dir = new File(filePath);
        if (!dir.exists()) {
            dir.mkdirs();
        }
        Log.e("Main8Activity", "filePath" + filePath);
        final File file = new File(filePath, fileName);
        downLoadCallBack.onBefore();
        //构建一个请求
        Request request = new Request.Builder()
                //下面图片的网址是在百度图片随便找的
                .url(apkUrl)
                .build();
        //构建我们的进度监听器
        final ProgressResponseBody.ProgressListener listener = new ProgressResponseBody.ProgressListener() {
            @Override
            public void update(long bytesRead, long contentLength, boolean done) {
                //计算百分比并更新ProgressBar
                final int percent = (int) (100 * bytesRead / contentLength);
                Log.e(TAG, "下载进度：" + percent);
                downLoadCallBack.inProgress(percent);
            }
        };
        //创建一个OkHttpClient，并添加网络拦截器
        OkHttpClient client = new OkHttpClient.Builder()
                .addNetworkInterceptor(new Interceptor() {
                    @Override
                    public Response intercept(Chain chain) throws IOException {
                        Response response = chain.proceed(chain.request());
                        //这里将ResponseBody包装成我们的ProgressResponseBody
                        return response.newBuilder()
                                .body(new ProgressResponseBody(response.body(), listener))
                                .build();
                    }
                })
                .connectTimeout(3, TimeUnit.SECONDS)
                .retryOnConnectionFailure(false)
                .sslSocketFactory(new TlsSniSocketFactory(DataCenter.getInstance().getDomain()), new SSLUtil.TrustAllManager())
                .hostnameVerifier(new TrueHostnameVerifier(DataCenter.getInstance().getDomain()))
                .readTimeout(20, TimeUnit.SECONDS)
                .retryOnConnectionFailure(true)
                .writeTimeout(20, TimeUnit.SECONDS)
                .build();
        //发送响应
        Call call = client.newCall(request);
        call.enqueue(new Callback() {
            @Override
            public void onFailure(Call call, IOException e) {
                downLoadCallBack.onError();

            }

            @Override
            public void onResponse(Call call, Response response) throws IOException {
                //从响应体读取字节流
                InputStream is = null;
                byte[] buf = new byte[2048];
                int len = 0;
                FileOutputStream fos = null;
                try {
                    long total = response.body().contentLength();
                    Log.e(TAG, "total------>" + total);
                    long current = 0;
                    is = response.body().byteStream();
                    fos = new FileOutputStream(file);
                    while ((len = is.read(buf)) != -1) {
                        current += len;
                        fos.write(buf, 0, len);
                        Log.e(TAG, "current------>" + current);
                        //  progressCallBack(total, current, callBack);
                    }
                    fos.flush();
                    downLoadCallBack.onSuccess(file);
                    // successCallBack((T) file, callBack);
                } catch (IOException e) {
                    Log.e(TAG, e.toString());
                    downLoadCallBack.onError();
                    // failedCallBack("下载失败", callBack);
                } finally {
                    try {
                        if (is != null) {
                            is.close();
                        }
                        if (fos != null) {
                            fos.close();
                        }
                    } catch (IOException e) {
                        Log.e(TAG, e.toString());
                    }
                }
            }
        });

    }


    /**
     * 安装 apk 文件
     *
     * @param apkFile
     */
    public static void installApk(File apkFile, Context context) {
        if (apkFile == null) return;
        Log.e(TAG, " 新apk 路径: " + apkFile.getAbsolutePath());
        Intent intent = new Intent(Intent.ACTION_VIEW);
        // 由于没有在Activity环境下启动Activity,设置下面的标签
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) { //判读版本是否在7.0以上
            //参数1 上下文, 参数2 Provider主机地址 和配置文件中保持一致   参数3  共享的文件
            Uri apkUri =
                    FileProvider.getUriForFile(context, getPid() + ".fileprovider", apkFile);
            //添加这一句表示对目标应用临时授权该Uri所代表的文件
            intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
            intent.setDataAndType(apkUri, "application/vnd.android.package-archive");
        } else {
            intent.setDataAndType(Uri.fromFile(apkFile),
                    "application/vnd.android.package-archive");
        }
        context.startActivity(intent);
    }

    public static String getPid() {
        String pid = BuildConfig.APPLICATION_ID;
        if (BuildConfig.APPLICATION_ID.contains(".debug")) {
            pid = BuildConfig.APPLICATION_ID.replace(".debug", "");
        }
        return pid;
    }


    //下载回调
    public interface DownLoadCallBack {
        void onBefore();

        void inProgress(int progress);

        void onSuccess(File response) throws IOException;

        void onError();
    }


}