package com.rnchess.LineCheckUtils;



/**
 * Created by witty on 18-10-27.
 * SpashAcitivity的线路任务UI回调器
 */
public interface LineTaskProgressListener {

    void onProgressBarChange(int current, int max);

    void onErrorSimpleReason(String result);

    void onErrorComplexReason(LineErrorDialogBean lineErrorDialogBean);

    void onSpalshGetLineSuccess(String ip,String port,String httpType,String host);
}
