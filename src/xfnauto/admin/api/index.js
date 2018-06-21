import config from '../config'
import axios from 'axios'
import { storage, utils } from 'assets/js/utils'
import { Message } from 'element-ui'
import router from '../router'

let baseURL1 = config.api.baseURL1
let baseURL2 = config.api.baseURL2
// 创建axios实例
const service = axios.create({
  baseURL: config.api.baseURL1,
  timeout: 60000
})
// request拦截器
service.interceptors.request.use(config => {
  // Do something before request is sent
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
          storage.local.remove('sessionId')
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
  ajax(url = '', data = {}, method = 'GET') {
    data.sessionId = storage.local.get('sessionId')
    return new Promise((resolve, reject) => {
      let ajaxParams = {
        url, method
      }
      switch (method) {
        case 'POST':
          ajaxParams.data = data
          ajaxParams.headers = {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
          ajaxParams.transformRequest = [function (data) {
            let ret = []
            for (let key in data) {
              ret.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
            }
            return ret.join('&')
          }]
          break
        default:
          ajaxParams.params = data
          break
      }
      service(ajaxParams).then(resolve).catch(error => {
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
  },
  form(url, formData) { // 自定义表单数据
    formData && formData.append('sessionId', storage.local.get('sessionId'))
    return new Promise((resolve, reject) => {
      service({
        url,
        method: 'post',
        data: formData
      }).then(resolve).catch(error => {
        error && error.message && Message({
          type: 'error',
          message: error.message
        })
        reject(error)
      })
    })
  }
}

const api = {
  baseURL: config.api.baseURL1,
  pageSizes: [10, 20, 50, 100, 200, 500],
  uploadBase64(base64Data = '') {
    return fetch.post(baseURL1 + '/uploadImageBase64', {
      img_file: base64Data
    })
  },
  uploadByBase64(base64Data = '') {
    var formData = new FormData()
    //convertBase64UrlToBlob函数是将base64编码转换为Blob  
    formData.append('img_file', utils.convert.base64ToBlob(base64Data), 'image_' + Date.now() + '.png')
    return fetch.form(baseURL1 + '/uploadImage', formData)
  },
  auth: {
    check() {
      return !!storage.local.get('sessionId')
    },
    login(formData = {}) {
      formData.userName = (formData.userName || '').trim()
      return fetch.post(baseURL2 + '/backend_v2/login', formData)
      // return fetch.post(baseURL1 + '/login', formData)
    },
    logout(toLogin = true) {
      // return new Promise((resolve, reject) => {
      //   if (storage.local.get('sessionId')) {
      //     fetch.post(baseURL1 + '/loginOut').then(resolve, reject)
      //   } else {
      //     resolve()
      //   }
      // }).finally(_ => {
        storage.local.remove('sessionId')
        storage.local.remove('usermenus')
        storage.local.remove('userinfo')
        toLogin && location.replace(window.location.origin + `${config.router.base}login?to=` + location.href)
        // toLogin && router.replace(`/login?to=` + location.href)
      // })
    },
    changePwd(formData = {}) {
      return fetch.post(baseURL1 + '/changePassword', formData)
    },
    getZuzhiList() {
      return fetch.ajax(baseURL2 + '/backend_v2/organization/getorg')
    },
    getRoleList() {
      return fetch.post(baseURL1 + '/roleListList')
    }
  },
  index: {
    getCount() {
      return fetch.post(baseURL1 + '/index')
    },
    getUserInfo() {
      return fetch.ajax(baseURL2 + '/backend_v2/systemuser/info')
    }
  },
  zuzhi: { // 组织架构管理
    // getList(formData = {}, page = 1, rows = 20) {
    //   formData.page = page
    //   formData.rows = rows
    //   return fetch.post(baseURL1 + '/organizationList', formData)
    // },
    getList(formData = {}, page = 1, rows = 20) {
      formData.page = page
      formData.rows = rows
      return fetch.ajax(baseURL2 + '/backend_v2/organization/index', formData)
    },
    getParent(orgLevel = 0) {
      return fetch.post(baseURL1 + '/organizationLevelListByLevel', { orgLevel })
    },
    // getInfo(orgId = '') {
    //   return fetch.post(baseURL1 + '/organizationInfo', { orgId })
    // },
    getInfo(id = '') {
      return fetch.ajax(baseURL2 + '/backend_v2/organization/detail', { id })
    },
    // enable(orgId = '', isOn = '') {
    //   return fetch.post(baseURL1 + '/organizationOnOff', {orgId, isOn})
    // },
    enable(orgId = '') {
      return fetch.ajax(baseURL2 + '/backend_v2/organization/remove', { id: orgId })
    },
    // add(formData = {}) {
    //   return fetch.post(baseURL1 + '/organizationEdit', formData)
    // },
    add(formData = {}) {
      return fetch.post(baseURL2 + '/backend_v2/organization/create', formData)
    },
    edit(formData = {}) {
      return fetch.post(baseURL2 + '/backend_v2/organization/edit', formData)
    },
    getCangList() { // 仓库列表
      return fetch.post(baseURL1 + '/organizationWarehouseList')
    }
  },
  cang: { // 仓库管理
    getList(formData = {}, page = 1, rows = 20) {
      formData.page = page
      formData.rows = rows
      return fetch.ajax(baseURL2 + '/backend_v2/stocklist', formData)
    },
    add(formData = {}) {
      return fetch.post(baseURL2 + '/backend_v2/createstock', formData)
    },
    edit(formData = {}) {
      return fetch.post(baseURL2 + '/backend_v2/editstock', formData)
    },
    del(id ='') {
      return fetch.ajax(baseURL2 + '/backend_v2/removestock', { id })
    },
  },
  user: { // 系统用户管理
    // getList(formData = {}, page = 1, rows = 20) {
    //   formData.page = page
    //   formData.rows = rows
    //   return fetch.post(baseURL1 + '/userList', formData)
    // },
    getList(formData = {}, page = 1, rows = 20) {
      formData.page = page
      formData.rows = rows
      return fetch.ajax(baseURL2 + '/backend_v2/systemuser/index', formData)
    },
    getInfo(id = '') {
      return fetch.ajax(baseURL2 + '/backend_v2/systemuser/detail', { id })
    },
    // enable(userId = '', isEnable = '') {
    //   return fetch.post(baseURL1 + '/userIsEnable', {userId, isEnable})
    // },
    enable(id = '', status) {
      return fetch.ajax(baseURL2 + '/backend_v2/systemuser/remove', { id, act: status })
    },
    // add_bak(formData = {}) {
    //   return fetch.post(baseURL1 + '/addUser', formData)
    // },
    add(formData = {}) {
      return fetch.post(baseURL2 + '/backend_v2/systemuser/create', formData)
    },
    edit(formData = {}) {
      return fetch.post(baseURL2 + '/backend_v2/systemuser/edit', formData)
    },
    getSalesList(formData = {}) {
      return fetch.post(baseURL1 + '/salesList', formData)
    },
    getParentList(orgId = '', id = '') { // 上级主管列表
      return fetch.ajax(baseURL2 + '/backend_v2/systemuser/higherups', { orgId, id })
    },
  },
  role: { // 角色管理
    // getList(formData = {}, page = 1, rows = 20) {
    //   formData.page = page
    //   formData.rows = rows
    //   return fetch.post(baseURL1 + '/roleList', formData)
    // },
    getList(formData = {}, page = 1, rows = 20) {
      formData.page = page
      formData.rows = rows
      return fetch.ajax(baseURL2 + '/backend_v2/role/index', formData)
    },
    getDownList(orgId = '') { // 角色列表(下拉)
      return fetch.ajax(baseURL2 + '/backend_v2/role/list', { orgId })
    },
    add(formData = {}) {
      return fetch.post(baseURL2 + '/backend_v2/role/create', formData)
    },
    edit(formData = {}) {
      return fetch.post(baseURL2 + '/backend_v2/role/edit', formData)
    },
    del(roleId = '') {
      return fetch.ajax(baseURL2 + '/backend_v2/role/remove', { roleId })
    },
    // getMenuList(roleId = '') {
    //   return fetch.post(baseURL1 + '/menuListTree', { roleId })
    // },
    getMenuList(id = '') { // 根据角色返回当前菜单
      return fetch.ajax(baseURL2 + '/backend_v2/roleaccess/index', { id })
    },
    // setRoleMenu(formData = {}) {
    //   return fetch.post(baseURL1 + '/setRoleMenu', formData)
    // },
    setMenuList(formData = {}) {
      return fetch.post(baseURL2 + '/backend_v2/roleaccess/addauth', formData)
    }
  },
  group: { // 分组管理
    getList(formData = {}, page = 1, rows = 20) {
      formData.page = page
      formData.rows = rows
      return fetch.post(baseURL1 + '/systemGroupingList', formData)
    },
    add(formData = {}) {
      return fetch.post(baseURL1 + '/systemGroupingEdit', formData)
    },
    del(groupingId = '') { // 删除分组
      return fetch.post(baseURL1 + '/systemGroupingDalete', { groupingId })
    },
    getUserList(groupingId = '') { // 已分配人员列表
      return fetch.post(baseURL1 + '/systemUserGroupingList', { groupingId })
    },
    getSltUserList() { // 待分配人员列表
      return fetch.post(baseURL1 + '/orgOneSelfList')
    },
    addUser(formData = {}) { // 添加人员
      return fetch.post(baseURL1 + '/systemUserGroupingEdit', formData)
    },
    delUser(userGroupingId = '') { // 删除人员
      return fetch.post(baseURL1 + '/systemUserGroupingDalete', { userGroupingId })
    }
  },
  menu: {
    getList() { // orgLevel = 1 返回所有菜单
      return fetch.ajax(baseURL2 + '/backend_v2/menu/index')
    },
    // add(formData = {}) {
    //   return fetch.post(baseURL1 + '/editMenu', formData)
    // },
    add(formData = {}) {
      return fetch.post(baseURL2 + '/backend_v2/menu/create', formData)
    },
    edit(formData = {}) {
      return fetch.post(baseURL2 + '/backend_v2/menu/edit', formData)
    },
    del(menuId = '') {
      return fetch.ajax(baseURL2 + '/backend_v2/menu/remove', { menuId })
    },
  },
  supplier: { // 供应商管理
    // getList(formData = {}, page = 1, rows = 20) {
    //   formData.page = page
    //   formData.rows = rows
    //   return fetch.post(baseURL1 + '/supplierList', formData)
    // },
    getList(formData = {}, page = 1, rows = 20) {
      formData.page = page
      formData.rows = rows
      return fetch.ajax(baseURL2 + '/backend_v2/supplier', formData)
    },
    // add(formData = {}) {
    //   return fetch.post(baseURL1 + '/supplierEdit', formData)
    // },
    add(formData = {}) {
      formData.id = formData.supplierId
      return fetch.post(baseURL2 + '/backend_v2/supplier/create', formData)
    },
    // del(supplierId = '') {
    //   return fetch.post(baseURL1 + '/supplierDelete', { supplierId })
    // },
    del(supplierId = '') {
      return fetch.ajax(baseURL2 + '/backend_v2/supplier/remove', { id: supplierId })
    },
    getListDown() {
      return fetch.post(baseURL1 + '/supplierListList')
    }
  },
  car: { // 车型管理
    // getList(formData = {}, page = 1, rows = 20) {
    //   formData.page = page
    //   formData.rows = rows
    //   return fetch.post(baseURL1 + '/carsList', formData)
    // },
    getList(formData = {}, page = 1, rows = 20) {
      formData.page = page
      formData.rows = rows
      return fetch.ajax(baseURL2 + '/backend_v2/car', formData)
    },
    add(formData = {}) {
      return fetch.post(baseURL1 + '/carsEdit', formData)
    },
    del(carId = '') {
      return fetch.post(baseURL1 + '/carsDelete', { carId })
    },
    // getBrandList() { // 品牌列表
    //   return fetch.post(baseURL1 + '/carsBrandList')
    // },
    getBrandList() { // 品牌列表
      return fetch.ajax(baseURL2 + '/backend_v2/brand')
    },
    getFamilyList(brandId = '') { // 车系列表
      return fetch.post(baseURL1 + '/carsFamilyList', { brandId })
    },
    getStyleList(familyId = '') { // 车等级列表
      return fetch.post(baseURL1 + '/carsStyleList', { familyId })
    },
    getCarsList(familyId = '') { // 车大类列表
      return fetch.post(baseURL1 + '/carsListList', { familyId })
    },
    getCarsInfo(carId = '') { // 车大类相关信息
      return fetch.post(baseURL1 + '/carsInfo', { carId })
    },
    getDepositPrice(formData = {}) { // 获取车辆定金
      return fetch.post(baseURL1 + '/carDepositPrice', formData)
    }
  },
  color: { // 车身颜色内饰管理
    // getList(formData = {}, page = 1, rows = 20) { // 车系列表(分页)
    //   formData.page = page
    //   formData.rows = rows
    //   return fetch.post(baseURL1 + '/carsFamilyListPage', formData)
    // },
    getList(formData = {}, page = 1, rows = 20) { // 车系列表(分页)
      formData.page = page
      formData.rows = rows
      return fetch.ajax(baseURL2 + '/backend_v2/car/family', formData)
    },
    getCheshenList(familyId = '') { // 获取车身颜色列表
      return fetch.post(baseURL1 + '/carColourGetByBrand', { familyId })
    },
    addCheshen(formData = {}) {
      return fetch.post(baseURL1 + '/carColourEdit', formData)
    },
    delCheshen(carColourId = '') {
      return fetch.post(baseURL1 + '/carColourDelete', { carColourId })
    },
    getNeishiList(familyId = '') { // 获取内饰颜色列表
      return fetch.post(baseURL1 + '/carInteriorGetByBrand', { familyId })
    },
    addNeishi(formData = {}) {
      return fetch.post(baseURL1 + '/carInteriorEdit', formData)
    },
    delNeishi(interiorId = '') {
      return fetch.post(baseURL1 + '/carInteriorDelete', { interiorId })
    },
    addImages(formData = {}) {
      return fetch.post(baseURL1 + '/carColourImageAdd', formData)
    },
    getImages(carsId = '',  carColourId = '') { // 获取车身照片
      return fetch.post(baseURL1 + '/carColourImageGetByCarColour', { carsId, carColourId })
    }
  },
  customer: { // 客户管理
    getList(formData = {}, page = 1, rows = 20) {
      formData.page = page
      formData.rows = rows
      return fetch.post(baseURL1 + '/customerOrgList', formData)
    },
    getInfo(formData = {}) {
      return fetch.post(baseURL1 + '/customerUsersrInfo', formData)
    },
    saveUserInfo(formData = {}) {
      return fetch.post(baseURL1 + '/changeUserInfo', formData)
    },
    saveCarInfo(formData = {}) {
      return fetch.post(baseURL1 + '/changeUserCarInfo', formData)
    },
    addOrder(formData = {}) { // 新增/编辑
      return fetch.post(baseURL1 + '/editCustomerOrder', formData)
    },
    // getOrderList(formData = {}, page = 1, rows = 20) { // 客户订单列表
    //   formData.page = page
    //   formData.rows = rows
    //   return fetch.post(baseURL1 + '/customerOrderList', formData)
    // },
    getOrderList(formData = {}, page = 1, rows = 20) { // 客户订单列表
      formData.page = page
      formData.rows = rows
      return fetch.ajax(baseURL2 + '/backend_v2/customer', formData)
    },
    // getOrderInfo(customerOrderId = '') { // 获取订单详情
    //   return fetch.post(baseURL1 + '/customerOrderInfo', { customerOrderId })
    // },
    getOrderInfo(customerOrderId = '') { // 获取订单详情
      return fetch.ajax(baseURL2 + '/backend_v2/customer/detail', { customerOrderId })
    },
    getContractInfo(customerOrderId = '') { // 合同信息
      // return fetch.post(baseURL1 + '/customerOrderPrint', { customerOrderId })
      return fetch.ajax(baseURL2 + '/backend_v2/customer/detail', { customerOrderId })
    },
    // payOrder(formData = {}) { // 支付定金
    //   return fetch.post(baseURL1 + '/payInOrder', formData)
    // },
    pay(formData = {}) { // 收定金或尾款
      return fetch.post(baseURL2 + '/backend_v2/customer/pay', formData)
    },
    orderPrice(customerOrderId = '') { // 订单费用
      return fetch.post(baseURL1 + '/orderPriceList', { customerOrderId })
    },
    payHistory(customerOrderId = '') { // 收款历史
      return fetch.post(baseURL1 + '/orderPayList', { customerOrderId })
    },
    bankPass(customerOrderId = '') { // 银行审核通过
      return fetch.post(baseURL1 + '/bankApprovalPass', { customerOrderId })
    },
    fullPay(customerOrderId = '') { // 银行审核不通过，改成全款支付尾款
      return fetch.post(baseURL1 + '/changeFullPayment', { customerOrderId })
    },
    giveCar(formData = {}) {
      return fetch.post(baseURL1 + '/turnOverVehicle', formData)
    },
    saveRemark(formData = {}) {
      return fetch.post(baseURL1 + '/addCustomerRemarks', formData)
    },
    add(formData = {}) { // 新增客户
      return fetch.post(baseURL1 + '/addCustomerUsersr', formData)
    }, // 跟踪列表
    getTrackList(formData = {}, page = 1, rows = 20) {
      formData.page = page
      formData.rows = rows
      return fetch.post(baseURL1 + '/trackCustomerOrgList', formData)
    }, // 预约列表
    getBespeakList(formData = {}, page = 1, rows = 20) {
      formData.page = page
      formData.rows = rows
      return fetch.post(baseURL1 + '/bespeakCustomerOrgList', formData)
    },
    // notBuy(customerUsersOrgId = '') { // 标记为不购买
    //   return fetch.post(baseURL1 + '/notBuyCustomerOrg', { customerUsersOrgId })
    // },
    // track(formData = {}) { // 标记为已到店
    //   return fetch.post(baseURL1 + '/systenUserChangeCustomerOrg', formData)
    // }
  },
  stock: { // 库存管理
    toExcel(formData = {}) {
      return fetch.ajax(baseURL2 + '/backend_v2/stock/export', formData) 
    },
    // getList(formData = {}, page = 1, rows = 20) { // 车辆库存列表
    //   formData.page = page
    //   formData.rows = rows
    //   return fetch.post(baseURL1 + '/stockCarList', formData)
    // },
    getList(formData = {}, page = 1, rows = 20) {
      formData.page = page
      formData.rows = rows
      return fetch.ajax(baseURL2 + '/backend_v2/stock', formData) 
    },
    // getInfo(formData = {}){ // 车辆库存详情
    //   return fetch.post(baseURL1 + '/stockCarInfo', formData)
    // },
    getInfo(id = '') {
      return fetch.ajax(baseURL2 + '/backend_v2/stock/detail', { id })
    },
    // editInfo(formData = {}) { // 编辑车辆库存详情
    //   return fetch.post(baseURL1 + '/stockCarEdit', formData)
    // },
    editInfo(formData = {}) {
      return fetch.post(baseURL2 + '/backend_v2/stock/edit', formData)
    },
    getInList(formData = {}, page = 1, rows = 20) { // 入库单列表
      formData.page = page
      formData.rows = rows
      return fetch.post(baseURL1 + '/storageList', formData)
    },
    addIn(formData = {}) { // 新增入库单
      return fetch.post(baseURL1 + '/storageEdit', formData)
    },
    delIn(stockCarId = '') {
      return fetch.post(baseURL1 + '/storageCarDelete', { stockCarId })
    },
    getInInfo(storageId = '') { // 入库单详情
      return fetch.post(baseURL1 + '/storageInfo', { storageId })
    },
    getInCarList(formData = {}, page = 1, rows = 20) {
      formData.page = page
      formData.rows = rows
      return fetch.post(baseURL1 + '/storageCarList', formData)
    },
    addInCar(formData = {}) { // 新增入库车辆
      return fetch.post(baseURL1 + '/storageCarEdit', formData)
    },
    addOrder(formData = {}) { // 新增订车单
      return fetch.post(baseURL1 + '/stockOrderCreate', formData)
    },
    cancelOrder(stockOrderId = '') { // 取消订车单
      return fetch.post(baseURL1 + '/stockOrderCancel', { stockOrderId })
    },
    getOrderInfo(stockOrderId = '', isSellList = 0) { // 获取订车单详情
      return fetch.post(baseURL1 + '/stockOrderInfo', { stockOrderId, isSellList })
    },
    signOrder(stockOrderId = '') {
      return fetch.post(baseURL1 + '/stockOrderSign', { stockOrderId })
    },
    noticeBefore(stockOrderId = '') { // 通知有车前信息
      return fetch.post(baseURL1 + '/stockOrderNoticeBefor', { stockOrderId })
    },
    notice(formData = {}) { // 通知有车
      return fetch.post(baseURL1 + '/stockOrderNotice', formData)
    },
    getOrderList(formData = {}, page = 1, rows = 20) { // 订车列表
      formData.page = page
      formData.rows = rows
      return fetch.post(baseURL1 + '/stockOrderList', formData)
    },
    outStockBefor(stockOrderId = '') { // 二级出库车辆前信息
      return fetch.post(baseURL1 + '/stockOrderStorageOutBefor', { stockOrderId })
    },
    outStock(formData = {}) { // 二级车辆出库
      return fetch.post(baseURL1 + '/stockOrderStorageOut', formData)
    },
    getOrderList2(formData = {}, page = 1, rows = 20) { // 三级车辆出库列表
      formData.page = page
      formData.rows = rows
      return fetch.post(baseURL1 + '/customerOrderList', formData)
    },
    outStockBefor2(customerOrderId = '') { // 三级出库车辆前信息
      return fetch.post(baseURL1 + '/customerOrderStorageOutBefor', { customerOrderId })
    },
    outStock2(formData = {}) { // 三级车辆出库
      return fetch.post(baseURL1 + '/customerOrderStorageOut', formData)
    }
  },
  order: { // 代购管理
    toExcel(formData = {}) {
      return fetch.ajax(baseURL2 + '/backend_v2/consumer/export', formData)
    },
    // getList(formData = {}, page = 1, rows = 20) { // 代购单列表
    //   formData.page = page
    //   formData.rows = rows
    //   return fetch.post(baseURL1 + '/ConsumerOrder/listOrders', formData)
    // },
    getList(formData = {}, page = 1, rows = 20) { // 资源订单列表
      formData.page = page
      formData.rows = rows
      return fetch.ajax(baseURL2 + '/backend_v2/consumer/index', formData)
    },
    getInfo(orderId = '') {
      return fetch.post(baseURL1 + '/ConsumerOrder/getOrderDetail', { orderId })
    },
    // getPayInfo(orderId = '') { // 获取支付信息
    //   return fetch.post(baseURL1 + '/ConsumerOrder/getPaymentInfo', { orderId })
    // },
    getPayInfo(orderId = '') { // 获取支付信息
      return fetch.ajax(baseURL2 + '/backend_v2/consumer/getpayinfo', { orderId })
    },
    // pay(formData = {}) { // 上传支付凭证
    //   return fetch.post(baseURL1 + '/ConsumerOrderPayment/create', formData)
    // },
    pay(formData = {}) { // 上传支付凭证
      return fetch.post(baseURL2 + '/backend_v2/consumer/pay', formData)
    },
    tickPic(formData = {}) { // 上传票证图片
      return fetch.post(baseURL1 + '/ConsumerOrderCar/uploadTickPic', formData)
    },
    tickDone(orderId = '') { // 所有上传票证图片
      return fetch.post(baseURL1 + '/ConsumerOrder/finishOrder', { orderId })
    },
    getContractInfo(id = '') { // 合同信息
      // return fetch.post(baseURL1 + '/ConsumerOrder/getContractInfo', { orderId })
      return fetch.ajax(baseURL2 + '/backend_v2/consumer/detail', { id })
    },
    refund(formData = {}) { // 退款
      return fetch.post(baseURL1 + '/ConsumerOrder/countermandExamine', formData)
    }
  },
  pay: { // 通联支付
    orderPay(formData = {}) {
      return fetch.post(baseURL1 + '/stockOrderPay', formData)
    },
    finish(customerOrderId = '') { // 完款交车
      return fetch.post(baseURL1 + '/endOrder', { customerOrderId })
    }
  },
  bank: {
    getList(formData = {}, page = 1, rows = 20) { // 审核列表
      formData.page = page
      formData.rows = rows
      return fetch.post(baseURL1 + '/bankToExamineOrderList', formData)
    },
    examine(formData = {}) { // 审核
      return fetch.post(baseURL1 + '/bankToExamineOrder', formData)
    }
  },
  school: { // 喜蜂鸟学堂
    getList(formData = {}, page = 1, rows = 20) { // 文章列表
      formData.page = page
      formData.rows = rows
      return fetch.ajax(baseURL2 + '/backend_v2/article/index', formData)
    },
    getInfo(id = '') { // 文章详情
      return fetch.ajax(baseURL2 + '/backend_v2/article/detail', { id })
    },
    add(formData = {}) { // 新增
      return fetch.post(baseURL2 + '/backend_v2/article/create', formData)
    },
    edit(formData = {}) { // 编辑
      return fetch.post(baseURL2 + '/backend_v2/article/edit', formData)
    },
    del(id = '') { // 删除
      return fetch.ajax(baseURL2 + '/backend_v2/article/remove', { id })
    },
    publish(id = '') { // 发布
      return fetch.ajax(baseURL2 + '/backend_v2/article/publish', { id })
    },
    getMsgList(formData = {}, page = 1, rows = 20) {
      formData.page = page
      formData.rows = rows
      return fetch.ajax(baseURL2 + '/backend_v2/note', formData)
    }
  },
}

export default api
