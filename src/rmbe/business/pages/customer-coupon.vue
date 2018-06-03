<template>
  <f7-page name="coupon">
    <f7-navbar :title="title" back-link="返回" sliding></f7-navbar>
    <f7-list class="l-fs-m" style="margin:0;">
    	<f7-list-item v-for="item in list.data" :key="item.id">
        <div slot="inner" style="width: 100%;">
          <p>券名称： {{item.title}}</p>
          <p>剩余次数： {{item.device_count}}</p>
        </div>
      </f7-list-item>
		</f7-list>
    <infinite-loading :on-infinite="onInfinite" ref="infinite">
      <div class="l-loading-inline" slot="spinner"><f7-preloader></f7-preloader><span class="_txt">正在加载...</span></div>
      <div class="l-text-gray l-fs-m" slot="no-results">没有相关的数据</div>
      <div class="l-text-gray l-fs-m" slot="no-more">没有更多了</div>
    </infinite-loading>
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
      title: '券列表',
      userInfo: {},
      list: {
        filter: {},
        page: 1,
        data: []
      },
      customer: {},
      edit: {
        disabled: true,
        opened: false,
        slted: {},
        data: {
          id: '',
          thumb: '',
          customer_id: '',
          nickname: ''
        }
      }
		}
	},
	methods: {
    resetInfinite() {
      this.$refs.infinite.$emit('$InfiniteLoading:reset', false)
      this.onInfinite(1)
    },
    onInfinite(page) {
      this.$$api.customer.getCouponList({
        customer_id: this.$route.query.id,
        ...this.list.filter
      }, page || this.list.page).then(data => {
        let returnList = data.list
        this.list.data = data.page > 1 ? this.list.data.concat(returnList) : returnList

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
    },
    openEdit(item) {
      this.edit.slted = item
      this.edit.disabled = true
      this.$$utils.copyObj(this.edit.data, item)
      this.edit.data.customer_id = item.id
      this.edit.data.nickname = ''
      this.edit.opened = true
    },
    saveEdit() {
      this.$f7.showIndicator()
      this.$$api.customer.update(this.edit.data).then(({data}) => {
        // this.$$utils.copyObj(this.edit.slted, this.edit.data)
        this.edit.slted.nickname = this.edit.data.nickname
      }).finally(_ => {
        this.$f7.hideIndicator()
        this.closeEdit()
      })
    },
    closeEdit(item) {
      this.edit.opened = false
    }
	},
  mounted() {
    this.$$event.$once('user:login', userInfo => {
      this.userInfo = userInfo
      this.title = this.$route.query.name || '券列表'
    })
  }
}
</script>