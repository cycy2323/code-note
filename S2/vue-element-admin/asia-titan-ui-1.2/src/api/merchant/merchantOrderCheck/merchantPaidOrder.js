import request from '@/utils/request'

export function getOrderlist(query, sysType) {
  return request({
    url: 'order/remitList',
    method: 'post',
    data: query,
    sysType: sysType
  })
}
export function listSituation(query, sysType) {
  return request({
    url: 'order/remit/statistics',
    method: 'post',
    data: query,
    sysType: sysType
  })
}

export function goReminder(query, sysType) {
  return request({
    url: 'order/remit/reminder',
    method: 'post',
    data: query,
    sysType: sysType
  })
}
