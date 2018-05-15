<template>
	<div>
		<el-row>
  		<el-col :span="24" class="l-text-right">
  			<el-form inline ref="listFilter" :model="list.filter" :rules="list.rules" @submit.native.prevent @keyup.enter.native="search">
				  <el-form-item prop="keywords">
				    <el-input placeholder="请输入手机号码或订单号" v-model="list.filter.keywords"></el-input>
				  </el-form-item>
				  <el-form-item>
				    <el-button type="primary" @click="search">查询</el-button>
				    <el-button type="danger" @click="clear">刷新</el-button>
				  </el-form-item>
				</el-form>
  		</el-col>
  	</el-row>
  	<el-table class="l-table-hdbg" stripe element-loading-spinner="el-icon-loading" element-loading-text="拼命加载中" 
  		:data="list.data" v-loading="list.loading" highlight-current-row>
	    <el-table-column class-name="l-fs-xs" label="订单号" prop="customerOrderCode" min-width="100"></el-table-column>
	    <el-table-column label="客户姓名" prop="customerName"></el-table-column>
	    <el-table-column label="客户手机号" prop="customerPhoneNumber"></el-table-column>
	    <el-table-column class-name="l-fs-xs" label="购置车辆" prop="carsName" min-width="160"></el-table-column>
	    <el-table-column label="销售顾问" prop="systemUserName" align="center"></el-table-column>
	    <el-table-column label="购车状态" prop="customerOrderStateName" align="center"></el-table-column>
	    <!-- <el-table-column label="购车方案" prop="expectWayName" align="center"></el-table-column> -->
	    <el-table-column label="操作" align="center" min-width="120">
	    	<template slot-scope="scope">
					<a class="el-button el-button--text el-button--mini" :href="$$config.router.base + 'contract?id=' + scope.row.customerOrderId" target="_blank">购车合同</a>
					<el-button v-if="scope.row.customerOrderState === 1" size="mini" type="text" @click="showDialogPay(1, scope.row)">收定金</el-button>
					<el-button v-if="scope.row.customerOrderState > 1 && scope.row.customerOrderState < 17" size="mini" type="text" @click="showDialogPay(2, scope.row)">收尾款</el-button>
					<el-button v-if="scope.row.customerOrderState > 13 && scope.row.customerOrderState < 17" size="mini" type="text" @click="finishPay(scope.row)">完款交车</el-button>
	        <el-button type="text" size="mini" @click="showDialogInfo(scope.row)">查看</el-button>
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

		<!-- 查看订单详情 -->
		<el-dialog class="l-padding-t-0" title="订单详情" :visible.sync="dialogInfo.visible" width="1000px" >
			<div style="margin-top: -0.75rem;">
				<table class="l-table-info">
					<caption>基本信息</caption>
					<tr>
						<td class="_tit" style="width: 120px;">订单编号</td>
						<td class="_cont" style="width: 400px;">{{dialogInfo.data.customerOrderCode}}</td>
						<td class="_tit" style="width: 120px;">销售顾问</td>
						<td class="_cont" style="width: 300px;">{{dialogInfo.data.systemUserName}}</td>
					</tr>
					<tr>
						<td class="_tit">车辆型号</td>
						<td class="_cont">{{dialogInfo.data.carsName}}</td>
						<td class="_tit">车身/内饰颜色</td>
						<td class="_cont">{{dialogInfo.data.colourName}}/{{dialogInfo.data.interiorName}}</td>
					</tr>
					<tr>
						<td class="_tit">车架号</td>
						<td class="_cont">{{dialogInfo.data.frameNumber}}</td>
						<td class="_tit">客户身份证号</td>
						<td class="_cont">{{dialogInfo.data.customerUserCard}}</td>
					</tr>
				</table>
				<table class="l-table-info">
					<caption>订单费用明细</caption>
					<tr>
						<td class="_tit">车辆购置税</td>
						<td class="_cont">{{dialogInfo.data.purchaseTaxPriace}}元</td>
						<td class="_tit">上牌费用</td>
						<td class="_cont">{{dialogInfo.data.licensePlatePriace}}元</td>
						<td class="_tit">商业保险费用</td>
						<td class="_cont">{{dialogInfo.data.insurancePriace}}元</td>
					</tr>
					<tr>
						<td class="_tit">按揭费用</td>
						<td class="_cont">{{dialogInfo.data.mortgagePriace}}元</td>
						<td class="_tit">精品选装费用</td>
						<td class="_cont">{{dialogInfo.data.boutiquePriace}}元</td>
						<td class="_tit">车船税</td>
						<td class="_cont">{{dialogInfo.data.vehicleAndVesselTax}}元</td>
					</tr>
					<tr>
						<td class="_tit">实际成交裸车价</td>
						<td class="_cont">{{dialogInfo.data.carUnitPrice}}元</td>
						<td class="_tit">订单总费用</td>
						<td class="_cont l-text-error">{{dialogInfo.data.amount}}元</td>
						<td class="_tit">定金金额</td>
						<td class="_cont l-text-warn">{{dialogInfo.data.depositPrice}}元</td>
					</tr>
				</table>
				<table class="l-table-info">
					<caption>购车方案</caption>
					<tr>
						<td class="_tit">购车方式</td>
						<td class="_cont">{{dialogInfo.data.paymentWay == 1 ? '全款购车' : '贷款购车'}}</td>
						<td class="_tit">贷款银行</td>
						<td class="_cont">{{getBankName(dialogInfo.data.loanBank)}}</td>
						<td class="_tit">车辆是否抵押</td>
						<td class="_cont">{{dialogInfo.data.isMortgage ? '是' : '否'}}</td>
					</tr>
					<tr>
						<td class="_tit">首付金额</td>
						<td class="_cont">{{dialogInfo.data.downPayments}}元</td>
						<td class="_tit">贷款金额</td>
						<td class="_cont">{{dialogInfo.data.loan}}元</td>
						<td class="_tit">还款期数</td>
						<td class="_cont">{{dialogInfo.data.loanPayBackStages}}</td>
					</tr>
				</table>
				<table class="l-table-info">
					<caption>其他信息</caption>
					<tr>
						<td class="_tit">赠送精品</td>
						<td class="_cont" colspan="3">
							<el-tag class="l-margin-r-s" v-for="item in dialogInfo.data.followInformationArr" :key="item">{{item}}</el-tag>
						</td>
					</tr>
					<tr>
						<td class="_tit">加装精品</td>
						<td class="_cont" colspan="3">
							<el-tag class="l-margin-r-s" v-for="item in dialogInfo.data.boutiqueInformationArr" :key="item">{{item}}</el-tag>
						</td>
					</tr>
					<tr>
						<td class="_tit">订单备注</td>
						<td class="_cont" colspan="3">
							{{dialogInfo.data.remark}}
						</td>
					</tr>
				</table>
			</div>
		</el-dialog>

		<!-- 支付定金 -->
		<el-dialog class="l-padding-t-0" append-to-body :close-on-click-modal="false" :close-on-press-escape="false" :title="dialogPay.title" :visible.sync="dialogPay.visible" width="620px">
			<div v-if="dialogPay.type === 1" class="l-margin">
				订单中定金金额：{{dialogInfo.data.depositPrice}}元，定金只能收取一次
			</div>
			<div v-if="dialogPay.type === 2" class="l-margin">
				<p>合计应收费用：{{dialogInfo.data.totalAmount}}元，当前已收费用：{{(dialogInfo.data.totalAmount - dialogInfo.data.payAmount).toFixed(2)}}元，剩余{{dialogInfo.data.payAmount}}元未收。</p>
				<p>
					<a class="l-text-link l-margin-r" @click="showDialogOther(1)">查看订单费用</a>
					<a class="l-text-link" @click="showDialogOther(2)">查看收款历史</a>
				</p>
			</div>
			<el-form ref="payForm" style="width: 555px;" label-width="100px" 
				:model="dialogPay.data" :rules="dialogPay.rules">
  			<el-form-item label="支付金额" prop="amount">
			    <el-input style="width: 200px;" :disabled="dialogPay.type === 1" v-model="dialogPay.data.amount" :maxlength="10"><i style="padding: 0 5px;" slot="suffix">元</i></el-input>
			  </el-form-item>
			  <el-form-item label="收款备注" prop="remarks">
			    <el-input type="textarea" :rows="2" v-model="dialogPay.data.remarks"></el-input>
			  </el-form-item>
			  <el-form-item label="支付方式" prop="payMethod">
			  	<el-radio-group v-model="dialogPay.data.payMethod">
			      <el-radio :label="5" border>POS刷卡</el-radio>
			      <el-radio :label="6" border>现金支付</el-radio>
			      <el-radio :label="14" border>其他POS机刷卡</el-radio>
			    </el-radio-group>
			  </el-form-item>
			  <el-form-item style="margin-top: 50px;" label="">
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

		<!-- 收款历史，订单费用 -->
		<el-dialog class="l-padding-t-0" append-to-body :title="dialogOther.title" :visible.sync="dialogOther.visible" width="500px">
			<template v-if="dialogOther.type === 1">
				<div class="l-margin-b-m">{{dialogOther.data1.carsName}} 指导价：{{dialogOther.data1.guidingPrice}}元</div>
				<table class="l-order-paylist">
					<thead>
						<tr>
							<th>订单收费项目</th>
							<th style="text-align:center;">对应费用（元）</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>车辆最终成交价</td>
							<td style="text-align:center;">{{dialogOther.data1.carUnitPrice}}</td>
						</tr>
						<tr>
							<td>车辆购置税</td>
							<td style="text-align:center;">{{dialogOther.data1.purchaseTaxPriace}}</td>
						</tr>
						<tr>
							<td>上牌费</td>
							<td style="text-align:center;">{{dialogOther.data1.licensePlatePriace}}</td>
						</tr>
						<tr>
							<td>商业保险费</td>
							<td style="text-align:center;">{{dialogOther.data1.insurancePriace}}</td>
						</tr>
						<tr>
							<td>按揭费用</td>
							<td style="text-align:center;">{{dialogOther.data1.mortgagePriace}}</td>
						</tr>
						<tr>
							<td>精品加装费用</td>
							<td style="text-align:center;">{{dialogOther.data1.boutiquePriace}}</td>
						</tr>
						<tr>
							<td>车船税</td>
							<td style="text-align:center;">{{dialogOther.data1.vehicleAndVesselTax}}</td>
						</tr>
					</tbody>
				</table>
			</template>
			<template v-if="dialogOther.type === 2">
				<div class="l-scroll" style="max-height: 300px;">
					<div class="l-margin-b" v-for="item in dialogOther.data2" :key="item.createDate">
						<p><span class="l-margin-r">{{item.createDate}}</span>收款：{{item.amount}}元</p>
						<p class="l-text-gray">{{item.remarks}}</p>
					</div>
				</div>
			</template>
		</el-dialog>

		<!-- 提车车辆 -->
		<el-dialog class="l-padding-t-0" append-to-body :close-on-click-modal="false" :close-on-press-escape="false" :title="dialogGive.title" :visible.sync="dialogGive.visible" width="420px">
			<div class="l-form1-row">
				<div class="_tit"><b>上传人车合照</b> <i class="l-text-error">*</i></div>
				<div class="_cont">
			    <uploader class="l-dialog-give" ref="dialogGiveUpload" :limit="1" :file-list.sync="dialogGive.uploadList"></uploader>
				</div>
				<div class="l-text-center l-margin-t">
					<el-button type="primary" :loading="dialogGive.loading" @click="giveCar">确认提车</el-button>
				</div>
			</div>
		</el-dialog>
	</div>
