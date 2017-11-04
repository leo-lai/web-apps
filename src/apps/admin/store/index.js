import Vue from 'vue'
import Vuex from 'vuex'

import user from './user'
import app from './app'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
  	user, app
  },
  getters: {
  	userMenus: state => state.user.menus,
  	fullscreen: state => state.app.fullscreen,
  	collapse: state => state.app.collapse
  }
})

export default store