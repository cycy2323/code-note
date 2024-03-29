import { getUserInfo, loginByUsername, logout } from '@/api/login'
import {
  currentLoginTimeStamp,
  getToken,
  removeOauth2Info,
  removeToken,
  removeUserInfo,
  setOAuthInfo,
  setToken
} from '@/utils/auth'

const user = {
  state: {
    user: '',
    status: '',
    code: '',
    token: getToken(),
    name: '',
    avatar: '',
    introduction: '',
    roles: [],
    setting: {
      articlePlatform: []
    }
  },

  mutations: {
    SET_CODE: (state, code) => {
      state.code = code
    },
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_INTRODUCTION: (state, introduction) => {
      state.introduction = introduction
    },
    SET_SETTING: (state, setting) => {
      state.setting = setting
    },
    SET_STATUS: (state, status) => {
      state.status = status
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    REFRESH_TOKEN: (state, oauthInfo) => {
      state.token = oauthInfo.access_token
      currentLoginTimeStamp(true)
      setOAuthInfo(oauthInfo)
    }
  },

  actions: {
    refreshToken({ commit }, oauthInfo) {
      // const username = oauthInfo.username.trim()
      return new Promise((resolve, reject) => {
        // const access_token = response.access_token
        // const refresh_token = response.refresh_token
        if (!oauthInfo.access_token) oauthInfo.access_token = oauthInfo.aouthToken
        oauthInfo.access_token = JSON.stringify({ 'token': oauthInfo.access_token, 'userId': oauthInfo.userId })
        commit('SET_TOKEN', oauthInfo.access_token)
        currentLoginTimeStamp(true)
        setOAuthInfo(oauthInfo)
        resolve()
      })
    },
    // 用户名登录
    LoginByUsername({ commit }, userInfo) {
      const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        loginByUsername(username, userInfo.password, userInfo.googleCode).then(response => {
          if (!response.access_token) response.access_token = response.authToken
          response.access_token = JSON.stringify({ 'token': response.access_token, 'userId': response.userId })
          commit('SET_TOKEN', response.access_token)
          currentLoginTimeStamp()
          setOAuthInfo(response)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetUserInfo({ commit, state }, sysType) {
      return new Promise((resolve, reject) => {
        getUserInfo(sysType).then(response => {
          if (!response) { // 由于mockjs 不支持自定义状态码只能这样hack
            reject('error')
          }
          const data = response.data
          // console.log(data)
          if (data.menuList && data.menuList.length > 0) { // 验证返回的roles是否是一个非空数组
            const roles = []
            data.menuList.forEach(menu => {
              roles.push(menu.code)
              if (menu.children) {
                menu.children.forEach(childMenu => {
                  roles.push(childMenu.code)
                })
              }
            })
            commit('SET_ROLES', roles)
          } else {
            reject('getInfo: roles must be a non-null array !')
          }

          commit('SET_NAME', data.userInfo.userName)
          commit('SET_AVATAR', data.userInfo.avatar)
          // commit('SET_INTRODUCTION', data.introduction)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 第三方验证登录
    // LoginByThirdparty({ commit, state }, code) {
    //   return new Promise((resolve, reject) => {
    //     commit('SET_CODE', code)
    //     loginByThirdparty(state.status, state.email, state.code).then(response => {
    //       commit('SET_TOKEN', response.data.token)
    //       setToken(response.data.token)
    //       resolve()
    //     }).catch(error => {
    //       reject(error)
    //     })
    //   })
    // },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken()
        removeUserInfo()
        removeOauth2Info()
        resolve()
        logout().then(() => {}).catch(error => {
          console.error(error)
          reject('注销登录失败 请重试')
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        removeUserInfo()
        removeOauth2Info()
        resolve()
      })
    },

    // 动态修改权限
    ChangeRoles({ commit, dispatch }, role) {
      return new Promise(resolve => {
        commit('SET_TOKEN', role)
        setToken(role)
        getUserInfo(role).then(response => {
          const data = response.data
          commit('SET_ROLES', data.roles)
          commit('SET_NAME', data.name)
          commit('SET_AVATAR', data.avatar)
          commit('SET_INTRODUCTION', data.introduction)
          dispatch('GenerateRoutes', data) // 动态修改权限后 重绘侧边菜单
          resolve()
        })
      })
    }
  }
}

export default user
