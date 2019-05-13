/*
*
* 描述：获取手机验证码倒计时
* @author lee
* @create 2019-02-18 11:37
*/
import React from 'react'
import {soulContext} from 'soul'

@soulContext()
class PhoneCodeCountDown extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      duration: props.duration || 90
    }
  }

  componentDidMount() {
    this.timer = setInterval(() => {
      if (this.state.duration > 0) {
        this.setState({
          duration: this.state.duration - 1
        })
        sessionStorage.setItem('phoneCodeDuration', this.state.duration)
      } else {
        clearInterval(this.timer)
        this.props.handleStateChange({countDown: false, duration: 0})
      }
    }, 1000)
  }

  componentWillUnmount() {
    clearInterval(this.timer)
  }

  render() {
    return <span>{this.props.t('view.local.common.countDownNotice')(this.state.duration)}
      </span>
  }

}

export default PhoneCodeCountDown
