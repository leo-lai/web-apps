<template>
	<div>
		<el-row>
  		<el-col :span="24" class="l-text-right">
  			<el-form inline ref="listFilter" :model="list.filter" :rules="list.rules" @submit.native.prevent @keyup.enter.native="search">
  				<el-form-item prop="orgId">
  					<el-select v-model="list.filter.orgId" placeholder="请选择公司/门店" @change="search()">
				      <el-option v-for="item in zuzhiList" :key="item.orgId" :label="item.shortName" :value="item.orgId"></el-option>
				    </el-select>
  				</el-form-item>
				  <el-form-item prop="dateRange" style="width:360px;">
				  	<el-date-picker style="width: 100%;" type="daterange" value-format="yyyy-MM-dd"
				  		range-separator="到" start-placeholder="从建单时间" end-placeholder="建单时间"
				  		v-model="list.filter.dateRange" :picker-options="dateOptions" @change="filterDateChange"></el-date-picker>
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
	    <el-table-column class-name="l-fs-xs" label="订单号" prop="orderCode" width="140"></el-table-column>
	    <el-table-column label="订购门店" prop="orgName" align="center"></el-table-column>
			<el-table-column label="订购员" prop="orgLinker" align="center"></el-table-column>
	    <el-table-column label="数量" prop="number" align="center"></el-table-column>
	    <el-table-column label="建单员" prop="" align="center"></el-table-column>
			<el-table-column label="建单日期" prop="createTime" align="center"></el-table-column>
			<el-table-column label="订单状态" prop="orderStateName" align="center"></el-table-column>
	    <el-table-column label="操作" align="center" width="200">
	    	<template slot-scope="scope">
	    		<el-button class="l-text-link" type="text" size="small" @click="showDialogInfo(scope.row)">查看</el-button>
	    		<el-button class="l-text-error" v-if="scope.row.state == 5" type="text" size="small" @click="showDialogPay(1, scope.row)">收定金</el-button>
	    		<el-button class="l-text-error" v-if="scope.row.state == 35" type="text" size="small" @click="showDialogPay(2, scope.row)">收尾款</el-button>
	    		<!-- <el-button class="l-text-link" type="text" size="small" >电子合同</el-button> -->
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

	  <!-- 订单详情 -->
		<el-dialog class="l-padding-t-0" :title="dialogInfo.title" :visible.sync="dialogInfo.visible" width="873px">
			<div class="l-order-info-item">
				<h4 class="_tit">订单信息</h4>
				<div class="l-order-info-base">
					<span>订单号：{{dialogInfo.data.orderCode}}</span>
					<span>订购门店：{{dialogInfo.data.orgName}}</span>
					<span>订购员：{{dialogInfo.data.orgLinker}}</span>
					<span>订单状态：{{dialogInfo.data.orderStateName}}</span>
					<span>建单员：</span>
					<span>创建日期：{{dialogInfo.data.createTime}}</span>
				</div>
			</div>
			<div class="l-order-info-item">
				<h4 class="_tit">客户信息</h4>
				<div class="_customer" v-for="item in dialogInfo.data.customers" :key="item.id">
					<div class="l-flex-h">
						<div style="width: 250px;">
							<p><b>客户姓名：{{item.userName}}</b></p>
							<p>手机号码：{{item.userPhone}}</p>
						</div>
						<div class="l-rest">
							身份证照片：
							<img style="width: 100px; height: 50px;" :src="item.idCardPicOn">
							<img style="width: 100px; height: 50px; margin-left: 10px;" :src="item.idCardPicOff">
						</div>
					</div>
					<div class="l-margin-t" v-for="carItem in item.infos" :key="carItem.id">
						<div class="l-order-info-base">
							<p><b>车型：{{carItem.carsName}}</b></p>
							<span>车身颜色：{{carItem.colorName}}</span>
							<span>购买数量：{{carItem.carNum}}</span>
							<span class="l-text-error">{{carItem.changePrice > 0 ? '加价' : '优惠'}}金额：{{carItem.changePrice}}元</span>
						</div>
						<table class="l-frame-list" v-if="carItem.cars && carItem.cars.length > 0">
							<tr v-for="frame in carItem.cars" :key="frame.id">
								<td>车架号：{{frame.vin}}</td>
								<td>发动机号：{{frame.stockCar && frame.stockCar.engineNumber}}</td>
								<td>内饰颜色：{{frame.interiorName}}</td>
								<td class="l-text-center">
									<el-button class="l-text-link" type="text" size="small" @click="showDialogTick(frame)">上传票证照片</el-button>
								</td>
							</tr>
						</table>
					</div>
				</div>
			</div>
			<div class="l-order-info-item">
				<h4 class="_tit">物流信息</h4>
				<div class="l-order-info-base" v-if="dialogInfo.data.logisticsType == 2">
					<span>物流方式：其他</span>
					<span>物流公司：</span>
					<span>物流单号：</span>
					<span>运输车牌号：</span>
					<span>司机名称：</span>
					<span>联系方式：</span>
				</div>
				<div v-if="dialogInfo.data.logisticsType == 1">
					<p><b>物流方式：自提</b></p>
					<div class="l-flex-h" style="margin-bottom: 20px;" v-for="item in dialogInfo.data.pickers" :key="item.id">
						<div style="width: 250px;">
							<p>自提人员：{{item.userName}}</p>
							<p>联系电话：{{item.userPhone}}</p>
						</div>
						<div class="l-rest">
							身份证照片：
							<img style="width: 100px; height: 50px;" :src="item.idCardPicOn">
							<img style="width: 100px; height: 50px; margin-left: 10px;" :src="item.idCardPicOff">
						</div>
					</div>
				</div>
			</div>
			<span v-if="dialogInfo.data.state == 45" slot="footer" class="l-margin-r-m">
				<el-button @click="dialogInfo.visible = false">取消</el-button>
		    <el-button type="primary" :loading="dialogInfo.loading" @click="submitTickAll">上传票证完成</el-button>
		  </span>
		</el-dialog>

		<!-- 上传支付凭证 -->
		<el-dialog class="l-padding-t-0" :close-on-click-modal="false" :close-on-press-escape="false" :title="dialogPay.title" :visible.sync="dialogPay.visible" width="620px">
			<el-form ref="payForm" style="width: 555px;" label-width="100px" :model="dialogPay.data" :rules="dialogPay.rules">
  			<el-form-item :label="dialogPay.type == 1 ? '定金金额' : '尾款金额'">
			    {{dialogPay.data.amount}} 元
			  </el-form-item>
				<el-form-item label="支付方式" prop="payType">
			  	<el-radio-group v-model="dialogPay.data.payType">
			      <el-radio :label="1" border>现金支付</el-radio>
			      <el-radio :label="2" border>银行转账</el-radio>
			    </el-radio-group>
			  </el-form-item>
				<el-form-item class="_flex" label="支付凭证" prop="imageUpload">
					<uploader ref="dialogPayUpload" :file-list.sync="dialogPay.uploadList"></uploader>
			  </el-form-item>
			  <el-form-item label="收款备注" prop="remark">
			    <el-input type="textarea" :rows="2" v-model="dialogPay.data.remark"></el-input>
			  </el-form-item>
			  <el-form-item style="margin-top: 50px;" label="">
			  	<el-button type="primary" :loading="dialogPay.loading" @click="submitDialogPay">确定支付</el-button>
			  </el-form-item>
  		</el-form>
		</el-dialog>

		<!-- 上传票证照片 -->
		<el-dialog class="l-padding-t-0" :close-on-click-modal="false" :close-on-press-escape="false" title="上传票证照片" :visible.sync="dialogTick.visible" width="620px">
			<el-form style="width: 555px;" label-width="100px">
  			<el-form-item label="车架号">{{dialogTick.data.vin}}</el-form-item>
				<el-form-item class="_flex" label="票证照片" prop="imageUpload">
					<uploader ref="dialogTickUpload" :file-list.sync="dialogTick.uploadList"></uploader>
			  </el-form-item>
				<el-form-item label="票证备注">
			    <el-input type="textarea" :rows="2" v-model="dialogTick.data.remark"></el-input>
			  </el-form-item>
			  <el-form-item style="margin-top: 50px;" label="">
			  	<el-button type="primary" :loading="dialogTick.loading" @click="submitDialogTick">确定提交</el-button>
			  </el-form-item>
  		</el-form>
		</el-dialog>
	</div>
