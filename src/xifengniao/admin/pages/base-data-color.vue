<template>
	<div>
		<el-row>
  		<el-col :span="24" class="l-text-right">
  			<el-form inline ref="listFilter" :model="list.filter" :rules="list.rules" @submit.native.prevent >
				  <el-form-item prop="brandId" label="车辆品牌">
				  	<el-select v-model="list.filter.brandId" placeholder="请选择" @change="search()">
				      <el-option v-for="item in brandList" :key="item.id" :label="item.name" :value="item.id"></el-option>
				    </el-select>
				  </el-form-item>
				  <el-form-item>
				    <el-button type="primary" @click="search">查询</el-button>
				    <el-button @click="clear">清除查询条件</el-button>
				  </el-form-item>
				</el-form>
  		</el-col>
  	</el-row>
  	<el-table class="l-table-hdbg" stripe element-loading-spinner="el-icon-loading" element-loading-text="拼命加载中" 
  		:data="list.data" v-loading="list.loading">
	    <el-table-column label="车系名称" prop="carFamilyName"></el-table-column>
	    <el-table-column label="操作" >
	    	<template slot-scope="scope">
	        <el-button class="l-text-link" type="text" size="small" @click="showDialogCheshen(scope.row)">车身颜色</el-button>
	        <el-button class="l-text-warn" type="text" size="small">内饰颜色</el-button>
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

	  <!-- 车身颜色列表 -->
		<el-dialog :close-on-click-modal="false" :close-on-press-escape="false" 
			title="车身颜色管理" :visible.sync="dialogCheshen.visible" width="600px">
			<div class="l-scroll" style="max-height: 400px; margin: -20px 0;">
	  		<el-table :data="dialogCheshen.list">
			    <el-table-column label="车身颜色" prop="carColourName" min-width="150"></el-table-column>
			    <el-table-column label="车身照片" align="center">
			    	<template slot-scope="scope">
			        <el-button class="l-text-link" type="text" size="small" @click="showCheshenImages(scope.row)">查看照片</el-button>
			      </template>
			    </el-table-column>
			    <el-table-column label="操作" align="center">
			    	<template slot-scope="scope">
			        <el-button class="l-text-link l-margin-r-s" type="text" size="small" @click="showCheshenColor('edit', scope.row)">编辑</el-button>
			        <span v-show="scope.row.deling" class="l-text-warn"><i class="el-icon-loading"></i>&nbsp;操作中</span>
			        <span v-show="!scope.row.deling">
			        	<el-button class="l-text-error" type="text" size="small" @click="deleteCheshenColor(scope.row)">删除</el-button>
			        </span>
			      </template>
			    </el-table-column>
			  </el-table>
		  </div>
		  <!-- 新增/编辑颜色 -->
		  <el-dialog :close-on-click-modal="false" :close-on-press-escape="false" append-to-body width="600px"
		  	:title="dialogCheshen.title" :before-close="closeCheshenColor" :visible.sync="dialogCheshen.innerVisible">
		  	<el-form inline class="l-form1" ref="cheshenColorForm" label-width="90px" style="width: 552px;"
	  			:model="dialogCheshen.data" :rules="dialogCheshen.rules" @keyup.enter.native="submitCheshenColor">
				  <el-form-item label="车身颜色" prop="carColourName">
				    <el-input v-model="dialogCheshen.data.carColourName" :maxlength="50"></el-input>
				  </el-form-item>
				  <el-form-item class="_flex" label="车身照片" prop="imageUpload">
				  	<el-upload class="l-upload-card" accept="image/*" list-type="picture-card" multiple :limit="9"
				  		:file-list="dialogCheshen.upload.list"
				  		:action="$$api.baseURL + 'uploadImage'" name="img_file"
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
					<el-button @click="closeCheshenColor()">返回</el-button>
			    <el-button type="primary" :loading="dialogCheshen.loading" @click="submitCheshenColor">确定提交</el-button>
			  </span>
		  </el-dialog>
			<span slot="footer" class="l-margin-r-m">
				<el-button @click="dialogCheshen.visible = false">取消</el-button>
		    <el-button type="primary" :loading="dialogCheshen.loading" @click="showCheshenColor('new')">新增车身颜色</el-button>
		  </span>
		</el-dialog>

		<!-- 预览图片 -->
		<viewer ref="viewer" class="l-viewer" :options="$$config.viewer.options" :images="viewer.images" @inited="viewerInited">
      <img v-for="src in viewer.images" :src="src" :key="src">
    </viewer>
	</div>
