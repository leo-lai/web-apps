<template>
	<div>
		<el-row>
  		<el-col :span="24" class="l-text-right">
  			<el-form inline ref="listFilter" :model="list.filter" :rules="list.rules" @submit.native.prevent @keyup.enter.native="search">
				  <el-form-item prop="state">
  					<el-select v-model="list.filter.state" placeholder="认证状态" @change="search()">
				      <el-option v-for="item in stateList" :key="item.value" :label="item.label" :value="item.value"></el-option>
				    </el-select>
  				</el-form-item>
				  <el-form-item prop="keywords">
				    <el-input placeholder="请输入门店名称" v-model="list.filter.keywords"></el-input>
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
	    <el-table-column label="门店名称" prop="shopName"></el-table-column>
	    <el-table-column label="门店类型" prop="type" align="center"></el-table-column>
	    <el-table-column label="申请时间" prop="createTime" align="center"></el-table-column>
	    <el-table-column label="联系电话" prop="phone" align="center"></el-table-column>
	    <el-table-column label="状态" prop="stateName" align="center">
				<template slot-scope="scope">
					<span :class="getState(scope.row.state).css">{{getState(scope.row.state).label}}</span>
				</template>
			</el-table-column>
	    <el-table-column label="操作" align="center">
	    	<template slot-scope="scope">
	        <span v-show="scope.row.doing" class="l-text-warn"><i class="el-icon-loading"></i>&nbsp;操作中</span>
	        <span v-show="!scope.row.doing">
	        	<el-button type="primary" size="small" @click="showDialogInfo(scope.row)">审核认证</el-button>
	        	<!-- <el-button class="l-text-error" type="text" size="small" @click="deleteInfo(scope.row)">删除</el-button> -->
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

	  <!-- 商铺审核 -->
		<el-dialog :before-close="closeDialogInfo" title="" :visible.sync="dialogInfo.visible" width="800px">
  		<div class="l-store-info">
				<div class="_hd">
					<div>
						<span v-if="dialogInfo.info.state == 0" class="l-fr">申请时间：{{dialogInfo.info.createTime}}</span>
						<span v-else class="l-fr">审核时间：{{dialogInfo.info.updateTime}}</span>
						<b class="l-fs-s l-margin-r">垫资审核资料</b>
						<span class="l-margin-r" :class="getState(dialogInfo.info.state).css">{{getState(dialogInfo.info.state).label}}</span>
					</div>
					<div class="l-margin-b">
						<p class="l-fs-xxs" style="margin: 10px 0;"><i class="l-text-error">*</i> 请上传商家的垫资认证资料</p>
						<uploader ref="dialogInfoUpload" :file-list.sync="dialogInfo.uploadList"></uploader>
					</div>
				</div>
				<div v-if="dialogInfo.info.state == 2" style="margin: 15px 0 0 0;">
					拒绝原因：{{dialogInfo.info.reason}}
				</div>

				<div class="_bd">
					<table>
						<tr>
							<td>商铺名称：</td>
							<td><b>{{dialogInfo.info.shopName}}</b></td>
						</tr>
						<tr>
							<td>商铺类型：</td>
							<td>{{dialogInfo.info.type}}</td>
						</tr>
						<tr>
							<td>商铺地址：</td>
							<td>{{getAddress()}}</td>
						</tr>
						<tr v-if="dialogInfo.info.describes">
							<td>商铺描述：</td>
							<td>{{dialogInfo.info.describes}}</td>
						</tr>
						<tr>
							<td>法人姓名：</td>
							<td>{{dialogInfo.info.corporation}}</td>
						</tr>
						<tr>
							<td>联系电话：</td>
							<td>{{dialogInfo.info.phone}}</td>
						</tr>
						<tr>
							<td>法人身份证：</td>
							<td>
								<template v-if="dialogInfo.info.idCard">
									<img width="150" height="100" :src="dialogInfo.info.idCard[0]" @click="previewImage(0, dialogInfo.info.idCard)">
									<img width="150" height="100" :src="dialogInfo.info.idCard[1]" @click="previewImage(1, dialogInfo.info.idCard)">
								</template>
							</td>
						</tr>
						<tr>
							<td>营业执照：</td>
							<td>
								<img width="80" height="80" v-for="(item, index) in dialogInfo.info.license" :key="index" :src="item" @click="previewImage(index, dialogInfo.info.license)">
							</td>
						</tr>
						<tr>
							<td>商铺照片：</td>
							<td>
								<img width="80" height="80" v-for="(item, index) in dialogInfo.info.image" :key="index" :src="item" @click="previewImage(index, dialogInfo.info.image)">
							</td>
						</tr>
					</table>
				</div>
			</div>
			<span slot="footer" class="l-margin-r-m">
				<el-button :loading="dialogInfo.loading" @click="authLoan(2)">拒绝认证</el-button>
		    <el-button type="primary" :loading="dialogInfo.loading" @click="authLoan(1)">通过认证</el-button>
		  </span>
		</el-dialog>

		<viewer-images ref="viewer"></viewer-images>
	</div>
