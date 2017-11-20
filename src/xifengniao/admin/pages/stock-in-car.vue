<template>
	<div>
		<el-dialog :close-on-click-modal="false" :close-on-press-escape="false" 
			title="车辆列表" width="995px" :visible.sync="dialogList.visible">
			<el-form style="margin-top: -20px;" class="l-form1" inline label-width="100px" label-position="left">
				<el-form-item label="入库单号">
					<span class="l-text-gray">{{ dialogList.info.storageCode }}</span>
				</el-form-item>
				<el-form-item label="合同号">
					<span class="l-text-gray">{{ dialogList.info.contractNumber }}</span>
				</el-form-item>
				<el-form-item label="合同扫描件">
					<span class="l-text-link">查看</span>
				</el-form-item>
				<el-form-item class="_flex" label="备注">
					<span class="l-text-gray">{{ dialogList.info.remark }}</span>
				</el-form-item>
			</el-form>
	  	<el-table class="l-table-hdbg" stripe element-loading-spinner="el-icon-loading" element-loading-text="拼命加载中" 
	  		:data="list.data" v-loading="list.loading" height="400">
		    <el-table-column label="车辆型号" prop="carsName" min-width="120"></el-table-column>
		    <el-table-column label="车身颜色" prop="colourName" align="center"></el-table-column>
		    <el-table-column label="内饰颜色" prop="interiorName" align="center"></el-table-column>
		    <el-table-column label="发动机号" prop="engineNumber" align="center"></el-table-column>
		    <el-table-column label="车架号" prop="frameNumber" align="center"></el-table-column>
		    <el-table-column label="票证号" prop="certificateNumber" align="center"></el-table-column>
		    <el-table-column label="验车照片" prop="stockCarImages" align="center">
		    	<template slot-scope="scope">
		    		<el-button class="l-text-link" type="text" size="small">查看</el-button>
		      </template>
		    </el-table-column>
		    <el-table-column label="入库仓位" prop="warehouseName" align="center"></el-table-column>
		    <el-table-column label="操作" width="170" align="center">
		    	<template slot-scope="scope">
		    		<el-button class="l-text-link" type="text" size="small" @click="showDialogInfo('edit', scope.row)">编辑</el-button>
		        <el-button class="l-text-error" type="text" size="small" @click="deleteInfo(scope.row)">删除</el-button>
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
		</el-dialog>

		<!-- 新增/编辑车辆 -->
		<el-dialog :close-on-click-modal="false" :close-on-press-escape="false" :before-close="closeDialogInfo"
			:title="dialogInfo.title" :visible.sync="dialogInfo.visible" width="995px">
  		<el-form ref="infoForm" inline class="l-form1" label-width="100px" 
  			:model="dialogInfo.data" :rules="dialogInfo.rules" @keyup.enter.native="submitInfo">
  			<div class="l-flex-hc">
				  <el-form-item class="_flex" label="品牌车型" prop="carsId" style="width: 622px;">
				    <el-cascader style="width: 100%;" :show-all-levels="false" @active-item-change="cascaderItemChange" @change="cascaderChange"
				    	v-model="cascader.value" :options="cascader.data" :props="cascader.props"></el-cascader>
				  </el-form-item>
				  <el-form-item label="仓位" prop="warehouseId" >
				  	<el-select v-model="dialogInfo.data.warehouseId" placeholder="请选择">
					    <el-option v-for="item in dialogInfo.cangList" :key="item.warehouseId" :label="item.warehouseName" :value="item.warehouseId"></el-option>
					  </el-select>
				  </el-form-item>
			  </div>
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
			  <el-form-item label="单价" prop="unitPrice" >
			  	<el-input v-model="dialogInfo.data.unitPrice" :maxlength="10"></el-input>
			  </el-form-item>
			  <el-form-item label="车架号" prop="frameNumber" >
			  	<el-input v-model="dialogInfo.data.frameNumber" :maxlength="10"></el-input>
			  </el-form-item>
			  <el-form-item label="发动机号" prop="engineNumber" >
			  	<el-input v-model="dialogInfo.data.engineNumber" :maxlength="10"></el-input>
			  </el-form-item>
			  <el-form-item label="票证号" prop="certificateNumber" >
			  	<el-input v-model="dialogInfo.data.certificateNumber" :maxlength="10"></el-input>
			  </el-form-item>
			  <el-form-item class="_flex" label="验车照片" prop="imageUpload">
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
			</el-form>
			<span slot="footer" class="l-margin-r-m">
				<el-button @click="closeDialogInfo()">取消</el-button>
		    <el-button type="primary" :loading="dialogInfo.loading" @click="submitInfo">确定提交</el-button>
		  </span>
		</el-dialog>
	</div>
