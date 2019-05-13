/* eslint-disable react/prop-types */
import React, {Component} from 'react'
import {soulContext} from 'soul'
import {TabBar} from 'antd-mobile'
import AppIcon from 'common/components/image/AppIcon'
import Main from './main/MainPage'
import Saving from './saving/SavingPage'
import Preferential from './preferential/PreferentialPage'
import MinePageView from './mine/MinePageView'
import {Provider} from 'common/context/context'
import UserFuncView from "./sider/UserFuncView";
import UserFundView from "./sider/UserFundView";
import {failCallBack} from "common/tools";

@soulContext()
export default class Index extends Component {
  constructor(props) {
    super(props)
    let target = sessionStorage.getItem('indexSelectTab')

    this.state = {
      selectedTab: target === 'customer' ? 'index' : target,//初始化加载的tab页
      isLogin: sessionStorage.getItem('isLogin') === '0',//登录状态
      currentTab: 0,//存款页选中的tab序号
      user: {
        totalAssets: Number.parseFloat(sessionStorage.getItem('totalAssets')) || 0,
        username: sessionStorage.getItem('username') || '',
        currency: sessionStorage.getItem('currency') || '',
        walletBalance: Number.parseFloat(sessionStorage.getItem('walletBalance')) || 0,
        lastLoginTime: sessionStorage.getItem('lastLoginTime') || '',
      },
      link: [],
      bankList: [],
      refreshing: false,
      showLeftModal: false,
      showRightModal: false
    }
    this.history = this.props.history
    this.t = this.props.t
    this.$service = this.props.$service
    this.handleLogOut = this.handleLogOut.bind(this)
    this.handleSelectTarget = this.handleSelectTarget.bind(this)
    this.handleChangeSavingSelected = this.handleChangeSavingSelected.bind(this)
    this.handleGetUserInfo = this.handleGetUserInfo.bind(this)
    this.handleStateChange = this.handleStateChange.bind(this)
  }

  // 获取用户信息
  handleGetUserInfo(obj) {
    this.setState({
      ...obj
    })
    this.props.$service.userInfoOrigin().getUserInfo.get()
      .then(res => {
        if (res.code === '0') {
          //存储于本地的数据
          sessionStorage.setItem('currency', _.get(res, 'data.user.currency') || '')//货币符号
          sessionStorage.setItem('isLogin', res.code)//登录状态
          sessionStorage.setItem('username', _.get(res, 'data.user.username') || '')//用户名
          sessionStorage.setItem('totalAssets', _.get(res, 'data.user.totalAssets') || 0)//总资产
          sessionStorage.setItem('lastLoginTime', _.get(res, 'data.user.lastLoginTime' || ''))//最后的登录时间
          sessionStorage.setItem('walletBalance', _.get(res, 'data.user.walletBalance'))//钱包余额
          sessionStorage.setItem('bankUrl', _.get(res, 'data.user.bankcard.bankUrl'))//银行图片地址
          sessionStorage.setItem('bankcardNumber', _.get(res, 'data.user.bankcard.bankcardNumber'))//银行卡加密后的卡号
          //totalAssets
          this.setState({
            ...res.data,
            isLogin: true,
            refreshing: false
          })
        } else {
          sessionStorage.setItem('isLogin', '1')//登录状态
          this.setState({
            isLogin: false,
            refreshing: false
          })
        }
      })
  }

  //更改状态
  handleStateChange(obj) {
    this.setState({...obj})
  }

  //退出登录
  handleLogOut() {
    this.$service.account().logout.get()
      .then(res => {
        if (res.success) {
          sessionStorage.clear()
          this.setState({
            isLogin: false,
            showLeftModal: false,
            user: {},
            bankList: []
          })
        } else {
          failCallBack({message: res.message, code: res.code, unNeedLogin: true})
        }
      })
  }

  //存款页面
  handleChangeSavingSelected(index) {
    sessionStorage.setItem('indexSelectTab', 'saving')
    this.setState({
      selectedTab: 'saving',
      currentTab: index
    })
  }

