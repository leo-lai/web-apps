<template>
  <div id="app">

    <!-- Statusbar -->
    <f7-statusbar></f7-statusbar>

    <!-- Left Panel -->
    <f7-panel left reveal layout="dark">
      <f7-view id="left-panel-view" navbar-through :dynamic-navbar="true">
        <f7-navbar v-if="$theme.ios" title="Left Panel" sliding></f7-navbar>
        <f7-pages>
          <f7-page>
            <f7-navbar v-if="$theme.material" title="Left Panel" sliding></f7-navbar>
            <f7-block inner>
              <p>Left panel content goes here</p>
            </f7-block>
            <f7-block-title>Load page in panel</f7-block-title>
            <f7-list>
              <f7-list-item link="/about/" title="About"></f7-list-item>
              <f7-list-item link="/form/" title="Form"></f7-list-item>
            </f7-list>
            <f7-block-title>Load page in main view</f7-block-title>
            <f7-list>
              <f7-list-item link="/about/" title="About" link-view="#main-view" link-close-panel></f7-list-item>
              <f7-list-item link="/form/" title="Form" link-view="#main-view" link-close-panel></f7-list-item>
            </f7-list>
          </f7-page>
        </f7-pages>
      </f7-view>
    </f7-panel>

    <!-- Right Panel -->
    <f7-panel right cover layout="dark">
      <f7-view id="right-panel-view" navbar-through :dynamic-navbar="true">
        <f7-navbar v-if="$theme.ios" title="Right Panel" sliding></f7-navbar>
        <f7-pages>
          <f7-page>
            <f7-navbar v-if="$theme.material" title="Right Panel" sliding></f7-navbar>
            <f7-block>
              <p>Right panel content goes here</p>
            </f7-block>
            <f7-block-title>Load page in panel</f7-block-title>
            <f7-list>
              <f7-list-item link="/about/" title="About"></f7-list-item>
              <f7-list-item link="/form/" title="Form"></f7-list-item>
            </f7-list>
            <f7-block-title>Load page in main view</f7-block-title>
            <f7-list>
              <f7-list-item link="/about/" title="About" link-view="#main-view" link-close-panel></f7-list-item>
              <f7-list-item link="/form/" title="Form" link-view="#main-view" link-close-panel></f7-list-item>
            </f7-list>
          </f7-page>
        </f7-pages>
      </f7-view>
    </f7-panel>

    <!-- Main Views -->
    <f7-views>
      <f7-view id="main-view" navbar-fixed tabbar-fixed main :dynamic-navbar="true">
        <!-- iOS Theme Navbar -->
        <f7-navbar v-if="$theme.ios">
          <f7-nav-center sliding>{{toolbar.active.title}}</f7-nav-center>
        </f7-navbar>
        <!-- Pages -->
        <f7-pages>
          <f7-page name="welcome"></f7-page>
        </f7-pages>
        <!-- toolbar tabs -->
        <f7-toolbar tabbar labels>
          <f7-link v-for="(item,index) in toolbar.data" :key="item.id" @click="showTab(item)" :active="item.id === toolbar.active.id">
            <f7-icon :icon="item.icon">
              <f7-badge v-show="item.badge > 0" color="red">{{item.badge}}</f7-badge>
            </f7-icon>
            <span class="tabbar-label">{{item.title}}</span>
          </f7-link>
        </f7-toolbar>
        <!-- toolbar tabs end-->
      </f7-view>
    </f7-views>

    <!-- Popup -->
    <f7-popup id="popup">
      <f7-view navbar-fixed>
        <f7-pages>
          <f7-page>
            <f7-navbar title="Popup">
              <f7-nav-right>
                <f7-link close-popup>Close</f7-link>
              </f7-nav-right>
            </f7-navbar>
            <f7-block>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Neque, architecto. Cupiditate laudantium rem nesciunt numquam, ipsam. Voluptates omnis, a inventore atque ratione aliquam. Omnis iusto nemo quos ullam obcaecati, quod.</f7-block>
          </f7-page>
        </f7-pages>
      </f7-view>
    </f7-popup>

    <!-- Login Screen -->
    <f7-login-screen id="login-screen">
      <f7-view id="view-login">
        <f7-pages>
          <f7-page login-screen>
            <f7-login-screen-title>Login</f7-login-screen-title>
            <f7-list form>
              <f7-list-item>
                <f7-label>Username</f7-label>
                <f7-input name="username" placeholder="Username" type="text"></f7-input>
              </f7-list-item>
              <f7-list-item>
                <f7-label>Password</f7-label>
                <f7-input name="password" type="password" placeholder="Password"></f7-input>
              </f7-list-item>
            </f7-list>
            <f7-list>
              <f7-list-button title="Sign In" close-login-screen></f7-list-button>
              <f7-list-label>
                <p>Click Sign In to close Login Screen</p>
              </f7-list-label>
            </f7-list>
          </f7-page>
        </f7-pages>
      </f7-view>
    </f7-login-screen>

  </div>
