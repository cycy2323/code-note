//
//  LineCheckNetCore.m
//  GBLineCheckCore
//
//  Created by shin on 2018/10/18.
//  Copyright © 2018年 shin. All rights reserved.
//

#import "LineCheckNetCore.h"
#import <AFNetworking/AFNetworking.h>
#import <AFNetworking/AFNetworkActivityIndicatorManager.h>

#define LC_DEFAULT_NETWORK_TIMEOUT 5.0 //线路检测的默认的超时秒数
#define LC_MAX_NETWORK_CONCURRENT 10 //最大http并发数

#define LC_CURRENT_APPVERSION [[[NSBundle mainBundle] infoDictionary] objectForKey:@"CFBundleShortVersionString"]
#define LC_CURRENT_APPBUILD [[[NSBundle mainBundle] infoDictionary] objectForKey:@"CFBundleVersion"]

static BOOL isNetworkingOK = YES;//网络状态 默认畅通

@implementation LineCheckNetCore

+ (AFHTTPSessionManager *)manager {
    __weak typeof(self) weakSelf = self;
    
    static AFHTTPSessionManager *manager = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        if (manager == nil) {
            [AFNetworkActivityIndicatorManager sharedManager].enabled = YES;
            manager = [AFHTTPSessionManager manager];
            manager.responseSerializer.acceptableContentTypes =
            [NSSet setWithArray:@[@"application/json",@"text/html",@"text/json",@"text/plain",@"text/javascript",@"text/xml",@"image/*",@"image/jpeg"]];
            manager.requestSerializer = [AFHTTPRequestSerializer serializer];
            manager.requestSerializer.stringEncoding = NSUTF8StringEncoding;
            manager.responseSerializer = [AFHTTPResponseSerializer serializer];
          
            manager.operationQueue.maxConcurrentOperationCount = LC_MAX_NETWORK_CONCURRENT;
            manager.securityPolicy.allowInvalidCertificates = YES;
            manager.securityPolicy.validatesDomainName = NO;

            //监控网络状态
            [weakSelf isNetWorkStatusOK:^(BOOL ok) {
                isNetworkingOK = ok;
            }];
        }
    });
    return manager;
}

+ (void)isNetWorkStatusOK:(LCNetWorkCheckComplete)complete
{
    AFNetworkReachabilityManager *reachabilityManager = [AFNetworkReachabilityManager sharedManager];
    [reachabilityManager startMonitoring];
    [reachabilityManager setReachabilityStatusChangeBlock:^(AFNetworkReachabilityStatus status) {
        if (status == AFNetworkReachabilityStatusUnknown || status == AFNetworkReachabilityStatusNotReachable) {
            //未知网络或无网络
            if (complete) {
                complete(NO);
            }
        }
        else
        {
            //网络通畅
            if (complete) {
                complete(YES);
            }
        }
    }];
}

+ (AFHTTPSessionManager *)configHTTPSessionManager:(NSDictionary *)header
{
    AFHTTPSessionManager *manager = [self manager];
    manager.requestSerializer = [AFJSONRequestSerializer new];
    // 设置超时时间
    [manager.requestSerializer willChangeValueForKey:@"timeoutInterval"];
    manager.requestSerializer.timeoutInterval = LC_DEFAULT_NETWORK_TIMEOUT;
    [manager.requestSerializer didChangeValueForKey:@"timeoutInterval"];
    //添加消息头
    //默认header
    NSString *user_agent = [NSString stringWithFormat:@"app_rn, %@.%@",LC_CURRENT_APPVERSION, LC_CURRENT_APPBUILD];
    [manager.requestSerializer setValue:user_agent forHTTPHeaderField:@"User-Agent"];
    if (header) {
        for (NSString *key in header.allKeys) {
            [manager.requestSerializer setValue:[header objectForKey:key] forHTTPHeaderField:key];
        }
    }
  
    return manager;
}

+ (NSMutableDictionary *)appendParameter:(NSDictionary *)parameter
{
    NSMutableDictionary *mParameter = [NSMutableDictionary dictionary];
    if (parameter) {
        [mParameter addEntriesFromDictionary:parameter];
    }
    return mParameter;
}

+ (id)translateResponseData:(NSData *)data
{
    NSError *error;
    NSDictionary *responseObject = [NSJSONSerialization JSONObjectWithData:data options:NSJSONReadingMutableContainers error:&error];
    if (responseObject == nil || error) {
        //不能转换成对象
        //转换为字符串
        NSString *responseString = [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding];
        if (responseString) {
            return responseString;
        }
        else
        {
            //字符串转换失败则直接返回data
            return data;
        }
    }
    else
    {
        //只记得转换为对象输出
        return responseObject;
    }
}

+ (void)get:(NSString *)url parameter:(NSDictionary *)parameter header:(NSDictionary *)header complete:(LCNetWorkComplete)complete failed:(LCNetWorkFailed)failed
{
    __weak typeof(self) weakSelf = self;
    if (isNetworkingOK) {
        //配置HTTPSessionManager
        AFHTTPSessionManager *manager = [self configHTTPSessionManager:header];
        
        //配置parameters
        NSMutableDictionary *mParameter = [self appendParameter:parameter];
        
        [manager GET:url parameters:mParameter progress:nil success:^(NSURLSessionDataTask * _Nonnull task, id  _Nullable responseObject) {
            //统一处理respones并回调
            id response = [weakSelf translateResponseData:responseObject];
            if (complete) {
                complete((NSHTTPURLResponse *)task.response, response);
            }
        } failure:^(NSURLSessionDataTask * _Nullable task, NSError * _Nonnull error) {
            if (failed) {
                failed((NSHTTPURLResponse *)task.response,error.description);
            }
        }];
    }
    else
    {
        if (failed) {
            failed(nil, @"网络链接失败");
        }
    }

}

+ (void)post:(NSString *)url parameter:(NSDictionary *)parameter header:(NSDictionary *)header complete:(LCNetWorkComplete)complete failed:(LCNetWorkFailed)failed
{}

@end
