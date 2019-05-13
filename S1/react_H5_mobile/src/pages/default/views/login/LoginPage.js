import React, {Component} from 'react'
import {Button, Flex, Icon, InputItem, List, Switch, Toast} from 'antd-mobile'
import {soulContext} from 'soul'
import MainNav from 'common/components/header/MainHeader'
import ImageText from 'common/components/ImageText'
import AppIcon from 'common/components/image/AppIcon'

class LoginPage extends Component {
  //修改验证码
  handleChangeCaptcha = _.debounce(() => {
    this.setState({
      captcha: this.origin + '/captcha/pmregister.html?t=' + new Date().getTime(),
    })
  }, 200)

  constructor(props) {
    super(props)
    this.origin = window.location.origin
    this.state = {
      remember: false,
      form: {
        username: '',
        password: '',
        captcha: ''
      },
      captcha: this.origin + '/captcha/pmregister.html?t=' + new Date().getTime(),
      showCaptcha: false,
      loginDisabled: true,
      profile: {
        className: 'profile',
        src: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALEAAACxCAYAAACLKVzFAAAACXBIWXMAAAsTAAALEwEAmpwYAAAGAGlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDUgNzkuMTYzNDk5LCAyMDE4LzA4LzEzLTE2OjQwOjIyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdEV2dD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlRXZlbnQjIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoTWFjaW50b3NoKSIgeG1wOkNyZWF0ZURhdGU9IjIwMTktMDEtMjlUMjA6MzY6MjYrMDg6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMTktMDEtMjlUMjA6MzY6MjYrMDg6MDAiIHhtcDpNb2RpZnlEYXRlPSIyMDE5LTAxLTI5VDIwOjM2OjI2KzA4OjAwIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjJlMWRmMTdlLTNiMDQtNGI1NC04NmMzLWYwODA5M2M2ZjZkOCIgeG1wTU06RG9jdW1lbnRJRD0iYWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOmYwYjZmNTdmLWEwM2QtYmI0NC1hNDAxLTU2NzJiMWQwMTNlOSIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOmQwOGMzNjY0LWI4ODMtNDNjZS05MjhkLTI4YWNmM2ZhNTQ5NiIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSI+IDx4bXBNTTpIaXN0b3J5PiA8cmRmOlNlcT4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImNyZWF0ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6ZDA4YzM2NjQtYjg4My00M2NlLTkyOGQtMjhhY2YzZmE1NDk2IiBzdEV2dDp3aGVuPSIyMDE5LTAxLTI5VDIwOjM2OjI2KzA4OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoTWFjaW50b3NoKSIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6MmUxZGYxN2UtM2IwNC00YjU0LTg2YzMtZjA4MDkzYzZmNmQ4IiBzdEV2dDp3aGVuPSIyMDE5LTAxLTI5VDIwOjM2OjI2KzA4OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoTWFjaW50b3NoKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz54P57tAAAmG0lEQVR42u2dC/RUVfXH7y8zRHyhoPlCEZEA860IBYIIirhAW//sZeW/Vq2Wj9Q0JM3qb2pmlpXWauky0cgSUcRURDRQE/GBaCEmD1EUTQQREZTS+O/PmXvGM+d3H+feub/5zb1z91p7nZk7d2bu4zvf2WfvffZuW7t2rZeV/Pe///U+8pGP1IyI+Tju/XHywQcfeFtssYUaw16P+uz//Oc/3iuvvOKtXLlSje+9916SU9xNdC/RPf3Hu4ruItpDdEfR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'
      }
    }
    this.t = this.props.t
    this.$service = this.props.$service
    this.history = this.props.history
    this.handleLogin = this.handleLogin.bind(this)
    this.handleRememberPassword = this.handleRememberPassword.bind(this)
    this.handleValueChange = this.handleValueChange.bind(this)
    this.handleChangeCaptcha = this.handleChangeCaptcha.bind(this)
  }

  handleRememberPassword(e) {
    this.setState({remember: e})
  }

  // form表单提交值
  handleValueChange(field, value, type = 'string') {
    value = value.trim()
    const {form} = this.state
    let curField = {
      [field]: value
    }
    this.setState({
      form: {
        ...form,
        ...curField
      }
    }, () => {
      const {form} = this.state
      //判断是否含有用户名和密码，如果都有就启用按钮，
      if (form.username && form.password) {
        this.setState({loginDisabled: false})
      } else {
        this.setState({loginDisabled: true})
      }
    })
  }

