/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/views/layout/Layout'

const employeeManageRouter = {
  path: '/employeeManage',
  component: Layout,
  hidden: false,
  redirect: 'noredirect',
  name: 'EmployeeManage',
  meta: {
    title: 'employeeManage',
    icon: 'employee',
    roles: ['admin']
  },
  children: [
    {
      path: 'employeeAccount',
      component: () => import('@/view/manage/employeeManage/employeeAccount'),
      name: 'EmployeeAccount',
      meta: { title: 'employeeAccount', noCache: false }
    },
    {
      path: 'rolePermission',
      component: () => import('@/view/manage/employeeManage/rolePermission'),
      name: 'RolePermission',
      meta: { title: 'rolePermission', noCache: false }
    },
    {
      path: 'authority',
      component: () => import('@/view/manage/employeeManage/authority'),
      name: 'Authority',
      meta: { title: 'authority', noCache: false }
    }
  ]
}

export default employeeManageRouter
