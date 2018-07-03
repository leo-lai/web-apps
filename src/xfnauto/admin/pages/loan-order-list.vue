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
	    <el-table-column label="门店名称" prop="orgName" min-width="150"></el-table-column>
	    <el-table-column label="申请时间" prop="createTime" width="120" align="center"></el-table-column>
	    <el-table-column label="本金总额(元)" prop="amount" width="120" align="center"></el-table-column>
	    <el-table-column label="手续费总额(元)" prop="feeTotal" width="120" align="center"></el-table-column>
	    <el-table-column label="待还总额(元)" width="120" align="center">
				<template slot-scope="scope">
					<span>{{scope.row.unpayAmount + scope.row.unpayFee}}</span>
				</template>
			</el-table-column>
	    <el-table-column label="垫资期限(天)" prop="period" width="120" align="center">
				<template slot-scope="scope">
					<p>{{scope.row.period}}</p>
					<p class="l-text-gray" style="font-size:11px;">剩余天数：{{scope.row.days}}</p>
				</template>
			</el-table-column>
	    <el-table-column label="状态" prop="stateName" width="120" align="center">
				<template slot-scope="scope">
					<span :class="getState(scope.row.state).css">{{getState(scope.row.state).label}}</span>
				</template>
			</el-table-column>
	    <el-table-column label="操作" width="200" fixed="right" align="center">
	    	<template slot-scope="scope">
	        <span v-show="dialogInfo.loading" class="l-text-warn"><i class="el-icon-loading"></i>&nbsp;操作中</span>
	        <span v-show="!dialogInfo.loading">
						<template v-if="scope.row.state === 0">
							<el-button class="l-text-link" type="text" size="small" @click="dialogInfoClick(scope.row, 1)">拒绝垫资</el-button>
							<el-button class="l-text-link" type="text" size="small" @click="dialogInfoClick(scope.row, 2)">同意垫资</el-button>
						</template>
						<el-button class="l-text-link" type="text" size="small" v-else-if="scope.row.state === 2" @click="dialogInfoClick(scope.row, 3)">放款</el-button>
						<template v-else-if="scope.row.state >= 3 && scope.row.state < 6">
							<el-button class="l-text-link" type="text" size="small" v-if="scope.row.state > 3" @click="dialogInfoClick(scope.row, 4)">处理车辆</el-button>
							<el-button class="l-text-link" type="text" size="small" v-if="scope.row.state > 3" @click="dialogInfoClick(scope.row, 5)">延期</el-button>
							<el-button class="l-text-link" type="text" size="small" v-if="scope.row.state < 5" @click="dialogInfoClick(scope.row, 6)">还款</el-button>
						</template>
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
							<td>
								<p>商铺类型：{{dialogInfo.storeInfo.typeName}}</p>
								<p>商铺地址：{{dialogInfo.storeInfo.fullAddress}}</p>
								<p>商铺描述：{{dialogInfo.storeInfo.describes}}</p>
								<p>法人姓名：{{dialogInfo.storeInfo.corporation}}</p>
								<p>联系电话：{{dialogInfo.storeInfo.phone}}</p>
							</td>
							<td>
								<template v-if="dialogInfo.info.state < 3">
									<p style="margin-left: -1em;">垫资本金总额：<b class="l-text-main">￥{{dialogInfo.info.amount}}</b></p>
									<p>&emsp;&emsp;手续费：<span>￥{{dialogInfo.info.feeTotal}}</span></p>
									<p>&emsp;垫资期限：{{dialogInfo.info.period}}天</p>
								</template>
								<template v-else-if="dialogInfo.info.state >= 3">
									<p>
										&emsp;待还总额：<b class="l-text-main">￥{{dialogInfo.info.unpayAmount + dialogInfo.info.unpayFee}}</b>
										<a v-if="dialogInfo.info.payRecords.length > 0" class="l-text-link l-margin-l" @click="showDialogPayRecord">查看还款记录</a>
									</p>
									<p>&emsp;待还本金：￥{{dialogInfo.info.unpayAmount | Int0}} / <span class="l-text-gray">{{dialogInfo.info.amount | Int0}}</span></p>
									<p>待还手续费：￥{{dialogInfo.info.unpayFee | Int0}} / <span class="l-text-gray">{{dialogInfo.info.feeTotal | Int0}}</span></p>
									<p>&emsp;垫资期限：{{dialogInfo.info.period}}天 / <span class="l-text-gray">{{dialogInfo.info.deadline}}</span></p>
								</template>
								<template v-if="dialogInfo.info.state < 6">
									<p v-if="dialogInfo.info.days > 0 && dialogInfo.info.days < 7" class="l-text-error" style="font-size: 12px; margin-left: 12px;">*还有{{dialogInfo.info.days}}天到最终还款日期，请催促客户还款或延期。</p>
									<p v-if="dialogInfo.info.state == 5" class="l-text-error" style="font-size: 12px; margin-left: 12px;">*已逾期，请延期或处理未还款车辆</p>
									<p v-if="dialogInfo.info.state == 6" class="l-text-error" style="font-size: 12px; margin-left: 12px;">*已逾期，未还款或申请延期，车辆已由平台处理</p>
									<br>
								</template>
							</td>
						</tr>
						<tr>
							<td>
								<span class="l-text-link" @click="previewImage(0, dialogInfo.storeInfo.idCard)">查看身份证照</span>&emsp;
								<template v-if="dialogInfo.storeInfo.idCard">
									<img width="120" height="80" style="margin-right: 5px;" :src="dialogInfo.storeInfo.idCard[0]" @click="previewImage(0, dialogInfo.storeInfo.idCard)">
									<img width="120" height="80" :src="dialogInfo.storeInfo.idCard[1]" @click="previewImage(1, dialogInfo.storeInfo.idCard)">
								</template>
							</td>
							<td>
								&emsp;<span class="l-text-link" @click="previewImage(0, dialogInfo.storeInfo.license)">查看营业执照</span>&emsp;
								<img width="80" height="80" style="margin:0 0 5px 5px;" v-for="(item, index) in dialogInfo.storeInfo.license" :key="index" :src="item" @click="previewImage(index, dialogInfo.storeInfo.license)">
							</td>
						</tr>
						<tr>
							<td>
								<span class="l-text-link" @click="previewImage(0, dialogInfo.storeInfo.image)">查看店铺照片</span>&emsp;
								<img width="80" height="80" style="margin:0 0 5px 5px;" v-for="(item, index) in dialogInfo.storeInfo.image" :key="index" :src="item" @click="previewImage(index, dialogInfo.storeInfo.image)">
							</td>
							<td>
								&emsp;<span class="l-text-link" @click="previewImage(0, dialogInfo.storeInfo.materials)">垫资合同资料</span>&emsp;
								<img width="80" height="80" style="margin:0 0 5px 5px;" v-for="(item, index) in dialogInfo.info.materials" :key="index" :src="item" @click="previewImage(index, dialogInfo.info.materials)">
							</td>
						</tr>
					</table>
					<div v-if="showMore">
						<!-- 拒绝审核 -->
						<div v-if="dialogInfo.info.state === 1" class="_line">
							<p class="l-text-gray">审核时间：{{dialogInfo.info.updateTime}}</p>
							<p class="l-text-error">拒绝原因：{{dialogInfo.info.reason}}</p>
						</div>
						<!-- 放款凭证 -->
						<div v-else-if="dialogInfo.info.state >= 3" class="_line l-text-gray">
							<span>{{dialogInfo.info.updateTime}}</span><br>
							<span class="l-text-link" @click="previewImage(0, dialogInfo.info.voucher)">查看放款凭证</span>&emsp;
							<img width="80" height="80" style="margin:5px 5px 0 0;" v-for="(item, index) in dialogInfo.info.voucher" :key="index" :src="item" @click="previewImage(index, dialogInfo.info.voucher)">
						</div>
						<!-- 延期记录 -->
						<div class="_line" v-if="dialogInfo.deferRecord.length > 0">
							<div class="l-text-gray" v-for="item in dialogInfo.deferRecord" :key="item.id">
								<span>{{item.createTime}}</span>
								<span class="l-margin-l">加收{{item.downpayment | Int0}}%保证金，手续费率调整为{{item.rate | Int0}}%，延期{{item.period}}天</span>
								<span class="l-margin-l l-text-error" v-if="item.voucher.length == 0">*该延期还未收款</span>
								<p v-else>
									<span class="l-text-link" @click="previewImage(0, item.voucher)">查看收款凭证</span>&emsp;
									<img width="80" height="80" style="margin:5px 5px 0 0;" v-for="(img, index) in item.voucher" :key="index" :src="img" @click="previewImage(index, item.voucher)">
								</p>
							</div>
						</div>
					</div>
					<div class="l-fr l-text-gray" style="margin: -20px 0 0 20px; text-decoration: underline; overflow: hidden;" @click="showMore = !showMore">
						<span v-if="!showMore"><b class="el-icon-caret-bottom l-fs-m" style="vertical-align: -1px"></b> 展开</span>
						<span v-else><b class="el-icon-caret-top l-fs-m" style="vertical-align: -3px"></b> 收起</span>
					</div>
				</div>
				<div class="l-car-list">
					<h4>垫资车辆</h4>
					<div class="l-loan-car l-flex-h" :class="item.state == 1 ? '_disabled' : ''" 
						v-for="item in dialogInfo.info.list" :key="item.id">
						<div class="_thumb" :style="{'background-image': 'url(' + item.thumb + ')'}"></div>
						<div class="l-rest">
							<p>
								<span>{{item.carName}}</span>
								<span class="l-text-ok l-margin-l" v-if="item.state == 1">
									({{item.stateName}})
									<i class="el-icon-circle-check"></i>
								</span>
								<span class="l-text-error l-margin-l" v-else-if="item.state == 2">
									({{item.stateName}})
								</span>
							</p>
							<p class="l-text-gray">
								<span class="l-margin-r">指导价：￥{{item.guidancePrice | Int0}}</span>
								<span class="l-margin-r">车身颜色：{{item.colorName}}</span>
								<span class="l-margin-r">实际购车价：￥{{item.price | Int0}}</span>
								<span>保证金比例：{{item.downPayments | Int0}}%</span>
							</p>
							<p class="_line">
								<span class="l-margin-r">垫资本金金额：￥{{item.amount | Int0}}</span>
								<span v-if="dialogInfo.info.state >= 3" class="l-margin-r">手续费：￥{{item.fee | Int0}}</span>
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
				<template v-else-if="dialogInfo.info.state >= 3 && dialogInfo.info.state < 6">
					<el-button v-if="dialogInfo.info.state > 3" @click="dealCar">处理车辆</el-button>
					<el-button v-if="dialogInfo.info.state > 3" @click="showDialogDefer">延期</el-button>
					<el-button v-if="dialogInfo.info.state < 5"  type="primary" @click="showDialogRepayment">还款</el-button>
				</template>
		  </span>
		</el-dialog>

		<!-- 设置手续费率 -->
		<el-dialog center :close-on-click-modal="false" :close-on-press-escape="false" :before-close="closeDialogSetting"
			:title="dialogSetting.title" :visible.sync="dialogSetting.visible" width="480px">
  		<el-form ref="settingForm" inline label-width="140px" style="width: 300px; margin: auto;" 
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

		<!-- 还款 -->
		<el-dialog append-to-body :close-on-click-modal="false" :close-on-press-escape="false" 
			title="请选择还款车辆" :visible.sync="dialogRepayment.visible" width="800px">
			<div class="l-car-list l-scroll" style="margin: -15px 0; max-height: 300px;">
				<div class="l-loan-car l-flex-h" v-for="item in dialogRepayment.cars" :key="item.id">
					<el-checkbox v-model="item.checked"></el-checkbox>
					<div class="_thumb" :style="{'background-image': 'url(' + item.thumb + ')'}"></div>
					<div class="l-rest">
						<p>{{item.carName}}</p>
						<p class="l-text-gray">
							<span class="l-margin-r">指导价：￥{{item.guidancePrice | Int0}}</span>
							<span class="l-margin-r">车身颜色：{{item.colorName}}</span>
							<span class="l-margin-r">实际购车价：￥{{item.price | Int0}}</span>
							<span>保证金比例：{{item.downPayments | Int0}}%</span>
						</p>
						<p class="_line">
							<span class="l-margin-r">垫资本金金额：￥{{item.amount | Int0}}</span>
							<span class="l-margin-r">手续费：￥{{item.fee | Int0}}</span>
						</p>
					</div>
				</div>
			</div>
			<div class="l-repay-all">
				<el-checkbox v-model="dialogRepayment.checked" @change="checkRepayAll">全选</el-checkbox>
				<b class="l-text-main">还款总额：￥{{dialogRepayment.amount}}</b>
			</div>
			<div class="l-repay-pic l-flex-h">
				<span>上传还款凭证：</span>
				<div class="l-rest">
					<uploader ref="dialogRepaymentUpload" :file-list.sync="dialogRepayment.uploadList"></uploader>
				</div>
			</div>
			<span slot="footer" class="l-margin-r-m">
				<el-button @click="dialogRepayment.visible = false">返回</el-button>
		    <el-button type="primary" :loading="dialogRepayment.loading" @click="submitDialogRepayment">确定还款</el-button>
		  </span>
		</el-dialog>

		<!-- 还款记录 -->
		<el-dialog append-to-body title="还款记录" :visible.sync="dialogPayRecord.visible" width="800px">
			<div style="margin: -20px 0;">
				<div class="l-pay-record" v-for="item in dialogPayRecord.list" :key="item.id">
					<div>
						<b class="l-fr l-text-main">还款金额：￥{{item.amount}}</b>
						<span>还款时间：{{item.createTime}}</span>
					</div>
					<div class="l-loan-car l-flex-h" v-for="carItem in item.cars" :key="carItem.id">
						<div class="_thumb" :style="{'background-image': 'url(' + carItem.thumb + ')'}"></div>
						<div class="l-rest">
							<p>{{carItem.carName}}</p>
							<p class="l-text-gray">
								<span class="l-margin-r">指导价：￥{{carItem.guidancePrice | Int0}}</span>
								<span class="l-margin-r">车身颜色：{{carItem.colorName}}</span>
								<span class="l-margin-r">实际购车价：￥{{carItem.price | Int0}}</span>
								<span>保证金比例：{{carItem.downPayments | Int0}}%</span>
							</p>
							<p class="_line">
								<span class="l-margin-r">垫资本金金额：￥{{carItem.amount | Int0}}</span>
								<span class="l-margin-r">手续费：￥{{carItem.fee | Int0}}</span>
							</p>
						</div>
						<span class="_days">垫资{{item.loanDays}}天</span>
					</div>
					<div class="l-margin-t-m l-text-right">
						<span @click="previewImage(0, item.voucher)">还款凭证：</span>
						<img width="80" height="80" style="margin:0 0 5px 5px;" v-for="(img, index) in item.voucher" :key="index" :src="img" @click="previewImage(index, item.voucher)">
					</div>
				</div>
			</div>
		</el-dialog>

		<!-- 延期 -->
		<el-dialog title="延长还款日期" :before-close="closeDialogSetting" :visible.sync="dialogDefer.visible" width="800px">
  		<el-form style="margin-bottom: -50px;" ref="deferForm" inline label-width="130px" :model="dialogDefer.data" :rules="dialogDefer.rules"
			 	@submit.native.prevent @keyup.enter.native="submitDialogDefer(1)">
				 <el-form-item>
					<span slot="label">当前未还本金金额</span>
					<el-input :disabled="true" :value="dialogInfo.info.unpayAmount">
						<i class="l-margin-r-s" slot="suffix">元</i>
					</el-input>
			  </el-form-item>
				<el-form-item>
					<span slot="label">当前手续费率</span>
					<el-input :disabled="true" :value="dialogInfo.info.rate">
						<i class="l-margin-r-s" slot="suffix">%</i>
					</el-input>
			  </el-form-item>
			  <el-form-item label="加收保证金" prop="downpayment" >
			    <el-input @change="getDeferAmount" v-model="dialogDefer.data.downpayment" :maxlength="6" placeholder="0 ~ 100">
						<i class="l-margin-r-s" slot="suffix">%</i>
					</el-input>
			  </el-form-item>
				<el-form-item label="手续费率调整为" prop="rate" >
			    <el-input @change="getDeferAmount" v-model="dialogDefer.data.rate" :maxlength="10" placeholder="不填写默认当前手续费率">
						<i class="l-margin-r-s" slot="suffix">%</i>
					</el-input>
			  </el-form-item>
				<el-form-item label="延长天数" prop="period" >
			    <el-input v-model="dialogDefer.data.period" :maxlength="10">
						<i class="l-margin-r-s" slot="suffix">天</i>
					</el-input>
			  </el-form-item>
				<p style="border-top: 1px solid #eee; margin: 15px 0 35px;"></p>
				<el-form-item label="本次延期应收金额" prop="amount" >
			    <el-input v-model="dialogDefer.data.amount" :maxlength="10">
						<i class="l-margin-r-s" slot="suffix">元</i>
					</el-input>
			  </el-form-item>
				<br>
				<el-form-item label="上传收费凭证" prp="amount" >
			    <uploader ref="dialogDeferUpload" :file-list.sync="dialogDefer.uploadList"></uploader>
			  </el-form-item>
			</el-form>
			<div slot="footer" class="l-margin-r-m" style="margin-top: -50px;">	
				<el-button title="还没收到延期费用，临时保存" :loading="dialogDefer.loading" @click="submitDialogDefer(1)">保存数据</el-button>
		    <el-button title="已收到延期费用，确定延期" type="primary" :loading="dialogDefer.loading" @click="submitDialogDefer(2)">确定延期</el-button>
		  </div>
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
			showMore: false,
			exceling: false,
			stateList: [
				{ label: '全部', value: '', css: '' },
				{ label: '待审核', value: 0, css: 'l-text-blod' },
				{ label: '待放款', value: 2, css: 'l-text-blod' },
				{ label: '已放款', value: 3, css: 'l-text-ok' },
				{ label: '待还款', value: 4, css: 'l-text-warn' },
				{ label: '已逾期', value: 5, css: 'l-text-error' },
				{ label: '已移交处理', value: 6, css: 'l-text-gray' },
				{ label: '已还清', value: 7, css: 'l-text-gray' },
				{ label: '已拒绝', value: 1, css: 'l-text-gray' },
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
			dialogInfo: { // 垫资详情
				title: '垫资详情',
				visible: false,
				loading: false,
				storeInfo: {},
				deferRecord: [],
				info: {}
			},
			dialogLoan: { // 放款
				visible: false,
				loading: false,
				uploadList: [],
				data: {
					id: '',
					voucher: ''
				}
			},
			dialogRepayment: { // 还款
				visible: false,
				loading: false,
				uploadList: [],
				checked: false,
				cars: [],
				amount: 0,
				data: {
					orderId: '',
					infoIds: '',
					voucher: ''
				}
			},
			dialogPayRecord: { // 还款记录
				visible: false,
				list: []
			},
			dialogDefer: { // 延期
				visible: false,
				loading: false,
				rules: {
					// downpayment: [ { required: true, message: '必填项', trigger: 'blur' } ],
					// rate: [ { required: true, message: '必填项', trigger: 'blur' } ],
					period: [ { required: true, message: '必填项', trigger: 'blur' } ],
				},
				uploadList: [],
				data: {
					id: '',
					orderId: '',
					rate: '',
					downpayment: '',
					period: '',
					voucher: '',
					amount: 0
				}
			}
		}
	},
	watch: {
		'dialogRepayment.cars': {
			immediate: false,
      deep: true,
      handler() {
        setTimeout(this.getUnpayAmount, 200)
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
			this.$refs.settingForm.validate(valid => {
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
		showDialogInfo(row, visible = true) { // 垫资详情
			const loading = this.$loading()
			let promise = this.$$api.loan.getOrderInfo(row.id).then(({data}) => {
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
					// item.fee = Number(Number(item.fee).toFixed(2))
          return item
        })

				data.voucher = data.voucher ? data.voucher.split(',') : []
				this.dialogInfo.storeInfo = data.info
				this.dialogInfo.visible = visible

				this.$$api.loan.deferRecord(data.id).then(({data}) => {
					if(data) {
						this.dialogInfo.deferRecord = data.map(item => {
							item.voucher = item.voucher ? item.voucher.split(',') : []
							return item
						})
					}
				})
			})
			
			promise.finally(_ => {
				loading.close()
			})

			return promise
		},
	
		dialogInfoClick(row, type) {
			if(!row || !type) return
			this.showDialogInfo(row, false).then(_ => {
				setTimeout(_ => {
					switch(type) {
						case 1: // 拒绝垫资
							this.authLoan(1)
							break
						case 2: // 同意垫资
							this.authLoan(2)
							break
						case 3: // 放款
							this.dialogLoan.visible = true
							break
						case 4: // 处理车辆
							this.dealCar()
							break
						case 5: // 延期
							this.showDialogDefer()
							break
						case 6: // 还款
							this.showDialogRepayment()
							break
					}
				}, 50)
			})
		},
		closeDialogInfo(done) {
			if(done) {
				done()
			}else{
				this.dialogInfo.visible = false	
			}
			this.dialogInfo.deferRecord = []
		},
		// 审核垫资申请
		authLoan(type = 2) {
			let formData = {
				id: this.dialogInfo.info.id,
				state: type,
				reason: ''
			}
			if(type == 1) {
				this.$prompt('请输入拒绝原因', '操作提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
				}).then(({ value }) => {
					formData.reason = value
					this.submitAuth(formData)
				})
			}else if(type == 2) {
				this.$confirm('请认真核实垫资申请信息, 确认是否无误?', '操作提示', {
          confirmButtonText: '同意垫资',
          cancelButtonText: '我再看看',
          type: 'warning'
        }).then(_ => {
					this.submitAuth(formData)
        })
			}else {
				this.submitAuth(formData)
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
				this.$message.error('放款凭证正在上传中...')
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
				this.dialogLoan.uploadList = []
				this.showDialogInfo({id: this.dialogInfo.info.id})
				this.getList()
			}).finally(_ => {
				this.dialogLoan.loading = false
			})
		},
		// 还款
		showDialogRepayment() {
			const loading = this.$loading()
			this.$$api.loan.getUnpayCars(this.dialogInfo.info.id).then(({data}) => {
				this.dialogRepayment.uploadList = []
				this.$$utils.copyObj(this.dialogRepayment.data, null)
				this.dialogRepayment.visible = true
				if(data){
					this.dialogRepayment.cars = data.map(item => {
						item.checked = false
						item.thumb = this.$$utils.image.thumb(item.carImage, 100, 100)
						return item
					})
				}
			}).finally(_ => {
				loading.close()
			})
		},
		getUnpayAmount() {
			let amount = 0
			this.dialogRepayment.cars.forEach(item => {
				if(item.checked) {
					amount += Number(item.amount) + Number(item.fee)
				}
			})

			this.dialogRepayment.checked = this.dialogRepayment.cars.length === this.dialogRepayment.cars.filter(item => item.checked).length
			this.dialogRepayment.amount = amount.toFixed(2)
		},
		checkRepayAll() {
			this.dialogRepayment.cars.forEach(item => {
				item.checked = this.dialogRepayment.checked
			})
		},
		submitDialogRepayment() { // 上传还款凭证
			let checkedList = this.dialogRepayment.cars.filter(item => item.checked)
			if(checkedList.length === 0) {
				this.$message.error('请选择还款车辆')
				return
			}
			if(this.$refs.dialogRepaymentUpload.waiting > 0) {
				this.$message.error('还款凭证正在上传中...')
				return
			}
			if(this.dialogRepayment.uploadList.length === 0) {
				this.$message.error('请上传还款凭证')
				return
			}

			this.dialogRepayment.data.orderId = this.dialogInfo.info.id
			this.dialogRepayment.data.voucher = this.dialogRepayment.uploadList.map(item => item.src || item.url).join(',')
			this.dialogRepayment.data.infoIds = checkedList.map(item => item.id).join(',')
			this.dialogRepayment.loading = true
			this.$$api.loan.saveVoucher2(this.dialogRepayment.data).then(_ => {
				this.$message.success('还款成功')
				this.dialogRepayment.visible = false
				this.showDialogInfo({id: this.dialogInfo.info.id})
				this.getList()
			}).finally(_ => {
				this.dialogRepayment.loading = false
			})
		},
		showDialogPayRecord() { // 还款记录
			const loading = this.$loading()
			this.$$api.loan.getPayRecord(this.dialogInfo.info.id).then(({data}) => {
				if(data) {
					this.dialogPayRecord.list = data.map(item => {
						item.cars = item.cars.map(carItem => {
							carItem.thumb = this.$$utils.image.thumb(carItem.carImage, 100, 100)
							// carItem.fee = Number(carItem.fee)
							return carItem
						})
						item.voucher = item.voucher ? item.voucher.split(',') : [] 
						return item
					})
				}
				this.dialogPayRecord.visible = true
			}).finally(_ => {
				loading.close()
			})
		},
		showDialogDefer() { // 延期
			const loading = this.$loading()
			this.$$api.loan.getDeferInfo(this.dialogInfo.info.id).then(({data}) => {
				this.dialogDefer.uploadList = []
				this.$$utils.copyObj(this.dialogDefer.data, data)
				this.getDeferAmount()
				this.dialogDefer.visible = true
			}).finally(_ => {
				loading.close()
			})
		},
		closeDialogDefer(done) {
			if(done) {
				done()
			}else{
				this.dialogDefer.visible = false	
			}
		},
		getDeferAmount() {
			let amount = 0
			let { rate = 0, downpayment = 0 }= this.dialogDefer.data
			rate = Number(rate > 0 ? rate : 0)
			downpayment = Number(downpayment > 0 ? downpayment : 0)
			amount = downpayment / 100 * Number(this.dialogInfo.info.unpayAmount)
			// this.dialogDefer.data.rate = rate
			this.dialogDefer.data.downpayment = downpayment
			this.dialogDefer.data.amount = amount.toFixed(2)
		},
		submitDialogDefer(type = 1) {
			if(type == 1 && !(this.dialogDefer.data.period > 0)) {
				this.$message.error('请输入延期天数')
				return
			}
			if(type == 2) {
				if(this.$refs.dialogDeferUpload.waiting > 0) {
					this.$message.error('手续费凭证正在上传中...')
					return
				}
				if(this.dialogDefer.uploadList.length === 0) {
					this.$message.error('请上传手续费凭证')
					return
				}
				this.dialogDefer.data.voucher = this.dialogDefer.uploadList.map(item => item.src || item.url).join(',')
			}

			this.dialogDefer.data.orderId = this.dialogInfo.info.id
			this.dialogDefer.loading = true
			this.$$api.loan.defer(this.dialogDefer.data).then(() => {
				this.dialogDefer.visible = false
				this.$message.success(type == 2 ? '延期成功' : '保存成功')
				this.showDialogInfo({id: this.dialogInfo.info.id})
				this.getList()
			}).finally(_ => {
				this.dialogDefer.loading = false
			})
		},
		dealCar() { // 处理车辆
			this.$confirm('不能按时还款车辆将由平台处理，订单状态不可再更改，是否确定?', '操作提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(_ => {
				const loading = this.$loading()
				this.$$api.loan.dealCar(this.dialogInfo.info.id).then(_ => {
					this.$message.success('处理车辆成功')
					this.showDialogInfo({id: this.dialogInfo.info.id})
					this.getList()
				}).finally(_ => {
					loading.close()
				})
			})
		}
	},
	mounted() {
		this.$$event.$on('loan:tab', activeName => {
			if(activeName === 'loan-order' && this.list.data.length === 0) {
				console.log(activeName)
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
	margin: -15px 20px -15px 10px; max-height: 500px; overflow: auto; text-align: left;
	._line{overflow: hidden; border-top:1px solid #eaecec; margin-top: 10px; padding-top: 10px;}
	._bd{ 
		background-color: #f6fafb; padding: 10px 15px; margin-top: 10px;
		table{width: 100%;}
		td{width: 50%; vertical-align: top;}
	}
}
.l-car-list{ margin: 15px 0 0 0; }
.l-loan-car{
	background-color: #f6fafb; padding: 15px; margin: 5px 0;
	._thumb{width: 50px; height: 50px; margin-right: 15px; background:#fff no-repeat 50% 50%; background-size: cover;}
	&._disabled{opacity: 0.6;}
}
.l-repay-all{margin: 25px 15px 0;}
.l-repay-pic{margin: 10px 15px -25px;}

.l-pay-record{
	border: 1px solid #eee; padding: 10px; margin: 0 0 10px 0;
	.l-loan-car{margin: 10px 0 0 0; position: relative;}
	._days{ position: absolute; top:0; right: 0; background-color: #39b94d; color: #fff; font-size: 12px; padding: 0 10px; border-radius: 0 0 5px 5px;}
}
</style>
