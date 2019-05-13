//
//  LineCheck.m
//  GBLineCheckCore
//
//  Created by shin on 2018/10/18.
//  Copyright © 2018年 shin. All rights reserved.
//

#import "LineCheck.h"
#import "LineCheckNetCore.h"
#import "LCData.h"
#import "IPsCacheManager.h"

@interface LineCheck()

@property (nonatomic, assign) float progress;
@property (nonatomic, assign) __block float fetchIPSRetryTimes;//从boss-api拿ips的重试次数
@property (nonatomic, copy) LCProgress progressBlock;
@property (nonatomic, copy) LCComplete completeBlock;
@property (nonatomic, copy) LCFailed failedBlock;

@end

@implementation LineCheck

+ (instancetype)sharedManager
{
    static LineCheck *manager = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        if (manager == nil) {
            manager = [[LineCheck alloc] init];
        }
    });
    return manager;
}

/**
 将数组顺序打乱

 @param arr 需要打乱的数组
 @return 已打乱的数组
 */

- (NSArray *)randomArr:(NSArray *)arr
{
  NSArray *randomArr = [NSArray array];
  
  randomArr = [arr sortedArrayUsingComparator:^NSComparisonResult(NSString *str1, NSString *str2) {
    int seed = arc4random_uniform(2);
    if (seed) {
      return [str1 compare:str2];
    } else {
      return [str2 compare:str1];
    }
  }];
  
  return randomArr;
}

- (void)setProgress:(float)progress
{
    if (progress > 1.0) {
        progress = 1.0;
    }
    _progress = progress;
    if (self.progressBlock) {
        self.progressBlock(_progress);
    }
}

- (void)startLineCheck:(NSDictionary *)siteParameter progress:(LCProgress)progress complete:(LCComplete)complete failed:(LCFailed)failed
{
    self.fetchIPSRetryTimes = 0;//重试次数重置为0
    self.progress = 0.05;//给一个初始进度
    self.progressBlock = progress;
    self.completeBlock = complete;
    self.failedBlock = failed;
  
    __weak typeof(self) weakSelf = self;
    if (![[LCData sharedManager].currentPreUrl isEqualToString:@""]) {
      //进入app
      weakSelf.progress = 1.0;
      //每五分钟刷新一次线路
      [NSTimer scheduledTimerWithTimeInterval:5*60 target:self selector:@selector(refreshIPSFromBossApi:) userInfo:siteParameter repeats:YES];
      if (weakSelf.completeBlock) {
        weakSelf.completeBlock([LCData sharedManager]);
      }
    }
    else if([[IPsCacheManager sharedManager] isIPsValid:[siteParameter objectForKey:@"code"]])
    {
      //ips缓存有效
      //直接check
      NSDictionary *ipsCaches = [[IPsCacheManager sharedManager] ips];
      NSArray *ips = [[ipsCaches objectForKey:@"ips"] objectForKey:@"ips"];
      NSString *host = [[ipsCaches objectForKey:@"ips"] objectForKey:@"domain"];
      ips = [weakSelf randomArr:ips];
      [self checkIPS:ips host:host eachTurn:^{
        weakSelf.progress += 0.02;
      } complete:^{
        //进入app
        weakSelf.progress = 1.0;
        //每五分钟刷新一次线路
        [NSTimer scheduledTimerWithTimeInterval:5*60 target:self selector:@selector(refreshIPSFromBossApi:) userInfo:siteParameter repeats:YES];
        if (weakSelf.completeBlock) {
          weakSelf.completeBlock([LCData sharedManager]);
        }
      } failed:^{
        //所有ips检测失败
        //所有ip无法check过 错误003
        //清空ips缓存
        [[IPsCacheManager sharedManager] clearCaches];
        weakSelf.progress = 0;
        if (weakSelf.failedBlock) {
          weakSelf.failedBlock(3);
        }
      }];
    }
    else
    {
      //ips缓存无效
      //先从域名的boss-api获取ips
      //获取到了直接check
      //获取不到则通过阿里云DNS获取boss-api
      
      __weak typeof(self) weakSelf = self;
      
      //从三个固定域名【串行】获取IPS
      NSArray *bossApis = @[@"https://apiplay.info:1344/boss-api/app/line.html",
                            @"https://hpdbtopgolddesign.com:1344/boss-api/app/line.html",
                            @"https://agpicdance.info:1344/boss-api/app/line.html"];
      bossApis = [self randomArr:bossApis];
      [self doBossApiTask:bossApis host:nil siteParameter:siteParameter failed:^{
        [weakSelf fetchBossApiFromDNSSEachTurn:^{
          //进度
          weakSelf.progress += 0.05;
        } Complete:^(NSString *host, NSArray *bossApis) {
          //通过ip直连的bossapi获取ips
          NSMutableArray *bossApiUrls = [NSMutableArray array];
          for (NSString *bossApiIP in bossApis) {
            NSString *bossApiUrl = [NSString stringWithFormat:@"https://%@:1344/boss-api/app/line.html",bossApiIP];
            [bossApiUrls addObject:bossApiUrl];
          }
          bossApiUrls = [NSMutableArray arrayWithArray:[weakSelf randomArr:(NSArray *)bossApiUrls]];
          [weakSelf doBossApiTask:bossApiUrls host:host siteParameter:siteParameter failed:^{
            //无法从bossApi拿到ips 错误002
            weakSelf.progress = 0;
            if (weakSelf.failedBlock) {
              weakSelf.failedBlock(2);
            }
          }];
        } failed:^{
          //无法从dns拿到bossApi 错误001
          weakSelf.progress = 0;
          if (weakSelf.failedBlock) {
            weakSelf.failedBlock(1);
          }
        }];
        
      }];
    }
}


