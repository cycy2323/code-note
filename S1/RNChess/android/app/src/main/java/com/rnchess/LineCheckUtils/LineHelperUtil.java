package com.rnchess.LineCheckUtils;

import android.content.Context;
import android.text.TextUtils;
import android.util.Log;


import com.google.gson.Gson;
import com.rnchess.NetWorkUtils.SSLUtil;
import com.rnchess.NetWorkUtils.TlsSniSocketFactory;
import com.rnchess.NetWorkUtils.TrueHostnameVerifier;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.TimeUnit;

import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;

import static com.rnchess.LineCheckUtils.ConstantValue.BASE_URL_1_IP;
import static com.rnchess.LineCheckUtils.ConstantValue.BASE_URL_2_IP;
import static com.rnchess.LineCheckUtils.ConstantValue.BASE_URL_3_IP;
import static com.rnchess.LineCheckUtils.LineProgressString.CODE_001;
import static com.rnchess.LineCheckUtils.LineProgressString.CODE_002;
import static com.rnchess.LineCheckUtils.LineProgressString.CODE_003;
import static com.rnchess.LineCheckUtils.LineProgressString.LINE_RESULT_CHECK_IP_UNPASS;
import static com.rnchess.LineCheckUtils.LineProgressString.LINE_RESULT_GET_ALIYUN_FAILURE;
import static com.rnchess.LineCheckUtils.LineProgressString.LINE_RESULT_GET_FAILURE;
import static com.rnchess.LineCheckUtils.LineProgressString.LINE_RESULT_RETURN_EMPTY;
import static com.rnchess.LineCheckUtils.LineProgressString.LINE_RESULT_RETURN_EXCEPTION;
import static com.rnchess.LineCheckUtils.LineProgressString.LINE_RESULT_RETURN_IPS_EMPTY;


/**
 * 线路选择工具类
 * Created by witty on 18-10-27.
 */

public class LineHelperUtil {
    public static String appCode = "";
    public static String sid = "";

    public static final String TAG = "LineHelperUtil  ";
    public static final int progress_finish_GetBaseLine = 20;//获取线路服务器 分配量
    public static final int progress_on_GettingLine = 19;//正在拉取线路 分配量
    public static final int progress_start_CheckDomain = 40;//检测域名确定端口---开始
    public static final int progress_finish_CheckDomain = 50;//检测域名确定端口---结束
    public static final int progress_finish_CheckLine = 100;//检测域名---结束

    public static final int DEFAULT_TIMEOUT_SECONDS = 5;
    public static final int DEFAULT_READ_TIMEOUT_SECONDS = 15;
    public static final int DEFAULT_WRITE_TIMEOUT_SECONDS = 15;


    private final Context mContext;
    private StringBuffer mDomains = new StringBuffer();//错误的域名集合
    private StringBuffer mIps = new StringBuffer();//错误的ip集合
    private StringBuffer mErrorMessages = new StringBuffer();//错误的msg集合
    private StringBuffer mCodes = new StringBuffer();//错误的code集合

    private String mark; //上传错误信息时的辨认值

    private String MODE_HTTPS_VALUE = "https://";
    private String MODE_HTTP_VALUE = "http://";
    private String MODE_PORT_8989_VALUE = ":8989";
    private String MODE_PORT_8787_VALUE = ":8787";

    private List<Call> mDoCheckLineList = new ArrayList<>();
    //  装入域名，ip，请求花费时间 状态
    private List<LineBean> LineList = new ArrayList<>();
    private int mTotalLines = 0;
    private long interval = 60 * 1000 * 60 * 24;
    private LineTaskProgressListener mLineTaskProgressListener;
    private String mAliPlayUrl;//阿里云服务器
    private String mBossUrl;//boss线路服务器
    private String mBossHost;//某boss服务器的host  为空的话  都是走默认boss域名获取线路的
    private String mLineJson;//当前操作中返回的线路json串
    private int mErrorCount = 0;
    private LineErrorDialogBean mLineErrorDialogBean = new LineErrorDialogBean();
    private List<String> list1;//阿里云服务器线路
    private List<String> list2;//boss服务器线路
    private boolean fastestOk = true;
    private boolean startProgress = true;

