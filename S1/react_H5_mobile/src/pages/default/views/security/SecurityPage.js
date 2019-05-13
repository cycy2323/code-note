/* eslint-disable react/prop-types */
/*
*
* 描述：安全中心
* @author lee
* @create 2019-01-25 5:42 PM
*/

import React from 'react'
import {Icon, List} from 'antd-mobile'
import MainNav from 'common/components/header/MainHeader'
import {soulContext} from 'soul'
import {failCallBack} from 'common/tools';

// 安全中心头部
const RenderHeader = (props) => {
  const {history, t} = props
  return <div className='header'>
    {MainNav({
      leftContent: <Icon type='left'/>,
      leftEvent: () => {
        sessionStorage.removeItem('securityState')
        history.goBack()
      },
      title: t('view.local.securityCenter.title'),
      className: 'com-header-nav'
    })}
    <div className='header-content'>
      <div className='radar'>
        <div className='scan'/>
      </div>
      <span>{t('view.local.securityCenter.dear')(props.username || '')}</span>
      <span>{t('view.local.securityCenter.notice')}</span>
    </div>
  </div>
}
//主题内容
const RenderContent = (props) => {
  const {history, t} = props
  return <div>
    <List.Item
      extra={t('view.local.securityCenter.modify')}
      arrow="horizontal"
      onClick={() => {
        history.push('security/psw')
      }}>{t('view.local.securityCenter.modifyPsw')}</List.Item>

    <List.Item
      extra={t('view.local.securityCenter.setting')}
      arrow="horizontal"
      onClick={() => {
        history.push('security/code')
      }}>{t('view.local.securityCenter.modifySecurityPsw')}</List.Item>

    <List.Item
      extra={t('view.local.securityCenter.setting')}
      arrow="horizontal"
      onClick={() => {
        history.push('security/mobile')
      }}>{t('view.local.securityCenter.bindPhone')}</List.Item>

    <List.Item
      extra={t('view.local.securityCenter.setting')}
      arrow="horizontal"
      onClick={() => {
        history.push({
          pathname: 'security/bankcard',
          state: {
            bankList: props.bankList,
            bankCard: props.bankCard
          }
        })
      }}>
      {t('view.local.securityCenter.bindBankCard')}
      <span className='bind-card-no'>
        {props.bankCard.bankcardNumber ?
          <span>
            <img className='bank-image' src={'http://test01.ccenter.test.so' + props.bankCard.bankUrl} alt=''/>
            <span>{props.bankCard.bankcardNumber}</span>
          </span> :
          t('view.local.securityCenter.unBindBankCard')
        }
      </span>
    </List.Item>
  </div>
}

class SecurityPage extends React.Component {
  constructor(props) {
    super(props)
    let state = sessionStorage.getItem('securityState') ? JSON.parse(sessionStorage.getItem('securityState')) : {
      username: '',
      bankCard: {},
      bankList: []
    }
    this.state = {
      ...state
    }
  }

  //获取用户关于银行类的信息
  handleGetUserInfo() {
    this.props.$service.userInfoOrigin().getUserInfo.get()
      .then(res => {
        if (res.code === '0') {
          let state = {
            username: res.data.user.username,
            bankCard: {...res.data.user.bankcard},
            bankList: res.data.bankList
          }
          this.setState({...state})
          sessionStorage.setItem('securityState', JSON.stringify(state))
        } else {
          failCallBack({message: res.message, code: res.code, history: this.props.history})
        }
      })
  }

  componentDidMount() {
    this.handleGetUserInfo()
  }

  render() {
    return <div className='security-page'>
      <RenderHeader
        {...this.props}
        username={this.state.username}/>
      <RenderContent
        {...this.props}
        bankCard={this.state.bankCard}
        bankList={this.state.bankList}
      />
    </div>
  }
}

export default soulContext()(SecurityPage)
