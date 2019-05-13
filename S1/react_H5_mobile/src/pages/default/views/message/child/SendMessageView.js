/*
*
* 描述：
* @author lee
* @create 2019-01-30 5:03 PM
*/
import React from 'react'
import {Button, Card, InputItem, List, Picker, TextareaItem, Toast} from 'antd-mobile'
import {soulContext} from "@soul/react/src";

@soulContext()
export default class SendMessageView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      advisoryType: '',
      advisoryContent: '',
      advisoryTitle: '',
      advisoryTypeList: [],
      isOpenCaptcha: false,
      captcha_value: '',
      captcha: ''
    }
    this.handleSend = this.handleSend.bind(this)
  }

  getNoticeSiteType() {
    this.props.$service.mineOrigin().getNoticeSiteType.get()
      .then(res => {
        if (res.success) {
          res.data.advisoryTypeList.forEach(item => {
            item.label = item.advisoryName
            item.value = item.advisoryType
          })
          this.setState({
            ...res.data
          })
        } else {
          if (res.code === '1001') Toast.fail(res.message, 1, this.props.history.push('/login'))
        }
      })
  }

  //提交消息
  handleSend(val) {
    let data = this.state
    if (!data.advisoryType) {
      Toast.fail('请选择要发送消息的类型！', 1)
      return
    }
    if (!data.advisoryTitle) {
      Toast.fail('请输入要发送消息的标题！', 1)
      return
    }
    if (!data.advisoryContent) {
      Toast.fail('请输入要发送的消息的内容！', 1)
      return
    }
    if (data.advisoryContent && data.advisoryContent.trim().length < 6) {
      Toast.fail('消息的内容最少要6个字符', 1)
      return
    }
    this.props.$service.mineOrigin().addNoticeSite.post({
      'result.advisoryType': this.state.advisoryType[0],
      'result.advisoryTitle': this.state.advisoryTitle,
      'result.advisoryContent': this.state.advisoryContent,
      'result.captcha': this.state.captcha

    })
      .then(res => {
        if (res.code === '0') {
          this.setState({
            advisoryType: '',
            advisoryContent: '',
            advisoryTitle: '',
            isOpenCaptcha: res.data.isOpenCaptcha,
            captcha_value: res.data.captcha_value
          }, () => {
            Toast.success(res.message, 1, () => {
              //TODO 待确定是否要跳到我的消息中
              // this.props.handleSelectTab(1)
            })
          })
        } else {
          Toast.fail(res.message)
        }
      })
  }

  //取消
  handleCancel(val, selected) {
    this.setState({
      advisoryType: '',
      advisoryTitle: '',
      advisoryContent: ''
    })
  }

  componentDidMount() {
    this.getNoticeSiteType()
  }

  render() {
    return <div className='send-message-content'>
      <Card>
        <List>
          <div className="input-line">
            <Picker
              data={this.state.advisoryTypeList}
              cols={1}
              value={this.state.advisoryType}
              onChange={(value) => {
                this.setState({
                  advisoryType: value
                })
              }}
            >
              <List.Item arrow="horizontal">类型：</List.Item>
            </Picker>
          </div>
          <div className="input-line">
            <InputItem
              placeholder='请输入标题'
              value={this.state.advisoryTitle}
              onChange={(value) => {
                this.setState({
                  advisoryTitle: value
                })
              }
              }
            >标题：</InputItem>
          </div>
          <TextareaItem
            value={this.state.advisoryContent}
            className='content'
            placeholder='请输入内容'
            onChange={(value) => {
              this.setState({
                advisoryContent: value
              })
            }}
            rows={7}
          />
          {this.state.isOpenCaptcha ? <InputItem
            placeholder='请输入验证码'
            value={this.state.captcha}
            extra={<img src={window.location.origin + this.state.captcha_value}/>}
            onChange={(value) => {
              this.setState({
                captcha: value
              })
            }
            }
          >验证码</InputItem> : null}
        </List>
      </Card>
      <div className='btn-group'>
        <Button className='default' onClick={(e) => {
          this.handleSend(e)
        }}>发送</Button>
        <Button className='default' onClick={(e) => {
          this.handleCancel(e)
        }}>取消</Button>
      </div>
    </div>
  }
}
