<template>
  <f7-page name="coupon">
    <f7-navbar title="发放记录" back-link="返回" sliding></f7-navbar>
    <f7-list class="l-fs-m" style="margin:0;">
    	<f7-list-item v-for="item in 18" :key="item">
        <div slot="inner" class="l-flex-h" style="width: 100%;">
          <div class="l-margin-r"><img class="l-avatar" src="~assets/images/leolai.png" width="44"></div>
          <div class="l-rest">
            <p class="l-text-nowrap">手机号码： 18602029524</p>
            <p class="l-text-nowrap">昵&emsp;&emsp;称： leolai</p>
            <p class="l-text-nowrap">日&emsp;&emsp;期： 2017-12-12 12：12:12</p>
            <p class="l-text-error">满减券：满100减50 （10张）</p>
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