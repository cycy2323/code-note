// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import './components/index.js' // 全局组件文件
// import './mock/index.js'
// require('./mockdata.js')
// import './mock/index.js'
// import './permission'
// import { Button, Select } from 'element-ui'

Vue.config.productionTip = false

// Vue.use(Button)
// Vue.use(Select)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
