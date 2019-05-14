import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/views/layout/Layout'
// import orderRouter from './order'

const orderManageRouter = { // 订单管理
  path: '/agentOrderManage',
  component: Layout,
  redirect: 'orderManage',
  meta: {
    title: 'orderManage',
    icon: 'order',
    roles: ['agent']
  },
  children: [
    {
      path: 'TransactionOrder',
      component: () => import('@/view/agency/orderManage/TransactionOrder'),
      name: 'TransactionOrder',
      meta: { title: 'TransactionOrder', noCache: false }
    },
    {
      path: 'PaidOrder',
      component: () => import('@/view/agency/orderManage/PaidOrder'),
      name: 'PaidOrder',
      meta: { title: 'PaidOrder', noCache: false }
    }
  ]
}

export default orderManageRouter
