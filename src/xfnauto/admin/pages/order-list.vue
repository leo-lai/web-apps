<template>
	<div>
		<el-row>
  		<el-col :span="24" class="l-text-right">
  			<el-form inline ref="listFilter" :model="list.filter" :rules="list.rules" @submit.native.prevent @keyup.enter.native="search">
					<!-- <el-form-item v-if="userInfo.orgLevel === 1" prop="orgId">
  					<el-select v-model="list.filter.orgId" filterable placeholder="请选择所属组织" @change="search()">
				      <el-option v-for="item in zuzhiList" :key="item.orgId" :label="item.shortName" :value="item.orgId"></el-option>
				    </el-select>
  				</el-form-item> -->
					<el-form-item prop="state">
  					<el-select v-model="list.filter.state" placeholder="订单状态" @change="search()">
				      <el-option v-for="item in stateList" :key="item.value" :label="item.label" :value="item.value"></el-option>
				    </el-select>
  				</el-form-item>
					<el-form-item prop="keywords">
				    <el-input placeholder="输入客户姓名/车架号" v-model="list.filter.keywords"></el-input>
				  </el-form-item>
				  <el-form-item prop="dateRange" style="width:300px;">
				  	<el-date-picker style="width: 100%;" type="daterange" value-format="yyyy-MM-dd"
				  		range-separator="到" start-placeholder="从建单时间" end-placeholder="建单时间"
				  		v-model="list.filter.dateRange" :picker-options="dateOptions" @change="filterDateChange"></el-date-picker>
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
	    <el-table-column class-name="l-fs-xs" label="订单号" prop="orderId" width="150"></el-table-column>
	    <el-table-column class-name="l-fs-xs" label="订购门店" prop="orgName" width="200"></el-table-column>
			<el-table-column class-name="l-fs-xs" label="客户姓名 | 手机号 | 车架号" align="center" min-width="400" :render-header="columnHeader">
				<template slot-scope="scope">
					<p style="display:inline-block;" class="l-text-wrap1" v-for="item in scope.row.customers" :key="item.id">
						<span style="display:inline-block; min-width: 80px; text-align: center;">{{item.userName || '--'}}</span>
						<span style="margin: 0 3px; color: #ccc;">|</span>
						<span style="display:inline-block; min-width: 80px; text-align: center;">{{item.userPhone || '--'}}</span>
						<span style="margin: 0 3px; color: #ccc;">|</span>
						<span style="display:inline-block; min-width: 160px; text-align: center;">{{item.car.vin || '--'}}</span>
					</p>
	      </template>
			</el-table-column>
	    <el-table-column label="成交价" prop="totalFinalPrice" align="center" width="100"></el-table-column>
	    <el-table-column label="定金" prop="totalDepositPrice" align="center" width="100"></el-table-column>
	    <el-table-column label="尾款" prop="totalRestPrice" align="center" width="100"></el-table-column>
	    <el-table-column label="运费" prop="freight" align="center" width="100"></el-table-column>
	    <el-table-column label="建单员" prop="creator" align="center" width="120"></el-table-column>
			<el-table-column class-name="l-fs-xs" label="建单日期" prop="createTime" align="center" width="150"></el-table-column>
			<el-table-column label="订单类型" prop="orderType" align="center" width="100">
				<template slot-scope="scope">
					{{scope.row.orderType ? orderType[scope.row.orderType - 1] : '常规单'}}
	      </template>
			</el-table-column>
			<el-table-column class-name="l-fs-xs" label="订单状态" prop="orderStateName" align="center" width="100"></el-table-column>
	    <el-table-column label="操作" align="center" width="200" fixed="right">
	    	<template slot-scope="scope">
	    		<el-button class="l-text-link" type="text" size="mini" @click="showDialogInfo(scope.row)">查看</el-button>
					<a class="el-button el-button--text el-button--mini" :href="$$config.router.base + 'order/contract?id=' + scope.row.id" target="_blank">打印合同</a>
					<el-button class="l-text-warn" v-if="scope.row.countermandApply == 1" type="text" size="mini" @click="showDialogRefund(scope.row)">退款审核</el-button>
					<template v-else>
						<el-button class="l-text-error" v-if="scope.row.orderState == 5" type="text" size="mini" @click="showDialogPay(1, scope.row)">收定金</el-button>
	    			<el-button class="l-text-error" v-if="scope.row.orderState == 35" type="text" size="mini" @click="showDialogPay(2, scope.row)">收尾款</el-button>
					</template>
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
		<el-dialog custom-class="l-order-info-dialog" :title="dialogInfo.title" :visible.sync="dialogInfo.visible" width="1100px" >
			<div class="l-order-info l-scroll">
				<div class="_hd">
					<div class="l-order-info-base">
						<span class="_xl">订购门店：{{dialogInfo.data.orgName}}</span>
						<span class="_xl">联&ensp;系&ensp;人：{{dialogInfo.data.orgLinker}}</span>
						<span class="_xl">联系电话：{{dialogInfo.data.orgPhone}}</span>
					</div>
					<div class="l-order-info-base">
						<span class="_xl">订单编号：{{dialogInfo.data.orderCode || dialogInfo.data.orderId}}</span>
						<span class="_xl">订单类型：{{dialogInfo.data.orderType ? orderType[dialogInfo.data.orderType - 1] : '常规单'}}</span>
						<span class="l-text-warn">订单状态：{{dialogInfo.data.orderStateName}}</span>
					</div>
					<div class="l-order-info-base">
						<span class="_xl">车辆总数：{{dialogInfo.data.carNum}}</span>
						<span class="_xl">
							总&ensp;定&ensp;金：￥{{dialogInfo.data.totalDepositPrice}}
							<a v-if="dialogInfo.data.pay1Image && dialogInfo.data.pay1Image.length > 0" class="l-btn-link l-margin-l-s" @click="showImages(0, dialogInfo.data.pay1Image)">定金支付凭证</a>
						</span>
						<span>
							总成交价：<b class="l-text-error">￥{{dialogInfo.data.totalFinalPrice}}</b>
							<a v-if="dialogInfo.data.pay2Image && dialogInfo.data.pay2Image.length > 0" class="l-btn-link l-margin-l-s" @click="showImages(0, dialogInfo.data.pay2Image)">尾款支付凭证</a>
						</span>
					</div>
					<div class="l-order-info-base" style="border-top:1px solid #eaeaea; margin-top: 15px; padding-top: 15px;">
						<span>客户经理：{{dialogInfo.data.creator}}</span>
						<span>出库人：{{dialogInfo.data.outStocker}}</span>
					</div>
					<div class="l-order-info-base">
						<span>开单日期：{{dialogInfo.data.createTime}}</span>
						<span>出库日期：{{dialogInfo.data.outStockTime}}</span>
					</div>
				</div>

				<div class="l-margin-m">
					<h4 class="_tit"><span>客户信息</span></h4>
					<div v-for="item in dialogInfo.data.customers" :key="item.id">
						<div class="_customer">
							<div class="l-order-info-base">
								<span class="_xl">
									客户姓名：{{item.userName}}<br>
									手机号码：{{item.userPhone}}
								</span>
								<span>
									身份证照片：
									<img @click="showImages(0, [item.idCardPicOn, item.idCardPicOff])" style="width: 80px; height: 40px;" :src="item.idCardPicOn">
									<img @click="showImages(1, [item.idCardPicOn, item.idCardPicOff])" style="width: 80px; height: 40px; margin-left: 10px;" :src="item.idCardPicOff">
								</span>
							</div>
						</div>
						<div class="_car l-margin-m" v-for="carItem in item.infos" :key="carItem.id">
							<div><b>{{carItem.carsName}}</b></div>
							<div class="l-order-info-base">
								<span>车&emsp;身：{{carItem.colorName}}</span>
								<span>内&emsp;饰：{{carItem.interiorName}}</span>
								<span>指导价：￥{{carItem.guidePrice}}</span>
								<span>购买数量：{{carItem.carNum}}</span>
							</div>
							<div class="l-order-info-base">
								<span>裸车价：￥{{carItem.nakedPrice}}</span>
								<span>交强险：￥{{carItem.trafficCompulsoryInsurancePrice || 0}}</span>
								<span>商业险：￥{{carItem.commercialInsurancePrice || 0}}</span>
								<span>{{carItem.changePrice > 0 ? '加价金额' : '优惠金额'}}：￥{{carItem.changePrice2}}</span>
							</div>
							<div v-if='carItem.remark' class="l-text-gray">备&emsp;注：{{carItem.remark}}</div>
							<div v-if="carItem.cars && carItem.cars.length > 0" v-for="frame in carItem.cars" :key="frame.id">
								<div class="l-text-gray l-margin-t l-order-info-base">
									<span>车&ensp;架&ensp;号：{{frame.vin}}</span>
									<span>发动机号：{{frame.stockCar && frame.stockCar.engineNumber}}</span>
									<span>内饰颜色：{{frame.interiorName}}</span>
									<span><el-button type="primary" size="mini" plain @click="showDialogTick(frame)">上传票证</el-button></span>
								</div>
								<div class="_pic">
									<div class="l-margin-b" style="font-weight:700;"><span>换车或修改价格备注</span>{{frame.auditRemark}}</div>
									<div class="l-flex-h">
										<span>验车照片</span>
										<div class="l-rest">
											<img class="_img" v-for="(img, index) in frame.checkCarPicArr" :key="img" :src="img" @click="showImages(index, frame.checkCarPicArr)">
										</div>
									</div>
									
									<div class="l-margin-tb" style="font-weight:700;"><span>票证备注</span>{{frame.ticketRemark}}</div>
									<div class="l-flex-h">
										<span>车身发票</span>
										<div class="l-rest">
											<img class="_img" v-for="(img, index) in frame.ticketPicArr" :key="img" :src="img" @click="showImages(index, frame.ticketPicArr)">
										</div>
									</div>
									<div class="l-flex-h">
										<span>合格证</span>
										<div class="l-rest">
											<img class="_img" v-for="(img, index) in frame.certificationPicArr" :key="img" :src="img" @click="showImages(index, frame.certificationPicArr)">
										</div>
									</div>
									<div class="l-flex-h">
										<span>交强险</span>
										<div class="l-rest">
											<img class="_img" v-for="(img, index) in frame.tciPicArr" :key="img" :src="img" @click="showImages(index, frame.tciPicArr)">
										</div>
									</div>
									<div class="l-flex-h">
										<span>快递单</span>
										<div class="l-rest">
											<img class="_img" v-for="(img, index) in frame.expressPicArr" :key="img" :src="img" @click="showImages(index, frame.expressPicArr)">
										</div>
									</div>
									<div class="l-flex-h">
										<span>商业险</span>
										<div class="l-rest">
											<img class="_img" v-for="(img, index) in frame.ciPicArr" :key="img" :src="img" @click="showImages(index, frame.ciPicArr)">
										</div>
									</div>
									<div class="l-flex-h">
										<span>其他</span>
										<div class="l-rest">
											<img class="_img" v-for="(img, index) in frame.otherPicArr" :key="img" :src="img" @click="showImages(index, frame.otherPicArr)">
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div class="l-margin-m">
					<h4 class="_tit"><span>物流信息</span></h4>
					<div class="l-margin-m">
						<div class="l-order-info-base" v-if="dialogInfo.data.logisticsType == 3">
							<span>物流方式：送车</span>
						</div>
						<div v-if="dialogInfo.data.logisticsType == 2">
							<div class="l-order-info-base">
								<span>物流方式：其他</span>
								<span>物流单号：{{dialogInfo.data.logisticsOrderCode}}</span>
								<span>物流公司：{{dialogInfo.data.logisticsCompany}}</span>
							</div>
							<div class="l-order-info-base">
								<span>运输车牌号：{{dialogInfo.data.logisticsPlateNumber}}</span>
								<span>司机名称：{{dialogInfo.data.logisticsDriver}}</span>
								<span>联系方式：{{dialogInfo.data.logisticsDriverPhone}}</span>
							</div>
						</div>
						<div v-if="dialogInfo.data.logisticsType == 1">
							<p><b>物流方式：自提</b></p>
							<div class="l-flex-h l-margin-t">
								<div style="width: 250px; margin-right: 20px;" v-for="(item,index) in dialogInfo.data.pickers" :key="item.id">
									<p><b>提车人{{index+1}}：{{item.userName}}</b></p>
									<p>联系电话：{{item.userPhone}}</p>
									<p>身份证照片：</p>
									<p class="l-margin-t-s">
										<img class="_img" :src="item.idCardPicOn">
										<img class="_img" :src="item.idCardPicOff">
									</p>
								</div>
							</div>
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
			  	<el-button type="primary" :loading="dialogPay.loading" @click="submitDialogPay">确定收到</el-button>
			  </el-form-item>
  		</el-form>
		</el-dialog>

		<!-- 上传票证照片 -->
		<el-dialog class="l-padding-t-0" :close-on-click-modal="false" :close-on-press-escape="false" title="上传票证照片" :visible.sync="dialogTick.visible" width="720px">
			<el-form style="width: 555px;" label-width="100px">
				<el-form-item style="margin-bottom: 10px;" class="_flex" label="车身发票">
					<uploader ref="dialogTickUpload1" :file-list.sync="dialogTick.uploadList1"></uploader>
			  </el-form-item>
				<el-form-item style="margin-bottom: 10px;" class="_flex" label="合格证">
					<uploader ref="dialogTickUpload2" :file-list.sync="dialogTick.uploadList2"></uploader>
			  </el-form-item>
				<el-form-item style="margin-bottom: 10px;" class="_flex" label="交强险">
					<uploader ref="dialogTickUpload3" :file-list.sync="dialogTick.uploadList3"></uploader>
			  </el-form-item>
				<el-form-item style="margin-bottom: 10px;" class="_flex" label="快递单">
					<uploader ref="dialogTickUpload4" :file-list.sync="dialogTick.uploadList4"></uploader>
			  </el-form-item>
				<el-form-item style="margin-bottom: 10px;" class="_flex" label="商业险">
					<uploader ref="dialogTickUpload5" :file-list.sync="dialogTick.uploadList5"></uploader>
			  </el-form-item>
				<el-form-item style="margin-bottom: 10px;" class="_flex" label="其他">
					<uploader ref="dialogTickUpload6" :file-list.sync="dialogTick.uploadList6"></uploader>
			  </el-form-item>
				<el-form-item style="margin-bottom: 10px;" label="票证备注">
			    <el-input type="textarea" :rows="2" v-model="dialogTick.data.ticketRemark"></el-input>
			  </el-form-item>
			  <el-form-item style="margin:20px 0 0 0;" label="">
			  	<el-button type="primary" :loading="dialogTick.loading" @click="submitDialogTick">确定上传</el-button>
			  </el-form-item>
  		</el-form>
		</el-dialog>

		<!-- 退款审核 -->
		<el-dialog class="l-padding-t-0" :close-on-click-modal="false" :close-on-press-escape="false" :title="dialogRefund.title" :visible.sync="dialogRefund.visible" width="620px">
			<el-form ref="refundForm" style="width: 555px;" label-width="100px" :model="dialogRefund.data" :rules="dialogRefund.rules">
				<el-form-item label="申请退款原因">
					<span>{{dialogRefund.countermandReason || '无'}}</span>
					<a v-if="dialogRefund.countermandPic.length > 0" class="l-btn-link" @click="showImages(0, dialogRefund.countermandPic)">查看退款附件</a>
				</el-form-item>
				<el-form-item class="_flex" label="退款凭证">
					<uploader ref="dialogRefundUpload" :file-list.sync="dialogRefund.uploadList"></uploader>
			  </el-form-item>
			  <el-form-item label="退款备注" prop="remarks">
			    <el-input type="textarea" :rows="2" v-model="dialogRefund.data.remarks"></el-input>
			  </el-form-item>
			  <el-form-item style="margin-top: 50px;" label="">
			  	<el-button type="primary" :loading="dialogRefund.loading" @click="submitDialogRefund">同意退款</el-button>
			  </el-form-item>
  		</el-form>
		</el-dialog>

		<viewer-images ref="viewer"></viewer-images>
	</div>
