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

		<!-- 预览图片 -->
		<viewer-images :images="viewer.images"></viewer-images>
	</div>
</template>
<script>
import viewerImages from 'components/viewer-images'
import customerAll from './customer-all'
import customerTrack from './customer-track'
import customerBespeak from './customer-bespeak'
export default {
	name: 'customer',
	components: {
		viewerImages,
		customerAll,
		customerTrack,
		customerBespeak
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
	methods: {
		tabClick() {
			this.$$utils.history.replace('?tab=' + this.tabActive)
			this.$$event.$emit('customer:tab', this.tabActive, this)
		}
	},
	mounted() {
		this.tabActive = this.$route.query.tab || 'bespeak'
		this.tabClick()
	}
}
</script>