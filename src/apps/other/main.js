import Vue from 'vue'
import VueRouter from 'vue-router'

import Routes from './routes'
import App from './app.vue'

Vue.use(VueRouter)
const router = new VueRouter({
  routes: Routes,
	mode: 'history',
	scrollBehavior (to, from, savedPosition) {
    // return 期望滚动到哪个的位置
    // console.log(to, from, savedPosition)
  }
})
router.beforeEach((to, from, next) => {
	next()
})
router.afterEach((to) => {

})
router.onReady(()=>{

})
new Vue({
	router,
  render: h => h(App)
}).$mount('#app')

