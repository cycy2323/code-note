import React from 'react'

function TabItem(props) {
  // console.log("props", props);
  return <div className='tabItem'>
    <p style={{margin: 0, textAlign: 'center'}}>{props.value}</p>
  </div>
}

export default TabItem
