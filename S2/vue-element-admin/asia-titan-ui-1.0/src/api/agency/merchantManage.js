import request from '@/utils/request'

// 平台商户查询
export function fetchList(query, sysType) {
  return request({
    url: '/mer/queryMerchants',
    method: 'post',
    data: query,
    sysType: sysType
  })
}

// 添加平台商户
export function addMerchant(data) {
  return request({
    url: '/mer/addMerchants',
    method: 'post',
    data
  })
}

// 添加平台商户中获取银行列表
export function bankList() {
  return request({
    url: '/common/bank/queryBankOptionList',
    method: 'post'
  })
}
// 修改
export function updateMerchant(data) {
  return request({
    url: '/mer/updateMerchants',
    method: 'post',
    data
  })
}
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
