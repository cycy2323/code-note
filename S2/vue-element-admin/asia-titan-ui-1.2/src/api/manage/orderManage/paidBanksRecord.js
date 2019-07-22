import request from '@/utils/request'

export function fetchList(query, sysType) {
  return request({
    url: '/remitBank/page',
    method: 'post',
    data: query,
    sysType: sysType
  })
}
export function updateState(data) {
  return request({
    url: '/remitBank/updateState',
    method: 'post',
    data
  })
}
