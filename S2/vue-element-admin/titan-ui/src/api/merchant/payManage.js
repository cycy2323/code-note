import request from '@/utils/request'

/**
 *
 * @param query
 */
export function getUsePays(query) {
  return request({
    url: '/merChannel/getUsePays',
    method: 'post',
    data: query
  })
}

export function getChannels(query) {
  return request({
    url: '/channel/getChannels',
    method: 'post',
    data: query
  })
}

export function updateStatus(channelId, query) {
  return request({
    url: 'merChannel/updateStatus/' + channelId,
    method: 'get',
    params: query
  })
}

export function getConfigDetail(dataId) {
  return request({
    url: 'merChannel/' + dataId,
    method: 'get'
  })
}

export function channelBind(data) {
  return request({
    url: 'merChannel/bind',
    method: 'post',
    data
  })
}

export function getChannelDetail(channelId) {
  return request({
    url: '/channel/getChannelDetail',
    method: 'get',
    params: { channelId: channelId }
  })
}

export function oneAccessChannel(data) {
  return request({
    url: 'merChannel/oneAccessChannel',
    method: 'post',
    data
  })
}
