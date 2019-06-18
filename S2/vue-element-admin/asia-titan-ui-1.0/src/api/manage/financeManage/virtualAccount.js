import request from '@/utils/request'
// 查询全部
export function fetchList(query, sysType) {
  return request({
    url: '/transfer/queryPage',
    method: 'post',
    data: query,
    sysType: sysType
  })
}

export function accountRecharge(data) {
  return request({
    url: '/transfer/addTransfer',
    method: 'post',
    data
  })
}

// 审核
export function accountVerify(query, sysType) {
  return request({
    url: '/transfer/reviewTransfer',
    method: 'post',
    data: query,
    sysType: sysType
  })
}
// 一审查询
export function shallowVerify(query, sysType) {
  return request({
    url: '/transfer/queryPageNoReview',
    method: 'post',
    data: query,
    sysType: sysType
  })
}

// 二审查询
export function deepVerify(query, sysType) {
  return request({
    url: '/transfer/queryPageReview',
    method: 'post',
    data: query,
    sysType: sysType
  })
}

// 获取凭证
export function getOss(query, sysType) {
  return request({
    url: '/genericSignature',
    method: 'get',
    data: query,
    sysType: '/oss'
  })
}
