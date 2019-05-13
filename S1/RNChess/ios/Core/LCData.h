//
//  LCData.h
//  GBLineCheckCore
//
//  Created by shin on 2018/10/18.
//  Copyright © 2018年 shin. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface LCData : NSObject

@property (nonatomic, strong) NSString *currentIP;
@property (nonatomic, strong) NSString *currentHttpType;
@property (nonatomic, strong) NSString *currentPort;
@property (nonatomic, strong) NSString *currentPreUrl;
@property (nonatomic, strong) NSString *currentHost;

+ (instancetype)sharedManager;

@end
