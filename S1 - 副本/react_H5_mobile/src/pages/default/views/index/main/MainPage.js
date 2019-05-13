/* eslint-disable react/prop-types */

import React from 'react'
import {Button, Flex, Icon} from 'antd-mobile'
import {soulContext} from 'soul'
import CarouselTemplate from 'common/components/carousel/CarouselView'
import NoticeTemplate from 'common/components/notice/NoticeView'
import MainTabsView from 'common/components/MainTabs/MainTabsView'
import CopyrightTemplate from 'common/components/copyright/CopyrightView'
import MainNav from 'common/components/header/MainHeader'
import AppIcon from 'common/components/image/AppIcon'
import RedPack from "common/components/RedPack";
//顶部导航
const RenderHeader = (props) => {
  return <div className="header">
    {MainNav({
      leftContent: <img
        src='https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png'
        alt="logo"
        className="logo"
        onClick={() => {
          props.handleStateChange({
            showLeftModal: true
          })
        }
        }/>,
      rightContent: (
        props.isLogin ?
          <div
            className="user-info"
            onClick={() => {
              props.handleStateChange({
                showRightModal: true
              })
            }}
          >
            <div className="user-name">{props.username}</div>
            <div className="user-balance">
              {AppIcon({
                name: '#icon-coupons'
              })}
              {props.currency}
              {props.walletBalance}
            </div>
            <Icon size="md" type="ellipsis"/>
          </div> :
          <div className="nav-btn-group">
            <Button
              className="btn-login normal"
              inline
              size="small"
              style={{marginRight: '4px'}}
              onClick={() => {
                props.history.push('/login')
              }
              }>{props.t('view.local.button.login')}</Button>
            <Button
              className="btn-register active"
              inline
              size="small"
              onClick={() => {
                props.history.push('/signup')
              }}
            >{props.t('view.local.button.register')}</Button>
          </div>
      ),
      className: 'com-header-nav'
    })}
  </div>
}
//轮播图及下载提示
const RenderCarousel = (props) => {
  return <div className="home-page-carousel">
    {props.showDownload ?
      <Flex justify="between" className='download'>
        <div>
          <Icon type="cross-circle" size='xxs' onClick={() => {
            props.handleClickEvent({showDownload: false})
          }
          }/>
          <span>更多精彩游戏，请下载手机客户端!</span>
        </div>
        <a
          role="button"
          className="am-button default am-button-inline"
          onClick={() => props.history.push('/download')}>立即下载</a>
      </Flex>
      : null}
    {/*轮播图*/}
    {CarouselTemplate(
      {
        data: props.data,
        auto: true,
        autoTime: 2000,
        infinite: true
      }
    )}
  </div>
}

class MainPage extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.$service = this.props.$service
    this.state = {
      notice: '',
      banner: [],
      data: [],
      siteApiRelation: [],
      user: {
        apis: []
      },
      showDownload: true,
      displayLoginBtn: 'block',
      displayUserInfo: 'none',
      open: true,
      hideRedPack: false
    }
    this.handleStateChange = this.handleStateChange.bind(this)
  }

  handleStateChange(obj) {
    this.setState({...obj})
  }

  componentDidMount() {
    this.$service.origin().mainIndex.get()
      .then(res => {
        // 将公告拼接
        let str = ''
        res.data.announcement.map(i => {
          str += i.content
        })
        this.setState({
          banner: res.data.banner,
          siteApiRelation: res.data.siteApiRelation,
          notice: str,
          activity: res.data.activity,
          phoneDialog: res.data.phoneDialog
        })
      })
  }

  render() {
    const {props, state} = this
    const {history, t} = this.props
    return (
      <div className="home-page">
        {RenderHeader({
          isLogin: props.isLogin,
          username: props.username,
          currency: props.currency,
          handleStateChange: props.handleStateChange,
          walletBalance: (props.totalAssets || 0).toFixed(2),
          t,
          history,
        })}
        <div className="home-content">
          <section className="hostname">主页域名：{window.location.hostname}</section>
          {RenderCarousel({
            data: state.banner,
            showDownload: this.state.showDownload,
            handleClickEvent: this.handleStateChange,
            history
          })}
          {/*滚动公告*/}
          {NoticeTemplate(
            {
              title: '公告',
              notice: this.state.notice,
            }
          )}
          <div className="home-page-main-tabs">
            {/*Tab页*/}
            <MainTabsView data={this.state.siteApiRelation}/>
          </div>
          {
            CopyrightTemplate(
              {
                copyrightText: 'COPYRIGHT © 2004-2019'
              }
            )
          }
          {RedPack({
            hideRedPack: this.state.hideRedPack,
            ...this.state.activity,
            handleStateChange: this.handleStateChange
          })}
        </div>
      </div>
    )
  }
}

export default soulContext()(MainPage)
