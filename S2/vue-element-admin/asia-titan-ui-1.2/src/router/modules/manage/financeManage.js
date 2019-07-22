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
      component: resolve => require(['@/view/manage/financeManage/tradeReport'], resolve),
      name: 'TradeReport',
      meta: { title: 'tradeReport', noCache: false }
    },
    // {
    //   path: 'merchantDefBalance',
    //   component: resolve => require(['@/view/manage/financeManage/merchantDefBalance'], resolve),
    //   name: 'MerchantDefBalance',
    //   meta: { title: 'merchantDefBalance', noCache: false }
    // },
    {
      path: 'virtualAccount',
      component: resolve => require(['@/view/manage/financeManage/virtualAccount'], resolve),
      name: 'VirtualAccount',
      meta: { title: 'virtualAccount', noCache: false }
    },
    {
      path: 'virtualAccountList',
      component: resolve => require(['@/view/manage/financeManage/virtualAccountList'], resolve),
      name: 'VirtualAccountList',
      meta: { title: 'virtualAccountList', noCache: false }
    },
    {
      path: 'withdrawBlacklist',
      component: resolve => require(['@/view/manage/financeManage/withdrawBlacklist'], resolve),
      name: 'WithdrawBlacklist',
      meta: { title: 'withdrawBlacklist', noCache: false }
    },
    {
      path: 'profitManage',
      component: resolve => require(['@/view/manage/financeManage/profitManage'], resolve),
      name: 'ProfitManage',
      meta: { title: 'profitManage', noCache: false }
    },
    {
      path: 'balanceSnapshot',
      component: resolve => require(['@/view/manage/financeManage/balanceSnapshot'], resolve),
      name: 'BalanceSnapshot',
      meta: { title: 'balanceSnapshot', noCache: false }
    },
    {
      path: 'balanceObvious/:id',
      component: resolve => require(['@/view/manage/financeManage/balanceObvious'], resolve),
      hidden: true,
      name: 'BalanceObvious',
      meta: { title: 'balanceObvious', noCache: false }
    },
    {
      path: 'bankStatement',
      component: resolve => require(['@/view/manage/financeManage/bankStatement'], resolve),
      name: 'BankStatement',
      meta: { title: 'bankStatement', noCache: false }
    }
  ]
}

export default financeManageRouter
