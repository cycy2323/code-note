import request from '@/utils/request'

export function getOrderlist(data) {
  return request({
    url: 'order/remitList',
    method: 'post',
    data
  })
}
export function listSituation() {
  return request({
    url: 'order/remit/statistics',
    method: 'post'
  })
}
