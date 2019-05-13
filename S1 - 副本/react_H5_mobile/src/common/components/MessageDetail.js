/* eslint-disable react/prop-types */
/*
*
* 描述：
* @author lee
* @create 2019-02-06 5:42 PM
*/
import React from 'react'
import {Card} from 'antd-mobile'

const MessageDetail = (props) => {
  return (<div className={props.className ? props.className + ' com-message-detail' : 'com-message-detail'}>
    <Card>
      {props.title ? <h2 className='message-title'>{props.title}</h2> : null}
      <div className='message-content'>{props.content}</div>
      <div className='message-date'>{props.author} {props.date}</div>
    </Card>
  </div>)
}
export default MessageDetail
