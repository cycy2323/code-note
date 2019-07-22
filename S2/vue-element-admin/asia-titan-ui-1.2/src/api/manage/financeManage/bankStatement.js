import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/bankBill/page',
    method: 'post',
    data: query
  })
}

export function fetchRelation(query) {
  return request({
    url: '/bankBill/relation',
    method: 'post',
    data: query
  })
}
