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
      component: resolve => require(['@/view/agency/orderManage/TransactionOrder'], resolve),
      name: 'TransactionOrder',
      meta: { title: 'TransactionOrder', noCache: false }
    },
    {
      path: 'PaidOrder',
      component: resolve => require(['@/view/agency/orderManage/PaidOrder'], resolve),
      name: 'PaidOrder',
      meta: { title: 'PaidOrder', noCache: false }
    }
  ]
}

export default orderManageRouter
