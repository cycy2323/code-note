import request from '@/utils/request'

export function getOrderList(data) {
  return request({
    url: 'order/intercept/remitList',
    method: 'post',
    data
  })
}
