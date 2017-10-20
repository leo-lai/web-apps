import Vue from 'vue'
import Framework7 from 'framework7'
import wilddog from 'wilddog'
// import Framework7Vue from 'framework7-vue'
import Framework7Vue from 'framework7-vue/src/framework7-vue'
import Framework7Theme from 'framework7/dist/css/framework7.ios.min.css'
import Framework7ThemeColors from 'framework7/dist/css/framework7.ios.colors.min.css'
import Framework7Icons from 'framework7-icons/css/framework7-icons.css'
import CSSfont from 'assets/css/font.less'
import CSSbase from 'assets/css/base.less'

import { storage, utils } from 'assets/js/utils'
import config from './config'

import app from './app'

// Framework7Vue
Vue.use(Framework7Vue)
// wilddog 监听版本更新
wilddog.initializeApp(config.wilddog)

utils.url.getRootPath = function(){
	return utils.url.join(config.framework7.pushStateRoot, config.framework7.pushStateSeparator) 
}

Vue.mixin({
  created() {
  	this.$$config = config
    // 野狗
    this.$$wilddog = wilddog
    // 小工具
    this.$$utils = utils
    // url操作
    this.$$url = utils.url
    // 本地缓存
    this.$$storage = storage
  }
})

new Vue({
	el: '#app',
	template: '<app/>',
	framework7: config.framework7,
  components: {
  	app
  }
})
