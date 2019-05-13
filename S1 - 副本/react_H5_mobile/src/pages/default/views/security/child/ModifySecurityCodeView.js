/* eslint-disable react/prop-types */
/*
*
* 描述：新建或者修改安全密码
* @author lee
* @create 2019-02-04 11:57 AM
* 初始化：初次进入需先设置真实姓名后设置安全密码
* 修改：提交验证相关信息并修改
*/
import React from 'react'
import {Button, Icon, InputItem, List, Toast} from 'antd-mobile'
import MainNav from 'common/components/header/MainHeader'
import {soulContext} from 'soul'
import {failCallBack} from "common/tools";
import AppIcon from "common/components/image/AppIcon";

@soulContext()
class ModifySecurityCodeView extends React.Component {
  constructor(props) {
    super(props)
    //  TODO 根据是否已设置真实姓名来显示相应的字段
    this.state = {
      hasRealName: false,
      hasPermissionPwd: false,
      realName: '',
      isOpenCaptcha: false,
      remainTimes: null
    }
  }

  //设置真实姓名
  handleSetupRealName() {
    this.props.$service.mineOrigin().setRealName.post({
      realName: this.state.realName
    })
      .then(res => {
        if (res.code === '0') {
          this.setState({
            hasRealName: true
          })
          Toast.success(this.props.t('view.local.securityCenter.code.toast.setNameSuccess'), 1)
        } else {
          failCallBack({history: this.props.history, code: res.code, message: res.message})
        }
      })
  }

  //初始化
  handleInitSecurityPwd() {
    this.props.$service.mineOrigin().initSafePassword.post()
      .then(res => {
        if (res.code === '0') {
          this.setState({...res.data})
        } else {
          failCallBack({history: this.props.history, code: res.code, message: res.message})
        }
      })
  }

  //设置安全码
  handleModifySecurityPwd() {
    this.props.$service.mineOrigin().updateSafePassword.post({
      realName: this.state.realName,
      originPwd: this.state.originPwd,
      pwd1: this.state.pwd1,
      pwd2: this.state.pwd2,
      code: this.state.code
    })
      .then(res => {
        if (res.code === '0') {
          //密码设置成功后返回安全中心
          Toast.success(this.props.t('view.local.securityCenter.code.toast.modifySecuritySuccess'), 1, () => {
            this.props.history.goBack()
          })
        } else {
          this.setState({
            ...res.data
          })
          failCallBack({history: this.props.history, code: res.code, message: res.message})
        }
      })
  }

  componentDidMount() {
    this.handleInitSecurityPwd()
  }

//修改表单的值
  handleModifyFormVal(obj) {
    this.setState({
      ...obj
    })
  }

  //渲染表单
  renderBody = () => {
    const {t} = this.props
    return this.state.hasRealName ?
      <div className='modify-securityPsd-page'>
        <List>
          <InputItem
            value={this.state.realName}
            placeholder={t('view.local.securityCenter.code.placeholder.realName')}
            className='com-full-input'
            clear
            onChange={(val) =>
              this.handleModifyFormVal({realName: val})
            }
            ref={el => this.autoFocusInst = el}
          >
            {t('view.local.securityCenter.code.form.realName')}
          </InputItem>
          {this.state.hasPermissionPwd ? <InputItem
              value={this.state.originPwd}
              placeholder={t('view.local.securityCenter.code.placeholder.originPwd')}
              className='com-full-input'
              clear
              onChange={(val) =>
                this.handleModifyFormVal({originPwd: val})
              }
              ref={el => this.autoFocusInst = el}
            >
              {t('view.local.securityCenter.code.form.originPwd')}
            </InputItem>
            : null
          }
          <InputItem
            value={this.state.pwd1}
            placeholder={t('view.local.securityCenter.code.placeholder.pwd1')}
            type='password'
            className='com-full-input'
            clear
            onChange={(val) =>
              this.handleModifyFormVal({pwd1: val})
            }
            ref={el => this.autoFocusInst = el}
          >
            {t('view.local.securityCenter.code.form.pwd1')}
          </InputItem>
          <InputItem
            value={this.state.pwd2}
            placeholder={t('view.local.securityCenter.code.placeholder.pwd2')}
            type='password'
            className='com-full-input'
            clear
            onChange={(val) =>
              this.handleModifyFormVal({pwd2: val})
            }
            ref={el => this.autoFocusInst = el}
          >
            {t('view.local.securityCenter.code.form.pwd2')}
          </InputItem>
        </List>
        {this.state.isOpenCaptcha ?
          <InputItem
            value={this.state.code}
            labelNumber={1}
            extra={<img className="com-captcha_img" src={window.location.origin + this.state.captChaUrl}/>}
            className='com-full-input code'
            clear
            placeholder={t('view.local.securityCenter.code.placeholder.code')}
            onChange={(val) =>
              this.handleModifyFormVal({code: val})
            }
          ><AppIcon name='#icon-security'/></InputItem> : null}
        {this.state.remainTimes > 0 ?
          <List.Item className='times'>
            {t('view.local.securityCenter.code.remainTimes')(this.state.remainTimes)}
          </List.Item> : null}
        <Button
          className='default com-button'
          onClick={() => {
            this.handleModifySecurityPwd()
          }
          }
        >{t('view.local.securityCenter.code.button.modify')}</Button>
      </div>
      :
      <div>
        <List>
          <InputItem
            value={this.state.realName}
            placeholder={t('view.local.securityCenter.code.placeholder.setRealName')}
            className='com-full-input'
            clear
            onChange={(val) =>
              this.handleModifyFormVal({realName: val})
            }
            ref={el => this.autoFocusInst = el}
          >
            {t('view.local.securityCenter.code.form.realName')}
          </InputItem>
        </List>
        <Button
          className='default com-button'
          onClick={() => {
            this.handleSetupRealName()
          }
          }
        >{t('view.local.securityCenter.code.button.add')}</Button>
      </div>
  }


  render() {
    const {t, history} = this.props
    return <div>
      {MainNav({
        leftContent: <Icon type='left'/>,
        leftEvent: () => {
          history.goBack()
        },
        title: t('view.local.securityCenter.code.title'),
        className: 'com-header-nav'
      })}
      {this.renderBody()}
    </div>
  }
}

export default ModifySecurityCodeView
