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
      component: resolve => require(['@/view/manage/merchantAccountManage/merchantSet'], resolve),
      name: 'MerchantSet',
      meta: { title: 'merchantSet', noCache: false }
    },
    {
      path: 'addMerchantApproval',
      component: resolve => require(['@/view/manage/merchantAccountManage/addMerchantApproval'], resolve),
      name: 'AddMerchantApproval',
      meta: { title: 'addMerchantApproval', noCache: false }
    },
    {
      path: 'merchantIGroupList',
      component: resolve => require(['@/view/manage/merchantGroupManage/merchantIGroupList'], resolve),
      name: 'MerchantIGroupList',
      meta: { title: 'merchantIGroupList', noCache: false }
    },
    {
      path: 'merchantGroupAdd',
      component: resolve => require(['@/view/manage/merchantGroupManage/merchantGroupAdd'], resolve),
      hidden: true,
      name: 'MerchantGroupAdd',
      meta: { title: 'merchantGroupAdd', noCache: true }
    },
    {
      path: 'merchantGroupChannel/:id',
      component: resolve => require(['@/view/manage/merchantGroupManage/merchantGroupChannel'], resolve),
      hidden: true,
      name: 'MerchantGroupChannel',
      meta: { title: 'merchantGroupChannel', noCache: true }
    },
    {
      path: 'plainBalanceStatistics',
      component: resolve => require(['@/view/manage/merchantAccountManage/plainBalanceStatistics'], resolve),
      name: 'PlainBalanceStatistics',
      meta: { title: 'plainBalanceStatistics', noCache: false }
    },
    {
      path: 'inventedBalanceStatistics',
      component: resolve => require(['@/view/manage/merchantAccountManage/inventedBalanceStatistics'], resolve),
      name: 'InventedBalanceStatistics',
      meta: { title: 'inventedBalanceStatistics', noCache: false }
    },
    {
      path: 'daily',
      component: resolve => require(['@/view/manage/merchantAccountManage/daily'], resolve),
      name: 'Daily',
      meta: { title: 'daily', noCache: false }
    }
  ]
}

export default merchantOrderManageRouter