</template>
<script>
import { mapGetters } from 'vuex'
import uploader from 'components/uploader'
import viewerImages from 'components/viewer-images'
export default {
	name: 'order-list',
	components: {
		uploader, viewerImages
	},
	data() {
		let that = this
		let validateUpload = function(rule, value, callback) {
			if(that.$refs.dialogPayUpload.waiting > 0) {
				callback(new Error('图片正在上传中'))
			}else {
				that.dialogPay.data.voucher = that.dialogPay.uploadList.map(item => item.src || item.url).join(',')
				callback()
			}
		}

		return {
			exceling: false,
			orderType: ['常规单', '炒车单'],
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
			stateList: [
				{ label: '待收定金', value: 5},
				{ label: '待配车', value: 10},
				{ label: '待验车', value: 15},
				{ label: '待收尾款', value: 35},
				{ label: '待出库', value: 40},
				{ label: '待上传票证', value: 45},
				{ label: '已退款', value: 37},
			],
			list: {
				filter: {
					dateRange: [],
					keywords: '',
					startDate: '',
					endDate: '',
					orgId: '',
					state: '',
				},
				rules: {
					keywords: [],
					dateRange: [],
					startDate: [],
					endDate: [],
					orgId: [],
					state: [],
				},
				loading: false,
				page: 1,
				rows: 10,
				total: 0,
				data: []
			},
			dialogInfo: {
				title: '订购单详情',
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
						{  validator: validateUpload, trigger: 'change' }
					]
				},
				data: {
					orderId: '',
					amount: '',
					payType: '',
					voucher: '',
					remark: ''
				}
			},
			dialogRefund: {
				type: 1,
				title: '退款审核',
				visible: false,
				loading: false,
				uploadList: [],
				rules: {
					remarks: [
						{ required: true, message: '必填项', trigger: 'blur' }
					]
				},
				countermandReason: '',
				countermandPic: [],
				data: {
					id: '',
					voucherPic: '',
					remarks: ''
				}
			},
			dialogTick: {
				visible: false,
				loading: false,
				uploadList1: [],
				uploadList2: [],
				uploadList3: [],
				uploadList4: [],
				uploadList5: [],
				uploadList6: [],
				data: {
					carId: '',
					ticketPic: '',
					certificationPic: '',
					tciPic: '',
					ciPic: '',
					expressPic: '',
					otherPic: '',
					ticketRemark: ''
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
		toExcel() {
			this.exceling = true
			this.$$api.order.toExcel(this.list.filter).then(({data}) => {
				this.$message.success('导出Excel成功')
				window.location.href = data.url
			}).finally(_ => {
				this.exceling = false
			})
		},
		columnHeader(h, { column, $index }) {
			return (
				<p class="l-text-center" style="font-size:12px; font-weight: 500;">
					<span style="display:inline-block; width: 80px;">客户姓名</span>
					<span style="margin: 0 3px; color: #ccc;">|</span>
					<span style="display:inline-block; width: 88px;">手机号码</span>
					<span style="margin: 0 3px; color: #ccc;">|</span>
					<span style="display:inline-block; width: 160px;">车架号</span>
				</p>
      )
		},
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
			this.$$api.order.getList(this.list.filter, page, rows || this.list.rows)
			.then(({data}) => {
				if(data.list) {
					this.list.total = data.total
					this.list.page = data.page
					this.list.rows = data.rows
					this.list.data = data.list.map(item => {
						item.customers && item.customers.map(customer => {
							if(customer.infos && customer.infos[0] && customer.infos[0].cars&& customer.infos[0].cars[0]) {
								customer.car = customer.infos[0].cars[0]
							}else{
								customer.car = {}
							}
							return customer
						})
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
				data.carNum = 0
				data.customers.forEach(item => {
					item.infos.forEach(carItem => {
						carItem.changePrice2 = Math.abs(carItem.changePrice)
						data.carNum += carItem.carNum
						carItem.cars && carItem.cars.forEach(car => {
							car.checkCarPicArr = car.checkCarPic ? car.checkCarPic.split(',') : []
							car.ticketPicArr = car.ticketPic ? car.ticketPic.split(',') : []
							car.certificationPicArr = car.certificationPic ? car.certificationPic.split(',') : []
							car.tciPicArr = car.tciPic ? car.tciPic.split(',') : []
							car.ciPicArr = car.ciPic ? car.ciPic.split(',') : []
							car.expressPicArr = car.expressPic ? car.expressPic.split(',') : []
							car.otherPicArr = car.otherPic ? car.otherPic.split(',') : []
						})
					})
				})

				// 支付信息
				let pay1Image = [], pay2Image = []
				data.orderPaymentVOs.forEach(pay => {
					if (pay.voucher) {
						if (pay.type == 1) {
							pay1Image = pay1Image.concat(pay.voucher.split(','))
						} else if(pay.type == 2) {
							pay2Image = pay2Image.concat(pay.voucher.split(','))
						}
					}
				})

				data.pay1Image = pay1Image
				data.pay2Image = pay2Image

				console.log(pay1Image, pay2Image)

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

		// 支付
		showDialogPay(type = 1, row) {
			this.$$utils.copyObj(this.dialogPay.data, '')
			this.dialogPay.uploadList = []
			this.dialogPay.data.payType = 1
			this.dialogPay.visible = true
			this.dialogPay.type = type
			this.dialogPay.title = type === 1 ? '收定金' : '收尾款'
			this.dialogPay.data.orderId = row.id
			const loading = this.$loading()
			this.$$api.order.getPayInfo(row.id).then(({data}) => {
				this.dialogPay.visible = true
				this.dialogPay.data.amount = data.amount
			}).finally(_ => {
				loading.close()
			})
		},
		submitDialogPay() {
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

		// 退款审核
		showDialogRefund(row) {
			this.$$utils.copyObj(this.dialogRefund.data, '')
			this.dialogRefund.visible = true
			this.dialogRefund.data.id = row.id
			this.dialogRefund.countermandReason = row.countermandReason
			this.dialogRefund.countermandPic = row.countermandPic ? row.countermandPic.split(',') : []
		},
		submitDialogRefund() { 
			if(this.$refs.dialogRefundUpload.waiting > 0) {
				this.$message.error('退款凭证正在上传中')
				return
			}

			this.dialogRefund.data.voucherPic = this.dialogRefund.uploadList.map(item => item.src || item.url).join(',')
			this.dialogRefund.data.overPass = 1
			this.$refs.refundForm.validate(valid => {
        if (valid) {
          this.dialogRefund.loading = true
          this.$$api.order.refund(this.dialogRefund.data).then(_ => {
						this.$message.success('操作成功')
						this.dialogRefund.visible = false
            this.refreshList()
          }).finally(()=>{
            this.dialogRefund.loading = false
          })  
        }else {
        	this.$message({
						type: 'error',
						message: '请完善表单信息'
					})
        }
      })
		},

		// 上传票证
		showDialogTick(row) {
			this.$$utils.copyObj(this.dialogTick.data, row)
			this.dialogTick.data.carId = row.id
			this.dialogTick.uploadList1 = row.ticketPic ? row.ticketPic.split(',').map(img => {
				return {
					url: this.$$utils.image.thumb(img, 150), 
					thumb: this.$$utils.image.thumb(img, 150), 
					src: img, 
					name: img, 
					status: 'success'
				}
			}) : []
			this.dialogTick.uploadList2 = row.certificationPic ? row.certificationPic.split(',').map(img => {
				return {
					url: this.$$utils.image.thumb(img, 150), 
					thumb: this.$$utils.image.thumb(img, 150), 
					src: img, 
					name: img, 
					status: 'success'
				}
			}) : []
			this.dialogTick.uploadList3 = row.tciPic ? row.tciPic.split(',').map(img => {
				return {
					url: this.$$utils.image.thumb(img, 150), 
					thumb: this.$$utils.image.thumb(img, 150), 
					src: img, 
					name: img, 
					status: 'success'
				}
			}) : []
			this.dialogTick.uploadList4 = row.expressPic ? row.expressPic.split(',').map(img => {
				return {
					url: this.$$utils.image.thumb(img, 150), 
					thumb: this.$$utils.image.thumb(img, 150), 
					src: img, 
					name: img, 
					status: 'success'
				}
			}) : []
			this.dialogTick.uploadList5 = row.ciPic ? row.ciPic.split(',').map(img => {
				return {
					url: this.$$utils.image.thumb(img, 150), 
					thumb: this.$$utils.image.thumb(img, 150), 
					src: img, 
					name: img, 
					status: 'success'
				}
			}) : []
			this.dialogTick.uploadList6 = row.otherPic ? row.otherPic.split(',').map(img => {
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
			if(this.$refs.dialogTickUpload1.waiting > 0 || this.$refs.dialogTickUpload2.waiting > 0 || 
				this.$refs.dialogTickUpload3.waiting > 0 || this.$refs.dialogTickUpload4.waiting > 0  ||
				this.$refs.dialogTickUpload5.waiting > 0 || this.$refs.dialogTickUpload6.waiting > 0) {
				this.$message.error('票证照片正在上传中')
				return
			}

			this.dialogTick.data.ticketPic = this.dialogTick.uploadList1.map(item => item.src || item.url).join(',')
			this.dialogTick.data.certificationPic = this.dialogTick.uploadList2.map(item => item.src || item.url).join(',')
			this.dialogTick.data.tciPic = this.dialogTick.uploadList3.map(item => item.src || item.url).join(',')
			this.dialogTick.data.expressPic = this.dialogTick.uploadList4.map(item => item.src || item.url).join(',')
			this.dialogTick.data.ciPic = this.dialogTick.uploadList5.map(item => item.src || item.url).join(',')
			this.dialogTick.data.otherPic = this.dialogTick.uploadList6.map(item => item.src || item.url).join(',')
			
			this.dialogTick.loading = true
			this.$$api.order.tickPic(this.dialogTick.data).then(_ => {
				this.$message.success('票证上传成功')
				this.dialogTick.visible = false
				this.dialogTick.uploadList1 = []
				this.dialogTick.uploadList2 = []
				this.dialogTick.uploadList3 = []
				this.dialogTick.uploadList4 = []
				this.dialogTick.uploadList5 = []
				this.dialogTick.uploadList6 = []
				this.dialogTick.data.ticketRemark = ''
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
		},
		showImages(index = 0, imagesArr = []) {
			if(imagesArr.length > 0){
				imagesArr = imagesArr.map(img => {
					return {
						url: this.$$utils.image.thumb(img, 150), 
						thumb: this.$$utils.image.thumb(img, 150), 
						src: img
					}
				})
				this.$refs.viewer.show(index, imagesArr)
			}
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
				// if(this.userInfo.orgLevel == 1) {
				// 	this.$store.dispatch('getZuzhiList')
				// }
			}
		})
	},
	beforeDestroy() {
		this.$$event.$off('order:tab')
	}
}
</script>
<style lang="less">
.l-order-info-dialog{
	.el-dialog__header{background-color: #f5f7fa; padding: 15px;}
	.el-dialog__body{padding:0 0 1px 0; }
}
.l-order-info{
	max-height: 500px;
	._hd{background-color: #f5f7fa; padding:0 15px 15px 15px;}
	._tit{ display: inline-block; border-radius: 5px; padding: 2px 15px; background-color: #00b7ee; color: #fff;	}
	._customer{border: 1px solid #eaeaea; background-color: #f5f7fa; padding: 10px 15px; margin-top: 10px;}
	._pic{
		border: 1px dashed #eaeaea; padding: 10px 15px; margin-top: 10px;
		span{display: inline-block; min-width: 60px; margin-right: 20px;}
	}
	._img{width: 100px; height: 50px; margin:0 10px 10px 0; background-color: #f5f7fa;}
}

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
	span{display: inline-block; min-width: 150px; vertical-align: top; margin-right: 15px;}
	span._xl{min-width: 300px;}
}


.l-frame-list{
	background:#eee; width: 100%; border-collapse: collapse;
	td{ width: 25%; padding: 0 10px; border: 1px solid #fff;}
}
</style>

