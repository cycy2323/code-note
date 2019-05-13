import {soulContext} from 'soul'
import React from 'react'
class Auth extends React.Component {
  constructor(props) {
    super(props)
    this.history = this.props.history
  }
  componentDidMount(){
    // const pathName = window.location.pathname.split('/').slice(1).join('/')
    const pathName = this.history.pathname
    let regPage = ['singUp/index','signup/agreement']
    if(!regPage.includes(pathName)){
      sessionStorage.removeItem('registerPageCache')
    }
  }
  render() {
    return null
  }
}
export default soulContext()(Auth)
