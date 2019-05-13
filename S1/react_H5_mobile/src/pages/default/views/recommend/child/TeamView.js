/*
*
* 描述：
* @author lee
* @create 2019-01-28 3:50 PM
*/

import React from 'react'
import {Flex} from 'antd-mobile'
import {soulContext} from 'soul'

@soulContext()
class TeamView extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      data: [
        {name: 'dafewa', num: Number.parseInt(Math.random() * 100), add: Number.parseInt(Math.random() * 10)},
        {name: 'lee1', num: Number.parseInt(Math.random() * 100), add: Number.parseInt(Math.random() * 10)},
        {name: 'dafewa', num: Number.parseInt(Math.random() * 100), add: Number.parseInt(Math.random() * 10)},
        {name: 'dafewa', num: Number.parseInt(Math.random() * 100), add: Number.parseInt(Math.random() * 10)},
        {name: 'dafewa', num: Number.parseInt(Math.random() * 100), add: Number.parseInt(Math.random() * 10)},
        {name: 'dafewa', num: Number.parseInt(Math.random() * 100), add: Number.parseInt(Math.random() * 10)},
        {name: 'dafewa', num: Number.parseInt(Math.random() * 100), add: Number.parseInt(Math.random() * 10)},
        {name: 'dafewa', num: Number.parseInt(Math.random() * 100), add: Number.parseInt(Math.random() * 10)},
        {name: 'dafewa', num: Number.parseInt(Math.random() * 100), add: Number.parseInt(Math.random() * 10)},
        {name: 'dafewa', num: Number.parseInt(Math.random() * 100), add: Number.parseInt(Math.random() * 10)},
        {name: 'dafewa', num: Number.parseInt(Math.random() * 100), add: Number.parseInt(Math.random() * 10)},
        {name: 'dafewa', num: Number.parseInt(Math.random() * 100), add: Number.parseInt(Math.random() * 10)},
        {name: 'dafewa', num: Number.parseInt(Math.random() * 100), add: Number.parseInt(Math.random() * 10)},
        {name: 'dafewa', num: Number.parseInt(Math.random() * 100), add: Number.parseInt(Math.random() * 10)}
      ]
    }
  }

  render() {
    return (<div style={{width: '100%'}}>
      <Flex justify="between" className='result-header'>
        <Flex.Item>玩家账号</Flex.Item>
        <Flex.Item>推荐玩家数</Flex.Item>
        <Flex.Item>今日新增推荐</Flex.Item>
      </Flex>
      {
        this.state.data.map((item, index) => {
          let className = item.name === sessionStorage.getItem('user') ? 'result-list self' : 'result-list'
          return (
            <Flex justify="between" className={className} key={index}>
              <Flex.Item>{item.name}</Flex.Item>
              <Flex.Item>{item.num}</Flex.Item>
              <Flex.Item>{item.add}</Flex.Item>
            </Flex>
          )
        })
      }
    </div>)
  }
}


export default TeamView
