<template>
	<div class="l-main-body">
		<el-tabs v-model="tabActive" @tab-click="tabClick" type="border-card">
		  <el-tab-pane label="预约客户" name="bespeak">
		  	<customer-bespeak></customer-bespeak>
		  </el-tab-pane>
		  <el-tab-pane label="跟踪客户" name="track">
		  	<customer-track></customer-track>
		  </el-tab-pane>
		  <el-tab-pane label="全部客户" name="all">
		  	<customer-all></customer-all>
		  </el-tab-pane>
		</el-tabs>
	</div>
</template>
<script>
import customerAll from './customer-all'
import customerTrack from './customer-track'
import customerBespeak from './customer-bespeak'
export default {
	name: 'customer',
	components: {
		customerAll,
		customerTrack,
		customerBespeak
	},
	data() {
		return {
			tabActive: ''
		}
	},
	methods: {
		tabClick() {
			this.$$utils.history.replace('?tab=' + this.tabActive)
			this.$$event.$emit('customer:tab', this.tabActive)
		}
	},
	mounted() {
		this.tabActive = this.$route.query.tab || 'bespeak'
		this.tabClick()
	}
}
</script>