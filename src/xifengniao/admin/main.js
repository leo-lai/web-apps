import 'babel-polyfill'
import config from './config'
import { storage, utils } from 'assets/js/utils'

import Vue from 'vue'
import ElementUI from 'element-ui'
import NProgress from 'nprogress'

import router from './router'
import store from './store'
import api from './api'

import app from './app'


Vue.use(ElementUI)

// 事件控制中枢
const eventHub = new Vue()

Vue.mixin({
  created() {
    this.$$config = config
    // 小工具
    this.$$utils = utils
    // url操作
    this.$$url = utils.url
    this.$$href = function(url, action = 'push') {
      if(!url) return

      if(/^http(s?)/i.test(url)){
        window.location[action === 'push' ? 'assign' : action](url)
      }else{
        router[action] && router[action](url)
      }
    }
    // 本地缓存
    this.$$storage = storage
    // 接口对象
    this.$$api = api
    // 组件间事件通信
    this.$$event = eventHub
  }
})

router.beforeEach((to, from, next) => {
  NProgress.start()
  if(api.auth.check()) {
    if(to.path === '/login') {
      next({path: '/'})
    }else {
      if(!store.getters.userMenus){
        store.dispatch('getUserMenus')
        next(to)
      } else {
        next()  
      }
    }
  } else if(to.path !== '/login'){
    store.dispatch('logout').finally(() => {
      NProgress.done()
      next(false)
    })
  } else {
    next()
  }
})

router.afterEach((to, from) => {
  NProgress.done()
})

router.onReady(() => {
  // store.dispatch('autoLogin')
})

new Vue({
	router,
  store,
  render: h => h(app)
}).$mount('#app')

