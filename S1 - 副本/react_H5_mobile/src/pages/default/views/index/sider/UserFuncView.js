/* eslint-disable react/prop-types */
import React from 'react'
import {Button, Icon, List, Modal} from 'antd-mobile'
import AppIcon from 'common/components/image/AppIcon'

const UserFuncView = (props) => {
  const {t, history} = props
  // 头部
  const DisplayHeader = (props) => {
    return (
      props.isLogin ?
        <div>
          <Icon
            className="closeBtn"
            type="cross"
            size='lg'
            onClick={() => props.handleStateChange({showLeftModal: false})}/>
          {AppIcon({name: '#icon-baseline-account'})}
          <p className='username'>{props.user.username}</p>
          <Button
            className="btn-user normal"
            onClick={() => {
              props.handleStateChange({
                showLeftModal: false,
                selectedTab: 'mine'
              })
            }}
          >
            {props.t('view.local.home.modal.left.userCenter')}
          </Button>
        </div>
        :
        <div>
          <Icon
            className="closeBtn" type="cross" size='lg'
            onClick={() => props.handleStateChange({showLeftModal: false})}/>
          <h3>{props.t('view.local.home.modal.left.welcome')}</h3>
          <Button
            className="btn-login default active"
            onClick={() => {
              props.history.push('/login')
            }}>
            {props.t('view.local.home.modal.left.userLogIn')}
          </Button>
        </div>
    )
  }
  //菜单列表
  const DisplayBody = (props) => {
    return <List>
      <List.Item
        thumb={AppIcon({name: '#icon-side-home'})}
        onClick={() => {
          props.handleStateChange({
            showLeftModal: false,
            selectedTab: 'index'
          })
        }}>{t('view.local.home.modal.left.home')}</List.Item>
      <List.Item
        thumb={AppIcon({name: '#icon-side-faq'})}
        onClick={() => {
        }}>{t('view.local.home.modal.left.faq')}</List.Item>
      <List.Item
        thumb={AppIcon({name: '#icon-side-agreement'})}
        onClick={() => {
          history.push('/signup/agreement')
        }}>{t('view.local.home.modal.left.agreement')}</List.Item>
      <List.Item
        thumb={AppIcon({name: '#icon-side-aboutUs'})}
        onClick={() => {
        }}>{t('view.local.home.modal.left.aboutUs')}</List.Item>
      <List.Item
        thumb={AppIcon({name: '#icon-side-download'})}
        onClick={() => {
          history.push('/download')
        }}>{t('view.local.home.modal.left.download')}</List.Item>
      <List.Item
        thumb={AppIcon({name: '#icon-side-pc'})}
        onClick={() => {
          window.open('http://test01.ccenter.test.so/')
        }}>{t('view.local.home.modal.left.pc')}</List.Item>
      <List.Item
        thumb={AppIcon({name: '#icon-side-recommend'})}
        onClick={() => {
          history.push('/recommend')
        }}>{t('view.local.home.modal.left.recommend')}</List.Item>
      <List.Item
        thumb={AppIcon({name: '#icon-side-language'})}
        onClick={() => {
        }}>{t('view.local.home.modal.left.language')}</List.Item>
    </List>
  }
  //底部
  const DisplayFooter = (props) => {
    return (
      props.isLogin ?
        <Button
          className="btn-logout active"
          onClick={() => props.handleLogOut()}>
          {props.t('view.local.home.modal.left.userLogOut')}
        </Button> :
        null
    )
  }
  return (
    <div className={localStorage.getItem('theme')}>
      <Modal
        popup
        visible={props.show}
        animationType="slide-down"
        onClose={() => props.handleStateChange({showLeftModal: false})}
        className={localStorage.getItem('theme') ? localStorage.getItem('theme') + ' home-left-pop-modal' : 'home-left-pop-modal'}
      >
        <List
          renderHeader={() => (
            <DisplayHeader
              {...props}
              closeEvent={() => props.handleStateChange({showLeftModal: false})}
            />)}
          renderFooter={() => (
            <DisplayFooter
              {...props}
              handleUserLogOut={(callBack) => this.handleLogOut(callBack)}/>)
          }
        >
          <DisplayBody {...props}/>
        </List>
      </Modal>
    </div>
  )
}
export default UserFuncView
