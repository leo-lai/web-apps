<template>
	<div>
		<el-row>
  		<el-col :span="4">
  			<el-button type="primary" @click="showDialogInfo('new')">新增角色</el-button>
  		</el-col>
  		<el-col :span="20" class="l-text-right">
				<el-form inline ref="listFilter" :model="list.filter" :rules="list.rules" @submit.native.prevent @keyup.enter.native="search">
					<el-form-item v-if="userInfo.orgLevel === 1" prop="orgId">
  					<el-select v-model="list.filter.orgId" filterable placeholder="请选择所属组织" @change="search()">
				      <el-option v-for="item in zuzhiList" :key="item.orgId" :label="item.shortName" :value="item.orgId"></el-option>
				    </el-select>
  				</el-form-item>
				  <el-form-item prop="orgName">
				    <el-input placeholder="请输入角色名称" v-model="list.filter.roleName"></el-input>
				  </el-form-item>
				  <el-form-item>
				    <el-button type="primary" @click="search">查询</el-button>
				    <el-button type="danger" @click="clear">刷新</el-button>
				  </el-form-item>
				</el-form>
  		</el-col>
  	</el-row>
  	<el-table class="l-table-hdbg" stripe element-loading-spinner="el-icon-loading" element-loading-text="拼命加载中" 
  		:data="list.data" v-loading="list.loading">
	    <el-table-column label="系统角色" prop="roleName" width="150px"></el-table-column>
	    <el-table-column label="所属组织" prop="orgName" min-width="150px"></el-table-column>
	    <el-table-column label="备注" prop="remark" min-width="150px"></el-table-column>
	    <el-table-column label="操作" align="center" width="200px">
	    	<template slot-scope="scope">
	        <el-button class="l-text-link" type="text" size="small" @click="showDialogInfo('edit', scope.row)">编辑</el-button>
	        <el-button class="l-text-warn" type="text" size="small" @click="showDialogMenu(scope.row)">配置权限</el-button>
					<el-button class="l-text-error" type="text" size="small" @click="deleteInfo(scope.row)">删除</el-button>
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

	  <!-- 新增/编辑角色 -->
		<el-dialog :close-on-click-modal="false" :close-on-press-escape="false" :before-close="closeDialogInfo"
			:title="dialogInfo.title" :visible.sync="dialogInfo.visible" width="480px">
  		<el-form ref="infoForm" label-width="90px" style="width: 432px;"
  			:model="dialogInfo.data" :rules="dialogInfo.rules" @keyup.enter.native="submitDialogInfo">
				<el-form-item label="所属组织" prop="orgId">
					<el-select style="width: 100%;" v-model="dialogInfo.data.orgId" placeholder="请选择">
						<el-option v-for="item in zuzhiList" :key="item.orgId" :label="item.shortName" :value="item.orgId"></el-option>
					</el-select>
				</el-form-item>
			  <el-form-item label="角色名称" prop="roleName">
			    <el-input v-model="dialogInfo.data.roleName" placeholder="请填写" :maxlength="50"></el-input>
			  </el-form-item>
			  <el-form-item label="备注信息" prop="remark">
			  	<el-input type="textarea" v-model="dialogInfo.data.remark" :maxlength="500"></el-input>
			  </el-form-item>
			</el-form>
			<span slot="footer" class="l-margin-r-m">
				<el-button @click="closeDialogInfo()">取消</el-button>
		    <el-button type="primary" :loading="dialogInfo.loading" @click="submitDialogInfo">确定提交</el-button>
		  </span>
		</el-dialog>

		<!-- 配置权限菜单 -->
		<el-dialog :close-on-click-modal="false" :close-on-press-escape="false" :before-close="closeDialogMenu"
			:title="dialogMenu.title" :visible.sync="dialogMenu.visible" width="600px">
			<div class="l-scroll" style="max-height: 400px; margin: -20px 0;">
				<el-tree ref="menuTree" show-checkbox  default-expand-all highlight-current node-key="id"
				  :data="dialogMenu.menuList" :props="dialogMenu.props">
				</el-tree>	
			</div>
			<span slot="footer" class="l-margin-r-m">
				<el-button @click="closeDialogMenu()">取消</el-button>
		    <el-button type="primary" :loading="dialogMenu.loading" @click="submitDialogMenu">确定提交</el-button>
		  </span>
		</el-dialog>
	</div>
</template>
<script>
import { mapGetters } from 'vuex'

function getCheckedKeys(nodeArray = []) {
	let keys = []
	nodeArray.forEach(node => {
		if(node.checked || node.indeterminate) {
			keys.push(node.data.id)
		}

		if(node.childNodes && node.childNodes.length > 0) {
			keys = keys.concat(getCheckedKeys(node.childNodes))
		}
	})
	return keys
}

