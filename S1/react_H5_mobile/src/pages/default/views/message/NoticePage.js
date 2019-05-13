/* eslint-disable react/prop-types */
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
import GameNoticeView from './child/GameNoticeView'
import SystemNoticeView from './child/SystemNoticeView'
import MessageDetail from 'common/components/MessageDetail'

@soulContext()
class NoticePage extends React.Component {
  // TODO 增加上拉加载翻页功能
  constructor(props) {
    super(props)
    this.state = {
      title: props.t('view.local.notice.title'),
      systemMsg: 0,
      myMsg: 0,
      showDetail: false,
      detail: {},
    }
    this.handleShowDetail = this.handleShowDetail.bind(this)
    this.showType = null
  }

  //绑定子组件到this中
  onRef = (type, ref) => {
    this[type] = ref
  }

  handleShowDetail(type, data) {
    //如果是未读的就去请求，请求后就变成了已读
    if (data.read === false) {
      this.props.$service.mineOrigin()[type === 'game' ? 'getGameNoticeDetail' : 'getSysNoticeDetail'].get({searchId: data.id})
        .then(res => {
          if (res.code === '0') {
            this.setState({
              showDetail: true,
              detail: {
                title: _.get(res, type === 'game' ? 'data.context' : 'data.content'),
                date: _.get(res, 'data.publishTime') ? moment(_.get(res, 'data.publish')).format('YYYY-MM-DD hh:mm:ss') : null
              },
              title: this.props.t('view.local.notice.' + type + '.detail')
            })
            //TODO 标记已读
            this[type === 'game' ? 'gameNotice' : 'systemNotice'].handleSetRead()
          } else {
            Toast.fail(res.message, 1, () => {
              if (res.code === '1001') this.props.history.push('/login')
            })
          }
        })
    } else {
      this.setState({
        showDetail: true,
        detail: {
          title: data.content,
          date: data.date
        },
        title: this.props.t('view.local.notice.' + type + '.detail')
      })
    }
  }

  componentDidMount() {
  }

  render() {
    const {t} = this.props
    // 渲染切换按钮
    const tabs = [
      {
        title: <div>
          {this.state.systemMsg ? <Badge>
            <span>{this.state.systemMsg}</span>
          </Badge> : ''}
          <span>{t('view.local.notice.gameMsg')}</span></div>
      },
      {
        title: (<div>
          {this.state.systemMsg ?
            <Badge><span>{this.state.systemMsg}</span></Badge> : ''}<span>{t('view.local.notice.systemMsg')}</span>
        </div>)
      }
    ]
    return <div className='notice-page com-segmented-control-tabs'>
      {this.state.showDetail ? <MessageDetail {...this.state.detail} /> : null}
      {MainNav({
        leftContent: <Icon type='left'/>,
        leftEvent: () => {
          this.state.showDetail ? this.setState({
            showDetail: false,
            title: this.props.t('view.local.notice.title')
          }) : this.props.history.goBack()
        },
        title: this.state.title,
        className: 'com-header-nav'
      })}
      <Tabs
        tabs={tabs}
        initialPage={0}
        prerenderingSiblingsNumber={0}
      >
        <GameNoticeView onRef={(e) => this.onRef('gameNotice', e)} handleShowDetail={this.handleShowDetail}/>
        <SystemNoticeView onRef={(e) => this.onRef('systemNotice', e)} handleShowDetail={this.handleShowDetail}/>
      </Tabs>
    </div>
  }
}

export default NoticePage
