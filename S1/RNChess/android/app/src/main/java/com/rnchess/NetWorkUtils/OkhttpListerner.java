package com.rnchess.NetWorkUtils;

import java.io.IOException;

import okhttp3.Call;
import okhttp3.Response;

public interface OkhttpListerner {

    void onFailure(Call call, IOException e);
    void onResponse(Call call,  Response response) throws Exception;
    void onException(Exception e);
}
