<template>
	<div class="l-main-body" style="width: 1630px;">
		<el-tabs v-model="tabActive" @tab-click="tabClick" type="border-card">
		  <el-tab-pane label="库存列表" name="list">
		  	<stock-list></stock-list>
		  </el-tab-pane>
			<el-tab-pane label="车辆入库" name="in">
				<stock-in></stock-in>
			</el-tab-pane>
			<el-tab-pane label="车辆出库" name="out">
				<stock-out></stock-out>
			</el-tab-pane>
		  <!-- <template v-if="userInfo.orgLevel === 3">
			  <el-tab-pane label="订车列表" name="order">
			  	<stock-order></stock-order>
			  </el-tab-pane>
			  <el-tab-pane label="车辆出库" name="out">
			  	<stock-out></stock-out>
			  </el-tab-pane>
		  </template> -->
		  <!-- <template v-if="userInfo.orgLevel < 3">
		  	<el-tab-pane label="车辆入库" name="in">
			  	<stock-in></stock-in>
			  </el-tab-pane>
			  <el-tab-pane label="批发出库" name="out-order">
			  	<stock-out-order></stock-out-order>
			  </el-tab-pane>	
		  </template> -->
		</el-tabs>
	</div>
</template>
<script>
import { mapGetters } from 'vuex'
import StockList from './stock-list'
import StockIn from './stock-in'
import StockOut from './stock-out'
// import StockOrder from './stock-order'
// import StockOutOrder from './stock-out-order'
export default {
	name: 'stock',
	components: {
		StockList,
		StockIn,
		StockOut,
		// StockOrder,
		// StockOutOrder
	},
	data() {
		return {
			tabActive: ''
		}
	},
  computed: {
  	...mapGetters([
  		'userInfo'
    ])
  },
	methods: {
		tabClick() {
			this.$$utils.history.replace('?tab=' + this.tabActive)
			this.$$event.$emit('stock:tab', this.tabActive)
		}
	},
	mounted() {
		this.tabActive = this.$route.query.tab || 'list'
		this.tabClick()
	}
}
</script>