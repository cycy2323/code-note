/*
*
* 描述：绑定和修改手机号码
* @author lee
* @create 2019-02-04 11:53 AM
*/
import React from 'react'
import {Button, Icon, InputItem, List, Toast} from 'antd-mobile'
import MainNav from 'common/components/header/MainHeader'
import {soulContext} from 'soul'
import AppIcon from "common/components/image/AppIcon";
import {failCallBack} from "common/tools";
import PhoneCodeCountDown from "common/components/PhoneCodeCountDown";

@soulContext()
class BindMobileView extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      phoneNumber: undefined,
      contactValue: undefined,
      code: undefined,
      countDown: false,
      oldPhone: ''
    }
    this.showInput = false
    this.handleStateChange = this.handleStateChange.bind(this)
  }

  handleGetPhoneCode() {
    const {t} = this.props
    if (this.state.contactValue) {
      this.props.$service.origin().sendPhoneCode.post({
        phone: this.state.contactValue
      })
        .then(res => {
          if (res.code === '0') {
            this.setState({
              countDown: true
            })
          } else {
            failCallBack({code: res.code, message: res.message, history: this.props.history})
          }
        })
    } else {
      Toast.fail(t('view.local.securityCenter.phone.toast.phoneNotNull'))
    }

  }

  //判断用户是否绑定过手机号码
  handleGetUserPhone() {
    this.props.$service.mineOrigin().getUserPhone.post()
      .then(res => {
        if (res.code === '0') {
          res.data ? this.setState({phoneNumber: res.data, showInput: false}) : this.setState({showInput: true})
        } else {
          failCallBack({code: res.code, message: res.message, history: this.props.history})
        }
      })
  }

  //绑定手机号
  handleSubmitBindPhone() {
    const {t} = this.props
    if (this.state.phoneNumber && !this.state.oldPhone) {
      Toast.fail(t('view.local.securityCenter.phone.toast.oldPhoneNotNull'), 1)
    } else if (!this.state.contactValue) {
      Toast.fail(('this.state.phoneNumber' ?
        t('view.local.securityCenter.phone.toast.newPhoneNotNull') :
        t('view.local.securityCenter.phone.toast.phoneNotNull')), 1)
    } else if (!this.state.code) {
      Toast.fail(t('view.local.securityCenter.phone.toast.codeNotNull'), 1)
    } else {
      this.props.$service.mineOrigin().updateUserPhone.post({
        'search.contactValue': this.state.contactValue,
        oldPhone: this.state.oldPhone,
        code: this.state.code
      })
        .then(res => {
          if (res.code === '0') {
            Toast.success(
              (this.state.oldPhone ?
                t('view.local.securityCenter.phone.toast.bindSuccess') :
                t('view.local.securityCenter.phone.toast.modifySuccess')),
              1,
              () => this.props.history.goBack())
          } else {
            failCallBack({code: res.code, message: res.message, history: this.props.history})
          }
        })
    }
  }

  //修改state数据
  handleStateChange(obj) {
    this.setState({...obj})
  }

  componentDidMount() {
    this.handleGetUserPhone()
  }

  render() {
    const {history, t} = this.props
    return <div className='bind-phone-page'>
      {MainNav({
        leftContent: <Icon type='left'/>,
        leftEvent: () => {
          history.goBack()
        },
        title: t('view.local.securityCenter.phone.title'),
        className: 'com-header-nav'
      })}
      <div className='page-content'>
        {this.state.phoneNumber ?
          <List>
            <div className='bind-result'>
              <p>{t('view.local.securityCenter.phone.alreadyBind')}</p>
              <p>{this.state.phoneNumber}</p>
            </div>
          </List> : null}
        {this.state.showInput ?
          <List>
            {this.state.phoneNumber ? <InputItem
              value={this.state.oldPhone}
              onChange={val => this.handleStateChange({oldPhone: val})}
              type='number'
              className='com-full-input'
              clear
            >
              <AppIcon name='#icon-phone' className='cell-number'/>
              <span className='label'>{t('view.local.securityCenter.phone.form.oldPhone')}</span>
            </InputItem> : null}

            <InputItem
              value={this.state.contactValue}
              onChange={val => this.handleStateChange({contactValue: val})}
              type='number'
              className='com-full-input'
              clear
            >
              <AppIcon name='#icon-phone' className='cell-number'/>
              <span className='label'>{
                this.state.phoneNumber ?
                  t('view.local.securityCenter.phone.form.newPhone') :
                  t('view.local.securityCenter.phone.form.phoneNumber')}</span>
            </InputItem>
            <InputItem
              className='com-full-input'
              value={this.state.code}
              onChange={val => this.handleStateChange({code: val})}
              extra={
                <span
                  className='btn-code'
                  onClick={() => {
                    this.state.countDown || this.handleGetPhoneCode()
                  }
                  }>
              {this.state.countDown ? <PhoneCodeCountDown
                handleStateChange={this.handleStateChange}/> : t('view.local.securityCenter.phone.button.getCode')}
                  </span>}
              clear
            >
              <AppIcon name='#icon-security'/>
              <span className='label'>{t('view.local.securityCenter.phone.form.code')}</span>
            </InputItem>
          </List> : null
        }
      </div>
      <Button
        className='default com-button'
        onClick={() => {
          if (this.state.showInput) {
            this.handleSubmitBindPhone()
          } else {
            this.handleStateChange({showInput: true})
          }
        }
        }>
        {this.state.phoneNumber ?
          t('view.local.securityCenter.phone.button.modify') :
          t('view.local.securityCenter.phone.button.bind')}
      </Button>
      <div className='tips-text'>
        {t('view.local.securityCenter.phone.tips.title')} <br/>
        {t('view.local.securityCenter.phone.tips.tips1')} <br/>
        {t('view.local.securityCenter.phone.tips.tips2')} <br/>
        {t('view.local.securityCenter.phone.tips.tips3')}&nbsp;
        <a target='_blank' href='http://www.baidu.com'>
          {t('view.local.securityCenter.phone.tips.onLineService')}
        </a>
      </div>
    </div>
  }
}

export default BindMobileView
