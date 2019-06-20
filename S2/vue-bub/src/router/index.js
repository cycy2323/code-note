import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/login'

// 商户后台
// import merchantInfoRouter from './modules/merchant/merchantInfo'
// import orderManageRouter from './modules/merchant/orderManage'
// import withdrawManageRouter from './modules/merchant/withdrawManage'
// import transferManageRouter from './modules/merchant/transferManage'
// import financialManageRouter from './modules/merchant/financialManage'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
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
    // {
    //   // 商户后台首页
    //   path: '/',
    //   component: Layout,
    //   redirect: '/home',
    //   meta: {title: '首页', head: true},
    //   children: [
    //     {
    //       path: '/home',
    //       name: 'Home',
    //       meta: {title: '首页', isTag: true},
    //       component: () => import('@/views/merchant/home/index')
    //     }
    //   ]
    // },
    // 导航栏
    // {
    //   path: '/sidebar',
    //   name: 'Sidebar',
    //   component: Sidebar
    // },
    // {
    //   path: '/reset',
    //   name: 'reset',
    //   component: reset1,
    //   hidden: true
    // },
    // // 首次登录修改密码 5 步骤
    // {
    //   path: '/login/active_1',
    //   name: 'active_1',
    //   component: One
    // },
    // {
    //   path: '/login/active_2',
    //   name: 'active_2',
    //   component: Two
    // },
    // {
    //   path: '/login/active_3',
    //   name: 'active_3',
    //   component: Three
    // },
    // {
    //   path: '/login/active_4',
    //   name: 'active_4',
    //   component: Four
    // },
    // {
    //   path: '/login/active_5',
    //   name: 'active_5',
    //   component: Five
    // },
    // {
    //   path: '/loginHead',
    //   name: 'loginHead',
    //   component: loginHead
    // },
    // {
    //   // 代理商后台首页
    //   path: '/',
    //   component: Layout,
    //   redirect: '/home',
    //   meta: {title: '首页', head: true},
    //   children: [
    //     {
    //       path: '/home',
    //       name: 'Home',
    //       meta: {title: '首页', isTag: true},
    //       component: () => import('@/views/agent/home/index')
    //     }
    //   ]
    // },
  ]
})
