package com.rnchess;

import android.app.Application;
import android.content.Context;
import android.content.res.AssetManager;
import android.util.Log;

import com.facebook.react.ReactApplication;
import com.google.gson.Gson;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.airbnb.android.react.lottie.LottiePackage;
import com.microsoft.codepush.react.CodePush;
import com.dylanvann.fastimage.FastImageViewPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.rnchess.LineCheckUtils.SitesConfigBean;
import com.tendcloud.tenddata.TCAgent;
import com.zmxv.RNSound.RNSoundPackage;
import com.ninty.system.setting.SystemSettingPackage;
import com.rnfs.RNFSPackage;
import com.github.yamill.orientation.OrientationPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.rnchess.AndroidNativeNetModulePackage;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.Arrays;
import java.util.List;

import com.github.wumke.RNExitApp.RNExitAppPackage;

import cn.jpush.reactnativejpush.JPushPackage;

import com.talkingdata.appanalytics.TalkingDataPackage;

public class MainApplication extends Application implements ReactApplication {
    private static Context context;
    // 设置为 true 将不会弹出 toast
    private boolean SHUTDOWN_TOAST = true;
    // 设置为 true 将不会打印 log
    private boolean SHUTDOWN_LOG = true;


    private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {

        @Override
        protected String getJSBundleFile() {
            return CodePush.getJSBundleFile();
        }

        @Override
        public boolean getUseDeveloperSupport() {
            return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
            return Arrays.<ReactPackage>asList(
                    new MainReactPackage(),
                    new JPushPackage(SHUTDOWN_TOAST, SHUTDOWN_LOG),
                    new RNDeviceInfo(),
                    new LottiePackage(),
new CodePush("y12bH6HWcB0uL3HaJkT-0gc__DP6Syts-yTCQ", getApplicationContext(), BuildConfig.DEBUG),//Staging
                    new FastImageViewPackage(),
                    new RNFetchBlobPackage(),
                    new RNSoundPackage(),
                    new SystemSettingPackage(),
                    new RNFSPackage(),
                    new OrientationPackage(),
                    new RNExitAppPackage(),
                    new AndroidNativeNetModulePackage(),
                    new TalkingDataPackage()
            );
        }

        @Override
        protected String getJSMainModuleName() {
            return "index";
        }
    };

    @Override
    public ReactNativeHost getReactNativeHost() {
        return mReactNativeHost;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        SoLoader.init(this, /* native exopackage */ false);
        context = getApplicationContext();

        SitesConfigBean sitesConfigBean = readSitesConfig("sitesConfig/sitesConfig.json");
        TCAgent.init(this, "4520AD85D8B140359798CEB00F8F9E43", sitesConfigBean.recommendUserInputCode.equals("") ? sitesConfigBean.sid : sitesConfigBean.sid + ":" + sitesConfigBean.recommendUserInputCode);
        TCAgent.setReportUncaughtExceptions(true);
    }


    /**
     * 获取全局上下文
     */
    public static Context getContext() {
        return context;
    }

    /**
     * 获取站点参数
     *
     * @param fileName
     * @return
     */
    public SitesConfigBean readSitesConfig(String fileName) {
        //将json数据变成字符串
        StringBuilder stringBuilder = new StringBuilder();
        try {
            //获取assets资源管理器
            AssetManager assetManager = context.getAssets();
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
