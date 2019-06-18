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
      component: () => import('@/view/merchant/merchantOrderCheck/merchantTransactionOrder'),
      name: 'MerchantTransactionOrder',
      meta: { title: 'merchantTransactionOrder', noCache: false }
    },
    {
      path: 'merchantPaidOrder',
      component: () => import('@/view/merchant/merchantOrderCheck/merchantPaidOrder'),
      name: 'MerchantPaidOrder',
      meta: { title: 'merchantPaidOrder', noCache: false }
    },
    {
      path: 'interceptPaidOrder',
      component: () => import('@/view/merchant/merchantOrderCheck/interceptPaidOrder'),
      name: 'InterceptPaidOrder',
      meta: { title: 'interceptPaidOrder', noCache: false }
    },
    {
      path: 'PaidOrderAudit',
      component: () => import('@/view/merchant/merchantOrderCheck/PaidOrderAudit'),
      name: 'PaidOrderAudit',
      meta: { title: 'PaidOrderAudit', noCache: false }
    }
  ]
}

export default merchantOrderCheckRouter
