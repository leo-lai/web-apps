<template>
	<div class="l-main-body">
		<el-tabs v-model="tabActive" @tab-click="tabClick" type="border-card">
		  <el-tab-pane v-if="userInfo.orgLevel == 1" label="组织列表" name="zuzhi">
		  	<base-setting-zuzhi></base-setting-zuzhi>
		  </el-tab-pane>
		  <el-tab-pane label="系统用户" name="user">
		  	<base-setting-user></base-setting-user>
		  </el-tab-pane>
		  <el-tab-pane label="系统角色" name="role">
		  	<base-setting-role></base-setting-role>
		  </el-tab-pane>
			<!-- <el-tab-pane label="人员分组" name="group">
		  	<base-setting-group></base-setting-group>
		  </el-tab-pane> -->
		</el-tabs>
	</div>
</template>
<script>
import baseSettingZuzhi from './base-setting-zuzhi'
import baseSettingUser from './base-setting-user'
import baseSettingRole from './base-setting-role'
import baseSettingGroup from './base-setting-group'
import { mapGetters } from 'vuex'
export default {
	name: 'base-setting',
	components: {
		baseSettingZuzhi,
		baseSettingUser,
		baseSettingRole,
		baseSettingGroup
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