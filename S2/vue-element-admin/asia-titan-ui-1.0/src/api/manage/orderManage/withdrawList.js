import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/remit/listPage',
    method: 'post',
    data: query
  })
}

export function getDayStatistics(query) {
  return request({
    url: '/remit/statistics',
    method: 'post',
    data: query
  })
}

export function getCompleteBankAccount(id) {
  return request({
    url: '/remit/info/' + id,
    method: 'get'
  })
}

// 同步
export function getDaySynchronism(query) {
  return request({
    url: '/remit/syncState',
    method: 'post',
    data: query
  })
}

// 查看状态
export function getRepayStatus(data) {
  return request({
    url: '/remit/queryState',
    method: 'post',
    data
  })
}

// 退款
export function getRefund(data) {
  return request({
    url: '/remit/firstAudit',
    method: 'post',
    data
  })
}

// 审核
export function getRepayExamine(data) {
  return request({
    url: '/remit/secondAudit',
    method: 'post',
    data
  })
}
// 通道名称
export function fetchChannelList(data) {
  return request({
    url: '/channel/list',
    method: 'post',
    data
  })
}
