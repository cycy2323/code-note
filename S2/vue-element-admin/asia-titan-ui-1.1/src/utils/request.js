import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
// import { refreshToken } from '@/api/login'
import Vue from 'vue'
// import mutationUtil from '@/utils/mutationUtil'

/* 被挂起的请求数组*/
// let refreshSubscribers = []

/* push所有请求到数组中*/
// function subscribeTokenRefresh(cb) {
//   refreshSubscribers.push(cb)
// }

/* 刷新请求（refreshSubscribers数组中的请求得到新的token之后会自执行，用新的token去请求数据）*/
// function onRrefreshed(token) {
//   refreshSubscribers.map(cb => cb(token))
// }

// create an axios instance
const service = axios.create({
  // baseURL: process.env.BASE_API, // api 的 base_url
  // baseURL: '', // api 的 base_url
  timeout: 15000
  // , // request timeout
  // sysType: null
})
const CancelToken = axios.CancelToken

// request interceptor
service.interceptors.request.use(
  config => {
    return configF(config, configF)
  },
  error => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
  }
)

const configF = async(config, self) => {
  const source = CancelToken.source()
  config.cancelToken = source.token
  // alert(config.baseURL)
  // alert(config.url)
  // alert(JSON.stringify(config.cancelToken))
  if (config.sysType) {
    config.baseURL = config.sysType
  } else {
    if (document.domain === Vue.prototype.MerchantHost) {
      config.baseURL = Vue.prototype.Merchant
    } else if (document.domain === Vue.prototype.ManageHost) {
      config.baseURL = Vue.prototype.Manage
    } else if (document.domain === Vue.prototype.AgentHost) {
      config.baseURL = Vue.prototype.Agent
    } else if (Vue.prototype.ManageHostAndMerchantHost.indexOf(document.domain) === -1) {
      config.baseURL = Vue.prototype.OpenService
    }
  }
  // Do something before request is sent
  if (store.getters.token) {
    // 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
    // config.headers['X-Token'] = getToken()
    const tok = JSON.parse(getToken())
    config.headers.Authorization = tok.token
    config.headers.userId = tok.userId
    // config.headers.Authorization = 'Bearer ' + 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJtZXJfaWQiOjMsInVzZXJfaWQiOjEsInVzZXJfbmFtZSI6ImFkbWluIiwic2NvcGUiOlsic2VydmVyIl0sImJpbmRfZ29vZ2xlIjpmYWxzZSwiZXhwIjoxNTQ1ODEyNzI3LCJhdXRob3JpdGllcyI6WyJwZXI6b3JkZXI6bWFuYWdlciIsInBlcjpwYXk6bXlsaXN0IiwicGVyOm9yZGVyOmxpc3QiLCJwZXI6cGF5Om1hbmFnZXIiLCJwZXI6Y2FzaGVyOm1hbmFnZXIiLCJwZXI6c3lzOm1hbmFnZXIiXSwianRpIjoiMWY5ZTI1NmMtMGRlNi00NDYxLWFmZmMtNWMwM2ZjM2EwMDg5IiwiY2xpZW50X2lkIjoidGl0YW4td2ViIn0.ksWZYd5Xi0Wtg6PfcZrcaQDJ-9e4pluO1SlzvGvS21dhHUpZgo9NVRGgsW_ly0OoUo9rmgF6nBUerpfj9Qv-j3jya0IFKTDt537mmrdk6O_HPODD6qL3HYRIeS2ukoRMCwTdFCUm4kehoaujWJp0gnIGyWdzmnDHk_NbDYBMkRYU0GJCq5nhIeSUzOqRH-OKkXQHjtz0v2tPxaOx5BAypGv302ZsZ5ZOrClxhZubjAtIRJd6tjgbposEIW4EI6SJmZZPAIzlV_wGOfOa78d-juvBM3HMSut93muCI_kXRkXF0j5p5tGDOdRmF44cocxjJIqKcGolKaN_-429pfIyiQ'
  }
  return config
}

// response interceptor
service.interceptors.response.use(
  // response => response,
  /**
   * 下面的注释为通过在response里，自定义code来标示请求状态
   * 当code返回如下情况则说明权限有问题，登出并返回到登录页
   * 如想通过 xmlhttprequest 来状态码标识 逻辑可写在下面error中
   * 以下代码均为样例，请结合自生需求加以修改，若不需要，则可删除
   */
  response => {
    const res = response.data
    if (typeof res.code !== 'undefined' && res.code !== 200) {
      if (res.code === 101 || res.code === 3002 || res.code === 3003 || res.code === 3004) {
        // 请自行在引入 MessageBox
        // import { Message, MessageBox } from 'element-ui'
        store.dispatch('FedLogOut')
        MessageBox.confirm(res.message, {
          confirmButtonText: '重新登录',
          showCancelButton: false,
          closeOnClickModal: false,
          showClose: false,
          type: 'warning'
        }).then(() => {
          location.reload()
          // store.dispatch('FedLogOut').then(() => {
          //   location.reload() // 为了重新实例化vue-router对象 避免bug
          // })
        })
      } else if (res.code === 3301 || res.code === 3302 || res.code === 3303) {
        var info = '为了您的账号安全，请重置登录密码'
        if (res.code === 3302) info = '为了您的账号安全，请绑定谷歌验证码'
        if (res.code === 3303) info = '为了您的资金安全，请设置资金密码'
        MessageBox.confirm(info, {
          showCancelButton: false,
          showClose: false,
          closeOnClickModal: false
        }).then(() => {
          window.location.href = '/#/reset/' + res.code
        })
      } else {
        Message({
          message: res.message,
          type: 'error',
          duration: 5 * 1000
        })
      }
      return Promise.reject(res.message)
    } else {
      if (res.code === 200) {
        return res.data
      } else {
        return Promise.reject('非法请求')
      }
      // Message.error('非法请求')
      // return Promise.reject('非法请求')
    }
  },
  error => {
    // const errorResponse = error.response
    // errorResponse.status === 401

    console.log(error) // for debug
    // Message({
    //   message: error.message,
    //   type: 'error',
    //   duration: 5 * 1000
    // })
    if (error.response) {
      const data = error.response.data
      if (typeof data === 'object') {
        Message({
          message: data.message,
          type: 'error',
          duration: 5 * 1000
        })
      }
    }

    // 判断是否是取消的请求 如果是 使取消的请求不进入上层Promise的catch中 而是进入then
    // 并且把当前业务函数继续包装成异步函数 使js引擎线程执行下一个
    if (axios.isCancel(error)) return Promise.resolve()
    return Promise.reject(error)
  }
)

export default service