/**
 从boss-api获取用于check的ips

 @param bossApi boss-api路径
 @param siteParameter 携带的站点参数
 @param host 域名访问boss-api时传nil，ip访问boss-api时需要传host
 @param times 第几次
 @param complete 成功回调
 @param failed 失败回调
 */
- (void)fetchIPSFromBossApi:(NSString *)bossApi siteParameter:(NSDictionary *)siteParameter host:(NSString *)host times:(int)times invalidIPS:invalidIPS complete:(LCNetWorkComplete)complete failed:(LCNetWorkFailed)failed
{
    NSMutableDictionary *mParameter = [NSMutableDictionary dictionaryWithObject:@"ips" forKey:@"type"];
    [mParameter addEntriesFromDictionary:siteParameter];
    [LineCheckNetCore get:bossApi parameter:mParameter header:host == nil ? nil : @{@"Host":host} complete:^(NSHTTPURLResponse *httpURLResponse, id response) {
        if (complete) {
            complete(httpURLResponse, response);
        }
    } failed:^(NSHTTPURLResponse *httpURLResponse, NSString *err) {
        if (failed) {
           failed(httpURLResponse, err);
        }
    }];
}

/**
 从bossapi列表获取ips【串行】

 @param bossApis bossApi列表
 @param host ip直连方式徐亚传host，域名方式传nil
 @param siteParameter 站点参数
 @param eachTurn 完成一个boss-api检测则回调一次
 @param complete 成功获取到ips
 @param failed 所有线路全部获取失败
 */
- (void)fetchIPSFromBossApis:(NSArray *)bossApis host:(NSString *)host siteParameter:(NSDictionary *)siteParameter eachTurn:(LCEachTurn)eachTurn complete:(LCFetchIPSFromBossApisComplete)complete failed:(LCFetchIPSFromBossApisFailed)failed
{
    __weak typeof(self) weakSelf = self;
    __block BOOL doNext = YES;
    __block int failTimes = 0;
    dispatch_queue_t queue = dispatch_queue_create("gb_fetch_ips_from_bossApi_queue", NULL);
    dispatch_semaphore_t sema = dispatch_semaphore_create(1);
    
    for (NSString *bossApi in bossApis) {
        dispatch_async(queue, ^{
            dispatch_semaphore_wait(sema, DISPATCH_TIME_FOREVER);
            if (doNext != YES) {
                //先检测是否需要继续执行 不需要执行则直接跳过本线程
                dispatch_semaphore_signal(sema);
                return ;
            }
            
            NSLog(@">>>>>>开始从boss-api：%@ host:%@ 获取ips\n\n",bossApi,host);
            [weakSelf fetchIPSFromBossApi:bossApi siteParameter:siteParameter host:host times:0 invalidIPS:nil complete:^(NSHTTPURLResponse *httpURLResponse, id response) {
                if (eachTurn) {
                    eachTurn();
                }
                doNext = NO;
                NSLog(@">>>>>>【成功】从boss-api：%@ host:%@ 获取ips：\n%@",bossApi,host,response);
                if (complete) {
                    complete(httpURLResponse, response, bossApi, host);
                }
                dispatch_semaphore_signal(sema);
            } failed:^(NSHTTPURLResponse *httpURLResponse, NSString *err) {
                if (eachTurn) {
                    eachTurn();
                }
                doNext = YES;
                NSLog(@">>>>>>【失败】从boss-api：%@ host:%@ 获取ips",bossApi,host);
                failTimes++;
                if (failTimes == bossApis.count) {
                    NSLog(@">>>>>>【全部bossApi失败】从boss-apis：%@ host:%@ 获取ips",bossApis,host);
                    if (failed) {
                        failed();
                    }
                }
                dispatch_semaphore_signal(sema);
            }];
        });
    }
}

