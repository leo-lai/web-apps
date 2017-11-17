<template>
	<div>
		<el-row>
			<el-col :span="6">
				<el-button type="primary" @click="showDialogAdd">新增客户</el-button>
			</el-col>
  		<el-col :span="18" class="l-text-right">
  			<el-form inline ref="listFilter" :model="list.filter" :rules="list.rules" @submit.native.prevent @keyup.enter.native="search">
  				<el-form-item>
  					<el-select v-model="list.filter.orgId" placeholder="请选择公司/门店" @change="search()">
				      <el-option v-for="item in zuzhiList" :key="item.orgId" :label="item.shortName" :value="item.orgId"></el-option>
				    </el-select>
  				</el-form-item>
				  <el-form-item prop="phoneNumber">
				    <el-input placeholder="请输入客户手机号码" v-model="list.filter.phoneNumber"></el-input>
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
	    <el-table-column label="客户手机号" prop="phoneNumber"></el-table-column>
	    <el-table-column label="客户姓名" prop="customerUsersName"></el-table-column>
	    <el-table-column label="意向/购置车辆" prop="intentionCarInfo" min-width="150"></el-table-column>
	    <el-table-column label="销售顾问" prop="systemUserName"></el-table-column>
	    <el-table-column label="最新购车状态" prop="orderState"></el-table-column>
	    <el-table-column label="购车方案" prop="expectWayName" min-width="150"></el-table-column>
	    <el-table-column label="操作">
	    	<template slot-scope="scope">
	        <el-button class="l-text-link" type="text" size="small">查看</el-button>
	        <el-button class="l-text-link" type="text" size="small">编辑</el-button>
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

	  <!-- 新增客户 -->
		<el-dialog :close-on-click-modal="false" :close-on-press-escape="false" :before-close="closeDialogAdd"
			:title="dialogAdd.title" :visible.sync="dialogAdd.visible" width="653px">
  		<el-form ref="addForm" inline class="l-form1" label-width="90px" 
  			:model="dialogAdd.data" :rules="dialogAdd.rules" @keyup.enter.native="submitAdd">
			  <el-form-item label="客户姓名" prop="customerUsersName" >
			    <el-input v-model="dialogAdd.data.customerUsersName" :maxlength="50"></el-input>
			  </el-form-item>
			  <el-form-item label="客户电话" prop="phoneNumber" >
			    <el-input v-model="dialogAdd.data.phoneNumber" :maxlength="11"></el-input>
			  </el-form-item>
			  <el-form-item label="购车意向" prop="carPurchaseIntention" >
			  	<el-select v-model="dialogAdd.data.carPurchaseIntention" placeholder="请选择">
				    <el-option label="随车" :value="1"></el-option>
				    <el-option label="3天内" :value="2"></el-option>
				    <el-option label="7天内" :value="3"></el-option>
				  </el-select>
			  </el-form-item>
			  <el-form-item label="购车方式" prop="expectWayId" >
			  	<el-select v-model="dialogAdd.data.expectWayId" placeholder="请选择">
				    <el-option label="全款" :value="1"></el-option>
				    <el-option label="分期" :value="2"></el-option>
				  </el-select>
			  </el-form-item>
			  <el-form-item class="_flex" label="意向车辆" prop="intentionCarId" >
			  	<el-cascader style="width: 100%;" :show-all-levels="false" @active-item-change="cascaderChange"
			    	v-model="cascader.value" :options="cascader.data" :props="cascader.props"></el-cascader>
			  </el-form-item>
			  <el-form-item class="_flex" label="备注" prop="remark">
			  	<el-input type="textarea" v-model="dialogAdd.data.remark" :maxlength="500"></el-input>
			  </el-form-item>
			  <el-form-item label="销售顾问" prop="systemUserId" >
			  	<el-select filterable v-model="dialogAdd.data.systemUserId" placeholder="请选择">
				    <el-option v-for="user in dialogAdd.salesList" :label="user.systemUserName" :value="user.systemUserId"></el-option>
				  </el-select>
			  </el-form-item>
			</el-form>
			<span slot="footer" class="l-margin-r-m">
				<el-button @click="closeDialogAdd()">取消</el-button>
		    <el-button type="primary" :loading="dialogAdd.loading" @click="submitAdd">确定提交</el-button>
		  </span>
		</el-dialog>
	</div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
	name: 'customer-track',
	data() {
		let that = this
		let validateCarModel = function(rule, value, callback) {
			if (that.cascader.value.length === 0){
        callback(new Error('必填项'))
      }else{
      	that.dialogAdd.data.intentionCarId = that.cascader.value[2] || ''
        callback()
      }
		}
		return {
			cascader: {
				value: [],
				data: [],
        props: {
        	label: 'name',
          value: 'id',
          children: 'children'
        }
			},
			list: {
				filter: {
					phoneNumber: '',
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
			dialogAdd: {
				title: '新增客户',
				visible: false,
				loading: false,
				salesList: [],
				rules: {
					customerUsersName: [
						{ required: true, message: '必填项', trigger: 'blur' }
					],
					phoneNumber: [
						{ required: true, message: '必填项', trigger: 'blur' },
						{ pattern: /^1\d{10}$/, message: '请输入正确的手机号码', trigger: 'blur' }
					],
					carPurchaseIntention: [
						{ required: true, type:'number', message: '必填项', trigger: 'change' }
					],
					intentionCarId: [
						{ required: true, validator: validateCarModel, trigger: 'change' }
					],
					expectWayId: [
						{ required: true, type:'number', message: '必填项', trigger: 'change' }
					],
					systemUserId: [
						{ required: true, type:'number', message: '必填项', trigger: 'change' }
					]
				},
				data: {
					customerUsersName: '',
					phoneNumber: '',
					carPurchaseIntention: '',
					intentionCarId: '',
					expectWayId: '',
					remarks: '',
					systemUserId: ''
				}
			}
		}
	},
	computed: {
		...mapGetters([
  		'zuzhiList',
  		'userInfo'
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
			this.$$api.customer.getTrackList(this.list.filter, page, rows)
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
		cascaderChange(valArr) { // 意向车型
			let promise = null
			let currentBrand = this.cascader.data.filter(brand => brand.id === valArr[0])[0]
      if(valArr.length === 1) { // 获取车系(by brandId)
      	if(currentBrand && currentBrand.children && currentBrand.children.length === 0) {
	      	promise = this.$$api.car.getFamilyList(valArr[0]).then(({data}) => {
	      		let familyList = data.map(family => {
	      			family.children = []
	      			return family
	      		})
	      		currentBrand.children = familyList
	      		return data
	      	})	
      	}
      }else if(valArr.length === 2) { // 获取车大类
      	let currentFamily = currentBrand.children.filter(family => family.id === valArr[1])[0]
      	if(currentFamily && currentFamily.children && currentFamily.children.length === 0) {
	      	promise = this.$$api.car.getCarsList(valArr[1]).then(({data}) => {
	      		currentFamily.children = data
	      		return data
	      	})	
      	}
      }else {
      	promise = Promise.resolve()
      }
      return promise
		},
		showDialogAdd() { // 新增客户
			let brandPromise = this.$$api.car.getBrandList().then(({data}) => {
				this.cascader.data = data.map(item => {
					item.children = []
					return item
				})
				return data
			})

			let salesPromise = this.$$api.user.getSalesList().then(({data}) => {
				this.dialogAdd.salesList = data
				return data
			})

			const loading = this.$loading()
			Promise.all([brandPromise, salesPromise]).then(dataArr =>　{
				this.dialogAdd.data.systemUserId = this.userInfo.userId
				this.dialogAdd.visible = true
			}).finally(_ => {
				loading.close()
			})
		},
		closeDialogAdd(done) {
			if(done) {
				done()
			}else{
				this.dialogAdd.visible = false	
			}
			this.$$utils.copyObj(this.dialogAdd.data, '')
			this.$refs.addForm.resetFields()
		},
		submitAdd() { // 提交客户
			this.$refs.addForm.validate(valid => {
        if (valid) {
          this.dialogAdd.loading = true
          this.$$api.customer.add(this.dialogAdd.data).then(_ => {
            this.closeDialogAdd()
            this.$message({
							type: 'success',
							message: '新增客户成功'
						})
            this.refreshList()
          }).finally(()=>{
            this.dialogAdd.loading = false
          })  
        }else {
        	this.$message({
						type: 'error',
						message: '请完善表单信息'
					})
        }
      })
		}
	},
	mounted() {
		this.$$event.$on('customer:tab', activeName => {
			if(activeName === 'track' && this.list.data.length === 0) {
				this.getList()
				this.$store.dispatch('getZuzhiList')
			}
		})
	}
}
</script>