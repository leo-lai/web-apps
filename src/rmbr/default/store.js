import Vue from 'vue'
import Vuex from 'vuex'
import { storage, utils } from 'assets/js/utils'
import api from './api'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
  	userInfo: storage.local.get('seller_userinfo')
  },
  getters: {
  	userInfo: state => state.userInfo
  },
  mutations: {
		USER_INFO: (state, userInfo) => {
			storage.local.set('seller_userinfo', userInfo)
			state.userInfo = userInfo
		}
	},
	actions: {
		checkLogin({ commit }, urlParams = {}) {
			return new Promise((resolve, reject) => {
				let userInfo = storage.local.get('seller_userinfo')
				if(!userInfo){
					let wxInfo = storage.local.get('seller_wxInfo')
					if(wxInfo && wxInfo.open_id) {
						reject(wxInfo)
					}else if(urlParams.open_id) {
						reject(urlParams)
					}else {
						api.auth.grant(window.location.href)
					}
				}else {
					commit('USER_INFO', userInfo)
					resolve(userInfo)
				}
			})
		},
		login({ commit }, formData) {
			return api.auth.login(formData).then(userInfo => {
				storage.local.set('seller_wxInfo', {
					open_id: formData.open_id,
					thumb: formData.thumb,
					nickname: formData.nickname
				})
				commit('USER_INFO', userInfo)
				return userInfo
			})
		},
		logout({ commit }, remote = false) {
			return api.auth.logout(remote).finally(_ => {
				commit('USER_INFO', '')
			})
		}
	}
})

export default store