/*
*
* 描述：
* @author lee
* @create 2019-01-25 4:58 PM
*/
import React from 'react'
import {soulContext} from 'soul'
import {Flex, Icon} from 'antd-mobile'
import MainNav from 'common/components/header/MainHeader'
import {getLocationParams} from "common/tools";

class DownloadPage extends React.Component {
  state = {
    downloadUrlAndroid: "",
    downloadUrlIOS: "",
    iconUrl: "",
    siteName: ""
  }

  componentDidMount() {
    this.props.$service.download().download.post({c: getLocationParams('c')})
      .then(res => {
        if (res.success) {
          //当存在自定义下载链接时，系统跳转到相应的页面
          if (res.customerUrl) window.location.assign(res.customerUrl)
          let data = res.data
          //判断是否需要登录，如果需要登录且用户处于未登录状态，则跳转到登录界面
          let isLogin = parseInt(sessionStorage.getItem('isLogin')) === 0
          if (data.needLogin && !isLogin) {
            this.props.history.push('/login')
          }
          this.setState({
            downloadUrlAndroid: data.downloadUrlAndroid,
            downloadUrlIOS: data.downloadUrlIOS,
            iconUrl: data.iconUrl,
            siteName: data.siteName
          })
        } else {
          this.props.history.push('/login')
        }
      })
  }

  render() {
    const {iconUrl, siteName, downloadUrlIOS, downloadUrlAndroid} = this.state
    const {history,t} = this.props
    return <div className='download-page'>
      {MainNav({
        leftContent: <Icon type='left'/>,
        leftEvent: () => {
          history.push('/index')
        },
        title: t('view.local.download.title'),
        className: 'com-header-nav'
      })}
      <div className='content'>
        <Flex direction='column'>
          <img src={iconUrl ? "http://test01.ccenter.test.so" + iconUrl : ''} className="app-logo"/>
          <div className="title">{siteName}</div>
          <div className="description">{t('view.local.download.description')}</div>
          <div className='download-area'>
            <a target='_blank' href={downloadUrlIOS} className='download-link'>{t('view.local.download.ios')}</a>
            <a target='_blank' href={downloadUrlAndroid} className='download-link'>{t('view.local.download.android')}</a>
          </div>
        </Flex>
      </div>
    </div>
  }
}


export default soulContext()(DownloadPage)
