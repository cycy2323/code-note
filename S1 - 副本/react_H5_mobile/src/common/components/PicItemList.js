/**
 * 图片+文字  小组件
 * this.props===(data)>>>>>>>[{url,text},{url,text}]
 */
import React from 'react'
import {soulContext} from 'soul'

class PicItemList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      index: 0,
    }
  }

  changeIndex = (i) => {
    this.setState({index: i})
  }
  renderItem = () => {
    let arr = []
    this.props.data.map((item, index) => {
      arr.push(
        <div key={index} className={index === this.state.index ? "active" : "pic-item"}
             onClick={() => this.changeIndex(index)}>
          <img src={'http://test01.ccenter.test.so'+item.imgUrl} alt=""/>
          <div className='itemText'>{item.payName}</div>
        </div>
      )
    })
    return arr
  }

  render() {
    const {history, t} = this.props
    return (
      <div className='pic-item-list'>
        {this.renderItem()}
      </div>
    )
  }
}

export default soulContext()(PicItemList)
