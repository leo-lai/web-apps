<template>
  <f7-page name="me">
    <f7-navbar title="我" sliding></f7-navbar>
    <f7-list media-list>
      <f7-list-item link="/about">
        <div slot="media"><img src="~assets/images/leolai.png" width="44" height="44"></div>
        <div slot="inner-start"><span class="l-text-blod"></span>LAI</div>
        <div slot="inner"><span class="l-fs-m">微信号：WeiXin-LeoLai</span></div>
        <div slot="content" class="_content-right">
          <span class="l-icon-e602"></span>
          <f7-icon f7="right"></f7-icon>
        </div>
      </f7-list-item>
    </f7-list>

    <f7-list>
      <f7-list-item link="/about/" title="钱包">
        <f7-icon slot="media" f7="card"></f7-icon>
      </f7-list-item>
    </f7-list>

    <f7-list>
      <f7-list-item link="/about/" title="收藏">
        <f7-icon slot="media" f7="favorites"></f7-icon>
      </f7-list-item>
      <f7-list-item link="/about/" title="相册">
        <f7-icon slot="media" f7="images"></f7-icon>
      </f7-list-item>
      <f7-list-item link="/about/" title="卡包">
        <f7-icon slot="media" f7="photos"></f7-icon>
      </f7-list-item>
      <f7-list-item link="/about/" title="表情">
        <f7-icon slot="media" f7="social_instagram"></f7-icon>
      </f7-list-item>
    </f7-list>

    <f7-list>
      <f7-list-item link="/about/" title="设置">
        <f7-icon slot="media" f7="gear"></f7-icon>
      </f7-list-item>
    </f7-list>

  </f7-page>
</template>

<script>
export default {
  
}
</script>