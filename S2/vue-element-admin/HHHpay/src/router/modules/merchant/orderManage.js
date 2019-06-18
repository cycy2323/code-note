// import Vue from 'vue'
// import Router from 'vue-router'

/* Layout */
import Layout from '@/views/layout/Layout'

// Vue.use(Router)
// import orderRouter from './order'

const orderManageRouter = {
  path: '/orderManage',
  component: Layout,
  redirect: '/orderManage/orderSearch',
  alwaysShow: true,
  name: 'orderManage',
  meta: {title: '订单管理', head: true, icon: 'process'},
  children: [
    { // 订单查询
      path: 'orderSearch',
      component: () => import('@/views/merchant/orderManage/orderSearch'),
      name: 'orderSearch',
      meta: { title: '订单查询', noCache: false }
    },
    { // 充值订单
      path: 'orderRecharge',
      component: () => import('@/views/merchant/orderManage/orderRecharge'),
      name: 'orderRecharge',
      meta: { title: '充值订单', noCache: false }
    }
  ]
}

export default orderManageRouter
