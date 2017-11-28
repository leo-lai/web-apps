<template>
	<div class="l-main-body">
		<el-tabs v-model="tabActive" @tab-click="tabClick" type="border-card">
		  <el-tab-pane label="车辆库存" name="list">
		  	<stock-list></stock-list>
		  </el-tab-pane>
		  <el-tab-pane label="车辆入库" name="in">
		  	<stock-in></stock-in>
		  </el-tab-pane>
		  <!-- <el-tab-pane label="出库记录" name="out">
		  	<stock-out></stock-out>
		  </el-tab-pane> -->
		  <template v-if="userInfo.orgLevel === 3">
			  <el-tab-pane label="订车列表" name="order">
			  	<stock-order></stock-order>
			  </el-tab-pane>	
		  </template>
		  <template v-if="userInfo.orgLevel < 3">
			  <el-tab-pane label="批发出库" name="out-order">
			  	<stock-out-order></stock-out-order>
			  </el-tab-pane>	
		  </template>
		</el-tabs>

		<!-- 预览图片 -->
		<viewer-images :images="viewer.images"></viewer-images>
	</div>
</template>
<script>
import { mapGetters } from 'vuex'
import viewerImages from 'components/viewer-images'
import stockList from './stock-list'
import stockIn from './stock-in'
// import stockOut from './stock-out'
import stockOrder from './stock-order'
import stockOutOrder from './stock-out-order'
export default {
	name: 'stock',
	components: {
		viewerImages,
		stockList,
		stockIn,
		// stockOut,
		stockOrder,
		stockOutOrder
	},
	data() {
		return {
			viewer: {
				images: [],
				index: 0
			},
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
			this.$$event.$emit('stock:tab', this.tabActive, this)
		}
	},
	mounted() {
		this.tabActive = this.$route.query.tab || 'list'
		this.tabClick()
	}
}
</script>