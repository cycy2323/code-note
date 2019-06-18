import request from '@/utils/request'

export function openService(merUUID) {
  return request({
    url: '/cashDesk/' + merUUID,
    method: 'get'
  })
}

export function openServicePay(data) {
  return request({
    url: '/pay',
    method: 'post',
    data
  })
}
