import request from '@/utils/request'

export function merchantTransactionOrderList(data) {
  return request({
    url: 'order/payList',
    method: 'post',
    data
  })
}
export function listSituation(query, sysType) {
  return request({
    url: 'order/pay/statistics',
    method: 'post',
    data: query,
    sysType: sysType
  })
}
export function goReminder(query, sysType) {
  return request({
    url: 'order/pay/reminder',
    method: 'post',
    data: query,
    sysType: sysType
  })
}
