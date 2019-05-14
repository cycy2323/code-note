/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/views/layout/Layout'

const merchantManageRouter = {
  path: '/merchantManage',
  component: Layout,
  hidden: false,
  redirect: 'noredirect',
  name: 'merchantManage',
  meta: {
    title: 'merchantManage',
    icon: 'list'
  },
  children: [
    {
      path: 'rechargeOrder',
      component: () => import('@/projectViews/Console/merchantManage/rechargeOrder'),
      name: 'rechargeOrder',
      meta: { title: 'rechargeOrder', noCache: true }
    },
    {
      path: 'withdrawOrder',
      component: () => import('@/projectViews/Console/merchantManage/withdrawOrder'),
      name: 'withdrawOrder',
      meta: { title: 'withdrawOrder', noCache: true }
    },
    {
      path: 'fundChangeRecord',
      component: () => import('@/projectViews/Console/merchantManage/fundChangeRecord'),
      name: 'fundChangeRecord',
      meta: { title: 'fundChangeRecord', noCache: true }
    },
    {
      path: 'transferRecord',
      component: () => import('@/projectViews/Console/merchantManage/transferRecord'),
      name: 'transferRecord',
      meta: { title: 'transferRecord', noCache: true }
    }
  ]
}

export default merchantManageRouter
