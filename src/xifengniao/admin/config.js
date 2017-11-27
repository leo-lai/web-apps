let config = {
  router: {
    base: Object.is(process.env.NODE_ENV, 'production') ? '/' : '/admin'
  },
  api: {
    baseURL: 'http://111.230.170.36/tauto/management/admin'
  },
  pay: {
    url: 'http://ceshi.allinpay.com/gateway/index.do',
    dev: 'http://ceshi.allinpay.com/gateway/index.do',
    prod: 'https://service.allinpay.com/gateway/index.do'
  },
  baseData: {
    carTime: ['随车', '3天内', '7天内'],
    buyWay: ['全款', '分期']
  }
}

// 正式
// if (['admin.ushiyihao.com'].indexOf(window.location.host) > -1) {
//   config.api.baseURL = 'https://api.ushiyihao.com/useeproject02/management/admin'
// }
export default config