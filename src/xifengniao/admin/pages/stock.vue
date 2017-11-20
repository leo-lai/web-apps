<template>
	<div class="l-main-body">
		<el-tabs v-model="tabActive" @tab-click="tabClick" type="border-card">
		  <el-tab-pane label="车辆库存" name="list">
		  	<stock-list></stock-list>
		  </el-tab-pane>
		  <el-tab-pane label="车辆入库" name="in">
		  	<stock-in></stock-in>
		  </el-tab-pane>
		  <el-tab-pane label="出库记录" name="out">
		  	<stock-out></stock-out>
		  </el-tab-pane>
		  <el-tab-pane label="订车列表" name="order">
		  	<stock-order></stock-order>
		  </el-tab-pane>
		</el-tabs>
	</div>
</template>
<script>
import stockList from './stock-list'
import stockIn from './stock-in'
import stockOut from './stock-out'
import stockOrder from './stock-order'
export default {
	name: 'stock',
	components: {
		stockList,
		stockIn,
		stockOut,
		stockOrder
	},
	data() {
		return {
			tabActive: ''
		}
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