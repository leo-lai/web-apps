<template>
	<div>
		<div class="l-margin l-text-center l-order-state" style="padding: 110px 0 0 0;">
			<div v-if="!orderState">
				<el-button style="width: 120px;" type="primary" @click="showDialogInfo('new')">开单</el-button>
			</div>
			<div v-else-if="orderState === 1">
				<p class="l-fs">待客户支付定金</p>
				<p style="margin-top: 50px;">
					<el-button style="width: 120px;" @click="showDialogInfo('edit')">编辑订单</el-button>
					<el-button style="width: 120px;" type="primary" @click="showDialogPay(1)">支付定金</el-button>
				</p>
			</div>
			<div v-else-if="orderState === 3">
				<p class="l-fs">客户已支付定金，待银行审批贷款方案</p>
				<p class="l-margin-t">农业银行可以在员工端提交审核材料，其他银行在银行审批通过后点击“银行审批通过按钮”</p>
				<p style="margin-top: 50px;">
					<el-button style="width: 120px;" @click="showDialogInfo('view')">查看订单</el-button>
					<el-button style="width: 120px;" type="primary" @click="bankPass">银行审批通过</el-button>
				</p>
				<p class="l-margin-t">
					<el-button style="width: 255px;" @click="fullPay">审批不通过，全额支付尾款</el-button>
				</p>
			</div>
			<div v-else-if="orderState === 5">
				<p class="l-fs">等待仓库出库车辆</p>
				<p style="margin-top: 50px;">
					<el-button style="width: 120px;" @click="showDialogInfo('view')">查看订单</el-button>
				</p>
			</div>
			<div v-else-if="orderState === 7">
				<p class="l-fs">仓库已出库车辆，待客户验车并支付尾款</p>
				<p style="margin-top: 50px;">
					<el-button style="width: 120px;" @click="showDialogInfo('view')">查看订单</el-button>
					<el-button style="width: 120px;" type="primary" @click="showDialogPay(2)">支付尾款</el-button>
				</p>
			</div>
			<div v-else-if="orderState === 9">
				<p class="l-fs">客户已支付尾款，待加装精品及上牌</p>
				<p class="l-margin-t">请在完成加装及上牌后，在员工端点击“完成”操作</p>
				<p style="margin-top: 50px;">
					<el-button style="width: 120px;" @click="showDialogInfo('view')">查看订单</el-button>
				</p>
			</div>
			<div v-else-if="orderState === 11">
				<p class="l-fs">加装及上牌完成，待客户提车</p>
				<p style="margin-top: 50px;">
					<el-button style="width: 120px;" type="primary" @click="dialogGive.visible = true">交付车辆</el-button>
				</p>
			</div>
			<div v-else-if="orderState === 13">
				<p class="l-fs">已交付车辆</p>
				<p style="margin-top: 50px;">
					<el-button style="width: 120px;" type="primary" @click="showDialogInfo('new')">再次开单</el-button>
				</p>
			</div>
		</div>
		<div class="l-margin l-text-center"><el-button class="l-text-link" type="text" @click="showDialogBuy">查看购车历程</el-button></div>

		<!-- 开单 -->
		<el-dialog class="l-padding-t-0" append-to-body :close-on-click-modal="false" :close-on-press-escape="false" :before-close="closeDialogInfo" :title="dialogInfo.title" :visible.sync="dialogInfo.visible" width="995px">
  		<el-form ref="infoForm" inline class="l-form1" :class="{'_disabled': dialogInfo.disabled }" label-width="100px" 
  			:model="dialogInfo.data" :rules="dialogInfo.rules" @keyup.enter.native="submitDialogInfo">
  			<div class="l-form1-row">
  				<el-form-item v-if="dialogInfo.data.customerOrderCode" style="margin-right: 50px;">
						<b slot="label">订单号</b>
				  	<el-input disabled :value="dialogInfo.data.customerOrderCode"></el-input>
				  </el-form-item>
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
					  <template v-if="dialogInfo.data.paymentWay === 2">
						  <el-form-item label="首付" prop="downPayments" style="margin-left: 38px;">
						  	<el-input style="width: 150px;" v-model="dialogInfo.data.downPayments" :maxlength="10"><i slot="suffix">元</i></el-input>
						  </el-form-item>
						  <el-form-item label="贷款" prop="loan" style="margin-left: 30px;">
						  	<el-input style="width: 150px;" v-model="dialogInfo.data.loan" :maxlength="10"><i slot="suffix">元</i></el-input>
						  </el-form-item>
						  <el-form-item label="还款期数" prop="loanPayBackStages" style="margin-left: 30px;">
						  	<el-input style="width: 150px;" v-model="dialogInfo.data.loanPayBackStages" :maxlength="10"><i slot="suffix">期</i></el-input>
						  </el-form-item>
					  </template>
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
			<span slot="footer" class="l-margin-r-m" v-if="dialogInfo.type !== 'view'">
				<el-button @click="closeDialogInfo()">取消</el-button>
		    <el-button type="primary" :loading="dialogInfo.loading" @click="submitDialogInfo">生成订单</el-button>
		  </span>
		</el-dialog>

		<!-- 查看购车历程 -->
		<el-dialog class="l-padding-t-0" append-to-body :close-on-click-modal="false" :close-on-press-escape="false" title="购车历程" :visible.sync="dialogBuy.visible" width="500px">
			<div class="l-steps">
				<ul>
					<li v-for="item in dialogBuy.list" :class="{'_done': item.done}">
						<i class="_icon el-icon-circle-check-outline"></i>
						<h4 class="_tit">{{item.title}}</h4>
						<div class="_desc">
							<p>{{item.content}}</p>
							<p class="l-text-gray">{{item.time}}</p>
							<p v-if="item.image.length > 0" v-for="image in item.image">
								<img :src="image">
							</p>
						</div>
					</li>
				</ul>
			</div>
		</el-dialog>

		<!-- 支付定金 -->
		<el-dialog class="l-padding-t-0" append-to-body :close-on-click-modal="false" :close-on-press-escape="false" :title="dialogPay.title" :visible.sync="dialogPay.visible" width="420px">
			<el-form ref="payForm" style="width: 335px;" label-width="100px" 
				:model="dialogPay.data" :rules="dialogPay.rules" @keyup.enter.native="submitDialogPay">
  			<el-form-item label="支付金额" prop="amount">
			    <el-input v-model="dialogPay.data.amount" :maxlength="10"><i style="padding: 0 5px;" slot="suffix">元</i></el-input>
			  </el-form-item>
			  <el-form-item label="支付方式" prop="isCash">
			  	<el-radio-group v-model="dialogPay.data.isCash">
			      <el-radio :label="0" border>POS刷卡</el-radio>
			      <el-radio :label="1" border>现金支付</el-radio>
			    </el-radio-group>
			  </el-form-item>
			  <el-form-item style="margin-top: 50px;" label="" prop="isCash">
			  	<el-button type="primary" :loading="dialogPay.loading" @click="submitDialogPay">立即支付</el-button>
			  </el-form-item>
  		</el-form>
		</el-dialog>

		<!-- 二维码支付 -->
		<el-dialog title="支付二维码" align="center" width="300px" append-to-body :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="qrcode.visible" :before-close="closeQrpay">
			<div class="l-qrcode-img">
	   		<qrcanvas ref="qrcode" :options="qrcode.opts"></qrcanvas>
	   		<p class="l-margin"><b>本次支付金额：{{dialogPay.data.amount}}</b></p>
	    </div>
		</el-dialog>

		<!-- 交付车辆 -->
		<el-dialog class="l-padding-t-0" append-to-body :close-on-click-modal="false" :close-on-press-escape="false" :title="dialogGive.title" :visible.sync="dialogGive.visible" width="420px">
			<div class="l-form1-row">
				<div class="_tit"><b>上传人车合照</b> <i class="l-text-error">*</i></div>
				<div class="_cont">
			    <uploader class="l-dialog-give" ref="dialogGiveUpload" :limit="1" :file-list.sync="dialogGive.uploadList"></uploader>
				</div>
				<div class="l-text-center l-margin-t">
					<el-button type="primary" :loading="dialogGive.loading" @click="giveCar">确认交付</el-button>
				</div>
			</div>
		</el-dialog>
	</div>
