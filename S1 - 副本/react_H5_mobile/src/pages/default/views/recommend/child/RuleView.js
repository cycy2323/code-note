/*
*
* 描述：
* @author lee
* @create 2019-01-28 3:50 PM
*/

import React from 'react'
import {soulContext} from 'soul'
import {Card,Button} from 'antd-mobile'

@soulContext()
class RuleView extends React.Component {
  state={
    data:{}
  }
  componentDidMount(){
    this.props.$service.allPersonRecommend().ruleDetail.get()
      .then(res=>{
        this.setState({
          data:res.data
        })
      })
  }
  render() {
    return <div>
      <div className='title'>推荐奖励</div>
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
            你的专属推荐码：W9A2N1G11888
          </div>
          <div>
            直属下属人数：21 人 昨日推荐奖励：100,000,000.00 昨日红利奖励：100,000,000.00
          </div>
        </Card.Body>
      </Card>
      <div className='title'>邀请玩家</div>
      <Card>
        <Card.Body>
          <div>
            这是您的专属邀请码，复制以下文字通过QQ等方式发送给玩家
          </div>
          <div>
            http://lb-test.com/#/register/?22WNPJCHHFG 人人都是周润发，加入我的团队，一起来打牌
          </div>
          <Button>复制</Button>
          <img width='100%' src='http://test01.ccenter.test.so/1.0.0.0/rcenter/mobile-v3/themes/images/share-to-friend-bg.png'/>
        </Card.Body>
      </Card>
      <div className='title'>邀请玩家</div>
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


export default RuleView
