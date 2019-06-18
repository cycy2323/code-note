import request from '@/utils/request'

export function addTransfer(data) {
  return request({
    url: 'addTransferByHandle',
    method: 'post',
    data
  })
}
