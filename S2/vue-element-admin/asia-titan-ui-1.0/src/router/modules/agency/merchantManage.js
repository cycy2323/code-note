import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/views/layout/Layout'
// import orderRouter from './order'

const merchantManageRouter = { // 商户管理
  path: '/agentMerchantManage',
  component: Layout,
  redirect: 'agentMerchantManage',
  alwaysShow: true,
  meta: {
    title: 'agentMerchantManage',
    icon: 'merchant',
    roles: ['agent']
  },
  children: [
    {
      path: 'PlatformMerchant',
      component: () => import('@/view/agency/merchantManage/PlatformMerchant'),
      name: 'PlatformMerchant',
      meta: { title: 'PlatformMerchant', noCache: false }
    }
  ]
}

export default merchantManageRouter
