import request from '@/utils/request'

// 查询
export function fetchList(query, sysType) {
  return request({
    url: '/system/operationLog/merchant/queryPage',
    method: 'post',
    data: query,
    sysType: sysType
  })
}
