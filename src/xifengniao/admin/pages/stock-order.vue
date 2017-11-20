<template>
	<div>
		<el-row>
			<el-col :span="4">
				<el-button type="primary" @click="showDialogInfo('new')">新增订车单</el-button>
			</el-col>
  		<el-col :span="20" class="l-text-right">
  			<el-form inline ref="listFilter" :model="list.filter" :rules="list.rules" @submit.native.prevent @keyup.enter.native="search">
  				<el-form-item>
  					<el-select v-model="list.filter.stockOrdersState" placeholder="订单状态" @change="search()">
				      <el-option label="未支付定金" :value="1"></el-option>
				      <el-option label="已支付定金，待处理" :value="3"></el-option>
				      <el-option label="已处理，待支付尾款" :value="5"></el-option>
				      <el-option label="已支付尾款，待资源出库" :value="7"></el-option>
				      <el-option label="已出库，待签收" :value="9"></el-option>
				      <el-option label="已签收并自动入库" :value="11"></el-option>
				      <el-option label="已取消" :value="0"></el-option>
				    </el-select>
  				</el-form-item>
				  <el-form-item prop="carsName">
				  	<el-input v-model="list.filter.carsName" placeholder="车辆型号"></el-input>
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
	    <el-table-column label="订车单号" prop="phoneNumber"></el-table-column>
	    <el-table-column label="预定车型" prop="customerUsersName"></el-table-column>
	    <el-table-column label="车身颜色" prop="customerUsersName"></el-table-column>
	    <el-table-column label="内饰颜色" prop="phoneNumber"></el-table-column>
	    <el-table-column label="官方指导价" prop="orderState"></el-table-column>
	    <el-table-column label="订车数量" prop="expectWayName"></el-table-column>
	    <el-table-column label="订单状态" prop="stockOrdersState"></el-table-column>
	    <el-table-column label="操作">
	    	<template slot-scope="scope">
	    		<el-button class="l-text-link" type="text" size="small">支付定金</el-button>
	        <el-button class="l-text-link" type="text" size="small">取消订单</el-button>
	        <el-button class="l-text-link" type="text" size="small">支付尾款</el-button>
	        <el-button class="l-text-link" type="text" size="small">签收并自动入库</el-button>
	        <el-button class="l-text-link" type="text" size="small">查看明细</el-button>
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

	  <!-- 新增/编辑订车单 -->
		<el-dialog :close-on-click-modal="false" :close-on-press-escape="false" :before-close="closeDialogInfo"
			:title="dialogInfo.title" :visible.sync="dialogInfo.visible" width="995px">
  		<el-form ref="infoForm" inline class="l-form1" label-width="100px" 
  			:model="dialogInfo.data" :rules="dialogInfo.rules" @keyup.enter.native="submitInfo">
			  <el-form-item class="_flex" label="品牌车型" prop="carsId" style="width: 622px;">
			    <el-cascader style="width: 100%;" :show-all-levels="false" @active-item-change="cascaderItemChange" @change="cascaderChange"
			    	v-model="cascader.value" :options="cascader.data" :props="cascader.props"></el-cascader>
			  </el-form-item>
			  <el-form-item label="车身颜色" prop="colourId" >
			  	<el-select v-model="dialogInfo.data.colourId" placeholder="请选择">
				    <el-option v-for="color in dialogInfo.colorList" :key="color.carColourId" :label="color.carColourName" :value="color.carColourId"></el-option>
				  </el-select>
			  </el-form-item>
			  <el-form-item label="内饰颜色" prop="interiorId" >
			  	<el-select v-model="dialogInfo.data.interiorId" placeholder="请选择">
				    <el-option v-for="neishi in dialogInfo.neishiList" :key="neishi.interiorId" :label="neishi.interiorName" :value="neishi.interiorId"></el-option>
				  </el-select>
			  </el-form-item>
			  <el-form-item label="合格证时间" prop="certificateDate" >
			  	<el-select v-model="dialogInfo.data.certificateDate" placeholder="请选择">
				    <el-option label="随车" :value="1"></el-option>
				    <el-option label="3天内" :value="2"></el-option>
				    <el-option label="7天内" :value="3"></el-option>
				  </el-select>
			  </el-form-item>
			  <el-form-item label="指导价" >
			  	<el-input disabled v-model="dialogInfo.info.price"></el-input>
			  </el-form-item>
			  <el-form-item label="定金/辆" >
			  	<el-input disabled v-model="dialogInfo.info.deposit"></el-input>
			  </el-form-item>
			  <el-form-item label="采购数量" prop="stockOrderNumber" >
			  	<el-input v-model.number="dialogInfo.data.stockOrderNumber" :maxlength="10"></el-input>
			  </el-form-item>
			  <el-form-item class="_flex" label="备注" prop="stockOrderRemarks">
			  	<el-input type="textarea" v-model="dialogInfo.data.stockOrderRemarks" :maxlength="500"></el-input>
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
import viewer from 'v-viewer/src/component.vue'

