import request from '@/utils/request'

// 交易订单统计
export function transactionList(query, sysType) {
  return request({
    url: '/orderStats/transactionOrderStatits',
    method: 'post',
    data: query,
    sysType: sysType
  })
}

// 代付订单统计
export function paidList(query, sysType) {
  return request({
    url: '/orderStats/remitOrderStatits',
    method: 'post',
    data: query,
    sysType: sysType
  })
}
// export function fetchArticle(id) {
//   return request({
//     url: '/article/detail',
//     method: 'post',
//     params: { id }
//   })
// }
//
// export function fetchPv(pv) {
//   return request({
//     url: '/article/pv',
//     method: 'post',
//     params: { pv }
//   })
// }
//
// export function createArticle(data) {
//   return request({
//     url: '/article/create',
//     method: 'post',
//     data
//   })
// }
//
// export function updateArticle(data) {
//   return request({
//     url: '/article/update',
//     method: 'post',
//     data
//   })
// }
