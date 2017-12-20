<template>
	<div class="l-main-body l-bg-white">
		<el-row>
  		<el-col :span="24" class="l-text-right">
  			<el-form inline ref="listFilter" :model="list.filter" :rules="list.rules" @submit.native.prevent @keyup.enter.native="search">
				  <el-form-item prop="carsName">
				    <el-select filterable v-model="list.filter.brandId" placeholder="请选择审核状态" @change="search()">
				      <!-- <el-option label="审核状态"></el-option> -->
				    </el-select>
				  </el-form-item>
				  <el-form-item prop="carsName">
				    <el-input placeholder="请输入客户手机号码" auto-complete="on" v-model="list.filter.carsName"></el-input>
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
	    <el-table-column label="客户手机" prop=""></el-table-column>
	    <el-table-column label="客户姓名" prop=""></el-table-column>
	    <el-table-column label="贷款类型" prop=""></el-table-column>
	    <el-table-column label="门店名称" prop=""></el-table-column>
	    <el-table-column label="贷款金额" prop=""></el-table-column>
	    <el-table-column label="还款期数" prop=""></el-table-column>
	    <el-table-column label="车辆是否抵押" prop=""></el-table-column>
	    <el-table-column label="提交时间" prop=""></el-table-column>
	    <el-table-column label="审批状态" prop=""></el-table-column>
	    <el-table-column label="操作">
	    	<template slot-scope="scope">
	        <el-button class="l-text-link" type="text" size="small">查看资料</el-button>
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

	  <!-- 查看资料 -->
		<el-dialog :close-on-click-modal="false" :close-on-press-escape="false" :before-close="closeDialogInfo"
			:title="dialogInfo.title" :visible.sync="dialogInfo.visible" width="995px">
  		
			<span slot="footer" class="l-margin-r-m">
				<el-button @click="closeDialogInfo()">取消</el-button>
		    <el-button type="primary" :loading="dialogInfo.loading" @click="submitDialogInfo">确定提交</el-button>
		  </span>
		</el-dialog>
	</div>
</template>
<script>
export default {
	name: 'bank',
	data() {
		return {
			list: {
				filter: {
					carsName: ''
				},
				rules: {
					carsName: []
				},
				loading: false,
				page: 1,
				rows: 100,
				total: 0,
				data: []
			},
			dialogInfo: {
				type: 'new',
				title: '新增车型资料',
				visible: false,
				loading: false,
				rules: {
					
				},
				data: {
					
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
			this.$$api.car.getList(this.list.filter, page, rows)
			.then(({data}) => {
				this.list.total = data.total
        this.list.page = data.page
        this.list.rows = data.rows
        this.list.data = data.list.map(item => {
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
		showDialogInfo(type = 'new', row) { // 新增/修改车型弹出信息
			let brandPromise = this.$$api.car.getBrandList().then(({data}) => {
				this.cascader.data = data.map(item => {
					item.children = []
					return item
				})
			})
			this.dialogInfo.type = type
			if(type === 'edit') {
				this.dialogInfo.title = '修改车型资料'
				this.$$utils.copyObj(this.dialogInfo.data, row)
				this.cascader.value = [row.brandId, row.familyId, row.styleId]

				if(row.brandId) {
					brandPromise.then(data => {
						this.cascaderChange([row.brandId]).then(_ => {
							if(row.familyId) {
								this.cascaderChange([row.brandId, row.familyId])
							}		
						})
					})
				}
			} else {
				this.dialogInfo.title = '新增车型资料'
				this.resetDialogInfo()
			}

			const loading = this.$loading()
			Promise.all([brandPromise]).then(dataArr =>　{
				this.dialogInfo.visible = true
			}).finally(_ => {
				loading.close()
			})
		},
		closeDialogInfo(done) {
			if(done) {
				done()
			}else{
				this.dialogInfo.visible = false	
			}

			this.$refs.dialogInfoEditor.quill.root.click()
			this.resetDialogInfo()
		},
		resetDialogInfo() {
			this.$refs.infoForm && this.$refs.infoForm.resetFields()
			this.cascader.value = []
			this.$$utils.copyObj(this.dialogInfo.data, '')
		},
		submitDialogInfo() { // 提交车型资料
			this.$refs.infoForm.validate(valid => {
        if (valid) {
          this.dialogInfo.loading = true
          this.dialogInfo.data.pl = this.dialogInfo.data.pl.toUpperCase()
          this.$$api.car.add(this.dialogInfo.data).then(_ => {
            this.closeDialogInfo()
            this.$message({
							type: 'success',
							message: (this.dialogInfo.type === 'new' ? '新增' : '修改') + '车型资料成功'
						})
            this.refreshList()
          }).finally(()=>{
            this.dialogInfo.loading = false
          })  
        }else {
        	this.$message.error('请完善表单信息')
        }
      })
		}
	},
	mounted() {
		// this.getList()
	}
}
</script>