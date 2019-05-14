/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/views/layout/Layout'

const agentManageRouter = {
  path: '/agentManage',
  component: Layout,
  hidden: false,
  redirect: 'noredirect',
  name: 'agentManage',
  meta: {
    title: 'agentManage',
    icon: 'list'
  },
  children: [
    {
      path: 'agentList',
      component: () => import('@/projectViews/Console/agentManage/agentList'),
      name: 'agentList',
      meta: { title: 'agentList', noCache: true }
    },
    {
      path: 'agentProfitReport',
      component: () => import('@/projectViews/Console/agentManage/agentProfitReport'),
      name: 'agentProfitReport',
      meta: { title: 'agentProfitReport', noCache: true }
    }
  ]
}

export default agentManageRouter
