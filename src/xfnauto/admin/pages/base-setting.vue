<template>
	<div class="l-main-body" style="width: 1300px;">
		<el-tabs v-model="tabActive" @tab-click="tabClick" type="border-card">
		  <el-tab-pane v-if="userInfo.orgLevel == 1" label="系统组织管理" name="zuzhi">
		  	<base-setting-zuzhi></base-setting-zuzhi>
		  </el-tab-pane>
		  <el-tab-pane label="系统用户管理" name="user">
		  	<base-setting-user></base-setting-user>
		  </el-tab-pane>
		  <el-tab-pane label="系统角色管理" name="role">
		  	<base-setting-role></base-setting-role>
		  </el-tab-pane>
			<!-- <el-tab-pane label="人员分组" name="group">
		  	<base-setting-group></base-setting-group>
		  </el-tab-pane> -->
			<el-tab-pane label="供应商管理" name="supplier">
		  	<base-data-supplier></base-data-supplier>
		  </el-tab-pane>
			<el-tab-pane label="仓库管理" name="cang">
				<stock-cang-list></stock-cang-list>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>
<script>
import baseSettingZuzhi from './base-setting-zuzhi'
import baseSettingUser from './base-setting-user'
import baseSettingRole from './base-setting-role'
// import baseSettingGroup from './base-setting-group'
import baseDataSupplier from './base-data-supplier'
import StockCangList from './stock-cang-list'
import { mapGetters } from 'vuex'
export default {
	name: 'base-setting',
	components: {
		baseSettingZuzhi,
		baseSettingUser,
		baseSettingRole,
		baseDataSupplier,
		StockCangList,
	},
	data() {
		return {
			tabActive: ''
		}
	},
	computed: {
		...mapGetters([
			'userInfo',
    ])
	},
	methods: {
		tabClick() {
			this.$$utils.history.replace('?tab=' + this.tabActive)
			this.$$event.$emit('base-setting:tab', this.tabActive, this)
		}
	},
	mounted() {
		this.tabActive = this.$route.query.tab || (this.userInfo.orgLevel == 1 ? 'zuzhi' : 'user')
		this.tabClick()
	}
}
</script>