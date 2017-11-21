<template>
	<div>
		<el-row>
			<el-col :span="3">
				<el-button type="primary" @click="showDialogInfo('new')">新增入库单</el-button>
			</el-col>
  		<el-col :span="21" class="l-text-right">
  			<el-form inline ref="listFilter" :model="list.filter" :rules="list.rules" @submit.native.prevent @keyup.enter.native="search">
				  <el-form-item prop="dateRange" style="width:360px;">
				  	<el-date-picker style="width: 100%;" type="datetimerange" value-format="yyyy-MM-dd hh-mm-ss"
				  		range-separator="到" start-placeholder="从入库时间" end-placeholder="入库时间"
				  		v-model="list.filter.dateRange" :picker-options="dateOptions" @change="filterDateChange"></el-date-picker>
				  </el-form-item>
				  <el-form-item style="width: 140px;" prop="supplierId">
  					<el-select filterable v-model="list.filter.supplierId" placeholder="供应商" @change="search()">
				      <el-option v-for="item in supplierList" :key="item.id" :label="item.name" :value="item.id"></el-option>
				    </el-select>
  				</el-form-item>
  				<el-form-item style="width: 120px;" prop="storageSource">
  					<el-select filterable v-model="list.filter.storageSource" placeholder="入库类型" @change="search()">
				      <el-option label="资源采购" :value="1"></el-option>
				    	<el-option label="4S点出货" :value="2"></el-option>
				    </el-select>
  				</el-form-item>
  				<el-form-item style="width: 180px;" prop="storageCode">
  					<el-input placeholder="采购单号" v-model="list.filter.storageCode" :maxlength="50"></el-input>
  				</el-form-item>
				  <el-form-item>
				    <el-button type="primary" @click="search">查询</el-button>
				    <el-button @click="clear">重置</el-button>
				  </el-form-item>
				</el-form>
  		</el-col>
  	</el-row>
  	<el-table class="l-table-hdbg" stripe element-loading-spinner="el-icon-loading" element-loading-text="拼命加载中" 
  		:data="list.data" v-loading="list.loading">
	    <el-table-column label="入库单号" prop="storageCode" width="170">
	    	<template slot-scope="scope">
	    		<span style="font-size:12px;">{{scope.row.storageCode}}</span>
	      </template>
	    </el-table-column>
	    <el-table-column label="入库时间" prop="createDate" width="140">
	    	<template slot-scope="scope">
	    		<span style="font-size:12px;">{{scope.row.createDate}}</span>
	      </template>
	    </el-table-column>
	    <el-table-column label="车辆来源" prop="storageSource">
	    	<template slot-scope="scope">
	    		<span v-if="scope.row.storageSource == 1">资源采购</span>
	    		<span v-else>4S店出货</span>
	      </template>
	    </el-table-column>
	    <el-table-column label="供应商" prop="supplierName"></el-table-column>
	    <el-table-column label="采购员" prop="systemUserName"></el-table-column>
	    <el-table-column label="采购总价(万)" prop="totalPurchasePrice"></el-table-column>
	    <el-table-column label="采购总数量" prop="totalPurchase"></el-table-column>
	    <el-table-column label="物流费用" prop="logisticsCost"></el-table-column>
	    <el-table-column label="操作" width="170">
	    	<template slot-scope="scope">
	    		<el-button class="l-text-link" type="text" size="small" @click="showDialogInfo('edit', scope.row)">编辑</el-button>
	        <el-button class="l-text-link" type="text" size="small" @click="showDialogCar('car-list', scope.row)">车辆列表</el-button>
	        <el-button class="l-text-link" type="text" size="small" @click="showDialogCar('car-add', scope.row)">添加车辆</el-button>
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

	  <!-- 新增/编辑入库单 -->
		<el-dialog :close-on-click-modal="false" :close-on-press-escape="false" :before-close="closeDialogInfo"
			:title="dialogInfo.title" :visible.sync="dialogInfo.visible" width="995px">
  		<el-form ref="infoForm" inline class="l-form1" label-width="100px" 
  			:model="dialogInfo.data" :rules="dialogInfo.rules" @keyup.enter.native="submitInfo">
			  <el-form-item label="车辆来源" prop="storageSource">
			  	<el-select v-model="dialogInfo.data.storageSource" placeholder="请选择">
				    <el-option label="资源采购" :value="1"></el-option>
				    <el-option label="4S点出货" :value="2"></el-option>
				  </el-select>
			  </el-form-item>
			  <el-form-item label="采购员" prop="systemUsersId" >
			  	<el-select filterable v-model="dialogInfo.data.systemUsersId" placeholder="请选择">
				    <el-option v-for="user in dialogInfo.salesList" :key="user.systemUserId" :label="user.systemUserName" :value="user.systemUserId"></el-option>
				  </el-select>
			  </el-form-item>
			  <el-form-item label="供应商" prop="supplierId" >
			  	<el-select v-model="dialogInfo.data.supplierId" placeholder="请选择">
				    <el-option v-for="item in supplierList" :key="item.id" :label="item.name" :value="item.id"></el-option>
				  </el-select>
			  </el-form-item>
			  <el-form-item label="合格证时间" prop="certificateDate" >
			  	<el-select v-model="dialogInfo.data.certificateDate" placeholder="请选择">
				    <el-option label="随车" :value="1"></el-option>
				    <el-option label="3天内" :value="2"></el-option>
				    <el-option label="7天内" :value="3"></el-option>
				  </el-select>
			  </el-form-item>
			  <el-form-item label="合同号" prop="contractNumber" >
			  	<el-input v-model="dialogInfo.data.contractNumber" :maxlength="50"></el-input>
			  </el-form-item>
			  <el-form-item label="物流费用" prop="logisticsCost" >
			  	<el-input v-model.number="dialogInfo.data.logisticsCost" :maxlength="10"></el-input>
			  </el-form-item>
			  <el-form-item class="_flex" label="合同扫描件" prop="imageUpload">
			  	<!-- <div style="line-height: 1.6; width: 50%; margin-top: 4px;">
				  	<el-upload accept="image/*" multiple :limit="9" 
				  		:file-list="dialogInfo.upload.list"
				  		:action="$$api.baseURL + '/uploadImage'" name="img_file">
						  <el-button size="small" type="primary">点击上传</el-button>
						  <span slot="tip" class="el-upload__tip l-margin-l l-text-gray">只能上传jpg/png文件，且不超过2M</span>
						</el-upload>
					</div> -->
					<el-upload class="l-upload-card" accept="image/*" list-type="picture-card" multiple :limit="9"
			  		:file-list="dialogInfo.upload.list"
			  		:action="$$api.baseURL + '/uploadImage'" name="img_file"
			  		:on-success="uploadSuccess"
			  		:on-remove="uploadRemove"
			  		:on-preview="uploadPreview" 
			  		:on-progress="uploadProgress" 
			  		:on-error="uploadError" 
			  		:on-exceed="uploadExceed">
					  <i class="el-icon-plus"></i>
					</el-upload>
			  </el-form-item>
			  <el-form-item class="_flex" label="备注" prop="remark">
			  	<el-input type="textarea" v-model="dialogInfo.data.remark" :maxlength="500"></el-input>
			  </el-form-item>
			</el-form>
			<span slot="footer" class="l-margin-r-m">
				<el-button @click="closeDialogInfo()">取消</el-button>
		    <el-button type="primary" :loading="dialogInfo.loading" @click="submitInfo">确定提交</el-button>
		  </span>
		</el-dialog>

		<stock-in-car></stock-in-car>
		<!-- 预览图片 -->
		<viewer ref="viewer" class="l-viewer" :options="$$config.viewer.options" :images="viewer.images" @inited="viewerInited">
      <template slot-scope="scope">
      	<img v-for="{url, src} in scope.images" :key="src" :src="url" :data-source="src" >
      </template>
    </viewer>
	</div>
