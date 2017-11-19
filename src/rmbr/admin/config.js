let config = {
	router: {
		base: '/admin'
	},
	api: {
		baseURL: 'http://api.leolai.cn/api/plat'
	}
}

// 正式
// if (['admin.ushiyihao.com'].indexOf(window.location.host) > -1) {
//   config.api.baseURL = 'https://api.ushiyihao.com/useeproject02/management/admin'
// }
export default config