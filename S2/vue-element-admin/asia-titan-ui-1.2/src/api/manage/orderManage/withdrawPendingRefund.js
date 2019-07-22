import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/remit/listFailRefundPage',
    method: 'post',
    data: query
  })
}

export function failRefundStatis(query) {
  return request({
    url: '/remit/failRefundStatis',
    method: 'post',
    data: query
  })
}

export function getDayReissue(query) {
  return request({
    url: '/remit/refreshProcessState',
    method: 'post',
    data: query
  })
}
