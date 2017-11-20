<template>
	<div class="l-main-body">
		<el-row class="l-margin-b">
  		<el-col :span="4">
  			<el-button type="primary" @click="showDialogInfo('new')">录入商户</el-button>
  		</el-col>
  		<el-col :span="20" class="l-text-right">
  			<el-form inline ref="listFilter" :model="list.filter" :rules="list.rules" @submit.native.prevent>
  				<el-form-item prop="phoneNumber" lalel="">
				    <el-input placeholder="商家姓名" v-model="list.filter.name"></el-input>
				  </el-form-item>
				  <el-form-item prop="phoneNumber" lalel="">
				    <el-input placeholder="手机号码" v-model="list.filter.tel"></el-input>
				  </el-form-item>
				  <el-form-item prop="brandId" label="">
				  	<el-select v-model="list.filter.guanlian" placeholder="是否有设备" @change="search()">
				      <el-option label="是" :value="1"></el-option>
				      <el-option label="否" :value="0"></el-option>
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
	    <el-table-column label="商户姓名" prop="phoneNumber"></el-table-column>
	    <el-table-column label="状态" prop="customerUsersName"></el-table-column>
	    <el-table-column label="拥有设备" prop="intentionCarInfo"></el-table-column>
	    <el-table-column label="手机号码" prop="systemUserName"></el-table-column>
	    <el-table-column label="操作">
	    	<template slot-scope="scope">
	    		<el-button class="l-text-link" type="text" size="small" @click="showDialogInfo('edit', scope.row)">编辑</el-button>
	      </template>
	    </el-table-column>
	  </el-table>
	  <el-row class="l-text-center l-margin-t">
	  	<el-pagination layout="total, sizes, prev, pager, next, jumper"
	  	 	@size-change="sizeChange" 
	  	 	@current-change="pageChange" 
	  	 	:page-sizes="$$api.pageSizes"
	  	 	:page-size="list.row"
	  	 	:current-page="list.page"
	  	 	:total="list.total">
			</el-pagination>
	  </el-row>

	  <!-- 录入/编辑角色 -->
		<el-dialog :close-on-click-modal="false" :close-on-press-escape="false" :before-close="closeDialogInfo"
			:title="dialogInfo.title" :visible.sync="dialogInfo.visible" width="653px">
  		<el-form inline ref="infoForm" class="l-form1" label-width="90px"
  			:model="dialogInfo.data" :rules="dialogInfo.rules" @keyup.enter.native="submitInfo">
			  <el-form-item label="账号" prop="username">
			    <el-input v-model="dialogInfo.data.username" :maxlength="50"></el-input>
			  </el-form-item>
			  <el-form-item label="密码" prop="password">
			    <el-input v-model="dialogInfo.data.password" :maxlength="50"></el-input>
			  </el-form-item>
			  <el-form-item label="姓名" prop="name">
			    <el-input v-model="dialogInfo.data.name" :maxlength="50"></el-input>
			  </el-form-item>
			  <el-form-item label="手机号码" prop="tel">
			    <el-input v-model="dialogInfo.data.tel" :maxlength="50"></el-input>
			  </el-form-item>
			  <el-form-item label="店铺名称" prop="store_name">
			    <el-input v-model="dialogInfo.data.store_name" :maxlength="50"></el-input>
			  </el-form-item>
			  <el-form-item label="身份证号" prop="id_number">
			    <el-input v-model="dialogInfo.data.roleName" :maxlength="50"></el-input>
			  </el-form-item>
			  <el-form-item class="_flex" label="店铺地址" prop="region" @click.native="amapOpts.visible = true">
			  	<el-input readonly placeholder="请选择" :value="amapAddress"></el-input>
			  </el-form-item>
			</el-form>
			<span slot="footer" class="l-margin-r-m">
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

export default {
	name: 'business',
	components: {
		AmapSelector
	},
	data() {
		let that = this
		let validateRegion = function(rule, value, callback) {
      if (!(that.dialogInfo.data.region_id1 && that.dialogInfo.data.region_id2 
      	&& that.dialogInfo.data.region_id3 && that.dialogInfo.data.address)){
        callback(new Error('请选择地址'))
      } else if(!that.dialogInfo.data.longitude || !that.dialogInfo.data.latitude){
        callback(new Error('经纬度不正确'))
      }else{
        callback()
      }
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
					that.dialogInfo.data.region_id1 = regionValue[0] || ''
					that.dialogInfo.data.region_id2 = regionValue[1] || ''
					that.dialogInfo.data.region_id3 = regionValue[2] || ''
					
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
					tel: '',
					name: '',
					guanlian: ''
				},
				rules: {
					tel: [],
					name: [],
					guanlian: []
				},
				loading: false,
				page: 1,
				row: 100,
				total: 0,
				data: []
			},
			dialogInfo: {
				type: 'new',
				title: '录入商家',
				visible: false,
				loading: false,
				rules: {
					username: [
						{ required: true, message: '必填项', trigger: 'blur' }
					],
					password: [
						{ required: true, message: '必填项', trigger: 'blur' }
					],
					name: [
						{ required: true, message: '必填项', trigger: 'blur' }
					],
					tel: [
						{ required: true, message: '必填项', trigger: 'blur' }
					],
					id_number: [
						{ required: true, message: '必填项', trigger: 'blur' }
					],
					store_name: [
						{ required: true, message: '必填项', trigger: 'blur' }
					],
					region: [
						{ required: true, validator: validateRegion, trigger: 'change' },
					]
				},
				data: {
					seller_id: '',
					username: '',
					password: '',
					name: '',
					tel: '',
					id_number: '',
					store_name: '',
					region_id1: '',
					region_id2: '',
					region_id3: '',
					province: '',
					city: '',
					area: '',
					longitude: '',
					latitude: '',
					address: ''
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
		}
	},
	methods: {
		sizeChange(size = 100) {
			this.getList(1, size)
		},
		pageChange(page = 1) {
			this.getList(page)
		},
		getList(page = 1, row) {
			this.list.loading = true
			this.$$api.business.getList(this.list.filter, page, row)
			.then(({data}) => {
				this.list.total = data.count
        this.list.page = Number(data.page_number)
        this.list.row = Number(data.per_page)
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
		showDialogInfo(type = 'new', row) { // 录入/更新商家
			this.dialogInfo.type = type
			if(type === 'edit') {
				this.dialogInfo.title = '更新商家'
				this.$$utils.copyObj(this.dialogInfo.data, row)
			} else {
				this.dialogInfo.title = '录入商家'
				this.$$utils.copyObj(this.dialogInfo.data, '')
			}
			this.dialogInfo.visible = true	
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
		submitInfo() { // 提交商家信息
			this.$refs.infoForm.validate(valid => {
        if (valid) {
          this.dialogInfo.loading = true
          this.$$api.business.add(this.dialogInfo.data).then(_ => {
            this.closeDialogInfo()
            this.$message({
							type: 'success',
							message: (this.dialogInfo.type === 'new' ? '录入' : '更新') + '商家信息成功'
						})
            this.refreshList()
          }).finally(()=>{
            this.dialogInfo.loading = false
          })  
        }
      })
		}
	},
	mounted() {
		this.getList()
	}
}
</script>
