import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/common/getSysKvPairEntry',
    method: 'post',
    data: query
  })
}

export function updateSystemSet(query) {
  return request({
    url: '/common/updateOrAddSysKvPairEntry',
    method: 'post',
    data: query
  })
}
