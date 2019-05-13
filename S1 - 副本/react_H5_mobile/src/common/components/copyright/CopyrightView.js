/* eslint-disable react/prop-types */
import React from 'react'

const CopyRightTemplate = (props) => {
  return (
    <div className='com-copyright'>
      <span className='copyright-content'>{props.copyrightText}</span>
    </div>
  )
}
export default CopyRightTemplate
