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
      component: resolve => require(['@/view/common/resetPassword'], resolve),
      name: 'ResetLoginPassword',
      meta: { title: 'resetLoginPassword', noCache: true }
    },
    {
      path: 'resetPayPassword',
      component: resolve => require(['@/view/merchant/sysSetting/resetPayPassword'], resolve),
      name: 'ResetPayPassword',
      meta: { title: 'resetPayPassword', noCache: false }
    },
    {
      path: 'resetgoogleCode',
      component: resolve => require(['@/view/merchant/sysSetting/resetGoogleCode'], resolve),
      name: 'ResetgoogleCode',
      meta: { title: 'resetgoogleCode', noCache: false }
    },
    {
      path: 'bindIP',
      component: resolve => require(['@/view/merchant/sysSetting/bindIP'], resolve),
      name: 'BindIP',
      meta: { title: 'bindIP', noCache: false }
    }
  ]
}

export default merchantSysSetting
