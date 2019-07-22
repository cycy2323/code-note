import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/agent/users/queryUsersInFo',
    method: 'post',
    data: query
  })
}

export function fetchAdd(query) {
  return request({
    url: '/agent/users/addUser',
    method: 'post',
    data: query
  })
}

export function fetchUpdate(query) {
  return request({
    url: '/agent/users/updateUser',
    method: 'post',
    data: query
  })
}

export function resetPwd(query) {
  return request({
    url: '/agent/users/updateUser',
    method: 'post',
    data: query
  })
}
// 解锁
export function agentUnLock(data) {
  return request({
    url: '/agent/unLockAgent',
    method: 'post',
    data
  })
}
