import Cookies from 'js-cookie'
// import jwtUtil from 'jwt-simple'
import Vue from 'vue'

// const TokenKey = 'Admin-Token'

const AccessToken = 'access_token'
const UserInfo = 'user_info'
const Oauth2Info = 'oauth2_info'
const LoginTimeStamp = 'loginTimeStamp'

export function getToken() {
  return Cookies.get(AccessToken)
}

export function setToken(token) {
  return Cookies.set(AccessToken, token)
}

export function removeToken() {
  return Cookies.remove(AccessToken)
}

export function removeUserInfo() {
  localStorage.clear()
  return Cookies.remove(AccessToken)
}

export function removeOauth2Info() {
  return Cookies.remove(AccessToken)
}

export function setCurrentUserInfo(userInfo) {
  return Cookies.set(UserInfo, userInfo)
}

export function getCurrentUserInfo() {
  // alert(Cookies.get(UserInfo))
  return JSON.parse(Cookies.get(UserInfo))
}
export function setOAuthInfo(oauthInfo) {
  // const currentUserInfo = jwtUtil.decode(oauthInfo.access_token, null, true)
  // setCurrentUserInfo(currentUserInfo)
  setToken(oauthInfo.access_token)
  localStorage.setItem('codeList', JSON.stringify(oauthInfo.codeList))
  delete oauthInfo.codeList
  Cookies.set(Oauth2Info, JSON.stringify(oauthInfo))
}

export function getOAuthInfo() {
  return JSON.parse(Cookies.get(Oauth2Info))
}

/* 判断token是否过期*/
export function isTokenExpired() {
  /* 从localStorage中取出token过期时间*/
  const expiredTime = new Date(JSON.parse(localStorage.auth).expired_at).getTime() / 1000
  /* 获取本地时间*/
  let nowTime = new Date().getTime() / 1000
  /* 获取校验时间差*/
  const diffTime = JSON.parse(sessionStorage.diffTime)
  /* 校验本地时间*/
  nowTime -= diffTime
  /* 如果 < 10分钟，则说明即将过期*/
  return (expiredTime - nowTime) < 10 * 60
}

// 刷新token的过期时间判断
export function isAccessTokenExpired() {
  const oData = currentLoginTimeStamp() // 这是在登陆时候保存的时间戳
  const nDta = new Date().getTime()
  const stamp = nDta - oData
  const minutes = parseInt(stamp / (1000 * 60))
  // alert(minutes)
  // console.log(minutes)
  return minutes + 6 >= 30
}

export function currentLoginTimeStamp(refresh) {
  if (!refresh && Cookies.get(LoginTimeStamp)) return Cookies.get(LoginTimeStamp)
  Cookies.set(LoginTimeStamp, Vue.prototype.currentTimeMillis())
  // Cookies.set(LoginTimeStamp,1545104920000)
  return Cookies.get(LoginTimeStamp)
}

