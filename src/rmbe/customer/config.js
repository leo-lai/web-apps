import routes from './routes'
let isWechat = /micromessenger/i.test(navigator.userAgent)
let isProd = Object.is(process.env.NODE_ENV, 'production')
let config = {
	host: window.location.origin,
	// 野狗配置
  wilddog: {
    syncURL: 'https://wd5855906714jiwptx.wilddogio.com',
    authDomain: '<wd5855906714jiwptx.wilddog.com>'
  },
  
  api: {
  	baseURL: 'http://api.nrmbe.gzmypay.com/api'
  	// baseURL: 'http://rmbe.frpgz1.idcfengye.com/api'
  },

  shopURL: 'http://cshop.nrmbe.gzmypay.com/h5/#/home',

	framework7: {
		root: '#app',
		swipeBackPage: !isWechat,
		pushState: true,
		pushStateRoot: '/',
		pushStateSeparator: isProd ? 'wx' : 'customer',
		pushStateNoAnimation: true,
		pushStatePreventOnLoad: false,
		modalTitle: '系统提示',
		modalButtonOk: '确定',
		modalButtonCancel: '取消',
		modalPreloaderTitle: '加载中...',
		popupCloseByOutside: false,
		routes
	}
}

export default config