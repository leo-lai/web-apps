import Home from './pages/home.vue'
import Chat from './pages/chat.vue'
import Contacts from './pages/contacts.vue'
import Find from './pages/find.vue'
import Me from './pages/me.vue'

const routes = [
  {
    path: '/home/',
    component: Home,
    tabs: [
      {
        path: '/chat/',
        tabId: 'chat',
        component: Chat
      },{
        path: '/contacts/',
        tabId: 'contacts',
        component: Contacts
      },{
        path: '/find/',
        tabId: 'find',
        component: Find
      },{
        path: '/me/',
        tabId: 'me',
        component: Me
      }
    ]
  },
	{
    path: '/about/',
    component: require('./pages/page1.vue')
  },
  {
    path: '/form/',
    component: require('./pages/form.vue')
  },
  {
    path: '/dynamic-route/blog/:blogId/post/:postId/',
    component: require('./pages/page2.vue')
  }
]

export default routes