import React from 'react'
import {NavBar} from 'antd-mobile'

const Footer = (props) => {
  return <NavBar
    leftContent={props.leftConent}
    rightContent={props.rightConent}
    className={props.className}
    onLeftClick={props.leftEvent}
  >
    {props.title}
  </NavBar>
}
export default Footer
