import Chat from './pages/chat'
import Contacts from './pages/contacts'
import Find from './pages/find'
import Me from './pages/me'

const routes = [
  {
    path: '/chat',
    component: Chat
  },
  {
    path: '/contacts',
    component: Contacts
  },
  {
    path: '/find',
    component: Find
  },
  {
    path: '/me',
    component: Me
  },
	{
    path: '/about',
    component: require('./pages/form')
  },
  {
    path: '/form',
    component: require('./pages/form')
  },
  {
    path: '/dynamic-route/blog/:blogId/post/:postId',
    component: require('./pages/page2')
  }
]

export default routes