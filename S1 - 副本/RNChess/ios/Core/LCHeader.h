//
//  LCHeader.h
//  GBLineCheckCore
//
//  Created by shin on 2018/10/18.
//  Copyright © 2018年 shin. All rights reserved.
//

#ifndef LCHeader_h
#define LCHeader_h
#import <Foundation/Foundation.h>
#import "LCData.h"

typedef void(^LCNetWorkComplete)(NSHTTPURLResponse *httpURLResponse, id response);
typedef void(^LCNetWorkFailed)(NSHTTPURLResponse *httpURLResponse, NSString *err);
typedef void(^LCNetWorkCheckComplete)(BOOL ok);

typedef void(^LCProgress)(float progress);
typedef void(^LCComplete)(LCData *lineData);
typedef void(^LCFailed)(int errCode);
typedef void(^LCEachTurn)(void);
typedef void(^LCCheckIPComplete)(NSString *type,NSString *ip);
typedef void(^LCCheckIPFailed)(void);
typedef void(^LCCheckIPSComplete)(void);
typedef void(^LCCheckIPSFailed)(void);

typedef void (^LCFetchIPSFromBossApisComplete)(NSHTTPURLResponse *httpURLResponse, id response, NSString *availableBossApi, NSString *availableBossApiHost);
typedef void (^LCFetchIPSFromBossApisFailed)(void);

typedef void (^LCFetchBossApiComplete)(NSString *host,NSArray *bossApis);
typedef void (^LCFetchBossApiFailed)(void);

#endif /* LCHeader_h */
