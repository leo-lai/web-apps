<template>
  <f7-page name="coupon-fullcut">
    <f7-navbar title="满减券" back-link="返回" sliding>
    	<f7-nav-right>
        <f7-link text="生成" icon-f7="add_round" @click="couponOpen"></f7-link>
      </f7-nav-right>
    </f7-navbar>

    <!-- <f7-list style="margin:0;">
		  <f7-list-item :title="item.title" :after="'剩余：'+item.rest_count+'张'" v-for="item in list.data" :key="item.id"></f7-list-item>
		</f7-list> -->
    
    <div class="l-bg-white">
      <div class="l-flex-hc l-padding l-border-b" v-for="item in list.data" :key="item.id">
        <div class="l-rest">{{item.title}}</div>
        <div class="l-fs-s l-text-gray">剩余：{{item.rest_count}}张</div>
        <div class="l-margin-l">
          <f7-button color="red" @click="recycle(item.id)">回收</f7-button>
        </div>
      </div>
    </div>


    <infinite-loading :on-infinite="onInfinite" ref="infinite" :auto-start="false">
      <div class="l-loading-inline" slot="spinner"><f7-preloader></f7-preloader><span class="_txt">正在加载...</span></div>
      <div class="l-text-gray l-fs-m" slot="no-results">没有相关的数据</div>
      <div class="l-text-gray l-fs-m" slot="no-more">没有更多了</div>
    </infinite-loading>
		<!-- popup -->
    <f7-popup class="page-popup" :opened="coupon.opened" theme="lightblue">
      <div class="navbar l-text-center" style="line-height: 44px;">生成满减券</div>
      <f7-list form style="margin:0;">
        <f7-list-item>
          <f7-label>名称</f7-label>
          <f7-input type="text" placeholder="请输入优惠券名称" v-model="coupon.data.title" :maxlength="20"/>
        </f7-list-item>
        <f7-list-item>
          <f7-label>金额</f7-label>
          <f7-input type="tel" placeholder="请输入优惠券金额" v-model="coupon.data.full_money" :maxlength="7"/>
        </f7-list-item>
        <f7-list-item>
          <f7-label>扣减</f7-label>
          <f7-input type="tel" placeholder="请输入优惠券扣减金额" v-model="coupon.data.cut_money" :maxlength="7"/>
        </f7-list-item>
        <f7-list-item>
          <f7-label>张数</f7-label>
          <f7-input type="tel" placeholder="请输入生成张数" v-model="coupon.data.count" :maxlength="7"/>
        </f7-list-item>
      </f7-list>

      <div class="l-margin">
        <f7-button big fill @click="couponSave">确定生成</f7-button>  
      </div>
      <div class="l-margin">
        <f7-button big fill @click="couponClose" color="green">返回</f7-button>  
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
        filter: {
          type: 'full_cut'
        },
        page: 1,
        data: []
      },
			coupon: {
				opened: false,
				data: {
          type: 'full_cut',
          title: '',
          full_money: '',
          cut_money: '',
          count: '',
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
      this.$$api.coupon.getList(this.list.filter, page || this.list.page).then(data => {
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
    couponOpen(item) {
      this.coupon.opened = true
    },
    couponClose(item) {
      this.coupon.opened = false
    },
    couponSave() {
      if(!this.coupon.data.title) {
        this.$$utils.toptip('请输入优惠券名称')
        return
      }
      if(!/^\d{1,}$/.test(this.coupon.data.full_money)) {
        this.$$utils.toptip('请输入优惠券金额(整数)')
        return
      }
      if(!/^\d{1,9}(\.\d{1,2})?$/.test(this.coupon.data.cut_money)) {
        this.$$utils.toptip('请输入优惠券扣减金额')
        return
      }
      if(!/^\d{1,}$/.test(this.coupon.data.count)) {
        this.$$utils.toptip('请输入生成张数(整数)')
        return
      }

      let formData = Object.assign({}, this.coupon.data)

      formData.full_money = formData.full_money * 100
      formData.cut_money = formData.cut_money * 100

      this.$f7.showIndicator()
      this.$$api.coupon.add(formData).then(({data}) => {
        this.couponClose()
        this.resetInfinite()
      }).finally(_ => {
        this.$f7.hideIndicator()
      })
    },
    recycle(id) {
      this.$f7.confirm('是否确定回收？', _ => {
        this.$f7.showIndicator()
        this.$$api.coupon.recycle(id).then(({data}) => {
          this.$f7.toast('回收成功').show()
          this.resetInfinite()
        }).finally(_ => {
          this.$f7.hideIndicator()
        })  
      })
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