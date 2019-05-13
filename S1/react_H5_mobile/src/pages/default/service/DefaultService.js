import HttpService from 'common/service/HttpService'

export default class DefaultService extends HttpService {
  constructor(option) {
    super(option)
  }

  withdrawOrigin() {
    let _this = this
    let root = '/withdrawOrigin/'
    return {
      // getWithDraw (获取取款)
      getWithDraw: {
        get() {
          return _this._get(root + 'getWithDraw', {suffix: '.html'})
        }
      },
      // withdrawFee (获取扣除手续费后的最终金额)
      withdrawFee: {
        post(params) {
          return _this._get(root + 'withdrawFee', {param: params})
        }
      },
      // submitWithdraw (提交取款信息)
      submitWithdraw: {
        post(params) {
          return _this._get(root + 'submitWithdraw', {param: params})
        }
      },
      // getAuditLog (取款稽核)
      getAuditLog: {
        post(params) {
          return _this._get(root + 'getAuditLog', {param: params})
        }
      }
    }
  }

  // 注册
  registerOrigin() {
    let _this = this
    let root = '/registerOrigin'
    return {
      // 注册初始化
      getRegisterInfo: {
        get() {
          return _this._get(root + '/getRegisterInfo', {suffix: '.html'})
        }
      },
      // 提交註冊
      save: {
        post(params) {
          return _this._post(root + '/save', {isFormData: true, param: params})
        }
      }
    }
  }

  userInfoOrigin() {
    let _this = this
    let root = '/userInfoOrigin/'
    return {
      // 获取用户信息
      getUserInfo: {
        get() {
          return _this._get(root + 'getUserInfo', {suffix: '.html'})
        }
      },
      // refresh (一键刷新)
      refresh: {
        post(params) {
          return _this._post(root + 'refresh', {
            isFormData: true,
            param: params
          })
        }
      },
      // submitBankCard (提交银行卡绑定的相关信息)
      submitBankCard: {
        post(params) {
          return _this._post(root + 'submitBankCard', {
            isFormData: true,
            param: params
          })
        }
      },
      // submitBtc (保存比特币钱包)
      submitBtc: {
        post(params) {
          return _this._post(root + 'submitBtc', {
            isFormData: true,
            param: params
          })
        }
      },
      // refreshApi (非免转刷新单个api)
      refreshApi: {
        post(params) {
          return _this._post(root + 'refreshApi', {
            isFormData: true,
            param: params
          })
        }
      },
      // reconnectTransfer (非免转额度转换异常再次请求)
      reconnectTransfer: {
        post(params) {
          return _this._post(root + 'reconnectTransfer', {
            isFormData: true,
            param: params
          })
        }
      },
      // transfersMoney (非免转额度转换提交)
      transfersMoney: {
        post(params) {
          return _this._post(root + 'transfersMoney', {
            isFormData: true,
            param: params
          })
        }
      },
      // getNoAutoTransferInfo (非免转额度转换初始化)
      getNoAutoTransferInfo: {
        post(params) {
          return _this._post(root + 'getNoAutoTransferInfo', {
            isFormData: true,
            param: params
          })
        }
      },
      // getUserAssert (获取用户资产信息)
      getUserAssert: {
        post(params) {
          return _this._post(root + 'getUserAssert', {
            isFormData: true,
            param: params
          })
        }
      }
    }
  }


  origin() {
    let _this = this
    let root = '/origin/'
    return {
      // mainIndex (获取首页接口)
      mainIndex: {
        get() {
          return _this._get(root + 'mainIndex', {
            suffix: '.html', param: {
              terminal: 'app_ios',
              resolution: '2x',
              theme: 'black'
            }
          })
        }
      },
      // getCasinoGame (电子游戏接口)
      getCasinoGame: {
        get(param) {
          return _this._get(root + 'getCasinoGame', {param: param,suffix: '.html'})
        }
      },
      // getGameLink (游戏链接)
      getGameLink: {
        get(param) {
          return _this._get(root + 'getGameLink', {param: param, suffix: '.html'})
        }
      },
      // getGameTag (获取游戏分类)
      getGameTag: {
        get(param) {
          return _this._get(root + 'getGameTag', {param: param,suffix: '.html'})
        }
      },
      // getIntoAppAd (app启动页面广告接口)
      getIntoAppAd: {
        get() {
          return _this._get(root + 'getIntoAppAd', {suffix: '.html'})
        }
      },
      // sendFindPasswordPhone (找回密码发送手机短信)
      sendFindPasswordPhone: {
        post(params) {
          return _this._post(root + 'sendFindPasswordPhone', {param: params})
        }
      },
      // sendPhoneCode (注册发送手机短信验证码)
      sendPhoneCode: {
        post(params) {
          return _this._post(root + 'sendPhoneCode', {isFormData: true, param: params})
        }
      },
      // helpDetail (常见问题详情)
      helpDetail: {
        get() {
          return _this._get(root + 'helpDetail', {suffix: '.html'})
        }
      },
      // secondType (常见问题二级分类)
      secondType: {
        get() {
          return _this._get(root + 'secondType', {suffix: '.html'})
        }
      },
      // helpFirstType (常见问题父级分类)
      helpFirstType: {
        get() {
          return _this._get(root + 'helpFirstType', {suffix: '.html'})
        }
      },
      // terms (注册条款)
      terms: {
        get() {
          return _this._get(root + 'terms', {suffix: '.html'})
        }
      },
      // about (关于我们)
      about: {
        get() {
          return _this._get(root + 'about', {suffix: '.html'})
        }
      },
      //获取cookie  TODO 核实是否还需要
      getHttpCookie: {
        get() {
          return _this._get(root + 'getHttpCookie', {suffix: '.html'})
        }
      }
    }
  }


