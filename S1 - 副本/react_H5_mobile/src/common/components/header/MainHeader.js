import React from 'react'
import {NavBar} from 'antd-mobile'

const MainHeader = (props) => {
  return <NavBar
    leftContent={props.leftContent}
    rightContent={props.rightContent}
    className={props.className ? 'com-header-nav ' + props.className : 'com-header-nav'}
    onLeftClick={props.leftEvent}
  >
    {props.title}
  </NavBar>
}
export default MainHeader
