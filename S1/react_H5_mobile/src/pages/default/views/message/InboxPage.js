/* eslint-disable react/prop-types,no-undef */
/*
*
* 描述：
* @author lee
* @create 2019-01-25 5:41 PM
*/
import React from 'react'
import {soulContext} from 'soul'
import {Badge, Icon, Tabs, Toast} from 'antd-mobile'
import MainNav from 'common/components/header/MainHeader'
import MyMessageView from './child/MyMessageView'
import SystemMessageView from './child/SystemMessageView'
import SendMessageView from './child/SendMessageView'
import MessageDetail from 'common/components/MessageDetail'

class InboxPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      advisoryUnReadCount: 0,
      sysMessageUnReadCount: 0,
      title: this.props.t('view.local.inbox.title'),
      showDetail: false,
      page: 0,
      detail: {}
    }
    this.handleShowDetail = this.handleShowDetail.bind(this)
    this.handleSelectTab = this.handleSelectTab.bind(this)
  }

  //切换tabs
  handleSelectTab(val) {
    this.setState({
      page: val
    })
  }

  //获取详情
  handleShowDetail(type, params) {
    if (type === 'system') {
      this.props.$service.mineOrigin().getSiteSysNoticeDetail.post({searchId: params.searchId})
        .then(res => {
          this.setState({
            showDetail: true,
            title: '系统消息详情',
            detail: {
              title: res.data.title,
              content: res.data.content,
              date: moment(res.data.publishTime).format('YYYY-MM-DD hh:mm:ss')
            }
          })
        })
    }
    if (type === 'mine') {
      this.props.$service.mineOrigin().advisoryMessageDetail.post({id: params.key})
        .then(res => {
          // TODO 接口结构不明，数据不合理
          if (res.success) {
            if (res.data.length > 0) {
              this.setState({
                showDetail: true,
                title: '我的消息详情',
                detail: {
                  title: '提问：' + res.data[0].advisoryContent,
                  content: res.data[0].advisoryContent,
                  author: res.data[0].questionType,
                  date: moment(res.data[0].advisoryTime).format('YYYY-MM-DD hh:mm:ss')
                }
              })
            }

          } else {
            Toast.fail(res.message)
          }
        })
    }
  }

  //获取新消息数
  handleGetUnreadCount() {
    this.props.$service.mineOrigin().getUnReadCount.get()
      .then(res => {
        if (res.success) this.setState({
          ...res.data
        })
      })
  }

  componentDidMount() {
    this.handleGetUnreadCount()
  }

  render() {
    const {t} = this.props
    //tabs数据
    const tabs = [
      {
        title: <div>
          {this.state.sysMessageUnReadCount ? <Badge><span>{this.state.sysMessageUnReadCount}</span></Badge> : null}
          <span>{t('view.local.inbox.systemMsg')}</span></div>
      },
      {
        title: <div>
          {this.state.advisoryUnReadCount ? <Badge><span>{this.state.advisoryUnReadCount}</span></Badge> : null}
          <span>{t('view.local.inbox.myMsg')}</span></div>
      },
      {
        title: <span>{t('view.local.inbox.sendMsg')}</span>
      },
    ]
    return <div className='inbox-page com-segmented-control-tabs'>
      {MainNav({
        leftContent: <Icon type='left'/>,
        leftEvent: () => {
          this.state.showDetail ? this.setState({
            showDetail: false,
            title: this.props.t('view.local.inbox.title')
          }) : this.props.history.goBack()
        },
        title: this.state.title,
        className: 'com-header-nav'
      })}
      {this.state.showDetail ? <MessageDetail {...this.state.detail} /> : null}
      <Tabs
        tabs={tabs}
        prerenderingSiblingsNumber={0}
        page={this.state.page}
        onChange={(tab, index) => {
          this.handleSelectTab(index)
        }}
        onTabClick={(tab, index) => {
          this.handleSelectTab(index)
        }}
      >
        <SystemMessageView
          handleShowDetail={this.handleShowDetail}
        />
        <MyMessageView
          handleShowDetail={this.handleShowDetail}
        />
        <SendMessageView
          handleSelectTab={this.handleSelectTab}
        />
      </Tabs>
    </div>
  }
}

export default soulContext()(InboxPage)
