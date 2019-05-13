/*
*
* 描述：红包
* @author lee
* @create 2019-02-20 15:54
*/
import React from 'react'
import {Icon} from 'antd-mobile'

const RedPack = (props) => {
  return props.hideRedPack ?
    null :
    <div className='red-pack'>
      <Icon type='cross-circle' onClick={() => {
        props.handleStateChange({hideRedPack: true})
      }}/>
      {<a
        href="http://www.alipay.com"
      >
        <img
          src={`http://test01.ccenter.test.so${props.normalEffect}`}
          alt=""
          onLoad={() => {
            // fire window resize event to change height
          }}
        />
      </a>}
    </div>
}
export default RedPack