  handleLogin() {
    const {form: {username, password, captcha}} = this.state
    //如果用户名和密码验证不通过则不发送请求
    if (!username || !password) {
      return
    }
    if (this.state.showCaptcha && !captcha) {
      Toast.fail('请输入验证码')
      return
    }
    let params = _.cloneDeep(this.state.form)
    if (!this.state.showCaptcha) delete params.captcha
    this.$service.account().login.post(params).then(res => {
      if (res.success) {
        //判断是否有指向的跳转的地址，如果没有就跳转回原来的地址
        let url = _.get(this.props.history, 'location.state.url')
        url ? this.history.push(url) : this.history.goBack()
        sessionStorage.setItem('isLogin', '0')
        sessionStorage.setItem('user', username)
      } else {
        if (res.isOpenCaptcha) {
          this.handleChangeCaptcha()
          this.setState({
            showCaptcha: true
          })
          sessionStorage.setItem('isOpenCaptcha', 'true')
          //开启验证码
        } else {
          this.setState({
            showCaptcha: false
          })
          sessionStorage.setItem('isOpenCaptcha', 'false')
        }
        sessionStorage.setItem('isLogin', '1')
        res.message ? Toast.fail(res.message, 1) : Toast.fail(_.get(res, 'propMessages.captcha'), 1)


        // Toast.fail(this.props.t('view.local.errorMessage.' + res.code))
      }
    }).catch(() => {
      sessionStorage.setItem('isLogin', '1')
    })
  }

  componentDidMount() {
  }

  render() {
    const {form: {username, password, captcha}} = this.state
    return (
      <div>
        {MainNav({
          leftContent: <Icon type="left"/>,//左侧图标
          rightContent: (AppIcon({
            name: "#icon-home",
            handleEvent: () => {
              this.history.push('/index')
            }
          })),//右侧图标
          leftEvent: e => {
            this.history.goBack()
          },//点击返回
          title: this.t('view.local.login.title'),//标题
          className: 'com-header-nav'
        })}
        <div className="content login-page">
          <ImageText {...this.state.profile}/>
          <List className='form-content'>
            <label>
              <div className="label-content">{this.t('view.local.login.form.username')}</div>
              <InputItem
                labelNumber={2}
                value={username}
                onChange={value => this.handleValueChange('username', value)}
                placeholder={this.t('view.local.login.placeholder.username')}
              >
                {AppIcon({name: "#icon-login_account"})}
              </InputItem>
            </label>
            <label>
              <div className="label-content">{this.t('view.local.login.form.password')}</div>
              <InputItem
                labelNumber={2}
                value={password}
                onChange={value => this.handleValueChange('password', value)}
                placeholder={this.t('view.local.login.placeholder.password')}
                type="password"
              >
                {AppIcon({name: "#icon-password"})}
              </InputItem>
            </label>
            <label style={{display: this.state.showCaptcha ? 'block' : 'none'}}>
              <div
                className="label-content">{this.t('view.local.login.form.verificationCode')}</div>
              <InputItem
                labelNumber={2}
                value={captcha}
                onChange={value => this.handleValueChange('captcha', value)}
                placeholder={this.t('view.local.login.placeholder.verificationCode')}
                extra={
                  <img
                    alt=''
                    className="com-captcha_img"
                    onClick={this.handleChangeCaptcha}
                    src={this.state.captcha}/>
                }
              >
                {AppIcon({name: "#icon-security"})}
              </InputItem>
            </label>
            <Flex justify="between" className="remember">
              <a onClick={
                () => {
                  this.history.push('/login/retrieve')
                }
              }>
                {this.t('view.local.login.forgotPassword')}
              </a>
              <div>
                <span className="rememberPassword">{this.t('view.local.login.rememberPassword')}</span>
                <Switch
                  checked={this.state.remember}
                  onChange={
                    e => this.handleRememberPassword(e)
                  }
                />
              </div>
            </Flex>
            <div className=" button-group">
              <Button
                name="submit"
                className="default com-button"
                onClick={this.handleLogin}
                disabled={this.state.loginDisabled}
              >
                {this.t('view.local.login.login')}
              </Button>
              <Button
                className="default ghost com-button"
                onClick={() => {
                  this.history.push('/signup')
                }}
              >
                {this.t('view.local.login.createAccount')}
              </Button>
            </div>
          </List>
        </div>
      </div>
    )
  }
}

export default soulContext()(LoginPage)
