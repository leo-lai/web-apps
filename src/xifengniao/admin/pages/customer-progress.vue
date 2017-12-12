<template>
	<div>
		<div v-if="!data.orderState" style="padding: 150px 0 0 0; text-align:center;">
			<el-button style="width: 120px;" type="primary" @click="showDialogInfo('new')">开单</el-button>
		</div>
		<div v-else-if="data.orderState === 1" style="padding: 150px 0 0 0; text-align:center;">
			<p class="l-fs">待客户支付定金</p>
			<p style="margin-top: 50px;">
				<el-button style="width: 120px;" @click="showDialogInfo('edit')">编辑订单</el-button>
				<el-button style="width: 120px;" type="primary">支付定金</el-button>
			</p>
		</div>
		<div class="l-margin l-text-center"><el-button class="l-text-link" type="text">查看购车历程</el-button></div>

		<!-- 开单 -->
		<el-dialog class="l-padding-t-0" append-to-body :close-on-click-modal="false" :close-on-press-escape="false" :before-close="closeDialogInfo" :title="dialogInfo.title" :visible.sync="dialogInfo.visible" width="995px">
  		<el-form ref="infoForm" inline class="l-form1" label-width="100px" 
  			:model="dialogInfo.data" :rules="dialogInfo.rules" @keyup.enter.native="submitDialogInfo">
  			<div class="l-form1-row">
					<el-form-item prop="systemUserId" >
						<b slot="label">销售顾问</b>
				  	<el-select filterable v-model="dialogInfo.data.systemUserId" placeholder="请选择">
					    <el-option v-for="user in dialogInfo.salesList" :key="user.systemUserId" :label="user.systemUserName" :value="user.systemUserId"></el-option>
					  </el-select>
				  </el-form-item>
  			</div>
  			<div class="l-form1-row">
  				<div class="_tit"><b>订单信息</b></div>
  				<div class="_cont">
  					<el-form-item class="_flex" label="车辆型号" prop="carsId" style="width: 605px;">
					    <el-cascader style="width: 100%;" :show-all-levels="false" @active-item-change="cascaderItemChange" @change="cascaderChange"
					    	v-model="cascader.value" :options="cascader.data" :props="cascader.props"></el-cascader>
					  </el-form-item>
					  <el-form-item label="车身颜色" prop="colourId">
					  	<el-select v-model="dialogInfo.data.colourId" placeholder="请选择">
						    <el-option v-for="color in dialogInfo.colorList" :key="color.carColourId" :label="color.carColourName" :value="color.carColourId"></el-option>
						  </el-select>
					  </el-form-item>
					  <el-form-item label="内饰颜色" prop="interiorId" >
					  	<el-select v-model="dialogInfo.data.interiorId" placeholder="请选择">
						    <el-option v-for="neishi in dialogInfo.neishiList" :key="neishi.interiorId" :label="neishi.interiorName" :value="neishi.interiorId"></el-option>
						  </el-select>
					  </el-form-item>
					  <el-form-item label="最终成交价" prop="amount" >
					  	<el-input v-model="dialogInfo.data.amount" :maxlength="10"><i slot="suffix">元</i></el-input>
					  </el-form-item>
  				</div>
  			</div>

  			<div class="l-form1-row">
  				<div class="_tit"><b>购车方案</b></div>
  				<div class="_cont">
  					<el-form-item prop="paymentWay" >
  						<el-radio-group v-model="dialogInfo.data.paymentWay">
						    <el-radio :label="1">全款购车</el-radio>
						    <el-radio :label="2">贷款购车</el-radio>
						  </el-radio-group>
					  </el-form-item>
					  <el-form-item label="首付" prop="downPayments" style="margin-left: 38px;">
					  	<el-input style="width: 150px;" v-model="dialogInfo.data.downPayments" :maxlength="10"><i slot="suffix">元</i></el-input>
					  </el-form-item>
					  <el-form-item label="贷款" prop="loan" style="margin-left: 30px;">
					  	<el-input style="width: 150px;" v-model="dialogInfo.data.loan" :maxlength="10"><i slot="suffix">元</i></el-input>
					  </el-form-item>
					  <el-form-item label="还款期数" prop="loanPayBackStages" style="margin-left: 30px;">
					  	<el-input style="width: 150px;" v-model="dialogInfo.data.loanPayBackStages" :maxlength="10"><i slot="suffix">期</i></el-input>
					  </el-form-item>
  				</div>
  			</div>

  			<div class="l-form1-row">
  				<div class="_tit"><b>附加项目</b></div>
  				<div class="_cont">
				    <el-form-item>
				    	<el-checkbox label="车辆购置税" v-model="dialogInfo.data.isPurchaseTax" :true-label="1" :false-label="0"></el-checkbox>
				    </el-form-item>
				    <el-form-item style="margin-left: 30px;">
				    	<el-checkbox label="上牌" v-model="dialogInfo.data.isTakeLicensePlate" :true-label="1" :false-label="0"></el-checkbox>
				    </el-form-item>
				    <el-form-item prop="licensePlatePriace">
					  	<el-input style="width: 150px;" v-model="dialogInfo.data.licensePlatePriace" :maxlength="10"><i slot="suffix">元</i></el-input>
					  </el-form-item>
				    <el-form-item style="margin-left: 30px;">
				    	<el-checkbox label="商业保险" v-model="dialogInfo.data.isInsurance" :true-label="1" :false-label="0"></el-checkbox>
				    </el-form-item>
				    <el-form-item prop="insurancePriace">
					  	<el-input style="width: 150px;" v-model="dialogInfo.data.insurancePriace" :maxlength="10"><i slot="suffix">元</i></el-input>
					  </el-form-item>
  				</div>
  			</div>

  			<div class="l-form1-row">
  				<div class="_tit"><b>赠送/加装精品</b></div>
  				<div class="_cont">
				    <el-form-item>
				    	<el-checkbox-group v-model="dialogInfo.data.followInformation">
						    <el-checkbox v-for="item in $$config.baseData.carJP" :key="item" :label="item"></el-checkbox>
						  </el-checkbox-group>
				   </el-form-item>
  				</div>
  			</div>

  			<div class="l-form1-row">
			    <el-form-item class="_flex">
			    	<b slot="label">订单备注</b>
			    	<el-input autosize type="textarea" v-model="dialogInfo.data.remark"></el-input>
			   </el-form-item>
  			</div>
			</el-form>
			<span slot="footer" class="l-margin-r-m">
				<el-button @click="closeDialogInfo()">取消</el-button>
		    <el-button type="primary" :loading="dialogInfo.loading" @click="submitDialogInfo">生成订单</el-button>
		  </span>
		</el-dialog>		
	</div>
