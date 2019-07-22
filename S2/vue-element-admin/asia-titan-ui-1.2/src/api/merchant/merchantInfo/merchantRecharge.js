import request from '@/utils/request'

export function getBankList(data) {
  return request({
    url: 'queryBankList',
    method: 'post',
    data
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
