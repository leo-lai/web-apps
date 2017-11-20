<template>
	<div class="l-main-body">
		<el-row class="l-margin-b">
  		<el-col :span="4">
  			<el-button type="primary" @click="showDialogInfo('new')">录入商户</el-button>
  		</el-col>
  		<el-col :span="20" class="l-text-right">
  			<el-form inline ref="listFilter" :model="list.filter" :rules="list.rules" @submit.native.prevent>
  				<el-form-item prop="phoneNumber" lalel="">
				    <el-input placeholder="商家姓名" v-model="list.filter.name"></el-input>
				  </el-form-item>
				  <el-form-item prop="phoneNumber" lalel="">
				    <el-input placeholder="手机号码" v-model="list.filter.tel"></el-input>
				  </el-form-item>
				  <el-form-item prop="brandId" label="">
				  	<el-select v-model="list.filter.guanlian" placeholder="是否有设备" @change="search()">
				      <el-option label="是" :value="1"></el-option>
				      <el-option label="否" :value="0"></el-option>
				    </el-select>
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
	    <el-table-column label="商户姓名" prop="phoneNumber"></el-table-column>
	    <el-table-column label="状态" prop="customerUsersName"></el-table-column>
	    <el-table-column label="拥有设备" prop="intentionCarInfo"></el-table-column>
	    <el-table-column label="手机号码" prop="systemUserName"></el-table-column>
	    <el-table-column label="操作">
	    	<template slot-scope="scope">
	    		<el-button class="l-text-link" type="text" size="small">编辑</el-button>
	      </template>
	    </el-table-column>
	  </el-table>
	  <el-row class="l-text-center l-margin-t">
	  	<el-pagination layout="total, sizes, prev, pager, next, jumper"
	  	 	@size-change="sizeChange" 
	  	 	@current-change="pageChange" 
	  	 	:page-sizes="$$api.pageSizes"
	  	 	:page-size="list.row"
	  	 	:current-page="list.page"
	  	 	:total="list.total">
			</el-pagination>
	  </el-row>

	  <!-- 新增/编辑角色 -->
		<el-dialog :close-on-click-modal="false" :close-on-press-escape="false" :before-close="closeDialogInfo"
			:title="dialogInfo.title" :visible.sync="dialogInfo.visible" width="480px">
  		<el-form ref="infoForm" label-width="70px" style="width: 432px;"
  			:model="dialogInfo.data" :rules="dialogInfo.rules" @keyup.enter.native="submitInfo">
			  <el-form-item label="姓名" prop="roleName">
			    <el-input v-model="dialogInfo.data.roleName" :maxlength="50"></el-input>
			  </el-form-item>
			  <el-form-item label="账号" prop="roleName">
			    <el-input v-model="dialogInfo.data.roleName" :maxlength="50"></el-input>
			  </el-form-item>
			  <el-form-item label="密码" prop="roleName">
			    <el-input v-model="dialogInfo.data.roleName" :maxlength="50"></el-input>
			  </el-form-item>
			  <el-form-item label="地区" prop="roleName">
			    <el-input v-model="dialogInfo.data.roleName" :maxlength="50"></el-input>
			  </el-form-item>
			  <el-form-item label="权限" prop="roleName">
			    <el-input v-model="dialogInfo.data.roleName" :maxlength="50"></el-input>
			  </el-form-item>
			</el-form>
			<span slot="footer" class="l-margin-r-m">
				<el-button @click="closeDialogInfo()">取消</el-button>
		    <el-button type="primary" :loading="dialogInfo.loading" @click="submitInfo">确定提交</el-button>
		  </span>
		</el-dialog>
	</div>
</template>
<script>
export default {
	data() {
		return {
			list: {
				filter: {
					tel: '',
					name: '',
					guanlian: ''
				},
				rules: {
					tel: [],
					name: [],
					guanlian: []
				},
				loading: false,
				page: 1,
				row: 100,
				total: 0,
				data: []
			},
			dialogInfo: {
				type: 'new',
				title: '新增用户',
				visible: false,
				loading: false,
				rules: {
					roleName: [
						{ required: true, message: '必填项', trigger: 'blur' }
					]
				},
				data: {
					roleId: '',
					roleName: '',
					remark: ''
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
		getList(page = 1, row) {
			this.list.loading = true
			this.$$api.business.getList(this.list.filter, page, row)
			.then(({data}) => {
				this.list.total = data.count
        this.list.page = Number(data.per_page)
        this.list.row = Number(data.page_number)
        this.list.data = data.list
			}).finally(_ => {
				this.list.loading = false
			})
		},
		refreshList() {
			this.getList(this.list.page)
		},
		search() {
			this.getList()
		},
		clear() {
			this.$refs.listFilter && this.$refs.listFilter.resetFields()
			this.getList()
		},
		showDialogInfo(type = 'new', row) { // 新增/修改角色弹出信息
			this.dialogInfo.type = type
			if(type === 'edit') {
				this.dialogInfo.title = '修改用户'
				this.$$utils.copyObj(this.dialogInfo.data, row)
			} else {
				this.dialogInfo.title = '新增用户'
				this.$$utils.copyObj(this.dialogInfo.data, '')
			}
			this.dialogInfo.visible = true	
		},
		closeDialogInfo(done) {
			if(done) {
				done()
			}else{
				this.dialogInfo.visible = false	
			}
			this.$$utils.copyObj(this.dialogInfo.data, '')
			this.$refs.infoForm.resetFields()	
		},
		submitInfo() { // 提交角色信息
			this.$refs.infoForm.validate(valid => {
        if (valid) {
          this.dialogInfo.loading = true
          this.$$api.role.add(this.dialogInfo.data).then(_ => {
            this.closeDialogInfo()
            this.$message({
							type: 'success',
							message: (this.dialogInfo.type === 'new' ? '新增' : '修改') + '用户信息成功'
						})
            this.refreshList()
          }).finally(()=>{
            this.dialogInfo.loading = false
          })  
        }
      })
		}
	},
	mounted() {
		this.getList()
	}
}
</script>
