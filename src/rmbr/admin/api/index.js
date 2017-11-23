import config from '../config'
import createService from './axios'
import { storage, utils } from 'assets/js/utils'
import { Message } from 'element-ui'
import { mockFetch } from '../mock'

// 创建axios实例
const service = createService()

const fetch = {
  ajax(url = '', data = {}, method = 'GET', contentType = 'form') {
    return new Promise((resolve, reject) => {
      Object.keys(data).forEach(key => {
        if( data[key] === null || data[key] === undefined || data[key] === '') {
          delete data[key]
        }
      })
      service({
        url, method, data
      }).then(resolve).catch(error => {
        error && error.message && Message({
          type: 'error',
          message: error.message
        })
        reject(error)
      })
    })
  },
  get(url, data) {
    return this.ajax(url, data)
  },
  post(url, data) {
    return this.ajax(url, data, 'POST')
  }
}

const api = {
  baseURL: config.api.baseURL,
  auth: {
    check() {
      let userinfo = storage.local.get('userinfo')
      return (userinfo && userinfo.token && userinfo.id)
    },
    login(formData = {}) {
      formData.type = 'password'
      return fetch.post('/login', formData)
    },
    logout(toLogin = true) {
      return new Promise((resolve, reject) => {
        let userinfo = storage.local.get('userinfo')
        if (this.check()) {
          fetch.post('/logout').then(resolve, reject)
        } else {
          resolve()
        }
      }).finally(() => {
        storage.local.remove('userinfo')
        storage.local.remove('usermenus')
        toLogin && location.replace(`${config.router.base}/login?to=` + location.href)
      })
    }
  },
  sys: { // 系统管理
    getList(formData = {}, page = 1, row = 20) {
      formData.per_page = row
      formData.page_number = page - 1      
      return fetch.post('/role/list', formData)
    },
    add(formData = {}) {
      return fetch.post('/role/add', formData)
    },
    del(user_id = '') {
      return fetch.post('/role/delete', { user_id })
    },
    getPermission() {
      return fetch.post('/permission/list')
    }
  },
  business: { // 商户管理
    getList(formData = {}, page = 1, row = 20) {
      formData.per_page = row
      formData.page_number = page - 1      
      return fetch.post('/seller/list', formData)
    },
    add(formData = {}) {
      if(!formData.seller_id) {
        return fetch.post('/seller/add', formData)  
      }else {
        return fetch.post('/seller/update', formData)
      }
    }
  },
  device: { // 设备管理
    getList(formData = {}, page = 1, row = 20) {
      formData.per_page = row
      formData.page_number = page - 1      
      return mockFetch.post('/device/list', formData)
    }
  }
}

export default api
