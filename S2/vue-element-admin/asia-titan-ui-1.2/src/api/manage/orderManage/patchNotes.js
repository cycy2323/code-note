import request from '@/utils/request'

export function fetchList(query, sysType) {
  return request({
    url: '/auditRecord/page',
    method: 'post',
    data: query,
    sysType: sysType
  })
}
