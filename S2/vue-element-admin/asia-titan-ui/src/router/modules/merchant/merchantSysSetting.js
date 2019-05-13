/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/views/layout/Layout'

const merchantSysSetting = {
  path: '/merchantSysSetting',
  component: Layout,
  alwaysShow: true,
  hidden: false,
  redirect: 'noredirect',
  name: 'merchantSysSetting',
  meta: {
    title: 'merchantSysSetting',
    icon: 'system',
    roles: ['merchant']
  },
  children: [
    {
      path: 'resetLoginPassword',
      component: () => import('@/view/common/resetPassword'),
      name: 'ResetLoginPassword',
      meta: { title: 'resetLoginPassword', noCache: true }
    },
    {
      path: 'resetPayPassword',
      component: () => import('@/view/merchant/sysSetting/resetPayPassword'),
      name: 'ResetPayPassword',
      meta: { title: 'resetPayPassword', noCache: false }
    },
    {
      path: 'resetgoogleCode',
      component: () => import('@/view/merchant/sysSetting/resetGoogleCode'),
      name: 'ResetgoogleCode',
      meta: { title: 'resetgoogleCode', noCache: false }
    },
    {
      path: 'bindIP',
      component: () => import('@/view/merchant/sysSetting/bindIP'),
      name: 'BindIP',
      meta: { title: 'bindIP', noCache: false }
    }
  ]
}

export default merchantSysSetting
