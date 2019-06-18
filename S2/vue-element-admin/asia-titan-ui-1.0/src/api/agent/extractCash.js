import request from '@/utils/request'

export function limitInfo() {
  return request({
    url: 'agent/agentAmountDetail?',
    method: 'get'
  })
}

export function orderSelect(data) {
  return request({
    url: 'agent/orderSelectByAgentId',
    method: 'post',
    data
  })
}

export function withdrawHistory(query, sysType) {
  return request({
    url: 'agent/withdrawHistory',
    method: 'post',
    data: query,
    sysType
  })
}
