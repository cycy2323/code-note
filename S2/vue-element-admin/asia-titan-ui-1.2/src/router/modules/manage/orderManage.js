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
      component: resolve => require(['@/view/manage/orderManage/payOrder'], resolve),
      name: 'PayOrder',
      meta: { title: 'payOrder', noCache: false }
    },
    {
      path: 'withdrawList',
      component: resolve => require(['@/view/manage/orderManage/withdrawList'], resolve),
      name: 'WithdrawList',
      meta: { title: 'withdrawList', noCache: false }
    },
    {
      path: 'withdrawListReject',
      component: resolve => require(['@/view/manage/orderManage/withdrawListReject'], resolve),
      name: 'WithdrawListReject',
      meta: { title: 'withdrawListReject', noCache: false }
    },
    {
      path: 'withdrawPendingRefund',
      component: resolve => require(['@/view/manage/orderManage/withdrawPendingRefund'], resolve),
      name: 'WithdrawPendingRefund',
      meta: { title: 'withdrawPendingRefund', noCache: false }
    },
    {
      path: 'fundChangeRecord',
      component: resolve => require(['@/view/manage/merchantManage/fundChangeRecord'], resolve),
      name: 'FundChangeRecord',
      meta: { title: 'fundChangeRecord', noCache: false }
    },
    {
      path: 'transferRecord',
      component: resolve => require(['@/view/manage/merchantManage/transferRecord'], resolve),
      name: 'TransferRecord',
      meta: { title: 'manageTransferRecord', noCache: false }
    },
    {
      path: 'paidBanksRecord',
      component: resolve => require(['@/view/manage/orderManage/paidBanksRecord'], resolve),
      name: 'PaidBanksRecord',
      meta: { title: 'paidBanksRecord', noCache: false }
    },
    {
      path: 'patchNotes',
      component: resolve => require(['@/view/manage/orderManage/patchNotes'], resolve),
      name: 'PatchNotes',
      meta: { title: 'patchNotes', noCache: false }
    }
  ]
}

export default orderManageRouter