</template>
<script>
export default {
	name: 'stock-in-car',
	data() {
		let that = this
		let validateUpload = function(rule, value, callback) {
			if(that.dialogInfo.upload.loading) {
				callback(new Error('图片正在上传中'))
			}else if(that.dialogInfo.upload.list.length > 9) {
				callback(new Error('最多上传9张照片'))
			}else {
				that.dialogInfo.data.stockCarImages = that.dialogInfo.upload.list.map(item => item.src || item.url).join(',')
				callback()
			}
		}

		let validateCarModel = function(rule, value, callback) {
			if (that.cascader.value.length === 0){
        callback(new Error('必填项'))
      }else{
      	that.dialogInfo.data.carsId = that.cascader.value[2] || ''
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
			dialogList: {
				info: {},
				visible: false
			},
			list: {
				filter: {
					storageId: '',
					carsId: '',
					interiorId: '',
					colourId: ''
				},
				rules: {
					carsId: [],
					interiorId: [],
					colourId: []
				},
				loading: false,
				page: 1,
				rows: 100,
				total: 0,
				data: []
			},
			dialogInfo: {
				type: 'new',
				title: '添加车辆信息',
				visible: false,
				loading: false,
				upload: {
					list: [],
					loading: false,
					visible: false,
					previewUrl: ''
				},
				cangList: [],
				rules: {
					carsId: [
						{ required: true, validator: validateCarModel, trigger: 'change' }
					],
					colourId: [
						{ required: true, type:'number', message: '必填项', trigger: 'change' }
					],
					interiorId: [
						{ required: true, type:'number', message: '必填项', trigger: 'change' }
					],
					warehouseId: [
						{ required: true, type:'number', message: '必填项', trigger: 'change' }
					],
					unitPrice: [
						{ required: true, type: 'number', message: '必填项', trigger: 'blur' },
						{ pattern: /^\d{1,9}(\.\d{1,2})?$/, message: '请输入正确格式(如：3500)', trigger: 'blur' }
					],
					frameNumber: [
						{ required: true, message: '必填项', trigger: 'blur' }
					],
					engineNumber: [
						{ required: true, message: '必填项', trigger: 'blur' }
					],
					imageUpload: [
						{ validator: validateUpload, trigger: 'change' },
					]
				},
				colorList: [],
				neishiList: [],
				data: {
					stockCarId: '',
					storageId: '',
					carsId: '',
					colourId: '',
					interiorId: '',
					unitPrice: '',
					frameNumber: '',
					engineNumber: '',
					certificateNumber: '',
					warehouseId: '',
					stockCarImages: ''
				}
			}
		}
	},
	methods: {
		uploadSuccess(response, file, fileList) {
			this.dialogInfo.upload.loading = false
			this.dialogInfo.upload.list.push({
				name: file.name,
				url: response.data,
				src: response.data
			})
		},
		uploadPreview(file) {
			this.$parent.$$viewer.index = this.dialogInfo.upload.list.findIndex(item => item.url === file.url) || 0
			this.$parent.$$viewer.show()
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
			// 获取车身颜色和内饰颜色
			this.$$api.color.getCheshenList(valArr[1]).then(({data}) => {
    		this.dialogInfo.colorList = data
    	})
    	this.$$api.color.getNeishiList(valArr[1]).then(({data}) => {
    		this.dialogInfo.neishiList = data
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
			let promise = this.$$api.stock.getInCarList(this.list.filter, page, rows)
			.then(({data}) => {
				this.list.total = data.total
        this.list.page = data.page
        this.list.rows = data.rows
        this.list.data = data.list.map(item => {
        	item.doing = false
        	return item
        })
			})

			promise.finally(_ => {
				this.list.loading = false
			})

			return promise
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
		showDialogInfo(type = 'new', row) { // 新增/修改车辆信息
			let brandPromise = this.$$api.car.getBrandList().then(({data}) => {
				this.cascader.data = data.map(item => {
					item.children = []
					return item
				})
				return data
			})

			let cangPromise = this.$$api.zuzhi.getCangList().then(({data}) => {
				this.dialogInfo.cangList = data
				return data
			})

			this.dialogInfo.type = type
			if(type === 'edit') {
				this.dialogInfo.title = '修改车辆信息'
				this.$$utils.copyObj(this.dialogInfo.data, row)
				this.cascader.value = [row.brandId, row.familyId, row.carsId]

				this.dialogInfo.upload.list = row.stockCarImages ? row.stockCarImages.split(',').map(imageUrl => {
					return {url: this.$$utils.image.thumb(imageUrl, 150), src: imageUrl, name: imageUrl}
				}) : []
				this.$parent.viewer.images = this.dialogInfo.upload.list
				
				if(row.brandId) {
					brandPromise.then(data => {
						this.cascaderItemChange([row.brandId]).then(_ => {
							if(row.familyId) {
								this.cascaderItemChange([row.brandId, row.familyId])
							}
						})
						return data
					})
				}
			} else {
				this.dialogInfo.title = '新增车辆信息'
				this.cascader.value = []
				this.$$utils.copyObj(this.dialogInfo.data, '')
				this.dialogInfo.data.storageId = row.storageId
			}

			const loading = this.$loading()
			Promise.all([brandPromise, cangPromise]).then(dataArr =>　{
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
		submitInfo() { // 提交车辆信息
			this.$refs.infoForm.validate(valid => {
        if (valid) {
          this.dialogInfo.loading = true
          this.$$api.stock.addIn(this.dialogInfo.data).then(_ => {
            this.closeDialogInfo()
            this.$message({
							type: 'success',
							message: (this.dialogInfo.type === 'new' ? '新增' : '修改') + '客户成功'
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
		deleteInfo(row) { // 删除车辆
			this.$confirm('是否确定删除该车辆?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(_ => {
      	row.doing = true
				this.$$api.stock.delIn(row.stockCarId).then(_ => {
					this.$message({
						type: 'success',
						message: '删除车辆成功'
					})
					this.refreshList()
				}).finally(_ => {
					row.doing = false
				})
      })
		}
	},
	mounted() {
		this.$$event.$on('stock:car-list', row => {
			this.list.filter.storageId = row.storageId
			this.dialogList.info = row
			this.getList().then(_ => {
				this.dialogList.visible = true
			})
		})

		this.$$event.$on('stock:car-add', row => {
			this.showDialogInfo('new', row)
		})
	}
}
</script>