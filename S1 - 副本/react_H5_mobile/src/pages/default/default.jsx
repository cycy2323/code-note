//是否启用动态CDN, 需和cli中的--cdn参数配合使用
if (__IS_CDN__) {
  __webpack_public_path__ = sessionStorage.getItem('cdnPath') === null ? '' : sessionStorage.getItem('cdnPath')
}
import initReact from 'soul'
import routes from '@/routes'
import configs from 'common/config'
import context from 'common/context'
import service from '@/service/DefaultService'

require('./assets/themes/style.css')
require('@/assets/fonts/iconfont.js')
sessionStorage.setItem('lang', 'zh-CN')

// require(`./${__CURRENT_PACKAGE__}.less`)
/**
 * 初始化
 */
const initPage = '/index'
initReact({
  routes,
  service,
  configs,
  context,
  initPage,
  listenHistory: function (location, store) {
    // let state = store.getState()
    // if (location.pathname !== '/login' && !state.$user.isLogin) {
    // this.replace('/login')
    // }
  }
}, ({history, store}) => {
  //TODO 根据后端返回的数据设置主题
  localStorage.theme = 'theme-default'
  document.getElementById('app').className = 'theme-default'
})