</template>
<script>
import viewer from 'v-viewer/src/component.vue'
export default {
	name: 'base-data-color',
	components: {
    viewer
  },
	data() {
		let that = this
		let validateUpload = function(rule, value, callback) {
			if(that.dialogCheshen.upload.loading) {
				callback(new Error('图片正在上传中'))
			}else if(that.dialogCheshen.upload.list.length > 9) {
				callback(new Error('最多上传9张照片'))
			}else {
				that.dialogCheshen.data.imagePath = that.dialogCheshen.upload.list.map(item => item.src || item.url).join(',')
				callback()
			}
		}

		return {
			brandList: [],
			viewer: {
				options: {},
				visible: true,
				images: ['http://mirari.cc/v-viewer/assets/img/losglaciares_1920_1200_ss_01_thumbnail.5025b19.jpg', 'http://mirari.cc/v-viewer/assets/img/losglaciares_1920_1200_ss_02_thumbnail.ead8dcf.jpg']
			},
			list: {
				filter: {
					brandId: ''
				},
				rules: {
					brandId: []
				},
				loading: false,
				page: 1,
				rows: 100,
				total: 0,
				data: []
			},
			dialogCheshen: {
				upload: {
					list: [],
					loading: false
				},
				visible: false,
				type: 'new',
				title: '新增车身颜色',
				innerVisible: false,
				loading: false,
				list: [],
				rules: {
					carColourName: [
						{ required: true, message: '必填项', trigger: 'blur' }
					],
					imageUpload: [
						{ validator: validateUpload, trigger: 'change' },
					]
				},
				data: {
					familyId: '',
					carColourId: '',
					carColourName: '',
					imagePath: ''
				}
			}
		}
	},
	methods: {
		viewerInited(viewer) {
			console.log(viewer)
			this.$$viewer = viewer
		},
		uploadSuccess(response, file, fileList) {
			this.dialogCheshen.upload.loading = false
			this.dialogCheshen.upload.list.push({
				name: file.name,
				url: response.data,
				src: response.data
			})
		},
		uploadPreview(file) {
			this.dialogCheshen.upload.visible = true
			this.dialogCheshen.upload.previewUrl = file.src || file.url
		},
		uploadRemove(file, fileList) {
			if(file.status === 'success') {
				this.dialogCheshen.upload.list = this.dialogCheshen.upload.list.filter(item =>  {
					if(file.response) {
						return item.src !== file.response.data
					}else {
						return item.src !== (file.src || file.url)
					}
				})
			}
		},
		uploadProgress(event, file, fileList) {
			this.dialogCheshen.upload.loading = true
		},
		uploadError(error, file, fileList) {
			this.dialogCheshen.upload.loading = false
		},
		uploadExceed(files, fileList) {
			this.$message({
				type: 'error',
				message: '最多上传9张照片'
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
			this.$$api.color.getList(this.list.filter, page, rows)
			.then(({data}) => {
				this.list.total = data.total
        this.list.page = data.page
        this.list.rows = data.rows
        this.list.data = data.list
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
		getCheshenColors(carFamilyId = '') { // 获取车身颜色列表
			return this.$$api.color.getCheshenList(carFamilyId).then(({data}) => {
				this.dialogCheshen.list = data.map(item => {
        	item.deling = false
        	return item
        })
        return data
			})
		},
		showCheshenImages(row) { // 查看车身颜色对应的车身照片
			// const loading = this.$loading()
			// this.$$api.color.getImages(row.carColourId).then(({data}) => {
				
			// }).finally(_ => {
			// 	loading.close()
			// })
			this.$$viewer.show()
			// this.$$viewer.view(1)
		},
		showDialogCheshen(row) { // 车身颜色管理
			const loading = this.$loading()
			this.dialogCheshen.data.familyId = row.carFamilyId
			this.getCheshenColors(row.carFamilyId).then(_ => {
        this.dialogCheshen.visible = true	
			}).finally(_ => {
				loading.close()
			})
		},
		showCheshenColor(type = 'new', row) { // 新增/修改车身颜色
			this.dialogCheshen.type = type
			let promise = Promise.resolve()
			if(type === 'edit') {
				this.dialogCheshen.title = '修改车身颜色'
				this.$$utils.copyObj(this.dialogCheshen.data, row)
				promise = this.$$api.color.getImages(row.carColourId).then(({data}) => {
					this.upload.list = data.map(imageUrl => {
						return {url: this.$$utils.image.thumb(imageUrl, 150), name: imageUrl, src: imageUrl}
					})
					this.dialogCheshen.data.imagePath = data.join(',')
					return data
				})
			} else {
				this.dialogCheshen.title = '新增车身颜色'
			}
			const loading = this.$loading()
			promise.finally(_ => {
				this.dialogCheshen.innerVisible = true
				loading.close()
			})
		},
		closeCheshenColor(done) {
			if(done) {
				done()
			}else{
				this.dialogCheshen.innerVisible = false	
			}
			this.$refs.cheshenColorForm.resetFields()
		},
		submitCheshenColor() { // 新增/修改车身颜色
			this.$refs.cheshenColorForm.validate(valid => {
        if (valid) {
          this.dialogCheshen.loading = true
          this.$$api.color.add(this.dialogCheshen.data).then(({data}) => {
          	this.dialogCheshen.data.carColourId = data.carColourId
          	let promise = Promise.resolve()
          	if(this.dialogCheshen.data.imagePath) {
          		promise = this.$$api.color.addImages(this.dialogCheshen.data)
          	}
          	promise.then(_ => {
          		this.getCheshenColors(this.dialogCheshen.data.familyId)
	          	this.closeCheshenColor()
	            this.$message({
								type: 'success',
								message: (this.dialogCheshen.type === 'new' ? '新增' : '修改') + '车身颜色'
							})
          	}).finally(()=>{
	            this.dialogCheshen.loading = false
	          })
          }).finally(()=>{
            this.dialogCheshen.loading = false
          })
        }else {
        	this.$message({
						type: 'error',
						message: '请完善表单信息'
					})
        }
      })
		},
		deleteCheshenColor(row) {
			this.$confirm('是否确定删除该颜色?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
	      row.deling = true
				this.$$api.color.del(row.carColourId).then(() => {
					this.$message({
						type: 'success',
						message: '删除车身颜色成功'
					})
					this.getCheshenColors(this.dialogCheshen.data.familyId)
				}).finally(_ => {
					row.deling = false
				})
      })
		}
	},
	mounted() {
		this.$$event.$on('base-data:tab', activeName => {
			if(activeName === 'color' && this.list.data.length === 0) {
				this.getList()
				this.$$api.car.getBrandList().then(({data}) => {
					this.brandList = data
				})
			}
		})
	}
}
</script>