import Vue from 'vue'
import Framework7 from 'framework7'
import Framework7Vue from 'framework7-vue'

import { storage, utils } from 'assets/js/utils'
import config from './config'

import store from './store'

import api from './api'
import app from './app'

// Framework7Vue
Vue.use(Framework7Vue)

utils.url.getRootPath = function(){
	return utils.url.join(config.framework7.pushStateRoot, config.framework7.pushStateSeparator) 
}
// 事件控制中枢
const eventHub = new Vue()

Vue.mixin({
  created() {
  	this.$$config = config
    // 小工具
    this.$$utils = utils
    // url操作
    this.$$url = utils.url
    // 本地缓存
    this.$$storage = storage
    // 接口
    this.$$api = api
    // 组件间事件通信
    this.$$event = eventHub
  }
})

new Vue({
	el: '#app',
  store,
	template: '<app/>',
	framework7: config.framework7,
  components: {
  	app
  }
})

