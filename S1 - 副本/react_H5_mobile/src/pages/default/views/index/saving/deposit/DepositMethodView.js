/*
*
* 描述：
* @author lee
* @create 2019-03-06 2:49 PM
*/
import React from 'react'
import {Grid, Badge} from 'antd-mobile'
/* eslint-disable react/prop-types */
const DepositMethodView = (props) => {
  return (
    <div className={props.className}>
      <Grid
        data={props.data}
        columnNum={props.columnNumber}
        hasLine={false}
        square={false}
        activeStyle={false}
        onClick={(el, index) => props.changeSelectedIndex(index)}
        renderItem={(dataItem, index) => (
          <Badge
            text={dataItem.discount ? props.discount : ''}
            corner={Boolean(dataItem.discount)}
            className={index === props.selectedIndex ? 'saving-grid-item saving-grid-item-active' : 'saving-grid-item'}
          >
            <a href={dataItem.switchValue ? dataItem.code : 'javascript:void(0)'}>
              <img className='saving-grid-item-img' src={'http://test01.ccenter.test.so' + dataItem.iconUrl} alt=""/>
              <div className='saving-grid-item-text'>
                {dataItem.name}
              </div>
            </a>
          </Badge>)
        }
      />
    </div>)
}
export default DepositMethodView
