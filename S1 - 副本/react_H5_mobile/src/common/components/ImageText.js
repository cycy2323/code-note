import React from 'react'
import LazyLoad from 'react-lazyload'

const ImageText = (props) => {
  return (<div className={props.className}>
    <LazyLoad height={props.height}>
      <div className='img-content'>
        <img src={props.src}/>
      </div>
    </LazyLoad>
  </div>
  )
}
export default ImageText
