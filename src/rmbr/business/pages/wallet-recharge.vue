<template>
  <f7-page name="wallet-recharge">
    <f7-navbar title="钱包充值" back-link="返回" sliding>
      <!-- <f7-nav-left>
        <f7-link text="返回" icon-f7="chevron_left" @click="back"></f7-link>
      </f7-nav-left> -->
    </f7-navbar>
    <ul class="l-recharge-list">
    	<li v-for="item in list" :class="{'_slted': slted.id === item.id}" @click="slt(item)">{{item.name}}</li>
    </ul>
		<div class="l-padding l-bg-white">
			<p class="l-fs-l l-text-center">价值：{{slted.price ? (slted.price/100).toFixed(2) : 0}}元</p>
			<p class="l-margin-t"><f7-button fill big @click="recharge">确认充值</f7-button></p>
			<br>
		</div>
  </f7-page>
</template>

<script>
export default {
	data() {
		return {
      userInfo: {},
			slted: {},
			list: []
		}
	},
  methods: {
  	getList() {
  		this.$f7.showIndicator()
  		this.$$api.wallet.rechargeList().then(({data}) => {
  			this.list = data
  			this.slted = data[0]
  		}).finally(_ => {
  			this.$f7.hideIndicator()
  		})
  	},
  	slt(item) {
  		this.slted = item
  	},
  	recharge() {
  		if(!this.slted || !this.slted.id) {
        this.$$utils.toptip('请选择充值次数')
        return
  		}

  		this.$f7.showIndicator()
  		this.$$api.wallet.rechargeOrder({
  			recharge_id: this.slted.id,
  			open_id: this.userInfo.open_id
  		}).then(({data}) => {
  			this.$$api.wxpay(data).then(_ => {
          this.$store.dispatch('getUserInfo')
          this.$f7.alert('充值成功')
        }).catch(_ => {
          this.$f7.alert('支付失败')
        })
  		}).finally(_ => {
  			this.$f7.hideIndicator()
  		})
  	},
    back() {
      this.$f7.mainView.router.back({
        force: true,
        url: '/wallet/'
      })
    }
  },
	mounted() {
    this.$$event.$on('user:login', userInfo => {
      this.userInfo = userInfo
      this.getList()
    })
	}
}
</script>
<style lang="less">
.l-recharge-list{
	background-color: #fff; list-style: none;
	overflow: hidden; margin:0; padding: 0.75rem;
	li{
		float: left; width: 20%; margin:3% 2%; border: 1px solid #ccc;
		padding: 0.5rem 0.75rem; text-align: center;
	}
	._slted{border-color: #5ac8fa; color: #5ac8fa;}
}
</style>