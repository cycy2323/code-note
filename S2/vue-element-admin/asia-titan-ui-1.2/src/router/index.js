import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/views/layout/Layout'

/* Router Modules */
// import componentsRouter from './modules/components'
// import chartsRouter from './modules/charts'
// import tableRouter from './modules/table'
// import nestedRouter from './modules/nested'
// import orderRouter from './modules/common/order'
// import paymentRouter from './modules/common/payment'
// import systemRouter from './modules/common/system'
// import cashierRouter from './modules/common/cashier'
// import manageAccountRouter from './modules/merchantQrCode/manageAccount'

// 管理后台
import manageOrderManageRouter from './modules/manage/orderManage'
import financeManageRouter from './modules/manage/financeManage'
import employeeManageRouter from './modules/manage/employeeManage'
import manageAgentManageRouter from './modules/manage/agentManage'
import systemManageRouter from './modules/manage/systemManage'
import channelManage from './modules/manage/channelManage'
import merchantOrderManageRouter from './modules/manage/merchantAccountManage'

// 代理后台
import agentManageRouter from './modules/agency/agentManage'
import orderManageRouter from './modules/agency/orderManage'
import merchantManageRouter from './modules/agency/merchantManage'
import orderStatisticsManageRouter from './modules/agency/orderStatisticsManage'

// 商户后台
import merchantInfoRouter from './modules/merchant/merchantInfo'
import merchantSysSetting from './modules/merchant/merchantSysSetting'
import merchantOrderCheckRouter from './modules/merchant/merchantOrderCheck'
import merchantSubAccounRouter from './modules/merchant/subAccounManage'
import merchantTransferRouter from './modules/merchant/transferManage'

