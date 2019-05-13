import request from '@/utils/request'
import Vue from 'vue'

export function personalInformation() {
  return request({
    url: 'manage/home/getPersionMsg',
    method: 'get'
  })
}

export function getIpName(query, sysType) {
  return request({
    url: 'manage/home/getIpName',
    method: 'post',
    data: query,
    sysType
  })
}

export function accountSafety() {
  return request({
    url: 'manage/home/getPersionMsg',
    method: 'get'
  })
}

export function updateInfo(data) {
  return request({
    url: 'manage/home/upDateUser',
    method: 'post',
    data
  })
}

export function googleBind(merUUID) {
  return request({
    url: 'oauth/google/bind',
    method: 'get',
    params: merUUID,
    sysType: Vue.prototype.OauthServer
  })
}

export function anewGoogleBind(data) {
  return request({
    url: 'oauth/google/bind',
    method: 'post',
    data,
    sysType: Vue.prototype.OauthServer
  })
}
