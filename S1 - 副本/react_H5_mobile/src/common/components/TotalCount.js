/* eslint-disable react/prop-types */
/*
*
* 描述：总计组件
* @author lee
* @create 2019-02-03 7:14 PM
*/
import React from 'react'
import {Flex} from 'antd-mobile'

const TotalCount = (props) => {
  return (<Flex justify='left' className={props.className ? 'com-total-count ' + props.className : 'com-total-count'}>
    <div className='total-count-title'>{props.title}</div>
    <div className='total-count-content'>
      {props.list.map(item => {
        return (<div key={item.key} className='total-count-content-item'>
          <span>{item.label}</span>
          <span>{item.value}</span>
        </div>)
      })}
    </div>
  </Flex>)
}
export default TotalCount
