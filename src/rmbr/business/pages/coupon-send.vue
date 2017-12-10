<template>
  <f7-page name="coupon">
    <f7-navbar title="发放优惠券" back-link="返回" sliding></f7-navbar>
    <f7-list class="l-fs-m" style="margin:0;">
    	<f7-list-item v-for="item in 18" :key="item">
        <div slot="inner" style="width: 100%;">
          <div class="l-flex-hc">
            <div class="l-margin-r"><img class="l-avatar" src="~assets/images/leolai.png" width="44"></div>
            <div class="l-rest">
              <p class="l-text-nowrap">昵&emsp;&emsp;称： leolai</p>
              <p class="l-text-nowrap">手机号码： 18602029524</p>
            </div>
            <f7-button @click="couponOpen">发放</f7-button>
          </div>
        </div>
      </f7-list-item>

		</f7-list>

		<!-- popup -->
    <f7-popup :opened="coupon.opened" theme="lightblue">
      <f7-navbar>
        <f7-nav-left>
          <f7-link text="返回" icon-f7="chevron_left" @click="couponClose"></f7-link>
        </f7-nav-left>
        <f7-nav-center>发放优惠券</f7-nav-center>
        <f7-nav-right></f7-nav-right>
      </f7-navbar>
			<div class="l-flex-hc l-padding">
        <div class="l-margin-r"><img src="~assets/images/leolai.png" width="44"></div>
        <div class="l-rest">
          <p class="l-text-nowrap">昵&emsp;&emsp;称： leolai</p>
          <p class="l-text-nowrap">手机号码： 18602029524</p>
        </div>
      </div>
      <f7-list form style="margin:0;">
        <f7-list-item>
          <f7-label>名称</f7-label>
          <f7-input type="text" placeholder="请输入优惠券名称"/>
        </f7-list-item>
        <f7-list-item>
          <f7-label>金额</f7-label>
          <f7-input type="text" placeholder="请输入优惠券金额"/>
        </f7-list-item>
        <f7-list-item>
          <f7-label>扣减</f7-label>
          <f7-input type="text" placeholder="请输入优惠券扣减金额"/>
        </f7-list-item>
        <f7-list-item>
          <f7-label>张数</f7-label>
          <f7-input type="text" placeholder="请输入生成张数"/>
        </f7-list-item>
      </f7-list>
      <f7-block><f7-button fill big>确定发放</f7-button></f7-block>
    </f7-popup>
  </f7-page>
</template>

<script>
export default {
	data() {
		return {
			coupon: {
				opened: false,
				data: {

				}
			}
		}
	},
	methods: {
    couponOpen(item) {
      this.coupon.opened = true
    },
    couponClose(item) {
      this.coupon.opened = false
    },
    couponSave() {
      this.$f7.showIndicator()
      this.$$api.device.update(this.edit.data).then(({data}) => {
        this.$$utils.copyObj(this.edit.slted, this.edit.data)
      }).finally(_ => {
        this.$f7.hideIndicator()
        this.closeEdit()
      })
    }
	},
	mounted() {
	}
}
</script>