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
export default class MyMessageView extends React.Component {
  constructor(pros) {
    super(pros)
    this.state = {
      list: []
    }
    this.handleClickEvent = this.handleClickEvent.bind(this)
    this.handleDelData = this.handleDelData.bind(this)
    this.handleSelectEvent = this.handleSelectEvent.bind(this)
    this.handleSetRead = this.handleSetRead.bind(this)
  }

  static getNewData() {
    console.log(this)
  }

  //点击查看信息
  handleClickEvent(val) {
    this.props.handleShowDetail('mine', val)
  }

  //选中消息，修改相应的数据
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
    this.props.$service.mineOrigin().advisoryMessage.get()
      .then(res => {
        if (res.success) {
          this.setState({
            list: res.data.dataList,
            refreshing: false
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
  }

  //删除信息
  handleDelData(ids) {
    this.props.$service.mineOrigin().deleteAdvisoryMessage.post({ids: ids.join(',')})
      .then(res => {
        if (res.code === '0') {
          let targetList = _.cloneDeep(this.state.list)
          targetList.map((item, index) => {
            ids.forEach(listItem => {
              if (item.id === listItem) {
                targetList.splice(index, 1)
              }
            })
          })
          this.setState({
            list: targetList
          }, () => {
            Toast.success(res.message)
          })
        } else {
          Toast.fail(res.message, 1)
        }
      })
  }

  //设置已读
  handleSetRead(list) {
    //批量设置成已读
    this.props.$service.mineOrigin().setSiteSysNoticeStatus.post({
      ids: list.join(',')
    })
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
      return this.state.list.map((item, index) => {
        // TODO 回复的内容
        return MessageCard({
          key: item.id,
          content: item.advisoryTitle ? '提问标题：' + item.advisoryTitle : '回复标题：' + item.replyTitle,
          date: item.advisoryTime ? moment(item.advisoryTime).format('YYYY-MM-DD hh:mm:ss') : moment(item.replyTime).format('YYYY-MM-DD hh:mm:ss'),
          read: item.read,
          selectable: true,
          selected: item.selected,
          handleClickEvent: this.handleClickEvent,
          handleSelectEvent: this.handleSelectEvent
        })
      })
    }
    return <div className='my-message-content'>
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
        {this.state.list.length > 0 ? renderContent() : <NoData/>}
      </PullToRefresh>
    </div>
  }
}