    public LineHelperUtil(Context context) {
        mContext = context;
        startProgress = true;
        String currentTime = System.currentTimeMillis() + "";
        mark = currentTime.substring(currentTime.length() - 6);


        list1 = Arrays.asList(new String[]{BASE_URL_1_IP, BASE_URL_2_IP, BASE_URL_3_IP});
        Collections.shuffle(list1);
        //随机取一条
        mAliPlayUrl = list1.get(0);//阿里云服务器


        list2 = Arrays.asList(ConstantValue.fecthUrl);
        Collections.shuffle(list2);
        //随机取一条
        mBossUrl = list2.get(0);//boss服务器

    }


    public void setLineTaskProgressListener(LineTaskProgressListener lineTaskProgressListener) {
        mLineTaskProgressListener = lineTaskProgressListener;
    }

    /**
     * 检测sp线路
     */
    public void checkSp(String code, String sid) {
        Collections.shuffle(list1);
        Collections.shuffle(list2);
        this.appCode = code;
        this.sid = sid;
        startProgress = true;
        mTotalLines = 0;
        mDoCheckLineList.clear();
        LineList.clear();
        mErrorCount = 0;
        // 取出本地域名线路
        String spDomain = SharePreferenceUtil.getDomain(mContext);
        String spIp = SharePreferenceUtil.getIp(mContext);
        long time = SharePreferenceUtil.getTime(mContext);
        long currentTime = System.currentTimeMillis();
        mLineJson = SharePreferenceUtil.getBossIpDomain(mContext);
        Log.e(TAG, "sp中的缓存IP列表: " + mLineJson);
        if (TextUtils.isEmpty(spDomain) || TextUtils.isEmpty(spIp) || TextUtils.isEmpty(mLineJson)) {
            getLinesFromBossServer("", 0, 0, "", true, 0);
        } else if (currentTime - time > interval) {//超过24小时
            getLinesFromBossServer("", 0, 0, "", true, 0);
        } else {
            //   Log.e(TAG, "sp中的最佳线路: domain: " + spDomain + "  ip: " + spIp);
            String ipArray = SharePreferenceUtil.getBossIpDomain(mContext);
            //  Log.e(TAG, "sp中的缓存IP列表: " + ipArray);
            callBackProgress(progress_finish_CheckDomain);
            doCheckIp(true, spDomain, spIp, "");
        }
    }

    /**
     * 从默认的boss服务器 获取线路列表
     */

    public synchronized void getLinesFromBossServer(String json_ips, int index, int timeIndex, String host, boolean isFromBoss, int aliInex) {
        if (timeIndex == 0) {
            mBossUrl = list2.get(index);//boss服务器
        } else {
            mBossUrl = list2.get(index) + "&time=" + timeIndex;//boss服务器
        }
        Log.e(TAG, "从默认 " + mBossUrl + " 获取线路");
        getLinesFromSever(host, mBossUrl, json_ips, isFromBoss, timeIndex, index, aliInex);

    }


