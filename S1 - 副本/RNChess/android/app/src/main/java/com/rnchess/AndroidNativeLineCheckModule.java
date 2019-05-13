package com.rnchess;

import android.content.res.AssetManager;
import android.util.Log;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.google.gson.Gson;
import com.rnchess.LineCheckUtils.LineErrorDialogBean;
import com.rnchess.LineCheckUtils.LineHelperUtil;
import com.rnchess.LineCheckUtils.LineTaskProgressListener;
import com.rnchess.LineCheckUtils.SitesConfigBean;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

public class AndroidNativeLineCheckModule extends ReactContextBaseJavaModule {
    ReactContext mContext = null;

    public AndroidNativeLineCheckModule(ReactApplicationContext reactContext) {
        super(reactContext);
        mContext = reactContext;
    }

    @Override
    public String getName() {
        return "RNLineCheckManager";
    }
    
    @ReactMethod
    public void startLineCheck()
    {
        SitesConfigBean sitesConfigBean = readSitesConfig("sitesConfig/sitesConfig.json");

        String code = sitesConfigBean.getCode();
        String s = sitesConfigBean.getS();
        Log.e("LineHelperUtil ", "传入app site参数:" + code + " " + s);

        LineHelperUtil mHelperUtil = new LineHelperUtil(MainApplication.getContext());
        mHelperUtil.checkSp(code,s);
        mHelperUtil.setLineTaskProgressListener(new LineTaskProgressListener() {
            @Override
            public void onProgressBarChange(final int current, int max) {
                Log.e("LineHelperUtil ", "进度:" + (float)current/(float)max);
                mContext
                        .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                        .emit("RNLineCheckProgress", (float)current/(float)max);
            }

            @Override
            public void onErrorSimpleReason(String result) {
                //空实现
            }

            @Override
            public void onErrorComplexReason(final LineErrorDialogBean lineErrorDialogBean) {
                Log.e("LineHelperUtil ", "線路檢測失敗 code" + lineErrorDialogBean.getCode());
                mContext
                        .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                        .emit("RNLineCheckFailed", Integer.parseInt(lineErrorDialogBean.getCode()));
            }

            @Override
            public void onSpalshGetLineSuccess(String ip, String port, String httpType, String host) {
                Log.e("LineHelperUtil ", "線路檢測成功：" + httpType +" " +ip+" "+port+" "+host);

                SitesConfigBean sitesConfig = readSitesConfig("sitesConfig/sitesConfig.json");

                WritableMap params = Arguments.createMap();
                params.putString("currentIP",ip);
                params.putString("currentHttpType",httpType);
                params.putString("currentPort",port);
                params.putString("currentPreUrl",port == "" ? httpType+"://"+ip : httpType+"://"+ip+":"+port);
                params.putString("currentHost",host);
                params.putString("siteId",sitesConfig.getSid());
                params.putString("siteCode",sitesConfig.getCode());
                params.putString("siteS",sitesConfig.getS());
                params.putString("siteRecommendUserInputCode",sitesConfig.getRecommendUserInputCode());
                params.putString("siteJpushAppkey",sitesConfig.getJpushAppkey());

                mContext
                        .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                        .emit("RNLineCheckComplete", params);
            }
        });
    }

    public SitesConfigBean readSitesConfig(String fileName) {
        //将json数据变成字符串
        StringBuilder stringBuilder = new StringBuilder();
        try {
            //获取assets资源管理器
            AssetManager assetManager = mContext.getAssets();
            //通过管理器打开文件并读取
            BufferedReader bf = new BufferedReader(new InputStreamReader(
                    assetManager.open(fileName)));
            String line;
            while ((line = bf.readLine()) != null) {
                stringBuilder.append(line);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }

        SitesConfigBean sitesConfigBean = new Gson().fromJson(stringBuilder.toString(), SitesConfigBean.class);

        return sitesConfigBean;
    }
}
