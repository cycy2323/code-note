import request from '@/utils/request'

export function getOrderList(data) {
  return request({
    url: 'queryPageByHandle',
    method: 'post',
    data
  })
}
export function orderAudit(data) {
  return request({
    url: 'reviewTransferByHandle ',
    method: 'post',
    data
  })
}

