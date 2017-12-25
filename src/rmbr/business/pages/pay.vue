<template>
  <f7-page name="pay">
    <f7-navbar title="支付确认" sliding>
    </f7-navbar>
    <f7-list>
      <f7-list-item title="类型" after="充值"></f7-list-item>
      <f7-list-item title="金额" :after="data.amount + '元'"></f7-list-item>
      <f7-list-item title="备注" :after="data.desc"></f7-list-item>
    </f7-list>
    <div class="l-margin">
      <f7-button big fill @click="payNow">确定支付</f7-button>  
    </div>
  </f7-page>
</template>
<script>
export default {
	data() {
		return {
      userInfo: {},
      data: {}
		}
	},
  methods: {
    payNow() {
      this.$f7.showIndicator()
      this.$$api.wallet.rechargeOrder({
       recharge_id: this.data.id,
       open_id: this.data.openid
      }).then(({data}) => {
       this.$$api.wxpay(data).then(_ => {
          this.$store.dispatch('getUserInfo')
          this.$f7.alert('充值成功')
        }).catch(_ => {
          this.$f7.alert('充值失败')
        })
      }).finally(_ => {
       this.$f7.hideIndicator()
      })
    }
  },
  mounted() {
    let params = this.$$utils.url.getArgs()
    this.data = {
      id: params._id,
      openid: params.openid,
      amount: params._amount,
      desc: params._desc
    }
    this.payNow()
  }
}
</script>