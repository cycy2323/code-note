import request from '@/utils/request'

export function resetPayPass(data) {
  return request({
    url: 'sys/resetPayPass',
    method: 'post',
    data
  })
}
