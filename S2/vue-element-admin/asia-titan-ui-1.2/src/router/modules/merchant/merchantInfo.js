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
    //   component: resolve => require(['@/view/merchant/merchantInfo/merchantWithdrawList'], resolve),
    //   name: 'merchantWithdrawList',
    //   meta: { title: 'merchantWithdrawList', noCache: true }
    // },
    {
      path: 'merchantWithdrawModel',
      component: resolve => require(['@/view/merchant/merchantInfo/merchantWithdrawModel'], resolve),
      name: 'MerchantWithdrawModel',
      meta: { title: 'merchantWithdrawModel', noCache: false }
    },
    {
      path: 'merchantRecharge',
      component: resolve => require(['@/view/merchant/merchantInfo/merchantRecharge'], resolve),
      name: 'MerchantRecharge',
      meta: { title: 'merchantRecharge', noCache: false }
    },
    {
      path: 'merchantTransferDetail',
      component: resolve => require(['@/view/merchant/merchantInfo/merchantTransferDetail'], resolve),
      name: 'MerchantTransferDetail',
      meta: { title: 'merchantTransferDetail', noCache: false }
    }
    //  展示demo
    // {
    //   path: 'merchantTransferDetail',
    //   component: resolve => require(['@/view/merchant1/accountManage/agentAccount'], resolve),
    //   name: 'merchantTransferDetail',
    //   meta: { title: 'demo展示', noCache: true }
    // }
  ]
}

export default merchantInfoRouter
