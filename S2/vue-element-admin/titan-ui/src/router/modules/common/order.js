/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/views/layout/Layout'

const orderRouter = {
  path: '/order',
  component: Layout,
  redirect: '/order/list',
  name: 'orderManage',
  alwaysShow: true,
  meta: {
    title: 'orderManage',
    icon: 'form',
    roles: ['order_man']
  },
  children: [
    {
      path: 'list',
      component: () => import('@/view/common/orderList'),
      name: 'orderList',
      meta: { title: 'orderList', roles: [
        /* 'per:order:manager',
        'per:pay:mylist',
        'per:order:list',
        'per:pay:manager',
        'per:casher:manager',
        'per:sys:manager'*/
        'order_list'
      ] }
    }
  ]
}
export default orderRouter
