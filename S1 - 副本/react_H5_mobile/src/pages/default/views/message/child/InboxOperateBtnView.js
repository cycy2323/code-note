/* eslint-disable react/prop-types */
/*
*
* 描述：共享的全选、删除和标记已读
* @author lee
* @create 2019-02-08 2:46 PM
*/
import React from 'react'
import {Button, Checkbox, Modal, Toast} from 'antd-mobile'

export const InboxOperateBtnView = (props) => {
  const {t} = props.props
  //获取选中的列表
  let getSelecting = (type) => {
    let list = []
    props.state.list.forEach(item => {
      if (type === 'read') {
        if (item.selected && !item.read) list.push(item.id)
      } else {
        if (item.selected) list.push(item.id)
      }
    })
    return list
  }
  return (
    <div className='inbox-page-btn'>
      {/*排除当数据列表为空的时候选中全选*/}
      <Checkbox.AgreeItem
        defaultChecked={false}
        checked={getSelecting().length === props.state.list.length && props.state.list.length !== 0}
        onChange={(e) => {
          e.stopPropagation()
          props.handleSelectEvent('all', e.target.checked)
        }}
      >
        {t('view.local.inbox.selectAll')}
      </Checkbox.AgreeItem>
      <Button
        className='del-button'
        onClick={() => {
          let list = getSelecting()
          // 获取已勾选项的ID
          if (list.length > 0) {
            Modal.alert('', t('view.local.inbox.deleteContent'), [
              {text: t('view.local.inbox.cancel')},
              {
                text: t('view.local.inbox.sure'),
                onPress: () =>
                  props.handleDelData(list)
              }
            ])
          }
        }
        }
      >
        {t('view.local.inbox.delete')}
      </Button>
      <Button
        className='mark-button'
        onClick={() => {
          let list = getSelecting('read')
          // 过滤已读项和未勾选项
          if (list.length > 0) {
            Modal.alert('', t('view.local.inbox.markContent'), [
              {text: t('view.local.inbox.cancel')},
              {
                text: t('view.local.inbox.sure'),
                onPress: () =>
                  props.handleSetRead(list)
              },
            ])
          } else {
            Toast.info('没有未读的信息！', 1)
          }
        }
        }
      >
        {t('view.local.inbox.markRead')}
      </Button>
    </div>
  )
}
