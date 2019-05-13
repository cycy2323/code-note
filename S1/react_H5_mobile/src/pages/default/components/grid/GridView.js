import React from 'react'
import {soulContext} from 'soul'
import {Grid, Badge} from 'antd-mobile'

/* eslint-disable react/prop-types */

class GridTemplate extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      actIndex: 0
    }
  }

  render() {
    const {history, t} = this.props
    return (
      <Grid
        data={this.props.data}
        columnNum={5}
        hasLine={false}
        square={false}
        activeStyle={false}
        onClick=
          {(el, i) => {
            this.props.changeSavingGridIndex(i)
            this.setState({
              actIndex: i
            })
          }}
        renderItem={(dataItem, idx) => (
          <Badge
            text={dataItem.discount === true ? '存送优惠' : ''}
            corner={true}
            className={idx === this.state.actIndex ? 'saving-grid-item saving-grid-item-active' : 'saving-grid-item'}
          >
            <img className='saving-grid-item-img' src={'http://test01.ccenter.test.so' + dataItem.iconUrl} alt=""/>
            <div className='saving-grid-item-text'>
              {dataItem.name}
            </div>
          </Badge>
        )}
      />
    )
  }


}


export default soulContext()(GridTemplate)
