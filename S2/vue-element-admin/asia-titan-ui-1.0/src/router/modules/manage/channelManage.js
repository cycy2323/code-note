/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/views/layout/Layout'

const agentManageRouter = {
  path: '/manageChannelManage',
  component: Layout,
  hidden: false,
  redirect: 'noredirect',
  name: 'ManageChannelManage',
  meta: {
    title: 'channelManage',
    icon: 'channel',
    roles: ['admin']
  },
  children: [
    {
      path: 'channelList',
      component: () => import('@/view/manage/channelManage/channelList'),
      name: 'ChannelList',
      meta: { title: 'channelList', noCache: false }
    },
    {
      path: 'channelAccountList',
      component: () => import('@/view/manage/channelManage/channelAccountList'),
      name: 'ChannelAccountList',
      meta: { title: 'channelAccountList', noCache: false }
    },
    {
      path: 'newAccount/:id',
      component: () => import('@/view/manage/channelManage/newAccount'),
      name: 'NewAccount',
      meta: { title: 'newAccount', noCache: false },
      hidden: true
    },
    {
      path: 'accountDetail/:id',
      component: () => import('@/view/manage/channelManage/accountDetail'),
      name: 'AccountDetail',
      meta: { title: 'accountDetail', noCache: false },
      hidden: true
    },
    {
      path: 'channelTradeRoute',
      component: () => import('@/view/manage/channelManage/channelTradeRoute'),
      name: 'ChannelTradeRoute',
      meta: { title: 'channelTradeRoute', noCache: false }
    },
    {
      path: 'channelPayAnotherRoute',
      component: () => import('@/view/manage/channelManage/channelPayAnotherRoute'),
      name: 'ChannelPayAnotherRoute',
      meta: { title: 'channelPayAnotherRoute', noCache: false }
    },
    {
      path: 'channelAccountSearch',
      component: () => import('@/view/manage/channelManage/channelAccountSearch'),
      name: 'ChannelAccountSearch',
      meta: { title: 'channelAccountSearch', noCache: false }
    }
  ]
}

export default agentManageRouter
