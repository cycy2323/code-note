import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/views/layout/Layout'

/* Router Modules */
import componentsRouter from './modules/components'
import chartsRouter from './modules/charts'
import tableRouter from './modules/table'
import nestedRouter from './modules/nested'
import orderRouter from './modules/common/order'
import paymentRouter from './modules/common/payment'
import systemRouter from './modules/common/system'
import cashierRouter from './modules/common/cashier'
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
    path: '',
    component: Layout,
    redirect: 'receipts',
    hidden: true,
    children: [
      {
        path: 'receipts',
        component: () => import('@/view/agent/receipts/receipts'),
        name: 'receipts',
        meta: { title: 'receipts', icon: 'receipts', noCache: true, roles: ['agent'] }
      }
    ]
  },
  {
    path: '',
    component: Layout,
    redirect: 'basicInfo',
    hidden: true,
    children: [
      {
        path: 'basicInfo',
        component: () => import('@/view/agent/basicInfo/basicInfo'),
        name: 'basicInfo',
        meta: { title: 'basicInfo', icon: 'basicInfo', noCache: true, roles: ['agent'] }
      }
    ]
  },
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
  {
    path: '',
    component: Layout,
    redirect: 'extractCash',
    hidden: true,
    children: [
      {
        path: 'extractCash',
        component: () => import('@/view/agent/extractCash/extractCash'),
        name: 'extractCash',
        meta: { title: 'extractCash', icon: 'extractCash', noCache: true, roles: ['agent'] }
      }
    ]
  },
  {
    path: '',
    component: Layout,
    redirect: 'extension',
    hidden: true,
    children: [
      {
        path: 'extension',
        component: () => import('@/view/agent/extension/extension'),
        name: 'extension',
        meta: { title: 'extension', icon: 'extension', noCache: true, roles: ['agent'] }
      }
    ]
  },
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
  {
    path: '',
    component: Layout,
    redirect: 'cashier',
    hidden: true,
    children: [
      {
        path: 'cashier',
        component: () => import('@/view/common/cashier'),
        name: 'cashier',
        meta: { title: 'cashier', icon: 'openCashier', noCache: true }
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
    path: '/openCashier/:merUUID',
    name: 'openCashier',
    component: () => import('@/view/openService/openCashier'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/authredirect'),
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
  },
  {
    path: '/dashboard',
    component: Layout,
    redirect: 'dashboard',
    hidden: true,
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: 'dashboard', icon: 'dashboard', noCache: true }
      }
    ]
  },
  {
    path: '/documentation',
    component: Layout,
    redirect: '/documentation/index',
    hidden: true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/documentation/index'),
        name: 'Documentation',
        meta: { title: 'documentation', icon: 'documentation', noCache: true }
      }
    ]
  },
  {
    path: '/guide',
    component: Layout,
    redirect: '/guide/index',
    hidden: true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/guide/index'),
        name: 'Guide',
        meta: { title: 'guide', icon: 'guide', noCache: true }
      }
    ]
  }
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

