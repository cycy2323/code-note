/* eslint-disable react/prop-types */
/*
*
* 描述：
* @author lee
* @create 2019-01-30 2:22 PM
*/
import React from 'react'
import {Badge, Icon} from 'antd-mobile'

const MessageCard = (props) => {
  //判断是否启用可选功能以及是否已选中
  const selectIcon = props.selectable ?
    <div
      className='select-radio'
      onClick={(e) => {
        e.stopPropagation()
        return props.handleSelectEvent ? props.handleSelectEvent(props, !props.selected) : {}
      }}>
      {props.selected ? <Icon type='check-circle'/> : <div className='unselected'/>}
    </div>
    : ''
  return (<div
    key={props.key}
    className={'com-message-card ' + (props.className ? props.className : '')}
    onClick={(e) => {
      e.preventDefault()
      return props.handleClickEvent ? props.handleClickEvent(props) : null
    }
    }>
    <Badge text={props.read ? '' : 'NEW'} corner>
      {selectIcon}
      <div className='message-item'>
        <div className='message-content' style={{fontWeight: props.new ? 'bolder' : 'normal'}}>
          {props.content}
        </div>
        <div className='message-info'>
          <span className='author'>{props.author}</span>
          {props.date}
        </div>
      </div>
    </Badge>
  </div>)
}
export default MessageCard
