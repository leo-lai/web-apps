<template>
	<div>
		<el-row>
			<el-col :span="4">
				<el-button type="primary" @click="showDialogInfo('new')">新增</el-button>
			</el-col>
  		<el-col :span="20" class="l-text-right">
  			<el-form inline ref="listFilter" :model="list.filter" :rules="list.rules" @submit.native.prevent @keyup.enter.native="search">
					<el-form-item prop="type">
  					<el-select v-model="list.filter.type" placeholder="文章类别" @change="search()">
				      <el-option v-for="item in typeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
				    </el-select>
  				</el-form-item>
				  <el-form-item prop="keywords">
				  	<el-input v-model="list.filter.keywords" placeholder="请输入文章标题"></el-input>
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
	    <el-table-column label="文章标题" prop="title" min-width="200"></el-table-column>
	    <el-table-column label="文章类别" prop="type"></el-table-column>
	    <el-table-column label="发布时间" prop="publishedTime" align="center"></el-table-column>
			<el-table-column label="状态" prop="stateName" align="center"></el-table-column>
	    <el-table-column label="操作" align="center">
	    	<template slot-scope="scope">
					<span v-show="scope.row.doing" class="l-text-warn"><i class="el-icon-loading"></i>&nbsp;操作中</span>
	        <span v-show="!scope.row.doing">
						<el-button v-if="scope.row.state == 0" class="l-text-ok" type="text" size="small" @click="publishInfo(scope.row)">发布</el-button>
						<el-button v-if="scope.row.state > -1" class="l-text-link" type="text" size="small" @click="showDialogInfo('edit', scope.row)">编辑</el-button>
						<el-button class="l-text-error" type="text" size="small" @click="deleteInfo(scope.row)">删除</el-button>
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
 
	  <!-- 文章详情 -->
		<el-dialog class="l-padding-tb-0" :close-on-click-modal="false" :close-on-press-escape="false" :before-close="closeDialogInfo"
			:title="dialogInfo.title" :visible.sync="dialogInfo.visible" width="995px">
  		<el-form class="l-form1" ref="infoForm" label-width="100px" inline :model="dialogInfo.data" :rules="dialogInfo.rules">
  			<el-form-item class="_flex" label="文章标题" prop="title">
			    <el-input placeholder="请输入文章标题" v-model="dialogInfo.data.title" :maxlength="200"></el-input>
			  </el-form-item>
				<el-form-item label="文章类别" prop="type">
			    <el-select v-model="dialogInfo.data.type" placeholder="文章类别">
						<el-option v-for="item in typeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
			  </el-form-item>
				<el-form-item label="文章缩略图" prop="icon">
			    <uploader ref="dialogInfoUpload" :limit="1" :file-list.sync="dialogInfo.uploadList"></uploader>
			  </el-form-item>
			  <el-form-item class="_flex" label="摘要" prop="pl" >
			    <el-input type="textarea" placeholder="请输入文章摘要" v-model="dialogInfo.data.excerpt" :maxlength="500"></el-input>
			  </el-form-item>
			  
			  <el-form-item class="_flex" label="文章内容" prop="content" >
			 		<quill-editor ref="dialogInfoEditor" class="l-text-editor" v-model="dialogInfo.data.content"></quill-editor>
			  </el-form-item>
			</el-form>
			<span slot="footer" class="l-margin-r-m">
				<el-button @click="closeDialogInfo()">取消</el-button>
		    <el-button type="primary" :loading="dialogInfo.loading" @click="submitDialogInfo">保存</el-button>
				<!-- <el-button type="success" :loading="dialogInfo.loading" @click="publishDialogInfo">保存并发布</el-button> -->
		  </span>
		</el-dialog>
	</div>
