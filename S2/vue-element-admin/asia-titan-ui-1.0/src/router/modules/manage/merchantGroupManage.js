/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/views/layout/Layout'

const merchantGroupManageRouter = {
  path: '/merchantGroupManage',
  component: Layout,
  hidden: false,
  redirect: 'noredirect',
  name: 'MerchantGroupManage',
  meta: {
    title: 'merchantGroupManage',
    icon: 'admin',
    roles: ['admin']
  },
  children: [
    {
      path: 'merchantIGroupList',
      component: () => import('@/view/manage/merchantGroupManage/merchantIGroupList'),
      name: 'MerchantIGroupList',
      meta: { title: 'merchantIGroupList', noCache: false }
    },
    {
      path: 'merchantGroupAdd',
      component: () => import('@/view/manage/merchantGroupManage/merchantGroupAdd'),
      name: 'MerchantGroupAdd',
      meta: { title: 'merchantGroupAdd', noCache: false }
    },
    {
      path: 'merchantGroupChannel/:id',
      component: () => import('@/view/manage/merchantGroupManage/merchantGroupChannel'),
      hidden: true,
      name: 'MerchantGroupChannel',
      meta: { title: 'merchantGroupChannel', noCache: true }
    }
  ]
}

export default merchantGroupManageRouter
