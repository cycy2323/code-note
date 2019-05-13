/* eslint-disable react/prop-types */
import React from 'react'
import {Card, Flex, PullToRefresh} from 'antd-mobile'
import MainNav from 'common/components/header/MainHeader'
import AppIcon from 'common/components/image/AppIcon'
import IconItem from 'common/components/image/IconItem'

const MinePageView = (props) => {
  const {history, t, isLogin, user, handleStateChange} = props
  return <div className="mine-page ">
    {MainNav({
      leftContent: isLogin && AppIcon({
        name: '#icon-setting', handleEvent: () => {
          handleStateChange({showLeftModal: true})
        }
      }),
      title: t('view.local.mine.title'),
      rightContent:
        AppIcon({
          name: '#icon-mail', handleEvent: () => {
            history.push('/message/inbox')
          }
        }),
      className: 'nav'
    })}
    <div className="header-box">
      <div className="header-content">
        <AppIcon name='#icon-profile'/>
        {isLogin ?
          (<div className="user-info">
            <p className='title'>{user.username}</p>
            <p className='content'>{user.lastLoginTime}</p>
          </div>) :
          (<div className="user-info">
            <span
              onClick={() => {
                history.push('/login')
              }}>{t('view.local.mine.login')}</span>
            &nbsp;/&nbsp;
            <span onClick={() => {
              history.push('/signup/index')
            }}>{t('view.local.mine.register')}</span>
          </div>)
        }
      </div>
    </div>
    {/*middle*/}
    <div className='mine-page-body'>
      <Card className='header-card'>
        <Flex>
          <Flex.Item className='left'>
            {isLogin ? <p
              className='number'>{user.currency}{(_.get(user, 'totalAssets') || 0).toFixed(2)}</p> : null}
            <p>{t('view.local.mine.totalAssets')}</p>
          </Flex.Item>
          <Flex.Item>
            {isLogin ? <p
              className='number'>{user.currency}{(_.get(user, 'walletBalance') || 0).toFixed(2)}</p> : null}
            <p>{t('view.local.mine.walletBalance')}</p>
          </Flex.Item>
        </Flex>
      </Card>
      <PullToRefresh
        className='mine-page-body-inner'
        direction='down'
        refreshing={props.refreshing}
        damping={100}
        indicator={{
          activate: t('view.local.active.pullDownToRefresh'),
          deactivate: t('view.local.active.pullDownToRefresh'),
          finish: t('view.local.active.updateSuccess')
        }}
        onRefresh={() => {
          props.handleGetUserInfo({
            refreshing: true
          })
        }}
        distanceToRefresh={60}>
        <div className=''>
          <Card className='fund-card'>
            <Flex>
              <Flex.Item className='left'>
                <Flex justify="center" onClick={() => {
                  props.handleChangeSavingSelected(0)
                }}>
                  {AppIcon({name: '#icon-card'})}
                  <p className="pre-mid-recharge-p">{t('view.local.mine.deposit')}</p>
                </Flex>
              </Flex.Item>
              <Flex.Item>
                <Flex justify="center" onClick={() => {
                  props.handleChangeSavingSelected(2)
                }}>
                  {AppIcon({name: '#icon-withdraw'})}
                  <p className="pre-mid-recharge-p">{t('view.local.mine.withdraw')}</p>
                </Flex>
              </Flex.Item>
            </Flex>
          </Card>
          <Card className='body-card'>
            <Flex>
              <Flex.Item>
                {IconItem({
                  className: 'item',
                  icon: AppIcon({name: '#icon-lottery'}),
                  title: t('view.local.mine.titles.betting'),
                  describe: t('view.local.mine.descriptions.betting'),
                  handleEvent: () => {
                    history.push('/fund/betting')
                  }
                })}
              </Flex.Item>
              <Flex.Item>
                {IconItem({
                  className: 'item',
                  icon: AppIcon({name: '#icon-account'}),
                  title: t('view.local.mine.titles.funAccount'),
                  describe: t('view.local.mine.descriptions.funAccount'),
                  handleEvent: () => {
                    props.handleChangeSavingSelected(1)
                  }
                })}
              </Flex.Item>
            </Flex>
            <Flex>
              <Flex.Item>
                {IconItem({
                  className: 'item',
                  icon: AppIcon({name: '#icon-fund-records'}),
                  title: t('view.local.mine.titles.fundRecord'),
                  describe: t('view.local.mine.descriptions.fundRecord'),
                  handleEvent: () => {
                    isLogin ? history.push('/fund/record') : history.push('/login')
                  }
                })}
              </Flex.Item>
              <Flex.Item>
                {IconItem({
                  className: 'item',
                  icon: AppIcon({name: '#icon-security-center'}),
                  title: t('view.local.mine.titles.security'),
                  describe: t('view.local.mine.descriptions.security'),
                  handleEvent: () => {
                    isLogin ? history.push('/security') : history.push('/login')
                  }
                })}
              </Flex.Item>
            </Flex>
            <Flex>
              <Flex.Item>
                {IconItem({
                  className: 'item',
                  icon: AppIcon({name: '#icon-preferential-center'}),
                  title: t('view.local.mine.titles.promoRecord'),
                  describe: t('view.local.mine.descriptions.promoRecord'),
                  handleEvent: () => {
                    isLogin ? history.push('/promo/record') : history.push('/login')
                  }
                })}
              </Flex.Item>
              <Flex.Item>
                {IconItem({
                  className: 'item',
                  icon: AppIcon({name: '#icon-msg-center'}),
                  title: t('view.local.mine.titles.notice'),
                  describe: t('view.local.mine.descriptions.notice'),
                  handleEvent: () => {
                    isLogin ? history.push('/message/notice') : history.push('/login')
                  }
                })}
              </Flex.Item>
            </Flex>
          </Card>
          <Card className='body-card'>
            <Flex>
              <Flex.Item>
                {IconItem({
                  className: 'item',
                  icon: AppIcon({name: '#icon-share'}),
                  title: t('view.local.mine.titles.recommend'),
                  describe: t('view.local.mine.descriptions.recommend'),
                  handleEvent: () => {
                    isLogin ?
                      history.push('/recommend') :
                      history.push({
                        pathname: '/login',
                        search: '',
                        state: {url: '/recommend'}
                      })
                  }
                })}
              </Flex.Item>
            </Flex>
          </Card>
        </div>
      </PullToRefresh>
    </div>
  </div>

}
export default MinePageView

