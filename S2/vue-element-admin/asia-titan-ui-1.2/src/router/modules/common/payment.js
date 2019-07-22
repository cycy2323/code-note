import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/views/layout/Layout'
// import orderRouter from './order'

const paymentRouter = {
  path: '/payment',
  component: Layout,
  redirect: '/payment/my-payment',
  alwaysShow: true,
  meta: {
    title: 'payManage',
    icon: 'edit',
    roles: ['pay_man']
  },
  children: [
    {
      path: 'my-payment',
      component: () => import('@/view/payment/mypayment'),
      name: 'ourPayment',
      meta: {
        title: 'ourPayment',
        roles: ['my_paylist']
      }
    }
  ]
}

export default paymentRouter
