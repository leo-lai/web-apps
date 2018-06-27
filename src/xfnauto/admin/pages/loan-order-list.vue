<template>
	<div>
		<el-row>
  		<el-col :span="8">
  			<el-button type="primary" @click="showDialogInfo('new')">设置默认手续费率</el-button>
  		</el-col>
  		<el-col :span="16" class="l-text-right">
  			<el-form inline ref="listFilter" :model="list.filter" :rules="list.rules" @submit.native.prevent @keyup.enter.native="search">
				  <el-form-item prop="orgName">
				    <el-input placeholder="请输入组织名称" v-model="list.filter.orgName"></el-input>
				  </el-form-item>
				  <el-form-item prop="keywords">
				    <el-input placeholder="请输入仓库名称" v-model="list.filter.keywords"></el-input>
				  </el-form-item>
				  <el-form-item>
				    <el-button type="primary" @click="search">查询</el-button>
				    <el-button type="danger" @click="clear">刷新</el-button>
						<el-button :loading="exceling" type="plain" @click="toExcel">导出excel</el-button>
				  </el-form-item>
				</el-form>
  		</el-col>
  	</el-row>
  	<el-table class="l-table-hdbg" stripe element-loading-spinner="el-icon-loading" element-loading-text="拼命加载中" 
  		:data="list.data" v-loading="list.loading">
	    <el-table-column class-name="l-fs-xs" label="垫资单号" prop="orderId" width="180"></el-table-column>
	    <el-table-column class-name="l-fs-xs" label="门店名称" prop="orgName" width="220"></el-table-column>
	    <el-table-column class-name="l-fs-xs" label="申请时间" prop="createTime" width="120" align="center"></el-table-column>
	    <el-table-column label="本金总额(元)" prop="amount" width="120" align="center"></el-table-column>
	    <el-table-column label="手续费总额(元)" prop="fee" width="120" align="center"></el-table-column>
	    <el-table-column label="待还总额(元)" prop="" width="120" align="center"></el-table-column>
	    <el-table-column label="垫资期限(元)" prop="" width="120" align="center"></el-table-column>
	    <el-table-column label="状态" prop="stateName" width="120" align="center"></el-table-column>
	    <el-table-column label="操作" width="200" fixed="right" align="center">
	    	<template slot-scope="scope">
	        <span v-show="scope.row.doing" class="l-text-warn"><i class="el-icon-loading"></i>&nbsp;操作中</span>
	        <span v-show="!scope.row.doing">
	        	<el-button class="l-text-link" type="text" size="small" @click="showDialogInfo('edit', scope.row)">查看</el-button>
	        </span>
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

	  <!-- 新增/编辑仓库 -->
		<el-dialog :close-on-click-modal="false" :close-on-press-escape="false" :before-close="closeDialogInfo"
			:title="dialogInfo.title" :visible.sync="dialogInfo.visible" width="480px">
  		<el-form ref="infoForm" label-width="100px" style="width: 432px;"
  			:model="dialogInfo.data" :rules="dialogInfo.rules" @submit.native.prevent @keyup.enter.native="submitDialogInfo">
			  <el-form-item class="_flex" label="仓库名称" prop="name" >
			    <el-input v-model="dialogInfo.data.name" :maxlength="50"></el-input>
			  </el-form-item>
			  <el-form-item label="备注" prop="remark">
			  	<el-input type="textarea" v-model="dialogInfo.data.remark" :maxlength="500"></el-input>
			  </el-form-item>
			</el-form>
			<span slot="footer" class="l-margin-r-m">
				<el-button @click="closeDialogInfo()">取消</el-button>
		    <el-button type="primary" :loading="dialogInfo.loading" @click="submitDialogInfo">确定提交</el-button>
		  </span>
		</el-dialog>
	</div>
</template>
<script>
export default {
	name: 'loan-order-list',
	data() {
		return {
			exceling: false,
			list: {
				filter: {
					keywords: '',
					orgName: ''
				},
				rules: {
					keywords: [],
					orgName: []
				},
				loading: false,
				page: 1,
				rows: 10,
				total: 0,
				data: []
			},
			dialogInfo: {
				type: 'new',
				title: '新增仓库',
				visible: false,
				loading: false,
				rules: {
					name: [
						{ required: true, message: '必填项', trigger: 'blur' }
					]
				},
				data: {
					id: '',
					name: '',
					remark: ''
				}
			}
		}
	},
	methods: {
		toExcel() {
			this.exceling = true
			this.$$api.order.toExcel(this.list.filter).then(({data}) => {
				window.location.href = data.url
			}).finally(_ => {
				this.exceling = false
			})
		},
		sizeChange(size = 100) {
			this.getList(1, size)
		},
		pageChange(page = 1) {
			this.getList(page)
		},
		getList(page = 1, rows) {
			this.list.loading = true
			this.$$api.loan.getOrderList(this.list.filter, page, rows || this.list.rows)
			.then(({data}) => {
				this.list.total = data.total
        this.list.page = data.page
        this.list.rows = data.rows
        this.list.data = data.list.map(item => {
          item.name = item.warehouseName
        	item.doing = false
        	return item
        })
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
		showDialogInfo(type = 'new', row) { // 新增/修改仓库
			this.dialogInfo.type = type
			if(type === 'edit') {
				this.dialogInfo.title = '修改仓库信息'
				this.$$utils.copyObj(this.dialogInfo.data, row)
			} else {
				this.dialogInfo.title = '新增仓库'
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
		submitDialogInfo() { // 提交仓库
			this.$refs.infoForm.validate(valid => {
        if (valid) {
          this.dialogInfo.loading = true
          let promise = this.dialogInfo.data.id ? this.$$api.cang.edit(this.dialogInfo.data) : this.$$api.cang.add(this.dialogInfo.data)
          promise.then(_ => {
            this.closeDialogInfo()
            this.$message({
							type: 'success',
							message: (this.dialogInfo.data.id ? '修改' : '新增') + '仓库成功'
						})
            this.refreshList()
          }).finally(()=>{
            this.dialogInfo.loading = false
          })  
        }else {
        	this.$message({
						type: 'error',
						message: '请完善表单信息'
					})
        }
      })
		},
		deleteInfo(row) { // 禁用/启用仓库
			this.$confirm('是否确定删除该仓库？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(_ => {
      	row.doing = true
				this.$$api.cang.del(row.id).then(_ => {
					this.$message({
						type: 'success',
						message: '删除仓库成功'
					})
					this.refreshList()
				}).finally(_ => {
					row.doing = false
				})
      })
		}
	},
	mounted() {
		this.$$event.$on('loan:tab', activeName => {
			if(activeName === 'loan-order' && this.list.data.length === 0) {
				this.getList()
			}
		})
	},
	beforeDestroy() {
		this.$$event.$off('loan:tab')
	}
}
</script>