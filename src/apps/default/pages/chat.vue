<template>
  <f7-page name="chat">
    <f7-navbar sliding title="微信"></f7-navbar>
    <f7-searchbar cancel-link="取消" placeholder="搜索":clear="true"></f7-searchbar>
    <f7-list media-list class="l-chat-session">
      <f7-list-item link="/about" v-for="item in 18" :key="item" swipeout>
        <f7-swipeout-actions>
          <f7-swipeout-button delete>Delete</f7-swipeout-button>
        </f7-swipeout-actions>
        
        <div slot="inner" class="l-flex-hc">
          <div class="l-margin-r"><img src="~assets/images/leolai.png" width="44"></div>
          <div class="l-rest">
            <div class="_tit">
              <span class="l-fr">星期五 15:32</span>
              <p class="l-text-nowrap">劲歌姊妹群劲但是犯得上电风扇</p>
            </div>
            <div class="_desc">最近一天聊天记录</div>
          </div>
        </div>
      </f7-list-item>
    </f7-list>
  </f7-page>
</template>

<script>
export default {
	
}
</script>
<style lang="less" scoped>
.l-chat-session{
  margin: 0;
  .item-cotent{padding-left: 0;}
  .l-fr{font-size: 0.6rem; color: #999;}
  ._tit{
    font-size: 0.85rem;
  }
  ._desc{
    color: #999; font-size: 0.7rem;
  }
}

</style>