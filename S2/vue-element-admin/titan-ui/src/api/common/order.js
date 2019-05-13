import request from '@/utils/request'

export function fetchList(query, sysType) {
  return request({
    url: '/order/page',
    method: 'post',
    data: query,
    sysType: sysType
  })
}

export function fetchDetail(id, sysType) {
  return request({
    url: '/order/detail',
    method: 'post',
    params: { id },
    sysType: sysType
  })
}

export function fetchPv(pv) {
  return request({
    url: '/order/pv',
    method: 'get',
    params: { pv }
  })
}

export function createOrder(data, sysType) {
  return request({
    url: '/order/create',
    method: 'post',
    data,
    sysType
  })
}

export function updateOrder(data, sysType) {
  return request({
    url: '/order/update',
    method: 'post',
    data,
    sysType
  })
}
