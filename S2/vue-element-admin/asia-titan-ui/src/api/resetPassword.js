import request from '@/utils/request'

export function changePassword(query) {
  return request({
    url: '/user/changePassword',
    method: 'post',
    data: query
  })
}

export function queryBindGoogle(query) {
  return request({
    url: '/user/queryBindGoogle',
    method: 'post',
    data: query
  })
}

export function bindGoogle(query) {
  return request({
    url: '/user/bindGoogle',
    method: 'post',
    data: query
  })
}

export function capitalPassword(query) {
  return request({
    url: '/user/changePayPassword',
    method: 'post',
    data: query
  })
}

export function refreshGoogle(query) {
  return request({
    url: '/user/refreshBindGoogle',
    method: 'post',
    data: query
  })
}

