/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/views/layout/Layout'

const systemManageRouter = {
  path: '/systemManage',
  component: Layout,
  hidden: false,
  redirect: 'noredirect',
  name: 'SystemManage',
  meta: {
    title: 'systemManage',
    icon: 'system',
    roles: ['admin']
  },
  children: [
    {
      path: 'operationLog',
      component: resolve => require(['@/view/manage/systemManage/operationLog'], resolve),
      name: 'OperationLog',
      meta: { title: 'operationLog', noCache: false }
    },
    {
      path: 'loginLog',
      component: resolve => require(['@/view/manage/systemManage/loginLog'], resolve),
      name: 'LoginLog',
      meta: { title: 'loginLog', noCache: false }
    },
    {
      path: 'systemDeploy',
      component: resolve => require(['@/view/manage/systemManage/systemDeploy'], resolve),
      name: 'SystemDeploy',
      meta: { title: 'systemDeploy', noCache: false }
    },
    {
      path: 'noticeManage',
      component: resolve => require(['@/view/manage/systemManage/noticeManage'], resolve),
      name: 'NoticeManage',
      meta: { title: 'noticeManage', noCache: false }
    }
  ]
}

export default systemManageRouter
