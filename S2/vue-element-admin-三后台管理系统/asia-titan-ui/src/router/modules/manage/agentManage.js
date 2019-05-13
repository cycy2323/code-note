/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/views/layout/Layout'

const agentManageRouter = {
  path: '/manageAgentManage',
  component: Layout,
  hidden: false,
  redirect: 'noredirect',
  name: 'ManageAgentManage',
  meta: {
    title: 'agentManage',
    icon: 'agent',
    roles: ['admin']
  },
  children: [
    {
      path: 'agentList',
      component: () => import('@/view/manage/agentManage/agentList'),
      name: 'AgentList',
      meta: { title: 'agentList', noCache: false }
    },
    {
      path: 'agentProfitReport',
      component: () => import('@/view/manage/agentManage/agentProfitReport'),
      name: 'AgentProfitReport',
      meta: { title: 'agentProfitReport', noCache: false }
    }
  ]
}

export default agentManageRouter
