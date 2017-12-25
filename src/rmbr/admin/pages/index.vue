<template>
	<div class="l-main-body">
    <ul class="l-index-count">
      <li @click="$router.push('/finance')">
        <h3>今日充值</h3>
        <p><b>{{dashboard.recharge_amount}}</b>元</p>
      </li>
      <li @click="$router.push('/materiel')">
        <h3>物料不足</h3>
        <p><b>{{dashboard.alter_count}}</b>台</p>
      </li>
      <li @click="$router.push('/business')">
        <h3>新增商家</h3>
        <p><b>{{dashboard.register_seller_count}}</b>家</p>
      </li>
    </ul>
		<div class="l-chart">
      <chart style="width:790px;" :options="bar" ref="bar" theme="ovilia-green" auto-resize/>
    </div>
	</div>
</template>
<script>
import ECharts from 'vue-echarts/components/ECharts.vue'
// import ECharts modules manually to reduce bundle size
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/title'
import 'echarts/lib/chart/bar'
// import 'echarts/lib/chart/line'
// import 'echarts/lib/chart/pie'
// import 'echarts/lib/chart/map'
// import 'echarts/lib/chart/radar'
// import 'echarts/lib/chart/scatter'
// import 'echarts/lib/chart/effectScatter'
// import 'echarts/lib/component/polar'
// import 'echarts/lib/component/geo'
// import 'echarts/lib/component/visualMap'
export default {
	components: {
		chart: ECharts
	},
  data () {
    return {
      dashboard: {
        alter_count: 0,
        recharge_amount: 0,
        register_seller_count: 0
      },
      bar: {
        title: {
          text: '近7天充值记录'
        },
        tooltip: {},
        legend: {
          data: ['充值金额']
        },
        xAxis: {
          data: ['2017-12-17', '2017-12-18', '2017-12-19', '2017-12-20', '2017-12-21', '2017-12-22']
        },
        yAxis: {
          axisLabel: {show: true}
        },
        series: [{
          name: '充值金额',
          type: 'bar',
          data: [5, 20, 36, 10, 10, 20]
        }]
      }
    }
  },
  methods: {
    loadBar () {
      // // simulating async data from server
      // this.seconds = 3
      // let bar = this.$refs.bar
      // bar.showLoading({
      //   text: '正在加载',
      //   color: '#4ea397',
      //   maskColor: 'rgba(255, 255, 255, 0.4)'
      // })
      // let timer = setInterval(() => {
      //   this.seconds--
      //   if (this.seconds === 0) {
      //     clearTimeout(timer)
      //     bar.hideLoading()
      //     bar.mergeOptions(this.asyncData)
      //   }
      // }, 1000)
    },
    getCount() {
      this.$$api.dashboard.getCount().then(data => {
        this.dashboard = data
      })
    }
  },
  mounted() {
    this.getCount()
  }
}
</script>

<style lang="less">
.l-index-count{
  list-style: none; overflow: hidden; margin:0; padding: 0;
  li {
    background-color: #409eff; color: #fff;
    float: left; width: 260px; padding: 30px 0; text-align: center;
    // border: 1px solid #ddd; 
    border-radius: 5px; overflow: hidden; margin: 20px;
    h3{font-size: 16px;}
    p{margin-top: 10px;}
    b{font-size:  30px; margin-right: 5px;}
  }
  li:nth-child(2){background-color: #fa5555; }
  li:nth-child(3){background-color: #67c23a; }
}
.l-chart{
  display: inline-block;
  margin: 20px;
  border: 1px solid rgba(0,0,0,.1);
  border-radius: 8px;
  box-shadow: 0 0 45px rgba(0,0,0,.2);
  padding: 1.5em 2em;
}
</style>