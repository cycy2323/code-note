import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/role/listPage',
    method: 'post',
    data: query
  })
}

export function fetchAdd(query) {
  return request({
    url: '/role/addRole',
    method: 'post',
    data: query
  })
}

export function fetchQueryMenus(data) {
  return request({
    url: '/role/queryPerm',
    method: 'post',
    data
  })
}

export function checkRole(query) {
  return request({
    url: '/role/getCheckedMenu',
    method: 'post',
    data: query
  })
}

export function fetchUpdate(query) {
  return request({
    url: '/role/updateBaseRole',
    method: 'post',
    data: query
  })
}

export function fetchUpdateRole(query) {
  return request({
    url: '/role/updateRolePerm',
    method: 'post',
    data: query
  })
}

export function fetchDelete(query) {
  return request({
    url: '/role/deleteRole',
    method: 'post',
    data: query
  })
}

export function htmlContent(query) {
  return request({
    url: '/role/queryUserByRole',
    method: 'post',
    data: query
  })
}
