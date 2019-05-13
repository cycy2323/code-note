import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/views/layout/Layout'
// import orderRouter from './order'

const systemRouter = {
  path: '/system',
  component: Layout,
  redirect: '/system/system-list',
  name: 'system',
  meta: {
    title: 'system',
    icon: 'lock',
    roles: ['sys_man']
  },
  children: [
    {
      path: 'system-website',
      component: () => import('@/view/system/website'),
      name: 'website',
      meta: {
        title: 'website'
      }
    },
    {
      path: 'system-merchant',
      component: () => import('@/view/system/merchant'),
      name: 'merchant',
      meta: { title: 'MerSettings' }
    },
    {
      path: 'system-recharge',
      component: () => import('@/view/system/recharge'),
      name: 'ChargeSettings',
      meta: { title: 'ChargeSettings' }
    }
  ]
}

export default systemRouter
