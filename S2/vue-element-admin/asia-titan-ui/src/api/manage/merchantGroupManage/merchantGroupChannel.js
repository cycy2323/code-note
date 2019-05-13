import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/merchantGroup/getGroupChannel',
    method: 'post',
    data: query
  })
}

export function fetchChannel(query) {
  return request({
    url: '/channel/list',
    method: 'post',
    data: query
  })
}

export function updateGroupChannel(query) {
  return request({
    url: '/merchantGroup/updateGroupChannel',
    method: 'post',
    data: query
  })
}

export function deleteGroupChannel(query) {
  return request({
    url: '/merchantGroup/deleteGroupChannel',
    method: 'post',
    data: query
  })
}
