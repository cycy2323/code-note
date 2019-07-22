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
      component: resolve => require(['@/view/manage/channelManage/channelList'], resolve),
      name: 'ChannelList',
      meta: { title: 'channelList', noCache: false }
    },
    {
      path: 'channelAccountList',
      component: resolve => require(['@/view/manage/channelManage/channelAccountList'], resolve),
      name: 'ChannelAccountList',
      meta: { title: 'channelAccountList', noCache: false }
    },
    {
      path: 'newAccount/:id',
      component: resolve => require(['@/view/manage/channelManage/newAccount'], resolve),
      name: 'NewAccount',
      meta: { title: 'newAccount', noCache: false },
      hidden: true
    },
    {
      path: 'accountDetail/:id',
      component: resolve => require(['@/view/manage/channelManage/accountDetail'], resolve),
      name: 'AccountDetail',
      meta: { title: 'accountDetail', noCache: false },
      hidden: true
    },
    {
      path: 'channelTradeRoute',
      component: resolve => require(['@/view/manage/channelManage/channelTradeRoute'], resolve),
      name: 'ChannelTradeRoute',
      meta: { title: 'channelTradeRoute', noCache: false }
    },
    {
      path: 'channelPayAnotherRoute',
      component: resolve => require(['@/view/manage/channelManage/channelPayAnotherRoute'], resolve),
      name: 'ChannelPayAnotherRoute',
      meta: { title: 'channelPayAnotherRoute', noCache: false }
    },
    {
      path: 'channelAccountSearch',
      component: resolve => require(['@/view/manage/channelManage/channelAccountSearch'], resolve),
      name: 'ChannelAccountSearch',
      meta: { title: 'channelAccountSearch', noCache: false }
    }
  ]
}

export default agentManageRouter
