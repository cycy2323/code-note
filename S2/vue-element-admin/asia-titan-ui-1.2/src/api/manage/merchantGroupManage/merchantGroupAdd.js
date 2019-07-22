import request from '@/utils/request'

export function fetchQuery(query) {
  return request({
    url: '/merchantGroup/getMerchants',
    method: 'post',
    data: query
  })
}

export function fetchChannel(query) {
  return request({
    url: '/channel/list',
    method: 'post',
    data: query
  })
}

export function fetchAdd(query) {
  return request({
    url: '/merchantGroup/add',
    method: 'post',
    data: query
  })
}
