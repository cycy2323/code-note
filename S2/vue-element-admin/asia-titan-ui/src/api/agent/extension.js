import request from '@/utils/request'

export function extensionInfo() {
  return request({
    url: 'agent/myPromotion',
    method: 'get'
  })
}