</template>
<script>
import uploader from 'components/uploader'
import viewerImages from 'components/viewer-images'
export default {
	name: 'loan-auth-list',
	components: { uploader, viewerImages },
	data() {
		return {
			stateList: [
				{ label: '待审核', value: 0, css: 'l-text-warn'},
				{ label: '认证通过', value: 1, css: 'l-text-ok'},
				{ label: '认证不通过', value: 2, css: 'l-text-error'}
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
			dialogInfo: {
				visible: false,
				uploadList: [],
				info: {}
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
		getLoanType(key = 1) {
      return (this.$$config.baseData.storeType.filter(item => item.key === key)[0] || {}).value || ''
		},
		getAddress() {
			let { provinceName = '', cityName = '', areaName = '', address = '' } = this.dialogInfo.info
			if(!provinceName) return address
      return (provinceName === cityName ? provinceName : provinceName + cityName) + areaName + address
    },
		getState(value = 0) {
			return this.stateList.filter(item => item.value === value)[0]
		},
		sizeChange(size = 50) {
			this.getList(1, size)
		},
		pageChange(page = 1) {
			this.getList(page)
		},
		getList(page = 1, rows) {
			this.list.loading = true
			this.$$api.loan.getLoanList(this.list.filter, page, rows || this.list.rows)
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
		showDialogInfo(row) { // 商铺详情
			let loading = this.$loading()
			this.$$api.loan.getLoanInfo(row.id).then(({data}) => {
				if(data){
					this.dialogInfo.visible = true
					this.dialogInfo.info = data

					this.dialogInfo.uploadList = data.materials.map(img => {
						return {
							url: this.$$utils.image.thumb(img, 150), 
							thumb: this.$$utils.image.thumb(img, 150), 
							src: img, 
							name: img, 
							status: 'success'
						}
					})
				}
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
		authLoan(type = 1) {
			let formData = {
				id: this.dialogInfo.info.id,
				state: type,
				reason: ''
			}

			if(this.$refs.dialogInfoUpload.waiting > 0) {
				this.$message.error('垫资认证资料正在上传中...')
				return
			}

			// if(this.dialogInfo.uploadList.length === 0) {
			// 	this.$message.error('请上传垫资认证资料...')
			// 	return
			// }

			formData.materials = this.dialogInfo.uploadList.map(item => item.src || item.url).join(',')

			if(type == 2) {
				this.$prompt('请输入拒绝原因', '审核拒绝提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
				}).then(({ value }) => {
					formData.reason = value
					this.submitAuth(formData)
				})
			}else {
				this.submitAuth(formData)
			}
		},
		submitAuth(formData = {}) {
			this.dialogInfo.loading = true
			this.$$api.loan.authLoan(formData).then(_ => {
				this.$message.success('审核操作成功')
				this.closeDialogInfo()
				this.getList()
			}).finally(_ => {
				this.dialogInfo.loading = false
			})
		}
	},
	mounted() {
		this.$$event.$on('loan:tab', activeName => {
			if(activeName === 'loan-auth' && this.list.data.length === 0) {
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
.l-store-info{
	margin: -15px 0 -25px;
	._bd{background-color: #eee; padding: 15px; margin: 10px 0;}
	table{width: 100%;}
	td{vertical-align: top; padding: 5px;}
	td:first-child{width: 90px;}
}
</style>
