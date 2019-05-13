/* eslint-disable react/prop-types */
/*
*
* 描述：
* @author lee
* @create 2019-01-25 5:51 PM
*/
import React, {Component} from 'react'
import {Button, DatePicker, Flex, Icon, List, Picker, PullToRefresh, Toast} from 'antd-mobile'
import MainNav from 'common/components/header/MainHeader'
import AppIcon from 'common/components/image/AppIcon'
import TotalCount from 'common/components/TotalCount'
import {soulContext} from 'soul'
import NoData from 'common/components/NoData'
import moment from 'moment'
import {failCallBack} from "common/tools";
//搜索头
let renderSearchBar = (props) => {
  return <div className='header'>
    <Flex justify="between" className='com-search-line'>
      <span className='label'>{props.t('view.local.fundRecord.label')}</span>
      <DatePicker
        value={props.beginCreateTime ? new Date(props.beginCreateTime) : null}
        mode="date"
        minDate={props.minDate ? new Date(props.minDate) : null}
        maxDate={props.endCreateTime ? new Date(props.endCreateTime) : new Date(props.maxDate)}
        onChange={date => {
          props.handleFormValueChange({
            beginCreateTime: date
          })
        }
        }
      >
        <List.Item
          className={'select-wrapper date-selector'}
          extra={props.beginCreateTime ? moment(props.beginCreateTime).format('YYYY-MM-DD') : ''}
        >
          {AppIcon({name: '#icon-calendar'})}
        </List.Item>
      </DatePicker>
      <span>~</span>
      <DatePicker
        value={props.endCreateTime ? new Date(props.endCreateTime) : null}
        mode="date"
        minDate={props.beginCreateTime ? new Date(props.beginCreateTime) : new Date(props.minDate)}
        maxDate={props.maxDate ? new Date(props.maxDate) : null}
        onChange={date =>
          props.handleFormValueChange({
            endCreateTime: date
          })}
      >
        <List.Item
          className={'select-wrapper date-selector'}
          extra={props.endCreateTime ? moment(props.endCreateTime).format('YYYY-MM-DD') : ''}
        >
          {AppIcon({name: '#icon-calendar'})}
        </List.Item>
      </DatePicker>
      <List className='btn-quick-select'>
        <Picker
          key="transactionTypeList"
          cols={1}
          data={props.quickSelectList}
          onChange={value => props.handleQuickSelect(value)}>
          <Button className='default '>{props.t('view.local.fundRecord.quickSelect')}</Button>
        </Picker>
      </List>
    </Flex>
    <Flex justify="between" className='com-search-line search-header'>
      <List className='type-selector'>
        <Picker
          value={props.transactionType}
          key="transactionTypeList"
          cols={1}
          data={props.transactionTypeList}
          onChange={value => props.handleFormValueChange({transactionType: value})}>
          <List.Item arrow="down"/>
        </Picker>
      </List>
      <Button className='default btn-search' onClick={() => {
        props.handleSearch()
      }
      }>{props.t('view.local.fundRecord.search')}</Button>
    </Flex>
  </div>
}
/**
 * 处理中的结果.
 * @param {Object} props
 */
let RenderProcessing = (props) => {
  return <div className='dealing-content'>
    <div>
      {props.t('view.local.fundRecord.withdrawSum')}
      {props.withdrawSum === Number.parseFloat(props.withdrawSum) ? props.withdrawSum.toFixed(2) : ''}
    </div>
    <div>
      {props.t('view.local.fundRecord.transferSum')}
      {props.transferSum === Number.parseFloat(props.transferSum) ? props.transferSum.toFixed(2) : ''}
    </div>
  </div>
}
/**
 * 查询结果.
 * @param {Object} props
 * @param {Function} props.handleSearch 搜索
 * @param {Array} props.fundListApps 数据结构数组
 */
let RenderResult = (props) => {
  const {t, fundListApps, refreshing, history} = props
  return (
    <div className='search'>
      <Flex justify="between" className='com-result-header result-header'>
        <div className='title'>{t('view.local.fundRecord.date')}</div>
        <div className='title'>{t('view.local.fundRecord.value')}</div>
        <div className='title'>{t('view.local.fundRecord.status')}</div>
        <div className='title'>{t('view.local.fundRecord.transactionType')}</div>
      </Flex>
      {
        <PullToRefresh
          damping={100}
          ref={el => props.ptr = el}
          className='result-content-list'
          direction={'down'}
          refreshing={refreshing}
          onRefresh={() => {
            props.handleSearch()
          }}
        >
          {fundListApps.length > 0 ? fundListApps.map((item, index) => {
            return (
              <Flex
                justify="between"
                className='result com-result-line result-content'
                key={index}
                onClick={() => {
                  history.push({
                    pathname: '/fund/record/details',
                    search: 'searchId=' + item.id
                  })
                  sessionStorage.setItem('fundRecord', JSON.stringify(props.state))
                }}>
                <div
                  className='content'>{item.createTime ? moment(item.createTime).format('YYYY-MM-DD HH:mm:ss') : ''}</div>
                <div className='content value'>{item.transactionMoney}</div>
                <div className='content status'>{item.statusName}</div>
                <div className='content'>{item.transaction_typeName}</div>
              </Flex>)
          }) : <NoData/>}
        </PullToRefresh>
      }
    </div>
  )
}

class FundRecordPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      beginCreateTime: undefined,
      endCreateTime: undefined,
      transactionType: [''],
      withdrawSum: 0,
      transferSum: 0,
      fundListApps: [],
      pageNumber: 1,
      pageSize: 100,
      sumPlayerMap: {
        favorable: 0,
        rakeback: 0,
        recharge: 0,
        withdraw: 0
      },
      maxDate: null,
      minDate: null,
      refreshing: false
    }
    // 定义快选和类型下拉数据
    this.searchItem = {
      transactionTypeList: [
        {
          label: props.t('view.local.fundRecord.transactionTypeList.'),
          value: ''
        },
        {
          label: props.t('view.local.fundRecord.transactionTypeList.deposit'),
          value: 'deposit'
        },
        {
          label: props.t('view.local.fundRecord.transactionTypeList.withdrawals'),
          value: 'withdrawals'
        },
        {
          label: props.t('view.local.fundRecord.transactionTypeList.transfers'),
          value: 'transfers'
        },
        {
          label: props.t('view.local.fundRecord.transactionTypeList.favorable'),
          value: 'favorable'
        },
        {
          label: props.t('view.local.fundRecord.transactionTypeList.rakeback'),
          value: 'rakeback'
        }
      ],
      quickSelectList: [
        {
          label: props.t('view.local.fundRecord.quickSelectList.today'),
          value: 'today'
        },
        {
          label: props.t('view.local.fundRecord.quickSelectList.yesterday'),
          value: 'yesterday'
        },
        {
          label: props.t('view.local.fundRecord.quickSelectList.week'),
          value: 'week'
        },
        {
          label: props.t('view.local.fundRecord.quickSelectList.seven'),
          value: 'seven'
        }
      ]
    }
    this.handleQuickSelect = this.handleQuickSelect.bind(this)
    this.handleFormValueChange = this.handleFormValueChange.bind(this)
    this.handleSelectType = this.handleSelectType.bind(this)
    this.handleSearch = this.handleSearch.bind(this)
  }

  // 选择类型
  handleSelectType(val) {
    this.setState({
      transactionType: val.key
    })
  }

  //改变查询条件
  handleFormValueChange(obj) {
    this.setState({
      ...obj
    })
  }

  //快选 今天 昨天 本周 近七天
  handleQuickSelect(val) {
    let timeArray = []
    let time = new Date()
    let todayBeginTime = new Date(time.getFullYear(), time.getMonth(), time.getDate()).getTime()
    let dayTime = 86400000
    let index = time.getDay()
    let key = val[0]
    switch (key) {
      case 'today':
        timeArray = [todayBeginTime, todayBeginTime + dayTime - 1]
        break
      case 'yesterday':
        timeArray = [todayBeginTime - dayTime, todayBeginTime - 1]
        break
      case 'week':
        timeArray = [todayBeginTime - dayTime * (index === 0 ? 6 : index - 1), todayBeginTime + dayTime - 1]
        break
      case 'seven':
        timeArray = [todayBeginTime - dayTime * 6, todayBeginTime + dayTime - 1]
        break
    }
    this.setState({
      beginCreateTime: new Date(timeArray[0]),
      endCreateTime: new Date(timeArray[1])
    })
  }

  //搜索
  handleSearch() {
    const {beginCreateTime, endCreateTime, pageNumber, pageSize, transactionType} = this.state
    const {t, history} = this.props
    this.props.$service.mineOrigin().getFundRecord.post({
      'search.beginCreateTime': beginCreateTime ? moment(beginCreateTime).format('YYYY-MM-DD') : undefined,
      'search.endCreateTime': endCreateTime ? moment(endCreateTime).format('YYYY-MM-DD') : undefined,
      'search.transactionType': transactionType[0],
      'paging.pageNumber': pageNumber,
      'paging.pageSize': pageSize
    })
      .then(res => {
        if (res.code === '0') {
          this.setState({
            ...res.data
          })
        } else {
          failCallBack({response: res, t, history})
        }
      })
  }

  componentDidMount() {
    let state = sessionStorage.getItem('fundRecord')
    if (state) {
      this.setState({
        ...JSON.parse(state)
      }, () => {
        sessionStorage.removeItem('fundRecord')
      })
    } else {
      this.handleSearch()
    }
  }

  render() {
    const {t, history} = this.props
    const {state} = this
    return <div className='fund-record-page'>
      {MainNav({
        leftContent: <Icon type='left'/>,
        leftEvent: () => {
          history.push('/index')
        },
        title: t('view.local.fundRecord.title'),
        className: 'com-header-nav'
      })}
      {renderSearchBar({
        t,
        ...this.searchItem,
        maxDate: state.maxDate,
        minDate: state.minDate,
        beginCreateTime: state.beginCreateTime,
        endCreateTime: state.endCreateTime,
        transactionType: state.transactionType,
        handleFormValueChange: this.handleFormValueChange,
        handleQuickSelect: this.handleQuickSelect,
        handleSelectType: this.handleSelectType,
        handleSearch: this.handleSearch,
      })}
      {RenderProcessing({
        t,
        'withdrawSum': state.withdrawSum,
        'transferSum': state.transferSum
      })}
      {RenderResult({
        t,
        history,
        state: this.state,
        fundListApps: state.fundListApps,
        handleSearch: this.handleSearch,
        'refreshing': state.refreshing
      })}
      {TotalCount({
        title: t('view.local.fundRecord.total'),
        list: [
          {
            key: 'recharge',
            label: t('view.local.fundRecord.recharge'),
            value: this.state.sumPlayerMap.recharge.toFixed(2)
          },
          {
            key: 'favorable',
            label: t('view.local.fundRecord.favorable'),
            value: this.state.sumPlayerMap.favorable.toFixed(2)
          },
          {
            key: 'withdraw',
            label: t('view.local.fundRecord.withdraw'),
            value: this.state.sumPlayerMap.withdraw.toFixed(2)
          },
          {
            key: 'rakeback',
            label: t('view.local.fundRecord.rakeback'),
            value: this.state.sumPlayerMap.rakeback.toFixed(2)
          },
        ]
      })}
    </div>
  }
}

export default soulContext()(FundRecordPage)
