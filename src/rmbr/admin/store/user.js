import config from '../config'
import { storage, utils } from 'assets/js/utils'
import { userMenus } from '../router/routes'
import api from '../api'
import router from '../router'

const user = {
	state: {
		fetching: false,
		sessionId: storage.local.get('sessionId'),
		info: storage.local.get('userinfo'),
		menus: []
	},
	mutations: {
		USER_INFO: (state, info = {}) => {
			storage.local.set('userinfo', info)
			state.info = info
		},
		USER_MENUS: (state, menus = []) => {
			storage.local.set('usermenus', menus)
			state.menus = menus
			menus.length > 0 && router.addRoutes(menus)
		},
		USER_SESSIONID: (state, sessionId = '') => {
			storage.local.set('sessionId', sessionId)
			state.sessionId = sessionId
		}
	},
	actions: {
		login({ commit }, formData) {
			return api.auth.login(formData).then(({data}) => {
				commit('USER_SESSIONID', data.sessionId)
				commit('USER_INFO', data)
				return data
			})
		},
		logout() {
			return new Promise((resolve, reject) => {
        if (storage.local.get('sessionId')) {
          api.auth.logout().then(resolve, reject)
        } else {
          resolve()
        }
      }).finally(() => {
        storage.local.remove('sessionId')
        storage.local.remove('userinfo')
        location.replace(`${config.router.base}/login`)
      })
		},
		getUserMens({ commit }) {
			commit('USER_MENUS', userMenus)
		}
	}
}

export default user