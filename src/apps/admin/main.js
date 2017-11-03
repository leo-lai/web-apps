import 'babel-polyfill'
import Vue from 'vue'
import VueRouter from 'vue-router'
import ElementUI from 'element-ui'
import NProgress from 'nprogress'

import { storage, utils } from 'assets/js/utils'
import config from './config'
import api from './api'
import routes from './routes'
import app from './app'


Vue.use(ElementUI)
Vue.use(VueRouter)

Vue.use({
  install(Vue, options) {
    Vue.prototype.$$href = function(url, action = 'push'){
      if(!url) return

      if(/^http(s?)/i.test(url)){
        window.location[action === 'push' ? 'assign' : action](url)
      }else{
        router[action] && router[action](url)
      }
    }
  }
})

Vue.mixin({
  created() {
    this.$$config = config
    // 小工具
    this.$$utils = utils
    // url操作
    this.$$url = utils.url
    // 本地缓存
    this.$$storage = storage
    // 接口对象
    this.$$api = api
  }
})

const router = new VueRouter({
  routes,
  base: config.router.base,
	mode: 'history',
	scrollBehavior (to, from, savedPosition) {
    // return 期望滚动到哪个的位置
    // console.log(to, from, savedPosition)
  }
})
router.beforeEach((to, from, next) => {
  NProgress.start()
  if (!api.auth.check() && to.path != '/login') {
    NProgress.done()
    api.auth.logout()
    next(false)
  } else {
    next()
  }
})

router.afterEach((to, from) => {
  NProgress.done()
})
new Vue({
	router,
  render: h => h(app)
}).$mount('#app')

