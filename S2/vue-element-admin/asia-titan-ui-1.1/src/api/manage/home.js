import request from '@/utils/request'

export function getTodayOverview() {
  return request({
    url: 'manage/home/merTodayOverview',
    method: 'get'
  })
}

export function getHomeBaseMsg() {
  return request({
    url: 'manage/home/homeBaseMsg',
    method: 'get'
  })
}
