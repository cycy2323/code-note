/* eslint-disable react/prop-types */
import React from 'react'
import {Button, List, Modal, Toast} from 'antd-mobile'
import {failCallBack} from 'common/tools';
import {soulContext} from 'soul'
//展示钱包
const DisplayWallet = (props) => {
  return (
    <div>
      <List className="header">
        <List.Item extra={props.currency + (props.totalAssets || 0).toFixed(2)}>
          {props.t('view.local.home.modal.right.totalAssets')}
        </List.Item>
        <List.Item extra={props.currency + (props.walletBalance || 0).toFixed(2)}>
          {props.t('view.local.home.modal.right.walletBalance')}
        </List.Item>
      </List>
      <List className="content">
        {props.apis.map(item => <List.Item
          extra={item.status ? <span className='maintain'>{item.status}</span> : (props.balance || 0).toFixed(2)}
          key={item.apiId}>
          {item.apiName}
        </List.Item>)}
      </List>
      <List className="footer">
        <List.Item>
          <Button
            className='primary'
            onClick={() => {
              props.handleRecovery()
            }
            }>{props.t('view.local.home.modal.right.recycle')}</Button>
        </List.Item>
        <List.Item>
          <Button
            className='active'
            onClick={() =>
              props.handleStateChange({
                showRightModal: false,
                selectedTab: 'saving'
              })
            }>{props.t('view.local.home.modal.right.deposit')}</Button>
        </List.Item>
      </List>
    </div>
  )
}

class UserFundView extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      apis: props.user.apis
    }
    this.handleRecovery = this.handleRecovery.bind(this)
  }

  handleRecovery() {
    //一键回收
    this.props.$service.mineOrigin().recovery.post()
      .then(res => {
        if (res.code === '0') {
          Toast.info(res.message, 1, () => {
            //回收后刷新
            this.props.$service.userInfoOrigin().refresh.post()
              .then(res => {
                if (res.code === '0') {
                  this.setState({
                    apis: res.data.apis
                  })
                } else {
                  failCallBack({message: res.message, code: res.code,})
                }
              })
          })
        } else {
          failCallBack({message: res.message, code: res.code,})
        }
      })
  }

  render() {
    const {history, t, $service} = this.props
    return (
      <div className="home-nav-right">
        <Modal
          popup
          visible={this.props.show}
          animationType="slide-down"
          onClose={() => this.props.handleStateChange({showRightModal: false})}
          className={localStorage.getItem('theme') + ' home-right-pop-modal'}
        >
          {
            DisplayWallet({
              $service,
              t,
              apis: this.state.apis,
              currency: this.props.user.currency,
              totalAssets: this.props.user.totalAssets,
              walletBalance: this.props.user.walletBalance,
              handleRecovery: this.handleRecovery,
              handleStateChange: this.props.handleStateChange
            })
          }
        </Modal>
      </div>
    )
  }
}

export default soulContext()(UserFundView)
