/* eslint-disable react/prop-types */
/*
*
* 描述：优惠记录
* @author lee
* @create 2019-01-25 5:39 PM
*/
import React from 'react'
import {soulContext} from 'soul'
import {Icon, PullToRefresh, Toast} from 'antd-mobile'
import MainNav from 'common/components/header/MainHeader'
import PromoCard from 'common/components/PromoCard'
import NoData from 'common/components/NoData'

class PromoRecordPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      refreshResult: false,
      data: []
    }
  }

  // 获取数据
  handleGetData(refreshing) {
    this.setState({
      refreshing: refreshing
    })
    this.props.$service.mineOrigin().getMyPromo.get({})
      .then(res => {
        if (res.code === '0') {
          this.setState({
            data: res.data.list,
            refreshing: false
          })
        } else {
          if (res.code === '1001') this.props.history.push('/login')
        }
      })
      .catch(err => {
        Toast.fail(err.message)
        // this.props.history.push('/login')
      })
  }

  componentDidMount() {
    this.handleGetData()
  }

  render() {
    const {t} = this.props
    return <div className='promo-record-page'>
      {MainNav({
        leftContent: <Icon type='left'/>,
        leftEvent: () => {
          this.props.history.goBack()
        },
        title: '优惠记录',
        className: 'com-header-nav'
      })}
      <PullToRefresh
        className='promo-card-main'
        ref={el => this.ptr = el}
        direction='down'
        refreshing={this.state.refreshing}
        damping={40}
        indicator={{
          activate: t('view.local.active.pullDownToRefresh'),
          deactivate: this.state.refreshResult,
          finish: t('view.local.active.updateSuccess')
        }}
        onRefresh={() => {
          this.handleGetData(true)
        }}
      >
        <div className='card-list'>
          {this.state.data.length > 0 ? this.state.data.map(item => {
            return PromoCard({
              ...item,
              key: item.id,
              title: item.activityName,
              typeName: item.preferentialAuditName,
              validDate: moment(item.applyTime).format('YYYY年MM月DD日'),
              value: (sessionStorage.getItem('currency') || '') + (item.preferentialValue || 0).toFixed(2),
              status: item.checkState,
              statusName: item.checkStateName
            })
          }) : <NoData/>}
        </div>
      </PullToRefresh>
    </div>
  }
}

export default soulContext()(PromoRecordPage)
