/* eslint-disable react/prop-types */
/*
*
* 描述：
* @author lee
* @create 2019-01-25 5:42 PM
*/
import React from 'react'
import {soulContext} from 'soul'
import {Button, DatePicker, Flex, Icon, List, PullToRefresh, Toast} from 'antd-mobile'
import MainNav from 'common/components/header/MainHeader'
import AppIcon from 'common/components/image/AppIcon'
import TotalCount from 'common/components/TotalCount'
import NoData from 'common/components/NoData'
import ComListView from "common/components/ListView";
//搜索头
let renderSearch = (props) => {
  const {t} = props
  return (
    <Flex justify="between" className='com-search-line'>
      <span className='label'>{t('view.local.betting.label')}</span>
      <DatePicker
        value={props.beginBetTime ? new Date(props.beginBetTime) : null}
        mode="date"
        minDate={props.minDate ? new Date(props.minDate) : null}
        maxDate={props.endBetTime ? new Date(props.endBetTime) : new Date(props.maxDate)}
        onChange={date =>
          props.handleFormValueChange({
            beginBetTime: date
          })}
      >
        <List.Item
          className={'select-wrapper date-selector'}
          extra={props.beginBetTime ? moment(props.beginBetTime).format('YYYY-MM-DD') : ''}
        >
          {AppIcon({name: '#icon-calendar'})}
        </List.Item>
      </DatePicker>
      <span className='separator'>~</span>
      <DatePicker
        value={props.endBetTime ? new Date(props.endBetTime) : null}
        mode="date"
        minDate={props.beginBetTime ? new Date(props.beginBetTime) : new Date(props.minDate)}
        maxDate={props.maxDate ? new Date(props.maxDate) : null}
        onChange={date => props.handleFormValueChange({
          endBetTime: date
        })}
      >
        <List.Item
          className={'select-wrapper date-selector'}
          extra={props.endBetTime ? moment(props.endBetTime).format('YYYY-MM-DD') : ''}
        >
          {AppIcon({name: '#icon-calendar'})}
        </List.Item>
      </DatePicker>
      <Button className='default' onClick={() => {
        props.handleSearch()
      }
      }>{t('view.local.betting.search')}</Button>
    </Flex>
  )
}
//搜索结果
let renderResult = (props) => {
  const {t, history, state} = props
  return (
    <div>
      <Flex justify="between" className='result-header'>
        <div className='result-header-title game-name'>{t('view.local.betting.gameName')}</div>
        <div className='result-header-title betting-time'>{t('view.local.betting.date')}</div>
        <div className='result-header-title betting-value'>{t('view.local.betting.value')}</div>
        <div className='result-header-title betting-result'>{t('view.local.betting.result')}</div>
        <div className='result-header-title betting-status'>{t('view.local.betting.status')}</div>
      </Flex>
      {props.list.length > 0 ?
        <ComListView
          className='result-content-list'
          data={props.list}
          currentPage={props.pageNumber}
          maxPageSize={props.totalSize}
          pageSize={props.pageSize}
          handleGetMoreData={(params) => props.handleSearch(params)}
          rowDom={
            (item) => <Flex justify="between" className='result-content' key={item.id} onClick={() => {
              history.push({
                pathname: '/fund/betting/gameRecordDetail',
                search: '?searchId=' + item.id,
                state: state
              })
            }
            }>
              <div className='result-item game-name'>{item.gameName}</div>
              <div className='result-item betting-time'>{moment(item.betTime).format('YYYY-MM-DD hh:mm:ss')}</div>
              <div className='result-item betting-value'>{item.singleAmount}</div>
              <div className='result-item betting-result'>{item.profitAmount}</div>
              <div
                className={'result-item betting-status ' + item.orderState}>{t('view.local.betting.statusList.' + item.orderState)}</div>
            </Flex>
          }
        /> : <NoData/>}
    </div>
  )
}

class BettingPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      pageSize: 20,
      pageNumber: 1,
      beginBetTime: undefined,
      endBetTime: undefined,
      dataSource: [],
      showDetail: false,
      refreshing: false,
      maxDate: null,
      minDate: null,
      list: [],
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
    this.handleFormValueChange = this.handleFormValueChange.bind(this)
  }

  handleFormValueChange(obj) {
    this.setState({
      ...obj
    })
  }

  handleSearch(obj) {
    console.log(obj)
    this.setState({
      ...obj
    })
    this.props.$service.mineOrigin().getBettingList.post({
      isShowStatistics: true,
      'paging.pageSize': this.state.pageSize,
      'paging.pageNumber': obj ? obj.pageNumber || this.state.pageNumber : this.state.pageNumber,
      'search.beginBetTime': this.state.beginBetTime ? moment(this.state.beginBetTime).format('YYYY-MM-DD') : null,
      'search.endBetTime': this.state.endBetTime ? moment(this.state.endBetTime).format('YYYY-MM-DD') : null
    })
      .then(res => {
        if (res.code === '0') {
          this.setState({
            ...res.data,
            refreshing: false
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

  render() {
    const {t, history} = this.props
    const {state} = this
    const currency = state.statisticsData.currency
    return <div>
      <div className='betting-page'>
        {MainNav({
          leftContent: <Icon type='left'/>,
          leftEvent: () => {
            this.props.history.push('/')
          },
          title: t('view.local.betting.title'),
          className: 'com-header-nav'
        })}
        <div className='main-content'>
          {renderSearch({
            t,
            ...state,
            handleFormValueChange: this.handleFormValueChange,
            handleSearch: this.handleSearch
          })}
          {renderResult({
            ...state,
            t,
            history,
            // state: state,
            handleSearch: this.handleSearch
          })}
          {TotalCount({
            title: t('view.local.betting.total.title'),
            list: [
              {
                key: 'betting',
                label: t('view.local.betting.total.single'),
                value: currency + state.statisticsData.single.toFixed(2)
              },
              {
                key: 'bettingValue',
                label: t('view.local.betting.total.effective'),
                value: currency + state.statisticsData.effective.toFixed(2)
              },
              {
                key: 'result',
                label: t('view.local.betting.total.profit'),
                value: currency + state.statisticsData.profit.toFixed(2)
              },
              {
                key: 'count',
                label: t('view.local.betting.total.totalSize'),
                value: state.totalSize
              },
            ]
          })}
        </div>
      </div>
    </div>
  }
}

export default soulContext()(BettingPage)