</template>
<script>
import config from '../config'
import { mapGetters } from 'vuex'
export default {
	name: 'customer-order',
	components: {
	},
	data() {
		return {
			bankList: [
				{ id: 1, name: '奇瑞金融' },
        { id: 2, name: '瑞福德金融' },
        { id: 3, name: '建设银行' },
        { id: 4, name: '农业银行' },
        { id: 5, name: '工商银行' },
        { id: 6, name: '广州银行' },
        { id: 7, name: '鹤山珠江村镇银行' },
        { id: 8, name: '鹤山农村信用合作社' },
        { id: 9, name: '锐诚金融' }
			],
			list: {
				filter: {
					keywords: '',
				},
				rules: {
					keywords: [],
				},
				loading: false,
				page: 1,
				rows: 100,
				total: 0,
				data: []
			},
			dialogInfo: {
				visible: false,
				data: {}
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
					payMethod: [
						{ required: true, type: 'number', message: '必填项', trigger: 'change' }
					]
				},
				data: {
					customerOrderId: '',
					amount: '',
					remarks: '',
					isDepositPrice: 1,
					payMethod: 5
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
			},
			dialogOther: {
				type: 1,
				visible: false,
				title: '订单费用',
				data1: {},
				data2: {}
			}
		}
	},
	computed: {
		...mapGetters([
  		'userInfo'
    ])
	},
	methods: {
		getBankName(id) {
			return (this.bankList.filter(item => item.id == id)[0] || {}).name || ''
		},
		sizeChange(size = 100) {
			this.getList(1, size)
		},
		pageChange(page = 1) {
			this.getList(page)
		},
		getList(page = 1, rows) {
			this.list.loading = true
			let listPromise = this.$$api.customer.getOrderList(this.list.filter, page, rows)
			listPromise.then(({data}) => {
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
		getOrderInfo(customerOrderId) {
			return this.$$api.customer.getOrderInfo(customerOrderId).then(({data}) => {
				data.followInformationArr = data.followInformation ? data.followInformation.split(',') : []
				data.boutiqueInformationArr = data.boutiqueInformation ? data.boutiqueInformation.split(',') : []
				this.dialogInfo.data = data
				return data
			})
		},
		showDialogInfo(row) {
			let loading = this.$loading()
			this.getOrderInfo(row.customerOrderId).then(_ => {
				this.dialogInfo.visible = true
			}).finally(_ => {
				loading.close()
			})
		},
		showDialogPay(type = 1, row) {
			let loading = this.$loading()
			this.getOrderInfo(row.customerOrderId).then(orderInfo => {
				this.dialogPay.visible = true
				this.dialogPay.type = type
				this.dialogPay.title = type === 1 ? '支付定金' : '支付尾款'
				this.dialogPay.isDepositPrice = type === 1 ? 1 : 0
				this.dialogPay.data.amount = type === 1 ? orderInfo.depositPrice : orderInfo.payAmount
			}).finally(_ => {
				loading.close()
			})
		},
		submitDialogPay() {
			this.dialogPay.data.customerOrderId = this.dialogInfo.data.customerOrderId
			this.$refs.payForm.validate(valid => {
        if (valid) {
        	if(this.dialogPay.data.payMethod === 5) { // 通联pos支付
						this.dialogPay.loading = true
	          this.$$api.customer.payOrder(this.dialogPay.data).then(({data}) => {
	            this.qrcode.visible = true
							this.qrcode.opts = Object.assign({}, this.$$config.qrcodeOption, { data })
	          }).finally(_ => {
	            this.dialogPay.loading = false
						})
        	}else{
        		this.$confirm('您必须确定收到款项金额再继续此操作，是否继续?', '提示', {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
		          type: 'warning'
		        }).then(() => {
		          this.dialogPay.loading = true
		          this.$$api.customer.payOrder(this.dialogPay.data).then(_ => {
		          	// this.getOrderInfo()
		          	this.dialogPay.visible = false
								this.$message.success('支付成功')
								this.getList()
		          }).finally(_ => {
		            this.dialogPay.loading = false
		          })
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
			this.dialogGive.data.customerOrderId = this.dialogInfo.data.customerOrderId
			this.dialogGive.loading = true
			this.$$api.customer.giveCar(this.dialogGive.data).then(_ => {
				this.$message.success('操作成功')
				this.dialogGive.visible = false
				this.getOrderInfo()
			}).finally(_ => {
				this.dialogGive.loading = false
			})
		},
		showDialogOther(type = 1) { // 显示订单费用，收款历史
			let loading = this.$loading()
			this.dialogOther.type = type
			if(type === 1) {
				this.dialogOther.title = '订单费用'
				this.$$api.customer.orderPrice(this.dialogInfo.data.customerOrderId).then(({data}) => {
					this.dialogOther.data1 = data
					this.dialogOther.visible = true
				}).finally(_ => {
					loading.close()
				})
			}else if(type === 2) {
				this.dialogOther.title = '收款历史'
				this.$$api.customer.payHistory(this.dialogInfo.data.customerOrderId).then(({data}) => {
					this.dialogOther.data2 = data
					this.dialogOther.visible = true
				}).finally(_ => {
					loading.close()
				})
			}
		},
		finishPay(row) { // 完款交车
			this.$confirm('是否确定收齐全款?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(_ => {
      	let loading = this.$loading()
				this.$$api.pay.finish(row.customerOrderId).then(_ => {
					this.$message({
						type: 'success',
						message: '操作成功'
					})
					this.getList()
				}).finally(_ => {
					loading.close()
				})
      })
		}
	},
	mounted() {
		this.$$event.$on('customer:tab', (activeName, that) => {
			this.$$parent = that
			if(activeName === 'order' && this.list.data.length === 0) {
				this.getList()
			}
		})
	},
	beforeDestroy() {
		this.$$event.$off('customer:tab')
	}
}
</script>
<style lang="less" scoped>
.l-table-info ._tit{width: 120px;}
</style>