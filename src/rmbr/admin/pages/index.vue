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
		<!-- <chart :options="polar"></chart> -->
	</div>
</template>
<script>
import ECharts from 'vue-echarts/components/ECharts.vue'
// import ECharts modules manually to reduce bundle size
// import 'echarts/lib/chart/bar'
// import 'echarts/lib/chart/line'
// import 'echarts/lib/chart/pie'
// import 'echarts/lib/chart/map'
// import 'echarts/lib/chart/radar'
// import 'echarts/lib/chart/scatter'
// import 'echarts/lib/chart/effectScatter'
// import 'echarts/lib/component/tooltip'
// import 'echarts/lib/component/polar'
// import 'echarts/lib/component/geo'
// import 'echarts/lib/component/legend'
// import 'echarts/lib/component/title'
// import 'echarts/lib/component/visualMap'
export default {
	components: {
		chart: ECharts
	},
  data () {
    let data = []

    for (let i = 0; i <= 360; i++) {
        let t = i / 180 * Math.PI
        let r = Math.sin(2 * t) * Math.cos(2 * t)
        data.push([r, i])
    }

    return {
      dashboard: {
        alter_count: 0,
        recharge_amount: 0,
        register_seller_count: 0
      },
      polar: {
        title: {
          text: '极坐标双数值轴'
        },
        legend: {
          data: ['line']
        },
        polar: {
          center: ['50%', '54%']
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          }
        },
        angleAxis: {
          type: 'value',
          startAngle: 0
        },
        radiusAxis: {
          min: 0
        },
        series: [
          {
            coordinateSystem: 'polar',
            name: 'line',
            type: 'line',
            showSymbol: false,
            data: data
          }
        ],
        animationDuration: 2000
      }
    }
  },
  methods: {
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
  list-style: none; overflow: hidden;
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
</style>