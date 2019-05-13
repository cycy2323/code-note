/*
*
* 描述：
* @author lee
* @create 2019-03-10 7:33 PM
*/
import React from 'react'
import {Modal, List, Radio, Card} from 'antd-mobile'

const DepositSubmitModal = (props) => {
  return (
    <Modal
      className={'common-modal-with-close'}
      visible={props.visible}
      transparent
      closable={true}
      maskClosable={true}
      onClose={() => props.onClose()}
      title={props.title}
      footer={[{
        text: props.submitText, onPress: () => {
          props.onSubmit()
        }
      }]}
    >
      <List.Item extra={props.rechargeAmount}>
        金额：
      </List.Item>
      <List.Item extra={props.counterFee}>
        {props.fee < 0 ? '返手续费：' : '手续费'}
      </List.Item>
      {props.data && props.data.length > 0
        ? <List.Item>
          优惠：
          <div className='activity-list'>
            {
              props.data.map(
                item => {
                  return (
                    <Radio.RadioItem
                      key={item.id}
                      checked={props.activityId === item.id}
                      onClick={() => {
                        props.onChange(item.id)
                      }
                      }
                    >
                      {item.activityName}
                    </Radio.RadioItem>
                  )
                }
              )
            }
          </div>
        </List.Item>
        : null
      }
    </Modal>
  )
}
export default DepositSubmitModal