export const constantRouterMap = [
  {
    path: '',
    component: Layout,
    redirect: 'home',
    meta: { roles: ['all'] },
    children: [
      {
        path: 'home',
        component: () => {
          if (document.domain === Vue.prototype.MerchantHost) {
            return import('@/view/merchant/home/home_index')
          } else if (document.domain === Vue.prototype.ManageHost) {
            return import('@/view/manage/home/home_index')
          } else if (document.domain === Vue.prototype.AgentHost) {
            return import('@/view/agency/home/home_index')
          }
        },
        name: 'Home',
        meta: { title: 'home', icon: 'home', noCache: false }
      }
    ]
  },
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/reset/:typeId',
    component: () => import('@/view/common/resetPassword'),
    name: 'reset',
    hidden: true
  },
  {
    path: '/recharge/:id',
    component: () => import('@/view/merchant/recharge/recharge'),
    name: 'recharge',
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/errorPage/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/errorPage/401'),
    hidden: true
  }
  // {
  //   path: '',
  //   component: Layout,
  //   redirect: 'receipts',
  //   hidden: true,
  //   children: [
  //     {
  //       path: 'receipts',
  //       component: () => import('@/view/agent/receipts/receipts'),
  //       name: 'receipts',
  //       meta: { title: 'receipts', icon: 'receipts', noCache: true, roles: ['agent'] }
  //     }
  //   ]
  // },
  // {
  //   path: '',
  //   component: Layout,
  //   redirect: 'extension',
  //   hidden: true,
  //   children: [
  //     {
  //       path: 'extension',
  //       component: () => import('@/view/agent/extension/extension'),
  //       name: 'extension',
  //       meta: { title: 'extension', icon: 'extension', noCache: true, roles: ['agent'] }
  //     }
  //   ]
  // },
  // {
  //   path: '',
  //   component: Layout,
  //   redirect: 'extractCash',
  //   hidden: true,
  //   children: [
  //     {
  //       path: 'extractCash',
  //       component: () => import('@/view/agent/extractCash/extractCash'),
  //       name: 'extractCash',
  //       meta: { title: 'extractCash', icon: 'extractCash', noCache: true, roles: ['agent'] }
  //     }
  //   ]
  // },
  // {
  //   path: '',
  //   component: Layout,
  //   redirect: 'cashier',
  //   hidden: true,
  //   children: [
  //     {
  //       path: 'cashier',
  //       component: () => import('@/view/common/cashier'),
  //       name: 'cashier',
  //       meta: { title: 'cashier', icon: 'openCashier', noCache: true }
  //     }
  //   ]
  // },
  // {
  //   path: '',
  //   component: Layout,
  //   redirect: 'quartz',
  //   children: [
  //     {
  //       path: 'quartz',
  //       component: () => import('@/view/manage/quartz/quartzManage'),
  //       name: 'quartz',
  //       meta: { title: 'quartz', icon: 'extension', noCache: true }
  //     }
  //   ]
  // },
  // {
  //   path: '',
  //   component: Layout,
  //   redirect: 'basicInfo',
  //   hidden: true,
  //   children: [
  //     {
  //       path: 'basicInfo',
  //       component: () => import('@/view/agent/basicInfo/basicInfo'),
  //       name: 'basicInfo',
  //       meta: { title: 'basicInfo', icon: 'basicInfo', noCache: true, roles: ['agent'] }
  //     }
  //   ]
  // },
  // {
  //   path: '',
  //   component: Layout,
  //   redirect: 'manageBasicInfo',
  //   children: [
  //     {
  //       path: 'manageBasicInfo',
  //       component: () => import('@/view/manage/basicInfo/basicInfo'),
  //       name: 'manageBasicInfo',
  //       meta: { title: 'basicInfo', icon: 'basicInfo' }
  //     }
  //   ]
  // },
  // {
  //   path: '/openCashier/:merUUID',
  //   name: 'openCashier',
  //   component: () => import('@/view/openService/openCashier'),
  //   hidden: true
  // },
  // {
  //   path: '/auth-redirect',
  //   component: () => import('@/views/login/authredirect'),
  //   hidden: true
  // },
  // {
  //   path: '/dashboard',
  //   component: Layout,
  //   redirect: 'dashboard',
  //   hidden: true,
  //   children: [
  //     {
  //       path: 'dashboard',
  //       component: () => import('@/views/dashboard/index'),
  //       name: 'Dashboard',
  //       meta: { title: 'dashboard', icon: 'dashboard', noCache: true }
  //     }
  //   ]
  // },
  // {
  //   path: '/documentation',
  //   component: Layout,
  //   redirect: '/documentation/index',
  //   hidden: true,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/documentation/index'),
  //       name: 'Documentation',
  //       meta: { title: 'documentation', icon: 'documentation', noCache: true }
  //     }
  //   ]
  // },
  // {
  //   path: '/guide',
  //   component: Layout,
  //   redirect: '/guide/index',
  //   hidden: true,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/guide/index'),
  //       name: 'Guide',
  //       meta: { title: 'guide', icon: 'guide', noCache: true }
  //     }
  //   ]
  // }
]

export default new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const adminRouterMap = [
  {
    path: '/modifyPassword',
    component: Layout,
    meta: { roles: ['all'] },
    children: [
      {
        path: 'index',
        component: () => import('@/view/common/resetPassword'),
        name: 'modifyPassword',
        meta: { title: 'modifyPassword', icon: 'password', noCache: true }
      }
    ]
  },
  manageOrderManageRouter,
  merchantOrderManageRouter,
  channelManage,
  financeManageRouter,
  employeeManageRouter,
  manageAgentManageRouter,
  systemManageRouter
]

export const merchantRouterMap = [
  merchantInfoRouter,
  merchantOrderCheckRouter,
  merchantSubAccounRouter,
  merchantTransferRouter,
  merchantSysSetting
]

export const agentRouterMap = [
  {
    path: '/modifyPassword',
    component: Layout,
    meta: { roles: ['all'] },
    children: [
      {
        path: 'index',
        component: () => import('@/view/common/resetPassword'),
        name: 'modifyPassword',
        meta: { title: 'modifyPassword', icon: 'password', noCache: true }
      }
    ]
  },
  merchantManageRouter,
  orderManageRouter,
  agentManageRouter,
  orderStatisticsManageRouter
]
