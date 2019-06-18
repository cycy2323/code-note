import request from '@/utils/request'

export function addQkAmount(data) {
  return request({
    url: 'qkAmount/add',
    method: 'post',
    data
  })
}

export function deleteQkAmount(id) {
  return request({
    url: 'qkAmount/delete/' + id,
    method: 'get'
  })
}

export function updateQkAmount(data) {
  return request({
    url: 'qkAmount/update',
    method: 'post',
    data
  })
}

export function payMethodAllConfig() {
  return request({
    url: 'payMethod/allConfig',
    method: 'get'
  })
}

export function modifyConfig(data) {
  return request({
    url: 'payMethod/modifyConfig',
    method: 'post',
    data
  })
}
