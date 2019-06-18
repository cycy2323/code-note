import request from '@/utils/request'

export function getOrderList(data) {
  return request({
    url: 'info/trade/record',
    method: 'post',
    data
  })
}
