import React from 'react'
import {Button, Checkbox, DatePicker, InputItem, Picker, Toast, WhiteSpace} from 'antd-mobile'
import {soulContext} from 'soul'
import {changeListLabel, changeListToDict, getLocationParams} from 'common/tools'

class RegisterPage extends React.Component {
  constructor(props) {
    super(props)
    this.$service = this.props.$service
    this.history = this.props.history
    this.state = {
      form: {},
      defaultLocale: [],
      mainCurrency: [],
      securityIssues: [],
      sex: [],
      dictLocale: {},
      dictCurrency: {},
      dictSecurityIssues: {},
      dictSex: {},
      maxDate: '',
      minDate: '',
      signUpDataMap: [],
      verificationCodeUrl: window.location.origin + "/captcha/pmregister.html?t=" + new Date().getTime()
    }
    this.handleFormValueChange = this.handleFormValueChange.bind(this)
    this.coverValueToDisplay = this.coverValueToDisplay.bind(this)
    this.handleChangeCaptchaCode = this.handleChangeCaptchaCode.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.renderDynamicElement = this.renderDynamicElement.bind(this)
    this.t = this.props.t
  }

  // 修改数据
  handleFormValueChange(field, value, type = 'string') {
    if (type === 'number') {
    }
    if (type === 'string') {
      value = value.trim()//清除多余的空格
    }
    const {form} = this.state
    this.setState({
      form: {
        ...form,
        [field]: value//在这里不做任何的数据处理，否则input等组件有可能会报错
      }
    }, () => {
    })
  }

  //显示提示
  handleShowToast(type) {
    Toast.fail(type);
  }

  //重新获取验证码
  handleChangeCaptchaCode = _.debounce(() => {
    this.setState({
      verificationCodeUrl: window.location.origin + "/captcha/pmregister.html?t=" + new Date().getTime()
    })
  }, 300)

  componentDidMount() {
    //如果sessionStorage里已经有注册信息了，就不用再去请求注册接口，直接将sessionStorage里的信息回填到表单中
    if (JSON.parse(sessionStorage.getItem('registerPageCache'))) {
      this.setState({
        ...JSON.parse(sessionStorage.getItem('registerPageCache'))
      })
    } else {
      this.$service.registerOrigin().getRegisterInfo.get()
        .then(res => {
          let form = this.state.form
          let changeForm = {
            recommendationCode: getLocationParams('v'),
            defaultTimezone: _.get(res, 'data.params.timezone')
          }
          this.setState({
            form: {...form, ...changeForm},
            signUpDataMap: _.get(res, 'data.signUpDataMap'),
            displayForm: _.get(res, 'data.signUpDataMap'),
            requiredJson: _.get(res, 'data.requiredJson'),
            field: _.get(res, 'data.field'),
            defaultLocale: changeListLabel(_.get(res, 'data.selectOption.defaultLocale'), 'text'),
            mainCurrency: changeListLabel(_.get(res, 'data.selectOption.mainCurrency'), 'text'),
            securityIssues: changeListLabel(_.get(res, 'data.selectOption.securityIssues'), 'text'),
            sex: changeListLabel(_.get(res, 'data.selectOption.sex'), 'text'),
            dictLocale: changeListToDict(_.get(res, 'data.selectOption.defaultLocale'), 'text'),
            dictCurrency: changeListToDict(_.get(res, 'data.selectOption.mainCurrency'), 'text'),
            dictSecurityIssues: changeListToDict(_.get(res, 'data.selectOption.securityIssues'), 'text'),
            dictSex: changeListToDict(_.get(res, 'data.selectOption.sex'), 'text'),
            maxDate: new Date(_.get(res, 'data.params.maxDate')),
            minDate: new Date(_.get(res, 'data.params.minDate'))
          }, function () {
            this.forceUpdate();
          })
        })
    }
    // 获取注册相关信息
  }

  //  存储及删除当前页状态
  componentWillUnmount() {
    let target = _.get(this.history, 'location.pathname')
    if (target === '/signup/agreement') {
      sessionStorage.setItem('registerPageCache', JSON.stringify(this.state))
    } else {
      sessionStorage.removeItem('registerPageCache')
    }
  }

