// import Vue from 'vue'
// import Router from 'vue-router'

/* Layout */
import Layout from '@/views/layout/Layout'

// Vue.use(Router)
// import orderRouter from './order'

const merchantInfoRouter = {
  path: '/merchantInfo',
  component: Layout,
  redirect: '/merchantInfo/baseInfo',
  alwaysShow: true,
  name: 'merchantInfo',
  meta: {title: '商户信息', head: true, icon: 'baseSet'},
  children: [
    { // 基本资料
      path: 'baseInfo',
      component: () => import('@/views/merchant/merchantInfo/baseInfo'),
      name: 'baseInfo',
      meta: { title: '基本信息', noCache: false }
    },
    { // 登录日志
      path: 'loginLog',
      component: () => import('@/views/merchant/merchantInfo/loginLog'),
      name: 'loginLog',
      meta: { title: '登录日志', noCache: false }
    },
    { // 修改密码
      path: 'changePassword',
      component: () => import('@/views/merchant/merchantInfo/changePassword'),
      name: 'changePassword',
      meta: { title: '修改密码', noCache: false }
    },
    { // 登录IP设置
      path: 'loginIPSet',
      component: () => import('@/views/merchant/merchantInfo/loginIPSet'),
      name: 'loginIPSet',
      meta: { title: '登录IP设置', noCache: false }
    },
    { // 用户管理
      path: 'userManage',
      component: () => import('@/views/merchant/merchantInfo/userManage'),
      name: 'userManage',
      meta: { title: '用户管理', noCache: false }
    },
    { // 权限设置
      path: 'competenceSet',
      component: () => import('@/views/merchant/merchantInfo/competenceSet'),
      name: 'competenceSet',
      meta: { title: '权限设置', noCache: false }
    },
    { // 操作日志
      path: 'operateLog',
      component: () => import('@/views/merchant/merchantInfo/operateLog'),
      name: 'operateLog',
      meta: { title: '操作日志', noCache: false }
    },
    { // 支付密码设置
      path: 'payPasswordSet',
      component: () => import('@/views/merchant/merchantInfo/payPasswordSet'),
      name: 'payPasswordSet',
      meta: { title: '支付密码设置', noCache: false }
    }
  ]
}

export default merchantInfoRouter
