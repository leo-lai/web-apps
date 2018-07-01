<template>
	<div class="l-main-body" style="width: 1400px;">
		<el-tabs v-model="tabActive" @tab-click="tabClick" type="border-card">
			<el-tab-pane label="垫资单列表" name="loan-order">
				<loan-order></loan-order>
			</el-tab-pane>
			<el-tab-pane label="垫资认证审核" name="loan-auth">
				<loan-auth></loan-auth>
			</el-tab-pane>
			<el-tab-pane label="门店认证审核" name="store-auth">
				<store-auth></store-auth>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>
<script>
import { mapGetters } from 'vuex'
import loanOrder from './loan-order-list'
import loanAuth from './loan-auth-list'
import storeAuth from './store-auth-list'
export default {
	name: 'order',
	components: {
		loanOrder, loanAuth, storeAuth
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
			this.$$event.$emit('loan:tab', this.tabActive)
		}
	},
	mounted() {
		this.tabActive = this.$route.query.tab || 'loan-order'
		this.tabClick()
	}
}
</script>
