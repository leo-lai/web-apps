<template>
  <f7-page class="l-page-video" no-navbar name="video">
    <f7-navbar title="瑞曼博尔动画短片" sliding>
    </f7-navbar>
    <div class="l-video-box l-flex-vhc" :class="{'_show': isShow}" @click="playVideo">
      <video id="videoID" style="object-fit: fill;" webkit-playsinline="true" x-webkit-airplay="true"  playsinline="true" x5-video-player-type="h5" x5-video-player-fullscreen="true" width="100%" preload="auto" controls poster="https://vthumb.ykimg.com/054104085A6596D9000001717302CD7A" src="http://saas-resource.oss-cn-shenzhen.aliyuncs.com/%E5%8A%A8%E7%94%BB%E7%9F%AD%E7%89%87.mp4"></video>
    </div>
    <!-- <iframe width="100%" src="http://player.youku.com/embed/XMzM0MTM1OTgzNg==" frameborder="0" allowfullscreen></iframe>
    <div class="l-text-center l-text-error l-padding">支付成功，设备启动成功</div> -->
    <!-- <div class="l-text-center l-text-gray l-padding" style="position:absolute; bottom:0; left:0; right:0;">
      新疆瑞曼博尔生物科技有限公司
    </div> -->
  </f7-page>
</template>
<script>
export default {
  name: 'video',
  data () {
    return {
      isShow: false
    }
  },
  methods: {
    playVideo() {
      this.isShow = true
      document.getElementById('videoID').play()
    }
  }
}
</script>

<style scoped>
.l-page-video{background: #fff url(video.gif) no-repeat center center; background-size: 100% 100%;}
.l-video-box{position: absolute; top:0; left:0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.6); opacity: 0; transition: all 0.5s;}
.l-video-box._show{opacity: 1;}
</style>
