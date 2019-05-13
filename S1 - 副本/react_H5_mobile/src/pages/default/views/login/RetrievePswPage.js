/*
*
* 描述：找回密码
* @author lee
* @create 2019-02-06 11:43 AM
*/
import React from 'react'
import {Button, Icon, InputItem, List, Toast} from 'antd-mobile'
import MainNav from 'common/components/header/MainHeader'
import {soulContext} from 'soul'
import AppIcon from "common/components/image/AppIcon";
import {failCallBack} from "common/tools";
import PhoneCodeCountDown from "common/components/PhoneCodeCountDown";

const FindMethodsView = (props) => {
  return (
    <List className='find-methods'>
      <List.Item
        className='com-full-input'
        extra={<Icon
          type='right'
          onClick=
            /* eslint-disable react/prop-types */
            {() => {
              props.handleNext('showUserName')
            }}
        />}
      >
        <AppIcon name='#icon-phone'/>
        <span className='label'>手机找回</span>
      </List.Item>
      <List.Item
        className='com-full-input'
        extra={<a rel="noopener noreferrer" target='_blank' href={'htt://www.baidu.com'}><Icon type='right'/></a>
        }
      >
        <AppIcon name='#icon-findBack'/>
        <span className='label'>联系客服</span>
      </List.Item>
    </List>
  )
}
const TypeUsernameView = (props) => {
  return (
    props.showUserName ?
      <List className='type-username'>
        <div className='type-username-inner'>
          <InputItem
            value={props.username}
            onChange={val => props.handleStateChange({username: val})}
            placeholder='请输入账号'
          >
          </InputItem>
        </div>
        <Button
          className='default com-button'
          onClick=
            /* eslint-disable react/prop-types */
            {() => {
              props.handleNext('showPhoneCode')
            }}
        >下一步</Button>
      </List> : null
  )
}
const TypePhoneCodeView = (props) => {
  return (
    props.showPhoneCode ?
      <List className='receive-code'>
        <div className='receive-code-inner'>
          <div className='receive-code-msg'>
            <span>验证码已发送至您的手机</span>
            <span>{props.phone}</span>
          </div>
          <InputItem
            value={props.code}
            onChange={value => props.handleStateChange({code: value})}
            className='com-full-input'
            placeholder='请输入验证码'
            extra={props.duration ?
              <PhoneCodeCountDown handleStateChange={() => this.handleStateChange} duration={props.duration || 90}/> :
              <span onClick={() => props.handleGetPhoneCode}>获取验证码</span>}
          >
          </InputItem>
        </div>
        <Button
          className='default com-button'
          onClick=
            /* eslint-disable react/prop-types */
            {() => {
              props.handleNext('showTypePsw')
            }}
        >下一步</Button>
      </List> : null
  )
}
const TypePswView = (props) => {
  return (
    props.showTypePsw ?
      <List className='set-password'>
        <div className=''>
          <InputItem
            value={props.newPassword}
            onChange={value => props.handleStateChange({newPassword: value})}
            type='password'
            clear={true}
            className='com-full-input'
            placeholder='请输入6-20个字母，数字或字符'
          >
            新密码
          </InputItem>
          <InputItem
            value={props.confirmNewPassword}
            onChange={value => props.handleStateChange({confirmNewPassword: value})}
            type='password'
            clear={true}
            className='com-full-input'
            placeholder='请再次输入密码'
          >
            确认密码
          </InputItem>
        </div>
        <Button
          className='default com-button'
          onClick=
            /* eslint-disable react/prop-types */
            {() => {
              props.handleNext('modifyPsw')
            }}
        >修改</Button>
      </List> : null
  )
}