  //获取手机验证码
  handleGetPhoneCode() {

  }

//提交表单
  handleSubmit(e) {
    // 阻止表单submit事件自动跳转页面的动作
    e.preventDefault()
    let errorItem = ''
    let errorMsg = ''
    //拼接需要的表单
    let params = {}
    let signUpKeys = this.state.signUpDataMap
    let valid = this.state.field.every(field => {
      let item = field.name
      let required = field.isRequired === '0' || field.isRequired === '1'
      let value = this.state.form[item]
      // 转换数据，将下拉别表数据和普通input数据区分对待
      let hasValue = Array.isArray(value) ? value[0] : value
      let requiredJson = this.state.requiredJson
      //必填项的检测
      if (required && !hasValue) {
        let toastContent = Array.isArray(value) ? this.t('view.local.register.toast.selectToast')(this.t('view.local.register.form.' + item)) : this.t('view.local.register.toast.inputToast')(this.t('view.local.register.form.' + item))
        this.handleShowToast(toastContent)
        this.refs[item].focus()
        return false
      }
      //与必填项相关的特殊字段的检测
      //密码
      if (item === 'password' && this.state.form.confirmPassword !== value) {
        this.handleShowToast(this.t('view.local.register.toast.passwordMismatch'))
        value ? this.refs.confirmPassword.focus() : this.refs.password.focus()
        return false
      }
      //安全密码
      if (item === 'paymentPassword') {
        if (!/^[0-9]{6}$/.test(value)) {
          this.handleShowToast(this.t('view.local.register.toast.paymentPasswordShouldBe'))
          this.refs[item].focus()
          return false
        }
        if (this.state.form.paymentPasswordConfirm !== value) {
          this.handleShowToast(this.t('view.local.register.toast.paymentPasswordMismatch'))
          value ? this.refs.paymentPasswordConfirm.focus() : this.refs.paymentPassword.focus()
          return false
        }
      }
      //检测数据是否符合规范
      if (item === 'username' && value && !/^[a-zA-Z0-9]{4,15}$/.test(value)) {
        this.handleShowToast(this.t('view.local.register.toast.usernameShouldBe'))
        this.refs[item].focus()
        return false
      }
      if (item === '110' && value && !/^(\(\d{3,4}-)|\d{3.4}-\)?\d{7,8}$/.test(value)) {
        this.handleShowToast(this.t('view.local.register.toast.phoneNumberShouldBe'))
        this.refs[item].focus()
        return false
      }
      if (item === '201' && value && !/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(value)) {
        this.handleShowToast(this.t('view.local.register.toast.emailShouldBe'))
        this.refs[item].focus()
        return false
      }
      if (item === '301' && value && !/[1-9][0-9]{4,}/.test(value)) {
        this.handleShowToast(this.t('view.local.register.toast.emailShouldBe'))
        this.refs[item].focus()
        return false
      }
      if (item === 'termsOfService' && !value) {
        this.handleShowToast(this.t('view.local.register.toast.shouldAcceptTerms'))
      }
      if (Array.isArray(value)) value = value[0]
      if (value instanceof Date) value = value.getTime()
      if (item === 'password') params['confirmPassword'] = value
      if (item === 'verificationCode') {
        params.captchaCode = this.state.form['verificationCode']
      } else {
        params[signUpKeys[item] || item] = value
      }
      return true
    })
    //验证不通过则返回
    params.termsOfService = this.state.form['serviceTerms']
    if (!valid) return
    delete params.verificationCode
    this.$service.registerOrigin().save.post(params)
      .then(res => {
        //注册成功
        if (res.success) {
          Toast.success(res.message, 1, () => {
            this.props.history.replace('/login')
          })
        } else {
          Toast.fail(res.message)
        }
      })
      .catch(err => {

      })

  }

  //根据字典转换显示的数据
  coverValueToDisplay(type, val) {
    switch (type) {
      case 'sex':
        return this.state.dictSex[val]
      case 'defaultLocale':
        return this.state.dictLocale[val]
      case 'mainCurrency':
        return this.state.dictCurrency[val]
      case 'securityIssues':
        return this.state.dictSecurityIssues[val]
      case 'birthday':
        return val ? moment(val).format('YYYY-MM-DD') : val
    }
  }

