/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/views/layout/Layout'

const merchantOrderManageRouter = {
  path: '/manageMerchantAccount',
  component: Layout,
  hidden: false,
  redirect: 'noredirect',
  name: 'ManageMerchantAccount',
  alwaysShow: true,
  meta: {
    title: 'merchant',
    icon: 'merchant',
    roles: ['admin']
  },
  children: [
    {
      path: 'merchantSet',
      component: () => import('@/view/manage/merchantAccountManage/merchantSet'),
      name: 'MerchantSet',
      meta: { title: 'merchantSet', noCache: false }
    },
    {
      path: 'addMerchantApproval',
      component: () => import('@/view/manage/merchantAccountManage/addMerchantApproval'),
      name: 'AddMerchantApproval',
      meta: { title: 'addMerchantApproval', noCache: false }
    },
    {
      path: 'merchantIGroupList',
      component: () => import('@/view/manage/merchantGroupManage/merchantIGroupList'),
      name: 'MerchantIGroupList',
      meta: { title: 'merchantIGroupList', noCache: false }
    },
    {
      path: 'merchantGroupAdd',
      component: () => import('@/view/manage/merchantGroupManage/merchantGroupAdd'),
      hidden: true,
      name: 'MerchantGroupAdd',
      meta: { title: 'merchantGroupAdd', noCache: true }
    },
    {
      path: 'merchantGroupChannel/:id',
      component: () => import('@/view/manage/merchantGroupManage/merchantGroupChannel'),
      hidden: true,
      name: 'MerchantGroupChannel',
      meta: { title: 'merchantGroupChannel', noCache: true }
    },
    {
      path: 'plainBalanceStatistics',
      component: () => import('@/view/manage/merchantAccountManage/plainBalanceStatistics'),
      name: 'PlainBalanceStatistics',
      meta: { title: 'plainBalanceStatistics', noCache: false }
    },
    {
      path: 'inventedBalanceStatistics',
      component: () => import('@/view/manage/merchantAccountManage/inventedBalanceStatistics'),
      name: 'InventedBalanceStatistics',
      meta: { title: 'inventedBalanceStatistics', noCache: false }
    },
    {
      path: 'daily',
      component: () => import('@/view/manage/merchantAccountManage/daily'),
      name: 'Daily',
      meta: { title: 'daily', noCache: false }
    }
  ]
}

export default merchantOrderManageRouter
