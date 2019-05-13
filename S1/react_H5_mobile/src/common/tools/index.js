import React from 'react'
import {Toast} from 'antd-mobile'
//将不符合label，value格式的数组转换成label，value格式
export const changeListLabel = (array, labelKey = 'label', valueKey = 'value') => {
  if (Array.isArray(array)) {
    return array.map(item => {
      return {label: item[labelKey], value: item[valueKey]}
    })
  } else {
    return []
  }
}
//将数组转换成字典对象
export const changeListToDict = (array, labelKey = 'label', valueKey = 'value') => {
  let dict = {}
  if (Array.isArray(array)) {
    array.forEach(item => {
      dict[item[valueKey]] = item[labelKey]
    })
  }
  return dict
}
//获取链接中的参数
export const getLocationParams = (key) => {
  let obj = {}
  if (window.location.search) {
    window.location.search.replace('?', '').split('&').forEach(item => {
      obj[item.split('=')[0]] = item.split('=')[1]
    })
  }
  return key ? obj[key] : obj
}
/*
 * 获取数据失败后的回调处理函数
* */
export const failCallBack = (props) => {
  return Toast.fail(props.message, props.timestamp || 1, () => {
    if (!props.unNeedLogin) {
      if (props.code === '1001' || props.code === '606') {
        props.history.push('/login')
      }
    }
  })
}
