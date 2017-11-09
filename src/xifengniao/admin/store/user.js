import { storage, utils } from 'assets/js/utils'
import { userMenus } from '../router/routes'
import api from '../api'
import router from '../router'

let _cache = {
	userMenus: storage.local.get('usermenus')
}
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
		},
		USER_SESSIONID: (state, sessionId = '') => {
			storage.local.set('sessionId', sessionId)
			state.sessionId = sessionId
		}
	},
	actions: {
		login({ commit }, formData) {
			return api.auth.login(formData).then(({data}) => {
				let { roleId, roleName, userName, realName, sessionId } = data
				_cache.userMenus = data.menus
				commit('USER_SESSIONID', sessionId)
				commit('USER_INFO', { roleId, roleName, userName, realName })
				return data
			})
		},
		logout({ commit }, toLogin = true) {
			return new Promise((resolve, reject) => {
        if (storage.local.get('sessionId')) {
          api.auth.logout().then(resolve, reject)
        } else {
          resolve()
        }
      }).finally(() => {
        storage.local.remove('sessionId')
        storage.local.remove('usermenus')
        storage.local.remove('userinfo')
        toLogin && location.replace(`${router.options.base}/login`)
      })
		},
		getUserMenus({ commit }) {
			// router.addRoutes(userMenus)
			commit('USER_MENUS', _cache.userMenus)
		}
	}
}

export default user