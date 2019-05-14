/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/views/layout/Layout'

const systemManageRouter = {
  path: '/systemManage',
  component: Layout,
  hidden: false,
  redirect: 'noredirect',
  name: 'systemManage',
  meta: {
    title: 'systemManage',
    icon: 'list'
  },
  children: [
    {
      path: 'operationLog',
      component: () => import('@/projectViews/Console/systemManage/operationLog'),
      name: 'operationLog',
      meta: { title: 'operationLog', noCache: true }
    },
    {
      path: 'loginLog',
      component: () => import('@/projectViews/Console/systemManage/loginLog'),
      name: 'loginLog',
      meta: { title: 'loginLog', noCache: true }
    }
  ]
}

export default systemManageRouter
