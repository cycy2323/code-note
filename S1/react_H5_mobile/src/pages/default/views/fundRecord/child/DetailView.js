/*
*
* 描述：
* @author lee
* @create 2019-02-05 9:29 AM
*/
import React, {Component} from 'react'
import {Card, Icon, List, Toast} from 'antd-mobile'
import MainNav from 'common/components/header/MainHeader'
import {soulContext} from 'soul'
import {getLocationParams} from "common/tools";

@soulContext()
class DetailView extends Component {
  constructor(props) {
    super(props)
    this.state = {
      transactionWayName: null,
      transactionNo: null,
      rechargeTotalAmount: null,
      rechargeAmount: null,
      bankCodeName: null,
      poundage: null
    }
  }

  handleGetData() {
    this.props.$service.mineOrigin().getFundRecordDetails.post({
      ...getLocationParams()
    })
      .then(res => {
        if (res.code === '0') {
          this.setState({
            ...res.data
          })
        } else {
          Toast.fail(this.props.t('view.local.errorMessage.' + res.code), 1, () => {
            if (res.code === '1001') this.props.history.push('/login')
          })
        }
      })
  }

  componentDidMount() {
    this.handleGetData()
  }

  render() {
    const {t, history} = this.props
    const state = this.state
    return <div className='com-detail-view detail-view'>
      {MainNav({
        leftContent: <Icon type='left'/>,
        leftEvent: () => {
          history.push({
            pathname: '/fund/record'
          })
        },
        title: t('view.local.fundRecord.detail.title'),//资金记录详情
        className: 'com-header-nav'
      })}
      <List>
        <List.Item
          className='com-list'
          extra={state.transactionNo}
        >{t('view.local.fundRecord.detail.transactionNo')}</List.Item>
        <List.Item
          className='com-list'
          extra={state.createTime ? moment(state.createTime).format('YYYY-MM-DD HH:mm:ss') : ''}
        >{t('view.local.fundRecord.detail.createTime')}</List.Item>
        <List.Item
          className='com-list'
          extra={state.transactionWayName}
        >{t('view.local.fundRecord.detail.transactionWayName')}</List.Item>
      </List>
      <Card>
        <div className='description-header'>
          {state.bankUrl ? <img src={'http://test01.ccenter.test.so' + state.bankUrl} alt=''/> : state.bankCodeName}
        </div>
        <div className='description-content'>
          <div className='list-item'>
            <span className='item-title'>{t('view.local.fundRecord.detail.realName')}</span>
            <span>{state.realName || '--'}</span>
          </div>
          <div className='list-item'>
            <span className='item-title'>{t('view.local.fundRecord.detail.rechargeAmount')}</span>
            <span>{state.rechargeAmount || '--'}</span>
          </div>
          <div className='list-item'>
            <span className='item-title'>{t('view.local.fundRecord.detail.poundage')}</span>
            <span>{state.poundage || '--'}</span>
          </div>
          <div className='list-item'>
            <span className='item-title'>{t('view.local.fundRecord.detail.rechargeTotalAmount')}</span>
            <span>{state.rechargeTotalAmount || '--'}</span>
          </div>
          <div className='list-item'>
            <span className='item-title'>{t('view.local.fundRecord.detail.statusName')}</span>
            <span>{state.statusName}</span>
          </div>
        </div>
      </Card>
    </div>
  }
}

export default soulContext()(DetailView)
