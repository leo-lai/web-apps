<template>
	<div>
  	<el-row>
  		<el-col :span="4">
  			<el-button type="primary" @click="showDialogInfo('new')">新增组织</el-button>
  		</el-col>
  		<el-col :span="20" class="l-text-right">
  			<el-form inline ref="listFilter" :model="list.filter" :rules="list.rules" @submit.native.prevent @keyup.enter.native="search">
				  <el-form-item prop="keywords">
				    <el-input placeholder="请输入组织名称" v-model="list.filter.keywords"></el-input>
				  </el-form-item>
				  <el-form-item>
				    <el-button type="primary" @click="search">查询</el-button>
				    <el-button type="danger" @click="clear">刷新</el-button>
				  </el-form-item>
				</el-form>
  		</el-col>
  	</el-row>
  	<el-table class="l-table-hdbg" stripe element-loading-spinner="el-icon-loading" element-loading-text="拼命加载中" 
  		:data="list.data" v-loading="list.loading" >
	    <el-table-column label="组织名称" prop="orgName" min-width="130px"></el-table-column>
	    <!-- <el-table-column label="上级组织" prop="parentOrgName" min-width="130px"></el-table-column> -->
	    <!-- <el-table-column label="标签" prop="orgLevel" align="center" width="130px">
	    	<template slot-scope="scope">
	    		<el-tag v-if="scope.row.orgLevel === 1" type="success">公司</el-tag>
	    		<el-tag v-else-if="scope.row.orgLevel === 2" type="warning">分公司</el-tag>
	    		<el-tag v-else type="primary">门店</el-tag>
	      </template>
	    </el-table-column> -->
	    <el-table-column label="详细地址" prop="address" min-width="150px"></el-table-column>
	    <el-table-column label="状态" prop="status" align="center" width="130px">
	    	<template slot-scope="scope">
					<span :class="statusClass[scope.row.status]">{{statusText[scope.row.status]}}</span>
	    		<!-- <span v-if="scope.row.status === 1" class="l-text-ok">运营中</span>
	    		<span v-else class="l-text-error">已禁用</span> -->
	      </template>
	    </el-table-column>
	    <el-table-column label="操作" align="center" width="130px">
	    	<template slot-scope="scope">
	        <span v-show="scope.row.doing" class="l-text-warn"><i class="el-icon-loading"></i>&nbsp;操作中</span>
	        <span v-show="!scope.row.doing">
	        	<el-button class="l-text-link" type="text" size="small" @click="showDialogInfo('edit', scope.row)">编辑</el-button>
	        	<el-button v-if="scope.row.status === 1" class="l-text-error" type="text" size="small" @click="enableAsk(scope.row, 0)">禁用</el-button>
	        	<el-button v-else class="l-text-ok" type="text" size="small" @click="enableAsk(scope.row, 1)">启用</el-button>	
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

	  <!-- 新增/编辑组织 -->
		<el-dialog :close-on-click-modal="false" :close-on-press-escape="false" :before-close="closeDialogInfo" 
			:title="dialogInfo.title" :visible.sync="dialogInfo.visible" width="995px">
  		<el-form class="l-form1" ref="infoForm" label-width="100px"  inline
  			:model="dialogInfo.data" :rules="dialogInfo.rules" @keyup.enter.native="submitDialogInfo">
			  <el-form-item label="名称" prop="shortName">
			    <el-input v-model="dialogInfo.data.shortName" placeholder="请输入组织名称" :maxlength="50"></el-input>
			  </el-form-item>
			  <!-- <el-form-item label="级别" prop="orgLevel">
			    <el-select v-model="dialogInfo.data.orgLevel" placeholder="请选择" @change="orgLevelChange">
			    	<el-option v-for="(item,index) in $$config.baseData.orgLevel" :key="index" :label="item" :value="index+1"></el-option>
			    </el-select>
			  </el-form-item> -->
			  <el-form-item label="性质" prop="orgType">
			  	<el-select v-model="dialogInfo.data.orgType" placeholder="请选择">
			    	<el-option label="直营" :value="1"></el-option>
			    	<el-option label="加盟" :value="2"></el-option>
			    	<el-option label="联盟" :value="3"></el-option>
			    	<el-option label="其他" :value="4"></el-option>
			    </el-select>
			  </el-form-item>
			  <!-- <el-form-item label="上级组织" prop="parentId">
			  	<el-select v-model="dialogInfo.data.parentId" placeholder="请选择" :disabled="!dialogInfo.isParent">
			      <el-option v-for="item in dialogInfo.zuzhiParents" :key="item.orgId" :label="item.shortName" :value="item.orgId"></el-option>
			    </el-select>
			  </el-form-item> -->
			  <el-form-item label="联系电话" prop="telephone">
			  	<el-input :maxlength="20" v-model="dialogInfo.data.telephone"></el-input>
			  </el-form-item>
			  <el-form-item class="_flex" label="地址" @click.native="amapOpts.visible = true" prop="region">
			  	<el-input readonly style="width: 526px;" placeholder="如：广东省广州市海珠区东晓南路548号"
				  	:value="amapAddress"></el-input>
			  	<span class="l-margin-lr-s">经度</span>
			  	<el-input readonly style="width: 109px;" :value="dialogInfo.data.longitude"></el-input>
			  	<span class="l-margin-lr-s">纬度</span>
			  	<el-input readonly style="width: 109px;" :value="dialogInfo.data.latitude"></el-input>
			  </el-form-item>
			  <el-form-item class="_flex" label="简要介绍" prop="introduce">
			  	<el-input type="textarea" placeholder="" :maxlength="500" v-model="dialogInfo.data.introduce"></el-input>
			  </el-form-item>
			  <el-form-item label="银行卡账号" prop="bankAccount">
			  	<el-input :maxlength="20" v-model="dialogInfo.data.bankAccount"></el-input>
			  </el-form-item>
			  <el-form-item label="开户姓名" prop="nameOfAccount">
			  	<el-input :maxlength="20" v-model="dialogInfo.data.nameOfAccount"></el-input>
			  </el-form-item>
			  <el-form-item></el-form-item>
			  <el-form-item label="银行名称" prop="bankName">
			  	<el-input :maxlength="50" v-model="dialogInfo.data.bankName"></el-input>
			  </el-form-item>
			  <el-form-item label="开户支行" prop="openingBranch">
			  	<el-input :maxlength="50" v-model="dialogInfo.data.openingBranch"></el-input>
			  </el-form-item>
			  <el-form-item class="_flex" prop="upload">
			  	<div slot="label" style="display:inline;">
			  		显示照片<p style="font-size:12px;" class="l-text-gray">(最多上传9张)</p></div>
			  	<uploader ref="dialogInfoUpload" :file-list.sync="dialogInfo.uploadList"></uploader>
			  </el-form-item>
			</el-form>
			<span slot="footer" class="l-margin-r">
				<el-button @click="closeDialogInfo()">取消</el-button>
		    <el-button type="primary" :loading="dialogInfo.loading" @click="submitDialogInfo">确定提交</el-button>
		  </span>
		</el-dialog>

		<!-- 地图选择 -->
		<amap-selector :visible.sync="amapOpts.visible" :options="amapOpts"></amap-selector>
  </div>
