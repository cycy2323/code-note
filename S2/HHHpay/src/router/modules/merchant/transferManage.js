// import Vue from 'vue'
// import Router from 'vue-router'

/* Layout */
import Layout from '@/views/layout/Layout'

// Vue.use(Router)
// import orderRouter from './order'

const transferManageRouter = {
  path: '/transferManage',
  component: Layout,
  redirect: '/transferManage/transferApplication',
  alwaysShow: true,
  name: 'transferManage',
  meta: {title: '转账管理', head: true, icon: 'trade-assurance'},
  children: [
    { // 转账申请
      path: 'transferApplication',
      component: () => import('@/views/merchant/transferManage/transferApplication'),
      name: 'transferApplication',
      meta: { title: '转账申请', noCache: false }
    },
    { // 转账记录
      path: 'transferRecharge',
      component: () => import('@/views/merchant/transferManage/transferRecharge'),
      name: 'transferRecharge',
      meta: { title: '转账记录', noCache: false }
    }
  ]
}

export default transferManageRouter
