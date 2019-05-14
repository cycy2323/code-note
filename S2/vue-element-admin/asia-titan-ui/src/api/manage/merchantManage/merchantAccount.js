import request from '@/utils/request'

export function fetchList(query, sysType) {
  return request({
    url: '/merchant/setting/queryPage',
    method: 'post',
    data: query,
    sysType: sysType
  })
}

// 查询商户更新信息
export function getMerchant(id) {
  return request({
    url: '/merchant/setting/queryUpdateMerchantInfo/' + id,
    method: 'get'
  })
}

export function updateMerchant(data) {
  return request({
    url: '/merchant/setting/updateMerchant',
    method: 'post',
    data
  })
}

export function restMerchant(data) {
  return request({
    url: '/merchant/setting/restMerchant',
    method: 'post',
    data
  })
}
// 银行列表
export function bankList() {
  return request({
    url: '/common/bank/queryBankOptionList',
    method: 'post'
  })
}

export function accountStatistics(query, sysType) {
  return request({
    url: '/merchant/setting/merchantAccountStatistics',
    method: 'post',
    data: query,
    sysType: sysType
  })
}
