//  轮播图


import React from 'react'
import {Carousel} from 'antd-mobile'

const CarouselTemplate = (props) => {
  return (
    <Carousel                        //  *** 未标注必填均为选填
      className={props.className}
      autoplay={props.auto}        //  是否自动播放  默认值false
      infinite={props.infinite}        //  是否循环播放  默认值false
      selectedIndex={props.initialIndex}   //   初始的索引  默认值0   number
      dots={props.dots}  //   是否显示面板指示点   默认true
      autoplayInterval={props.autoTime} //   自动切换的时间间隔  默认3000ms   number
      beforeChange={props.beforeChange}                    //  切换面板前的回调函数
      afterChange={props.afterChange}                      //  切换面板后的回调函数
    >
      {props.data.map(val => (             // data 必填 轮播图的数据
        <a
          className='carousel-item'
          key={val}
        >
          <img style={{width: '100%', height: '100%'}} src={'http://test01.ccenter.test.so' + val.cover} alt=""/>
        </a>
      ))}
    </Carousel>
  )
}

export default CarouselTemplate
