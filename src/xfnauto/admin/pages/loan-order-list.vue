<template>
	<div>
		<el-row>
  		<el-col :span="8">
  			<el-button type="primary" @click="showDialogSetting('new')">设置默认手续费率</el-button>
  		</el-col>
  		<el-col :span="16" class="l-text-right">
  			<el-form inline ref="listFilter" :model="list.filter" :rules="list.rules" @submit.native.prevent @keyup.enter.native="search">
				  <el-form-item prop="state">
  					<el-select v-model="list.filter.state" placeholder="订单状态" @change="search()">
				      <el-option v-for="item in stateList" :key="item.value" :label="item.label" :value="item.value"></el-option>
				    </el-select>
  				</el-form-item>
				  <el-form-item prop="keywords">
				    <el-input style="width: 250px;" placeholder="请输入垫资单号或门店名称" v-model="list.filter.keywords"></el-input>
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
	    <el-table-column class-name="l-fs-xs" label="门店名称" prop="orgName" min-width="150"></el-table-column>
	    <el-table-column class-name="l-fs-xs" label="申请时间" prop="createTime" width="120" align="center"></el-table-column>
	    <el-table-column label="本金总额(元)" prop="amount" width="120" align="center"></el-table-column>
	    <el-table-column label="手续费总额(元)" prop="fee" width="120" align="center"></el-table-column>
	    <el-table-column label="待还总额(元)" prop="unpayAmount" width="120" align="center"></el-table-column>
	    <el-table-column label="垫资期限(天)" prop="period" width="120" align="center"></el-table-column>
	    <el-table-column label="状态" prop="stateName" width="120" align="center">
				<template slot-scope="scope">
					<span :class="getState(scope.row.state).css">{{getState(scope.row.state).label}}</span>
				</template>
			</el-table-column>
	    <el-table-column label="操作" width="200" fixed="right" align="center">
	    	<template slot-scope="scope">
	        <span v-show="scope.row.doing" class="l-text-warn"><i class="el-icon-loading"></i>&nbsp;操作中</span>
	        <span v-show="!scope.row.doing">
	        	<el-button class="l-text-link" type="text" size="small" @click="showDialogInfo(scope.row)">查看</el-button>
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

		<!-- 垫资详情 -->
		<el-dialog center :before-close="closeDialogInfo" :visible.sync="dialogInfo.visible" width="1000px">
			<div class="l-order-info">
				<div class="_hd">
					<h3>{{dialogInfo.storeInfo.shopName}}</h3>
					<div class="l-flex-hc l-margin-t-s">
						<span>{{dialogInfo.info.orderId}}</span>
						<el-tag size="mini" class="l-margin-l-s" :type="[1, 7].includes(dialogInfo.info.state) ? 'info' : 'danger'">{{dialogInfo.info.stateName}}</el-tag>
						<div class="l-rest"></div>
						<span class="l-text-gray">手续费率/天：{{dialogInfo.info.rate}}%</span>
						<span class="l-text-gray l-margin-l">申请日期：{{dialogInfo.info.createTime}}</span>
					</div>
				</div>
				<div class="_bd">
					<table>
						<tr>
							<td>商铺类型：{{dialogInfo.storeInfo.typeName}}</td>
							<td>垫资本金总额：<b class="l-text-main">￥{{dialogInfo.info.amount}}</b></td>
						</tr>
						<tr>
							<td>商铺地址：{{dialogInfo.storeInfo.fullAddress}}</td>
							<td>垫资期限：{{dialogInfo.info.period}}天</td>
						</tr>
						<tr>
							<td>商铺描述：{{dialogInfo.storeInfo.describes}}</td>
							<td>手续费：<span>￥{{dialogInfo.info.fee}}</span></td>
						</tr>
						<tr>
							<td>法人姓名：{{dialogInfo.storeInfo.corporation}}</td>
							<td></td>
						</tr>
						<tr>
							<td>联系电话：{{dialogInfo.storeInfo.phone}}</td>
							<td></td>
						</tr>
						<tr>
							<td>
								<span @click="previewImage(0, dialogInfo.storeInfo.idCard)">身份证照：</span>
								<template v-if="dialogInfo.storeInfo.idCard">
									<img width="120" height="80" :src="dialogInfo.storeInfo.idCard[0]" @click="previewImage(0, dialogInfo.storeInfo.idCard)">
									<img width="120" height="80" :src="dialogInfo.storeInfo.idCard[1]" @click="previewImage(1, dialogInfo.storeInfo.idCard)">
								</template>
							</td>
							<td>
								<span @click="previewImage(0, dialogInfo.storeInfo.license)">营业执照：</span>
								<img width="80" height="80" v-for="(item, index) in dialogInfo.storeInfo.license" :key="index" :src="item" @click="previewImage(index, dialogInfo.storeInfo.license)">
							</td>
						</tr>
						<tr>
							<td>
								<span @click="previewImage(0, dialogInfo.storeInfo.image)">店铺照片：</span>
								<img width="80" height="80" v-for="(item, index) in dialogInfo.storeInfo.image" :key="index" :src="item" @click="previewImage(index, dialogInfo.storeInfo.image)">
							</td>
							<td>
								<span @click="previewImage(0, dialogInfo.info.materials)">合同资料：</span>
								<img width="80" height="80" v-for="(item, index) in dialogInfo.info.materials" :key="index" :src="item" @click="previewImage(index, dialogInfo.info.materials)">
							</td>
						</tr>
					</table>
					<div v-if="dialogInfo.info.state === 1" class="_line">
						<p class="l-text-gray">审核时间：{{dialogInfo.info.updateTime}}</p>
						<p class="l-text-error">拒绝原因：{{dialogInfo.info.reason}}</p>
					</div>
					<div v-else-if="dialogInfo.info.state === 3" class="_line">
						<p class="l-text-gray">审核时间：{{dialogInfo.info.updateTime}}</p>
						<p class="l-text-error">拒绝原因：{{dialogInfo.info.reason}}</p>
					</div>
				</div>
				<div class="l-car-list">
					<h4>垫资车辆</h4>
					<div class="l-loan-car l-flex-h" v-for="item in dialogInfo.info.list" :key="item.id">
						<div class="_thumb" :style="{'background-image': 'url(' + item.thumb + ')'}"></div>
						<div class="l-rest">
							<p>{{item.carName}}</p>
							<p class="l-text-gray">
								<span class="l-margin-r">指导价：￥{{item.guidancePrice}}</span>
								<span class="l-margin-r">车身颜色：{{item.colorName}}</span>
								<span class="l-margin-r">实际购车价：￥{{item.price}}</span>
								<span>保证金比例：{{item.downPayments}}%</span>
							</p>
							<p class="_line">
								<span class="l-margin-r">垫资本金金额：￥{{item.amount}}</span>
							</p>
						</div>
					</div>
				</div>
			</div>
			<span slot="footer" class="l-margin-r-m">
				<template v-if="dialogInfo.info.state === 0">
					<el-button :loading="dialogInfo.loading" @click="authLoan(1)">拒绝垫资</el-button>
					<el-button type="primary" :loading="dialogInfo.loading" @click="authLoan(2)">同意垫资</el-button>
				</template>
				<el-button type="primary" v-else-if="dialogInfo.info.state === 2" @click="dialogLoan.visible = true">放款</el-button>
		  </span>
		</el-dialog>

		<!-- 设置手续费率 -->
		<el-dialog center :close-on-click-modal="false" :close-on-press-escape="false" :before-close="closeDialogSetting"
			:title="dialogSetting.title" :visible.sync="dialogSetting.visible" width="480px">
  		<el-form ref="infoForm" inline label-width="140px" style="width: 300px; margin: auto;" 
  			:model="dialogSetting.data" :rules="dialogSetting.rules" @submit.native.prevent @keyup.enter.native="submitDialogSetting">
			  <el-form-item class="_flex" label="垫资手续费率/天" prop="rate" >
			    <el-input style="width: 120px;" v-model="dialogSetting.data.rate" :maxlength="10">
						<i slot="suffix">%</i>
					</el-input>
			  </el-form-item>
			</el-form>
			<span slot="footer" class="l-margin-r-m">
				<el-button @click="closeDialogSetting()">取消</el-button>
		    <el-button type="primary" :loading="dialogSetting.loading" @click="submitDialogSetting">确定提交</el-button>
		  </span>
		</el-dialog>

		<!-- 上传放款凭证 -->
		<el-dialog append-to-body :close-on-click-modal="false" :close-on-press-escape="false" 
			title="上传放款凭证" :visible.sync="dialogLoan.visible" width="480px">
			<div style="min-height: 250px; margin: -15px 0;">
				<uploader ref="dialogLoanUpload" :file-list.sync="dialogLoan.uploadList"></uploader>
			</div>
			<span slot="footer" class="l-margin-r-m">
				<el-button @click="dialogLoan.visible = false">返回</el-button>
		    <el-button type="primary" :loading="dialogLoan.loading" @click="submitDialogLoan">上传并放款</el-button>
		  </span>
		</el-dialog>

		<viewer-images ref="viewer"></viewer-images>
	</div>
