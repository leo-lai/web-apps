<template>
	<div>
  	<el-row>
  		<el-col :span="8">
  			<el-button type="primary" @click="showDialogInfo('new')">新增</el-button>
  		</el-col>
  		<el-col :span="16" class="l-text-right">
  			<el-form :inline="true" ref="listFilter" :model="list.filter" :rules="list.rules" @submit.native.prevent="search">
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
	        <el-button class="l-text-link" type="text" size="small">编辑</el-button>
	        <el-button v-if="scope.row.status === 1" class="l-text-error" type="text" size="small">禁用</el-button>
	        <el-button v-else class="l-text-ok" type="text" size="small">启用</el-button>
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
		<el-dialog :title="dialogInfo.title" :visible.sync="dialogInfo.visible" width="995px">
  		<el-form class="l-form1" :inline="true" :model="dialogInfo.data" :rules="dialogInfo.rules" label-width="90px">
			  <el-form-item label="名称" prop="shortName">
			    <el-input v-model="dialogInfo.data.shortName" placeholder="请输入公司/门店名称"></el-input>
			  </el-form-item>
			  <el-form-item label="级别" prop="orgLevel">
			    <el-select v-model="dialogInfo.data.orgLevel" placeholder="请选择公司/分公司/门店">
			      <el-option label="公司" value="1"></el-option>
			      <el-option label="分公司" value="2"></el-option>
			      <el-option label="门店" value="3"></el-option>
			    </el-select>
			  </el-form-item>
			  <el-form-item label="性质" prop="orgType">
			  	<el-radio-group v-model="dialogInfo.data.orgType">
			      <el-radio label="直营"></el-radio>
    				<el-radio label="加盟"></el-radio>
			    </el-radio-group>
			  </el-form-item>
			  <el-form-item label="上级组织" prop="parentId">
			    <el-select v-model="dialogInfo.data.parentId" placeholder="请选择上级组织">
			      <el-option label="上级组织" value="1"></el-option>
			    </el-select>
			  </el-form-item>
			  <el-form-item label="联系电话">
			  	<el-input placeholder=""></el-input>
			  </el-form-item>
			  <el-form-item label=""></el-form-item>
			  <el-form-item class="_flex" label="地址">
			  	<el-input style="width: 547px;" placeholder="如：广东省广州市海珠区东晓南路548号"></el-input>
			  	<el-input style="width: 149px;" v-model="dialogInfo.data.longitude" placeholder="经度"></el-input>
			  	<el-input style="width: 149px;" v-model="dialogInfo.data.latitude" placeholder="纬度"></el-input>
			  </el-form-item>
			  <el-form-item class="_flex" label="简要介绍">
			  	<el-input type="textarea" placeholder=""></el-input>
			  </el-form-item>
			  <el-form-item label="银行卡账号">
			  	<el-input placeholder=""></el-input>
			  </el-form-item>
			  <el-form-item label="开户姓名">
			  	<el-input placeholder=""></el-input>
			  </el-form-item>
			  <el-form-item></el-form-item>
			  <el-form-item label="银行名称">
			  	<el-input placeholder=""></el-input>
			  </el-form-item>
			  <el-form-item label="开户支行">
			  	<el-input placeholder=""></el-input>
			  </el-form-item>
			  <el-form-item class="_flex" label="显示照片">
			  	<el-upload action="https://jsonplaceholder.typicode.com/posts/" list-type="picture-card">
					  <i class="el-icon-plus"></i>
					</el-upload>
			  </el-form-item>
			</el-form>
			<span slot="footer" class="l-margin-r">
				<el-button>取消</el-button>
		    <el-button type="primary">确定提交</el-button>
		  </span>
		</el-dialog>
  </div>
</template>
<script>
export default {
	name: 'base-setting-zuzhi',
	data() {
		return {
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
				rules: {},
				data: {
					shortName: '',
					orgLevel: '',
					orgType: '',
					parentId: '',
					longitude: '',
					latitude: '',
					provinceId: '',
					cityId: '',
					areaId: '',
					address: '',
					telePhone: '',
					bankAccount: '',
					bankName: '',
					openingBranch: '',
					nameOfAccount: '',
					introduce: '',
					imageUrl: ''
				}
			}
		}
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
        this.list.data = data.list
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
			this.dialogInfo.visible = true
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