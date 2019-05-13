/*
*
* 描述：
* @author lee
* @create 2019-01-28 3:49 PM
*/
import React from 'react'
import {Button, Card, Toast} from 'antd-mobile'
import {soulContext} from 'soul'
import QRCode from 'qrcode.react'

@soulContext()
class MyShareView extends React.Component {
  state = {
    data: {}
  }

  componentDidMount() {
    this.props.$service.allPersonRecommend().myShare.post()
      .then(res => {
        if (res.code === '0') {
          this.setState({
            data: res.data
          })
        } else {
          Toast.fail(res.message, 1, () => {
            if (res.code === '1001') this.props.history.push('/login')
          })
        }
      })
  }

  render() {
    const {data} = this.state
    return <div>
      <div className="title">关于全民推广</div>
      <Card>
        <Card.Body>
          <div>
            分享游戏，人脉变钱脉，0投入、0风险， 天天结算，让您轻松月入百万。
          </div>
        </Card.Body>
      </Card>
      <Card>
        <Card.Body>
          <div>
            你的专属推荐码：{data ? data.shareCode : ''}
          </div>
          <div ref={ref => this.empty = ref}>'dsa'</div>
          {_.get(data, 'qcCodeImg') ?
            <QRCode
              onClick={() => {
                this.qcCode.download('test.png')
              }}
              value={_.get(data, 'qcCodeImg') || ''}
              size={214}
              level='L'
              renderAs={"svg"}
            /> :
            null}
          <div>
            直属下属人数：21 人 昨日推荐奖励：100,000,000.00 昨日红利奖励：100,000,000.00
          </div>
        </Card.Body>
      </Card>
      <div className="title">邀请玩家</div>
      <Card>
        <Card.Body>
          <div>
            这是您的专属邀请码，复制以下文字通过QQ等方式发送给玩家
          </div>
          <div>
            {data ? data.shareUrl : ''}{data ? data.shareMsg : ''}
          </div>
          <Button>复制</Button>
          <img width='100%'
               src='http://test01.ccenter.test.so/1.0.0.0/rcenter/mobile-v3/themes/images/share-to-friend-bg.png'/>
        </Card.Body>
      </Card>
      <div className="title">红利走势</div>
      <Card>
        <Card.Body>
          <div>
            昨日有效玩家数：7 人
          </div>
          <div>
            昨日有效玩家数：7 人
          </div>
          <div>
            昨日有效玩家数：7 人
          </div>
          <div>
            昨日有效玩家数：7 人
          </div>
          <div>
            昨日有效玩家数：7 人
          </div>
        </Card.Body>
      </Card>
    </div>
  }
}


export default MyShareView
