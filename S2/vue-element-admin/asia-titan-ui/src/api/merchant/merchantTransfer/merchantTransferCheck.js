import request from '@/utils/request'

export function getOrderList(data) {
  return request({
    url: 'innerTransfer/queryPage',
    method: 'post',
    data
  })
}
