/* eslint-disable react/prop-types,no-undef */
/*
*
* 描述：共享的全选、删除和标记已读
* @author lee
* @create 2019-02-08 2:46 PM
*/
import React from 'react'
import {DatePicker, Flex, Icon, InputItem, List, Picker} from 'antd-mobile'
import AppIcon from 'common/components/image/AppIcon'

export const NoticeOperateBtnView = (props) => {
  const {t} = props.props
  return (
    <div className='notice-page-btn'>
      <Flex justify="between" className='com-search-line'>
        <DatePicker
          mode='date'
          onChange={date => props.handleGetData({
            beginTime: date
          })}
          minDate={props.state.minDate}
          maxDate={props.state.endTime ? props.state.endTime : props.state.maxDate}
        >
          <List className='date-selector'>
            <InputItem
              placeholder={t('view.local.notice.startPlaceholder')}
              labelNumber={2}
              editable={false}
              value={props.state.beginTime ? moment(props.state.beginTime).format('YYYY-MM-DD') : ''}>
              {AppIcon({name: '#icon-calendar'})}
            </InputItem>
          </List>
        </DatePicker>
        <span className='separator'>~</span>
        <DatePicker
          mode='date'
          onChange={date => props.handleGetData({
            endTime: date
          })}
          minDate={props.state.beginTime ? props.state.beginTime : props.state.minDate}
          maxDate={props.state.maxDate}
        >
          <List className='date-selector'>
            <InputItem
              placeholder={t('view.local.notice.endPlaceholder')}
              labelNumber={2}
              editable={false}
              value={props.state.endTime ? moment(props.state.endTime).format('YYYY-MM-DD') : ''}>
              {AppIcon({name: '#icon-calendar'})}
            </InputItem>
          </List>
        </DatePicker>
        {<Picker
          data={props.state.selectList || []}
          cols={1}
          value={props.state.selectType}
          className="select-type"
          onOk={type => props.handleGetData({
            selectType: type
          })}
        >
          <List
            className='type-selector'
            style={{visibility: props.state.selectList ? 'visible' : 'hidden'}}
          >
            <InputItem
              labelNumber={2}
              editable={false}
              value={props.state.selectType ? props.dictSelect[props.state.selectType] : null}
              extra={<Icon type='down'/>}>
            </InputItem>
          </List>
        </Picker>}

      </Flex>
    </div>
  )
}
