import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/user/listPage',
    method: 'post',
    data: query
  })
}

export function fetchAdd(query) {
  return request({
    url: '/user/add',
    method: 'post',
    data: query
  })
}

export function fetchUpdate(query) {
  return request({
    url: '/user/update',
    method: 'post',
    data: query
  })
}

export function createArticle(data) {
  return request({
    url: '/article/create',
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
