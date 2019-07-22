import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/merchantAccountLog/pageGeneral',
    method: 'post',
    data: query
  })
}

export function fetchListObvious(query) {
  return request({
    url: '/merchantAccountLog/page',
    method: 'post',
    data: query
  })
}