export const asyncRouterMap = [
  {
    path: '/permission',
    component: Layout,
    redirect: '/permission/index',
    alwaysShow: true, // will always show the root menu
    meta: {
      title: 'permission',
      icon: 'lock',
      roles: ['permission', 'editor'] // you can set roles in root nav
    },
    children: [
      {
        path: 'page',
        component: () => import('@/views/permission/page'),
        name: 'PagePermission',
        meta: {
          title: 'pagePermission',
          roles: ['admin'] // or you can only set roles in sub nav
        }
      },
      {
        path: 'directive',
        component: () => import('@/views/permission/directive'),
        name: 'DirectivePermission',
        meta: {
          title: 'directivePermission'
          // if do not set roles, means: this page does not require permission
        }
      }
    ]
  },

  {
    path: '/icon',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/svg-icons/index'),
        name: 'Icons',
        meta: { title: 'icons', icon: 'icon', noCache: true }
      }
    ]
  },
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

  /** When your routing table is too long, you can split it into small modules**/
  merchantManageRouter,
  orderManageRouter,
  agentManageRouter,
  orderStatisticsManageRouter,
  // registerRouter,
  manageOrderManageRouter,
  merchantOrderManageRouter,
  channelManage,
  financeManageRouter,
  employeeManageRouter,
  manageAgentManageRouter,
  systemManageRouter,
  // staffManageRouter,
  // 商户
  merchantSysSetting,
  merchantInfoRouter,
  merchantOrderCheckRouter,
  merchantSubAccounRouter,
  merchantTransferRouter,

  componentsRouter,
  chartsRouter,
  nestedRouter,
  tableRouter,
  orderRouter,
  paymentRouter,
  systemRouter,
  cashierRouter,

  {
    path: '/example',
    component: Layout,
    redirect: '/example/list',
    name: 'Example',
    meta: {
      title: 'example',
      icon: 'example'
    },
    children: [
      {
        path: 'create',
        component: () => import('@/views/example/create'),
        name: 'CreateArticle',
        meta: { title: 'createArticle', icon: 'edit' }
      },
      {
        path: 'edit/:id(\\d+)',
        component: () => import('@/views/example/edit'),
        name: 'EditArticle',
        meta: { title: 'editArticle', noCache: true },
        hidden: true
      },
      {
        path: 'list',
        component: () => import('@/views/example/list'),
        name: 'ArticleList',
        meta: { title: 'articleList', icon: 'list' }
      }
    ]
  },

  {
    path: '/tab',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/tab/index'),
        name: 'Tab',
        meta: { title: 'tab', icon: 'tab' }
      }
    ]
  },

  {
    path: '/error',
    component: Layout,
    redirect: 'noredirect',
    name: 'ErrorPages',
    meta: {
      title: 'errorPages',
      icon: '404'
    },
    children: [
      {
        path: '401',
        component: () => import('@/views/errorPage/401'),
        name: 'Page401',
        meta: { title: 'page401', noCache: true }
      },
      {
        path: '404',
        component: () => import('@/views/errorPage/404'),
        name: 'Page404',
        meta: { title: 'page404', noCache: true }
      }
    ]
  },

  {
    path: '/error-log',
    component: Layout,
    redirect: 'noredirect',
    children: [
      {
        path: 'log',
        component: () => import('@/views/errorLog/index'),
        name: 'ErrorLog',
        meta: { title: 'errorLog', icon: 'bug' }
      }
    ]
  },

  {
    path: '/excel',
    component: Layout,
    redirect: '/excel/export-excel',
    name: 'Excel',
    meta: {
      title: 'excel',
      icon: 'excel'
    },
    children: [
      {
        path: 'export-excel',
        component: () => import('@/views/excel/exportExcel'),
        name: 'ExportExcel',
        meta: { title: 'exportExcel' }
      },
      {
        path: 'export-selected-excel',
        component: () => import('@/views/excel/selectExcel'),
        name: 'SelectExcel',
        meta: { title: 'selectExcel' }
      },
      {
        path: 'upload-excel',
        component: () => import('@/views/excel/uploadExcel'),
        name: 'UploadExcel',
        meta: { title: 'uploadExcel' }
      }
    ]
  },

  {
    path: '/zip',
    component: Layout,
    redirect: '/zip/download',
    alwaysShow: true,
    meta: { title: 'zip', icon: 'zip' },
    children: [
      {
        path: 'download',
        component: () => import('@/views/zip/index'),
        name: 'zip',
        meta: { title: 'zip' }
      }
    ]
  },

  {
    path: '/theme',
    component: Layout,
    redirect: 'noredirect',
    children: [
      {
        path: 'index',
        component: () => import('@/views/theme/index'),
        name: 'Theme',
        meta: { title: 'theme', icon: 'theme' }
      }
    ]
  },

  {
    path: '/clipboard',
    component: Layout,
    redirect: 'noredirect',
    children: [
      {
        path: 'index',
        component: () => import('@/views/clipboard/index'),
        name: 'ClipboardDemo',
        meta: { title: 'clipboardDemo', icon: 'clipboard' }
      }
    ]
  },

  {
    path: '/i18n',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/i18n-demo/index'),
        name: 'I18n',
        meta: { title: 'i18n', icon: 'international' }
      }
    ]
  },

  {
    path: 'external-link',
    component: Layout,
    children: [
      {
        path: 'https://github.com/PanJiaChen/vue-element-admin',
        meta: { title: 'externalLink', icon: 'link' }
      }
    ]
  },

  { path: '*', redirect: '/404', hidden: true }
]