</template>
<script>
import uploader from 'components/uploader'
import viewerImages from 'components/viewer-images'
export default {
	name: 'loan-order-list',
	components: { uploader, viewerImages },
	data() {
		return {
			exceling: false,
			stateList: [
				{ label: '全部', value: '', css: '' },
				{ label: '待审核', value: 0, css: 'l-text-blod' },
				{ label: '待放款', value: 2, css: 'l-text-blod' },
				{ label: '已放款', value: 3, css: 'l-text-ok' },
				{ label: '待还款', value: 4, css: 'l-text-warn' },
				{ label: '已逾期', value: 5, css: 'l-text-error' },
				{ label: '已拒绝', value: 1, css: 'l-text-gray' },
				{ label: '移交处理', value: 6, css: 'l-text-hot' },
				{ label: '已还清', value: 7, css: 'l-text-gray' },
			],
			list: {
				filter: {
					keywords: '',
					state: ''
				},
				rules: {
					keywords: [],
					state: []
				},
				loading: false,
				page: 1,
				rows: 10,
				total: 0,
				data: []
			},
			dialogSetting: {
				title: '设置默认手续费率',
				visible: false,
				loading: false,
				rules: {
					rate: [
						{ required: true, message: '必填项', trigger: 'blur' }
					]
				},
				data: {
					rate: '',
				}
			},
			dialogInfo: {
				title: '垫资详情',
				visible: false,
				loading: false,
				storeInfo: {},
				info: {}
			},
			dialogLoan: {
				visible: false,
				loading: false,
				uploadList: [],
				data: {
					id: '',
					voucher: ''
				}
			}
		}
	},
	methods: {
		previewImage(index = 0, imagesArr = []) {
			imagesArr = imagesArr.map(img => {
				return {
					url: this.$$utils.image.thumb(img, 150), 
					thumb: this.$$utils.image.thumb(img, 150), 
					src: img
				}
			})
    	this.$refs.viewer.show(index, imagesArr)
		},
		toExcel() {
			this.exceling = true
			this.$$api.loan.toExcel(this.list.filter).then(({data}) => {
				this.$message.success('导出Excel成功')
				window.location.href = data.url
			}).finally(_ => {
				this.exceling = false
			})
		},
		getAddress(info) {
			let { provinceName = '', cityName = '', areaName = '', address = '' } = info || this.dialogInfo.storeInfo
			if(!provinceName) return address
      return (provinceName === cityName ? provinceName : provinceName + cityName) + areaName + address
		},
		getStoreType(key = 1) {
      return (this.$$config.baseData.storeType.filter(item => item.key === key)[0] || {}).value || ''
		},
		getState(value = 0) {
			return this.stateList.filter(item => item.value === value)[0]
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
		showDialogSetting(row) { // 设置手续费率
			this.$$api.loan.getSetting().then(({data}) => {
				if(data) {
					this.dialogSetting.data.rate = data.rate || ''
				}
			})
			this.dialogSetting.visible = true
		},
		closeDialogSetting(done) {
			if(done) {
				done()
			}else{
				this.dialogSetting.visible = false	
			}
		},
		submitDialogSetting() { // 设置手续费率
			this.$refs.infoForm.validate(valid => {
        if (valid) {
          this.dialogSetting.loading = true
          this.$$api.loan.setSetting(this.dialogSetting.data).then(_ => {
            this.closeDialogSetting()
            this.$message({
							type: 'success',
							message: '设置成功'
						})
            this.refreshList()
          }).finally(()=>{
            this.dialogSetting.loading = false
          })  
        }else {
        	this.$message({
						type: 'error',
						message: '请完善表单信息'
					})
        }
      })
		},
		showDialogInfo(row) { // 垫资详情
			const loading = this.$loading()
			this.$$api.loan.getOrderInfo(row.id).then(({data}) => {
				this.dialogInfo.info = data
				if(data.info) {
					data.info.typeName = this.getStoreType(data.info.type)
					data.info.fullAddress = this.getAddress(data.info)
					data.info.idCard = data.info.idCard.split(',')
					data.info.license = data.info.license.split(',')
					data.info.image = data.info.image.split(',')
				}
				data.list = data.list.map(item => {
          item.thumb = this.$$utils.image.thumb(item.carImage, 100, 100)
          return item
        })
				this.dialogInfo.storeInfo = data.info
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
		// 审核垫资申请
		authLoan(type = 2) {
			let formData = {
				id: this.dialogInfo.info.id,
				state: type,
				reason: ''
			}
			if(type == 1) {
				this.$prompt('请输入拒绝原因', '系统提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
				}).then(({ value }) => {
					formData.reason = value
					this.submitAuth(formData)
				})
			}else {
				this.$confirm('请认真核实垫资申请信息, 确认是否无误?', '提示', {
          confirmButtonText: '同意垫资',
          cancelButtonText: '我再看看',
          type: 'warning'
        }).then(_ => {
					this.submitAuth(formData)
        })
			}
		},
		submitAuth(formData = {}) {
			this.dialogInfo.loading = true
			this.$$api.loan.authOrder(formData).then(_ => {
				this.$message.success('审核操作成功')
				this.showDialogInfo({id: this.dialogInfo.info.id})
				this.getList()
			}).finally(_ => {
				this.dialogInfo.loading = false
			})
		},
		submitDialogLoan() {
			if(this.$refs.dialogLoanUpload.waiting > 0) {
				this.$message.error('垫资认证资料正在上传中...')
				return
			}

			if(this.dialogLoan.uploadList.length === 0) {
				this.$message.error('请上传放款凭证')
				return
			}

			this.dialogLoan.data.id = this.dialogInfo.info.id
			this.dialogLoan.data.voucher = this.dialogLoan.uploadList.map(item => item.src || item.url).join(',')
			this.dialogLoan.loading = true
			this.$$api.loan.saveVoucher1(this.dialogLoan.data).then(_ => {
				this.$message.success('放款成功')
				this.dialogLoan.visible = false
				this.showDialogInfo({id: this.dialogInfo.info.id})
				this.getList()
			}).finally(_ => {
				this.dialogLoan.loading = false
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
<style lang="less" scoped>
.l-order-info{
	margin: -15px 20px -15px 10px; max-height: 500px; overflow: auto;
	._line{overflow: hidden; border-top:1px solid #eaecec; margin-top: 10px; padding-top: 10px;}
	._bd{ 
		background-color: #f6fafb; padding: 10px 15px; margin-top: 10px;
		table{width: 100%;}
		td{width: 50%;}
	}
	.l-car-list{
		margin: 15px 0 0 0;
	}
	.l-loan-car{
		background-color: #f6fafb; padding: 15px; margin: 5px 0;
		._thumb{width: 50px; height: 50px; margin-right: 15px; background:#fff no-repeat 50% 50%; background-size: cover;}
	}
}
</style>
