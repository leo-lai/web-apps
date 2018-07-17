import Vue from 'vue'
import Vuex from 'vuex'
import { storage, utils } from 'assets/js/utils'
import api from './api'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
  	userInfo: storage.local.get('business_userinfo')
  },
  getters: {
  	userInfo: state => state.userInfo
  },
  mutations: {
		USER_INFO: (state, userInfo) => {
			storage.local.set('business_userinfo', userInfo)
			state.userInfo = userInfo
		}
	},
	actions: {
		checkLogin({ commit }, urlParams = {}) {
			return new Promise((resolve, reject) => {
				let userInfo = storage.local.get('business_userinfo')
				if(userInfo && userInfo.open_id){
					resolve(userInfo)
				}else {
					let wxInfo = storage.local.get('business_wxInfo')
					if(wxInfo && wxInfo.open_id) {
						// 如果本地缓存了微信授权信息
						reject(wxInfo)
					}else if(urlParams.open_id) {
						// 如果刚刚微信授权完
						storage.local.set('business_wxInfo', {
							open_id: urlParams.open_id,
							thumb: urlParams.thumb,
							nickname: urlParams.nickname
						}, 10 * 60 * 1000)
						reject(urlParams)
					}else {
						// 微信授权登录
						api.auth.grant(window.location.href)
					}
				}
			})
		},
		login({ commit }, formData) {
			return new Promise((resolve, reject) => {
				api.auth.login(formData).then(userInfo => {
					storage.local.set('business_wxInfo', {
						open_id: formData.open_id,
						thumb: formData.thumb,
						nickname: formData.nickname
					})
					store.dispatch('getUserInfo').then(userInfo => {
						resolve(userInfo)
					}).catch(reject)
				}).catch(reject)
			})
		},
		logout({ commit }, remote = false) {
			return api.auth.logout(remote).finally(_ => {
				commit('USER_INFO', '')
			})
		},
		getUserInfo({ commit }) {
			return api.auth.getInfo().then(({data}) => {
				let userInfo = Object.assign(storage.local.get('business_userinfo'), data)
				commit('USER_INFO', userInfo)
				return userInfo
			})
		}
	}
})

export default store