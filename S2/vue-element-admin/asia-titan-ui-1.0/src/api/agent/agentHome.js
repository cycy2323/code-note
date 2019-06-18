import request from '@/utils/request'

export function homeIncome() {
  return request({
    url: 'agent/agentAmountDetail',
    method: 'get'
  })
}

export function todayOverview() {
  return request({
    url: 'agent/todaySoverview',
    method: 'get'
  })
}

export function withdrawMoney(data) {
  return request({
    url: 'agent/applyWithDrawal',
    method: 'post',
    data
  })
}

export function payBankList(data) {
  return request({
    url: 'agent/getAgentBankCards',
    method: 'get',
    data
  })
}
export function agentBankCards() {
  return request({
    url: 'agent/getAgentBankCards',
    method: 'get'
  })
}
export function agentWithdraw(data) {
  return request({
    url: 'agent/applyWithDrawal',
    method: 'post',
    data
  })
}
