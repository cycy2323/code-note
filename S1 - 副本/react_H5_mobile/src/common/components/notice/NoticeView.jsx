/* eslint-disable react/prop-types */
//  公告组件

import React from 'react'
import {NoticeBar} from 'antd-mobile'

const NoticeTemplate = (props) => {
  return (
    <div className={props.className ? 'com-notice ' + props.className : 'com-notice'}>
      <NoticeBar icon={<span className='notice-title'>
        {props.title}
      </span>} marqueeProps={{loop: true}}>
        {props.notice}
      </NoticeBar>
    </div>
  )
}

export default NoticeTemplate
