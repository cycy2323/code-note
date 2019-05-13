/*
*
* 描述：
* @author lee
* @create 2019-01-28 3:50 PM
*/

import React from 'react'
import {soulContext} from 'soul'
import {Button, Flex, InputItem, List, Picker} from 'antd-mobile'
import AppIcon from "common/components/image/AppIcon";

@soulContext()
class RecordView extends React.Component {
  state = {
    beginCreateTime: '',
    endCreateTime: ''
  }

  handleSearch() {

  }

  render() {
    let district = ['340000', '340800', '340822']
    return <div>
      <Flex justify="between" className='com-search-line'>
        <span className='label'>时间</span>
        <Picker data={district} cols={1} className="forss">
          <List className='date-selector'>
            <InputItem labelNumber={2}
                       value={this.state.beginCreateTime ? moment(this.state.beginCreateTime).format('YYYY-MM-DD') : ''}>
              {AppIcon({name: '#icon-calendar'})}
            </InputItem>
          </List>
        </Picker>
        <span>类型</span>
        <Picker extra="请选择(可选)"
                data={district}
                title="Areas"
                onOk={e => console.log('ok', e)}
                onDismiss={e => console.log('dismiss', e)}
        >
          <List className='date-selector'>
            <InputItem labelNumber={2}
                       value={this.state.beginCreateTime ? moment(this.state.beginCreateTime).format('YYYY-MM-DD') : ''}>
              {AppIcon({name: '#icon-calendar'})}
            </InputItem>
          </List>

        </Picker>
        <Button className='btn-search default' onClick={() => {
          this.handleSearch()
        }
        }>搜索</Button>
      </Flex>
    </div>
  }
}


export default RecordView
