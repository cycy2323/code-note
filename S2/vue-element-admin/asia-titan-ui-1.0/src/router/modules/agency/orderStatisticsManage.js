import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/views/layout/Layout'
// import orderRouter from './order'

const orderStatisticsManageRouter = { // 订单统计管理
  path: '/orderStatistics',
  component: Layout,
  redirect: 'orderStatisticsManage',
  meta: {
    title: 'orderStatisticsManage',
    icon: 'statistics',
    roles: ['agent']
  },
  children: [
    {
      path: 'TransactionStatistics',
      component: () => import('@/view/agency/orderStatisticsManage/TransactionStatistics'),
      name: 'TransactionStatistics',
      meta: { title: 'TransactionStatistics', noCache: false }
    },
    {
      path: 'PaidStatistics',
      component: () => import('@/view/agency/orderStatisticsManage/PaidStatistics'),
      name: 'PaidStatistics',
      meta: { title: 'PaidStatistics', noCache: false }
    }
  ]
}

export default orderStatisticsManageRouter
