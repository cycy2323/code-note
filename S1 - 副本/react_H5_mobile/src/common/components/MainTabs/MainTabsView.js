import React from 'react'
import {soulContext} from 'soul'
import {Tabs} from 'antd-mobile';
import TabItem from "common/components/MainTabs/Table/TabItem/TabItem";
import Table from "common/components/MainTabs/Table/Table";
import TabGrid from "common/components/MainTabs/Grid/TabGrid";

class MainTabsView extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.$service = this.props.$service
  }

  renderContent = tab => {
    //判断:  level:true && siteApis.length>1 :Tabs展示      否则:九宫格展示
    if (tab.level && tab.siteApis.length > 1) {
      return <Table arr={tab.siteApis}/>
    } else {
      return <TabGrid $service={this.$service} arr={tab.siteApis}/>
    }
  }

  render() {
    const {history, t} = this.props
    const tabs = this.props.data
    // console.log('tabs数据',tabs);
    return (
      <Tabs
        tabs={tabs}
        destroyInactiveTab={true}
        prerenderingSiblingsNumber={0}
        swipeable={false}
        renderTab={
          props => <TabItem {...props} page={6}/>
        }
        renderTabBar={
          props => {
            props.renderTab = (props) => {
              return TabItem({...props})
            }
            return <Tabs.DefaultTabBar {...props} page={5.5}/>
          }}
      >
        {this.renderContent}
      </Tabs>
    );
  }
}

export default soulContext()(MainTabsView)
