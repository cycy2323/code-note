import request from '@/utils/request'

export function fetchList(query, sysType) {
  return request({
    url: 'agent/qrMerchantOrderPage',
    method: 'post',
    data: query,
    sysType: sysType
  })
}

export function merchantList(query, sysType) {
  return request({
    url: 'agent/getListQrcodeMerchant',
    method: 'post',
    data: query,
    sysType: sysType
  })
}

export function freezeAccount(data) {
  return request({
    url: 'agent/updateQrcodeMerchant',
    method: 'post',
    data
  })
}