@soulContext()
class RetrievePswPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showUserName: false,
      showPhoneCode: false,
      showTypePsw: false,
      title: '忘记密码',
      username: '',
      duration: 0,//剩余获取验证码时间
      countDown: false
    }
    this.handleNext = this.handleNext.bind(this)
    this.handleStateChange = this.handleStateChange.bind(this)
  }

  handleStateChange(obj) {
    this.setState({
      ...obj
    })
  }

  handleNext(val) {
    const {history, t, $service} = this.props
    switch (val) {
      case 'showUserName':
        this.setState({
          showUserName: true,
          title: '忘记密码'
        })
        break;
      case 'showPhoneCode':
        if (this.state.username) {
          this.handleGetPhone()
        } else {
          Toast.fail('请输入要找回的账号', 1)
        }
        break;
      case 'showTypePsw':
        if (this.state.code) {
          this.handleSubmitPhoneCode()
        } else {
          Toast.fail('请输入验证码', 1)
        }

        break;
      case 'modifyPsw':
        Toast.success('新密码设置成功，请牢记！', 1, () => {
          this.props.history.replace('/login')
        })
        break;
    }
  }

  handlePrev() {
    if (this.state.showTypePsw) {
      this.setState({
        showTypePsw: false,
        title: '忘记密码'
      })
    } else if (this.state.showPhoneCode) {
      this.setState({
        showPhoneCode: false,
        title: '忘记密码'
      })
    } else if (this.state.showUserName) {
      this.setState({
        showUserName: false,
        title: '忘记密码'
      })
    } else {
      this.props.history.goBack()
    }
  }

  handleGetPhone() {
    this.props.$service.findPasswordOrigin().findUserPhone.post({
      username: this.state.username
    })
      .then(res => {
        if (res.code === '0') {
          this.setState({
            encryptedId: res.data.encryptedId,
            phone: res.data.phone,
            showPhoneCode: true,
            title: '输入验证码',
          }, () => {
            this.handleGetPhoneCode()
          })
        } else {
          failCallBack({message: res.message, code: res.code})
        }
      })
  }

  //根据用户名发送并获取手机验证码
  handleGetPhoneCode() {
    //当倒计时为0的时候方可发送验证码
    let duration = Number.parseInt(sessionStorage.getItem('phoneCodeDuration')) || this.state.duration
    if (duration === 0) {
      this.props.$service.origin().sendFindPasswordPhone.post({
        encryptedId: this.state.encryptedId
      })
        .then(res => {
          if (res.code === '0') {
            this.setState({
              duration: 90,
            })
          } else {
            failCallBack({message: res.message, code: res.code})
          }
        })
    }
  }

  // 提交手机验证码验证
  handleSubmitPhoneCode() {
    this.props.$service.findPasswordOrigin().checkPhoneCode.post({
      phone: this.state.phone,
      code: this.state.code
    })
      .then(res => {
        this.setState({
          showTypePsw: true,
          title: '设置登录密码'
        })
      })
  }

  //设置新密码
  handleSubmitPsw() {

  }

  componentDidMount() {
    //  开启定时器，继续倒计时
    this.duration = sessionStorage.getItem('phoneCodeDuration') || 0
    if (this.duration > 0) {
      this.timer = setInterval(() => {
        if (0 < this.duration) {
          this.duration -= 1
          sessionStorage.setItem('phoneCodeDuration', this.duration)
        } else {
          this.setState({
            duration: 0
          })
          clearInterval(this.timer)
        }
      }, 1000)
    }
  }

  componentWillUnmount() {
    clearInterval(this.timer)
  }

  render() {
    const {t, history} = this.props
    const state = this.state
    return (
      <div className='find-psw-page'>
        {MainNav({
          leftContent: <Icon type="left"/>,//左侧图标
          leftEvent: () => {
            this.handlePrev()
          },
          title: this.state.title,//标题
          className: 'com-header-nav'
        })}
        {FindMethodsView({
          handleNext: this.handleNext
        })}
        {TypeUsernameView({
          username: this.state.username,
          showUserName: this.state.showUserName,
          handleNext: this.handleNext,
          handleStateChange: this.handleStateChange,
        })}
        {TypePhoneCodeView({
          duration: Number.parseInt(sessionStorage.getItem('phoneCodeDuration')) || this.state.duration,
          phone: this.state.phone,
          code: this.state.code,
          showPhoneCode: this.state.showPhoneCode,
          handleGetPhoneCode: this.handleGetPhoneCode,
          handleNext: this.handleNext,
          handleStateChange: this.handleStateChange
        })}
        {TypePswView({
          showTypePsw: this.state.showTypePsw,
          handleNext: this.handleNext,
          confirmNewPassword: this.state.confirmNewPassword,
          newPassword: this.state.newPassword,
          handleStateChange: this.handleStateChange
        })}
      </div>
    )
  }


}

export default RetrievePswPage