</template>

<script>

export default {
	data() {
		return {
      toolbar: {
        active: {
          title: '微信定制版'
        },
        data: [
          {
            id: 'chat',
            url: '/chat',
            active: false,
            icon: 'l-icon-e608',
            title: '微信',
            badge: 9
          },{
            id: 'contacts',
            url: '/contacts',
            active: false,
            icon: 'l-icon-e610',
            title: '通讯录'
          },{
            id: 'find',
            url: '/find',
            active: false,
            icon: 'l-icon-e60c',
            title: '发现'
          },{
            id: 'me',
            url: '/me',
            active: false,
            icon: 'l-icon-e655',
            title: '我'
          }
        ]
      }
		}
	},
	methods: {
		preventScroll() {
      this.$nextTick(()=>{
        setTimeout(()=>{
          Array.from(document.querySelectorAll('.l-page')).forEach((elem)=>{
            let scrollElem = elem.querySelector('.l-page-body')
            let data = {
              posY: 0,
              maxscroll: 0
            }
            if(scrollElem){
              elem.addEventListener('touchstart', (e)=>{
                let events = e.touches[0] || e

                  // 垂直位置标记
                data.posY = events.pageY
                data.scrollY = scrollElem.scrollTop
                // 是否可以滚动
                data.maxscroll = scrollElem.scrollHeight - scrollElem.clientHeight
              }, false)
              elem.addEventListener('touchmove', (e)=>{
                let events = e.touches[0] || e

                // 如果不足于滚动，则禁止触发整个窗体元素的滚动
                if (data.maxscroll <= 0) {
                    // 禁止滚动
                    e.preventDefault()
                }
        
                // 现在移动的垂直位置，用来判断是往上移动还是往下
                // 移动距离
                let distanceY = events.pageY - data.posY


                // 上下边缘检测
                if (distanceY > 0 && scrollElem.scrollTop == 0) {
                    // 往上滑，并且到头
                    // 禁止滚动的默认行为
                    event.preventDefault()
                    return
                }
        
                // 下边缘检测
                if (distanceY < 0 && (scrollElem.scrollTop + 1 >= data.maxscroll)) {
                    // 往下滑，并且到头
                    // 禁止滚动的默认行为
                    event.preventDefault()
                    return
                }
              }, false)
              elem.addEventListener('touchend', (e)=>{
                data.maxscroll = 0
              }, false)  
            }
          })
        }, 700)
      })
    },
    showTab(active = {}) {
      if (!active.id) return
      this.toolbar.active = active

      this.$f7.mainView.router.load({
        url: active.url,
        animatePages: false,
        reload: true,
        pushState: true
      })
    }
	},
	mounted() {
    const that = this
    setTimeout(() => {
      let url = that.$f7.getCurrentView().url
      let active = that.toolbar.data.filter(item => item.url === url)[0]
      if (url === '#welcome') {
        that.showTab(that.toolbar.data[0])
      } else if(active) {
        that.toolbar.active = active
      }
      
      that.$f7.onPageReinit('welcome', page => {
        that.$f7.onPageAfterAnimation('welcome', page => {
          setTimeout(() => {
            that.showTab(that.toolbar.data[0])  
          }, 50)
        })
      })

      if (that.$$utils.device.isWechat) {
        that.$f7.mainView.hideNavbar(false)
        that.$$(that.$f7.mainView.selector).removeClass('navbar-through')
        that.$$(document).on('pageInit', e => {
          if (e.detail) {
            e.detail.page.container.classList.add('no-navbar')
          } else {
            that.$f7.mainView.activePage.container.classList.add('no-navbar')
          }
        }).trigger('pageInit')
      }
    })
	}
}
</script>
<style lang="less">
@import url('~assets/css/framework7-custom.less');
</style>
