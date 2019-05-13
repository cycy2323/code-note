import request from '@/utils/request'

export function fetchList(query, sysType) {
  return request({
    url: '/merchant/payOrder/queryPage',
    method: 'post',
    data: query,
    sysType: sysType
  })
}
export function getDayStatistics(query) {
  return request({
    url: '/merchant/payOrder/statistics',
    method: 'post',
    data: query
  })
}

// 同步
export function getDaySynchronism(query) {
  return request({
    url: '/merchant/payOrder/syncState',
    method: 'post',
    data: query
  })
}

// 查看订单状态
export function getOrderStatus(data) {
  return request({
    url: '/merchant/payOrder/queryState',
    method: 'post',
    data
  })
}

// 补单申请
export function getBudang(data) {
  return request({
    url: '/merchant/payOrder/replacementFirst',
    method: 'post',
    data
  })
}

// 订单审核
export function getExamine(data) {
  return request({
    url: '/merchant/payOrder/replacementSecond',
    method: 'post',
    data
  })
}

// 冻结订单
export function getFrozen(data) {
  return request({
    url: '/merchant/payOrder/frezee',
    method: 'post',
    data
  })
}

// 解冻订单
export function getThaw(data) {
  return request({
    url: '/merchant/payOrder/unfrezee',
    method: 'post',
    data
  })
}

// 查看冻结记录
export function getFrozenList(data) {
  return request({
    url: '/common/frezeeRecord',
    method: 'post',
    data
  })
}

// 查看冻结记录
export function getExamineList(data) {
  return request({
    url: '/common/auditRecord',
    method: 'post',
    data
  })
}
