let config = {
	router: {
		base: Object.is(process.env.NODE_ENV, 'production') ? '/' : '/admin'
	},
	api: {
		baseURL: 'http://api.nrmbe.gzmypay.com/api/plat'
	},
	shop: {
		admin1: 'http://shop.nrmbe.gzmypay.com/admin/',
		admin2: 'http://cshop.nrmbe.gzmypay.com/admin/',
	}
}

if (window.location.host.indexOf('leolai.cn') > -1) {
	config.api.baseURL = 'http://api.leolai.cn/api/plat'
}
export default config