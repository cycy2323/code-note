import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/channelAccount/page',
    method: 'post',
    data: query
  })
}

export function fetchAdd(query) {
  return request({
    url: '/channelAccount/add',
    method: 'post',
    data: query
  })
}

export function fetchUpdate(query) {
  return request({
    url: '/channelAccount/update',
    method: 'post',
    data: query
  })
}

export function fetchDetail(query) {
  return request({
    url: '/channelAccount/get',
    method: 'post',
    data: query
  })
}

export function fetchKey(data) {
  return request({
    url: '/channelPlatform/list',
    method: 'post',
    data
  })
}

export function getProperty(data) {
  return request({
    url: '/channelAccount/listProperty',
    method: 'post',
    data: data
  })
}

export function getChannel(data) {
  return request({
    url: '/channelAccount/listChannel',
    method: 'post',
    data: data
  })
}
