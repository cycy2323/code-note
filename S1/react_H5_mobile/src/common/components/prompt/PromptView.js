//   提示组件

import React from 'react'
import {NoticeBar} from 'antd-mobile'

const PromptTemplate = (props) => {
  return (
    <NoticeBar
      icon={props.icon ? props.icon : null}
      mode={props.mode}
      action={props.action}
      marqueeProps={{loop: props.loop !== false}}>
      {
        props.text
      }
    </NoticeBar>
  )
}

export default PromptTemplate
