import request from '@/utils/request'

export function innerTransfer(data) {
  return request({
    url: 'innerTransfer/do',
    method: 'POST',
    data
  })
}
