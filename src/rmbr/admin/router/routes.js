import layout from '../layout/default'

const routes = [
  {
    path: '/',
    component: layout,
    meta: { hidden: true },
    children: [
      { 
        path: '', 
        meta: { title: '首页' },
        component: resolve => require(['../pages/index'], resolve),
      }
    ], 
  },
  {
    path: '/login',
    meta: { title: '登录', hidden: true },
    component: resolve => require(['../pages/login'], resolve),
  },
  {
    path: '/404',
    meta: { title: '找不到页面', hidden: true },
    component: resolve => require(['../pages/404'], resolve),
  }
]

export const userMenus = [
  {
    path: '/base',
    component: layout,
    meta: { title: '基本设置' },
    children: [
      { 
        path: '1-1', 
        meta: { title: '菜单设置' },
        component: resolve => require(['../pages/index'], resolve),
      },
      { 
        path: '1-2', 
        meta: { title: '供应商管理' },
        component: resolve => require(['../pages/index'], resolve),
      },
      { 
        path: '1-3', 
        meta: { title: '车辆资料' },
        component: resolve => require(['../pages/index'], resolve),
      },
      { 
        path: '1-4', 
        meta: { title: '权限管理' },
        component: resolve => require(['../pages/index'], resolve),
      },
      { 
        path: '1-5', 
        meta: { title: '用户管理' },
        component: resolve => require(['../pages/index'], resolve),
      },
      { 
        path: '1-6', 
        meta: { title: '机构设置' },
        component: resolve => require(['../pages/index'], resolve),
      }
    ],
  },
  {
    path: '/stock',
    component: layout,
    meta: { title: '库存管理' },
    children: [
      { 
        path: '2-1', 
        meta: { title: '车辆库存' },
        component: resolve => require(['../pages/index'], resolve),
      },
      { 
        path: '2-2', 
        meta: { title: '车辆入库' },
        component: resolve => require(['../pages/index'], resolve),
      },
      { 
        path: '2-3', 
        meta: { title: '车辆出库' },
        component: resolve => require(['../pages/index'], resolve),
      },
      { 
        path: '2-4', 
        meta: { title: '订车' },
        component: resolve => require(['../pages/index'], resolve),
      }
    ],
  },
  {
    path: '/customer',
    component: layout,
    meta: { title: '客户管理' },
    children: [
      { 
        path: '', 
        meta: { title: '客户管理' },
        component: resolve => require(['../pages/index'], resolve),
      }
    ],
  },
  { path: '*', redirect: '/404', hidden: true }
]

export default routes