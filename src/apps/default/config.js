import Routes from './routes'

let config = {
	// 野狗配置
  wilddog: {
    syncURL: 'https://wd5855906714jiwptx.wilddogio.com',
    authDomain: '<wd5855906714jiwptx.wilddog.com>'
  },
  
	framework7: {
		root: '#app',
		uniqueHistory: true,
		swipeBackPage: false,
		pushState: true,
		pushStateRoot: '/',
		pushStateSeparator: '!',
		pushStateNoAnimation: true,
		routes: Routes
	}
}

export default config