/**
 check单条ip

 @param ip 需要check的ip
 @param host 需要check的host
 @param eachTurn 单条ip 某个类型check失败了
 @param complete 单条ip check成功
 @param failed 单条ip 4种类型check都失败
 */
- (void)checkIP:(NSString *)ip host:(NSString *)host eachTurn:(LCEachTurn)eachTurn complete:(LCCheckIPComplete)complete failed:(LCCheckIPFailed)failed
{
    __block BOOL doNext = YES;
    __block int failTimes = 0;
    dispatch_queue_t queue = dispatch_queue_create([[NSString stringWithFormat:@"gb_check_ip_queue_%@",ip] UTF8String], NULL);
    dispatch_semaphore_t sema = dispatch_semaphore_create(1);

    NSArray *checkTypes = @[@"https+8989",@"http+8787",@"https",@"http"];
  
    for (NSString *checkType in checkTypes) {
        dispatch_async(queue, ^{
            dispatch_semaphore_wait(sema, DISPATCH_TIME_FOREVER);
            if (doNext != YES) {
                //先检测是否需要继续执行 不需要执行则直接跳过本线程
                dispatch_semaphore_signal(sema);
                return ;
            }
            
            NSArray *checkTypeParam = [checkType componentsSeparatedByString:@"+"];
            NSString *checkUrl = [NSString stringWithFormat:@"%@://%@%@/__check",checkTypeParam[0],ip,checkTypeParam.count==2?[NSString stringWithFormat:@":%@",checkTypeParam[1]]:@""];
            
            NSLog(@">>>>>>开始check %@",checkUrl);
            [LineCheckNetCore get:checkUrl parameter:nil header:@{@"Host":host} complete:^(NSHTTPURLResponse *httpURLResponse, id response) {
                NSLog(@">>>>>>check %@ %@ 结果:%@", ip, checkType, response);
                response = [response stringByTrimmingCharactersInSet:[NSCharacterSet whitespaceAndNewlineCharacterSet]];
                if ([[response lowercaseString] isEqualToString:@"ok"]) {
                    if (eachTurn) {
                        eachTurn();
                    }
                    doNext = NO;
                    if (complete) {
                        complete(checkType,ip);
                    }
                }
                else
                {
                    if (eachTurn) {
                        eachTurn();
                    }
                    doNext = YES;
                    failTimes++;
                    if (failTimes == checkTypes.count) {
                        if (failed) {
                            failed();
                        }
                    }
                }
                dispatch_semaphore_signal(sema);
            } failed:^(NSHTTPURLResponse *httpURLResponse, NSString *err) {
                NSLog(@">>>>>>check %@ %@ 错误:%@", ip, checkType, err);
                if (eachTurn) {
                    eachTurn();
                }
                doNext = YES;
                failTimes++;
                if (failTimes == checkTypes.count) {
                    NSLog(@">>>>>>check %@ 四个类型均失败",ip);
                    if (failed) {
                        failed();
                    }
                }
                dispatch_semaphore_signal(sema);
            }];
        });
    }
}

- (void)checkIPS:(NSArray *)ips host:(NSString *)host eachTurn:(LCEachTurn)eachTurn complete:(LCCheckIPSComplete)complete failed:(LCCheckIPSFailed)failed
{
    __block int failTimes = 0;

    for (NSString *ip in ips) {
        [self checkIP:ip host:host eachTurn:^{
            if (eachTurn) {
                eachTurn();
            }
        } complete:^(NSString *type, NSString *ip) {
            static dispatch_once_t checkOnceToken;
            dispatch_once(&checkOnceToken, ^{
                //将数据存入单利
                NSArray *checkTypeComp = [type componentsSeparatedByString:@"+"];
                [LCData sharedManager].currentHost = host;
                [LCData sharedManager].currentIP = ip;
                [LCData sharedManager].currentHttpType = checkTypeComp[0];
                [LCData sharedManager].currentPort = checkTypeComp.count == 2 ? checkTypeComp[1] : @"";
                [LCData sharedManager].currentPreUrl = [NSString stringWithFormat:@"%@://%@%@",[LCData sharedManager].currentHttpType,[LCData sharedManager].currentIP,[[LCData sharedManager].currentPort isEqualToString:@""] ? @"" : [NSString stringWithFormat:@":%@",[LCData sharedManager].currentPort]];
                if (complete) {
                    complete();
                }
            });
        } failed:^() {
            failTimes++;
            if (failTimes == ips.count) {
                if (failed) {
                    failed();
                }
            }
        }];
    }
}

