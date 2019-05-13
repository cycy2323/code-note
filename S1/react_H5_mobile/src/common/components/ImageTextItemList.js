/*
*
* 描述：图片+文字描述列表
* @author lee
* @create 2019-03-06 4:39 PM
*
*/
import React from 'react'

const ImageTextItemList = (props) => {
  let textNameArray = props.textItemName.split(',')
  return (
    <div className='pic-item-list'>
      {props.data.map((item, index) => {
        return (
          <div
            key={index}
            className={index === props.index ? 'active' : 'pic-item'}
            onClick={() => props.handleClick(index)}
          >
            <img src={props.imageOrigin + item[props.imageItemName]} alt=""/>
            <div className='itemText'>
              {
                textNameArray.length > 1
                  ? item[textNameArray[0]] || item[textNameArray[1]]
                  : item[textNameArray[0]]
              }
            </div>
          </div>
        )
      })}
    </div>
  )
}
export default ImageTextItemList
