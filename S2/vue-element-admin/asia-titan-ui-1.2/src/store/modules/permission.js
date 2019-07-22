import { adminRouterMap, merchantRouterMap, agentRouterMap, constantRouterMap } from '@/router'
import Vue from 'vue'

Vue.directive('handle', {
  // 当被绑定的元素插入到 DOM 中时……
  inserted: function(el, binding) {
    var getCodeList = localStorage.getItem('codeList')
    var myCodeList = getCodeList ? JSON.parse(getCodeList) : []
    if (myCodeList.indexOf(binding.value) === -1) {
      el.parentNode.removeChild(el)
    }
  }
})

Vue.prototype.outhHandle = function(binding) {
  var getCodeList = localStorage.getItem('codeList')
  var myCodeList = getCodeList ? JSON.parse(getCodeList) : []
  if (myCodeList.indexOf(binding) === -1) {
    return false
  } else {
    return true
  }
}

function getRouteBase() {
  let base
  if (document.domain === Vue.prototype.MerchantHost) {
    base = Vue.prototype.Merchant
  } else if (document.domain === Vue.prototype.ManageHost) {
    base = Vue.prototype.Manage
  } else if (document.domain === Vue.prototype.AgentHost) {
    base = Vue.prototype.Agent
  } else if (Vue.prototype.ManageHostAndMerchantHost.indexOf(document.domain) === -1) {
    base = Vue.prototype.OpenService
  }
  return base
}

// 权限过滤
function filterRoutes(routes) {
  var arr = []
  var getCodeList = localStorage.getItem('codeList')
  var myCodeList = getCodeList ? JSON.parse(getCodeList) : []
  for (var i = 0; i < routes.length; i++) {
    var cur = routes[i]
    var curChild = cur.children.filter(item => {
      return myCodeList.indexOf(cur.path.replace('/', '') + ':' + item.path) > -1 || item.hidden
    })
    if (curChild.filter(item => !item.hidden).length) {
      cur.children = curChild
      arr.push(cur)
    }
  }
  return arr
}

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    }
  },
  actions: {
    GenerateRoutes({ commit }, data) {
      return new Promise(resolve => {
        var res = []
        var routeType = getRouteBase()
        // var asyRoutes = []
        // asyncRouterMap.forEach(route => {
        //   const tmp = { ...route }
        //   if (route.meta && route.meta.roles) {
        //     if (tmp.meta.roles.indexOf('all') > -1 || tmp.meta.roles.indexOf(getRouteBase()) > -1) {
        //       res.push(tmp)
        //     }
        //   }
        // })
        if (routeType === '/admin') {
          res = filterRoutes(adminRouterMap)
        } else if (routeType === '/merchant') {
          res = filterRoutes(merchantRouterMap)
          // res = merchantRouterMap
        } else {
          res = agentRouterMap
        }
        res.push({ path: '*', redirect: '/home', hidden: true })
        commit('SET_ROUTERS', res)
        resolve()
      })
    }
  }
}

export default permission
