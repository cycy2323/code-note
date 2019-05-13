import React from 'react'

function TabItem(props) {
  return <div className='tabItem'>
    <div className='itemImg'>
      <img src={'http://test01.ccenter.test.so' + props.cover} alt=""/>
    </div>
    <p style={{margin: 0, textAlign: 'center'}}>{props.apiTypeName || props.name}</p>
    {/*向上小箭头*/}
    <div className='up-icon' style={{display: 'none'}}/>
  </div>
}

export default TabItem
