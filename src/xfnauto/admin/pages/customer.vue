<template>
	<div class="l-main-body">
		<el-tabs v-model="tabActive" @tab-click="tabClick" type="border-card">
			<!-- <template v-if="userInfo.orgLevel === 3">
				<el-tab-pane label="预约客户" name="bespeak">
			  	<customer-bespeak></customer-bespeak>
			  </el-tab-pane>
			  <el-tab-pane label="跟踪客户" name="track">
			  	<customer-track></customer-track>
			  </el-tab-pane>	
			</template> -->
		  <!-- <el-tab-pane label="全部客户" name="all">
		  	<customer-all></customer-all>
		  </el-tab-pane> -->
			<el-tab-pane label="客户订单列表" name="order">
		  	<customer-order></customer-order>
		  </el-tab-pane>
		</el-tabs>

	</div>
</template>
<script>
import { mapGetters } from 'vuex'
import customerAll from './customer-all'
import customerTrack from './customer-track'
import customerBespeak from './customer-bespeak'
import customerOrder from './customer-order'
export default {
	name: 'order',
	components: {
		customerAll,
		customerTrack,
		customerBespeak,
		customerOrder
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
			this.$$event.$emit('customer:tab', this.tabActive, this)
		}
	},
	mounted() {
		this.tabActive = this.$route.query.tab || 'order'
		this.tabClick()
	}
}
</script>