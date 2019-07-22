import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import '@/styles/index.scss' // global css

import App from './App'
import router from './router'
import store from './store'
// import QRCode from 'qrcode'

import i18n from './lang' // Internationalization
import './icons' // icon
import './errorLog' // error log
import './permission' // permission control
// import './mock' // simulation data
import 'lodash'
/* eslint-disable */
// import lodash from 'lodash'

import * as filters from './filters' // global filters

import md5 from 'js-md5';


Vue.use(Element, {
  size: Cookies.get('size') || 'medium', // set element-ui default size
  i18n: (key, value) => i18n.t(key, value)
})

// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false
Vue.prototype.$md5 = md5;
Vue.prototype.OpenService = '/api'
Vue.prototype.OauthServer = '/oauth-server'
Vue.prototype.Agent = '/agent'
Vue.prototype.Merchant = '/merchant'
Vue.prototype.Manage = '/admin'
Vue.prototype.AgentHost = 'agenttest.hengxinpay.cn'
Vue.prototype.MerchantHost = 'btest.hengxinpay.cn'
Vue.prototype.ManageHost = 'admintest.hengxinpay.cn'
Vue.prototype.OpenServiceHost = 'open.gt.com'
Vue.prototype.ManageHostAndMerchantHost = [Vue.prototype.ManageHost, Vue.prototype.MerchantHost,Vue.prototype.AgentHost]
Vue.prototype.currentTimeMillis = function() {
  return new Date().getTime()
}

// export function getRem(pwidth, prem) {
//   var html = document.getElementsByTagName('html')[0]
//   var oWidth = document.body.clientWidth || document.documentElement.clientWidth
//   html.style.fontSize = oWidth / pwidth * prem + 'px'
// }

// Vue.prototype.getRem = getRem
// import VueAuth from '@websanova/vue-auth'

// Vue.use(VueAuth, {
//   auth: require('@websanova/vue-auth/drivers/auth/bearer.js'),
//   http: require('@websanova/vue-auth/drivers/http/axios.1.x.js'),
//   router: require('@websanova/vue-auth/drivers/router/vue-router.2.x.js')
// })
/* 是否有请求正在刷新token*/
window.isRefreshing = false

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})
