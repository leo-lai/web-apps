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
      <f7-view id="main-view" class="theme-white" navbar-fixed tabbar-fixed main :dynamic-navbar="true">
        <!-- iOS Theme Navbar -->
        <f7-navbar v-if="$theme.ios">
          <f7-nav-center sliding>{{toolbar.active.title}}</f7-nav-center>
        </f7-navbar>
        <!-- Pages -->
        <f7-pages>
          <f7-page name="welcome" no-navbar no-tabbar>
            <div class="l-welcome-page" v-if="welcome.visable">
              <f7-chip class="_skip" text="跳过" @click="closeWelcome"></f7-chip>
              <f7-swiper ref="welcomeSwiper" :pagination="true" :params="welcome.swiper">
                <f7-swiper-slide class="l-flex-vhc">
                  <div>
                    <f7-icon f7="images" size="100"></f7-icon>
                    <p style="margin: 2rem 0 0;">在这里展示您日常风采</p>
                  </div>
                </f7-swiper-slide>
                <f7-swiper-slide class="l-flex-vhc">
                  <div>
                    <f7-icon f7="albums" size="100"></f7-icon>
                    <p style="margin: 2rem 0 0;">在这里聆听美妙的音乐</p>
                  </div>
                </f7-swiper-slide>
                <f7-swiper-slide class="l-flex-vhc">
                  <div>
                    <f7-icon f7="world" size="100"></f7-icon>
                    <p style="margin: 2rem 0 0;">在这里找到交心的陌生人</p>
                  </div>
                </f7-swiper-slide>
              </f7-swiper>
            </div>
          </f7-page>
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
  name: 'app',
	data() {
    const that = this
		return {
      welcome: {
        visable: true,
        swiper: {
          // effect: 'coverflow',
          onTransitionStart (swiper) {
            if(swiper.swipeDirection === 'next' && swiper.slides.length - 1 === swiper.previousIndex){
              that.closeWelcome()
            }
          } 
        }
      },
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
    closeWelcome() {
      let mainView = this.$f7.mainView
      let active = this.toolbar.data[0]
      this.toolbar.active = active
      mainView.router.load({
        url: active.url,
        animatePages: true,
        reload: true,
        pushState: false
      })
      if(!this.$$utils.device.isWechat){
        mainView.showNavbar()
      }
      mainView.showToolbar()
    },
    showTab(active) {
      if (!active) active = this.toolbar.data[0]
      this.toolbar.active = active

      this.$f7.mainView.router.load({
        url: active.url,
        animatePages: false,
        reload: true
      })
    }
	},
	mounted() {
    this.$nextTick(() => {
      setTimeout(() => {
        let mainView = this.$f7.mainView
        let url = mainView.url
        let active = this.toolbar.data.filter(item => item.url === url)[0]

        let welcomeCb = this.$f7.onPageReinit('welcome', page => {
          mainView.hideNavbar(false)
          mainView.hideToolbar(false)
          this.welcome.visable = true
        })

        if (url === '#welcome') {
          welcomeCb.trigger()
        } else if(active) {
          this.toolbar.active = active
        } else {
          mainView.hideToolbar(false)
        }

        if (this.$$utils.device.isWechat) {
          mainView.hideNavbar(false)
          this.$$(this.$f7.mainView.selector).removeClass('navbar-through')
          this.$$(document).on('pageInit', e => {
            if (e.detail) {
              e.detail.page.container.classList.add('no-navbar')
            } else {
              this.$f7.mainView.activePage.container.classList.add('no-navbar')
            }
          }).trigger('pageInit')
        }

        // 野狗推送版本更新
        this.$$wilddog.sync().ref('/appinfo').on('value', snapshot => {
          let version = this.$$storage.local.get('version')
          let appinfo = snapshot.val()
          if(version && appinfo && appinfo.version !== version) {
            this.$$storage.local.set('version', appinfo.version)
            window.location.reload()
          }
        }, function (error) {
          console.error(error)
        })
      })
    })
	}
}
</script>
<style lang="less">
@import '~framework7/dist/css/framework7.ios.min.css';
@import '~framework7/dist/css/framework7.ios.colors.min.css';
@import '~framework7-icons/css/framework7-icons.css';
@import '~assets/css/font.less';
@import '~assets/css/base.less';
@import '~assets/css/framework7-custom.less';
.l-welcome-page{
  height: 100%;
  position: relative;
  ._skip{
    position: absolute;
    top: 0.75rem;
    right: 0.75rem;
    z-index: 100;
  }
  .swiper-container{
    height: 100%;
    background: rgb(13, 166, 236);
    color: #fff;
    text-align: center;
  }
  i.f7-icons{color: #fff;}
}
</style>
