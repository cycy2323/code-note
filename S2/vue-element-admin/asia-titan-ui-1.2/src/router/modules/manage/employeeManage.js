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
      component: resolve => require(['@/view/manage/employeeManage/employeeAccount'], resolve),
      name: 'EmployeeAccount',
      meta: { title: 'employeeAccount', noCache: false }
    },
    {
      path: 'rolePermission',
      component: resolve => require(['@/view/manage/employeeManage/rolePermission'], resolve),
      name: 'RolePermission',
      meta: { title: 'rolePermission', noCache: false }
    },
    {
      path: 'authority',
      component: resolve => require(['@/view/manage/employeeManage/authority'], resolve),
      name: 'Authority',
      meta: { title: 'authority', noCache: false }
    }
  ]
}

export default employeeManageRouter
