<template>
  <f7-page name="order-list">
    <f7-navbar title="订单列表" back-link="返回" sliding></f7-navbar>
    <f7-list class="l-fs-m" style="margin:0;">
    	<f7-list-item v-for="item in 18" :key="item">
        <div slot="inner" style="width: 100%;">
          <div class="l-margin-b">
            <span class="l-fr">2017-12-12</span>
            <span>单号：123113231</span>
          </div>
          <div class="l-flex-hc">
            <div class="l-margin-r"><img class="l-avatar" src="~assets/images/leolai.png" width="44"></div>
            <div class="l-rest">
              <p class="l-text-nowrap">昵&emsp;&emsp;称： leolai</p>
              <p class="l-text-nowrap">手机号码： 18602029524</p>
            </div>
            <div>
            	<b class="l-fs l-text-main">50元</b>
            </div>
          </div>
        </div>
      </f7-list-item>
		</f7-list>
  </f7-page>
</template>

<script>
export default {
	data() {
		return {
		}
	},
	mounted() {
	}
}
</script>