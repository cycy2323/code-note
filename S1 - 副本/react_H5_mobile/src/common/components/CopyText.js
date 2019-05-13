/*
*
* 描述：复制文本
* @author lee
* @create 2019-03-10 7:22 PM
*/
import React from 'react'
import {Toast} from 'antd-mobile'

const CopyText = (props) => {
  return (
    <span
      className='copy-text'
      onClick={() => {
        let textField = document.createElement('textarea')
        textField.innerText = props
        document.body.appendChild(textField)
        textField.select()
        document.execCommand('copy')
        textField.remove()
        Toast.success('复制成功', 1)
      }}>复制</span>
  )
}
export default CopyText
