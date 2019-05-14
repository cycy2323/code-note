/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/views/layout/Layout'

const employeeManageRouter = {
  path: '/employeeManage',
  component: Layout,
  hidden: false,
  redirect: 'noredirect',
  name: 'employeeManage',
  meta: {
    title: 'employeeManage',
    icon: 'list'
  },
  children: [
    {
      path: 'employeeAccount',
      component: () => import('@/projectViews/Console/employeeManage/employeeAccount'),
      name: 'employeeAccount',
      meta: { title: 'employeeAccount', noCache: true }
    },
    {
      path: 'rolePermission',
      component: () => import('@/projectViews/Console/employeeManage/rolePermission'),
      name: 'rolePermission',
      meta: { title: 'rolePermission', noCache: true }
    }
  ]
}

export default employeeManageRouter
