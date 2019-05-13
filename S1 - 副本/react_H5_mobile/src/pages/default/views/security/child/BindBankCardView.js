/*
*
* 描述：绑定银行卡信息
* @author lee
* @create 2019-02-04 11:53 AM
*/
import React from 'react'
import {Button, Icon, InputItem, List, Picker, Toast} from 'antd-mobile'
import MainNav from 'common/components/header/MainHeader'
import {soulContext} from 'soul'
import {failCallBack} from "common/tools";

@soulContext()
class BindBankCardView extends React.Component {
  constructor(props) {
    super(props)
    // 从父级获取数据
    let state = {...props.location.state}
    this.state = {
      bankcardMasterName: state.bankCard ? state.bankCard.bankcardMasterName : '',
      bankName: state.bankCard ? [state.bankCard.bankNameCode] : [],
      bankcardNumber: state.bankCard ? state.bankCard.bankcardNumber : '',
      bankDeposit: state.bankCard ? state.bankCard.bankDeposit : '',
      bankList: props.location.state ? props.location.state.bankList.map(item => {
        return {label: item.text, value: item.value}
      }) : []
    }

    this.handleBindBankCard = this.handleBindBankCard.bind(this)
  }

  //提交绑定信息
  handleBindBankCard() {
    const {t} = this.props
    let {bankcardMasterName, bankName, bankcardNumber, bankDeposit} = this.state
    if (!bankcardMasterName) {
      Toast.fail(t('view.local.securityCenter.bank.toast.bankcardMasterName'), 1)
    } else if (!bankName) {
      Toast.fail(t('view.local.securityCenter.bank.toast.bankName'), 1)
    } else if (!bankcardNumber) {
      Toast.fail(t('view.local.securityCenter.bank.toast.bankcardNumber'), 1)
    } else if (!bankDeposit) {
      Toast.fail(t('view.local.securityCenter.bank.toast.bankDeposit'), 1)
    } else {
      this.props.$service.userInfoOrigin().submitBankCard.post({
        'result.bankcardMasterName': this.state.bankcardMasterName,
        'result.bankName': this.state.bankName[0],
        'result.bankcardNumber': this.state.bankcardNumber.split(' ').join('').toString(),
        'result.bankDeposit': this.state.bankDeposit
      })
        .then(res => {
          if (res.code === '0') {
            Toast.success(t('view.local.securityCenter.bank.toast.success'), 1, () => {
              this.props.history.goBack()
            })
          } else {
            failCallBack({history: this.props.history, message: res.message, code: res.code})
          }
        })
    }
  }

  componentDidMount() {
  }

  handleStateChange(obj) {
    this.setState({...obj})
  }

  render() {
    const {history, t} = this.props
    const propsState = this.props.location.state
    return <div className='bind-bankcard-page'>
      {MainNav({
        leftContent: <Icon type='left'/>,
        leftEvent: () => {
          history.goBack()
        },
        title: t('view.local.securityCenter.bank.title'),
        className: 'com-header-nav'
      })}
      <List>
        <InputItem
          value={this.state.bankcardMasterName}
          editable={!propsState}
          onChange={value => this.handleStateChange({bankcardMasterName: value})}
          className='com-full-input'
          clear
          placeholder={t('view.local.securityCenter.bank.placeholder.bankcardMasterName')}
        >{t('view.local.securityCenter.bank.form.bankcardMasterName')}</InputItem>
        <Picker
          disabled={propsState}
          value={this.state.bankName}
          key="transactionTypeList"
          cols={1}
          data={this.state.bankList}
          extra={t('view.local.securityCenter.bank.placeholder.bankName')}
          onChange={value => this.handleStateChange({bankName: value})}>
          <List.Item
            className='com-full-input'
            arrow="down">{t('view.local.securityCenter.bank.form.bankName')}</List.Item>
        </Picker>
        <InputItem
          editable={!propsState}
          value={this.state.bankcardNumber}
          onChange={value => this.handleStateChange({bankcardNumber: value})}
          className='com-full-input'
          clear
          type='bankCard'
          placeholder={t('view.local.securityCenter.bank.placeholder.bankcardNumber')}
        >{t('view.local.securityCenter.bank.form.bankcardNumber')}</InputItem>
        <InputItem
          editable={!propsState}
          value={this.state.bankDeposit}
          onChange={value => this.handleStateChange({bankDeposit: value})}
          className='com-full-input'
          clear
          placeholder={t('view.local.securityCenter.bank.placeholder.bankDeposit')}
        >{t('view.local.securityCenter.bank.form.bankDeposit')}</InputItem>
      </List>
      {
        propsState ?
          null :
          <Button
            className='default com-button'
            onClick={this.handleBindBankCard}>
            {t('view.local.securityCenter.bank.button')}
          </Button>
      }

    </div>
  }
}

export default BindBankCardView
