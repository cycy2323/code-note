/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/views/layout/Layout'

const orderManageRouter = {
  path: '/orderManage',
  component: Layout,
  hidden: false,
  redirect: 'noredirect',
  name: 'orderManage',
  meta: {
    title: 'orderManage',
    icon: 'list'
  },
  children: [
    {
      path: 'orderList',
      component: () => import('@/projectViews/Console/orderManage/orderList'),
      name: 'orderList',
      meta: { title: 'orderList', noCache: true }
    },
    {
      path: 'withdrawList',
      component: () => import('@/projectViews/Console/orderManage/withdrawList'),
      name: 'withdrawList',
      meta: { title: 'withdrawList', noCache: true }
    },
    {
      path: 'withdrawListReject',
      component: () => import('@/projectViews/Console/orderManage/withdrawListReject'),
      name: 'withdrawListReject',
      meta: { title: 'withdrawListReject', noCache: true }
    }
  ]
}

export default orderManageRouter
