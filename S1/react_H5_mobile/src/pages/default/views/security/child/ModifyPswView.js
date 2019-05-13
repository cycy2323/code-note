/*
*
* 描述：
* @author lee
* @create 2019-02-04 11:52 AM
*/
import React from 'react'
import {Button, Icon, InputItem, List, Toast} from 'antd-mobile'
import MainNav from 'common/components/header/MainHeader'
import {soulContext} from 'soul'
import AppIcon from "common/components/image/AppIcon";
import {failCallBack} from "common/tools";

@soulContext()
class ModifyPswView extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      password: '',
      newPassword: '',
      code: '',
      confirmNewPassword: '',
      isOpenCaptcha: false,
      remainTimes: null
    }
    this.passwordGrade = this.passwordGrade.bind(this)
  }

  //提交修改
  handleSubmitModify() {
    const {t} = this.props
    const {state} = this
    if (state.password.length === 0) {
      Toast.fail(t('view.local.securityCenter.password.toast.passwordNotNull'), 1)
    } else if (state.newPassword.length === 0) {
      Toast.fail(t('view.local.securityCenter.password.toast.newPasswordNotNull'), 1)
    } else if (state.confirmNewPassword.length === 0) {
      Toast.fail(t('view.local.securityCenter.password.toast.confirmNewPasswordNotNull'), 1)
    } else if (state.newPassword !== state.confirmNewPassword) {
      Toast.fail(t('view.local.securityCenter.password.toast.newPasswordNotSame'), 1)
    } else {
      this.props.$service.mineOrigin().updateLoginPassword.post({
        password: state.password,
        newPassword: state.newPassword,
        code: state.code
      })
        .then(res => {
          if (res.code === '0') {
            Toast.success(t('view.local.securityCenter.password.toast.modifySuccess'), 1, () => {
              this.props.history.goBack()
            })
          } else {
            this.setState({
              ...res.data
            })
            failCallBack({history: this.props.history, message: res.message, code: res.code})
          }
        })
        .catch(err => {
          failCallBack({history: this.props.history, message: err.response.data.message, code: err.response.data.code})
        })
    }
  }

  //修改表单数据
  handleModifyFormData(obj) {
    this.setState({...obj})
  }

  //判断密码强度
  passwordGrade(pwd) {
    // TODO 参考http://password.mx500.com/进行修改
    let bonus = 0
    let pwdArray = pwd.split('')
    let lowerCaseNum = 0
    let upperCaseNum = 0
    let charCodeCache = []
    let prevMark = ''
    let alphabets = 0
    let digits = 0
    //＋(总字元数－8) × 4
    bonus += pwdArray.length * 4
    pwdArray.map((item, index) => {
      let charCode = item.toString().charCodeAt(0)
      charCodeCache.push(charCode)
      let prev2 = charCodeCache[index - 2]
      let prev = charCodeCache[index - 1]
      // －(接连重复(Repeat)字元数) × 2
      if (prev && prev === charCode) bonus -= 2
      if (charCode >= 65 && charCode <= 90) {//upperCase 65-90
        upperCaseNum += 1
        if (prevMark === 'upperAlphabet') {
          alphabets += 1
          // －(3码以上的连续(sequential)字母) × 3
          if (prev2 - prev === prev - charCode === 1 || prev2 - prev === prev - charCode === -1) {
            bonus -= 3
          }
        }
        prevMark = 'upperAlphabet'
      } else if (charCode >= 97 && charCode <= 122) {//lowerCase 97-122
        lowerCaseNum += 1
        if (prevMark === 'lowerAlphabet') {
          alphabets += 1
          // －(3码以上的连续(sequential)字母) × 3
          if (prev2 - prev === prev - charCode === 1 || prev2 - prev === prev - charCode === -1) {
            bonus -= 3
          }
        }
        prevMark = 'lowerAlphabet'
      } else if (charCode >= 49 && charCode <= 57) {//number 49-57
        //判断前2是否是数字
        if (!(prev2 <= 57 && prev2 >= 49)) {
          if (prevMark === 'digit') {
            digits += 2
          }
        } else {
          if (prevMark === 'digit') {
            digits += 1
          }
          // －(3码以上的连续(sequential)数字) × 3
          if (prev2 - prev === prev - charCode === 1 || prev2 - prev === prev - charCode === -1) {
            bonus -= 3
          }
        }
        prevMark = 'digit'
      } else {
        prevMark = 'others'
      }
    })
    // －(接连(Consecutive)字母字元数－3) × 1
    if (alphabets > 3) bonus -= (alphabets - 3)
    // －(接连(Consecutive)字母字元数－3) × 1
    if (digits > 3) bonus -= (digits - 3)
    // ＋(字母字元数－大写字母字元数) × (字母字元数－小写字母字元数) × 2
    bonus += ((lowerCaseNum + upperCaseNum) - upperCaseNum) * ((lowerCaseNum + upperCaseNum) - lowerCaseNum) * 2
    //bonus<60 弱 <80 中等 >=80 高
    if (bonus < 30) {
      return [0, 0, 0]
    } else if (bonus < 60) {
      return [1, 0, 0]
    } else if (bonus < 80) {
      return [1, 1, 0]
    } else {
      return [1, 1, 1]
    }
  }

  //生成密码强度
  renderScore() {
    return <List.Item
      className='password-strength'
    >{this.props.t('view.local.securityCenter.password.form.strong')}
      {
        this.passwordGrade(this.state.newPassword).map((item, index) => {
          return <span key={index} className={item === 1 ? 'high' : ''}/>
        })
      }
    </List.Item>
  }

  render() {
    const {history, t} = this.props
    return <div className='modify-password-page'>
      {MainNav({
        leftContent: <Icon type='left'/>,
        leftEvent: () => {
          history.goBack()
        },
        title: t('view.local.securityCenter.password.title'),
        className: 'com-header-nav'
      })}
      <List>
        <InputItem
          value={this.state.password}
          onChange={val => this.handleModifyFormData({password: val})}
          className='com-full-input'
          type='password'
          clear
          placeholder={t('view.local.securityCenter.password.placeholder.password')}
        >{t('view.local.securityCenter.password.form.password')}</InputItem>
        <InputItem
          value={this.state.newPassword}
          onChange={val => this.handleModifyFormData({newPassword: val})}
          className='com-full-input'
          type='password'
          clear
          placeholder={t('view.local.securityCenter.password.placeholder.newPassword')}
          onChange={(val) => {
            this.setState({
              newPassword: val
            })
          }
          }
        >{t('view.local.securityCenter.password.form.newPassword')}</InputItem>
        {this.renderScore()}
        <InputItem
          value={this.state.confirmNewPassword}
          onChange={val => this.handleModifyFormData({confirmNewPassword: val})}
          className='com-full-input'
          type='password'
          clear
          placeholder={t('view.local.securityCenter.password.placeholder.confirmNewPassword')}
        >{t('view.local.securityCenter.password.form.confirmNewPassword')}</InputItem>
        {this.state.isOpenCaptcha ?
          <InputItem
            value={this.state.code}
            onChange={val => this.handleModifyFormData({code: val})}
            labelNumber={1}
            extra={<img className="com-captcha_img"
                        src={window.location.origin + '/captcha/pmregister.html?t=' + new Date().getTime()} alt=''/>}
            className='com-full-input code'
            clear
            placeholder={t('view.local.securityCenter.password.placeholder.code')}
          ><AppIcon name='#icon-security'/></InputItem> :
          null
        }
      </List>
      {this.state.remainTimes > 0 ?
        <List.Item className='times'>
          {t('view.local.securityCenter.password.remainTimes')(this.state.remainTimes)}
        </List.Item> :
        null
      }
      <Button
        className='default com-button'
        onClick={() => {
          this.handleSubmitModify()
        }
        }
      >{t('view.local.securityCenter.password.button')}</Button>
    </div>
  }
}

export default ModifyPswView
