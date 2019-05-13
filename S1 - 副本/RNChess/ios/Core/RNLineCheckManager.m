//
//  RNLineCheckManager.m
//  RNLineCheck
//
//  Created by shin on 23/10/2018.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import "RNLineCheckManager.h"
#import "LineCheck.h"

@implementation RNLineCheckManager

RCT_EXPORT_MODULE();

- (NSArray<NSString *> *)supportedEvents
{
  return @[@"RNLineCheckProgress",@"RNLineCheckComplete",@"RNLineCheckFailed"];
}

RCT_EXPORT_METHOD(startLineCheck)
{
  __weak typeof(self)  weakSelf = self;
  
  NSDictionary *siteParameter = [self readSiteConfig];
  
  [[LineCheck sharedManager] startLineCheck:siteParameter progress:^(float progress) {
    NSLog(@"+++++++++++++++++++++:%.2f",progress);
    [weakSelf sendEventWithName:@"RNLineCheckProgress" body:@(progress)];
  } complete:^(LCData *lineData) {
    NSLog(@"+++++++++++++++++++++线路检测完成");
    NSDictionary *data = @{@"currentIP":lineData.currentIP,@"currentHttpType":lineData.currentHttpType,@"currentPort":lineData.currentPort,@"currentPreUrl":lineData.currentPreUrl,@"currentHost":lineData.currentHost,@"siteId":siteParameter[@"sid"],@"siteCode":siteParameter[@"code"],@"siteS":siteParameter[@"s"],@"siteRecommendUserInputCode":siteParameter[@"recommendUserInputCode"],@"siteJpushAppkey":siteParameter[@"jpushAppkey"]};
    [weakSelf sendEventWithName:@"RNLineCheckComplete" body:data];
  } failed:^(int errCode) {
    [weakSelf sendEventWithName:@"RNLineCheckFailed" body:@(errCode)];
  }];

}

- (NSDictionary *)readSiteConfig
{
  NSString *jsonPath = [[NSBundle mainBundle] pathForResource:@"sitesConfig" ofType:@"json"];
  NSData *data = [NSData dataWithContentsOfFile:jsonPath];
  NSError *error = nil;
  id result = [NSJSONSerialization JSONObjectWithData:data options:NSJSONReadingAllowFragments error:&error];
  return result;
}

@end
