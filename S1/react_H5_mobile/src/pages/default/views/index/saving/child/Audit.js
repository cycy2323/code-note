/* eslint-disable react/prop-types */
// 稽核页面

import React from 'react'
import {soulContext} from '@soul/react/src'
import {Icon, NavBar} from 'antd-mobile'

/** @namespace React.Component */
class PayPage extends React.Component {
  constructor(props) {
    super(props)
    this.$service = this.props.$service
    this.state = {
      data: {
        'currencySign': '￥',
        'withdrawAudit': [
          {
            'createTime': 1528110629149,
            'rechargeAmount': 1,
            'rechargeAudit': 4.7,
            'rechargeRemindAudit': 5,
            'rechargeFee': 0,
            'favorableAmount': null,
            'favorableAudit': null,
            'favorableRemindAudit': null,
            'favorableFee': null
          },
          {
            'createTime': 1528113585860,
            'rechargeAmount': null,
            'rechargeAudit': null,
            'rechargeRemindAudit': null,
            'rechargeFee': null,
            'favorableAmount': 2.3,
            'favorableAudit': 50.6,
            'favorableRemindAudit': 0,
            'favorableFee': -2.3
          }
        ]
      }
    }
  }

  componentDidMount() {

    // 加载完成后请求稽核数据
    this.$service.withdrawOrigin().getAuditLog.post()
      .then(res => {
        if (res.success) {
          res = {
            'success': true,
            'code': '0',
            'title': null,
            'message': '请求成功',
            'data': {
              'currencySign': '￥',
              'withdrawAudit': [
                {
                  'createTime': 1528110629149,
                  'rechargeAmount': 1,
                  'rechargeAudit': 4.7,
                  'rechargeRemindAudit': 5,
                  'rechargeFee': 0,
                  'favorableAmount': null,
                  'favorableAudit': null,
                  'favorableRemindAudit': null,
                  'favorableFee': null
                },
                {
                  'createTime': 1528113585860,
                  'rechargeAmount': null,
                  'rechargeAudit': null,
                  'rechargeRemindAudit': null,
                  'rechargeFee': null,
                  'favorableAmount': 2.3,
                  'favorableAudit': 50.6,
                  'favorableRemindAudit': 0,
                  'favorableFee': -2.3
                }
              ]
            },
            'version': 'app_01'
          }
        }
      })
  }

  render() {
    const {history, t} = this.props
    return (
      <div className='audit-container'>
        {/*header*/}
        <NavBar
          mode="dark"
          icon={<Icon type="left" size='lg'/>}
          onLeftClick={() => {
            history.go(-1)
          }}
          className='audit-page-header'
        >
          查看稽核详情
        </NavBar>

        {/*表头*/}
        <div className='audit-t-header'>
          <div className='saving-time'>存款时间</div>
          <div className='saving-money'>存款金额</div>
          <div className='saving-audit'>存款稽核点</div>
          <div className='recharge-fee'>行政费用</div>
          <div className='favorable-amount'>优惠金额</div>
          <div className='favorable-point'>优惠稽核点</div>
          <div className='favorable-fee'>优惠扣除</div>
        </div>

        {/*t-body*/}
        <div className='audit-t-body'>
          {
            this.state.data.withdrawAudit.map((item, i) => {
              return (
                <div key={i} className='audit-item'>
                  <div className="audit-time">{moment(item.createTime).format('YYYY-MM-DD HH:mm:ss')}</div>
                  <div
                    className='audit-money'>{item.rechargeAmount ? this.state.data.currencySign + item.rechargeAmount : '--'}</div>
                  <div
                    className='andit-audit'>{(item.favorableRemindAudit ? item.favorableRemindAudit : '--') + '/' + (item.rechargeAudit ? item.rechargeAudit : '--')}</div>
                  <div
                    className='recharge-fee'>{item.rechargeFee ? this.state.data.currencySign + item.rechargeFee : '--'}</div>
                  <div
                    className='favorable-amount'>{item.favorableAmount ? this.state.data.currencySign + item.favorableAmount : '--'}</div>
                  <div
                    className='favorable-point'>{(item.favorableRemindAudit ? item.favorableRemindAudit : '--') + '/' + (item.favorableAudit ? item.favorableAudit : '--')}</div>
                  <div
                    className='favorable-fee'>{item.favorableFee ? this.state.data.currencySign + item.favorableFee : '--'}</div>
                </div>
              )
            })
          }
        </div>
      </div>
    )
  }
}

export default soulContext()(PayPage)
