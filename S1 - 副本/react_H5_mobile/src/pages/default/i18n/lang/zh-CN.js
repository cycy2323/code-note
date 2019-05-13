export default {
  local: {
    common: {
      countDownNotice: (time) => {
        return time + '秒后重新获取'
      }
    },
    home: {
      title: '首页',
      index: '首页',
      saving: '存款',
      preferential: '优惠',
      customer: '客服',
      mine: '我的',
      modal: {
        left: {
          welcome: '欢迎光临，请先登录',
          userLogIn: '用户登录',
          userCenter: '个人中心',
          userLogOut: '退出登录',
          home: '首页',
          faq: '常见问题',
          agreement: '注册条款',
          aboutUs: '关于我们',
          download: '下载客户端',
          pc: '电脑版',
          recommend: '推荐好友',
          language: '语言',
        },
        right: {
          totalAssets: '总资产',
          walletBalance: '钱包',
          gameMaintain: '游戏维护中',
          refresh: '一键刷新',
          recycle: '一键回收',
          deposit: '存款',
        },
      },
    },
    button: {
      login: '登录',
      register: '注册'
    },
    login: {
      title: '登录',
      login: '立即登录',
      createAccount: '免费开户',
      forgotPassword: '忘记密码？',
      rememberPassword: '记住密码',
      form: {
        username: '用户名',
        password: '密码',
        verificationCode: '验证码'
      },
      placeholder: {
        username: '请输入用户名',
        password: '请输入密码',
        verificationCode: '请输入验证码'
      }
    },
    register: {
      title: '免费注册',
      agree: '同意',
      registrationAgreement: '用户注册协议',
      createAccount: '立即注册',
      hasAccount: '已有账号',
      login: '前往登录',
      agreeTitle: '注册条款',
      toast: {
        inputToast: (val) => {
          return val + '不能为空，请输入' + val
        },
        selectToast: (val) => {
          return val + '不能为空，请选择' + val
        },
        usernameShouldBe: '用户名应为4-15的数字或字母组合而成',
        passwordShouldBe: '密码应由6-20位的数字、字母及特殊符号组合而成',
        paymentPasswordShouldBe: '安全密码应为6位数字',
        passwordMismatch: '两次输入的密码不一致',
        paymentPasswordMismatch: '两次输入的安全密码不一致',
        shouldAcceptTerms: '需同意用户注册协议后方可注册'
      },
      form: {
        regCode: '推荐码',
        username: '用户名',
        password: '密码',
        confirmPassword: '确认密码',
        301: 'QQ',
        304: '微信',
        201: '邮箱',
        110: '手机号',
        phoneVerificationCode: '手机验证码',
        realName: '真实姓名',
        sex: '性别',
        birthday: '生日',
        defaultTimezone: '时区',
        mainCurrency: '货币',
        defaultLocale: '主语言',
        paymentPassword: '安全密码',
        paymentPasswordConfirm: '确认安全密码',
        securityIssues: '安全问题',
        answer: '答案',
        verificationCode: '验证码',
        getPhoneVerificationCode: '获取验证码'
      },
      placeholder: {
        regCode: '请输入推荐人邀请码',
        username: '4-15位数字和字母',
        password: '6-20位数字、字符及特殊符号',
        confirmPassword: '请再次输入登录密码',
        301: '请输入QQ账号',
        304: '请输入微信账号',
        201: '请输入邮箱账号',
        110: '请输入手机号码',
        phoneVerificationCode: '请输入验证码',
        realName: '必须与您的银行账户名称相同',
        sex: '请选择性别',
        birthday: '请选择生日',
        defaultTimezone: '',
        mainCurrency: '请选择货币类型',
        defaultLocale: '请选择默认语言',
        paymentPassword: '请输入6位数字',
        paymentPasswordConfirm: '请再次输入安全密码',
        securityIssues: '请选择安全问题',
        answer: '请输入安全问题的答案',
        verificationCode: '点击验证码可更换'
      }
    },
    bettingRecord: {
      title: '投注记录',
      main: '首页',
      saving: '存款',
      preferential: '优惠',
      customer: '客服',
      mine: '我的'
    },
    download: {
      title: 'APP下载',
      description: '下载APP再也无需输入网址',
      ios: '点击下载iOS版',
      android: '点击下载安卓版'
    },
    active: {
      updateSuccess: '数据更新成功',
      updateFail: '数据更新失败',
      pullDownToRefresh: '下拉可刷新数据'
    },
    mine: {
      login: '登录',
      register: '注册',
      title: '我的',
      totalAssets: '总资产',
      walletBalance: '钱包余额',
      deposit: '充值',
      withdraw: '提现',
      titles: {
        betting: '投注记录',
        funAccount: '资金账户',
        fundRecord: '资金记录',
        security: '安全中心',
        promoRecord: '优惠记录',
        notice: '消息中心',
        recommend: '全民推广'
      },
      descriptions: {
        betting: '查看所参与的游戏记录',
        funAccount: '进行资金回收和转入',
        fundRecord: '查看素有资金往来记录',
        security: '保护您的账户安全',
        promoRecord: '查看所参与的优惠记录',
        notice: '查看历史消息内容',
        recommend: '轻松让您月入百万'
      }
    },
    fundRecord: {
      title: '资金记录',
      label: '创建日期：',
      quickSelect: '快选',
      search: '搜索',
      withdrawSum: '取款处理中：',
      transferSum: '转账处理中：',
      date: '时间',
      value: '金额',
      status: '状态',
      transactionType: '类型',
      total: '合计：',
      recharge: '充值总额：',
      withdraw: '提现总额：',
      favorable: '优惠总额：',
      rakeback: '返水总额：',
      placeholder: {
        transactionType: '请选择'
      },
      transactionTypeList: {
        '': '所有',
        deposit: '存款',
        withdrawals: '取款',
        transfers: '转账',
        favorable: '优惠',
        rakeback: '返水'
      },
      quickSelectList: {
        today: 'today',
        yesterday: 'yesterday',
        week: 'week',
        seven: 'seven'
      },
      detail: {
        title: '资金记录详情',
        transactionNo: '交易号',
        createTime: '创建时间',
        transactionWayName: '描述',
        realName: '姓名：',
        rechargeAmount: '存款金额：',
        poundage: '手续费：',
        rechargeTotalAmount: '实际到帐：',
        statusName: '状态：',
      }
    },
    betting: {
      title: '投注记录',
      label: '投注日期：',
      search: '搜索',
      gameName: '游戏名称',
      date: '投注时间',
      value: '投注额',
      result: '派彩结果',
      status: '状态',
      total: {
        title: '合计：',
        single: '投注总额：',
        profit: '派彩总额：',
        effective: '有效投注：',
        totalSize: '投注注数：',
      },
      statusList: {//状态
        pending_settle: '未结算',
        settle: '已结算',
        cancel: '取消订单'
      },
      detail: {
        title: '投注记录详情',
        subtitle: '游戏记录',
        betId: '注单号',
        gameType: '游戏类型',
        betTime: '投注时间',
        effectiveTradeAmount: '有效投注额',
        payoutTime: '派彩时间',
        profitAmount: '派彩金额',
        contributionAmount: '彩池贡献金'
      }
    },
    inbox: {
      title: '收件箱',
      systemMsg: '系统消息',
      myMsg: '我的消息',
      sendMsg: '发送消息',
      selectAll: '全选',
      delete: '删除',
      markRead: '标注已读',
      type: '类型：',
      plsSelect: '请选择',
      msgTitle: '标题：',
      plsTypeTitle: '请填写标题',
      plsTypeContent: '请填写内容',
      send: '发送',
      cancel: '取消',
      sure: '确定',
      deleteContent: '确定删除选中的消息？',
      markContent: '确定将选中的消息标注成已读？'
    },
    notice: {
      title: '消息中心',
      gameMsg: '游戏公告',
      systemMsg: '系统公告',
      startPlaceholder: '开始时间',
      endPlaceholder: '结束时间',
      game: {
        all: '所有游戏',
        noMore: '已经到底了，亲',
        detail: '游戏公告详情'
      },
      system: {
        noMore: '已经到底了，亲',
        detail: '系统公告详情'
      }
    },
    securityCenter: {
      title: '安全中心',
      dear: (name) => {//亲爱的***
        return '亲爱的' + name + ','
      },
      notice: '您的帐号信息，正在享受全面的安全防护',
      modify: '修改',
      setting: '设置',
      modifyPsw: '修改登录密码',
      modifySecurityPsw: '修改安全密码',
      bindPhone: '绑定手机',
      bindBankCard: '银行卡',
      unBindBankCard: '(未绑定银行卡)',
      code: {// 修改安全密码
        title: '修改安全密码',
        remainTimes: (val) => {
          return '您还有' + val + '次机会'
        },
        placeholder: {
          realName: '验证真实姓名',
          originPwd: '请输入当前密码',
          pwd1: '请输入新密码',
          pwd2: '再次输入新密码',
          code: '请输入验证码',
          setRealName: '设置真实姓名'
        },
        form: {
          realName: '真实姓名',
          originPwd: '当前密码',
          pwd1: '新密码',
          pwd2: '确认密码'
        },
        toast: {
          setNameSuccess: '成功添加姓名',
          addSecuritySuccess: '安全密码添加成功',
          modifySecuritySuccess: '安全密码修改成功'
        },
        button: {
          modify: '确定',
          add: '设置用户真实姓名'
        }
      },
      bank: {
        title: '我的银行卡',
        form: {
          bankcardMasterName: '真实姓名',
          bankName: '银行',
          bankcardNumber: '卡号',
          bankDeposit: '开户行',
        },
        placeholder: {
          bankcardMasterName: '银行卡户名与真实姓名须一致',
          bankName: '请选择银行',
          bankcardNumber: '请输入卡号',
          bankDeposit: '如 ：河北唐山建设银行',
        },
        toast: {
          bankcardMasterName: '真实姓名不能为空',
          bankName: '银行名称不能为空',
          bankcardNumber: '银行卡卡号不能为空',
          bankDeposit: '开户行不能为空',
          success: '成功绑定银行卡'
        },
        button: '添加'
      },
      phone: {
        title: '手机绑定',
        alreadyBind: '您已绑定手机号',
        form: {
          oldPhone: '原手机号',
          newPhone: '新手机号',
          phoneNumber: '手机号码',
          code: '验证码'
        },
        placeholder: {},
        button: {
          getCode: '获取验证码',
          bind: '立即绑定',
          modify: '立即更改'
        },
        toast: {
          oldPhoneNotNull: '原手机号不能为空',
          newPhoneNotNull: '新手机号不能为空',
          phoneNotNull: '手机号码不能为空',
          codeNotNull: '验证码不能为空',
          bindSuccess: '手机号码更改成功',
          modifySuccess: '绑定手机号码成功',
        },
        tips: {
          title: '温馨提示',
          tips1: '1.忘记密码时可以通过手机找回；',
          tips2: '2.运营商发送短信可能有延迟，请耐心等待几分钟；',
          tips3: '3.若几分钟后仍未收到验证码，请您重新获取或者联系',
          onLineService: '在线客服'
        }
      },
      password: {
        title: '修改登录密码',
        form: {
          password: '当前密码',
          newPassword: '新密码',
          confirmNewPassword: '确认密码',
          strong: '密码强度'
        },
        placeholder: {
          password: '请输入当前密码',
          newPassword: '请输入新密码',
          confirmNewPassword: '请再次输入新密码',
          code: '请输入验证码'
        },
        remainTimes: (val) => {
          return '您还有' + val + '次机会'
        },
        button: '确定',
        toast: {
          passwordNotNull: '当前密码不能为空',
          newPasswordNotNull: '新密码不能为空',
          confirmNewPasswordNotNull: '确认密码不能为空',
          newPasswordNotSame: '两次输入的新密码不一致，请重新输入后再提交',
          modifySuccess: '密码修改成功'
        }
      }
    },
    errorMessage: {
      403: '无权限访问StringTool',
      404: '请求链接或页面找不到',
      600: 'session过期',
      601: '需要输入安全密码',
      602: '服务忙',
      603: '域名不存在',
      604: '临时域名过期',
      605: 'ip被限制',
      606: '被强制踢出',
      607: '站点维护',
      608: '重复请求',
      609: '站点不存在',
      610: '用户未登录',
      500: '代码错误',
      502: '运维服务问题',
      1001: '您还没有登录',
      1005: '您的账号已被系统冻结，请联系客服处理',
      1008: '用户不存在',
      1011: '密码输入错误',
      1016: '新密码不能与旧密码相同',
      1017: '信息不存在',
      1022: '请输入正确的提现金额',
      1024: '今日提现次数已达上限',
      1031: '该活动不存在或已结束',
      1100: '已存在取款订单',
      1101: '取款玩家已被冻结',
      1102: '取款金额最少为x元',
      1103: '没有银行卡信息',
      1104: '取款金额应在x-x范围内，并且小于StringTool等于x',
      1105: '取款失败（data中有错误信息）',
      1200: '用户添加银行卡',
      1201: '展示银行卡信息',
      1202: '用户添加比特币',
      1204: '用户绑定比特币已存在',
      1205: '用户绑定比特币成功',
      1206: '用户绑定比特币失败',
      1207: '用户绑定银行卡号已存在',
      1208: '用户绑定银行卡号失败',
      1209: '用户保存申请优惠失败',
      1300: '真实姓名不能为空',
      1301: '验证码输入错误',
      1302: '真实姓名不正确',
      1303: '原始密码有误',
      1304: '真实姓名修改失败',
      1305: '安全密码不能为空',
      1306: '新密码不能为空',
      1307: '当前密码不能为空',
      1308: '验证码不能为空',
      1309: '修改密码失败',
      1310: '参数有误',
      1311: '安全密码过于简单',
      1400: '游戏不存在',
      1401: '更新失败',
      1402: '非免转不能一键回收',
      1403: '消息已读',
      1404: '未设置安全密码',
      1500: '注册失败，请联系客服！',
      1501: '禁止注册，请联系客服！',
      1502: '注册成功',
      1503: '用户已存在',
      1504: '真实姓名已存在',
      1505: 'QQ账号已被注册',
      1506: '手机号码已被注册',
      1507: '邮箱已被注册',
      1508: '微信已被注册'
    }
  }
}
