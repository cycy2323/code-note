import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/merchantDifferenceStatistics/queryRealPage',
    method: 'post',
    data: query
  })
}
export function fetchVirtuaList(query) {
  return request({
    url: '/merchantDifferenceStatistics/queryVirtualPage',
    method: 'post',
    data: query
  })
}
export function warningCount(query) {
  return request({
    url: '/merchantDifferenceStatistics/warningCount/' + query.type,
    method: 'post'
    // ,
    // data: query
  })
}