  // 优惠
  discountsOrigin() {
    let _this = this
    let root = '/discountsOrigin/'
    return {
      // getActivityType (优惠活动类型)
      getActivityType: {
        post() {
          return _this._get(root + 'getActivityType', {suffix: '.html'})
        }
      },
      // getActivityTypeList (优惠活动列表)
      getActivityTypeList: {
        post(param) {
          return _this._get(root + 'getActivityTypeList', {param: param})
        }
      },
      // getActivityTypes (活动类型和活动信息)
      getActivityTypes: {
        post(param) {
          return _this._get(root + 'getActivityTypes', {param: param})
        }
      },
    }
  }

  depositOrigin(code) {
    let _this = this
    /** 根地址 */
    let root = '/depositOrigin/'
    return {
      // code (存款渠道初始化)
      // index (存款入口初始化 )
      index: {
        post() {
          return _this._post(root + (code || 'index'), {
            suffix: '.html',
            isFormData: true,
            param: {
              terminal: 'app_ios',
              resolution: '2x',
              theme: 'black'
            }

          })
        }
      },
      // bitcoinPay (比特币支付提交存款 )
      bitcoinPay: {
        post(params) {
          return _this._post(root + 'bitcoinPay', {
            isFormData: true,
            param: params
          })
        }
      },
      // electronicPay (电子支付提交存款 )
      electronicPay: {
        post(params) {
          return _this._post(root + 'electronicPay', {
            isFormData: true,
            param: params
          })
        }
      },
      // companyPay (网银支付提交存款 )
      companyPay: {
        post(params) {
          return _this._post(root + 'companyPay', {
            isFormData: true,
            param: params
          })
        }
      },
      // scanPay (扫码支付提交存款 )
      scanPay: {
        post(params) {
          return _this._post(root + 'scanPay', {
            isFormData: true,
            param: params
          })
        }
      },
      // onlinePay (线上支付提交存款 )
      onlinePay: {
        post(params) {
          return _this._post(root + 'onlinePay', {
            isFormData: true,
            param: params
          })
        }
      },
      // seachSale (存款获取优惠 )
      seachSale: {
        post(params) {
          return _this._post(root + 'seachSale', {
            isFormData: true,
            param: params
          })
        }
      }
    }
  }

  findPasswordOrigin() {
    let _this = this
    /** 根地址 */
    let root = '/findPasswordOrigin/'
    return {
      // findSafePassword (找回安全密码)
      findSafePassword: {
        post(params) {
          return _this._post(root + 'findSafePassword', {
            isFormData: true,
            param: params
          })
        }
      },
      // findLoginPassword (找回登录密码)
      findLoginPassword: {
        post(params) {
          return _this._post(root + 'findLoginPassword', {
            isFormData: true,
            param: params
          })
        }
      },
      // checkPhoneCode (找回密码验证手机短信验证码)
      checkPhoneCode: {
        post(params) {
          return _this._post(root + 'checkPhoneCode', {
            isFormData: true,
            param: params
          })
        }
      },
      // findUserPhone (找回密码判断用户是否绑定过手机号)
      findUserPhone: {
        post(params) {
          return _this._post(root + 'findUserPhone', {
            isFormData: true,
            param: params
          })
        }
      }
    }
  }

  activityOrigin() {
    let _this = this
    let root = '/activityOrigin/'
    return {
      // countDrawTimes (浮动图抢红包次数)
      countDrawTimes: {
        get() {
          return _this._get(root + 'countDrawTimes', {suffix: '.html'})
        }
      },
      // getPacket (拆红包)
      getPacket: {
        get() {
          return _this._get(root + 'getPacket', {suffix: '.html'})
        }
      }
    }

  }

