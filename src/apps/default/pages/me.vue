<template>
  <f7-page>
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

  </f7-page>
</template>

<script>
export default {
  
}
</script>