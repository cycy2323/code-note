import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/notification/page',
    method: 'post',
    data: query
  })
}

export function fetchAdd(query) {
  return request({
    url: '/notification/add',
    method: 'post',
    data: query
  })
}

export function fetchUpdate(query) {
  return request({
    url: '/notification/update',
    method: 'post',
    data: query
  })
}

export function fetchDelete(query) {
  return request({
    url: 'notification/delete',
    method: 'post',
    data: query
  })
}