</template>
<script>
import config from '../config'
export default {
	name: 'customer-progress',
	props: {
		data: {
			type: Object,
			default() {
				return {}
			}
		}
	},
	data() {
		let that = this
		let validateCarModel = function(rule, value, callback) {
			if (that.cascader.value.length === 0){
        callback(new Error('必填项'))
      }else{
      	that.dialogInfo.data.brandId = that.cascader.value[0] || ''
      	that.dialogInfo.data.familyId = that.cascader.value[1] || ''
      	that.dialogInfo.data.carsId = that.cascader.value[2] || ''
        callback()
      }
		}
		let paymentWay = function(rule, value, callback) {
			if(that.dialogInfo.data.paymentWay === 2) {
				if(rule.field === 'loanPayBackStages' && !config.regexp.int.test(that.dialogInfo.data[rule.field])) {
					callback(new Error(rule.message))
				}else if(!config.regexp.money.test(that.dialogInfo.data[rule.field])){
					callback(new Error(rule.message))
				}else{
					callback()
				}
			}else{
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
			
			dialogInfo: {
				type: 'new',
				title: '新增订单',
				visible: false,
				loading: false,
				colorList: [],
				neishiList: [],
				salesList: [],
				rules: {
					systemUserId: [
						{ required: true, message: '必填项', trigger: 'change' }
					],
					carsId: [
						{ required: true, validator: validateCarModel, trigger: 'change' }
					],
					colourId: [
						{ required: true, type:'number', message: '必填项', trigger: 'change' }
					],
					interiorId: [
						{ required: true, type:'number', message: '必填项', trigger: 'change' }
					],
					amount: [
						{ required: true, pattern: config.regexp.money, message: '必填项（保留两位小数点）', trigger: 'blur' }
					],
					downPayments: [
						{ validator: paymentWay, message: '必填项（保留两位小数点）', trigger: 'blur' }
					],
					loan: [
						{ validator: paymentWay, message: '必填项（保留两位小数点）', trigger: 'blur' }
					],
					loanPayBackStages: [
						{ validator: paymentWay, message: '必填项（整数）', trigger: 'blur' }
					],
					licensePlatePriace: [
						{ pattern: config.regexp.money, message: '必填项（保留两位小数点）', trigger: 'blur' }
					],
					insurancePriace: [
						{ pattern: config.regexp.money, message: '必填项（保留两位小数点）', trigger: 'blur' }
					]
				},
				data: {
					customerOrderId: '',
					customerUsersId: '',
					systemUserId: '',
					brandId: '',
					familyId: '',
					carsId: '',
					colourId: '',
					interiorId: '',
					amount: '',
					paymentWay: 1,
					downPayments: '',
					loan: '',
					loanPayBackStages: '',
					isPurchaseTax: 0,
					isTakeLicensePlate: 0,
					licensePlatePriace: '',
					isInsurance: 0,
					insurancePriace: '',
					followInformation: [],
					remark: ''
				}
			}
		}
	},
	methods: {
		formatterState(row, column, cellValue) {
			return cellValue === undefined ? '' : this.list.state.filter(item => item.value === cellValue)[0].label
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
		cascaderChange(valArr, reset = true) {
			if(!valArr || valArr.length < 2) return
			if(reset){
				this.dialogInfo.data.colourId = ''
				this.dialogInfo.data.interiorId = ''	
			}
			// 获取车身颜色和内饰颜色
			this.$$api.color.getCheshenList(valArr[1]).then(({data}) => {
    		this.dialogInfo.colorList = data
    	})
    	this.$$api.color.getNeishiList(valArr[1]).then(({data}) => {
    		this.dialogInfo.neishiList = data
    	})
		},
		showDialogInfo(type = 'new') {
			
			let promises = []

			let brandPromise = this.$$api.car.getBrandList().then(({data}) => {
				this.cascader.data = data.map(item => {
					item.children = []
					return item
				})
				return data
			})

			let salesPromise = this.$$api.user.getSalesList().then(({data}) => {
				this.dialogInfo.salesList = data
				return data
			})

			promises.push(brandPromise, salesPromise)

			this.$$utils.copyObj(this.dialogInfo.data, this.data)
			this.dialogInfo.type = type
			if(type === 'edit') {
				this.dialogInfo.title = '修改订单信息'
				let infoPromise = this.$$api.customer.getOrderInfo(this.data.customerOrderId).then(({data}) => {
					this.$$utils.copyObj(this.dialogInfo.data, data)
					this.dialogInfo.data.followInformation = data.followInformation ? data.followInformation.split(',') : []

					let { brandId, familyId, carsId } = this.dialogInfo.data
					this.cascader.value = [brandId, familyId, carsId]

					if(brandId) {
						brandPromise.then(data => {
							this.cascaderItemChange([brandId]).then(_ => {
								if(familyId) {
									this.cascaderItemChange([brandId, familyId])
									this.cascaderChange([brandId, familyId], false)
								}
							})
							return data
						})
					}
					return data
				})

				promises.push(infoPromise)
			} else {
				this.dialogInfo.title = '新增订单'
			}

			const loading = this.$loading()
			Promise.all(promises).then(dataArr =>　{
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
		},
		submitDialogInfo() {
			this.$refs.infoForm.validate(valid => {
        if (valid) {
          this.dialogInfo.loading = true
          this.$$api.customer.addOrder(this.dialogInfo.data).then(_ => {
            this.closeDialogInfo()
            this.$$utils.copyObj(this.data, this.dialogInfo.data)
            this.$message.success((this.dialogInfo.type === 'new' ? '新增' : '修改') + '订单成功')
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
		}
	}
}
</script>
<style>
.l-form1-row ._tit{padding: 5px 0; border-bottom: 1px solid #e5e9f2; margin-top: -10px;}
.l-form1-row ._cont{padding-top: 15px;}
.l-form1-row .el-form-item__label{width: auto !important;}
.l-form1-row .el-form-item__content{width: auto !important;}
.l-form1-row .el-input__suffix{padding: 0 5px;}
</style>