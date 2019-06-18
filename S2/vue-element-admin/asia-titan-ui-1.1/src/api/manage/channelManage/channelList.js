import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/channelPlatform/page',
    method: 'post',
    data: query
  })
}

export function fetchAdd(query) {
  return request({
    url: '/channelPlatform/add',
    method: 'post',
    data: query
  })
}

export function fetchUpdate(query) {
  return request({
    url: '/channelPlatform/update',
    method: 'post',
    data: query
  })
}

export function fetchKey(data) {
  return request({
    url: '/channelPlatform/listKey',
    method: 'post',
    data
  })
}

export function updateArticle(data) {
  return request({
    url: '/article/update',
    method: 'post',
    data
  })
}
