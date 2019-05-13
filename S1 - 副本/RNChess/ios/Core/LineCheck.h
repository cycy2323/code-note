//
//  LineCheck.h
//  GBLineCheckCore
//
//  Created by shin on 2018/10/18.
//  Copyright © 2018年 shin. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "LCHeader.h"

@interface LineCheck : NSObject

+ (instancetype)sharedManager;

- (void)startLineCheck:(NSDictionary *)siteParameter progress:(LCProgress)progress complete:(LCComplete)complete failed:(LCFailed)failed;

@end
