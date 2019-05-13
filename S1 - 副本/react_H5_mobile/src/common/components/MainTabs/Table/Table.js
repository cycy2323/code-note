import React from 'react'
import {soulContext} from 'soul'
import {Tabs} from 'antd-mobile';
import TabItem from "common/components/MainTabs/Table/TabItem/TabItem";
import TabGrid from "common/components/MainTabs/Grid/TabGrid";


class Table extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.$service = this.props.$service
  }

  renderContent = tab => {
    return <TabGrid $service={this.$service} arr={tab.gameList}/>
  }

  render() {
    const {history, t, arr} = this.props
    return (
      <div className='commonTable'>
        <Tabs
          // initialPage={'0'}
          tabs={arr}
          renderTab={
            props => <TabItem {...props} page={6}/>
          }
          renderTabBar={
            props => {
              props.renderTab = (props) => {
                return TabItem({...props})
              }
              return <Tabs.DefaultTabBar {...props} page={3.3}/>
            }}
        >
          {this.renderContent}
        </Tabs>
      </div>
    );
  }
}

export default soulContext()(Table)
