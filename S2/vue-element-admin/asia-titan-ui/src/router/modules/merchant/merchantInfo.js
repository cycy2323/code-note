/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/views/layout/Layout'

const merchantInfoRouter = {
  path: '/merchantInfo',
  component: Layout,
  hidden: false,
  alwaysShow: true,
  redirect: 'noredirect',
  name: 'merchantInfo',
  meta: {
    title: 'merchantInfo',
    icon: 'merchant',
    roles: ['merchant']
  },
  children: [
    // {
    //   path: 'merchantWithdrawList',
    //   component: () => import('@/view/merchant/merchantInfo/merchantWithdrawList'),
    //   name: 'merchantWithdrawList',
    //   meta: { title: 'merchantWithdrawList', noCache: true }
    // },
    {
      path: 'merchantWithdrawModel',
      component: () => import('@/view/merchant/merchantInfo/merchantWithdrawModel'),
      name: 'MerchantWithdrawModel',
      meta: { title: 'merchantWithdrawModel', noCache: false }
    },
    {
      path: 'merchantRecharge',
      component: () => import('@/view/merchant/merchantInfo/merchantRecharge'),
      name: 'MerchantRecharge',
      meta: { title: 'merchantRecharge', noCache: false }
    },
    {
      path: 'merchantTransferDetail',
      component: () => import('@/view/merchant/merchantInfo/merchantTransferDetail'),
      name: 'MerchantTransferDetail',
      meta: { title: 'merchantTransferDetail', noCache: false }
    }
    //  展示demo
    // {
    //   path: 'merchantTransferDetail',
    //   component: () => import('@/view/merchant1/accountManage/agentAccount'),
    //   name: 'merchantTransferDetail',
    //   meta: { title: 'demo展示', noCache: true }
    // }
  ]
}

export default merchantInfoRouter