  mineOrigin() {
    let _this = this
    let root = 'mineOrigin/'
    return {
      // getUser (获取我的主页)
      getUser: {
        get() {
          return _this._get(root + 'getUser', {suffix: '.html'})
        }
      },
      // recovery (一键回收)
      recovery: {
        post(params) {
          return _this._post(root + 'recovery', {
            isFormData: true,
            param: params
          })
        }
      },
      // getMyPromo (优惠主界面)
      getMyPromo: {
        get() {
          return _this._get(root + 'getMyPromo', {suffix: '.html'})
        }
      },
      // getTimeZone (获取当前时区)
      getUgetTimeZoneser: {
        post(param) {
          return _this._post(root + 'getUgetTimeZoneser', {isFormData: true, param: param})
        }
      },
      /*
      *        资金记录
      */
      // getFundRecord (获取资金记录)
      getFundRecord: {
        post(params) {
          return _this._post(root + 'getFundRecord', {
            isFormData: true,
            param: params
          })
        }
      },
      // getFundRecordDetails (获取资金记录明细)
      getFundRecordDetails: {
        post(params) {
          return _this._post(root + 'getFundRecordDetails', {
            isFormData: true,
            param: params
          })
        }
      },
      /*
      *        注单记录
      * */
      // getBettingList (获取投注记录)
      getBettingList: {
        post(params) {
          return _this._post(root + 'getBettingList', {
            isFormData: true,
            param: params
          })
        }
      },
      // getBettingDetails (获取投注记录明细)
      getBettingDetails: {
        post(params) {
          return _this._post(root + 'getBettingDetails', {
            isFormData: true,
            param: params
          })
        }
      },
      /*
      *     消息中心
      */
      // getUnReadCount (系统/我的消息未读数量)
      getUnReadCount: {
        get() {
          return _this._get(root + 'getUnReadCount', {suffix: '.html'})
        }
      },
      //#######系统消息#########
      // deleteSiteSysNotice (系统信息删除)
      deleteSiteSysNotice: { //params ids:String
        post(param) {
          return _this._post(root + 'deleteSiteSysNotice', {isFormData: true, param: param})
        }
      },
      // setSiteSysNoticeStatus (系统信息标记为已读)
      setSiteSysNoticeStatus: { //params ids:String
        post(param) {
          return _this._post(root + 'setSiteSysNoticeStatus', {param: param})
        }
      },
      // getSiteSysNoticeDetail (系统信息详情)
      getSiteSysNoticeDetail: {
        post(param) {
          return _this._post(root + 'getSiteSysNoticeDetail', {isFormData: true, param: param})
        }
      },
      // getSiteSysNotice (系统信息列表)
      getSiteSysNotice: {
        get() {
          return _this._get(root + 'getSiteSysNotice', {suffix: '.html'})
        }
      },
      //#######我的消息#########
      // advisoryMessageDetail (消息详情)
      advisoryMessageDetail: { //params id:
        post(param) {
          return _this._post(root + 'advisoryMessageDetail', {isFormData: true, param: param})
        }
      },
      // getSelectAdvisoryMessageIds (消息已读)
      getSelectAdvisoryMessageIds: { //params ids:String
        post(param) {
          return _this._post(root + 'getSelectAdvisoryMessageIds', {param: param})
        }
      },
      // deleteAdvisoryMessage (消息删除)
      deleteAdvisoryMessage: {
        post(param) {
          return _this._post(root + 'deleteAdvisoryMessage', {isFormData: true, param: param})
        }
      },
      // advisoryMessage (消息列表)
      advisoryMessage: {
        get() {
          return _this._get(root + 'advisoryMessage', {suffix: '.html'})
        }
      },
      // getNoticeSiteType (申请优惠获取类型)
      getNoticeSiteType: {
        get() {
          return _this._get(root + 'getNoticeSiteType', {suffix: '.html'})
        }
      },
      // addNoticeSite (添加优惠申请)
      addNoticeSite: {
        post(param) {
          return _this._post(root + 'addNoticeSite', {isFormData: true, param: param})
        }
      },
      /*
      * 消息中心
      * */
      // getGameNotice (游戏公告列表)
      getGameNotice: {
        get(param) {
          return _this._get(root + 'getGameNotice', {param: param, suffix: '.html'})
        }
      },
      // getSysNotice (系统公告列表)
      getSysNotice: {
        get(param) {
          return _this._get(root + 'getSysNotice', {param: param, suffix: '.html'})
        }
      },
      // getGameNoticeDetail (游戏公告详情)
      getGameNoticeDetail: {
        get(param) {
          return _this._get(root + 'getGameNoticeDetail', {param: param, suffix: '.html'})
        }
      },
      // getSysNoticeDetail (系统公告详情)
      getSysNoticeDetail: {
        get(param) {
          return _this._get(root + 'getSysNoticeDetail', {param: param, suffix: '.html'})
        }
      },
      /*
      *
      * 安全中心
      *
      * */
      //initSafePassword (初始化安全码接口) param password newPassword code
      initSafePassword: {
        post(params) {
          return _this._post(root + 'initSafePassword', {
            isFormData: true,
            param: params
          })
        }
      },
      //updateSafePassword (修改安全密码) realName originPwd pwd1 pwd2 code
      updateSafePassword: {
        post(params) {
          return _this._post(root + 'updateSafePassword', {
            isFormData: true,
            param: params
          })
        }
      },
      //updateLoginPassword (修改登录密码 ) param password newPassword code
      updateLoginPassword: {
        post(params) {
          return _this._post(root + 'updateLoginPassword', {
            isFormData: true,
            param: params
          })
        }
      },
      //updateUserPhone (绑定用户手机号)   search.contactValue code
      updateUserPhone: {
        post(params) {
          return _this._post(root + 'updateUserPhone', {
            isFormData: true,
            param: params
          })
        }
      },
      // checkSafePassword (验证安全码信息)
      checkSafePassword: {
        post(params) {
          return _this._post(root + 'checkSafePassword', {
            isFormData: true,
            param: params
          })
        }
      },
      // alwaysRequest (保活接口/登录前请求是否需要验证码的)
      alwaysRequest: {
        get() {
          return _this._get(root + 'alwaysRequest', {suffix: '.html'})
        }
      },
      //setRealName (设置真实姓名) realName
      setRealName: {
        post(params) {
          return _this._post(root + 'setRealName', {
            isFormData: true,
            param: params
          })
        }
      },
      //getUserPhone (绑定手机号获取用户手机号)
      getUserPhone: {
        post(params) {
          return _this._post(root + 'getUserPhone', {
            isFormData: true,
            param: params
          })
        }
      },
      //addCard (添加银行卡时获取银行类别接口)
      addCard: {
        post(params) {
          return _this._post(root + 'addCard', {
            isFormData: true,
            param: params
          })
        }
      },
      /*
      *       分享
      * */
      // getPlayerRecommendRecord (查询分享好友记录)
      getPlayerRecommendRecord: {
        post(params) {
          return _this._post(root + 'getPlayerRecommendRecord', {
            isFormData: true,
            param: params
          })
        }
      },
      // getUserPlayerRecommend (分享好友入口)
      getUserPlayerRecommend: {
        post(params) {
          return _this._post(root + 'getUserPlayerRecommend', {
            isFormData: true,
            param: params
          })
        }
      },
    }
  }

