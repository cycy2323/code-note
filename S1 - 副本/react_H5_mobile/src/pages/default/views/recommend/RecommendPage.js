/*
*
* 描述：
* @author lee
* @create 2019-01-25 5:44 PM
*/
import React from 'react'
import {soulContext} from 'soul'
import {Icon, Tabs} from 'antd-mobile'
import {Sticky, StickyContainer} from 'react-sticky'

import MainNav from 'common/components/header/MainHeader'
import MyShareView from './child/myShareView'
import RuleView from './child/RuleView'
import RecordView from './child/RecordView'
import TeamView from './child/TeamView'

function renderTabBar(props) {
  return (<Sticky>
    {({style}) => <div style={{...style, zIndex: 1}}><Tabs.DefaultTabBar {...props} /></div>}
  </Sticky>)
}

const tabs = [
  {title: '我的分享'},
  {title: '奖励规则'},
  {title: '奖励记录'},
  {title: '团队记录'}
]

class RecommendPage extends React.Component {
  render() {
    return <div className='recommend-page'>
      {MainNav({
        leftContent: <Icon type='left'/>,
        leftEvent: () => {
          this.props.history.goBack()
        },
        title: '推荐好友',
        className: 'com-header-nav'
      })}
      <StickyContainer>
        <Tabs
          tabs={tabs}
          initalPage={'t2'}
          renderTabBar={renderTabBar}
        >
          <MyShareView/>
          <RuleView/>
          <RecordView/>
          <TeamView/>
        </Tabs>
      </StickyContainer>
    </div>
  }
}


export default soulContext()(RecommendPage)