function getLeafMenuIds(nodeArray = []) {
	let menuIds = []
	nodeArray && nodeArray.forEach(node => {
		if(node.children && node.children.length > 0) {
			menuIds = menuIds.concat(getLeafMenuIds(node.children))
		} else {
			menuIds.push(node.id)
		}
	})
	return menuIds
}
export default {
	name: 'base-setting-user',
	data() {
		return {
			list: {
				filter: {
					roleName: '',
					orgId: '',
				},
				rules: {
					roleName: [],
					orgId: []
				},
				loading: false,
				page: 1,
				rows: 10,
				total: 0,
				data: []
			},
			dialogInfo: {
				type: 'new',
				title: '新增系统角色',
				visible: false,
				loading: false,
				rules: {
					orgId: [
						{ required: true, message: '必选项', trigger: 'change' }
					],
					roleName: [
						{ required: true, message: '必填项', trigger: 'blur' }
					],
					remark: []
				},
				data: {
					id: '',
					orgId: '',
					roleName: '',
					remark: ''
				}
			},
			dialogMenu: {
				title: '配置权限',
				visible: false,
				loading: false,
				props: {
          children: 'children',
          label: 'name'
        },
				menuList: [],
				checkedList: [],
				data: {
					roleId: '',
					lists: ''
				}
			}
		}
	},
	computed: {
		...mapGetters([
			'userInfo',
  		'zuzhiList'
    ])
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
			this.$$api.role.getList(this.list.filter, page, rows || this.list.rows)
			.then(({data}) => {
				this.list.total = data.total
        this.list.page = data.page
        this.list.rows = data.rows
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
				this.dialogInfo.title = '修改系统角色'
				this.$$utils.copyObj(this.dialogInfo.data, row)
			} else {
				this.dialogInfo.title = '新增系统角色'
				this.resetDialogInfo()
			}
			this.dialogInfo.visible = true	
		},
		closeDialogInfo(done) {
			if(done) {
				done()
			}else{
				this.dialogInfo.visible = false	
			}
			this.resetDialogInfo()
		},
		resetDialogInfo() {
			this.$refs.infoForm && this.$refs.infoForm.resetFields()
			this.$$utils.copyObj(this.dialogInfo.data, '')
		},
		submitDialogInfo() { // 提交角色信息
			this.$refs.infoForm.validate(valid => {
        if (valid) {
					this.dialogInfo.loading = true
					let promise = this.dialogInfo.type === 'edit' ? this.$$api.role.edit(this.dialogInfo.data) : this.$$api.role.add(this.dialogInfo.data)
          promise.then(_ => {
            this.closeDialogInfo()
            this.$message({
							type: 'success',
							message: (this.dialogInfo.type === 'edit' ? '修改' : '新增') + '角色成功'
						})
            this.refreshList()
          }).finally(()=>{
            this.dialogInfo.loading = false
          })  
        }
      })
		},
		getMenuList(roleId) {
			return new Promise((resolve, reject) => {
				if(!roleId) {
					if(this.dialogMenu.menuList.length === 0) {
						this.$$api.role.getMenuList().then(({data}) => {
							this.dialogMenu.menuList = data || []
							resolve(this.dialogMenu.menuList)
						}, reject)
					}else {
						resolve(this.dialogMenu.menuList)
					}
				} else {
					this.$$api.role.getMenuList(roleId).then(({data}) => {
						resolve(getLeafMenuIds(data))
					}, reject)
				}
			})
		},
		showDialogMenu(row) {
			const loading = this.$loading()
			this.dialogMenu.data.roleId = row.id
			this.getMenuList(row.id).then(data => {
				loading.close()
				this.dialogMenu.visible = true
				setTimeout(_ => {
					this.dialogMenu.title = '配置权限：' + row.roleName
					this.$refs.menuTree.setCheckedKeys(data)	
				}, 50)
			}).catch(_ => {
				loading.close()
			})
		},
		closeDialogMenu(done) {
			if(done) {
				done()
			} else {
				this.dialogMenu.visible = false	
			}
			this.$refs.menuTree.setCheckedKeys([])
		},
		submitDialogMenu() {
			this.dialogMenu.data.lists = getCheckedKeys(this.$refs.menuTree.root.childNodes).join(',')
			if(!this.dialogMenu.data.lists) {
				this.$message({
					type: 'error',
					message: '请配置权限'
				})
				return
			}
			this.dialogMenu.loading = true
			this.$$api.role.setMenuList(this.dialogMenu.data).then(_ => {
				this.closeDialogMenu()
        this.$message({
					type: 'success',
					message: '配置权限成功'
				})
        this.refreshList()
			}).finally(_ => {
				this.dialogMenu.loading = false
			})
		},
		deleteInfo(row) { // 删除角色
			this.$confirm('是否确定删除该角色?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(_ => {
      	row.doing = true
				this.$$api.role.del(row.id).then(_ => {
					this.$message({
						type: 'success',
						message: '删除角色成功'
					})
					this.refreshList()
				}).finally(_ => {
					row.doing = false
				})
      })
		},
	},
	mounted() {
		this.$$event.$on('base-setting:tab', activeName => {
			if(activeName === 'role' && this.list.data.length === 0) {
				this.getMenuList()
				this.getList()

				if(this.userInfo.orgLevel == 1) {
					this.$store.dispatch('getZuzhiList')
				}
			}
		})
	},
	beforeDestroy() {
		this.$$event.$off('base-setting:tab')
	}
}
</script>