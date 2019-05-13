/* eslint no-dupe-keys: 0, no-mixed-operators: 0 */
import React from 'react'
import ComListView from "common/components/ListView";
import {List, PullToRefresh, Flex, Toast} from 'antd-mobile'

import {soulContext} from 'soul'

const data = [
  {
    img: 'https://zos.alipayobjects.com/rmsportal/dKbkpPXKfvZzWCM.png',
    title: 'Meet hotel',
    des: '不是所有的兼职汪都需要风吹日晒',
  },
  {
    img: 'https://zos.alipayobjects.com/rmsportal/XmwCzSeJiqpkuMB.png',
    title: 'McDonald\'s invites you',
    des: '不是所有的兼职汪都需要风吹日晒',
  },
  {
    img: 'https://zos.alipayobjects.com/rmsportal/hfVtzEhPzTUewPm.png',
    title: 'Eat the week',
    des: '不是所有的兼职汪都需要风吹日晒',
  },
];

//生成数
class Demo extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      pageSize: 10,
      pageNumber: 1,
      beginBetTime: undefined,
      endBetTime: undefined,
      dataSource: [],
      showDetail: false,
      refreshing: false,
      maxDate: null,
      minDate: null,
      list: undefined,
      statisticsData: {
        currency: sessionStorage.getItem('currency'),
        single: 0,
        profit: 0,
        effective: 0,
        totalSize: 0,
      },
      totalSize: 0
    }
    this.handleSearch = this.handleSearch.bind(this)
  }

  handleSearch(refreshing) {
    this.setState({
      refreshing: refreshing
    })
    this.props.$service.mineOrigin().getBettingList.post({
      isShowStatistics: true,
      'paging.pageSize': this.state.pageSize,
      'paging.pageNumber': this.state.pageNumber,
      'search.beginBetTime': '2019-01-01',
      'search.endBetTime': '2019-03-30'
    })
      .then(res => {
        if (res.code === '0') {
          this.setState({
            ...res.data,
            list: res.data.list,
            refreshing: false
          }, () => {
            console.log(this.state)
          })
        } else {
          this.setState({
            refreshing: false,
          })
          Toast.fail(res.message, 1, () => {
            if (res.code === '1001') {
              this.props.history.push('/login')
            }
          })
        }
      })
      .catch(err => {
        this.setState({
          refreshing: false,
        })
        Toast.fail(_.get(err, 'response.data.message') || '')
      })
  }

  componentDidMount() {
    let state = this.props.history.location.state
    if (state) {
      this.setState({
        ...state
      })
    } else {
      this.handleSearch()
    }
  }

  handleStateChange() {

  }

  render() {
    return (
      this.state.list ?
        <ComListView
          data={this.state.list}
          currentPage={1}
          maxSize={54}
          pageSize={10}
          rowDom={
            (item) => <Flex justify="between" className='result-content' key={item.id} onClick={() => {
              this.props.history.push({
                pathname: '/fund/betting/gameRecordDetail',
                search: '?searchId=' + item.id,
                // state: state
              })
            }
            }>
              <div className='result-item game-name'>{item.gameName}</div>
              <div className='result-item betting-time'>{moment(item.betTime).format('YYYY-MM-DD hh:mm:ss')}</div>
              <div className='result-item betting-value'>{item.singleAmount}</div>
              <div className='result-item betting-result'>{item.profitAmount}</div>
              <div
                className={'result-item betting-status ' + item.orderState}>{this.props.t('view.local.betting.statusList.' + item.orderState)}</div>
            </Flex>
          }
        /> : null
    )
  }
}

export default soulContext()(Demo)