  account() {
    let _this = this
    /** 根地址 */
    let root = '/passport'
    return {
      /** 登录ddd */
      login: {
        post(param) {
          return _this._post(root + '/login',
            {isFormData: true, param: param})
        }
      },
      logout: {
        get() {
          return _this._get(root + '/logout', {suffix: '.html'})
        }
      }
    }
  }

  download() {
    let _this = this,
      root = '/download'
    return {
      /** 下载 */
      download: {
        post(param) {
          return _this._post(root + '/download',
            {isFormData: true, param: param})
        }
      }
    }
  }

  /*
  * 全民推广
  *
  */
  allPersonRecommend() {
    let _this = this
    let root = '/allPersonRecommend/'
    return {
      //我的分享 groupid 用户组id，1：超级管理员；2：普通用户
      myShare: {
        post(param) {
          return _this._post(root + 'myShare', {param: param})
        }
      },
      // 红利领取ids 数字数组以逗号分割 待领取红利记录id数组
      getUnReciveReward: {
        post(param) {
          return _this._post(root + 'getUnReciveReward', {param: param})
        }
      },
      //全民推荐奖励详细
      ruleDetail: {
        get() {
          return _this._get(root + 'ruleDetail', {prefix: '.html'})
        }
      },
      //我的奖励 startTime endTime type 	查询类型：0=红利，1=推荐奖励
      recommendRecords: {
        post(param) {
          return _this._post(root + 'recommendRecords', {param: param})
        }
      },
      //团队记录
      teamList: {
        post(param) {
          return _this._post(root + 'teamList', {param: param})
        }
      }
    }
  }

  //验证码
  captcha() {
    let _this = this
    let root = '/captcha/'
    return {
      //  验证码（普通）
      privilege: {
        get() {
          return _this._get(root + 'privilege', {suffix: '.html'})
        }
      },
      //  验证码（安全码）
      securityPwd: {
        get() {
          return _this._get(root + 'securityPwd', {suffix: '.html'})
        }
      },
      // 注册验证码
      pmregister: {
        get() {
          return _this._get(root + 'pmregister', {isFormData: true, param: {t: 685029}})
        }
      }
    }
  }
}
