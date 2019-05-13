import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/channel/page',
    method: 'post',
    data: query
  })
}

export function fetchDetail(query) {
  return request({
    url: '/channel/get',
    method: 'post',
    data: query
  })
}

export function fetchUpdate(query) {
  return request({
    url: '/channel/setStatus',
    method: 'post',
    data: query
  })
}

export function fetchUpdateBanks(data) {
  return request({
    url: '/channel/setBank',
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

export function fetchKey(data) {
  return request({
    url: '/channelPlatform/list',
    method: 'post',
    data
  })
}

export function setWeight(data) {
  return request({
    url: '/channel/setWeight',
    method: 'post',
    data
  })
}
