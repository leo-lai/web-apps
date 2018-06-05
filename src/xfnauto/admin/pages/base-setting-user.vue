<template>
	<div>
		<el-row>
  		<el-col :span="4">
  			<el-button type="primary" @click="showDialogInfo('new')">新增用户</el-button>
  		</el-col>
  		<el-col :span="20" class="l-text-right">
  			<el-form inline ref="listFilter" :model="list.filter" :rules="list.rules" @submit.native.prevent @keyup.enter.native="search">
				  <el-form-item v-if="userInfo.orgLevel == 1" prop="orgId">
  					<el-select v-model="list.filter.orgId" placeholder="请选择所属组织" @change="search()">
				      <el-option v-for="item in zuzhiList" :key="item.orgId" :label="item.shortName" :value="item.orgId"></el-option>
				    </el-select>
  				</el-form-item>
					<el-form-item prop="realName">
				    <el-input placeholder="请输入手机号码" v-model="list.filter.phone"></el-input>
				  </el-form-item>
				  <el-form-item prop="realName">
				    <el-input placeholder="请输入真实姓名" v-model="list.filter.realName"></el-input>
				  </el-form-item>
				  <el-form-item>
				    <el-button type="primary" @click="search">查询</el-button>
				    <el-button type="danger" @click="clear">刷新</el-button>
				  </el-form-item>
				</el-form>
  		</el-col>
  	</el-row>
  	<el-table class="l-table-hdbg" stripe highlight-current-row element-loading-spinner="el-icon-loading" element-loading-text="拼命加载中" 
  		:data="list.data" v-loading="list.loading">
	    <el-table-column label="手机号码" prop="phone" width="130px"></el-table-column>
	    <el-table-column label="真实姓名" prop="realName" width="130px"></el-table-column>
	    <el-table-column label="系统角色" prop="roles" min-width="120px"></el-table-column>
	    <el-table-column label="上级主管" prop="higherUps" min-width="120px"></el-table-column>
	    <el-table-column label="所属组织" prop="orgName" min-width="130px"></el-table-column>
	    <el-table-column label="状态" prop="status" align="center" width="130px">
	    	<template slot-scope="scope">
	    		<span v-if="scope.row.isEnable === 1" class="l-text-ok">正常使用</span>
	    		<span v-else class="l-text-error">已禁用</span>
	      </template>
	    </el-table-column>
	    <el-table-column label="操作" align="center" width="130px">
	    	<template slot-scope="scope">
	        <span v-show="scope.row.doing" class="l-text-warn"><i class="el-icon-loading"></i>&nbsp;操作中</span>
	        <span v-show="!scope.row.doing">
	        	<el-button class="l-text-link" type="text" size="small" @click="showDialogInfo('edit', scope.row)">编辑</el-button>
	        	<el-button v-if="scope.row.isEnable === 1" class="l-text-error" type="text" size="small" @click="enableAsk(scope.row)">禁用</el-button>
	        	<el-button v-else class="l-text-ok" type="text" size="small" @click="enableAsk(scope.row)">启用</el-button>	
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

	  <!-- 新增/编辑用户 -->
		<el-dialog :close-on-click-modal="false" :close-on-press-escape="false" :before-close="closeDialogInfo"
			:title="dialogInfo.title" :visible.sync="dialogInfo.visible" width="653px">
  		<el-form class="l-form1" ref="infoForm" label-width="90px" inline 
  			:model="dialogInfo.data" :rules="dialogInfo.rules" @keyup.enter.native="submitDialogInfo">
			  <el-form-item label="登录账号" prop="phoneNumber" >
			    <el-input :disabled="dialogInfo.type == 'edit'" v-model="dialogInfo.data.phoneNumber" placeholder="请输入手机号码" :maxlength="11"></el-input>
			  </el-form-item>
				<el-form-item label="真实姓名" prop="realName">
			  	<el-input v-model="dialogInfo.data.realName" :maxlength="10" ></el-input>
			  </el-form-item>
			  <el-form-item class="_flex" label="所属组织" prop="orgId">
			    <el-select style="width: 511px;" v-model="dialogInfo.data.orgId" placeholder="请选择" @change="zhuzhiChange">
			      <el-option v-for="item in zuzhiList" :key="item.orgId" :label="item.shortName" :value="item.orgId"></el-option>
			    </el-select>
			  </el-form-item>
			  <el-form-item class="_flex" label="系统角色" prop="roleIds">
			    <el-select style="width: 511px;" v-model="dialogInfo.data.roleIds" multiple placeholder="请选择">
			      <el-option v-for="item in dialogInfo.roleList" :key="item.id" :label="item.roleName" :value="item.id"></el-option>
			    </el-select>
			  </el-form-item>
				<el-form-item class="_flex" label="上级主管" prop="parentIds">
			    <el-select style="width: 511px;" v-model="dialogInfo.data.parentIds" multiple placeholder="请选择">
			      <el-option v-for="item in dialogInfo.parentList" :key="item.id" :label="item.realName" :value="item.id"></el-option>
			    </el-select>
			  </el-form-item>
			  <el-form-item label="出生日期" prop="birthday">
			  	<el-date-picker type="date" value-format="yyyy-MM-dd" :editable="false" v-model="dialogInfo.data.birthday"></el-date-picker>
			  </el-form-item>
				<el-form-item label="性别" prop="sex">
			  	<el-radio-group v-model="dialogInfo.data.sex">
			      <el-radio :label="1">男</el-radio>
    				<el-radio :label="2">女</el-radio>
			    </el-radio-group>
			  </el-form-item>
			  <el-form-item label="身份证号" prop="cardNo">
			  	<el-input v-model="dialogInfo.data.cardNo" :maxlength="18"></el-input>
			  </el-form-item>
			  <el-form-item label="入职时间" prop="entryTime">
			  	<el-date-picker type="date" value-format="yyyy-MM-dd" :editable="false" v-model="dialogInfo.data.entryTime"></el-date-picker>
			  </el-form-item>
			  <!-- <el-form-item label="基本工资" prop="basePay">
			  	<el-input v-model="dialogInfo.data.basePay" :maxlength="10"></el-input>
			  </el-form-item> -->
				<el-form-item class="_flex" label="个人照片" prop="imageUpload">
				  	<uploader ref="dialogInfoUpload" :file-list.sync="dialogInfo.uploadList"></uploader>
				  </el-form-item>
			</el-form>
			<span slot="footer" class="l-margin-r-m">
				<el-button @click="closeDialogInfo()">取消</el-button>
		    <el-button type="primary" :loading="dialogInfo.loading" @click="submitDialogInfo">确定提交</el-button>
		  </span>
		</el-dialog>
	</div>
