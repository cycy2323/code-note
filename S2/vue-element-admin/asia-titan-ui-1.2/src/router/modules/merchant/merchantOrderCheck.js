/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/views/layout/Layout'

const merchantOrderCheckRouter = {
  path: '/merchantOrderCheck',
  component: Layout,
  hidden: false,
  alwaysShow: true,
  redirect: 'noredirect',
  name: 'merchantOrderCheck',
  meta: {
    title: 'merchantOrderCheck',
    icon: 'order',
    roles: ['merchant']
  },
  children: [
    {
      path: 'merchantTransactionOrder',
      component: resolve => require(['@/view/merchant/merchantOrderCheck/merchantTransactionOrder'], resolve),
      name: 'MerchantTransactionOrder',
      meta: { title: 'merchantTransactionOrder', noCache: false }
    },
    {
      path: 'merchantPaidOrder',
      component: resolve => require(['@/view/merchant/merchantOrderCheck/merchantPaidOrder'], resolve),
      name: 'MerchantPaidOrder',
      meta: { title: 'merchantPaidOrder', noCache: false }
    },
    {
      path: 'interceptPaidOrder',
      component: resolve => require(['@/view/merchant/merchantOrderCheck/interceptPaidOrder'], resolve),
      name: 'InterceptPaidOrder',
      meta: { title: 'interceptPaidOrder', noCache: false }
    },
    {
      path: 'PaidOrderAudit',
      component: resolve => require(['@/view/merchant/merchantOrderCheck/PaidOrderAudit'], resolve),
      name: 'PaidOrderAudit',
      meta: { title: 'PaidOrderAudit', noCache: false }
    }
  ]
}

export default merchantOrderCheckRouter