  //选择选项卡
  handleSelectTarget(target) {
    sessionStorage.setItem('indexSelectTab', target)
    this.setState({
      selectedTab: target
    })
  }

  componentDidMount() {
    this.handleGetUserInfo()
  }

  render() {
    const {history} = this.props
    return <Provider value={{
      isLogin: this.state.isLogin,
      handleLogOut: this.handleLogOut.bind(this),
      handleSelectTarget: this.handleSelectTarget.bind(this)
    }}>
      <div className="home-tab-bar index-page">
        <TabBar
          tabBarPosition="bottom"
          hidden={this.state.hidden}
          prerenderingSiblingsNumber={0}
          className="home-page-tab-bar"
        >
          <TabBar.Item
            title={this.t('view.local.home.index')}
            key="index"
            icon={AppIcon({name: '#icon-home'})}
            selectedIcon={AppIcon({name: '#icon-home'})}
            selected={this.state.selectedTab === 'index'}
            onPress={() => {
              this.handleSelectTarget('index')
            }}
          >
            <Main
              isLogin={this.state.isLogin}
              totalAssets={this.state.user.totalAssets}
              username={this.state.user.username}
              currency={this.state.user.currency}
              handleStateChange={this.handleStateChange}
            />
          </TabBar.Item>
          <TabBar.Item
            title={this.t('view.local.home.saving')}
            key="saving"
            prefixCls="main"
            icon={AppIcon({name: '#icon-saving'})}
            selectedIcon={AppIcon({name: '#icon-saving'})}
            selected={this.state.selectedTab === 'saving'}
            onPress={() => {
              this.handleChangeSavingSelected(0)//每次点击都选第一个选项
              this.handleSelectTarget('saving')
            }}
          >
            <Saving
              currentTab={this.state.currentTab}
              handleChangeSavingSelected={this.handleChangeSavingSelected}/>
          </TabBar.Item>
          <TabBar.Item
            title={this.t('view.local.home.preferential')}
            key="preferential"
            icon={AppIcon({name: '#icon-off'})}
            selectedIcon={AppIcon({name: '#icon-off'})}
            selected={this.state.selectedTab === 'preferential'}
            onPress={() => {
              this.handleSelectTarget('preferential')
            }}
          >
            <Preferential/>
          </TabBar.Item>
          <TabBar.Item
            title={this.t('view.local.home.customer')}
            key="customer"
            icon={<a style={{color: 'gray'}}
                     href='http://www.baidu.com'>{AppIcon({name: '#icon-customer'})}</a>}
          >
          </TabBar.Item>
          <TabBar.Item
            title={this.t('view.local.home.mine')}
            key="mine"
            icon={AppIcon({name: '#icon-mine'})}
            selectedIcon={AppIcon({name: '#icon-mine'})}
            selected={this.state.selectedTab === 'mine'}
            onPress={() => {
              this.handleSelectTarget('mine')
            }}
          >
            <MinePageView
              {...this.props}
              handleGetUserInfo={this.handleGetUserInfo}
              bankList={this.state.bankList}
              refreshing={this.state.refreshing}
              isLogin={this.state.isLogin}
              user={this.state.user}
              handleStateChange={this.handleStateChange}
              handleChangeSavingSelected={this.handleChangeSavingSelected}/>
          </TabBar.Item>
        </TabBar>
        <UserFuncView
          {...this.props}
          show={this.state.showLeftModal}
          isLogin={this.state.isLogin}
          user={this.state.user}
          handleLogOut={this.handleLogOut}
          handleStateChange={this.handleStateChange}
        />
        {this.state.showRightModal ? <UserFundView
          show={this.state.showRightModal}
          isLogin={this.state.isLogin}
          user={this.state.user}
          handleStateChange={this.handleStateChange}
        /> : null}

      </div>
    </Provider>
  }
}
//export default soulContext()(Index)