</template>
<script>
import uploader from 'components/uploader'
export default {
	name: 'school-list',
	components: { uploader },
	data() {
		let that = this

		return {
			uploadList: [],
			typeList: [
				{ label: '公司新闻', value: '1'},
				{ label: '行业动态', value: '2'},
				{ label: '汽车商学院', value: '3'},
				{ label: '喜蜂鸟学堂', value: '4'}
			],
			list: {
				filter: {
					type: '',
					keywords: ''
				},
				rules: {
					type: [],
					keywords: []
				},
				loading: false,
				page: 1,
				rows: 10,
				total: 0,
				data: []
			},
			dialogInfo: {
				type: 'new',
				title: '新增文章',
				visible: false,
				loading: false,
				rules: {
					title: [
						{ required: true, message: '请输入文章标题',  trigger: 'blur' }
					],
					type: [
						{ required: true, message: '请选择文章类别',  trigger: 'change' }
					],
					content: [
						{ required: true, message: '请输入文章内容',  trigger: 'change' }
					]
				},
				uploadList: [],
				data: {
					title: '',
					excerpt: '',
					content: '',
					type: '',
					icon: '',
					videoUrl: ''
				}
			}
		}
	},
	methods: {
		sizeChange(size = 50) {
			this.getList(1, size)
		},
		pageChange(page = 1) {
			this.getList(page)
		},
		getList(page = 1, rows) {
			this.list.loading = true
			this.$$api.school.getList(this.list.filter, page, rows || this.list.rows)
			.then(({data}) => {
				this.list.total = data.total
        this.list.page = data.page
        this.list.rows = data.rows
        this.list.data = data.list.map(item => {
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
		showDialogInfo(type = 'new', row) { // 新增/编辑文章
			if(type === 'new') {
				this.dialogInfo.visible = true
				this.dialogInfo.data.id = ''
			}else if(type === 'edit'){
				let loading = this.$loading()
				this.dialogInfo.data.id = row.id
				this.$$api.school.getInfo(row.id).then(({data}) => {
					this.dialogInfo.data = this.$$utils.copyObj(this.dialogInfo.data, data)
					this.dialogInfo.uploadList = data.icon ? data.icon.split(',').map(img => {
						return {
							url: this.$$utils.image.thumb(img, 150), 
							thumb: this.$$utils.image.thumb(img, 150), 
							src: img, 
							name: img, 
							status: 'success'
						}
					}) : []
					this.dialogInfo.visible = true
				}).finally(_ => {
					loading.close()
				})
			}
		},
		closeDialogInfo(done) {
			if(done) {
				done()
			}else{
				this.dialogInfo.visible = false	
			}
			this.$refs.dialogInfoEditor.quill.root.click()
			this.$refs.infoForm.resetFields()
			this.dialogInfo.uploadList = []
			this.$$utils.copyObj(this.dialogInfo.data, '')
		},
		submitDialogInfo() { // 保存文章
			this.$refs.infoForm.validate(valid => {
        if (valid) {
					if(this.$refs.dialogInfoUpload.waiting > 0) {
						this.$message.error('缩略图正在上传中...')
						return
					}

					if(!this.dialogInfo.data.content) {
						this.$message.error('请输入文章内容')
						return
					}
					if(this.$refs.dialogInfoEditor.$el.querySelectorAll('.l-convert-doing').length > 0) {
						this.$message.error('等待文章内容图片上传完毕')
						return
					}
					
					if(this.dialogInfo.uploadList.length > 0){
						this.dialogInfo.data.icon = this.dialogInfo.uploadList[0].src
					}
					
					this.dialogInfo.loading = true
					let promise = null
					if(this.dialogInfo.data.id) {
						promise = this.$$api.school.edit(this.dialogInfo.data)
					}else {
						promise = this.$$api.school.add(this.dialogInfo.data)
					}
          return promise.then(_ => {
            this.$message({
							type: 'success',
							message: '操作成功'
						})
						this.closeDialogInfo()
            this.refreshList()
          }).finally(()=>{
            this.dialogInfo.loading = false
          })  
        }
      })
		},
		deleteInfo(row) { // 启用-删除
			this.$confirm('是否确定'+ (row.state == -1 ? '启用' : '删除') +'该文章?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(_ => {
      	row.doing = true
				this.$$api.school.del(row.id).then(_ => {
					this.$message({
						type: 'success',
						message: '操作成功'
					})
					this.refreshList()
				}).finally(_ => {
					row.doing = false
				})
      })
		},
		publishInfo(row) {
			row.doing = true
			this.$$api.school.publish(row.id).then(_ => {
				this.$message({
					type: 'success',
					message: '发布成功'
				})
				this.refreshList()
			}).finally(_ => {
				row.doing = false
			})
		},
		publishDialogInfo() {

		}
	},
	mounted() {
		this.$$event.$on('school:tab', (activeName, that) => {
			if(activeName === 'list' && this.list.data.length === 0) {
				this.$$parent = that
				this.getList()
			}
		})
	},
	beforeDestroy() {
		this.$$event.$off('school:tab')
	}
}
</script>