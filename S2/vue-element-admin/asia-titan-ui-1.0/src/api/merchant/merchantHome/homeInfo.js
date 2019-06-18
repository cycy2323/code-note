import request from '@/utils/request'

export function homeInfo() {
  return request({
    url: 'index/info',
    method: 'post'
  })
}
export function getReport() {
  return request({
    url: 'index/report',
    method: 'post'
  })
}
