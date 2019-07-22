/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/views/layout/Layout'

const subAccounManageRouter = {
  path: '/subAccounManage',
  component: Layout,
  hidden: false,
  alwaysShow: true,
  redirect: 'noredirect',
  name: 'subAccounManage',
  meta: {
    title: 'subAccounManage',
    icon: 'employee',
    roles: ['merchant']
  },
  children: [
    {
      path: 'subAccounList',
      component: resolve => require(['@/view/merchant/subAccounManage/subAccounList'], resolve),
      name: 'SubAccounList',
      meta: { title: 'subAccounList', noCache: false }
    },
    {
      path: 'rolePermission',
      component: resolve => require(['@/view/merchant/subAccounManage/rolePermission'], resolve),
      name: 'RolePermission',
      meta: { title: 'rolePermission', noCache: false }
    },
    {
      path: 'builtSubAccounList',
      component: resolve => require(['@/view/merchant/subAccounManage/builtSubAccounList'], resolve),
      name: 'BuiltSubAccounList',
      meta: { title: 'builtSubAccounList', noCache: false }
    }
  ]
}

export default subAccounManageRouter
