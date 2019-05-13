/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/views/layout/Layout'

const orderManageRouter = {
  path: '/orderManage',
  component: Layout,
  hidden: false,
  redirect: 'noredirect',
  name: 'OrderManage',
  meta: {
    title: 'orderManage',
    icon: 'order',
    roles: ['admin']
  },
  children: [
    {
      path: 'payOrder',
      component: () => import('@/view/manage/orderManage/payOrder'),
      name: 'PayOrder',
      meta: { title: 'payOrder', noCache: false }
    },
    {
      path: 'withdrawList',
      component: () => import('@/view/manage/orderManage/withdrawList'),
      name: 'WithdrawList',
      meta: { title: 'withdrawList', noCache: false }
    },
    {
      path: 'withdrawListReject',
      component: () => import('@/view/manage/orderManage/withdrawListReject'),
      name: 'WithdrawListReject',
      meta: { title: 'withdrawListReject', noCache: false }
    },
    {
      path: 'fundChangeRecord',
      component: () => import('@/view/manage/merchantManage/fundChangeRecord'),
      name: 'FundChangeRecord',
      meta: { title: 'fundChangeRecord', noCache: false }
    },
    {
      path: 'transferRecord',
      component: () => import('@/view/manage/merchantManage/transferRecord'),
      name: 'TransferRecord',
      meta: { title: 'manageTransferRecord', noCache: false }
    }
  ]
}

export default orderManageRouter
