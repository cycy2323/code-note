import request from '@/utils/request'
import Vue from 'vue'
import { getOAuthInfo/*, getCurrentUserInfo*/ } from '@/utils/auth'

export function getBaseURL() {
  let baseURL
  if (document.domain === Vue.prototype.MerchantHost) {
    baseURL = Vue.prototype.Merchant
  } else if (document.domain === Vue.prototype.ManageHost) {
    baseURL = Vue.prototype.Manage
  } else if (document.domain === Vue.prototype.AgentHost) {
    baseURL = Vue.prototype.Agent
  } else if (Vue.prototype.ManageHostAndMerchantHost.indexOf(document.domain) === -1) {
    baseURL = Vue.prototype.OpenService
  }
  return baseURL
}

/* 获取刷新token请求的token*/
export function refreshToken() {
  const refresh_token = getOAuthInfo().refresh_token
  // alert(refresh_token)
  return request({
    url: '/oauth/token',
    method: 'post',
    data: {
      refresh_token,
      client_id: 'titan-web',
      grant_type: 'refresh_token'
    },
    sysType: getBaseURL()
  })
}

export function loginByUsername(username, password, googleCode) {
  const data = {
    loginName: username,
    password: Vue.prototype.$md5(password),
    googleCode: googleCode
  }
  return request({
    url: '/login',
    method: 'post',
    sysType: getBaseURL(),
    data: data
  })
}

export function logout() {
  // const refresh_token = getOAuthInfo().refresh_token
  return request({
    url: '/loginOut',
    method: 'post',
    sysType: getBaseURL()
  })
}

export function getUserInfo(sysType) {
  return request({
    url: '/user/getUserData',
    method: 'get',
    sysType: sysType
  })
  // return Promise.resolve(getCurrentUserInfo())
}

