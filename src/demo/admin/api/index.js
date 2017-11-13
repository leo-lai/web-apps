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
  config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
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
  const data = response.data
  switch(data.resultCode) {
  	case 200:
  		return data
  	case 4002:
  		storage.local.remove('sessionId')
  		Message({
        type: 'error',
        message: data.message || '登录失效，请重新登录。',
        onClose(instance) {
          api.auth.logout()
        }
      })
      break
  }
  return Promise.reject(data)
}, error => {
  if (error && error.response) {
    switch (error.response.status) {
      case 400:
        error.message = '请求错误'
        break
      case 401:
        error.message = '未授权，请登录'
        break
      case 403:
        error.message = '拒绝访问'
        break
      case 404:
        error.message = `请求地址出错: ${error.response.config.url}`
        break
      case 408:
        error.message = '请求超时'
        break
      case 500:
        error.message = '服务器内部错误'
        break
      case 501:
        error.message = '服务未实现'
        break
      case 502:
        error.message = '网关错误'
        break
      case 503:
        error.message = '服务不可用'
        break
      case 504:
        error.message = '网关超时'
        break
      case 505:
        error.message = 'HTTP版本不受支持'
        break
      default:
      	error.message = '服务器连接失败'
    }
    error.message += `({$error.response.status})`
  }
  return Promise.reject(error)
})

const fetch = {
  ajax(url = '', data = {}, method = 'GET', contentType = 'form') {
    data.sessionId = storage.local.get('sessionId')
    return new Promise((resolve, reject) => {
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
      return !!storage.local.get('sessionId')
    },
    login(formData = {}) {
      formData.userName = (formData.userName || '').trim()
      return fetch.post('/login', formData)
    },
    logout() {
      return fetch.post('/loginOut')
    }
  }
}

export default api
