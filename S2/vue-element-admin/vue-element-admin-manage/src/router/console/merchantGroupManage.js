/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/views/layout/Layout'

const merchantGroupManageRouter = {
  path: '/merchantGroupManage',
  component: Layout,
  hidden: false,
  redirect: 'noredirect',
  name: 'merchantGroupManage',
  meta: {
    title: 'merchantGroupManage',
    icon: 'list'
  },
  children: [
    {
      path: 'merchantIGroupList',
      component: () => import('@/projectViews/Console/merchantGroupManage/merchantIGroupList'),
      name: 'merchantIGroupList',
      meta: { title: 'merchantIGroupList', noCache: true }
    },
    {
      path: 'merchantGroupAdd',
      component: () => import('@/projectViews/Console/merchantGroupManage/merchantGroupAdd'),
      name: 'merchantGroupAdd',
      meta: { title: 'merchantGroupAdd', noCache: true }
    }
  ]
}

export default merchantGroupManageRouter
