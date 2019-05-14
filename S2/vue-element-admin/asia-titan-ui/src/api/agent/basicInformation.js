import request from '@/utils/request'

export function personalInformation() {
  return request({
    url: 'agent/getAgentPersonalInformation',
    method: 'get'
  })
}

export function getIpName(query, sysType) {
  return request({
    url: 'agent/getIpName',
    method: 'post',
    data: query,
    sysType
  })
}

export function accountSafety() {
  return request({
    url: 'agent/getAgentAccountAndSafetyMessage',
    method: 'get'
  })
}

export function updateInfo(data) {
  return request({
    url: 'agent/upDateAgentAccountAndSafetyMessage',
    method: 'post',
    data
  })
}
