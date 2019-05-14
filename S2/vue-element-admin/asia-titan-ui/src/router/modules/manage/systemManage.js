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
      component: () => import('@/view/manage/systemManage/operationLog'),
      name: 'OperationLog',
      meta: { title: 'operationLog', noCache: false }
    },
    {
      path: 'loginLog',
      component: () => import('@/view/manage/systemManage/loginLog'),
      name: 'LoginLog',
      meta: { title: 'loginLog', noCache: false }
    },
    {
      path: 'systemDeploy',
      component: () => import('@/view/manage/systemManage/systemDeploy'),
      name: 'SystemDeploy',
      meta: { title: 'systemDeploy', noCache: false }
    }
  ]
}

export default systemManageRouter