</template>
<script>
import { mapGetters } from 'vuex'
import uploader from 'components/uploader'
export default {
	name: 'base-setting-user',
	components: { uploader },
	data() {
		let that = this
		// 个人照片
		let validateUpload = function(rule, value, callback) {
			if(that.$refs.dialogInfoUpload.waiting > 0) {
				callback(new Error('个人照片正在上传中'))
			}else {
				that.dialogInfo.data.headPortrait = that.dialogInfo.uploadList.map(item => item.src || item.url).join(',')
				callback()
			}
		}

		return {
			dateOption: {
				disabledDate(time) {
					return time.getTime() > Date.now()
				},
				shortcuts: [{
          text: '今天',
          onClick(picker) {
            picker.$emit('pick', new Date())
          }
        }, {
          text: '昨天',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24)
            picker.$emit('pick', date)
          }
        }, {
          text: '一周前',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', date)
          }
        }]
			},
			list: {
				filter: {
					realName: '',
					phone: '',
					orgId: '',
				},
				rules: {
					realName: [],
					phone: [],
					orgId: [],
				},
				loading: false,
				page: 1,
				rows: 20,
				total: 0,
				data: []
			},
			dialogInfo: {
				type: 'new',
				title: '新增系统用户',
				visible: false,
				loading: false,
				rules: {
					phoneNumber: [
						{ required: true, message: '必填项', trigger: 'blur' },
						{ pattern: /^1\d{10}$/, message: '请输入正确的手机号码', trigger: 'blur' }
					],
					orgId: [
						{ required: true, type: 'number', message: '必选项', trigger: 'change' }
					],
					roleIds: [
						{ required: true, message: '必选项', trigger: 'change' }
					],
					parentIds: [
						// { required: true, message: '必选项', trigger: 'change' }
					],
					realName: [
						{ required: true, message: '必填项', trigger: 'blur' }
					],
					sex: [],
					birthday: [],
					entryTime: [],
					headPortrait: [],
					basePay: [
						{ pattern: /^\d{1,9}(\.\d{1,2})?$/, message: '必填项，正确格式(如：10.24)', trigger: 'blur' }
					],
					imageUpload: [
						{ validator: validateUpload, trigger: 'change' },
					]
				},
				data: {
					id: '',
					phoneNumber: '',
					orgId: '',
					realName: '',
					roleIds: '',
					parentIds: '',
					birthday: '',
					cardNo: '',
					sex: '',
					entryTime: '',
					basePay: '',
					headPortrait: ''
				},
				uploadList: [],
				roleList: [],
				parentList: []
			}
		}
	},
	computed: {
		...mapGetters([
			'userInfo',
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
			this.$$api.user.getList(this.list.filter, page, rows || this.list.rows)
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
		zhuzhiChange(value) {
			this.dialogInfo.data.roleIds = []
			this.dialogInfo.data.parentIds = []
			return Promise.all([this.getRoleList(value), this.getParentList(value)])
		},
		getRoleList(orgId = '') { // 角色列表
			return this.$$api.role.getDownList(orgId).then(({data}) => {
				this.dialogInfo.roleList = data
				return data
			})
		},
		getParentList(orgId = '') { // 上级主管列表
			return this.$$api.user.getParentList(orgId).then(({data}) => {
				this.dialogInfo.parentList = data
				return data
			})
		},
		showDialogInfo(type = 'new', row) { // 新增/修改用户弹出信息
			this.dialogInfo.type = type
			if(type === 'edit') {
				this.dialogInfo.title = '修改系统用户'

				const loading = this.$loading()
				this.$$api.user.getInfo(row.id).then(({data}) => {
					this.$$utils.copyObj(this.dialogInfo.data, data)
					this.dialogInfo.data.phoneNumber = data.phone
					this.dialogInfo.data.sex = data.gender
					this.dialogInfo.uploadList = data.headPortrait ? data.headPortrait.split(',').map(img => {
						return {
							url: this.$$utils.image.thumb(img, 150), 
							thumb: this.$$utils.image.thumb(img, 150), 
							src: img, 
							name: img, 
							status: 'success'
						}
					}) : []

					this.zhuzhiChange(data.orgId).finally(_ => {
						loading.close()
						this.dialogInfo.data.parentIds = data.parentUser ? data.parentUser.map(item => item.id) : []
						this.dialogInfo.data.roleIds = data.roles ? data.roles.map(item => item.id) : []
						this.dialogInfo.visible = true
					})
				}).catch(_ => {
					loading.close()
				})
			} else {
				this.dialogInfo.title = '新增系统用户'
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
			this.$$utils.copyObj(this.dialogInfo.data, '')
		},
		submitDialogInfo() { // 提交用户信息
			this.$refs.infoForm.validate(valid => {
        if (valid) {
					this.dialogInfo.loading = true
					let promise = this.dialogInfo.type == 'edit' ? this.$$api.user.edit(this.dialogInfo.data) : this.$$api.user.add(this.dialogInfo.data)
          promise.then(_ => {
            this.closeDialogInfo()
            this.$message({
							type: 'success',
							message: (this.dialogInfo.type === 'edit' ? '修改' : '新增') + '用户信息成功'
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
		enableAsk(row) {
			if(row.isEnable == 1){
				this.$confirm('是否确定禁用该用户?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(_ => {
        	this.enable(row, 0)  
        })
			}else{
				this.enable(row, 1)
			}
		},
		enable(row, status = 1) { // 禁用or启用用户
			row.doing = true
			this.$$api.user.enable(row.id).then(_ => {
				row.isEnable = status
				this.$message({
					type: 'success',
					message: status === 1 ? '该用户启用成功' : '该用户禁用成功'
				})
			}).finally(_ => {
				row.doing = false
			})
		}
	},
	mounted() {
		this.$$event.$on('base-setting:tab', activeName => {
			if(activeName === 'user' && this.list.data.length === 0) {
				this.$store.dispatch('getZuzhiList')
				this.getList()
			}
		})
	}
}
</script>