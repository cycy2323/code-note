import request from '@/utils/request'

export function ModeladdTransfer(data) {
  return request({
    url: 'addTransferByCash',
    method: 'post',
    data
  })
}
