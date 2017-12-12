<template>
	<div>
		<el-row>
  		<el-col :span="24" class="l-text-right">
  			<el-form inline ref="listFilter" :model="list.filter" :rules="list.rules" @submit.native.prevent @keyup.enter.native="search">
  				<el-form-item>
  					<el-select v-model="list.filter.orgId" placeholder="请选择公司/门店" @change="search()">
				      <el-option v-for="item in zuzhiList" :key="item.orgId" :label="item.shortName" :value="item.orgId"></el-option>
				    </el-select>
  				</el-form-item>
				  <el-form-item prop="dateRange">
				  	<el-input placeholder="请输入订单号" v-model="list.filter.stockOrderCode"></el-input>
				  </el-form-item>
				  <el-form-item>
				    <el-button type="primary" @click="search">查询</el-button>
				    <el-button @click="clear">刷新</el-button>
				  </el-form-item>
				</el-form>
  		</el-col>
  	</el-row>
  	<el-table class="l-table-hdbg" stripe element-loading-spinner="el-icon-loading" element-loading-text="拼命加载中" 
  		:data="list.data" v-loading="list.loading">
	    <el-table-column label="订单号" prop="stockOrderCode"></el-table-column>
	    <el-table-column label="落定客户" prop="customerUsersName"></el-table-column>
	    <el-table-column label="下单时间" prop="customerUsersName"></el-table-column>
	    <el-table-column label="预定车辆" prop="carsName"></el-table-column>
	    <el-table-column label="车身颜色" prop="colourName"></el-table-column>
	    <el-table-column label="内饰颜色" prop="interiorName"></el-table-column>
	    <el-table-column label="订单数量" prop="stockOrderNumber"></el-table-column>
	    <el-table-column label="订单状态" prop="stockOrderState"></el-table-column>
	    <el-table-column label="出库状态" prop="stockOrderState"></el-table-column>
	    <el-table-column label="操作">
	    	<template slot-scope="scope">
	    		<el-button class="l-text-link" type="text" size="small">出库车辆</el-button>
	        <!-- <el-button class="l-text-link" type="text" size="small">编辑</el-button> -->
	        <!-- <el-button class="l-text-link" type="text" size="small">打印单据</el-button> -->
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

	</div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
	name: 'customer-bespeak',
	data() {
		return {
			dateOptions: {
				shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
			},
			list: {
				filter: {
					dateRange: '',
					orgId: ''
				},
				rules: {
					phoneNumber: [],
					orgId: []
				},
				loading: false,
				page: 1,
				rows: 100,
				total: 0,
				data: []
			},
			dialogInfo: {
				type: 'new',
				title: '新增客户',
				visible: false,
				loading: false,
				rules: {
					carsName: [
						{ required: true, message: '必填项', trigger: 'blur' }
					],
					phoneNumber: [
						{ required: true, message: '必填项', trigger: 'blur' }
					],
					orgId: [
						{ required: true, type: 'number', message: '必填项', trigger: 'blur' }
					]
				},
				data: {
					supplierId: '',
					carsName: '',
					phoneNumber: '',
					orgId: '',
					remark: ''
				}
			}
		}
	},
	computed: {
		...mapGetters([
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
			this.$$api.customer.getBespeakList(this.list.filter, page, rows)
			.then(({data}) => {
				this.list.total = data.total
        this.list.page = data.page
        this.list.rows = data.rows
        this.list.data = data.list.map(item => {
        	item.deling = false
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
			this.dialogInfo.type = type
			if(type === 'edit') {
				this.dialogInfo.title = '修改客户'
				this.$$utils.copyObj(this.dialogInfo.data, row)
			} else {
				this.dialogInfo.title = '新增客户'
				this.$$utils.copyObj(this.dialogInfo.data, '')
			}

			const loading = this.$loading()
			Promise.all([
				this.$store.dispatch('getZuzhiList')
			]).then(dataArr =>　{
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
			this.$$utils.copyObj(this.dialogInfo.data, '')
			this.$refs.infoForm.resetFields()
		},
		submitDialogInfo() { // 提交客户
			this.$refs.infoForm.validate(valid => {
        if (valid) {
          this.dialogInfo.loading = true
          this.$$api.supplier.add(this.dialogInfo.data).then(_ => {
            this.closeDialogInfo()
            this.$message({
							type: 'success',
							message: (this.dialogInfo.type === 'new' ? '新增' : '修改') + '客户成功'
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
		deleteInfo(row) { // 禁用/启用车型
			this.$confirm('是否确定删除该客户?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(_ => {
      	row.deling = true
				this.$$api.supplier.del(row.supplierId).then(_ => {
					this.$message({
						type: 'success',
						message: '删除客户成功'
					})
					this.refreshList()
				}).finally(_ => {
					row.deling = false
				})
      })
		}
	},
	mounted() {
		this.$$event.$on('customer:tab', activeName => {
			if(activeName === 'bespeak' && this.list.data.length === 0) {
				this.getList()
				this.$store.dispatch('getZuzhiList')
			}
		})
	}
}
</script>