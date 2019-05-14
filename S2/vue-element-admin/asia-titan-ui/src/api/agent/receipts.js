import request from '@/utils/request'

export function agentBankCards() {
  return request({
    url: 'agent/getAgentBankCards',
    method: 'get'
  })
}

export function addAccount(data) {
  return request({
    url: 'agent/addOrUpDatebBankCard',
    method: 'post',
    data
  })
}

export function getBankList() {
  return request({
    url: 'agent/getBankList',
    method: 'get'
  })
}

export function updateBankCard(data) {
  return request({
    url: 'agent/addOrUpDatebBankCard',
    method: 'post',
    data
  })
}

export function deleteBankCard(data) {
  return request({
    url: 'agent/deleteAgentBindBank',
    method: 'get',
    params: data
  })
}
