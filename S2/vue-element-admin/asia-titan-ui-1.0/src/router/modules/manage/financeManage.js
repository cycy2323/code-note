/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/views/layout/Layout'

const financeManageRouter = {
  path: '/financeManage',
  component: Layout,
  hidden: false,
  redirect: 'noredirect',
  name: 'FinanceManage',
  meta: {
    title: 'financeManage',
    icon: 'finance',
    roles: ['admin']
  },
  children: [
    {
      path: 'tradeReport',
      component: () => import('@/view/manage/financeManage/tradeReport'),
      name: 'TradeReport',
      meta: { title: 'tradeReport', noCache: false }
    },
    // {
    //   path: 'merchantDefBalance',
    //   component: () => import('@/view/manage/financeManage/merchantDefBalance'),
    //   name: 'MerchantDefBalance',
    //   meta: { title: 'merchantDefBalance', noCache: false }
    // },
    {
      path: 'virtualAccount',
      component: () => import('@/view/manage/financeManage/virtualAccount'),
      name: 'VirtualAccount',
      meta: { title: 'virtualAccount', noCache: false }
    },
    {
      path: 'withdrawBlacklist',
      component: () => import('@/view/manage/financeManage/withdrawBlacklist'),
      name: 'WithdrawBlacklist',
      meta: { title: 'withdrawBlacklist', noCache: false }
    },
    // {
    //   path: 'serviceCharge',
    //   component: () => import('@/view/manage/financeManage/serviceCharge'),
    //   name: 'ServiceCharge',
    //   meta: { title: 'serviceCharge', noCache: false }
    // },
    {
      path: 'profitManage',
      component: () => import('@/view/manage/financeManage/profitManage'),
      name: 'ProfitManage',
      meta: { title: 'profitManage', noCache: false }
    }
  ]
}

export default financeManageRouter
