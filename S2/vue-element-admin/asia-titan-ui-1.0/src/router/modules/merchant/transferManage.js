/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/views/layout/Layout'

const transferManageRouter = {
  path: '/transferManage',
  component: Layout,
  hidden: false,
  alwaysShow: true,
  redirect: 'noredirect',
  name: 'transferManage',
  meta: {
    title: 'transferManage',
    icon: 'transfer',
    roles: ['merchant']
  },
  children: [
    {
      path: 'merchantTransfer',
      component: () => import('@/view/merchant/transferManage/merchantTransfer'),
      name: 'MerchantTransfer',
      meta: { title: 'merchantTransfer', noCache: false }
    },
    {
      path: 'merchantTransferCheck',
      component: () => import('@/view/merchant/transferManage/merchantTransferCheck'),
      name: 'MerchantTransferCheck',
      meta: { title: 'merchantTransferCheck', noCache: false }
    }
  ]
}

export default transferManageRouter
