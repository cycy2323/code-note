// import Vue from 'vue'
// import Router from 'vue-router'

/* Layout */
import Layout from '@/views/layout/Layout'

// Vue.use(Router)
// import orderRouter from './order'

const financialManageRouter = {
  path: '/financialManage',
  component: Layout,
  redirect: '/financialManage/capitalFlow',
  alwaysShow: true,
  name: 'financialManage',
  meta: {title: '财务管理', head: true, icon: 'manage-order'},
  children: [
    { // 资金流水
      path: 'capitalFlow',
      component: () => import('@/views/merchant/financialManage/capitalFlow'),
      name: 'capitalFlow',
      meta: { title: '资金流水', noCache: false }
    }
  ]
}

export default financialManageRouter