/**
 当获取到的ips都check不过时 重试机制

 @param siteParameter 站点参数
 @param bossApi 可以正常获取ips的bossApi
 @param host 带域名的bossApi获取时 host传nil
 @param invalidIPS 不可用的ips
 */
- (void)retryFetchIPSFromBossApi:(NSDictionary *)siteParameter bossApi:(NSString *)bossApi host:(NSString *)host invalidIPS:(NSArray *)invalidIPS
{
    __weak typeof(self) weakSelf = self;

    self.fetchIPSRetryTimes++;
    [self fetchIPSFromBossApi:bossApi siteParameter:siteParameter host:host times:self.fetchIPSRetryTimes invalidIPS:invalidIPS complete:^(NSHTTPURLResponse *httpURLResponse, id response) {
        //缓存ips
        [[IPsCacheManager sharedManager] updateIPsList:response siteCode:[siteParameter objectForKey:@"code"]];
        //缓存bossBossApi
        [[IPsCacheManager sharedManager] updateBossApi:bossApi host:host];

        NSArray *ips = [response objectForKey:@"ips"];
        NSString *host = [response objectForKey:@"domain"];
        ips = [weakSelf randomArr:ips];
        [weakSelf checkIPS:ips host:host eachTurn:nil complete:^{
            //进入app
            weakSelf.progress = 1.0;
            //每五分钟刷新一次线路
            [NSTimer scheduledTimerWithTimeInterval:5*60 target:self selector:@selector(refreshIPSFromBossApi:) userInfo:siteParameter repeats:YES];
            if (weakSelf.completeBlock) {
                weakSelf.completeBlock([LCData sharedManager]);
            }
        } failed:^{
            //所有ips检测失败
            //递归重试
            //最多重试3次 ips小于10条则不再重试
            if (weakSelf.fetchIPSRetryTimes < 4 && ips.count>=10) {
                [weakSelf retryFetchIPSFromBossApi:siteParameter bossApi:bossApi host:host invalidIPS:ips];
            }
            else
            {
                //所有ip无法check过 错误003
                weakSelf.progress = 0;
                [[IPsCacheManager sharedManager] clearCaches];
                if (weakSelf.failedBlock) {
                    weakSelf.failedBlock(3);
                }
            }
        }];

    } failed:^(NSHTTPURLResponse *httpURLResponse, NSString *err) {
        //无法从bossApi拿到ips 错误002
        weakSelf.progress = 0;
        if (weakSelf.failedBlock) {
            weakSelf.failedBlock(2);
        }
    }];
}

/**
 从DNS列表顺序获取ip直连的boss-api及host

 @param eachTurn 每完成一个检测的回调
 @param complete 完成回调
 @param failed 失败回调
 */
- (void)fetchBossApiFromDNSSEachTurn:(LCEachTurn)eachTurn Complete:(LCFetchBossApiComplete)complete failed:(LCFetchBossApiFailed)failed
{
    NSArray *dnss = @[@"http://203.107.1.33/194768/d?host=apiplay.info",
                      @"http://203.107.1.33/194768/d?host=hpdbtopgolddesign.com",
                      @"http://203.107.1.33/194768/d?host=agpicdance.info"];
    dnss = [self randomArr:dnss];
    __block BOOL doNext = YES;
    __block int failTimes = 0;
    dispatch_queue_t queue = dispatch_queue_create("gb_fetch_bossapi_queue", NULL);
    dispatch_semaphore_t sema = dispatch_semaphore_create(1);

    for (NSString *dns in dnss) {
        dispatch_async(queue, ^{
            dispatch_semaphore_wait(sema, DISPATCH_TIME_FOREVER);
            if (doNext != YES) {
                //先检测是否需要继续执行 不需要执行则直接跳过本线程
                dispatch_semaphore_signal(sema);
                return ;
            }
            NSLog(@">>>>>>开始从dns:%@获取bossApi",dns);
            [LineCheckNetCore get:dns parameter:nil header:nil complete:^(NSHTTPURLResponse *httpURLResponse, id response) {
                if (eachTurn) {
                    eachTurn();
                }
                doNext = NO;
                NSArray *bossApis = [response objectForKey:@"ips"];
                NSString *host = [response objectForKey:@"host"];
                NSLog(@">>>>>>【成功】从dns:%@获取bossApi的结果:%@",dns,response);
                if (complete) {
                    complete(host,bossApis);
                }
                dispatch_semaphore_signal(sema);
            } failed:^(NSHTTPURLResponse *httpURLResponse, NSString *err) {
                failTimes++;
                doNext = YES;
                NSLog(@">>>>>>【失败】从dns:%@获取bossApi失败",dns);
                if (failTimes == dnss.count) {
                    NSLog(@">>>>>>【全部失败】从dnss:%@获取bossApi失败",dnss);
                    if (failed) {
                        failed();
                    }
                }
                dispatch_semaphore_signal(sema);
            }];
        });
    }
}

