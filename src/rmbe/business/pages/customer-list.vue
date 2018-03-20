<template>
  <f7-page name="coupon">
    <f7-navbar title="消费者列表" back-link="返回" sliding></f7-navbar>
    <f7-list class="l-fs-m" style="margin:0;">
    	<f7-list-item v-for="item in list.data" :key="item.id">
        <div slot="inner" style="width: 100%;">
          <div class="l-flex-hc">
            <div class="l-margin-r" v-if="item.thumb"><img class="l-avatar" :src="item.thumb"></div>
            <div class="l-rest">
              <p class="l-text-nowrap">昵称： {{item.nickname}}</p>
            </div>
            <f7-button @click="openEdit(item)">修改</f7-button>
          </div>
        </div>
      </f7-list-item>
		</f7-list>
    <infinite-loading :on-infinite="onInfinite" ref="infinite">
      <div class="l-loading-inline" slot="spinner"><f7-preloader></f7-preloader><span class="_txt">正在加载...</span></div>
      <div class="l-text-gray l-fs-m" slot="no-results">没有相关的数据</div>
      <div class="l-text-gray l-fs-m" slot="no-more">没有更多了</div>
    </infinite-loading>
		<!-- popup -->
    <f7-popup :opened="edit.opened" theme="lightblue">
      <div class="navbar l-text-center" style="line-height: 44px;">修改昵称</div>
      <div class="l-margin l-text-center" v-if="edit.data.thumb"><img class="l-avatar" :src="edit.data.thumb"></div>
      <f7-list form>
        <f7-list-item>
          <f7-label>旧昵称</f7-label>
          <f7-input disabled type="text" :value="edit.data.nickname"/>
        </f7-list-item>
        <f7-list-item>
          <f7-label>新昵称</f7-label>
          <f7-input type="text" placeholder="请输入新昵称" v-model="edit.data.customer_nickname" @input="edit.disabled = false"/>
        </f7-list-item>
      </f7-list>
      <div class="l-margin">
        <f7-button big fill :disabled="edit.disabled" @click="saveEdit">保存</f7-button>  
      </div>
      <div class="l-margin">
        <f7-button big fill @click="closeEdit" color="green">返回</f7-button>  
      </div>
    </f7-popup>
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
          thumb: '',
          nickname: '',
          customer_nickname: ''
        }
      }
		}
	},
	methods: {
    resetInfinite() {
      this.$refs.infinite.$emit('$InfiniteLoading:reset')
      this.onInfinite(1)
    },
    onInfinite(page) {
      this.$$api.coupon.getCustomerList(this.list.filter, page || this.list.page).then(data => {
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
      this.edit.opened = true
    },
    saveEdit() {
      this.$f7.showIndicator()
      this.$$api.customer.update(this.edit.data).then(({data}) => {
        // this.$$utils.copyObj(this.edit.slted, this.edit.data)
        this.edit.slted.nickname = this.edit.slted.customer_nickname
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
      this.resetInfinite()
    })
  }
}
</script>