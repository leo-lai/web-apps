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
  		Message({
        type: 'error',
        message: data.message || '登录失效，请重新登录',
        onClose() {
          api.auth.logout()
        }
      })
      break
    default:
      data.message = data.message || '服务器接口出错'
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
    error.message += ` - ${error.response.status}`
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
  post(url, data) {
    return this.ajax(url, data, 'POST')
  }
}

const api = {
  baseURL: config.api.baseURL,
  pageSizes: [100, 200, 300, 400],
  auth: {
    check() {
      return !!storage.local.get('sessionId')
    },
    login(formData = {}) {
      formData.userName = (formData.userName || '').trim()
      return fetch.post('/login', formData)
    },
    logout(toLogin = true) {
      return new Promise((resolve, reject) => {
        if (storage.local.get('sessionId')) {
          fetch.post('/loginOut').then(resolve, reject)
        } else {
          resolve()
        }
      }).finally(_ => {
        storage.local.remove('sessionId')
        storage.local.remove('usermenus')
        storage.local.remove('userinfo')
        toLogin && location.replace(`${config.router.base}/login?to=` + location.href)
      })
    },
    changePwd(formData = {}) {
      return fetch.post('/changePassword', formData)
    },
    getZuzhiList() {
      return fetch.post('/organizationLevelList')
    },
    getRoleList() {
      return fetch.post('/roleListList')
    }
  },
  zuzhi: { // 组织架构管理
    getList(formData = {}, page = 1, rows = 100) {
      formData.page = page
      formData.rows = rows
      return fetch.post('/organizationList', formData)
    },
    getParent(orgLevel = 0) {
      return fetch.post('/organizationLevelListByLevel', { orgLevel })
    },
    getInfo(orgId = '') {
      return fetch.post('/organizationInfo', { orgId })
    },
    enable(orgId = '', isOn = '') {
      return fetch.post('/organizationOnOff', {orgId, isOn})
    },
    add(formData = {}) {
      return fetch.post('/organizationEdit', formData)
    },
    getCangList() { // 仓库列表
      return fetch.post('/organizationWarehouseList')
    }
  },
  user: { // 系统用户管理
    getList(formData = {}, page = 1, rows = 100) {
      formData.page = page
      formData.rows = rows
      return fetch.post('/userList', formData)
    },
    enable(userId = '', isEnable = '') {
      return fetch.post('/userIsEnable', {userId, isEnable})
    },
    add(formData = {}) {
      return fetch.post('/addUser', formData)
    },
    getSalesList(formData = {}) {
      return fetch.post('/salesList', formData)
    }
  },
  role: { // 角色管理
    getList(formData = {}, page = 1, rows = 100) {
      formData.page = page
      formData.rows = rows
      return fetch.post('/roleList', formData)
    },
    add(formData = {}) {
      return fetch.post('/roleEdit', formData)
    },
    getMenuList(roleId = '') {
      return fetch.post('/menuListTree', { roleId })
    },
    setRoleMenu(formData = {}) {
      return fetch.post('/setRoleMenu', formData)
    }
  },
  menu: {
    add(formData = {}) {
      return fetch.post('/editMenu', formData)
    },
    del(menuId = '') {
      return fetch.post('/deleteMenu', { menuId })
    }
  },
  supplier: { // 供应商管理
    getList(formData = {}, page = 1, rows = 100) {
      formData.page = page
      formData.rows = rows
      return fetch.post('/supplierList', formData)
    },
    add(formData = {}) {
      return fetch.post('/supplierEdit', formData)
    },
    del(supplierId = '') {
      return fetch.post('/supplierDelete', { supplierId })
    },
    getListDown() {
      return fetch.post('/supplierListList')
    }
  },
  car: { // 车型管理
    getList(formData = {}, page = 1, rows = 100) {
      formData.page = page
      formData.rows = rows
      return fetch.post('/carsList', formData)
    },
    add(formData = {}) {
      return fetch.post('/carsEdit', formData)
    },
    del(carId = '') {
      return fetch.post('/carsDelete', { carId })
    },
    getBrandList() { // 品牌列表
      return fetch.post('/carsBrandList')
    },
    getFamilyList(brandId = '') { // 车系列表
      return fetch.post('/carsFamilyList', { brandId })
    },
    getStyleList(familyId = '') { // 车等级列表
      return fetch.post('/carsStyleList', { familyId })
    },
    getCarsList(familyId = '') { // 车大类列表
      return fetch.post('/carsListList', { familyId })
    },
    getCarsInfo(carId = '') { // 车大类相关信息
      return fetch.post('/carsInfo', { carId })
    }
  },
  color: { // 车身颜色内饰管理
    getList(formData = {}, page = 1, rows = 100) { // 车系列表(分页)
      formData.page = page
      formData.rows = rows
      return fetch.post('/carsFamilyListPage', formData)
    },
    getCheshenList(familyId = '') { // 获取车身颜色列表
      return fetch.post('/carColourGetByBrand', { familyId })
    },
    addCheshen(formData = {}) {
      return fetch.post('/carColourEdit', formData)
    },
    delCheshen(carColourId = '') {
      return fetch.post('/carColourDelete', { carColourId })
    },
    getNeishiList(familyId = '') { // 获取内饰颜色列表
      return fetch.post('/carInteriorGetByBrand', { familyId })
    },
    addNeishi(formData = {}) {
      return fetch.post('/carInteriorEdit', formData)
    },
    delNeishi(interiorId = '') {
      return fetch.post('/carInteriorDelete', { interiorId })
    },
    addImages(formData = {}) {
      return fetch.post('/carColourImageAdd', formData)
    },
    getImages(carsId = '',  carColourId = '') { // 获取车身照片
      return fetch.post('/carColourImageGetByCarColour', { carsId, carColourId })
    }
  },
  customer: { // 客户管理
    getList(formData = {}, page = 1, rows = 100) {
      formData.page = page
      formData.rows = rows
      return fetch.post('/customerOrgList', formData)
    },
    add(formData = {}) { // 新增客户
      return fetch.post('/addCustomerUsersr', formData)
    }, // 跟踪列表
    getTrackList(formData = {}, page = 1, rows = 100) {
      formData.page = page
      formData.rows = rows
      return fetch.post('/trackCustomerOrgList', formData)
    }, // 预约列表
    getBespeakList(formData = {}, page = 1, rows = 100) {
      formData.page = page
      formData.rows = rows
      return fetch.post('/bespeakCustomerOrgList', formData)
    }
  },
  stock: { // 库存管理
    getList(formData = {}, page = 1, rows = 100) { // 车辆库存列表
      formData.page = page
      formData.rows = rows
      return fetch.post('/stockCarList', formData)
    },
    getInfo(formData = {}){ // 车辆库存详情
      return fetch.post('/stockCarInfo', formData)
    },
    editInfo(formData = {}) { // 编辑车辆库存详情
      return fetch.post('/stockCarEdit', formData)
    },
    getInList(formData = {}, page = 1, rows = 100) { // 入库单列表
      formData.page = page
      formData.rows = rows
      return fetch.post('/storageList', formData)
    },
    addIn(formData = {}) { // 新增入库单
      return fetch.post('/storageEdit', formData)
    },
    delIn(stockCarId = '') {
      return fetch.post('/storageCarDelete', { stockCarId })
    },
    getInInfo(storageId = '') { // 入库单详情
      return fetch.post('/storageInfo', { storageId })
    },
    getInCarList(formData = {}, page = 1, rows = 100) {
      formData.page = page
      formData.rows = rows
      return fetch.post('/storageCarList', formData)
    },
    addInCar(formData = {}) { // 新增入库车辆
      return fetch.post('/storageCarEdit', formData)
    },
    getOrderList(formData = {}, page = 1, rows = 100) { // 订车列表
      formData.page = page
      formData.rows = rows
      return fetch.post('/stockOrderList', formData)
    },
    addOrder(formData = {}) { // 新增订车单
      return fetch.post('/stockOrderCreate', formData)
    },
    cancelOrder(stockOrderId = '') { // 取消订车单
      return fetch.post('/stockOrderCancel', { stockOrderId })
    },
    getOrderInfo(stockOrderId = '', isSellList = 0) { // 获取订车单详情
      return fetch.post('/stockOrderInfo', { stockOrderId, isSellList })
    },
    signOrder(stockOrderId = '') {
      return fetch.post('/stockOrderSign', { stockOrderId })
    }
  },
  pay: { // 通联支付
    orderPay(formData = {}) {
      return fetch.post('/stockOrderPay', formData)
    }
  }
}

export default api
