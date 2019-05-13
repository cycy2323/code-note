import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css'// progress bar style
import { getToken } from '@/utils/auth' // getToken from cookie
import Vue from 'vue'

NProgress.configure({ showSpinner: false })// NProgress Configuration

// permission judge function
function hasPermission(roles, permissionRoles) {
  if (roles.indexOf('admin') >= 0) return true // admin permission passed directly
  if (!permissionRoles) return true
  return roles.some(role => permissionRoles.indexOf(role) >= 0)
}

/**
 * 登录拦截白名单
 * @type {string[]}
 */
const whiteList = ['/login', '/auth-redirect']// no redirect whitelist
/**
 * 开放平台接口名单
 * @type {string[]}
 */
const openServiceList = ['/openCashier']// no redirect whitelist

router.beforeEach((to, from, next) => {
  NProgress.start() // start progress bar
  if (Vue.prototype.ManageHostAndMerchantHost.indexOf(document.domain) === -1) {
    document.title = 'GT开放平台'
    if (to.path.indexOf('/openCashier') === -1 && to.name !== 'openCashier') {
      next({ name: 'openCashier', params: { merUUID: to.params.merUUID }})
      NProgress.done()
    } else {
      next()
    }
  } else {
    if (document.domain === Vue.prototype.MerchantHost) {
      document.title = 'GT商户系统'
    } else if (document.domain === Vue.prototype.ManageHost) {
      document.title = 'GT后台管理系统'
    }

    if (getToken()) { // determine if there has token
      if (openServiceList.indexOf(to.path) !== -1) { // 开放平台的接口 商户和后台管理系统不能请求 如果请求直接跳转到首页
        next({ path: '/login' })
      } else {
        /* has token*/
        if (to.path === '/login') {
          next({ path: '/' })
          NProgress.done() // if current page is dashboard will not trigger	afterEach hook, so manually handle it
        } else {
          if (store.getters.roles.length === 0) { // 判断当前用户是否已拉取完user_info信息
            store.dispatch('GetUserInfo').then(res => { // 拉取user_info
              // const menuList = res.menuList
              const roles = store.getters.roles// note: roles must be a array! such as: ['editor','develop']
              store.dispatch('GenerateRoutes', { roles }).then(() => { // 根据roles权限生成可访问的路由表
                router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
                next({ ...to, replace: true }) // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
              })
            }).catch((err) => {
              store.dispatch('FedLogOut').then(() => {
                Message.error(err || 'Verification failed, please login again')
                next({ path: '/' })
              })
            })
          } else {
            // 没有动态改变权限的需求可直接next() 删除下方权限判断 ↓
            if (hasPermission(store.getters.roles, to.meta.roles)) {
              next()
            } else {
              next({ path: '/401', replace: true, query: { noGoBack: true }})
            }
            // 可删 ↑
          }
        }
      }
    } else {
      /* has no token*/
      if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
        next()
      } else {
        next(`/login?redirect=${to.path}`) // 否则全部重定向到登录页
        NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
      }
    }
  }
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})
