import request from '@/utils/request'
import Vue from 'vue'
import { getOAuthInfo/*, getCurrentUserInfo*/ } from '@/utils/auth'

/* 获取刷新token请求的token*/
export function refreshToken() {
  const refresh_token = getOAuthInfo().refresh_token
  // alert(refresh_token)
  return request({
    url: '/oauth/token',
    method: 'post',
    params: {
      refresh_token,
      client_id: 'titan-web',
      grant_type: 'refresh_token'
    },
    sysType: Vue.prototype.OauthServer
  })
}

export function loginByUsername(username, password) {
  const data = {
    username,
    password,
    client_id: 'titan-web',
    grant_type: 'password',
    uuid: 'adqwdqwddqd',
    captchaCode: '369'
  }
  return request({
    url: '/oauth/token',
    method: 'post',
    sysType: Vue.prototype.OauthServer,
    params: data
  })
}

export function logout() {
  const refresh_token = getOAuthInfo().refresh_token
  return request({
    url: '/logout',
    method: 'post',
    sysType: Vue.prototype.OauthServer,
    params: {
      refresh_token
    }
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

