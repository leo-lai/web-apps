<template>
  <f7-page name="coupon">
    <f7-navbar title="发放优惠券" back-link="返回" sliding></f7-navbar>
    <f7-searchbar cancel-link="取消" placeholder="输入昵称查询" :clear="true" 
      @input="onSearch" @click:clear="onClear" @click:cancel="onClear">
    </f7-searchbar>

    <f7-list class="l-fs-m" style="margin:0;">
    	<f7-list-item v-for="item in list.filterList" :key="item.id">
        <div slot="inner" style="width: 100%;">
          <div class="l-flex-hc">
            <div class="l-margin-r" v-if="item.thumb"><img class="l-avatar" :src="item.thumb"></div>
            <div class="l-rest l-text-wrap1" style="width: 60%;">
              <p class="l-text-wrap1">昵&emsp;&emsp;称： {{item.nickname}}</p>
              <p class="l-text-wrap1">手机号码： {{item.tel}}</p>
            </div>
            <div>
              <f7-button @click="couponOpen(item)">发放</f7-button>
            </div>
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
    <f7-popup :opened="coupon.opened" theme="lightblue">
      <div class="navbar l-text-center" style="line-height: 44px;">发放优惠券</div>
			<div class="l-flex-hc l-padding">
        <div class="l-margin-r" v-if="customer.thumb"><img class="l-avatar" :src="customer.thumb"></div>
        <div class="l-rest">
          <p class="l-text-nowrap">昵&emsp;&emsp;称： {{customer.nickname}}</p>
          <p class="l-text-nowrap">手机号码： {{customer.tel}}</p>
        </div>
      </div>
      <f7-list form style="margin:0;">
        <f7-list-item>
          <f7-label style="width:auto;">优惠券类型：</f7-label>
          <f7-input type="select" v-model="coupon.data.type" @change="getCouponList">
            <!-- <option value="full_cut">满减券</option> -->
            <option value="times">次数券</option>
          </f7-input>
        </f7-list-item>
      </f7-list>
      <f7-list class="l-scroll" form style="margin:0; max-height: 15.0rem;">
        <f7-list-item radio name="coupon" :title="'优惠券名称： ' + item.title +'（剩余'+item.rest_count+'张）'" v-for="item in coupon.list" :key="item.id" @click="couponSlt(item)"></f7-list-item>
        <div class="l-text-gray l-padding l-text-center" v-if="coupon.list.length === 0">暂无优惠券</div>
      </f7-list>

      <f7-list form style="margin:15px 0 0 0;">
        <f7-list-item>
          <f7-label>数量</f7-label>
          <f7-input type="tel" v-model="coupon.data.count" placeholder="请输入发放数量" maxlength="10"/>
        </f7-list-item>
      </f7-list>
      <f7-list form style="margin:0;">
        <f7-list-item>
          <f7-label>过期时间</f7-label>
          <f7-input type="date" v-model="coupon.data.expire_date" placeholder="请选择优惠券过期时间" />
        </f7-list-item>
      </f7-list>

      <div class="l-margin">
        <f7-button big fill @click="couponSend">确定发放</f7-button>  
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
          keywords: ''
        },
        page: 1,
        data: [],
        filterList: []
      },
      customer: {},
			coupon: {
				opened: false,
        list: [],
        slted: {},
				data: {
          customer_id: '',
          type: 'times',
          coupon_id: '',
          count: '',
          expire_date: ''
				}
			}
		}
	},
  computed: {
    filterList() {
      return this.list.data.filter(item => this.list.filter.keywords ? item.nickname.includes(this.list.filter.keywords) : this.list.data)
    }
  },
	methods: {
    resetInfinite() {
      this.$refs.infinite.$emit('$InfiniteLoading:reset', false)
      this.onInfinite(1)
    },
    onInfinite(page) {
      this.$$api.coupon.getCustomerList(this.list.filter, page || this.list.page).then(data => {
        let returnList = data.list
        this.list.data = data.page > 1 ? this.list.data.concat(returnList) : returnList
        this.list.filterList = this.list.data

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
    onSearch(query, found) {
      this.list.filter.keywords = query
      this.list.filterList = this.list.data.filter(item => this.list.filter.keywords ? item.nickname.includes(this.list.filter.keywords) : this.list.data)
      // this.resetInfinite()
    },
    onClear(query, found) {
      this.list.filter.keywords = ''
      this.list.filterList = this.list.data
      // this.onInfinite(1)
    },
    getCouponList() {
      this.$f7.showIndicator()
      return this.$$api.coupon.getList({
        type: this.coupon.data.type
      }).then(data => {
        this.coupon.slted = {}
        this.coupon.data.coupon_id = ''
        this.coupon.list = data.list
      }).finally(_ => {
        this.$f7.hideIndicator()
      })
    },
    couponOpen(item) {
      this.customer = item
      this.coupon.data.customer_id = item.id
      this.getCouponList().finally(_ => {
        this.coupon.opened = true
      })
    },
    couponClose(item) {
      this.coupon.opened = false
    },
    couponSend() {
      if(!this.coupon.data.coupon_id) {
        this.$$utils.toptip('请选择发放优惠券')
        return
      }
      if(!/^\d{1,}$/.test(this.coupon.data.count)) {
        this.$$utils.toptip('请输入发放数量')
        return
      }
      if(this.coupon.data.count > this.coupon.slted.rest_count) {
        this.$$utils.toptip('发放数量大于剩余数量')
        return
      }

      // if(this.coupon.data.expire_date) {
      //   this.coupon.data.expire_date = this.coupon.data.expire_date.replace(/T/ig, ' ')
      //   if(this.coupon.data.expire_date.length <= 16) {
      //     this.coupon.data.expire_date += ':00'  
      //   }
      // }
      console.log(this.coupon.data.expire_date)
      let promise1 = this.$$api.coupon.send(this.coupon.data)
      // let promise2 = this.$$api.coupon.update(this.coupon.data)

      this.$f7.showIndicator()
      Promise.all([promise1]).then(_ => {
        this.couponClose()
        this.$f7.alert('优惠券发放成功')
      }).finally(_ => {
        this.$f7.hideIndicator()
      })
    },
    couponSlt(item) {
      this.coupon.slted = item
      this.coupon.data.coupon_id = item.id
    }
	},
  mounted() {
    this.$$event.$once('user:login', userInfo => {
      this.userInfo = userInfo
    })
  }
}
</script>