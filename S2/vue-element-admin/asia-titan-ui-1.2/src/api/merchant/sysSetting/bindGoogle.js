import request from '@/utils/request'

export function checkBindGoogle() {
  return request({
    url: 'sys/checkBindGoogle',
    method: 'post'
  })
}

export function bindGoogle(data) {
  return request({
    url: 'sys/bindGoogle',
    method: 'post',
    data
  })
}
