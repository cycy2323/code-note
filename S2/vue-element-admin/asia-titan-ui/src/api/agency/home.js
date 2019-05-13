import request from '@/utils/request'

// 今日订单  今日流水
export function orderFlow() {
  return request({
    url: '/home/moneyFlowstatistics',
    method: 'post'
  })
}

// 根据时间查询
export function fetchList(data) {
  return request({
    url: '/home/merTradeStats',
    method: 'post',
    data
  })
}

// 提现
export function cashWithdrawal(data) {
  return request({
    url: '/home/cashWithdrawal',
    method: 'post',
    data
    // params: { pv }
  })
}

// 平台系统退出接口

export function logOut(id) {
  return request({
    url: '/home/currentLoginUserSignOut',
    method: 'post',
    params: { id }
  })
}

// export function updateArticle(data) {
//   return request({
//     url: '/article/update',
//     method: 'post',
//     data
//   })
// }
