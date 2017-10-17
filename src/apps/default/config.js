import Routes from './routes'

let config = {
	framework7: {
		root: '#app',
		swipeBackPage: false,
		// init: false,
		pushState: true,
		pushStateRoot: '/',
		pushStateSeparator: '!',
		routes: Routes,
	}
}

export default config