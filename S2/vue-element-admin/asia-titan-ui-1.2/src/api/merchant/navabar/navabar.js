import request from '@/utils/request'

export function getNotification(data) {
  return request({
    url: 'notification/queryNotificationContent',
    method: 'post',
    data
  })
}
export function getOrderMsg(data) {
  return request({
    url: 'notification/pullOrderNotification',
    method: 'post',
    data
  })
}
export function updateSeenOrder(data) {
  return request({
    url: 'notification/updateSeeOrder',
    method: 'post',
    data
  })
}
