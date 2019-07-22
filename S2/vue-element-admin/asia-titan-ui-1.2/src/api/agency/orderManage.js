import request from '@/utils/request'

// 代付订单查询
export function paidList(query, sysType) {
  return request({
    url: '/order/queryMerRemitOrder',
    method: 'post',
    data: query,
    sysType: sysType
  })
}

// 交易订单查询
export function transactionList(query, sysType) {
  return request({
    url: '/order/queryMerCustomerTrade',
    method: 'post',
    data: query,
    sysType: sysType
  })
}

// 支付订单统计
export function payStatis(query, sysType) {
  return request({
    url: '/order/payStatis',
    method: 'post',
    data: query,
    sysType: sysType
  })
}

// 代付订单统计
export function remitStatis(query, sysType) {
  return request({
    url: '/order/remitStatis',
    method: 'post',
    data: query,
    sysType: sysType
  })
}
