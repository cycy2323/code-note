import request from '@/utils/request'

export function getWebsite() {
  return request({
    url: '/website/webConfig',
    method: 'get'
  })
}

export function delWhiteList(ip) {
  return request({
    url: '/website/delWhiteList',
    method: 'get',
    params: { ip }
  })
}

export function addWhiteList(ip) {
  return request({
    url: '/website/addWhiteList',
    method: 'get',
    params: { ip }
  })
}

export function whiteConfig() {
  return request({
    url: '/website/whiteConfig',
    method: 'get'
  })
}

export function submitWebsite(data) {
  return request({
    url: '/website/webSetting',
    method: 'post',
    data
  })
}
