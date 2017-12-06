import config from './config'
import axios from 'axios'
import { storage, utils } from 'assets/js/utils'
import store from './store'

const service = axios.create({
  baseURL: config.api.baseURL,
  timeout: 60000
})

// request拦截器
service.interceptors.request.use(config => {
  // Do something before request is sent
  let userinfo = storage.local.get('seller_userinfo')
  config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
  config.headers['token'] = userinfo && userinfo.token ? userinfo.token : ''
  config.headers['uid'] = userinfo && userinfo.id ? userinfo.id : ''
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
    switch (error.response.status) {
      case 400:
        err.message = '请求错误'
        break
      case 401:
        store.dispatch('logout', false)
        err.message = '未授权，请登录'
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
    if(error.response.data.msg) {
      err.message = error.response.data.msg 
    }
    err.message += `(${error.response.status})`
  }
  return Promise.reject(err)
})

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
        if(error && error.message) {
        	window.f7.alert(error.message)
        }
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
  wxpay(payConfig) {
  	let promise = new Promise((resolve, reject) => {
      let onBridgeReady = function(){
        WeixinJSBridge.invoke('getBrandWCPayRequest', payConfig, res => {
          console.log(res)
          if (res.err_msg === 'get_brand_wcpay_request:ok') {
            resolve('ok')
          } else if (res.err_msg === 'get_brand_wcpay_request:cancel') {
            reject('cancel')
          } else if (res.err_msg === 'get_brand_wcpay_request:fail') {
            // mui.alert('支付失败，如有疑问请联系客服')
            reject('fail')
          } else {
            reject(res)
          }
        })
      }

      if (typeof WeixinJSBridge == 'undefined') {
        document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false)
      } else {
        onBridgeReady()
      }
    })

    return promise
  },
  auth: {
  	grant(url = location.href) {
  		window.location.replace(config.api.baseURL + '/wechat/login?scopes=base&url=' + url)
  	},
    check() {
      let userinfo = storage.local.get('seller_userinfo')
      return (userinfo && userinfo.token && userinfo.id)
    },
    login(formData = {}) {
      return new Promise((resolve, reject) => {
      	fetch.post('/user/login', {
          type: 'password',
      		username: formData.username,
      		password: formData.password
      	}).then(({data}) => {
      		storage.local.set('seller_userinfo', data)
      		if(data.open_id){
      			resolve(data)
      		}else{
      			// 绑定微信信息
      			let wxInfo = {
      				open_id: formData.open_id,
      				nickname: formData.nickname,
      				thumb: formData.thumb
      			}
      			fetch.post('/user/bind_wechat', wxInfo).then(_ => {
      				resolve(Object.assign(data, wxInfo))
      			}).catch(reject)
      		}
      	}).catch(reject)
      })
    },
    logout(remote = false) {
      return new Promise((resolve, reject) => {
        if (!remote && this.check()) {
          fetch.post('/user/logout').then(resolve, reject)
        } else {
          resolve()
        }
      })
    }
  },

  wallet: {
  	rechargeList() { // 充值次数列表
  		return fetch.post('/seller/order/recharge/list')
  	},
  	rechargeOrder(formData = {}){ // 创建充值订单
  		return fetch.post('/seller/order/create', formData)
  	},
    recordList(formData = {}, page = 1, rows = 10) { // 充值记录
      formData.per_page = rows
      formData.page_number = page - 1      
      return fetch.post('/seller/order/list/recharge', formData).then(({data}) => {
        data.total = data.count
        data.page = page
        data.rows = rows
        data.sum = (data.sum / 100).toFixed(2)
        return data
      })
    },
    remindList() { // 充值提醒列表
      return fetch.post('/seller/recharge/alter_check')
    }
  },

  device: {
    getList(formData = {}, page = 1, rows = 10) {
      formData.per_page = rows
      formData.page_number = page - 1      
      return fetch.post('/seller/device/list', formData).then(({data}) => {
        data.total = data.count
        data.page = page
        data.rows = rows
        return data
      })
    },
    remindList() { // 设备提醒
      return fetch.post('/seller/device/alter_list')
    }
  }
}

export default api