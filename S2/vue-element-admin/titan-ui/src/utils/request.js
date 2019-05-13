import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import store from '@/store'
import { getToken, isAccessTokenExpired } from '@/utils/auth'
import { refreshToken } from '@/api/login'
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
  timeout: 5000
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
    } else if (Vue.prototype.ManageHostAndMerchantHost.indexOf(document.domain) === -1) {
      config.baseURL = Vue.prototype.OpenService
    }
  }
  // Do something before request is sent
  if (store.getters.token) {
    // 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
    // config.headers['X-Token'] = getToken()
    config.headers.Authorization = 'Bearer ' + getToken()
    // config.headers.Authorization = 'Bearer ' + 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJtZXJfaWQiOjMsInVzZXJfaWQiOjEsInVzZXJfbmFtZSI6ImFkbWluIiwic2NvcGUiOlsic2VydmVyIl0sImJpbmRfZ29vZ2xlIjpmYWxzZSwiZXhwIjoxNTQ1ODEyNzI3LCJhdXRob3JpdGllcyI6WyJwZXI6b3JkZXI6bWFuYWdlciIsInBlcjpwYXk6bXlsaXN0IiwicGVyOm9yZGVyOmxpc3QiLCJwZXI6cGF5Om1hbmFnZXIiLCJwZXI6Y2FzaGVyOm1hbmFnZXIiLCJwZXI6c3lzOm1hbmFnZXIiXSwianRpIjoiMWY5ZTI1NmMtMGRlNi00NDYxLWFmZmMtNWMwM2ZjM2EwMDg5IiwiY2xpZW50X2lkIjoidGl0YW4td2ViIn0.ksWZYd5Xi0Wtg6PfcZrcaQDJ-9e4pluO1SlzvGvS21dhHUpZgo9NVRGgsW_ly0OoUo9rmgF6nBUerpfj9Qv-j3jya0IFKTDt537mmrdk6O_HPODD6qL3HYRIeS2ukoRMCwTdFCUm4kehoaujWJp0gnIGyWdzmnDHk_NbDYBMkRYU0GJCq5nhIeSUzOqRH-OKkXQHjtz0v2tPxaOx5BAypGv302ZsZ5ZOrClxhZubjAtIRJd6tjgbposEIW4EI6SJmZZPAIzlV_wGOfOa78d-juvBM3HMSut93muCI_kXRkXF0j5p5tGDOdRmF44cocxjJIqKcGolKaN_-429pfIyiQ'
  }

  // const authTmp = localStorage.auth
  // /* 判断是否已登录*/
  // if (authTmp) {
  //   /* 解析登录信息*/
  //   const auth = JSON.parse(authTmp)
  //   /* 判断auth是否存在*/
  //   if (auth) {
  //     /* 在请求头中添加token类型、token*/
  //     config.headers.Authorization = auth.token_type + ' ' + auth.token
  //     /* 判断刷新token请求的refresh_token是否过期*/
  //     if (isRefreshTokenExpired()) {
  //       alert('刷新token过期，请重新登录')
  //       /* 清除本地保存的auth*/
  //       localStorage.removeItem('auth')
  //       window.location.href = '#/login'
  //       return
  //     }
  //     /* 判断token是否将要过期*/
  //     if (isTokenExpired() && config.url.indexOf('admin/auth/current') === -1) {
  //       /* 判断是否正在刷新*/
  //       if (!window.isRefreshing) {
  //         /* 将刷新token的标志置为true*/
  //         window.isRefreshing = true
  //         /* 发起刷新token的请求*/
  //         apiList.refreshToken({ refresh_token: getRefreshToken() }).then(res => {
  //           /* 将标志置为false*/
  //           window.isRefreshing = false
  //           /* 成功刷新token*/
  //           config.headers.Authorization = res.data.data.token_type + ' ' + res.data.data.token
  //           /* 更新auth*/
  //           localStorage.setItem('auth', JSON.stringify(res.data.data))
  //           /* 执行数组里的函数,重新发起被挂起的请求*/
  //           onRrefreshed(res.data.data.token)
  //           /* 执行onRefreshed函数后清空数组中保存的请求*/
  //           refreshSubscribers = []
  //         }).catch(err => {
  //           alert(err.response.data.message)
  //           /* 清除本地保存的auth*/
  //           // localStorage.removeItem('auth')
  //           window.location.href = '#/login'
  //         })
  //       }
  //       /* 把请求(token)=>{....}都push到一个数组中*/
  //       const retry = new Promise((resolve, reject) => {
  //         /* (token) => {...}这个函数就是回调函数*/
  //         subscribeTokenRefresh((token) => {
  //           config.headers.Authorization = 'Bearer ' + token
  //           /* 将请求挂起*/
  //           resolve(config)
  //         })
  //       })
  //       return retry
  //     }
  //   }
  //   return config
  // } else {
  //   return config
  // }

  const authTk = getToken()
  /* 判断token是否存在*/
  if (authTk) {
    /* 在请求头中添加token类型、token*/
    // config.headers.Authorization = // loadUserKey() + ' ' + loadUserToken()

    // config.url = config.url + '?t=' + (new Date()).getTime().toString() // 清楚缓存
    // config.url = config.url + '?captchaCode=ueen&username=admin&password=123456&client_id=titan-web&grant_type=password&googleCode=123&uuid=adqwdqwddqd'
    /* 判断token是否将要过期 */
    if (isAccessTokenExpired() && (config.url.indexOf('oauth/token') === -1)) {
      // alert(config.url)
      /**
       * 暂时取消刷新状态位控制 由于无法并行http请求原因 舍弃防止重复刷新token
       */
      /* 判断是否正在刷新*/
      // if (!window.isRefreshing) {
      //   window.isRefreshing = true
      // } else {
      //   // source.cancel('取消请求 哈哈哈')
      //   source.cancel()
      //   // 表示登录失效 已有微任务在等待执行刷新token 取消本次请求 重新发起微任务
      //   // source.cancel(101)
      //   // setTimeout(self(config, self))
      //   // return self(config, self)
      //   //alert(4)
      //   return config
      // }
      /* 发起刷新token的请求*/
      /**
       * 当前axios 前置拦截service.interceptors.request.use中开启异步函数 async config =>{}
       * 目的是使在判断access_token过期时需要再次刷新 需要进行同步处理 否则会导致业务请求直接带着过期的access_token请求 提示请登录
       * 而新获取的access_token在本次业务请求中没有生效 此方案为前端终极异步解决方案 是在异步方法中启用同步
       */
      // token没有过期时业务请求发送http是并行的, token过期时 同步业务请求同步 此Promise用于注册

      // alert(1)
      await refreshToken().then(res => {
        // alert(2)
        window.isRefreshing = false
        // console.log('lalala:' + res)
        // saveUserToken(res.access_token)
        // saveUserKey(res.token_type)
        /* 执行数组里的函数,重新发起被挂起的请求*/
        config.headers.Authorization = res.token_type + ' ' + res.access_token
        // console.log(config.headers.Authorization)
        // console.log(config.url)
        // alert(1)
        // onRrefreshed(res.access_token)
        /* 执行onRefreshed函数后清空数组中保存的请求*/
        // refreshSubscribers = []
        // 这里要使用mutation 同步执行 action是异步执行的
        store.commit('REFRESH_TOKEN', res)
        // store.dispatch('refreshToken', res)
      }).catch(error => {
        /* 清除本地保存的*/
        // clearAllCache()
        window.isRefreshing = false
        console.error(error.message)
        // window.location.href = '#/login'
        // location.reload() // 为了重新实例化vue-router对象 避免bug
        return Promise.reject(error.message)
      })
      // alert(3)
      // /* 把请求(token)=>{....}都push到一个数组中*/
      // const retry = new Promise((resolve, reject) => {
      //   /* (token) => {...}这个函数就是回调函数*/
      //   subscribeTokenRefresh((token) => {
      //     // config.headers.common['Authorization'] = 'bearer ' + token;
      //     config.headers.Authorization = 'Bearer ' + token
      //     /* 将请求挂起*/
      //     resolve(config)
      //   })
      // })
      // return retry
      // alert(2)
      // console.info(config.headers.Authorization)
      return config
    } else {
      return config
    }
  } else {
    return config
  }
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
      Message({
        message: res.message,
        type: 'error',
        duration: 5 * 1000
      })
      // 50008:非法的token; 50012:其他客户端登录了;  50014:Token 过期了;
      if (res.code === 101) {
        // 请自行在引入 MessageBox
        // import { Message, MessageBox } from 'element-ui'
        MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          store.dispatch('FedLogOut').then(() => {
            // clearAllCache() // 清空所有缓存
            location.reload() // 为了重新实例化vue-router对象 避免bug
          })
        })
      }
      return Promise.reject(res.message)
    } else {
      if (res.access_token || res.code === 200) {
        return res
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

    // 判断是否是取消的请求 如果是 使取消的请求不进入上层Promise的catch中 而是进入then
    // 并且把当前业务函数继续包装成异步函数 使js引擎线程执行下一个
    if (axios.isCancel(error)) return Promise.resolve()
    return Promise.reject(error)
  }
)

export default service
