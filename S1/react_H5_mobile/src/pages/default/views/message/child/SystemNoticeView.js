/*
*
* 描述：
* @author lee
* @create 2019-02-01 4:54 PM
*/
import React from 'react'
import {PullToRefresh, Toast} from 'antd-mobile'
import {soulContext} from 'soul'
import MessageCard from "common/components/MessageCard";
import {NoticeOperateBtnView} from "./NoticeOperateBtnView";
import NoData from "common/components/NoData";

@soulContext()
export default class SystemNoticeView extends React.Component {
  constructor(pros) {
    super(pros)
    this.state = {
      list: [],
      maxDate: undefined,
      minDate: undefined,
      beginTime: undefined,
      endTime: undefined,
      pageNumber: 1,
      pageSize: 10
    }
    this.searchParams = {}
    this.lastPage = false
    this.handleClickEvent = this.handleClickEvent.bind(this)
    this.handleGetData = this.handleGetData.bind(this)
  }

  //查看信息
  handleClickEvent(item) {
    //TODO 如果是新消息，还需要将新消息置成已读消息
    this.props.handleShowDetail('system', item)
  }

  //获取数据
  handleGetData(obj) {
    this.setState({
        ...obj
      },
      () => {
        let state = {
          ...this.state, ...obj
        }
        this.props.$service.mineOrigin().getSysNotice.get({
          'paging.pageNumber': state.pageNumber,
          'paging.pageSize': state.pageSize,
          'search.startTime': state.beginTime ? moment(state.beginTime).format('YYYY-MM-DD') : undefined,
          'search.endTime': state.endTime ? moment(state.endTime).format('YYYY-MM-DD') : undefined,
        })
          .then(res => {
            if (res.code === '0') {
              let selectList = []
              this.lastPage = _.get(res, 'data.pageTotal') === state.pageNumber
              res.data.apiSelect ?
                selectList = res.data.apiSelect.map(item => {
                  this.dictSelect[item.apiId] = item.apiName
                  return {
                    label: item.apiName,
                    value: item.apiId
                  }
                })
                : null
              this.setState({
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

  componentDidMount() {
    this.props.onRef(this)
    this.handleGetData()
  }

  render() {
    const {t} = this.props
    const renderContent = () => {
      return this.state.list.length > 0 ? this.state.list.map((item, index) => {
          return MessageCard({
            key: index,
            read: item.read,
            content: item.content,
            author: item.gameName,
            id: item.searchId,
            date: item.publishTime ? moment(item.publishTime).format('YYYY-MM-DD hh:mm:ss') : null,
            handleClickEvent: this.handleClickEvent
          })
        }) :
        <NoData/>
    }
    return <div className='system-notice-content'>
      <NoticeOperateBtnView {...this} />
      <PullToRefresh
        className='notice-page-content'
        damping={60}
        ref={el => this.ptr = el}
        direction={'down'}
        refreshing={this.state.refreshing}
        onRefresh={() => {
          this.handleGetData({refreshing: true})
        }}
      >
        {renderContent()}
        {this.lastPage ? <p className='no-more'>{this.props.t('view.local.notice.system.noMore')}</p> : null}
      </PullToRefresh>
    </div>
  }
}
