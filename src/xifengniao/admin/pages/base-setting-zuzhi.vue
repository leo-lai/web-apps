<template>
	<div>
  	<el-row>
  		<el-col :span="8">
  			<el-button type="primary" @click="showDialogInfo('new')">新增</el-button>
  		</el-col>
  		<el-col :span="16" class="l-text-right">
  			<el-form :inline="true" ref="listFilter" :model="list.filter" :rules="list.rules" @submit.native.prevent @keyup.enter.native="search">
				  <el-form-item prop="orgName">
				    <el-input placeholder="请输入门店/公司名称" v-model="list.filter.orgName"></el-input>
				  </el-form-item>
				  <el-form-item>
				    <el-button type="primary" @click="search">查询</el-button>
				    <el-button @click="clear">清除查询条件</el-button>
				  </el-form-item>
				</el-form>
  		</el-col>
  	</el-row>
  	<el-table class="l-table-hdbg" stripe element-loading-spinner="el-icon-loading" element-loading-text="拼命加载中" 
  		:data="list.data" v-loading="list.loading" >
	    <el-table-column label="公司/门店名称" prop="shortName"></el-table-column>
	    <el-table-column label="上级机构" prop="parentName"></el-table-column>
	    <el-table-column label="标签" prop="orgLevel">
	    	<template slot-scope="scope">
	    		<el-tag v-if="scope.row.orgLevel === 1" type="success">公司</el-tag>
	    		<el-tag v-else-if="scope.row.orgLevel === 2" type="warning">分公司</el-tag>
	    		<el-tag v-else="success" type="primary">门店</el-tag>
	      </template>
	    </el-table-column>
	    <el-table-column label="地址" prop="address"></el-table-column>
	    <el-table-column label="状态" prop="status">
	    	<template slot-scope="scope">
	    		<span v-if="scope.row.status === 1" class="l-text-ok">运营中</span>
	    		<span v-else class="l-text-error">已禁用</span>
	      </template>
	    </el-table-column>
	    <el-table-column label="操作">
	    	<template slot-scope="scope">
	        <el-button class="l-text-link l-margin-r-s" type="text" size="small">编辑</el-button>
	        <span v-show="scope.row.enabling" class="l-text-warn"><i class="el-icon-loading"></i>&nbsp;操作中</span>
	        <span v-show="!scope.row.enabling">
	        	<el-button v-if="scope.row.status === 1" class="l-text-error" type="text" size="small" @click="enable(scope.row, 0)">禁用</el-button>
	        	<el-button v-else class="l-text-ok" type="text" size="small" @click="enable(scope.row, 1)">启用</el-button>	
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
  		<el-form class="l-form1" ref="infoForm" label-width="100px"  :inline="true"
  			:model="dialogInfo.data" :rules="dialogInfo.rules" @keyup.enter.native="submitInfo">
			  <el-form-item label="名称" prop="shortName">
			    <el-input v-model="dialogInfo.data.shortName" placeholder="请输入公司/门店名称" :maxlength="50"></el-input>
			  </el-form-item>
			  <el-form-item label="级别" prop="orgLevel">
			    <el-select v-model="dialogInfo.data.orgLevel" placeholder="请选择公司/分公司/门店">
			      <el-option label="公司" :value="1"></el-option>
			      <el-option label="分公司" :value="2"></el-option>
			      <el-option label="门店" :value="3"></el-option>
			    </el-select>
			  </el-form-item>
			  <el-form-item label="性质" prop="orgType">
			  	<el-radio-group v-model="dialogInfo.data.orgType">
			      <el-radio :label="1">直营</el-radio>
    				<el-radio :label="2">加盟</el-radio>
			    </el-radio-group>
			  </el-form-item>
			  <el-form-item label="上级组织" prop="parentId">
			  	<el-select v-model="dialogInfo.data.parentId" placeholder="请选择">
			      <el-option v-for="item in zuzhiList" :key="item.orgId" :label="item.shortName" :value="item.orgId"></el-option>
			    </el-select>
			  </el-form-item>
			  <el-form-item label="联系电话" prop="telePhone">
			  	<el-input :maxlength="20" v-model="dialogInfo.data.telePhone"></el-input>
			  </el-form-item>
			  <el-form-item label=""></el-form-item>
			  <el-form-item class="_flex" label="地址" @click.native="amapOpts.visible = true" prop="region">
			  	<el-input style="width: 526px;" placeholder="如：广东省广州市海珠区东晓南路548号"
				  	:value="amapAddress"></el-input>
			  	<span class="l-margin-lr-s">经度</span>
			  	<el-input style="width: 109px;" v-model="dialogInfo.data.longitude"></el-input>
			  	<span class="l-margin-lr-s">纬度</span>
			  	<el-input style="width: 109px;" v-model="dialogInfo.data.latitude"></el-input>
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
			  <el-form-item class="_flex" prop="imageUrl">
			  	<div slot="label" style="display:inline;">
			  		显示照片<span style="font-size:12px;" class="l-text-gray">(最多上传9张)</span></div>
			  	<el-upload action="https://jsonplaceholder.typicode.com/posts/" list-type="picture-card" multiple :limit="9">
					  <i class="el-icon-plus"></i>
					</el-upload>
			  </el-form-item>
			</el-form>
			<span slot="footer" class="l-margin-r">
				<el-button @click="closeDialogInfo()">取消</el-button>
		    <el-button type="primary" :loading="dialogInfo.loading" @click="submitInfo">确定提交</el-button>
		  </span>
		</el-dialog>

		<!-- 地图选择 -->
		<amap-selector :visible.sync="amapOpts.visible" :options="amapOpts"></amap-selector>
  </div>
