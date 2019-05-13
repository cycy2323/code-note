//
//  IPsCacheManager.m
//  GBLineCheckCore
//
//  Created by shin on 2018/10/18.
//  Copyright © 2018年 shin. All rights reserved.
//

#import "IPsCacheManager.h"

#define GB_IPS_VALID_CACHE_TIME 1*24*60*60 //有效期一天

@implementation IPsCacheManager

+ (instancetype)sharedManager
{
    static IPsCacheManager *manager = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        if (manager == nil) {
            manager = [[IPsCacheManager alloc] init];
        }
    });
    return manager;
}

- (BOOL)isIPsValid:(NSString *)siteCode
{
    NSDictionary *ips = [self ips];
    if (ips != nil) {
        NSTimeInterval cachingTime = [[ips objectForKey:@"cachingTime"] doubleValue];
        NSTimeInterval currentTime = [[NSDate date] timeIntervalSince1970];
        
        NSString *code = [ips objectForKey:@"code"];
        if ([code isEqualToString:siteCode] && currentTime-cachingTime <= GB_IPS_VALID_CACHE_TIME) {
            //依然有效
            return YES;
        }
        else
        {
            //过期了
            return NO;
        }
    }
    
    //没有值 所以默认无效
    return NO;
}

- (NSDictionary *)ips
{
    NSDictionary *ipsCacheDic = [[NSUserDefaults standardUserDefaults] objectForKey:@"GB_IPS_CACHE_DATA"];
    return ipsCacheDic;
}

- (void)updateIPsList:(NSDictionary *)ips siteCode:(NSString *)siteCode
{
    if (ips != nil) {
        //记录当前时间戳
        NSTimeInterval cachingTime =  [[NSDate date] timeIntervalSince1970];
        NSDictionary *ipsCacheDic = @{
                                      @"ips":ips,
                                      @"cachingTime":@(cachingTime),
                                      @"code":siteCode
                                      };
        [[NSUserDefaults standardUserDefaults] setObject:ipsCacheDic forKey:@"GB_IPS_CACHE_DATA"];
        [[NSUserDefaults standardUserDefaults] synchronize];
    }
}

- (void)updateBossApi:(NSString *)bossApi host:(NSString *)host
{
  if (bossApi) {
    NSDictionary *bossApiInfo;
    if (host) {
      bossApiInfo = @{@"bossApi":bossApi,@"host":host};
    }
    else
    {
      bossApiInfo = @{@"bossApi":bossApi,@"host":@""};
    }
    [[NSUserDefaults standardUserDefaults] setObject:bossApiInfo forKey:@"GB_BOSSAPI_CACHE_DATA"];
    [[NSUserDefaults standardUserDefaults] synchronize];
  }
}

- (NSDictionary *)bossApiInfo
{
  NSDictionary *bossApiInfoCaches = [[NSUserDefaults standardUserDefaults] objectForKey:@"GB_BOSSAPI_CACHE_DATA"];
  
  return bossApiInfoCaches;
}

- (void)clearCaches
{
    [[NSUserDefaults standardUserDefaults] removeObjectForKey:@"GB_IPS_CACHE_DATA"];
    [[NSUserDefaults standardUserDefaults] synchronize];
}

@end
