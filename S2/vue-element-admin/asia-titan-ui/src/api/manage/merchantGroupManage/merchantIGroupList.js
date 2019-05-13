import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/merchantGroup/selectList',
    method: 'post',
    data: query
  })
}

export function fetchQuery(query) {
  return request({
    url: '/merchantGroup/getMerchants',
    method: 'post',
    data: query
  })
}

export function updateMerchant(data) {
  return request({
    url: '/merchantGroup/updateMerchant',
    method: 'post',
    data
  })
}

export function updateRatio(data) {
  return request({
    url: '/merchantGroup/updateRatio',
    method: 'post',
    data
  })
}
