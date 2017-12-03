import routes from './routes'
let isWechat = /micromessenger/i.test(navigator.userAgent)
let config = {
	// 野狗配置
  wilddog: {
    syncURL: 'https://wd5855906714jiwptx.wilddogio.com',
    authDomain: '<wd5855906714jiwptx.wilddog.com>'
  },
  
  api: {
  	baseURL: 'http://api.leolai.cn/api'
  },

	framework7: {
		root: '#app',
		uniqueHistory: true,
		swipeBackPage: !isWechat,
		pushState: true,
		pushStateRoot: '/',
		pushStateSeparator: 'wx',
		// pushStateNoAnimation: true,
		routes
	}
}

export default config