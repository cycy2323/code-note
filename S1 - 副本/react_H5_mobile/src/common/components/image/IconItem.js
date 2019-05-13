/* eslint-disable react/prop-types */
import React from 'react'

const IconItem = (props) => {
  return (<div className={props.className} onClick={props.handleEvent}>
    {props.icon}
    <div className="content">
      <div className="title">{props.title}</div>
      <div className="describe">{props.describe}</div>
    </div>
  </div>)
}
export default IconItem




