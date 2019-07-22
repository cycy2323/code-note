import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/views/layout/Layout'
// import orderRouter from './order'

const agentManageRouter = { // 代理管理
  path: '/agentManage',
  component: Layout,
  redirect: 'agentManage',
  alwaysShow: true,
  meta: {
    title: 'agentManage',
    icon: 'agent',
    roles: ['agent']
  },
  children: [
    {
      path: 'ProfitReport',
      component: resolve => require(['@/view/agency/agentManage/ProfitReport'], resolve),
      name: 'ProfitReport',
      meta: { title: 'ProfitReport', noCache: false }
    }
  ]
}

export default agentManageRouter
