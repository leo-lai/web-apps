const routes = [
  {
    title: '首页',
    path: '/'
  },
  {
    title: '消费记录',
    path: '/order/history/',
    component: require('./pages/order-history')
  },
  {
    title: '个人中心',
    path: '/user/coupon/',
    component: require('./pages/coupon')
  },
  {
    title: '支付',
    path: '/pay/',
    component: require('./pages/pay')
  }
]

export default routes