</template>
<script>
import viewer from 'v-viewer/src/component.vue'
import stockInCar from './stock-in-car'

export default {
	name: 'stock-in',
	components: {
    viewer, stockInCar
  },
	data() {
		let that = this
		let validateUpload = function(rule, value, callback) {
			if(that.dialogInfo.upload.loading) {
				callback(new Error('图片正在上传中'))
			}else if(that.dialogInfo.upload.list.length > 9) {
				callback(new Error('最多上传9张照片'))
			}else {
				that.dialogInfo.data.contractImage = that.dialogInfo.upload.list.map(item => item.src || item.url).join(',')
				callback()
			}
		}

		return {
			viewer: {
				options: {},
				visible: true,
				images: []
			},
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
			supplierList: [],
			list: {
				filter: {
					dateRange: [],
					startDate: '',
					endDate: '',
					supplierId: '',
					storageSource: '',
					storageCode: ''
				},
				rules: {
					dateRange: [],
					startDate: [],
					endDate: [],
					supplierId: [],
					storageSource: [],
					storageCode: []
				},
				loading: false,
				page: 1,
				rows: 100,
				total: 0,
				data: []
			},
			dialogInfo: {
				type: 'new',
				title: '新增入库单',
				visible: false,
				loading: false,
				upload: {
					list: [],
					loading: false,
					visible: false
				},
				salesList: [],
				rules: {
					storageSource: [
						{ required: true, type: 'number', message: '必填项', trigger: 'blur' }
					],
					systemUsersId: [
						{ required: true, type: 'number', message: '必填项', trigger: 'blur' }
					],
					supplierId: [
						{ required: true, type: 'number', message: '必填项', trigger: 'blur' }
					],
					logisticsCost: [
						{ required: true, type: 'number', message: '必填项', trigger: 'blur' },
						{ pattern: /^\d{1,9}(\.\d{1,2})?$/, message: '必填项，正确格式(如：10.24)', trigger: 'blur' }
					],
					imageUpload: [
						{ validator: validateUpload, trigger: 'change' },
					]
				},
				data: {
					storageId: '',
					storageSource: '',
					systemUsersId: '',
					supplierId: '',
					contractNumber: '',
					contractImage: '',
					certificateDate: '',
					logisticsCost: '',
					remark: ''
				}
			}
		}
	},
	methods: {
		viewerInited(viewer) {
			this.$$viewer = viewer
		},
		uploadSuccess(response, file, fileList) {
			this.dialogInfo.upload.loading = false
			this.dialogInfo.upload.list.push({
				name: file.name,
				url: response.data,
				src: response.data
			})
		},
		uploadPreview(file) {
			this.$$viewer.index = this.dialogInfo.upload.list.findIndex(item => item.url === file.url) || 0
			this.$$viewer.show()
		},
		uploadRemove(file, fileList) {
			if(file.status === 'success') {
				this.dialogInfo.upload.list = this.dialogInfo.upload.list.filter(item =>  {
					if(file.response) {
						return item.src !== file.response.data
					}else {
						return item.src !== (file.src || file.url)
					}
				})
			}
		},
		uploadProgress(event, file, fileList) {
			this.dialogInfo.upload.loading = true
		},
		uploadError(error, file, fileList) {
			this.dialogInfo.upload.loading = false
		},
		uploadExceed(files, fileList) {
			this.$message({
				type: 'error',
				message: '最多上传9张照片'
			})
		},
		filterDateChange(value) {
			if(value && value.length >= 2) {
				this.list.filter.startDate = value[0]
				this.list.filter.endDate = value[1]
				this.search()	
			}
		},
		sizeChange(size = 100) {
			this.getList(1, size)
		},
		pageChange(page = 1) {
			this.getList(page)
		},
		getList(page = 1, rows) {
			this.list.loading = true
			this.$$api.stock.getInList(this.list.filter, page, rows)
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
			this.list.filter.startDate = ''
			this.list.filter.endDate = ''
			this.getList()
		},
		showDialogInfo(type = 'new', row) { // 新增/修改入库单
			this.dialogInfo.type = type
			let salesPromise = this.$$api.user.getSalesList().then(({data}) => {
				this.dialogInfo.salesList = data
				return data
			})
			
			let infoPromise = Promise.resolve()

			if(type === 'edit') {
				this.dialogInfo.title = '修改入库单'
				infoPromise = this.$$api.stock.getInInfo(row.storageId)
				this.$$utils.copyObj(this.dialogInfo.data, row)
				infoPromise.then(({data}) => {
					this.$$utils.copyObj(this.dialogInfo.data, data)
					this.dialogInfo.upload.list = data.contractImage ? data.contractImage.split(',').map(imageUrl => {
						return {url: this.$$utils.image.thumb(imageUrl, 150), name: imageUrl, src: imageUrl}
					}) : []
					this.viewer.images = this.dialogInfo.upload.list
				})
			} else {
				this.dialogInfo.title = '新增入库单'
				this.$$utils.copyObj(this.dialogInfo.data, '')
			}

			const loading = this.$loading()
			Promise.all([salesPromise, infoPromise]).then(dataArr =>　{
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
		submitInfo() { // 提交入库单
			this.$refs.infoForm.validate(valid => {
        if (valid) {
          this.dialogInfo.loading = true
          this.$$api.stock.addIn(this.dialogInfo.data).then(_ => {
            this.closeDialogInfo()
            this.$message({
							type: 'success',
							message: (this.dialogInfo.type === 'new' ? '新增' : '修改') + '入库单'
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
		showDialogCar(eventName = 'car-list', row) {
			let infoPromise = Promise.resolve()
			let info = Object.assign(row)
			if(eventName === 'car-list') {
				infoPromise = this.$$api.stock.getInInfo(row.storageId).then(({data}) => {
					info = Object.assign(data)
				})
			}
			infoPromise.finally(_ => {
				this.$$event.$emit('stock:' + eventName, info)	
			})
		}
	},
	mounted() {
		this.$$event.$on('stock:tab', activeName => {
			if(activeName === 'in' && this.list.data.length === 0) {
				this.getList()
				this.$$api.supplier.getListDown().then(({data}) => {
					this.supplierList = data
				})
			}
		})
	}
}
</script>