    /**
     * 从阿里云获取线路服务器列表
     */
    private synchronized void getUrlFromAliplay(String json_ips, final int index) {
        callBackProgress(0);
        mDoCheckLineList.clear();
        //  LineList.clear();
        mBossHost = "";

        OkHttpClient.Builder builder = new OkHttpClient.Builder();
        builder.connectTimeout(DEFAULT_TIMEOUT_SECONDS, TimeUnit.SECONDS)
                .readTimeout(DEFAULT_READ_TIMEOUT_SECONDS, TimeUnit.SECONDS)
                .writeTimeout(DEFAULT_WRITE_TIMEOUT_SECONDS, TimeUnit.SECONDS)
                .retryOnConnectionFailure(false);//失败重连
        Request request = new Request.Builder().url(list1.get(index)).get().build();
        builder.build().newCall(request).enqueue(new Callback() {
            @Override
            public void onFailure(Call call, IOException e) {
                Log.e(TAG, "getUrlFromAliplay onFailure  " + e.getMessage() + "url----------->" + list1.get(index));
                callBackProgress(progress_finish_GetBaseLine);
                nextAlipayLine(index);
                errorPrompt(e.getMessage());
                callBackErrorSimpleReason(LINE_RESULT_GET_ALIYUN_FAILURE);
                if (index == list2.size() - 1) {
                    callBackComplexReason(CODE_001);
                }
            }

            @Override
            public void onResponse(Call call, Response response) throws IOException {
                Log.e(TAG, "getUrlFromAliplay success  " + "url----------->" + list1.get(index));
                callBackProgress(progress_finish_GetBaseLine);
                Log.e(TAG, "getUrlFromAliplay success  " + "code----------->" + response.code());
                if (response.code() == 200) {
                    String json = response.body().string();
                    if (!TextUtils.isEmpty(json)) {
                        Log.e(TAG, "BossUrlJson :" + json);
                        Gson gson = new Gson();
                        BaseLineBean baseLineBean = gson.fromJson(json, BaseLineBean.class);
                        // BaseLineBean baseLineBean = FastJsonUtils.toBean(json, BaseLineBean.class);
                        String host = baseLineBean.getHost();
                        List<String> ips = baseLineBean.getIps();
                        if (null != ips && ips.size() > 0) {
                            List<String> urls = new ArrayList<>();
                            for (String ip : ips) {
                                urls.add("https://" + ip + ":1344/boss-api/app/line.html");
                            }
                            mBossHost = host;
                            list2 = urls;
                        }
                        getLinesFromBossServer("", 0, 0, mBossHost, false, index);
                    } else {
                        if (index == list2.size() - 1) {
                            callBackComplexReason(CODE_001);
                        }
                        nextAlipayLine(index);
                        callBackErrorSimpleReason(LINE_RESULT_GET_ALIYUN_FAILURE);
                    }
                } else {
                    if (index == list2.size() - 1) {
                        callBackComplexReason(CODE_001);
                    }
                    nextAlipayLine(index);
                    callBackErrorSimpleReason(LINE_RESULT_GET_ALIYUN_FAILURE);
                }

            }
        });
    }

    private void nextAlipayLine(int index) {
        for (int i = 0; i < list1.size(); i++) {
            if (list1.get(i).equals(list1.get(index))) {
                if (i != list1.size() - 1) {
                    getUrlFromAliplay("", i + 1);
                }
                break;
            }
        }
    }

    /**
     * 从某线路服务器 获取线路列表
     */
    private void getLinesFromSever(String host, final String url, String json_ips, final boolean isFromBoss, final int timeIndex, final int index, final int aliInex) {

        if (TextUtils.isEmpty(json_ips)) {
            json_ips = "ips";
        }
        callBackProgress(progress_finish_GetBaseLine);

        OkHttpClient.Builder builder = new OkHttpClient.Builder();
        builder.connectTimeout(DEFAULT_TIMEOUT_SECONDS, TimeUnit.SECONDS)
                .readTimeout(DEFAULT_READ_TIMEOUT_SECONDS, TimeUnit.SECONDS)
                .writeTimeout(DEFAULT_WRITE_TIMEOUT_SECONDS, TimeUnit.SECONDS)
                .retryOnConnectionFailure(false);//失败重连
        builder.sslSocketFactory(SSLUtil.createSSLSocketFactory(), new SSLUtil.TrustAllManager())
                .hostnameVerifier(new SSLUtil.TrustAllHostnameVerifier());

        String parm_code = "code=" + appCode;
        String parm_sid = "s=" + sid;
        String parm_type = "type=" + json_ips;

        String parms = "?" + parm_code + "&" + parm_sid + "&" + parm_type;
        Request request;

        if (TextUtils.isEmpty(host)) {
            request = new Request.Builder().url(url + parms).get().build();
        } else {
            Log.e(TAG, "\n mBossHost: " + host);
            Log.e(TAG, "\n mBossUrl: " + url + parms);
            request = new Request.Builder().url(url + parms).get().addHeader("Host", host).build();
        }

        final String finalJson_ips = json_ips;
        builder.build().newCall(request).enqueue(new Callback() {
            @Override
            public void onFailure(Call call, IOException e) {
                Log.e(TAG, "获取线路 onFailure: " + e.getMessage() + "   url--->" + url);
                nextLine(url, timeIndex, isFromBoss, finalJson_ips, aliInex);
                callBackProgress(progress_finish_GetBaseLine + progress_on_GettingLine);
                callBackErrorSimpleReason(LINE_RESULT_GET_FAILURE);
                errorPrompt(e.getMessage());
                if (!isFromBoss) {
                    if (list2.size() - 1 == index) {
                        callBackComplexReason(CODE_002);
                    }
                }
            }

            @Override
            public void onResponse(Call call, Response response) throws IOException {
                praseAndCheckAll(response, isFromBoss, finalJson_ips, url, timeIndex, index, aliInex);
            }
        });
    }

