<template>
  <div id="app">
    <!-- Statusbar -->
    <f7-statusbar></f7-statusbar>

    <!-- Main Views -->
    <f7-views>
      <f7-view main id="main-view" navbar-fixed tabbar-fixed :dynamic-navbar="true">
        <!-- iOS Theme Navbar -->
        <f7-navbar v-if="$theme.ios">
          <f7-nav-center sliding>微信个人版</f7-nav-center>
        </f7-navbar>
        <f7-pages>
          <f7-page name="welcome" no-navbar no-tabbar>
            <div class="l-welcome-page">
              <f7-chip class="_skip" text="跳过"></f7-chip>
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
        <f7-toolbar tabbar labels>
          <f7-link v-for="(item,index) in toolbar.data" :key="item.id" @click="showTab(item)" :active="item.id === toolbar.active.id">
            <f7-icon :icon="item.icon">
              <f7-badge v-show="item.badge > 0" color="red">{{item.badge}}</f7-badge>
            </f7-icon>
            <span class="tabbar-label">{{item.title}}</span>
          </f7-link>
        </f7-toolbar>
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
      <f7-view>
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
      welcome: {
        visable: true,
        swiper: {
          // effect: 'coverflow',
          // onTransitionStart (swiper) {
          //   if(swiper.swipeDirection === 'next' && swiper.slides.length - 1 === swiper.previousIndex){
          //     that.closeWelcome()
          //   }
          // } 
        }
      },
      toolbar: {
        active: {},
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
    showTab(active = {}) {
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
    const that = this
    that.$nextTick(()=>{
      
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
// @import '~assets/css/framework7-custom.less';
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