export default {
	name: 'stock-order',
	components: {
    viewer
  },
	data() {
		let that = this
		let validateCarModel = function(rule, value, callback) {
			if (that.cascader.value.length === 0){
        callback(new Error('必填项'))
      }else{
      	that.dialogInfo.data.carsId = that.cascader.value[2] || ''
        callback()
      }
		}

		return {
			viewer: {
				options: {},
				visible: true,
				images: []
			},
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
					stockOrdersState: '',
					carsName: ''
				},
				rules: {
					stockOrdersState: [],
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
				title: '新增订车单',
				visible: false,
				loading: false,
				colorList: [],
				neishiList: [],
				rules: {
					carsId: [
						{ required: true, validator: validateCarModel, trigger: 'change' }
					],
					colourId: [
						{ required: true, type: 'number', message: '必填项', trigger: 'change' }
					],
					interiorId: [
						{ required: true, type: 'number', message: '必填项', trigger: 'change' }
					],
					certificateDate: [
						{ required: true, type: 'number', message: '必填项', trigger: 'change' }
					],
					stockOrderNumber: [
						{ required: true, type: 'number', message: '必填项', trigger: 'blur' }
					]
				},
				data: {
					carsId: '',
					colourId: '',
					interiorId: '',
					stockOrderNumber: '',
					stockOrderRemarks: '',
					certificateDate: ''
				},
				info: {
					price: '',
					deposit: 3000
				}
			}
		}
	},
	methods: {
		viewerInited(viewer) {
			this.$$viewer = viewer
		},
		cascaderItemChange(valArr) {
			let promise = Promise.resolve()
			let currentBrand = this.cascader.data.filter(brand => brand.id === valArr[0])[0]
      if(valArr.length === 1) { // 获取车系(by brandId)
      	if(currentBrand && currentBrand.children && currentBrand.children.length === 0) {
	      	promise = this.$$api.car.getFamilyList(valArr[0]).then(({data}) => {
	      		let familyList = data.map(family => {
	      			family.children = []
	      			return family
	      		})
	      		currentBrand.children = familyList.length > 0 ? familyList : null
	      		return data
	      	})	
      	}
      }else if(valArr.length === 2) { // 获取车型号
      	let currentFamily = currentBrand.children.filter(family => family.id === valArr[1])[0]
      	if(currentFamily && currentFamily.children && currentFamily.children.length === 0) {
	      	promise = this.$$api.car.getCarsList(valArr[1]).then(({data}) => {
	      		currentFamily.children = data
	      		return data
	      	})	
      	}
      }
      return promise
		},
		cascaderChange(valArr) {
			if(!valArr || valArr.length < 2) return

			// 获取车身颜色和内饰颜色
			this.$$api.color.getCheshenList(valArr[1]).then(({data}) => {
    		this.dialogInfo.colorList = data
    	})
    	this.$$api.color.getNeishiList(valArr[1]).then(({data}) => {
    		this.dialogInfo.neishiList = data
    	})
    	// 获取指导价等信息
    	this.$$api.car.getCarsInfo(valArr[2]).then(({data}) => {
    		this.dialogInfo.info.price = data.price
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
			this.$$api.stock.getOrderList(this.list.filter, page, rows)
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
		showDialogInfo(type = 'new', row) { // 新增订车单
			let brandPromise = this.$$api.car.getBrandList().then(({data}) => {
				this.cascader.data = data.map(item => {
					item.children = []
					return item
				})
				return data
			})
			this.dialogInfo.type = type
			if(type === 'new') {
				this.dialogInfo.title = '新增订车单'
				this.cascader.value = []
				this.$$utils.copyObj(this.dialogInfo.data, '')
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
			this.$$utils.copyObj(this.dialogInfo.data, '')
			this.$refs.infoForm.resetFields()
		},
		submitInfo() { // 提交订车单
			this.$refs.infoForm.validate(valid => {
        if (valid) {
          this.dialogInfo.loading = true
          this.$$api.stock.addOrder(this.dialogInfo.data).then(_ => {
            this.closeDialogInfo()
            this.$message({
							type: 'success',
							message: (this.dialogInfo.type === 'new' ? '新增' : '修改') + '订车单成功'
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
		deleteInfo(row) { // 取消订单
			this.$confirm('是否确定取消订单?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(_ => {
      	row.doing = true
				this.$$api.stock.cancelOrder(row.stockOrderId).then(_ => {
					this.$message({
						type: 'success',
						message: '取消订单成功'
					})
					this.refreshList()
				}).finally(_ => {
					row.doing = false
				})
      })
		}
	},
	mounted() {
		this.$$event.$on('stock:tab', activeName => {
			if(activeName === 'order' && this.list.data.length === 0) {
				this.getList()
			}
		})
	}
}
</script>