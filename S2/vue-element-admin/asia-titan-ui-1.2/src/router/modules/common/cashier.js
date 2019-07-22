import Vue from 'vue'
import Router from 'vue-router'
/* Layout */
import Layout from '@/views/layout/Layout'

Vue.use(Router)

// import orderRouter from './order'

const paymentRouter = {
  path: '/cashier',
  component: Layout,
  redirect: '/cashier/edit-cashier',
  alwaysShow: true,
  meta: {
    title: 'cashier',
    icon: 'money',
    keepalive: 'false',
    roles: ['casher_man']
  },
  children: [
    {
      path: 'edit-cashier',
      component: () => import('@/view/cashier/myCashier'),
      name: 'ourCashier',
      meta: { title: 'ourCashier' }
    }
  ]
}

export default paymentRouter
