let config = {
  router: {
    base: '/admin'
  },
  api: {
    baseURL: 'http://111.230.170.36/tauto/management/admin'
  },
  pay: {
    url: 'http://ceshi.allinpay.com/gateway/index.do',
    dev: 'http://ceshi.allinpay.com/gateway/index.do',
    prod: 'https://service.allinpay.com/gateway/index.do'
  },
  viewer: {
    options: {
      inline: false,
      button: true,
      navbar: true,
      title: false,
      toolbar: true,
      tooltip: false,
      movable: true,
      zoomable: true,
      rotatable: true,
      scalable: true,
      transition: true,
      fullscreen: true,
      keyboard: true,
      url: 'data-source'
    }
  }
}

// 正式
// if (['admin.ushiyihao.com'].indexOf(window.location.host) > -1) {
//   config.api.baseURL = 'https://api.ushiyihao.com/useeproject02/management/admin'
// }
export default config