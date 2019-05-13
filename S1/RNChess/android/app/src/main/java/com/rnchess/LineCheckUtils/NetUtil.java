package com.rnchess.LineCheckUtils;
import android.support.annotation.NonNull;
import android.text.TextUtils;
import android.util.Log;
import com.rnchess.MainApplication;
import java.util.HashMap;
import java.util.Map;



/**
 * Created by witty on 18-10-3.
 */

public class NetUtil {

    static String https = "https://";
    static String http = "http://";
    static String port8989 = ":8989";
    static String port8787 = ":8787";


    /**
     * 剥离http/https和端口
     *
     * @param domain
     * @return
     */
    public static String leftOutHttpFromDomain(String domain) {
        if (TextUtils.isEmpty(domain)) {
            return "";
        }
        if (domain.contains(https)) {
            domain = domain.replace(https, "");
        } else if (domain.contains(http)) {
            domain = domain.replace(http, "");
        }

        if (domain.contains(port8989)) {
            domain = domain.replace(port8989, "");
        } else if (domain.contains(port8787)) {
            domain = domain.replace(port8787, "");
        }

        return domain;
    }


}
