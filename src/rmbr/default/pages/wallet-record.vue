<template>
  <f7-page name="wallet-record" toolbar-fixed>
    <f7-navbar title="充值记录" back-link="返回" sliding></f7-navbar>
    <div class="l-wallet-record l-bg-white">
      <div class="_item l-flex-hc l-border-b l-padding" v-for="item in list.data">
        <div class="l-rest">
          <p>{{item.order_id}}</p>
          <p>充值次数：{{item.pay_data}}</p>
          <p>时间：{{item.update_time}}</p>
        </div>
        <b class="l-fs">￥{{item.amount}}</b>
      </div>
    </div>
    <infinite-loading :on-infinite="onInfinite" ref="infinite">
      <div class="l-loading-inline" slot="spinner"><f7-preloader></f7-preloader><span class="_txt">正在加载...</span></div>
      <div class="l-text-gray l-fs-m" slot="no-results">没有相关的数据</div>
      <div class="l-text-gray l-fs-m" slot="no-more">全部数据加载完毕</div>
    </infinite-loading>
    <f7-toolbar >
      <div class="l-text-right" style="width: 100%;">总共充值：{{list.sum}}元</div>
    </f7-toolbar>
  </f7-page>
</template>

<script>
import infiniteLoading from 'components/vue-infinite-loading'
export default {
  components: {
    infiniteLoading
  },
	data() {
		return {
			list: {
        sum: 0,
        page: 1,
        data: []
      }
		}
	},
  methods: {
    onInfinite() {
      this.$$api.wallet.recordList(this.page)
      .then(data => {
        let returnList = data.list.map(item => {
          item.amount = (item.amount / 100).toFixed(2)
          return item
        })
        this.list.sum = data.sum
        this.list.data = this.list.concat(returnList)
        
        if(returnList.length > 0){
          this.$nextTick(()=>{
            this.$refs.infinite.$emit('$InfiniteLoading:loaded')
          })
          
          if(returnList.length >= data.rows){
            this.list.page++
          }else{
            this.$refs.infinite.$emit('$InfiniteLoading:complete')
          }
        }else{
          this.$refs.infinite.$emit('$InfiniteLoading:complete')
        }
      }).catch(_ => {
        this.$refs.infinite.$emit('$InfiniteLoading:complete')
      })
    }
  }
}
</script>
<style lang="less">

</style>