</template>
<script>
import AmapSelector from 'components/amap-selector'
import { getValueByText } from 'assets/js/region.data'
import { mapGetters } from 'vuex'

export default {
	name: 'base-setting-zuzhi',
	components: {
		AmapSelector
	},
	data() {
		const that = this
		let validateRegion = function(rule, value, callback) {
      if (!(dialogInfo.data.provinceId && dialogInfo.data.cityId 
      	&& dialogInfo.data.areaId && that.dialogInfo.data.address)){
        callback(new Error('请选择地址'))
      } else if(!that.dialogInfo.data.longitude || !that.dialogInfo.data.latitude){
        callback(new Error('经纬度不正确'))
      }else{
        callback()
      }
		}

		let validateUpload = function() {

		}
		return {
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
					orgName: ''
				},
				rules: {
					orgName: []
				},
				loading: false,
				page: 1,
				rows: 100,
				total: 0,
				data: []
			},
			dialogInfo: {
				title: '新增公司/门店',
				visible: false,
				rules: {
					shortName: [
						{ required: true, message: '必填项', trigger: 'blur' }
					],
					orgLevel: [
						{ required: true, type: 'number', message: '必选项', trigger: 'change' }
					],
					orgType: [
						{ required: true, type: 'number', message: '必选项', trigger: 'change' }
					],
					parentId: [
						{ required: true, type: 'number', message: '必选项', trigger: 'change' }
					],
					telePhone: [
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
					imageUrl: [
						{ required: true, validator: validateUpload, trigger: 'change' },
					]
				},
				data: {
					shortName: '',
					orgLevel: '',
					orgType: '',
					parentId: '',
					longitude: '',
					latitude: '',
					province: '',
					provinceId: '',
					cityId: '',
					city: '',
					areaId: '',
					area: '',
					address: '',
					telePhone: '',
					bankAccount: '',
					nameOfAccount: '',
					bankName: '',
					openingBranch: '',
					introduce: '',
					imageUrl: ''
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
		...mapGetters([
  		'zuzhiList'
    ])
	},
	methods: {
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
				this.list.total = data.total
        this.list.page = data.page
        this.list.rows = data.rows
        this.list.data = data.list.map(item => {
        	item.enabling = false
        	return item
        })
			}).finally(() => {
				this.list.loading = false
			})
		},
		search() {
			this.getList()
		},
		clear() {
			this.$refs.listFilter && this.$refs.listFilter.resetFields()
			this.getList()
		},
		showDialogInfo(type = 'new', id) {
			this.dialogInfo.type = type
			if(type === 'edit') {
				this.dialogInfo.title = '修改公司/门店'
				this.$$utils.copyObj(this.dialogInfo.data, row)
			} else {
				this.dialogInfo.title = '新增公司/门店'
				this.$$utils.copyObj(this.dialogInfo.data, '')
			}

			const loading = this.$loading()
			Promise.all([
				this.$store.dispatch('getZuzhiList') 
			]).then(dataArr =>　{
				this.dialogInfo.visible = true	
			}).finally(() => {
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
		submitInfo() { // 提交组织信息
			this.$refs.infoForm.validate(valid => {
        if (valid) {
          this.dialogInfo.loading = true
          this.$$api.zuzhi.add(this.dialogInfo.data).then(data => {
            this.closeDialogInfo()
            this.$message({
							type: 'success',
							message: (this.dialogInfo.type === 'new' ? '新增' : '修改') + '公司/门店成功'
						})
            this.refreshList()
          }).finally(()=>{
            this.dialogInfo.loading = false
          })  
        }
      })
		},
		enable(row, status = 1) { // 禁用/启用组织
			row.enabling = true
			this.$$api.zuzhi.enable(row.orgId, status).then(() => {
				row.status = status
				this.$message({
					type: 'success',
					message: status === 1 ? '启用成功' : '禁用成功'
				})
			}).finally(() => {
				row.enabling = false
			})
		}
	},
	mounted() {
		this.$$event.$on('tab:show', activeName => {
			if(activeName === 'zuzhi' && this.list.data.length === 0) {
				this.getList()
			}
		})
	}
}
</script>
<style scoped lang="less">

</style>