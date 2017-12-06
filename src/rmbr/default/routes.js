const routes = [
	{
    path: '/wallet/',
    component: require('./pages/wallet')
  },
  {
    path: '/wallet/recharge/',
    component: require('./pages/wallet-recharge')
  },
  {
    path: '/wallet/record/',
    component: require('./pages/wallet-record')
  },
  {
    path: '/device/list/',
    component: require('./pages/device-list')
  },
  {
    path: '/remind/list/',
    component: require('./pages/remind-list')
  },
  {
    path: '/order/list/',
    component: require('./pages/order-list')
  }
]

export default routes