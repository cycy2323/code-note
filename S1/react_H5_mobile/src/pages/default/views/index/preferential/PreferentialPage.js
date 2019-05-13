import React from 'react'
import {Icon} from 'antd-mobile'
import {soulContext} from 'soul'
import MainNav from 'common/components/header/MainHeader'
import Table from './Table/Table'

class PreferentialPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      Type: [],
    }
    this.$service = this.props.$service
    this.t = this.props.t
    this.history = this.props.history
  }

  componentDidMount() {
    //优惠 /mobile-api/discountsOrigin/getActivityType.html
    this.$service.discountsOrigin().getActivityType.post()
      .then(res => {
        this.setState({Type: res.data})
      })
  }


  render() {
    return (
      <div className="preferential">
        <div className="header">
          {MainNav({
            // leftEvent: () => {
            //   this.history.go(-1)
            // },
            // leftContent: <Icon type='left'/>,
            title: '优惠',
            rightContent: '',
            className: 'com-header-nav'
          })}
        </div>
        <div className="">
          <Table Type={this.state.Type} TypeList={this.state.TypeList}/>
        </div>
      </div>
    )
  }
}

export default soulContext()(PreferentialPage)