</template>
<script>
import AmapSelector from 'components/amap-selector'
import uploader from 'components/uploader'
import { getValueByText } from 'assets/js/region.data'

export default {
	name: 'base-setting-zuzhi',
	components: {
		AmapSelector, uploader
	},
	data() {
		let that = this
		let validateRegion = function(rule, value, callback) {
      if (!(that.dialogInfo.data.provinceId && that.dialogInfo.data.cityId 
      	&& that.dialogInfo.data.areaId && that.dialogInfo.data.address)){
        callback(new Error('请选择地址'))
      } else if(!that.dialogInfo.data.longitude || !that.dialogInfo.data.latitude){
        callback(new Error('经纬度不正确'))
      }else{
        callback()
      }
		}

		let validateUpload = function(rule, value, callback) {
			if(that.$refs.dialogInfoUpload.waiting > 0) {
				callback(new Error('图片正在上传中'))
			}else if(that.dialogInfo.uploadList.length === 0) {
				callback(new Error('请上传照片'))
			}else {
				that.dialogInfo.data.imageurl = that.dialogInfo.uploadList.map(item => item.src || item.url).join(',')
				callback()
			}
		}

		let validateParent = function(rule, value, callback) {
			if(that.dialogInfo.data.orgLevel === 1 || that.dialogInfo.data.parentId) {
				callback()
			}else if(!that.dialogInfo.data.parentId){
				callback(new Error('必选项'))
			}
		}

		return {
			statusText: ['', '正常使用', '已禁用', '待审核'],
			statusClass: ['', 'l-text-ok', 'l-text-error', 'l-text-warn'],
			amapOpts: {
				visible: false,
				province: '',
        city: '',
        area: '',
        address: '',
        longitude: '',
        latitude: '',
				onSelected(addressObj) {
					let regionValue = getValueByText(addressObj.province, addressObj.city, addressObj.area)
					that.dialogInfo.data.provinceId = regionValue[0] || ''
					that.dialogInfo.data.cityId = regionValue[1] || ''
					that.dialogInfo.data.areaId = regionValue[2] || ''
					
					that.dialogInfo.data.province = addressObj.province
					that.dialogInfo.data.city = addressObj.city
					that.dialogInfo.data.area = addressObj.area
					that.dialogInfo.data.address = addressObj.address
					that.dialogInfo.data.longitude = addressObj.longitude
					that.dialogInfo.data.latitude = addressObj.latitude
				}
			},
			list: {
				filter: {
					keywords: ''
				},
				rules: {
					keywords: []
				},
				loading: false,
				page: 1,
				rows: 100,
				total: 0,
				data: []
			},
			dialogInfo: {
				title: '新增组织',
				visible: false,
				isParent: true,
				uploadList: [],
				zuzhiParents: [],
				rules: {
					shortName: [
						{ required: true, message: '必填项', trigger: 'blur' }
					],
					// orgLevel: [
					// 	{ required: true, type: 'number', message: '必选项', trigger: 'change' }
					// ],
					orgType: [
						{ required: true, type: 'number', message: '必选项', trigger: 'change' }
					],
					// parentId: [
					// 	{ required: true, validator: validateParent, trigger: 'change' }
					// ],
					telephone: [
						{ required: true, message: '必填项', trigger: 'blur' },
					],
					introduce: [
						{ required: true, message: '必填项', trigger: 'blur' },
					],
					bankAccount: [
						{ required: true, message: '必填项', trigger: 'blur' },
					],
					nameOfAccount: [
						{ required: true, message: '必填项', trigger: 'blur' },
					],
					bankName: [
						{ required: true, message: '必填项', trigger: 'blur' },
					],
					openingBranch: [
						{ required: true, message: '必填项', trigger: 'blur' },
					],
					region: [
						{ required: true, validator: validateRegion, trigger: 'change' },
					],
					upload: [
						{ required: true, validator: validateUpload, trigger: 'change' },
					]
				},
				data: {
					id: '',
					shortName: '',
					// orgLevel: '',
					orgType: '',
					// parentId: '',
					longitude: '',
					latitude: '',
					province: '',
					provinceId: '',
					cityId: '',
					city: '',
					areaId: '',
					area: '',
					address: '',
					telephone: '',
					bankAccount: '',
					nameOfAccount: '',
					bankName: '',
					openingBranch: '',
					introduce: '',
					imageurl: ''
				}
			}
		}
	},
	computed: {
		amapAddress() {
			let address = this.dialogInfo.data.city + this.dialogInfo.data.area + this.dialogInfo.data.address
			if(this.dialogInfo.data.province !== this.dialogInfo.data.city) {
				address = this.dialogInfo.data.province + address 
			}
			return address || ''
		},
	},
	methods: {
		orgLevelChange(value = 1) {
			this.dialogInfo.isParent = value === 1 ? false : true
			this.$$api.zuzhi.getParent(value).then(({data}) => {
				this.dialogInfo.zuzhiParents = data
				if(value === this.dialogInfo._orgLevel) {
					this.dialogInfo.data.parentId = this.dialogInfo._parentId
				}else{
					this.dialogInfo.data.parentId = ''
				}
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
			this.$$api.zuzhi.getList(this.list.filter, page, rows)
			.then(({data}) => {
				if(data) {
					this.list.total = data.total
					this.list.page = data.page
					this.list.rows = data.rows
					this.list.data = data.list.map(item => {
						item.doing = false
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
		showDialogInfo(type = 'new', row) {
			this.dialogInfo.type = type
			if(type === 'edit') {
				this.dialogInfo.title = '修改组织'

				const loading = this.$loading()
				this.$$api.zuzhi.getInfo(row.id).then(({data}) => {
					data.orgType = Number(data.orgType)
					this.$$utils.copyObj(this.amapOpts, data)
					this.$$utils.copyObj(this.dialogInfo.data, data)

					// this.dialogInfo._orgLevel = data.orgLevel
					// this.dialogInfo._parentId = data.parentId
					// this.orgLevelChange(data.orgLevel)

					this.dialogInfo.uploadList = this.dialogInfo.data.imageurl ? 
					this.dialogInfo.data.imageurl.split(',').map(img => {
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
			} else {
				this.dialogInfo.title = '新增组织'
				this.dialogInfo.visible = true
			}
		},
		closeDialogInfo(done) {
			if(done) {
				done()
			}else{
				this.dialogInfo.visible = false	
			}
			this.resetDialogInfo()
		},
		resetDialogInfo() {
			this.$refs.infoForm && this.$refs.infoForm.resetFields()
			this.dialogInfo.uploadList = []
			this.$$utils.copyObj(this.dialogInfo.data, '')
		},
		submitDialogInfo() { // 提交组织信息
			this.$refs.infoForm.validate(valid => {
        if (valid) {
					this.dialogInfo.loading = true
					let promise = this.dialogInfo.type == 'edit' ? this.$$api.zuzhi.edit(this.dialogInfo.data) : this.$$api.zuzhi.add(this.dialogInfo.data)
          promise.then(_ => {
            this.$message({
							type: 'success',
							message: (this.dialogInfo.type == 'edit' ? '修改' : '新增') + '组织成功'
						})
						this.closeDialogInfo()
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
		enableAsk(row, status = 1) {
			if(status == 0){
				this.$confirm('是否确定禁用该组织?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(_ => {
        	this.enable(row, status)  
        })
			}else{
				this.enable(row, status)
			}
		},
		enable(row, status = 1) { // 禁用/启用组织
			row.doing = true
			this.$$api.zuzhi.enable(row.id, status).then(_ => {
				row.status = status == 0 ? 2 : status
				this.$message({
					type: 'success',
					message: status === 1 ? '启用成功' : '禁用成功'
				})
			}).finally(_ => {
				row.doing = false
			})
		}
	},
	mounted() {
		this.$$event.$on('base-setting:tab', activeName => {
			if(activeName === 'zuzhi' && this.list.data.length === 0) {
				this.getList()
			}
		})
	}
}
</script>
