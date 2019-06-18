import Vue from 'vue'
import Router from 'vue-router'
// import Home from '@/views/merchant/home/index'
import Login from '@/views/login/index'
// import Sidebar from '@/views/common/Sidebar'
import One from '@/views/login/resetPassword/active_1'
import Two from '@/views/login/resetPassword/active_2'
import Three from '@/views/login/resetPassword/active_3'
import Four from '@/views/login/resetPassword/active_4'
import Five from '@/views/login/resetPassword/active_5'
import loginHead from '@/components/loginHead'
import reset1 from '@/views/login/resetPassword'
import Layout from '@/views/layout/Layout'

// 商户后台
import merchantInfoRouter from './modules/merchant/merchantInfo'
import orderManageRouter from './modules/merchant/orderManage'
import withdrawManageRouter from './modules/merchant/withdrawManage'
import transferManageRouter from './modules/merchant/transferManage'
import financialManageRouter from './modules/merchant/financialManage'
// 代理后台

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login,
      meta: {title: '登录'}
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
      meta: {title: '登录'}
    },
    {
      path: '/',
      component: Layout,
      redirect: '/home',
      meta: {title: '首页', head: true, icon: 'process'},
      children: [
        {
          path: '/home',
          name: 'Home',
          meta: {title: '首页'},
          component: () => import('@/views/merchant/home/index')
        }
      ]
    },
    // 导航栏
    // {
    //   path: '/sidebar',
    //   name: 'Sidebar',
    //   component: Sidebar
    // },
    {
      path: '/reset',
      name: 'reset',
      component: reset1,
      hidden: true
    },
    // 首次登录修改密码 5 步骤
    {
      path: '/login/active_1',
      name: 'active_1',
      component: One
    },
    {
      path: '/login/active_2',
      name: 'active_2',
      component: Two
    },
    {
      path: '/login/active_3',
      name: 'active_3',
      component: Three
    },
    {
      path: '/login/active_4',
      name: 'active_4',
      component: Four
    },
    {
      path: '/login/active_5',
      name: 'active_5',
      component: Five
    },
    {
      path: '/loginHead',
      name: 'loginHead',
      component: loginHead
    },
    // 商户平台
    merchantInfoRouter,
    orderManageRouter,
    withdrawManageRouter,
    transferManageRouter,
    financialManageRouter
  ]
})
