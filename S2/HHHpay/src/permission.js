import router from './router'

// 路由跳转之前
router.beforeEach((to, from, next) => {
  // console.log(12333333)
  // debugger
  if (to.path !== '/login' && !localStorage.token) {
    return next('/login')
  }
  next()
})
