<template>
	<div>
		<el-row>
  		<el-col :span="8">
  			<el-button type="primary" @click="showDialogInfo('new')">新增</el-button>
  		</el-col>
  		<el-col :span="16" class="l-text-right">
  			<el-form :inline="true" ref="listFilter" :model="list.filter" :rules="list.rules" @submit.native.prevent="search">
				  <el-form-item prop="orgName">
				    <el-input placeholder="请输入门店/公司名称" v-model="list.filter.orgName"></el-input>
				  </el-form-item>
				  <el-form-item prop="realName">
				    <el-input placeholder="请输入员工姓名" v-model="list.filter.realName"></el-input>
				  </el-form-item>
				  <el-form-item>
				    <el-button type="primary" @click="search">查询</el-button>
				    <el-button @click="clear">清除查询条件</el-button>
				  </el-form-item>
				</el-form>
  		</el-col>
  	</el-row>
  	<el-table class="l-table-hdbg" stripe element-loading-spinner="el-icon-loading" element-loading-text="拼命加载中" 
  		:data="list.data" v-loading="list.loading">
	    <el-table-column label="账户" prop="orgName"></el-table-column>
	    <el-table-column label="手机号码" prop="phone"></el-table-column>
	    <el-table-column label="真实姓名" prop="realName"></el-table-column>
	    <el-table-column label="系统角色" prop="roleName"></el-table-column>
	    <el-table-column label="所属组织" prop=""></el-table-column>
	    <el-table-column label="岗位名称" prop=""></el-table-column>
	    <el-table-column label="状态" prop="status">
	    	<template slot-scope="scope">
	    		<span v-if="scope.row.isEnable === 1" class="l-text-ok">正常使用</span>
	    		<span v-else class="l-text-error">已禁用</span>
	      </template>
	    </el-table-column>
	    <el-table-column label="操作">
	    	<template slot-scope="scope">
	        <el-button class="l-text-link" type="text" size="small">编辑</el-button>
	        <el-button v-if="scope.row.isEnable === 1" class="l-text-error" type="text" size="small">禁用</el-button>
	        <el-button v-else class="l-text-ok" type="text" size="small">启用</el-button>
	      </template>
	    </el-table-column>
	  </el-table>
	  <el-row class="l-text-center l-margin-t">
	  	<el-pagination layout="total, sizes, prev, pager, next, jumper"
	  	 	@size-change="sizeChange" 
	  	 	@current-change="pageChange" 
	  	 	:page-sizes="$$api.pageSizes"
	  	 	:page-size="list.rows"
	  	 	:current-page="list.page"
	  	 	:total="list.total">
			</el-pagination>
	  </el-row>

	  <!-- 新增/编辑用户 -->
		<el-dialog :title="dialogInfo.title" :visible.sync="dialogInfo.visible" width="653px">
  		<el-form class="l-form1" :inline="true" :model="dialogInfo.data" :rules="dialogInfo.rules" label-width="90px">
			  <el-form-item class="_flex" label="登录账号" prop="phoneNumber" >
			    <el-input v-model="dialogInfo.data.phoneNumber" placeholder="请输入手机号码"></el-input>
			  </el-form-item>
			  <el-form-item label="所属组织" prop="orgId">
			    <el-select v-model="dialogInfo.data.orgId" placeholder="请选择">
			      <el-option label="公司" value="1"></el-option>
			      <el-option label="分公司" value="2"></el-option>
			      <el-option label="门店" value="3"></el-option>
			    </el-select>
			  </el-form-item>
			  <el-form-item label="系统角色" prop="roleId">
			    <el-select v-model="dialogInfo.data.roleId" placeholder="请选择">
			      <el-option label="公司" value="1"></el-option>
			      <el-option label="分公司" value="2"></el-option>
			      <el-option label="门店" value="3"></el-option>
			    </el-select>
			  </el-form-item>
			  <el-form-item label="真实姓名" prop="realName">
			  	<el-input v-model="dialogInfo.data.realName" placeholder=""></el-input>
			  </el-form-item>
			  <el-form-item label="性别" prop="sex">
			  	<el-radio-group v-model="dialogInfo.data.sex">
			      <el-radio label="男"></el-radio>
    				<el-radio label="女"></el-radio>
			    </el-radio-group>
			  </el-form-item>
			  <el-form-item label="出生年月">
			  	<el-date-picker type="month" v-model="dialogInfo.data.birthday"></el-date-picker>
			  </el-form-item>
			  <el-form-item label="身份证号">
			  	<el-input placeholder=""></el-input>
			  </el-form-item>
			  <el-form-item label="入职时间">
			  	<el-date-picker type="date" v-model="dialogInfo.data.joinday"></el-date-picker>
			  </el-form-item>
			  <el-form-item label="基本工资">
			  	<el-input placeholder=""></el-input>
			  </el-form-item>
			</el-form>
			<span slot="footer" class="l-margin-r-m">
				<el-button>取消</el-button>
		    <el-button type="primary">确定提交</el-button>
		  </span>
		</el-dialog>
	</div>
</template>
<script>
export default {
	name: 'base-setting-user',
	data() {
		return {
			list: {
				filter: {
					realName: '',
					orgName: ''
				},
				rules: {
					realName: [],
					orgName: []
				},
				loading: false,
				page: 1,
				rows: 100,
				total: 0,
				data: []
			},
			dialogInfo: {
				title: '新增系统用户',
				visible: false,
				rules: {},
				data: {
					phoneNumber: '',
					orgId: '',
					roleId: '',
					realName: '',
					sex: '',
					birthday: '',
					joinday: ''
				}
			}
		}
	},
	methods: {
		sizeChange(size = 100) {
			this.getList(1, size)
		},
		pageChange(page = 1) {
			this.getList(page)
		},
		getList(page = 1, rows) {
			this.list.loading = true
			this.$$api.user.getList(this.list.filter, page, rows)
			.then(({data}) => {
				this.list.total = data.total
        this.list.page = data.page
        this.list.rows = data.rows
        this.list.data = data.list
			}).finally(() => {
				this.list.loading = false
			})
		},
		search() {
			this.getList()
		},
		clear() {
			this.$refs.listFilter && this.$refs.listFilter.resetFields()
			this.getList()
		},
		showDialogInfo(type = 'new', id) {
			this.dialogInfo.visible = true
		}
	},
	mounted() {
		this.$$event.$on('tab:show', activeName => {
			if(activeName === 'user' && this.list.data.length === 0) {
				this.getList()
			}
		})
	}
}
</script>
<style scoped lang="less">

</style>