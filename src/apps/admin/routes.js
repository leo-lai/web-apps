import layout from './pages/layout'

const routes = [
  {
    path: '/',
    component: layout,
    meta: { hidden: true },
    children: [
      { 
        path: '', 
        meta: { title: '首页' },
        component: resolve => require(['./pages/index'], resolve),
      }
    ], 
  },
  {
    path: '/base',
    component: layout,
    meta: { title: '基础设置' },
    children: [
      { 
        path: 'menu', 
        meta: { title: '菜单设置' },
        component: resolve => require(['./pages/index'], resolve),
      }
    ],
  },
  {
    path: '/login',
    meta: { title: '登录', hidden: true },
    component: resolve => require(['./pages/login'], resolve),
  },
  {
    path: '/404',
    meta: { title: '找不到页面', hidden: true },
    hidden: true,
    component: resolve => require(['./pages/404'], resolve),
  },
  {
    path: '*',
    redirect: '/'
  }
]
export default routes