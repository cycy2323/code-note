import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/intercept/queryPage',
    method: 'post',
    data: query
  })
}

export function bankList() {
  return request({
    url: '/common/bank/queryBankOptionList',
    method: 'post'
  })
}