</template>
<script>
import { mapGetters } from 'vuex'
import uploader from 'components/uploader'
export default {
	name: 'order-list',
	components: {
		uploader
	},
	data() {
		let that = this
		let validateUpload = function(rule, value, callback) {
			if(that.$refs.dialogPayUpload.waiting > 0) {
				callback(new Error('图片正在上传中'))
			}else if(that.dialogPay.uploadList.length === 0) {
				callback(new Error('请上传支付凭证'))
			}else {
				that.dialogPay.data.voucher = that.dialogPay.uploadList.map(item => item.src || item.url).join(',')
				callback()
			}
		}

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
					dateRange: [],
					startDate: '',
					endDate: '',
					orgId: ''
				},
				rules: {
					dateRange: [],
					startDate: [],
					endDate: [],
					orgId: []
				},
				loading: false,
				page: 1,
				rows: 100,
				total: 0,
				data: []
			},
			dialogInfo: {
				title: '查看详情',
				visible: false,
				loading: false,
				data: {}
			},
			dialogPay: {
				type: 1,
				title: '支付订单',
				visible: false,
				loading: false,
				uploadList: [],
				rules: {
					payType: [
						{ required: true, type: 'number', message: '必填项', trigger: 'change' }
					],
					imageUpload: [
						{ required: true, validator: validateUpload, trigger: 'change' }
					]
				},
				data: {
					orderId: '',
					amount: '',
					payType: 2,
					voucher: '',
					remark: ''
				}
			},
			dialogTick: {
				visible: false,
				loading: false,
				uploadList: [],
				data: {
					vin: '',
					carId: '',
					ticketPic: '',
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
		filterDateChange(value) {
			if(value) {
				this.list.filter.startDate = value[0] || ''
				this.list.filter.endDate = value[1] || ''
				
			}else {
				this.list.filter.startDate = ''
				this.list.filter.endDate = ''
			}
			this.search()	
		},
		sizeChange(size = 100) {
			this.getList(1, size)
		},
		pageChange(page = 1) {
			this.getList(page)
		},
		getList(page = 1, rows) {
			this.list.loading = true
			this.$$api.order.getList(this.list.filter, page, rows)
			.then(({data}) => {
				if(data.list) {
					this.list.total = data.total
					this.list.page = data.page
					this.list.rows = data.rows
					this.list.data = data.list.map(item => {
						item.number = 0
						item.infos.forEach(carItem => {
							item.number += carItem.carNum
						})
						item.deling = false
						return item
					})
				}
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
		getOrderInfo() {
			return this.$$api.order.getInfo(this.dialogInfo.data.id).then(({data}) => {
				this.dialogInfo.data = data
			})
		},
		showDialogInfo(row) { // 查看详情
			this.dialogInfo.data.id = row.id
			const loading = this.$loading()
			this.getOrderInfo().then(_ => {
				this.dialogInfo.visible = true
			}).finally(_ => {
				loading.close()
			})
		},
		showDialogPay(type = 1, row) {
			this.$$utils.copyObj(this.dialogPay.data, '')
			this.dialogPay.visible = true
			this.dialogPay.type = type
			this.dialogPay.title = type === 1 ? '支付定金' : '支付尾款'
			this.dialogPay.data.orderId = row.id
			const loading = this.$loading()
			this.$$api.order.getPayInfo(row.id).then(({data}) => {
				this.dialogPay.visible = true
				this.dialogPay.data.amount = data.amount
			}).finally(_ => {
				loading.close()
			})
		},
		submitDialogPay() { // 支付凭证
			this.$refs.payForm.validate(valid => {
        if (valid) {
          this.dialogPay.loading = true
          this.$$api.order.pay(this.dialogPay.data).then(_ => {
						this.$message.success('该订单支付成功')
						this.dialogPay.visible = false
            this.refreshList()
          }).finally(()=>{
            this.dialogPay.loading = false
          })  
        }else {
        	this.$message({
						type: 'error',
						message: '请完善表单信息'
					})
        }
      })
		},
		showDialogTick(row) {
			this.dialogTick.visible = true
			this.dialogTick.data.carId = row.id
			this.dialogTick.data.vin = row.vin
			this.dialogTick.data.ticketPic = row.ticketPic
			this.dialogTick.uploadList = row.ticketPic ? row.ticketPic.split(',').map(img => {
				return {
					url: this.$$utils.image.thumb(img, 150), 
					thumb: this.$$utils.image.thumb(img, 150), 
					src: img, 
					name: img, 
					status: 'success'
				}
			}) : []
			this.dialogTick.visible = true
		},
		submitDialogTick() {
			if(this.$refs.dialogTickUpload.waiting > 0) {
				this.$message.error('图片正在上传中')
			}else if(this.dialogTick.uploadList.length === 0) {
				this.$message.error('请上传票证照片')
			}else {
				this.dialogTick.data.ticketPic = this.dialogTick.uploadList.map(item => item.src || item.url).join(',')
			}
			
			this.dialogTick.loading = true
			this.$$api.order.tickPic(this.dialogTick.data).then(_ => {
				this.$message.success('票证上传成功')
				this.dialogTick.visible = false
				this.dialogTick.uploadList = []
				this.getOrderInfo()
			}).finally(_ => {
				this.dialogTick.loading = false
			})
		},
		submitTickAll() { // 上传票证照片完成
			this.dialogInfo.loading = true
			this.$$api.order.tickDone(this.dialogInfo.data.id).then(_ => {
				this.$message.success('票证上传已完成')
				this.dialogInfo.visible = false
				this.getList()
			}).finally(_ => {
				this.dialogInfo.loading = false
			})
		}
	},
	mounted() {
		this.$$event.$on('order:tab', (activeName, that) => {
			if(['order-0', 'order-1', 'order-2'].includes(activeName)) {
				this.$$parent = that
				switch (activeName) {
					case 'order-1':
						this.list.filter.state = 5
						break
					case 'order-2':
						this.list.filter.state = 35
						break
					default:
						this.list.filter.state = ''
						break
				}
				
				this.getList()
				this.$store.dispatch('getZuzhiList')
			}
		})
	}
}
</script>
<style lang="less">
.l-order-info-item{
	padding-left: 20px; border-bottom: 1px solid #eee; padding-bottom: 20px; margin-bottom: 20px;
	._tit{position: relative; margin-bottom: 10px;}
	._tit::before{content: ''; float: left; width: 10px; height: 10px; border-radius: 50%; background-color:#409EFF; margin: 7px 0 0 -20px;}
	._customer{
		border-bottom: 1px solid #eee; padding-bottom: 20px; margin-bottom: 20px;
	}
	._customer:last-child{border-bottom: none; margin-bottom: 0; padding-bottom: 0;}
}
.l-order-info-item:last-child{border-bottom: none; padding-bottom: 0; margin-bottom: 0;}
.l-order-info-base{
	span {display: inline-block; min-width: 250px;}
}

.l-frame-list{
	background:#eee; width: 100%; border-collapse: collapse;
	td{ width: 25%; padding: 0 10px; border: 1px solid #fff;}
}
</style>

