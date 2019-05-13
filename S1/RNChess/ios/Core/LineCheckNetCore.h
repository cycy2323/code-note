//
//  LineCheckNetCore.h
//  GBLineCheckCore
//
//  Created by shin on 2018/10/18.
//  Copyright © 2018年 shin. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "LCHeader.h"

@interface LineCheckNetCore : NSObject

+ (void)get:(NSString *)url parameter:(NSDictionary *)parameter header:(NSDictionary *)header complete:(LCNetWorkComplete)complete failed:(LCNetWorkFailed)failed;

+ (void)post:(NSString *)url parameter:(NSDictionary *)parameter header:(NSDictionary *)header complete:(LCNetWorkComplete)complete failed:(LCNetWorkFailed)failed;

@end
