import request from '@/utils/request'

export function getSubList(data) {
  return request({
    url: 'user/queryList',
    method: 'post',
    data
  })
}
export function ForbiddenSub(data) {
  return request({
    url: 'user/nologin',
    method: 'post',
    data
  })
}
export function resetGoolge(data) {
  return request({
    url: 'user/resetGoolgeSec',
    method: 'post',
    data
  })
}
export function deleteSub(data) {
  return request({
    url: 'user/delete',
    method: 'post',
    data
  })
}
export function updateSubAccount(data) {
  return request({
    url: 'user/update',
    method: 'post',
    data
  })
}
export function getRoles() {
  return request({
    url: 'user/getRoles',
    method: 'post'
  })
}
