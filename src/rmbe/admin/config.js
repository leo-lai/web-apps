let config = {
	router: {
		base: Object.is(process.env.NODE_ENV, 'production') ? '/' : '/admin'
	},
	api: {
		baseURL: 'http://api.nrmbe.gzmypay.com/api/plat'
		// baseURL: 'http://rmbe.frpgz1.idcfengye.com/api/plat'
	},
	shop: {
		admin1: 'http://shop.nrmbe.gzmypay.com/admin/',
		admin2: 'http://cshop.nrmbe.gzmypay.com/admin/',
	}
}

export default config