/**
 从bossApi获取ips 并完成check的任务
 
 @param bossApis bossApi列表
 @param host ip直连方式徐亚传host，域名方式传nil
 @param siteParameter 站点参数
 @param failed 所有线路全部获取失败
 */

- (void)doBossApiTask:(NSArray *)bossApis host:(NSString *)host siteParameter:(NSDictionary *)siteParameter failed:(LCFetchIPSFromBossApisFailed)failed
{
    __weak typeof(self) weakSelf = self;

    [self fetchIPSFromBossApis:bossApis host:host siteParameter:siteParameter eachTurn:^{
        //进度
        weakSelf.progress += 0.05;
    } complete:^(NSHTTPURLResponse *httpURLResponse, id response, NSString *availableBossApi, NSString *availableBossApiHost) {
        NSArray *ips = [response objectForKey:@"ips"];
        NSString *host = [response objectForKey:@"domain"];
        ips = [weakSelf randomArr:ips];
        [weakSelf checkIPS:ips host:host eachTurn:^{
            weakSelf.progress += 0.02;
        } complete:^{
            //缓存ips
            [[IPsCacheManager sharedManager] updateIPsList:response siteCode:[siteParameter objectForKey:@"code"]];
            //缓存bossBossApi
            [[IPsCacheManager sharedManager] updateBossApi:availableBossApi host:availableBossApiHost];
            //进入app
            weakSelf.progress = 1.0;
            //每五分钟刷新一次线路
            [NSTimer scheduledTimerWithTimeInterval:5*60 target:self selector:@selector(refreshIPSFromBossApi:) userInfo:siteParameter repeats:YES];

            if (weakSelf.completeBlock) {
                weakSelf.completeBlock([LCData sharedManager]);
            }
        } failed:^{
            //所有ips检测失败
            //开始重试
            //如果ip数量大于等于10个 则启动重试策略
            if (ips.count >= 10) {
                [weakSelf retryFetchIPSFromBossApi:siteParameter bossApi:availableBossApi host:availableBossApiHost invalidIPS:ips];
            }
            else
            {
                //所有ip无法check过 错误003
                weakSelf.progress = 0;
                [[IPsCacheManager sharedManager] clearCaches];
                if (weakSelf.failedBlock) {
                    weakSelf.failedBlock(3);
                }
            }
        }];
    } failed:^() {
        if (failed) {
            failed();
        }
    }];
}

/**
 每隔5分钟从可用的bossApi线路获取新的ips并做check

 @param timer 携带siteParameter站点参数
 */
- (void)refreshIPSFromBossApi:(NSTimer *)timer
{
  __weak typeof(self) weakSelf = self;
  
  NSDictionary *siteParameter = [timer userInfo];
  NSDictionary *bossApiInfo = [[IPsCacheManager sharedManager] bossApiInfo];
  NSString *bossApi = [bossApiInfo objectForKey:@"bossApi"];
  NSString *host = [bossApiInfo objectForKey:@"host"];
  [self fetchIPSFromBossApi:bossApi siteParameter:siteParameter host:[host isEqualToString:@""] ? nil : host times:0 invalidIPS:nil complete:^(NSHTTPURLResponse *httpURLResponse, id response) {
    //缓存ips
    [[IPsCacheManager sharedManager] updateIPsList:response siteCode:[siteParameter objectForKey:@"code"]];
    NSArray *ips = [response objectForKey:@"ips"];
    NSString *host = [response objectForKey:@"domain"];
    ips = [weakSelf randomArr:ips];
    [weakSelf checkIPS:ips host:host eachTurn:nil complete:^{
      //check成功
      //不做其他操作
    } failed:^{
      //check失败
      //不做其他操作
    }];
  } failed:^(NSHTTPURLResponse *httpURLResponse, NSString *err) {
    //
  }];
}

@end
