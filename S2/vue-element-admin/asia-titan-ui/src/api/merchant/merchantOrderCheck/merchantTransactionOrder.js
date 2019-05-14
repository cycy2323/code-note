import request from '@/utils/request'

export function merchantTransactionOrderList(data) {
  return request({
    url: 'order/payList',
    method: 'post',
    data
  })
}
export function listSituation() {
  return request({
    url: 'order/pay/statistics',
    method: 'post'
  })
}
