// import Vue from 'vue'
// import Router from 'vue-router'

/* Layout */
import Layout from '@/views/layout/Layout'

// Vue.use(Router)
// import orderRouter from './order'

const withdrawManageRouter = {
  path: '/withdrawManage',
  component: Layout,
  redirect: '/withdrawManage/paidVerify',
  alwaysShow: true,
  name: 'withdrawManage',
  meta: {title: '提现管理', head: true, icon: 'process'},
  children: [
    { // 代付审核
      path: 'paidVerify',
      component: () => import('@/views/merchant/withdrawManage/paidVerify'),
      name: 'paidVerify',
      meta: { title: '代付审核', noCache: false }
    },
    { // 代付记录
      path: 'paidRecord',
      component: () => import('@/views/merchant/withdrawManage/paidRecord'),
      name: 'paidRecord',
      meta: { title: '代付记录', noCache: false }
    },
    { // 即时下发
      path: 'instantDelivery',
      component: () => import('@/views/merchant/withdrawManage/instantDelivery'),
      name: 'instantDelivery',
      meta: { title: '即时下发', noCache: false }
    },
    { // 即时记录
      path: 'instantRecords',
      component: () => import('@/views/merchant/withdrawManage/instantRecords'),
      name: 'instantRecords',
      meta: { title: '即时记录', noCache: false }
    }
  ]
}

export default withdrawManageRouter
