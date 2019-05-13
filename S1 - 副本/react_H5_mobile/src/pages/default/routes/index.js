/**
 * @description: 定义路由
 *
 * @author: nick
 *
 * @create: 2018-12-16 19:16
 **/
export default [
  //登录
  {
    path: '/login',
    meta: {
      title: 'view.local.login'
    },
    exact: true,
    component: () => import(/* webpackChunkName: "view/login/loginPage" */ '@/views/login/LoginPage')
  },
  //找回密码
  {
    path: '/login/retrieve',
    meta: {
      title: 'view.local.login'
    },
    exact: true,
    component: () => import(/* webpackChunkName: "view/login/" */ '@/views/login/RetrievePswPage')
  },
  //注册
  {
    path: '/signup',
    meta: {
      title: 'view.local.register',
      name: 'signup'
    },
    component: () => import(/* webpackChunkName: "view/register" */ '@/views/register/RegisterPage'),
    routes: [
      {
        path: '/signup/index',
        meta: {
          title: 'view.local.signUp.title',
          name: 'signUp.index'
        },
        exact: true,
        component: () => import(/* webpackChunkName: "view/home/child/index" */ '@/views/register/child/RegisterView')
      }, {
        path: '/signup/agreement',
        meta: {
          title: 'view.local.home.main',
          name: 'signUp.agreemnet'
        },
        component: () => import(/* webpackChunkName: "view/home/child/index" */ '@/views/register/child/RegAgreementView')
      },
    ]
  },
  /**首页**/
  {
    path: '/index',
    meta: {
      title: 'view.local.home.title'
    },
    // exact: true,
    component: () => import(/* webpackChunkName: "view/home/home" */ '@/views/index/IndexPage')
  },
  // 稽核页面
  {
    path: '/audit',
    meta: {
      title: 'view.local.home.saving.audit'
    },
    exact: true,
    component: () => import(/* webpackChunkName: "view/home/child/index" */ '@/views/index/saving/child/Audit')
  },
  // 电子游戏列表
  {
    path: '/videoGamesList',
    meta: {
      title: 'view.local.home.index.videoGameList'
    },
    exact: true,
    component: () => import(/* webpackChunkName: "view/home/child/index" */ '@/views/videoGameList/VideoGameListPage')
  },
  // 余额不足页面
  {
    path: '/balanceWarning',
    meta: {
      title: 'view.local.home.saving.balanceWarning'
    },
    exact: true,
    component: () => import(/* webpackChunkName: "view/home/child/index" */ '@/views/index/saving/child/BalanceWarning')
  },
  /*下载页面*/
  {
    path: '/download',
    meta: {
      title: 'view.local.DownloadPage.title'
    },
    exact: true,
    component: () => import(/* webpackChunkName: "view/home/child/index" */ '@/views/download/DownloadPage')
  },
  /*收件箱*/
  {
    path: '/message/inbox',
    meta: {
      title: 'view.local.home.saving.balanceWarning'
    },
    exact: false,
    component: () => import(/* webpackChunkName: "view/home/child/index" */ '@/views/message/InboxPage')
  },
  /*消息中心*/
  {
    path: '/message/notice',
    meta: {
      title: 'view.local.home.saving.balanceWarning'
    },
    exact: true,
    component: () => import(/* webpackChunkName: "view/home/child/index" */ '@/views/message/NoticePage')
  },
  /*投注记录*/
  {
    path: '/fund/betting',
    meta: {
      title: 'view.local.home.saving.balanceWarning'
    },
    exact: true,
    component: () => import(/* webpackChunkName: "view/home/child/index" */ '@/views/bettingRecord/BettingPage')
  },
  /*投注记录详情*/
  {
    path: '/fund/betting/gameRecordDetail',
    meta: {
      title: 'view.local.home.saving.balanceWarning'
    },
    exact: true,
    component: () => import(/* webpackChunkName: "view/home/child/index" */ '@/views/bettingRecord/child/DetailView')
  },
  //资金记录
  {
    path: '/fund/record',
    meta: {
      title: 'view.local.home.saving.balanceWarning'
    },
    exact: true,
    component: () => import(/* webpackChunkName: "view/home/child/index" */ '@/views/fundRecord/FundRecordPage')
  },
  //资金明细details
  {
    path: '/fund/record/details',
    meta: {
      title: 'view.local.home.saving.balanceWarning'
    },
    exact: true,
    component: () => import(/* webpackChunkName: "view/home/child/index" */ '@/views/fundRecord/child/DetailView')
  }
  , /*安全中心*/
  {
    path: '/security',
    meta: {
      title: 'view.local.home.saving.balanceWarning'
    },
    exact: true,
    component: () => import(/* webpackChunkName: "view/home/child/index" */ '@/views/security/SecurityPage')
  },
  {
    path: '/security/code',
    meta: {
      title: 'view.local.home.saving.balanceWarning'
    },
    exact: true,
    component: () => import(/* webpackChunkName: "view/home/child/index" */ '@/views/security/child/ModifySecurityCodeView')
  },
  {
    path: '/security/psw',
    meta: {
      title: 'view.local.home.saving.balanceWarning'
    },
    exact: true,
    component: () => import(/* webpackChunkName: "view/home/child/index" */ '@/views/security/child/ModifyPswView')
  },
  {
    path: '/security/bankcard',
    meta: {
      title: 'view.local.home.saving.balanceWarning'
    },
    exact: true,
    component: () => import(/* webpackChunkName: "view/home/child/index" */ '@/views/security/child/BindBankCardView')
  },
  {
    path: '/security/mobile',
    meta: {
      title: 'view.local.home.saving.balanceWarning'
    },
    exact: true,
    component: () => import(/* webpackChunkName: "view/home/child/index" */ '@/views/security/child/BindMobileView')
  },
  /*优惠记录*/
  {
    path: '/promo/record',
    meta: {
      title: 'view.local.home.saving.balanceWarning'
    },
    exact: true,
    component: () => import(/* webpackChunkName: "view/home/child/index" */ '@/views/promo/PromoRecordPage')
  },
  /*推广中心*/
  {
    path: '/recommend',
    meta: {
      title: 'view.local.home.saving.balanceWarning'
    },
    exact: true,
    component: () => import(/* webpackChunkName: "view/home/child/index" */ '@/views/recommend/RecommendPage')
  },
  /*推广中心*/
  {
    path: '/demo',
    meta: {
      title: 'view.local.home.saving.balanceWarning'
    },
    exact: true,
    component: () => import(/* webpackChunkName: "view/home/child/index" */ '@/views/demo/Demo')
  },
  /*
  * 提供页面给原生调用
  * 1、存款: /wallet/deposit/index.html
    2、转账:/transfer/index.html
    3、优惠详细:/promo/promoDetail.html?searchId=
    4、关于我们:/about.html?path=about
    5、注册条款:/getRegisterRules.html?path=terms
    6、常见问题:/help/firstType.html
  * */
  {
    path: '/deposit/detail',
    meta: {
      title: 'view.local.home.saving.balanceWarning'
    },
    exact: true,
    component: () => import(/* webpackChunkName: "view/home/child/index" */ '@/views/index/saving/deposit/DepositDetailPage')
  },
  {
    path: '/wallet/deposit/index',
    meta: {
      title: 'view.local.home.saving.balanceWarning'
    },
    exact: true,
    component: () => import(/* webpackChunkName: "view/home/child/index" */ '@/views/index/saving/deposit/DepositPage')
  },
]
