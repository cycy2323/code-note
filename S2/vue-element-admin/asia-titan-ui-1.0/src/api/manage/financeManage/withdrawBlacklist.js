import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/remit/black/selectList',
    method: 'post',
    data: query
  })
}

export function fetchImport(query) {
  return request({
    url: '/remit/black/import',
    method: 'post',
    data: query
  })
}

export function fetchPv(pv) {
  return request({
    url: '/article/pv',
    method: 'get',
    params: { pv }
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
