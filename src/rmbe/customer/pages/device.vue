<template>
  <f7-page class="l-bg-white" name="device">
    <f7-navbar :title="title" sliding></f7-navbar>
    <div class="l-device-bg"></div>

    <!-- <div class="l-panel-pay">
      <p class="l-text-gray l-fs-m">支付金额</p>
      <div class="_ipt _ipt2 l-flex-hc">
        <b style="margin: 0.25rem 0.75rem 0 0 ;">RMB</b>
        <div class="l-rest">
          <span v-show="!money">点击这里输入金额</span>
          <input ref="money" v-model="money" readonly @click="showKeyboard($event.target)" placeholder="">  
        </div>
      </div>
    </div> -->
  
    <div class="l-panel-coupon">
      <f7-list class="l-margin-0 l-coupon-form" form>
        <f7-list-item>
          <f7-label style="width: auto;">选择优惠券：</f7-label>
          <f7-input type="select" v-model="couponType" @change="getCouponList">
            <!-- <option value="full_cut">满减券</option> -->
            <option value="times">次数券</option>
          </f7-input>
        </f7-list-item>
      </f7-list>
      
      <!-- <div class="l-flex-hc">
        <span>选择优惠券：</span>
        <div class="l-rest">
          <f7-input type="select" v-model="couponType" @change="getCouponList">
            <option value="full_cut">满减券</option>
            <option value="times">次数券</option>
          </f7-input>
        </div>
      </div> -->
      <f7-list class="l-scroll" form style="margin:0; max-height: 15.0rem;">
        <f7-list-item radio name="coupon" :title="item.title + (item.type === 'times' ? '（剩余次数：'+ item.device_count +'）' : '')" v-for="item in couponList" :key="item.id" @click="couponSlt(item)"></f7-list-item>
      </f7-list>
      <div v-if="couponList.length === 0" class="l-padding l-text-gray l-text-center">暂无可用{{couponText[couponType]}}</div>
    </div>
    <div style="margin: 1rem 0.75rem;">
      <f7-button style="background-color:#323232;" big fill @click="pay">开&nbsp;&nbsp;启</f7-button>
      <div class="l-text-center l-margin" style="font-size: 1rem;">
        蜕&nbsp;变&nbsp;之&nbsp;旅
      </div>
    </div>

    <number-keyboard ref="numberKeyboard" :nk-length="10"></number-keyboard>
  </f7-page>
</template>

<script>
import NumberKeyboard from 'components/number-keyboard'
export default {
  name: 'device',
  components: {
    NumberKeyboard
  },
	data() {
		return {
      title: '启动设备',
      number: '',
      userInfo: {},
      deviceInfo: {},
      couponText: {
        'full_cut': '满减券',
        'times': '次数券'
      },
      couponType: 'times',
      couponList: [],
      couponSlted: {},
      money: ''
		}
	},
	methods: {
    showKeyboard(input) {
      this.$refs.numberKeyboard.$emit('$keyboard:show', input)
    },
    getDeviceInfo() {
      this.$f7.showIndicator()
      this.$$api.pay.getDeviceInfo(this.number).then(({data}) => {
        if(data && data.device_remain_count > 0){
          this.deviceInfo = data
          this.title = data.store_name || this.title

          setTimeout(_ => {
            this.getCouponList()
          }, 200)
          
          this.getLottery()
        }else {
          this.$f7.hideIndicator()
          this.$f7.alert('该设备次数不足，请告知商家充值。')
        }
        return data
      }).catch(_ => {
        this.couponSlted = {}
        this.$f7.hideIndicator()
      })
    },
    getCouponList() {
      this.$f7.hideIndicator()
      this.$$api.pay.getCouponList({
        seller_id: this.deviceInfo.seller_id,
        type: this.couponType
      }).then(({data}) => {
        this.couponSlted = {}
        this.couponList = data.list
      }).finally(_ => {
        this.$f7.hideIndicator()
      })
    },
    getLottery() { // 抽奖信息
      this.$$api.pay.getLottery({
        device: this.number
      }).then(({data}) => {
        if(data){
          this.$f7.confirm('您有一次抽取马尔代夫游的机会，请问您要参加吗？', _ => {
            window.location.href = `http://api.nrmbe.gzmypay.com/lettery/?uid=${this.userInfo.id}&token=${this.userInfo.token}&device=${this.number}`
          })
        }else{
          this.$f7.alert('现在办理10次套卡，就有机会抽取马尔代夫双人游，还有笔记本电脑手机、等5重豪礼等你来，弹无虚发100%中奖！')
        }
      })
    },
    couponSlt(item) {
      this.couponSlted = item
    },
    pay() {
      let formData = {
        seller_id: this.deviceInfo.seller_id,
        open_id: this.userInfo.open_id,
        number: this.number
      }

       if(!this.money) {
         formData.money = 0
       }

      if(this.couponSlted && this.couponSlted.id){
        formData.type = 'coupon'
        formData.coupon_type = this.couponSlted.type
        formData.coupon_id = this.couponSlted.id
      }else {
        formData.type = 'buy'
        this.$$utils.toptip('请选择次数券进行支付')
      }

      if(formData.coupon_type !== 'times' && formData.coupon_type !== 'plat_times'){
        if(this.money === '') {
          // this.$$utils.toptip('请输入支付金额')
          return
        }
        formData.money = Number(this.money) * 100
      }

      this.$$storage.local.set('pay_form', formData)
      this.$f7.showIndicator()
      this.$$api.auth.pay(formData.seller_id).then(({data}) => {
        window.location.replace(data.url)
      }).finally(_ => {
        this.$f7.hideIndicator()
      })
    }
	},
  mounted() {
    this.$refs.numberKeyboard.$on('$keyboard:input', (val)=>{
      this.money = val
    })

    this.$$event.$once('user:login', userInfo => {
      this.userInfo = userInfo

      let args = this.$$utils.url.getArgs()
      if(args.no) {
        this.number = args.no 
        this.getDeviceInfo()
      }else {
        this.$f7.alert('该设备不可用，请联系商家。')
      }
    })
  }
}
</script>
<style lang="less">
.l-coupon-form{
  .item-content{padding-left: 0 !important;}
  ul:before, ul:after{
    display: none !important;
  }
}
</style>

<style scoped lang="less">
.l-device-bg{
  background: url('../../assets/20180707001.gif') no-repeat 50% 50%;
  background-size: cover; height: 50%;
}
.l-panel-coupon{
  margin: -1.75em 0.75rem 0.75rem; background-color: #fff; padding: 0.75rem; border: 1px solid #666; border-radius: 5px;
}
.l-panel-pay{
  margin: 0.75rem; background-color: #fff; padding: 0.75rem; border: 1px solid #ccc; border-radius: 5px;
  ._ipt2{
    input::-webkit-input-placeholder{
      /* font-size: 0.85rem; */ color: #333;
      transform: translate3d(0, 0, 0) scale(0.6); 
      transform-origin: 0 50%; 
    }  
  }
  ._ipt{
    padding: 0.75rem 0 0 0; position: relative; z-index: 0;
    input{
      width: 100%; margin:0; padding: 0; background-color: transparent;
      border:none;  font-size: 1.6rem; line-height: 1;  position: relative; z-index: 2;
    }
    
    span{
      position: absolute; top:1.2rem; left: 2.25rem; color: #333; pointer-events: none; z-index: -1;
    }
  }
}
</style>