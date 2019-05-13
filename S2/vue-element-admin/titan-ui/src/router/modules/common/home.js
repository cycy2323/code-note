import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/views/layout/Layout'

const homeRouter = {
  path: '/home',
  component: Layout,
  redirect: 'home',
  children: [
    {
      path: 'home',
      component: () => import('@/view/common/home'),
      name: 'home',
      meta: { title: '首页', icon: 'dashboard', noCache: true }
    }
  ]
}

export default homeRouter
