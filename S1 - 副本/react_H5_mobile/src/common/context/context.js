/* eslint-disable react/display-name */
import React from 'react'
const ctx = React.createContext()
export const {Provider, Consumer} = ctx
export const withLogIn = Component => props => {
  return <Consumer>{obj => {
    return <Component {...props} handleLogOut={obj.handleLogOut} handleSelectTarget={obj.handleSelectTarget}  isLogin={obj.isLogin}/>
  }
  }</Consumer>
}
export default ctx
