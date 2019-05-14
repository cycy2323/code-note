/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/views/layout/Layout'

const financeManageRouter = {
  path: '/financeManage',
  component: Layout,
  hidden: false,
  redirect: 'noredirect',
  name: 'financeManage',
  meta: {
    title: 'financeManage',
    icon: 'list'
  },
  children: [
    {
      path: 'tradeReport',
      component: () => import('@/projectViews/Console/financeManage/tradeReport'),
      name: 'tradeReport',
      meta: { title: 'tradeReport', noCache: true }
    },
    {
      path: 'virtualAccount',
      component: () => import('@/projectViews/Console/financeManage/virtualAccount'),
      name: 'virtualAccount',
      meta: { title: 'virtualAccount', noCache: true }
    },
    {
      path: 'withdrawBlacklist',
      component: () => import('@/projectViews/Console/financeManage/withdrawBlacklist'),
      name: 'withdrawBlacklist',
      meta: { title: 'withdrawBlacklist', noCache: true }
    },
    {
      path: 'serviceCharge',
      component: () => import('@/projectViews/Console/financeManage/serviceCharge'),
      name: 'serviceCharge',
      meta: { title: 'serviceCharge', noCache: true }
    },
    {
      path: 'profitManage',
      component: () => import('@/projectViews/Console/financeManage/profitManage'),
      name: 'profitManage',
      meta: { title: 'profitManage', noCache: true }
    }
  ]
}

export default financeManageRouter
