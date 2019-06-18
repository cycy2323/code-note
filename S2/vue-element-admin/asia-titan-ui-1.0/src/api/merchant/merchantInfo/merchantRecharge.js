import request from '@/utils/request'

export function getBankList() {
  return request({
    url: 'queryBankList',
    method: 'post'
  })
}

export function doRecharge(data) {
  return request({
    url: 'queryRechargeUrl',
    method: 'post',
    data
  })
}

export function getAllBankList() {
  return request({
    url: 'queryAllBankList',
    method: 'post'
  })
}
