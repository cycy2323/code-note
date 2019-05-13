package com.rnchess;

import android.util.Log;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.rnchess.UpDataUtils.UpdateTool;

import java.io.File;
import java.io.IOException;

public class AndroidUpdateModule extends ReactContextBaseJavaModule {
    ReactContext mContext = null;

    public AndroidUpdateModule(ReactApplicationContext reactContext) {
        super(reactContext);
        mContext = reactContext;
    }

    @Override
    public String getName() {
        return "AndroidUpdateModule";
    }
    
    @ReactMethod
    public void downloadApk(String url,String apkName)
    {
        UpdateTool.downloadApk(url,apkName,new UpdateTool.DownLoadCallBack(){

            @Override
            public void onBefore() {

            }

            @Override
            public void inProgress(int progress) {
                Log.e("SDSDAD", "回调下载进度：" + progress);
                mContext
                        .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                        .emit("RNDownLoadApkProgress", (float)progress/100.0);
        }

            @Override
            public void onSuccess(File response) throws IOException {
                UpdateTool.installApk(response, mContext);
            }

            @Override
            public void onError() {

            }
        });
    }

}
