/* eslint-disable react/prop-types */
/*
*
* 描述：优惠券
* coupon
* @author lee
* @create 2019-01-29 3:36 PM
*/
import React from 'react'

const PromoCard = (props) => {
  // 优惠状态
  let status = {
    '0': 'failed',
    '1': 'review',
    '2': 'issued'
  }
  return (<div className='promo-card' key={props.key}>
    <div className='main-content'>
      <div className='title'>{props.title}</div>
      <div className='description'>
        <div className='type'>{props.typeName}</div>
        <div className='date'>{props.validDate}</div>
      </div>
    </div>
    <div className={'copy-content ' + status[props.status]}>
      <div className={'copy-content-inner'}>
        <span className='value'>{props.value}</span>
        <span>{props.statusName}</span>
      </div>
    </div>
  </div>)
}
export default PromoCard
