import request from '@/utils/request'

export function getRecharge() {
  return request({
    url: 'payMethod/amountLimit',
    method: 'get'
  })
}
