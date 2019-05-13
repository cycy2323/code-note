import React from 'react'
import {Icon} from 'antd-mobile'
import MainNav from 'common/components/header/MainHeader'
import {renderChildRoute, soulContext} from 'soul'
import Auth from 'common/components/Auth'

class RegisterPage extends React.Component {
  constructor(props) {
    super(props)
    this.$service = this.props.$service
    this.t = this.props.t
    this.history = this.props.history
  }

  componentDidMount() {
  }

  render() {
    return (
      <div className="register-page">
        <Auth/>
        {MainNav({
          leftContent: <Icon type="left"/>,
          leftEvent: () => {
            this.history.goBack()
          },
          title: '免费注册',
          className: 'com-header-nav'
        })}
        {renderChildRoute(this.props)}
      </div>
    )
  }
}

RegisterPage.defaultProps = {
  title: '用户注册'
}
export default soulContext()(RegisterPage)