</template>
<script>
import config from '../config'
import Qrcanvas from 'qrcanvas-vue'
import uploader from 'components/uploader'
export default {
	name: 'customer-progress',
	components: {
    Qrcanvas, uploader
  },
	props: {
		data: {
			type: Object,
			default() {
				return {}
			}
		},
		parent: {
			type: Object
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
			orderState: '',
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
				disabled: false,
				rules: {
					systemUserId: [
						{ type:'number', message: '必填项', trigger: 'change' }
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
					customerOrderCode: '',
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
			},
			qrcode: {
				opts: {},
				visible: false
			},
			dialogPay: {
				type: 1,
				title: '支付定金',
				visible: false,
				loading: false,
				rules: {
					amount: [
						{ required: true, pattern: config.regexp.money, message: '必填项（保留两位小数点）', trigger: 'blur' }
					],
					isCash: [
						{ required: true, type: 'number', message: '必填项', trigger: 'change' }
					]
				},
				data: {
					customerOrderId: '',
					amount: '',
					isCash: 0
				}
			},
			dialogGive: {
				title: '交付车辆',
				visible: false,
				uploadList: [],
				data: {
					customerOrderId: '',
					extractCarImage: ''
				}
			},
			dialogBuy: {
				visible: false,
				list: [],
			}
		}
	},
	watch: {
		data(val) {
			if(val) {
				this.orderState = val.orderState	
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
		getOrderInfo() {
			return this.$$api.customer.getOrderInfo(this.data.customerOrderId).then(({data}) => {
				this.orderState = data.customerOrderState
				return data
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
			if(type === 'new') {
				this.dialogInfo.title = '新增订单'
				this.dialogInfo.data.customerOrderId = ''
				this.dialogInfo.disabled = false
			} else {
				this.dialogInfo.disabled = type === 'view'
				this.dialogInfo.title = type === 'view' ? '查看订单信息' : '修改订单信息'
				let infoPromise = this.getOrderInfo().then(data => {
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
			if(this.dialogInfo.data.isTakeLicensePlate === 1 && !this.dialogInfo.data.licensePlatePriace) {
				this.$message.error('请输入上牌费用')
				return
			}
			if(this.dialogInfo.data.isInsurance === 1 && !this.dialogInfo.data.insurancePriace) {
				this.$message.error('请输入商业保险金额')
				return
			}
			this.$refs.infoForm.validate(valid => {
        if (valid) {
          this.dialogInfo.loading = true
          this.$$api.customer.addOrder(this.dialogInfo.data).then(_ => {
          	this.parent && this.parent.getInfo()
            this.closeDialogInfo()
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
		},
		showDialogPay(type = 1) {
			this.dialogPay.visible = true
			this.dialogPay.type = type
			this.dialogPay.title = type === 1 ? '支付定金' : '支付尾款'
		},
		submitDialogPay() {
			this.dialogPay.data.customerOrderId = this.data.customerOrderId
			this.$refs.payForm.validate(valid => {
        if (valid) {
        	if(this.dialogPay.data.isCash === 1) {
        		this.$confirm('确定收到了现金再继续此操作，是否继续?', '提示', {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
		          type: 'warning'
		        }).then(() => {
		          this.dialogPay.loading = true
		          this.$$api.customer.payOrder(this.dialogPay.data).then(_ => {
		          	this.getOrderInfo()
		          	this.dialogPay.visible = false
		            this.$message.success('支付成功')
		          }).finally(_ => {
		            this.dialogPay.loading = false
		          })
		        })
        	}else{
        		this.dialogPay.loading = true
	          this.$$api.customer.payOrder(this.dialogPay.data).then(({data}) => {
	            this.qrcode.visible = true
							this.qrcode.opts = Object.assign({}, this.$$config.qrcodeOption, { data })
	          }).finally(_ => {
	            this.dialogPay.loading = false
	          })
        	}
        }else {
        	this.$message({
						type: 'error',
						message: '请完善表单信息'
					})
        }
      })
		},
		closeQrpay(done) {
			if(done){
				done()
			}else{
				this.qrcode.visible = false
			}
			this.getOrderInfo().then(data => {
				if((this.dialogPay.type === 1 && this.orderState > 1) || this.orderState > 7) {
					this.dialogPay.visible = false
				}
			})
		},
		bankPass() { // 银行贷款通过
			let loading = this.$loading()
			this.$$api.customer.bankPass(this.data.customerOrderId).then(_ => {
				this.orderState = 5
			}).finally(_ => {
				loading.close()
			})
		},
		fullPay() { // 银行贷款不通过，改成全款支付尾款
			let loading = this.$loading()
			this.$$api.customer.fullPay(this.data.customerOrderId).then(_ => {
				this.orderState = 5
			}).finally(_ => {
				loading.close()
			})
		},
		giveCar() {
			if(this.$refs.dialogGiveUpload.waiting > 0) {
				this.$message.error('图片正在上传中...')
				return
			}
			if(this.dialogGive.uploadList.length === 0) {
				this.$message.error('请上传人车合照')
				return
			}
			this.dialogGive.data.extractCarImage = this.dialogGive.uploadList[0].src
			this.dialogGive.data.customerOrderId = this.data.customerOrderId
			this.dialogGive.loading = true
			this.$$api.customer.giveCar(this.dialogGive.data).then(_ => {
				this.$message.success('交付车辆成功')
				this.dialogGive.visible = false
				this.getOrderInfo()
			}).finally(_ => {
				this.dialogGive.loading = false
			})
		},
		showDialogBuy() { // 购车历程
			let loading = this.$loading()
			this.$$api.customer.getInfo({
				customerUsersId: this.data.customerUsersId,
				customerUsersOrgId: this.data.customerUsersOrgId
			}).then(({data}) => {
				let list = ['开单', '落定', '银行贷款审批', '车辆出库', '完款', '加装/上牌', '交车']
				this.dialogBuy.list = list.map((item, index) => {
					let _item = data.orderMap && data.orderMap.list ? data.orderMap.list[index] : null
					if(_item) {
						item = {
							title: item,
							content: _item.trackContent,
							time: _item.createDate,
							image: _item.image ? _item.image.split(',') : [],
							done: true
						}						
					}else {
						item = {
							title: item,
							content: '',
							time: '',
							image: [],
							done: false
						}
					}
					return item
				})
				this.dialogBuy.visible = true
			}).finally(_ => {
				loading.close()
			})
		}
	},
	mounted() {
		this.orderState = this.data.orderState	
	}
}
</script>
<style lang="less">
.l-form1-row ._tit{padding: 5px 0; border-bottom: 1px solid #e5e9f2; margin-top: -10px;}
.l-form1-row ._cont{padding-top: 15px;}
.l-form1-row .el-form-item__label{width: auto !important;}
.l-form1-row .el-form-item__content{width: auto !important;}
.l-form1-row .el-input__suffix{padding: 0 5px;}
.l-dialog-give{position: relative; min-height: 150px;}
.l-dialog-give .el-upload--picture-card{position: absolute; top:0; left: 0;}
.l-dialog-give .el-upload-list__item, 
.l-dialog-give .el-upload--picture-card{
	width: 100% !important; height: auto !important; min-height: 150px; line-height: 150px !important; text-align: center;}
.l-dialog-give .el-upload-list__item .el-upload-list__item-thumbnail{height: auto !important;}

.l-steps{
	ul,li{margin:0; padding: 0; list-style: none;}
	li{display: flex; padding-bottom: 30px; position: relative; opacity: 0.3;}
	li._done{opacity: 1;}
	li:before{content: ''; border-left: 2px solid #39b94d; top: 25px; left: 14px; bottom: 0; position: absolute;}
	li:last-of-type:before{display: none;}
	li._done:last-of-type::before{opacity: 0.3;}
	._icon{font-size: 30px; height: 28px;  position: relative; z-index: 1; line-height: 1; color: #39b94d; margin-top: -3px;}
	._tit{width: 100px; margin-left: 20px; margin-right: 50px;}
	._desc{flex: 1;}
	.l-text-gray{font-size: 12px;}
	img {width: 100px; height: 60px; margin: 10px 10px 0 0;}
}
</style>