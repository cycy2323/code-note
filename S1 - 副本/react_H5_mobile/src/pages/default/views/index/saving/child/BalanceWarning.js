// 稽核页面

import React from 'react'
import {soulContext} from '@soul/react/src'
import {NavBar, Icon, Card, Result, Button} from 'antd-mobile'
import MainNav from 'common/components/header/MainHeader'

const myImg = src => <img src={src} className="balance-warning-image" alt=""/>

class PayPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      data: []
    }
  }

  render() {
    const {history, t} = this.props
    return (
      <div className='balance-warning-container'>
        {/*header*/}
        <MainNav
          leftEvent={() => {
            history.go(-1)
          }}
          leftContent={<Icon type='left' size='lg'/>}
          title='取款'
          className="com-header-nav"
        />
        <div className='balance-warning-result'>
          <Result
            img={myImg('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQaqr_J9XDbnvPk7lbzLOPLVyic36gp-JoV_17CryrV8w6swK_iQ')}
            // title="支付成功"
            message={<div>
              <div>取款金额至少为100元</div>
              <div>您当前钱包余额不足，您可以先把游戏的钱转入钱包！</div>
            </div>}
          />
        </div>

        {/*按钮*/}
        <div>
          <Button
            activeStyle={false}
            className="default"
            onClick={() => {
              history.push('saving')
            }}
            style={{width: '92vmin', margin: '0 auto', marginTop: 'calc(40vmin*var(--rate))'}}
          >
            快速存款
          </Button>
        </div>


      </div>
    )
  }
}

export default soulContext()(PayPage)
