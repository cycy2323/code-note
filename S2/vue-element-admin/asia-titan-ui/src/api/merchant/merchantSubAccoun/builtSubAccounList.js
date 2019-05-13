import request from '@/utils/request'

export function builtSubmit(data) {
  return request({
    url: 'user/add',
    method: 'post',
    data
  })
}
