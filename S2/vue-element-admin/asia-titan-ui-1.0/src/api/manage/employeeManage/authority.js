import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/perm/queryPermList',
    method: 'post',
    data: query
  })
}

export function fetchAdd(query) {
  return request({
    url: '/perm/addPerm',
    method: 'post',
    data: query
  })
}

export function fetchUpdate(query) {
  return request({
    url: '/perm/updatePerm',
    method: 'post',
    data: query
  })
}

export function fetchQueryMenus(data) {
  return request({
    url: '/role/queryMenus',
    method: 'post',
    data
  })
}

export function updateDetele(data) {
  return request({
    url: '/perm/deletePerm',
    method: 'post',
    data
  })
}
