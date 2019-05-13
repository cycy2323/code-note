/*
*
* 描述：
* @author lee
* @create 2019-02-01 4:53 PM
*/
import React from 'react'
import {PullToRefresh, Toast} from 'antd-mobile'
import {soulContext} from 'soul'
import MessageCard from "common/components/MessageCard";
import NoData from "common/components/NoData";
import {NoticeOperateBtnView} from "./NoticeOperateBtnView";
const renderContent = (props) => {
  return (<PullToRefresh
    className='notice-page-content'
    damping={60}
    ref={el => props.ptr = el}
    direction={'down'}
    refreshing={props.refreshing}
    onRefresh={() => {
      props.handleGetData({refreshing: true})
    }}>
    {props.list.length > 0 ? props.list.map((item, index) => {
        return MessageCard({
          key: index,
          id: item.id,
          read: item.read,
          content: item.context,
          author: item.gameName,
          date: item.publishTime ? moment(item.publishTime).format('YYYY-MM-DD hh:mm:ss') : null,
          handleClickEvent: props.handleClickEvent
        })
      }) :
      <NoData/>}
    {props.lastPage ? <p className='no-more'>{props.t('view.local.notice.game.noMore')}</p> : null}
  </PullToRefresh>)
}

@soulContext()
export default class GameNoticeView extends React.Component {
  constructor(pros) {
    super(pros)
    this.state = {
      list: [],
      selectList: [],
      selectType: ['all'],
      maxDate: undefined,
      minDate: undefined,
      beginTime: undefined,
      endTime: undefined,
      pageNumber: 1,
      pageSize: 10
    }
    this.lastPage = false
    this.dictSelect = {}
    this.handleClickEvent = this.handleClickEvent.bind(this)
    this.handleGetData = this.handleGetData.bind(this)
  }

  //查看信息
  handleClickEvent(item) {
    this.props.handleShowDetail('game', item)
  }

  //获取数据
  handleGetData(obj) {
    this.setState({
      ...obj
    }, () => {
      let state = {
        ...this.state, ...obj
      }
      /*开始时间结束时间只接受字符串 YYYY-MM-DD 格式*/
      this.props.$service.mineOrigin().getGameNotice.get({
        'paging.pageNumber': state.pageNumber,
        'paging.pageSize': state.pageSize,
        'search.startTime': state.beginTime ? moment(state.beginTime).format('YYYY-MM-DD') : undefined,
        'search.endTime': state.endTime ? moment(state.endTime).format('YYYY-MM-DD') : undefined,
        'search.apiId': state.selectType[0] === 'all' ? undefined : state.selectType[0]
      })
        .then(res => {
          if (res.code === '0') {
            let selectList = []
            this.lastPage = _.get(res, 'data.pageTotal') < state.pageNumber * state.pageSize
            res.data.apiSelect ?
              selectList = res.data.apiSelect.map(item => {
                this.dictSelect[item.apiId] = item.apiName
                return {
                  label: item.apiName,
                  value: item.apiId
                }
              })
              : null
            this.dictSelect['all'] = this.props.t('view.local.notice.game.all')
            selectList.unshift({
              label: this.props.t('view.local.notice.game.all'),
              value: 'all'
            })
            this.setState({
              selectList: selectList,
              refreshing: false,
              list: _.get(res, 'data.list') || [],
              maxDate: _.get(res, 'data.maxDate') ? new Date(_.get(res, 'data.maxDate')) : null,
              minDate: _.get(res, 'data.minDate') ? new Date(_.get(res, 'data.minDate')) : null
            })
          } else {
            this.setState({
              refreshing: false
            }, () => {
              Toast.fail(res.message, 1, () => {
                if (res.code === '1001') {
                  this.props.history.push('/login')
                }
              })
            })
          }
        })
    })
  }

  //设置已读
  handleSetRead() {
    let list = []
    this.state.list.forEach(item => {
      if (item.selected) {
        list.push(item)
      }
    })
    if (list.length > 0) {
      Modal.alert('', this.props.t('view.local.inbox.markContent'), [
        {text: this.props.t('view.local.inbox.cancel'), onPress: () => console.log('cancel')},
        {
          text: this.props.t('view.local.inbox.sure'),
          onPress: () =>
            new Promise((resolve) => {
              Toast.info('onPress Promise', 1);
              setTimeout(resolve, 1000);
            })
        },
      ])
    }
  }

  componentDidMount() {
    this.props.onRef(this)
    this.handleGetData()
  }

  render() {
    const {t} = this.props
    const {state} = this

    return <div className='game-notice-content'>
      <NoticeOperateBtnView {...this} />

      {renderContent({
        t,
        list: state.list,
        lastPage: this.lastPage,
        refreshing: state.refreshing,
        handleClickEvent: this.handleClickEvent,
        handleGetData: this.handleGetData
      })}
    </div>
  }
}
