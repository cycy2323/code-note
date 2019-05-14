import Mock from 'mockjs'
import loginAPI from './login'
import articleAPI from './article'
import remoteSearchAPI from './remoteSearch'
import transactionAPI from './transaction'
import roleAPI from './role'
import orderListAPI from './console/orderManage/orderList'
import withdrawListAPI from './console/orderManage/withdrawList'
import withdrawListRejectAPI from './console/orderManage/withdrawListReject'
import rechargeOrderAPI from './console/merchantManage/rechargeOrder'
import withdrawOrderAPI from './console/merchantManage/withdrawOrder'
import fundChangeRecordAPI from './console/merchantManage/fundChangeRecord'
import transferRecordAPI from './console/merchantManage/transferRecord'
import merchantIGroupListAPI from './console/merchantGroupManage/merchantIGroupList'
import employeeAccountAPI from './console/employeeManage/employeeAccount'
import rolePermissionAPI from './console/employeeManage/rolePermission'
import agentListAPI from './console/agentManage/agentList'
import agentProfitReportAPI from './console/agentManage/agentProfitReport'

// 修复在使用 MockJS 情况下，设置 withCredentials = true，且未被拦截的跨域请求丢失 Cookies 的问题
// https://github.com/nuysoft/Mock/issues/300
Mock.XHR.prototype.proxy_send = Mock.XHR.prototype.send
Mock.XHR.prototype.send = function() {
  if (this.custom.xhr) {
    this.custom.xhr.withCredentials = this.withCredentials || false
  }
  this.proxy_send(...arguments)
}

// Mock.setup({
//   timeout: '350-600'
// })

// 登录相关
Mock.mock(/\/login\/login/, 'post', loginAPI.loginByUsername)
Mock.mock(/\/login\/logout/, 'post', loginAPI.logout)
Mock.mock(/\/user\/info\.*/, 'get', loginAPI.getUserInfo)

// 角色相关
Mock.mock(/\/routes/, 'get', roleAPI.getRoutes)
Mock.mock(/\/roles/, 'get', roleAPI.getRoles)
Mock.mock(/\/roles$/, 'post', roleAPI.addRole)
Mock.mock(/\/roles\/[A-Za-z0-9]+/, 'put', roleAPI.updateRole)
Mock.mock(/\/roles\/[A-Za-z0-9]+/, 'delete', roleAPI.deleteRole)

// 文章相关
Mock.mock(/\/article\/list/, 'get', articleAPI.getList)
Mock.mock(/\/article\/detail/, 'get', articleAPI.getArticle)
Mock.mock(/\/article\/pv/, 'get', articleAPI.getPv)
Mock.mock(/\/article\/create/, 'post', articleAPI.createArticle)
Mock.mock(/\/article\/update/, 'post', articleAPI.updateArticle)

// 订单相关
Mock.mock(/\/orderList\/list/, 'get', orderListAPI.getList)
Mock.mock(/\/withdrawList\/list/, 'get', withdrawListAPI.getList)
Mock.mock(/\/withdrawListReject\/list/, 'get', withdrawListRejectAPI.getList)

// 商户相关

Mock.mock(/\/rechargeOrder\/list/, 'get', rechargeOrderAPI.getList)
Mock.mock(/\/withdrawOrder\/list/, 'get', withdrawOrderAPI.getList)
Mock.mock(/\/fundChangeRecord\/list/, 'get', fundChangeRecordAPI.getList)
Mock.mock(/\/transferRecord\/list/, 'get', transferRecordAPI.getList)

// 商户组相关

Mock.mock(/\/merchantIGroupList\/list/, 'get', merchantIGroupListAPI.getList)

// 财务管理

// 员工管理

Mock.mock(/\/employeeAccount\/list/, 'get', employeeAccountAPI.getList)
Mock.mock(/\/rolePermission\/list/, 'get', rolePermissionAPI.getList)

// 代理管理

Mock.mock(/\/agentList\/list/, 'get', agentListAPI.getList)
Mock.mock(/\/agentProfitReport\/list/, 'get', agentProfitReportAPI.getList)

// 系统管理


// 搜索相关
Mock.mock(/\/search\/user/, 'get', remoteSearchAPI.searchUser)

// 账单相关
Mock.mock(/\/transaction\/list/, 'get', transactionAPI.getList)

export default Mock
