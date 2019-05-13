import React from 'react'

// 温馨提示组件
// 未知数据结构，暂时搁置


const PageEndDescTemplate = (props) => {
  return (
    <div className='com-page-end-description'>
      {props.text}
      {props.data.text.map((item, i) => (
        <div key={i}>{item}</div>
      ))}

    </div>

  )
}
export default PageEndDescTemplate
