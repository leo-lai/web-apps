let config = {
	router: {
		base: Object.is(process.env.NODE_ENV, 'production') ? '/' : '/admin'
	},
	api: {
		baseURL: 'http://api.leolai.cn/api/plat'
	},
	shop: {
		admin: 'http://shop.leolai.cn/admin/index.php'
	}
}

// 正式
// if (['admin.ushiyihao.com'].indexOf(window.location.host) > -1) {
//   config.api.baseURL = 'https://api.ushiyihao.com/useeproject02/management/admin'
// }
export default config