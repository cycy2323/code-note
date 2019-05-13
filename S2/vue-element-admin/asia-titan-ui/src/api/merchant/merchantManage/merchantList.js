import request from '@/utils/request'

export function getConf() {
  return request({
    url: 'cashConf/get',
    method: 'get'
  })
}

export function myCashierSave(data) {
  return request({
    url: 'cashConf/save',
    method: 'post',
    data
  })
}

export function qkAmountList() {
  return request({
    url: 'qkAmount/list',
    method: 'get'
  })
}
