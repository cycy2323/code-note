//
//  LCData.m
//  GBLineCheckCore
//
//  Created by shin on 2018/10/18.
//  Copyright © 2018年 shin. All rights reserved.
//

#import "LCData.h"

@implementation LCData

+ (instancetype)sharedManager
{
    static LCData *manager = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        if (manager == nil) {
            manager = [[LCData alloc] init];
        }
    });
    return manager;
}

- (id)init
{
    self = [super init];
    if (self) {
        self.currentIP = @"";
        self.currentHttpType = @"";
        self.currentPort = @"";
        self.currentPreUrl = @"";
        self.currentHost = @"";
    }
    return self;
}


@end