  renderDynamicElement() {
    if (!this.state.field) {
    } else {
      let dynamicElement = []
      const t = this.t
      let serviceTerms
      this.state.field.map(field => {
        let item = field.name
        let cache
        let type = 'text'
        let required = (field.isRequired === '0' || field.isRequired === '1') ?
          <span className='com-required-mark'>*</span> : ''
        switch (item) {
          case 'password'://密码
            cache =
              <InputItem
                value={this.state.form.confirmPassword}
                key="confirmPassword"
                ref="confirmPassword"
                type='password'
                onChange={value => this.handleFormValueChange('confirmPassword', value)}
                placeholder={this.t('view.local.register.placeholder.confirmPassword')}>
                {required}
                {this.t('view.local.register.form.confirmPassword')}
              </InputItem>
            type = 'password'
            break
          case 'verificationCode'://普通验证码
            cache = <InputItem
              value={this.state.form.verificationCode}
              className="captchaCode"
              key="verificationCode"
              ref="verificationCode"
              onChange={value => this.handleFormValueChange('verificationCode', value)}
              extra={<img
                className="com-captcha_img"
                onClick={this.handleChangeCaptchaCode}
                src={this.state.verificationCodeUrl} alt=''/>}
              placeholder={t('view.local.register.placeholder.verificationCode')}>
              {required}
              {t('view.local.register.form.verificationCode')}
            </InputItem>
            break
          case '110'://电话号码
            cache = <div className="register-phone-code" key="phoneCode">
              <InputItem
                value={this.state.form.phoneCode}
                ref='phoneCode'
                onChange={value => this.handleFormValueChange('phoneCode', value)}
                placeholder={this.t('view.local.register.placeholder.phoneVerificationCode')}>
                {required}
                {this.t('view.local.register.form.phoneVerificationCode')}
              </InputItem>
              <Button
                type="ghost"
                className='phone-code-button'
                inline
                disabled={this.state.phoneCodeBtnDisabled}
                onClick={() => {
                  this.handleGetPhoneCode()
                }}>{this.t('view.local.register.form.getPhoneVerificationCode')}</Button>
            </div>
            break
          case 'paymentPassword':
            cache = <InputItem
              value={this.state.form.paymentPasswordConfirm}
              maxLength={6}
              key="paymentPasswordConfirm"
              ref='paymentPasswordConfirm'
              onChange={value => this.handleFormValueChange('paymentPasswordConfirm', value)}
              placeholder={t('view.local.register.placeholder.paymentPasswordConfirm')}
              type="password">
              {required}
              {t('view.local.register.form.paymentPasswordConfirm')}
            </InputItem>
            break
          case 'sex'://性别
            cache = <Picker
              value={this.state.form.sex}
              key="sex"
              title="选择性别"
              cols={1}
              data={this.state.sex}
              onChange={value => this.handleFormValueChange('sex', value, 'array')}>
              <InputItem value={this.coverValueToDisplay('sex', this.state.form.sex)}
                         ref="sex"
                         editable={false}
                         placeholder={t('view.local.register.placeholder.sex')}>
                {required}
                {t('view.local.register.form.sex')}
              </InputItem>
            </Picker>
            break
          case 'birthday'://生日
            cache = <DatePicker
              key="birthday"
              mode="date"
              title="选择生日"
              maxDate={this.state.maxDate}
              minDate={this.state.minDate}
              value={this.state.form.birthday}
              onChange={value => this.handleFormValueChange('birthday', value, 'object')}>
              <InputItem
                value={this.coverValueToDisplay('birthday', this.state.form.birthday)}
                editable={false}
                placeholder={t('view.local.register.placeholder.birthday')}>
                {required}
                {t('view.local.register.form.birthday')}
              </InputItem>
            </DatePicker>
            break
          case 'mainCurrency'://主要货币
            cache = <Picker
              value={this.state.form.mainCurrency}
              key="mainCurrency"
              cols={1}
              data={this.state.mainCurrency}
              onChange={value => this.handleFormValueChange('mainCurrency', value, 'array')}>
              <InputItem
                value={this.coverValueToDisplay('mainCurrency', this.state.form.mainCurrency)}
                editable={false}
                placeholder={t('view.local.register.placeholder.mainCurrency')}>
                {required}
                {t('view.local.register.form.mainCurrency')}
              </InputItem>
            </Picker>
            break
          case 'securityIssues'://安全问题
            cache = <div key="securityIssues">
              <Picker
                value={this.state.form.securityIssues}
                title="选择问题"
                cols={1}
                data={this.state.securityIssues}
                onChange={value => this.handleFormValueChange('securityIssues', value, 'array')}>
                <InputItem
                  value={this.coverValueToDisplay('securityIssues', this.state.form.securityIssues)}
                  editable={false}
                  placeholder={t('view.local.register.placeholder.securityIssues')}>
                  {required}

                  {t('view.local.register.form.securityIssues')}
                </InputItem>
              </Picker>
              <InputItem
                value={this.state.form.answer}
                ref='answer'
                type={type}
                onChange={value => this.handleFormValueChange('answer', value)}
                placeholder={this.t('view.local.register.placeholder.answer')}>
                {required}
                {this.t('view.local.register.form.answer')}
              </InputItem>
            </div>
            break
          case 'defaultLocale'://默认语言
            cache = <Picker
              value={this.state.form.defaultLocale}
              key="defaultLocale"
              title="选择语言"
              cols={1}
              data={this.state.defaultLocale}
              onChange={value => this.handleFormValueChange('defaultLocale', value, 'array')}>
              <InputItem
                value={this.coverValueToDisplay('defaultLocale', this.state.form.defaultLocale)}
                editable={false}
                placeholder={t('view.local.register.placeholder.defaultLocale')}>
                {required}
                {t('view.local.register.form.defaultLocale')}
              </InputItem>
            </Picker>
            break
        }
        if (item !== 'verificationCode' && item !== 'serviceTerms' && item !== 'sex' && item !== 'birthday' && item !== 'mainCurrency' && item !== 'securityIssues' && item !== 'defaultLocale') {
          if (item === '110' || item === '301') {
            dynamicElement.push(<InputItem
              value={this.state.form[item]}
              key={item}
              ref={item}
              type='money'
              onVirtualKeyboardConfirm={() => {
              }}
              onChange={value => this.handleFormValueChange(item, value)}
              placeholder={this.t('view.local.register.placeholder.' + item)}>
              {required}
              {this.t('view.local.register.form.' + item)}
            </InputItem>)
          } else {
            let dom = <InputItem
              value={this.state.form[item]}
              key={item}
              ref={item}
              type={type}
              onVirtualKeyboardConfirm={() => {
              }}
              onChange={value => this.handleFormValueChange(item, value)}
              placeholder={this.t('view.local.register.placeholder.' + item)}>
              {required}
              {this.t('view.local.register.form.' + item)}
            </InputItem>
            item === 'regCode' ? dynamicElement.unshift(dom) : dynamicElement.push(dom)
          }
        }
        if (cache) dynamicElement.push(cache)
      })
      dynamicElement.push(
        <Checkbox.AgreeItem
          checked={this.state.form.serviceTerms}
          key="serviceTerms"
          onChange={e => {
            this.handleFormValueChange('serviceTerms', e.target.checked, 'boolean')
          }}>
          {/*{required}*/}
          {t('view.local.register.agree')}
          <a onClick={
            e => {
              e.preventDefault()
              this.history.push('/signup/agreement')
            }}>{t('view.local.register.registrationAgreement')}</a>
        </Checkbox.AgreeItem>)
      dynamicElement.push(
        <Button
          className="default com-button"
          key={'submit'}
          onClick={(e) => {
            this.handleSubmit(e)
          }}
          disabled={this.state.disagree}>
          {t('view.local.register.createAccount')}
        </Button>)
      return dynamicElement
    }
  }

  render() {
    return (
      <div className="register-page">
        <div className="content">
          <WhiteSpace size="md"/>
          {this.renderDynamicElement()}
          <WhiteSpace size="md"/>
        </div>
      </div>
    )
  }
}

export default soulContext()(RegisterPage)
