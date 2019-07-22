import request from '@/utils/request'

// 查询
export function fetchList(query, sysType) {
  return request({
    url: '/merchant/list/queryPage',
    method: 'post',
    data: query,
    sysType: sysType
  })
}

// 添加
export function addMerchant(data) {
  return request({
    url: '/agent/addMerchants',
    method: 'post',
    data
  })
}

// 修改
export function updateMerchant(data) {
  return request({
    url: '/agent/updateMerchants',
    method: 'post',
    data
  })
}

// 审批
export function approvalMerchant(data) {
  return request({
    url: '/agent/merApproval',
    method: 'post',
    data
  })
}

// 商户组查询
export function merchantGroup() {
  return request({
    url: '/agent/mer/queryMerGroup',
    method: 'post'
  })
}
