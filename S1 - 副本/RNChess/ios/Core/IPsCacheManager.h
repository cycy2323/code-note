//
//  IPsCacheManager.h
//  GBLineCheckCore
//
//  Created by shin on 2018/10/18.
//  Copyright © 2018年 shin. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface IPsCacheManager : NSObject

+ (instancetype)sharedManager;

//缓存的IP是否还有效
- (BOOL)isIPsValid:(NSString *)siteCode;

//获取ip列表和域名
- (NSDictionary *)ips;

//更新ip列表和域名
- (void)updateIPsList:(NSDictionary *)ips siteCode:(NSString *)siteCode;

//更新bossApi和对应的host
- (void)updateBossApi:(NSString *)bossApi host:(NSString *)host;

//获取bossApi和host
- (NSDictionary *)bossApiInfo;

//清空IPS缓存
- (void)clearCaches;

@end