    private void nextLine(String url, int timeIndex, boolean isFromBoss, String finalJson_ips, int aliIndex) {
        for (int i = 0; i < list2.size(); i++) {
            String currentUrl = list2.get(i);
        /*    if (url.contains("&time=")) {
                currentUrl = currentUrl + "&time=" + timeIndex;
                if (currentUrl.equals(url)) {
                    for (int j = 1; j < 4; j++) {
                        if (timeIndex == j) {
                            if (timeIndex != 3) {
                                getLinesFromBossServer("", i, timeIndex + 1, "", true, aliIndex);
                            } else {
                                if (i + 1 <= list2.size() - 1) {
                                    getLinesFromBossServer("", i + 1, 1, "", true, aliIndex);
                                }
                            }
                            break;
                        }
                    }

                    break;
                }
            } else*/
            {
                if (currentUrl.equals(url)) {
                    if (i != list2.size() - 1) {
                        getLinesFromBossServer("", i + 1, 0, "", isFromBoss, aliIndex);
                    } else {
                        if (isFromBoss) {
                            getUrlFromAliplay(finalJson_ips, aliIndex);
                        }
                        return;
                    }
                    break;
                }
            }

        }
    }

    /**
     * 解析和开启循环检查
     *
     * @param response
     */
    private void praseAndCheckAll(Response response, boolean isFromBoss, String json_ips, String url, int timeIndex, int index, int aliIndex) {

        callBackProgress(progress_finish_GetBaseLine + progress_on_GettingLine);
        if (200 != response.code()) {
            Log.e(TAG, "code不是200  onFailure  " + "url----------->" + url);
            Log.e(TAG, "从默认boss 获取线路 onFailure: code 不是200 是"+response.code());
            nextLine(url, timeIndex, isFromBoss, json_ips, aliIndex);
            if (!isFromBoss) {
                if (list2.size() - 1 == index) {
                    callBackComplexReason(CODE_002);
                }
            }
            return;
        }

        String data = "";
        try {
            data = response.body().string();
            Log.e(TAG, "获取线路 success:" + data);
        } catch (IOException e) {
            e.printStackTrace();
        }

        if (TextUtils.isEmpty(data)) {
            callBackErrorSimpleReason(LINE_RESULT_RETURN_EMPTY);
            return;
        }
        try {
            Gson gson = new Gson();
            Lines lines = gson.fromJson(data, Lines.class);
            if (lines == null || TextUtils.isEmpty(lines.getDomain())) {
                callBackErrorSimpleReason(LINE_RESULT_RETURN_EMPTY);
                return;
            }
            if (lines.getIps() == null || lines.getIps().size() == 0) {
                callBackErrorSimpleReason(LINE_RESULT_RETURN_IPS_EMPTY);
                return;
            }
            mLineJson = data;
            mTotalLines = 0;
            for (String ip : lines.getIps()) {
                if (!ip.isEmpty()) {
                    mTotalLines += 1;
                }
            }
            mTotalLines *= 4;
            SharePreferenceUtil.saveisStartBestLineService(mContext, lines.getIps().size() > 1);
            callBackProgress(progress_start_CheckDomain);

            for (String ip : lines.getIps()) {
                if (!ip.isEmpty()) {
                    String ip_all = MODE_HTTPS_VALUE + ip + MODE_PORT_8989_VALUE;
                    doCheckIp(false, lines.getDomain(), ip_all, url);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
            callBackErrorSimpleReason(LINE_RESULT_RETURN_EXCEPTION);
            // callBackComplexReason(CODE_002);
        }
    }


    /**
     * 确定端口
     * 检测ip
     */
    private void doCheckIp(final boolean isSpCheck, final String domain, final String ip_all, final String parentUrl) {
        final String[] url = {ip_all + "/__check"};
        OkHttpClient.Builder builder = new OkHttpClient.Builder()
                .sslSocketFactory(new TlsSniSocketFactory(domain), new SSLUtil.TrustAllManager())
                .hostnameVerifier(new TrueHostnameVerifier(domain))
                .connectTimeout(3, TimeUnit.SECONDS)
                .retryOnConnectionFailure(false);
        builder.readTimeout(DEFAULT_READ_TIMEOUT_SECONDS, TimeUnit.SECONDS)
                .writeTimeout(DEFAULT_WRITE_TIMEOUT_SECONDS, TimeUnit.SECONDS);

        Request request = new Request.Builder()
                .url(url[0])
                .get()
                .addHeader("Host", domain)
                .addHeader("Connection", "close")
                .build();
        Call call = builder.build().newCall(request);
        mDoCheckLineList.add(call);
        final long startTime = System.currentTimeMillis();
        call.enqueue(new Callback() {
            @Override
            public void onFailure(Call call, IOException e) {
                Log.e(TAG, ip_all + " check onFailure: " + e.getLocalizedMessage());
                appendErrorLine(domain, url[0], url[0] + " " + e.getMessage(), ip_all);
                errorPrompt(e.getMessage());
                if (!isSpCheck) {
                    setCheckIpPort(url[0], isSpCheck, domain, parentUrl);
                } else {
                    isSpNextIpCheck();
                }
                callBackProgress(progress_finish_CheckDomain);
                long time = System.currentTimeMillis() - startTime;
                solveLines(isSpCheck, domain, ip_all, time, 1, parentUrl);
            }

            @Override
            public void onResponse(Call call, Response response) {
                String code = getStatusCode(response);
                Log.e(TAG, "检测ip onResponse  code " + code);
                long time = System.currentTimeMillis() - startTime;
                if (CodeEnum.OK.getCode().equals(code)) {
                    Log.e(TAG, "检测ip onResponse  OK--> ip =  " + url[0]);
                    solveLines(isSpCheck, domain, ip_all, time, 2, parentUrl);
                } else {//这里要考虑都出错走这里应该
                    solveLines(isSpCheck, domain, ip_all, time, 1, parentUrl);
                    appendErrorLine(domain, url[0], "能check通，但是response.message() 不是OK", code);
                    Log.e(TAG, "检测ip  onResponse = " + response);
                }
                if (!isSpCheck) {
                    setCheckIpPort(url[0], isSpCheck, domain, parentUrl);
                }
            }
        });
    }

    /**
     * 存储
     *
     * @param domain
     * @param ip
     */

    private void setDomainAndIp(String domain, String ip, String parentUrl, String mJson) {
        SharePreferenceUtil.saveDomain(mContext, domain);
        SharePreferenceUtil.saveIp(mContext, ip);
        SharePreferenceUtil.saveTime(mContext, System.currentTimeMillis());
        SharePreferenceUtil.saveBossDomain(mContext, parentUrl);
        SharePreferenceUtil.saveBossIpDomain(mContext, mJson);
        DataCenter.getInstance().setDomain(domain);
        DataCenter.getInstance().setIp(ip);


        String shareDomin = SharePreferenceUtil.getDomain(mContext);
        String shareIp = SharePreferenceUtil.getIp(mContext);
        Log.e(TAG, "目前使用的线路 *******domain: " + domain + " ip: " + ip);
        Log.e(TAG, "目前使用的取出线路 *******domain: " + shareDomin + " ip: " + shareIp);

    }

    /**
     * 成功获取到线路后
     *
     * @param domain
     * @param ip
     */
    private void afterGetLineSuccess(String domain, String ip, String parentUrl) {
        if (TextUtils.isEmpty(domain) || TextUtils.isEmpty(ip)) {
            callBackErrorSimpleReason(LINE_RESULT_RETURN_EXCEPTION);
            // callBackComplexReason(CODE_002);
            fastestOk = true;
            return;
        }
        setDomainAndIp(domain, ip, parentUrl, mLineJson);

        if (mLineTaskProgressListener != null) {
            callBackProgress(progress_finish_CheckLine);
           /* String httpType = "http";
            if(ip.contains("https")){
                httpType = "https";
            }*/

            //  String mUriStr = ip;
            String httpType = "";
            String ipNumble = "";
            String port = "";

            String sp = "://";
            String[] httpTypes = ip.split(sp);
            httpType = httpTypes[0];
            if (httpTypes[1].contains(":")) {
                String[] ports = httpTypes[1].split(":");
                ipNumble = ports[0];
                port = ports[1];
            } else {
                ipNumble = httpTypes[1];
            }
            mLineTaskProgressListener.onSpalshGetLineSuccess(ipNumble, port, httpType, domain);
            startProgress = false;
        }

    }


    /**
     * 向外回调进度
     *
     * @param progress
     */
    private void callBackProgress(int progress) {
        if (mLineTaskProgressListener != null && startProgress) {
            Log.e(TAG, "progress" + progress);
            mLineTaskProgressListener.onProgressBarChange(progress, 100);
        }
    }

    /**
     * 向外简单错误原因
     *
     * @param msg
     */
    private void callBackErrorSimpleReason(String msg) {
        if (mLineTaskProgressListener != null) {
            mLineTaskProgressListener.onErrorSimpleReason(msg);
        }
    }

    /**
     * 向外回调错误 bean
     *
     * @param code
     */
    private void callBackComplexReason(String code) {
        Log.e(TAG, "callBackComplexReason 报状态码------>" + code);
        SharePreferenceUtil.clear(mContext);
        if (mLineTaskProgressListener != null) {
            mLineErrorDialogBean.setCode(code);
            mLineTaskProgressListener.onErrorComplexReason(mLineErrorDialogBean);
        }
    }

    /**
     * 收集错误域名的信息
     *
     * @param domain
     * @param ip
     * @param errMsg
     * @param errCode
     */
    private void appendErrorLine(String domain, String ip, String errMsg, String errCode) {
        if (mDomains.length() == 0) {
            mDomains.append(domain);
        } else {
            mDomains.append(";" + domain);
        }

        if (mIps.length() == 0) {
            mIps.append(ip);
        } else {
            mIps.append(";" + ip);
        }

        if (mErrorMessages.length() == 0) {
            mErrorMessages.append(errMsg);
        } else {
            mErrorMessages.append(";" + errMsg);
        }

        if (mCodes.length() == 0) {
            mCodes.append(errCode);
        } else {
            mCodes.append(";" + errCode);
        }
    }

    /**
     * 根据头部信息获取请求状态
     */
    public static String getStatusCode(Response response) {
        if (response.priorResponse() != null) {
            String headerStatus = response.priorResponse().header("headerStatus");
            if (LineHelperUtil.CodeEnum.DUE.getCode().equals(headerStatus)) {
                return LineHelperUtil.CodeEnum.DUE.getCode().trim();

            } else if (LineHelperUtil.CodeEnum.Guo.getCode().equals(headerStatus)) {
                return LineHelperUtil.CodeEnum.Guo.getCode().trim();
            }
        }

        if (response.code() != 200) {
            return "";
        }
//        return response.message();
        try {
            return response.body().string().trim().toUpperCase();
        } catch (IOException e) {
            return "";
        }
    }


    public void upLoadErrorInfo() {
        for (Call call : mDoCheckLineList) {
            if (call != null && !call.isCanceled()) {
                call.cancel();
            }
        }
        Log.e(TAG, "上传报错--->" + mDomains.toString() + "mIps.toString()---->" + mIps.toString() + " mCodes.toString()--->" + mCodes.toString() + "mark---->" + mark);
        UploadErrorLinesUtil.upload(mDomains.toString(), mIps.toString(), mErrorMessages.toString(), mCodes.toString(), mark);
    }


    /**
     * 网络请求异常提示
     *
     * @param msg
     */
    private void errorPrompt(String msg) {
        if (TextUtils.isEmpty(msg)) {
            return;
        }
        if (msg.contains("Failed to connect to") || msg.contains("associated")) {
            if (NetTool.isConnected(mContext)) {
                if (mLineTaskProgressListener != null) {
                    mLineTaskProgressListener.onErrorSimpleReason(LINE_RESULT_GET_FAILURE);
                }
            } else {
                if (mLineTaskProgressListener != null) {
                    mLineTaskProgressListener.onErrorSimpleReason("网络不可用，请检查网络设置");
                }
            }
        }
    }


    /**
     * 错误代码
     * Created by fei on 17-7-29.
     */
    public enum CodeEnum {
        OK("OK", "请求正确"),
        SUCCESS("200", "请求成功"),
        S_DUE("600", "Session过期"),
        S_KICK_OUT("606", "Session过期"),
        DUE("604", "域名过期"),
        Guo("309", "国内访问"),
        Domain_error("603", "域名错误");

        private String code;
        private String name;

        CodeEnum(String code, String name) {
            this.code = code;
            this.name = name;
        }

        public String getCode() {
            return code;
        }

        public void setCode(String code) {
            this.code = code;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }
    }

    /**
     * 处理所检测过的线路
     *
     * @param isSpCheck
     * @param domain
     * @param ip
     * @param time
     * @param state
     */

    private synchronized void solveLines(boolean isSpCheck, String domain, String ip, long time, int state, String prarentUrl) {
        if (!isSpCheck) {
            LineList.add(new LineBean(domain, ip, time, state));
        }
        if (2 == state) {//以最先到达的为准
            if (fastestOk) {
                fastestOk = false;
                afterGetLineSuccess(domain, ip, prarentUrl);
            }
            return;
        }
        Log.e(TAG, "mTotalLines " + mTotalLines);
        if (mTotalLines == LineList.size()) { // 最后一个检查到齐
            Log.e(TAG, mTotalLines + " /" + LineList.size());
            callBackProgress(progress_finish_CheckDomain);
            Collections.sort(LineList);
            int count = LineList.size();
            int errCount = 0;
            for (int i = 0; i < count; i++) {
                LineBean bean = LineList.get(i);
                int state2 = bean.getState();
                if (2 == state2) {
                } else {
                    errCount++;
                }
            }
            //todo 上傳崩潰
            //    upLoadErrorInfo();
            Log.e(TAG, "errCount " + errCount);
            if (errCount == mTotalLines) {
                callBackProgress(progress_finish_CheckDomain + (progress_finish_CheckLine - progress_finish_CheckDomain) / 2);
                callBackErrorSimpleReason(LINE_RESULT_CHECK_IP_UNPASS);
                callBackComplexReason(CODE_003);

                if (mTotalLines == 40) {

                }
            }
        }
    }


    private void setCheckIpPort(String url, boolean isSpCheck, String domain, String parentUrl) {
        if (url.contains(MODE_HTTPS_VALUE) && url.contains(MODE_PORT_8989_VALUE)) {
            url = url.replace(MODE_HTTPS_VALUE, MODE_HTTP_VALUE);
            url = url.replace(MODE_PORT_8989_VALUE, "");
            url = url + MODE_PORT_8787_VALUE;
            url = url.replace("/__check", "");
            doCheckIp(isSpCheck, domain, url, parentUrl);
            return;
        } else if (url.contains(MODE_HTTPS_VALUE)) {
            url = url.replace(MODE_HTTPS_VALUE, MODE_HTTP_VALUE);
            url = url.replace("/__check", "");
            doCheckIp(isSpCheck, domain, url, parentUrl);
            return;
        } else if (url.contains(MODE_HTTP_VALUE) && url.contains(MODE_PORT_8787_VALUE)) {
            url = url.replace(MODE_HTTP_VALUE, MODE_HTTPS_VALUE);
            url = url.replace(MODE_PORT_8787_VALUE, "");
            url = url.replace("/__check", "");
            doCheckIp(isSpCheck, domain, url, parentUrl);
            return;
        }
    }


    private void isSpNextIpCheck() {
        try {
            String data = SharePreferenceUtil.getBossIpDomain(mContext);
            Log.e(TAG, "缓存的data-->" + data);
            Gson gson = new Gson();
            Lines lines = gson.fromJson(data, Lines.class);
            mLineJson = data;
            mTotalLines = 0;

            for (String ip : lines.getIps()) {
                if (!ip.isEmpty()) {
                    mTotalLines += 1;
                }
            }
            mTotalLines *= 4;
            // SharePreferenceUtil.saveisStartBestLineService(mContext, lines.getIps().size() > 1);
            callBackProgress(progress_start_CheckDomain);
            for (String ip : lines.getIps()) {
                if (!ip.isEmpty()) {
                    String ip_all = MODE_HTTPS_VALUE + ip + MODE_PORT_8989_VALUE;
                    String parentUlr = SharePreferenceUtil.getBossIpDomain(mContext);
                    doCheckIp(false, lines.getDomain(), ip_all, parentUlr);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
            callBackErrorSimpleReason(LINE_RESULT_RETURN_EXCEPTION);
            // callBackComplexReason(CODE_002);
        }
    }

}
