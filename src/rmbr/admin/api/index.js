import config from '../config'
import axios from 'axios'
import { storage, utils } from 'assets/js/utils'
import { Message } from 'element-ui'


// 创建axios实例
const service = axios.create({
  baseURL: config.api.baseURL,
  timeout: 60000
})
// request拦截器
service.interceptors.request.use(config => {
  // Do something before request is sent
  let userinfo = storage.local.get('userinfo')
  config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
  config.headers['token'] = userinfo && userinfo.token ? userinfo.token : ''
  // config.headers['uid'] = userinfo && userinfo.id ? userinfo.id : ''
  config.transformRequest = [function(data) {
    let ret = []
    for (let key in data) {
      ret.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
    }
    return ret.join('&')
  }]
  return config
}, error => {
  return Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(response => {
  let data = response.data
  switch(data.code) {
  	case 200:
  		return data
  }
  data.message = data.msg
  return Promise.reject(data)
}, error => {
  let err = { message: '' }
  if (error && error.response) {
    err.message = error.response.data.msg
    switch (error.response.status) {
      case 400:
        err.message = '请求错误'
        break
      case 401:
        Message({
          type: 'error',
          message: err.message || '未授权，请登录',
          onClose(instance) {
            api.auth.logout()
          }
        })
        break
      case 403:
        err.message = '拒绝访问'
        break
      case 404:
        err.message = `请求地址出错: ${error.response.config.url}`
        break
      case 408:
        err.message = '请求超时'
        break
      case 500:
        err.message = '服务器内部错误'
        break
      case 501:
        err.message = '服务未实现'
        break
      case 502:
        err.message = '网关错误'
        break
      case 503:
        err.message = '服务不可用'
        break
      case 504:
        err.message = '网关超时'
        break
      case 505:
        err.message = 'HTTP版本不受支持'
        break
      default:
      	err.message = '服务器连接失败'
    }
    err.message += `(${error.response.status})`
  }
  return Promise.reject(err)
})

const fetch = {
  ajax(url = '', data = {}, method = 'GET', contentType = 'form') {
    return new Promise((resolve, reject) => {
      let userinfo = storage.local.get('userinfo')
      data.uid = userinfo && userinfo.id ? userinfo.id : ''
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
  business: {
    getList(filterForm = {}, page = 0, row = 50) {
      filterForm.per_page = page
      filterForm.page_number = row
      return fetch.post('/seller/list', filterForm)
    }
  }
}

export default api
