import request from '@/utils/request'

export function setloginIp(data) {
  return request({
    url: 'sys/setloginIp',
    method: 'post',
    data
  })
}
export function getLoginIp() {
  return request({
    url: 'sys/getLoginIp',
    method: 'post'
  })
}
