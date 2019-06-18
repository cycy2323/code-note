import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/user/listPage',
    method: 'post',
    data: query
  })
}
// 员工列表-解锁
export function empUnLock(data) {
  return request({
    url: '/user/unLockUser',
    method: 'post',
    data
  })
}
// 强制登出
export function logout(data) {
  return request({
    url: '/user/logout',
    method: 'post',
    data
  })
}
// 重置谷歌验证码
export function resetGoogleSecret(data) {
  return request({
    url: '/user/resetGoogleSecret',
    method: 'post',
    data
  })
}
// 修改登录密码
export function loginPassword(data) {
  return request({
    url: '/user/updatePassword',
    method: 'post',
    data
  })
}
// 修改支付密码
export function updatePayPassword(data) {
  return request({
    url: '/user/updatePayPassword',
    method: 'post',
    data
  })
}

export function fetchAdd(query) {
  return request({
    url: '/user/add',
    method: 'post',
    data: query
  })
}

export function fetchUpdate(query) {
  return request({
    url: '/user/update',
    method: 'post',
    data: query
  })
}

export function fetchQueryRole(data) {
  return request({
    url: '/role/queryRole',
    method: 'post',
    data
  })
}

export function updateArticle(data) {
  return request({
    url: '/article/update',
    method: 'post',
    data
  })
}
