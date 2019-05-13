import React from 'react'
import {soulContext} from 'soul'
import {Tabs} from 'antd-mobile';
import TabItem from "./TabItem/TabItem";

class GameTypeView extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
    }
    this.$service = this.props.$service
  }

  render() {
    const {history, t} = this.props
    const tabs = this.props.data
    // console.log('电子游戏类型2',tabs);
    return (
      <Tabs
        initialPage={this.props.gameTypeSelectIndex}
        tabs={tabs}
        destroyInactiveTab={true}
        prerenderingSiblingsNumber={0}
        swipeable={false}
        onTabClick={(selectedVal)=>this.props.tabClik(selectedVal)}
        renderTab={
          props => <TabItem {...props} page={6}/>
        }
        renderTabBar={
          props => {
            props.renderTab = (props) => {
              return TabItem({...props})
            }
            return <Tabs.DefaultTabBar {...props} page={5}/>
          }}
      >
      </Tabs>
    );
  }
}

export default soulContext()(GameTypeView)
