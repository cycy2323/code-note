/* eslint-disable react/prop-types */
import React from 'react'

const AppIcon = (props) => {
  return (<svg
    key={props.key}
    className={props.className ? props.className + ' 1 icon' : 'icon'}
    aria-hidden="true"
    onClick={props.handleEvent}>
    <use xlinkHref={props.name}/>
  </svg>)
}
export default AppIcon
