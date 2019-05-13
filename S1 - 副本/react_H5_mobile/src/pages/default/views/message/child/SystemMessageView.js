/*
*
* 描述：
* @author lee
* @create 2019-01-30 5:02 PM
*/
import React from 'react'
import {PullToRefresh, Toast} from 'antd-mobile'
import {soulContext} from 'soul'
import MessageCard from "common/components/MessageCard";
import NoData from "common/components/NoData";
import {InboxOperateBtnView} from "./InboxOperateBtnView";

@soulContext()
export default class SystemMessageView extends React.Component {
  constructor(pros) {
    super(pros)
    this.state = {
      refreshing: false,
      selectAll: false,
      list: [],
      showDetail: false,
      detail: {}
    }
    this.handleClickEvent = this.handleClickEvent.bind(this)
    this.handleSelectEvent = this.handleSelectEvent.bind(this)
    this.handleDelData = this.handleDelData.bind(this)
  }

  // 全选
  handleSelectAll(val) {
    let list = this.state.list
    list.forEach(item => {
      item.selected = val
    })
    this.setState({
      selectAll: val,
      list: list
    })
  }

  //查看信息
  handleClickEvent(val) {
    this.props.handleShowDetail('system', val)
  }

  // 勾选信息
  handleSelectEvent(item, selected) {
    let list = _.cloneDeep(this.state.list)
    if (item === 'all') {//全选
      list.forEach(target => {
        target.selected = selected
      })
    } else {//单选
      list.forEach(target => {
        if (item.key === target.id) target.selected = selected
      })
    }
    this.setState({
      list: list
    })
  }

  //获取数据
  handleGetData() {
    this.props.$service.mineOrigin().getSiteSysNotice.get()
      .then(res => {
        if (res.success) {
          this.setState({
            refreshing: false,
            list: res.data.list
          })
        } else {
          this.setState({
            refreshing: false
          }, () => {
            Toast.fail(res.message)
          })
        }
      })
  }

  //删除信息
  handleDelData(list) {
    this.props.$service.mineOrigin().deleteSiteSysNotice.post({ids: list.join(',')})
      .then(res => {
          //删除成功后从前端剔除相应的数据
          if (res.success) {
            let targetList = _.cloneDeep(this.state.list)
            targetList.map((item, index) => {
              list.forEach(listItem => {
                if (item.id === listItem) {
                  targetList.splice(index, 1)
                }
              })
            })
            this.setState({
              list: targetList
            })
          } else {
            Toast.fail(res.message)//设置失败提醒
          }
        }
      )
  }

  //设置已读
  handleSetRead(list) {
    //批量设置成已读
    this.props.$service.mineOrigin().setSiteSysNoticeStatus.post({ids: list.join(',')})
      .then(res => {
          //设置成已读之后修改状态
          if (res.success) {
            let targetList = _.cloneDeep(this.state.list)
            targetList.map(item => {
              list.forEach(listItem => {
                if (item.id === listItem) item.read = true
              })
            })
            this.setState({
              list: targetList
            })
          } else {
            Toast.fail(res.message)//设置失败提醒
          }
        }
      )
  }

  componentDidMount() {
    this.handleGetData()
  }

  render() {
    const {t} = this.props
    const renderContent = () => {
      return this.state.list.length > 0
        ?
        this.state.list.map((item, index) => {
          return MessageCard({
            index: index,
            key: item.id,
            searchId: item.searchId,
            selectable: true,
            read: item.read,
            content: item.title,
            author: item.author,
            selected: item.selected,
            date: moment(item.publishTime).format('YYYY-MM-DD hh:mm:ss'),
            handleClickEvent: this.handleClickEvent,
            handleSelectEvent: this.handleSelectEvent
          })
        })
        :
        <NoData/>
    }
    return <div className='system-message-content'>
      <InboxOperateBtnView {...this}/>
      <PullToRefresh
        className='inbox-page-content'
        damping={60}
        ref={el => this.ptr = el}
        direction={'down'}
        refreshing={this.state.refreshing}
        onRefresh={() => {
          this.setState({refreshing: true}, () => {
            this.handleGetData()
          });
        }}
      >
        {renderContent()}
      </PullToRefresh>
    </div>
  }
}
