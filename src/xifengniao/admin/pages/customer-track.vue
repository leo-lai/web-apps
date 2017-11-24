<template>
	<div>
		<el-row>
  		<el-col :span="24" class="l-text-right">
  			<el-form inline ref="listFilter" :model="list.filter" :rules="list.rules" @submit.native.prevent @keyup.enter.native="search">
  				<el-form-item>
  					<el-select v-model="list.filter.orgId" placeholder="请选择公司/门店" @change="search()">
				      <el-option v-for="item in zuzhiList" :key="item.orgId" :label="item.shortName" :value="item.orgId"></el-option>
				    </el-select>
  				</el-form-item>
				  <el-form-item prop="phoneNumber">
				    <el-input placeholder="请输入客户手机号码" v-model="list.filter.phoneNumber"></el-input>
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
	    <el-table-column label="客户手机号" prop="phoneNumber"></el-table-column>
	    <el-table-column label="客户姓名" prop="customerUsersName"></el-table-column>
	    <el-table-column label="意向/购置车辆" prop="intentionCarInfo" min-width="150"></el-table-column>
	    <el-table-column label="销售顾问" prop="systemUserName"></el-table-column>
	    <el-table-column label="最新购车状态" prop="orderState"></el-table-column>
	    <el-table-column label="购车方案" prop="expectWayName" min-width="150"></el-table-column>
	    <el-table-column label="操作">
	    	<template slot-scope="scope">
	        <el-button class="l-text-link" type="text" size="small" @click="showDialogInfo(scope.row)">查看</el-button>
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

		<!-- 查看信息 -->
		<el-dialog class="l-customer-view" width="1100px"
			:close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="dialogInfo.visible">
  		<div class="_flex">
  			<div class="_info">
  				<div class="l-text-center">
  					<img src="http://iph.href.lu/150x150?text=LOGO">
  					<p><b>吕文</b></p>
  					<p>18602029523</p>
  				</div>
  				<dl>
  					<dt>期望购车方式</dt>
  					<dd>100万分期一百年</dd>
  					<dt>意向车辆</dt>
  					<dd>东风本田 2017 尊贵版</dd>
  					<dt>访问备注</dt>
  					<dd>东风本田 2017 尊贵版东风本田 2017 尊贵版东风本田 2017 尊贵版东风本田 2017 尊贵版东风本田 2017 尊贵版</dd>
  				</dl>
  				<dl class="l-margin-t" style="border-top: 1px solid #eee; padding-top: 0.75rem;">
  					<dt>销售顾问</dt>
  					<dd class="l-text-center l-fs-s">大金牙 18622022</dd>
  				</dl>
  			</div>
  			<div class="_tab">
  				<el-tabs type="border-card">
					  <el-tab-pane label="购车进度">
					  	<customer-progress></customer-progress>
					  </el-tab-pane>
					  <el-tab-pane label="个人资料">
					  	<customer-info></customer-info>
					  </el-tab-pane>
					  <el-tab-pane label="车辆资料">
					  	<customer-carinfo></customer-carinfo>
					  </el-tab-pane>
					</el-tabs>
  			</div>
  		</div>
		</el-dialog>
	</div>
</template>
<script>
import { mapGetters } from 'vuex'
import customerInfo from './customer-info'
import customerCarinfo from './customer-carinfo'
import customerProgress from './customer-progress'
export default {
	name: 'customer-track',
	components: {
		customerInfo,
		customerCarinfo,
		customerProgress
	},
	data() {
		return {
			list: {
				filter: {
					phoneNumber: '',
					orgId: ''
				},
				rules: {
					phoneNumber: [],
					orgId: []
				},
				loading: false,
				page: 1,
				rows: 100,
				total: 0,
				data: []
			},
			dialogInfo: {
				visible: false
			}
		}
	},
	computed: {
		...mapGetters([
  		'zuzhiList',
  		'userInfo'
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
			this.$$api.customer.getTrackList(this.list.filter, page, rows)
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
			this.getList()
		},
		showDialogInfo() {
			this.dialogInfo.visible = true
		}
	},
	mounted() {
		this.$$event.$on('customer:tab', (activeName, that) => {
			this.$$parent = that
			if(activeName === 'track' && this.list.data.length === 0) {
				this.getList()
				this.$store.dispatch('getZuzhiList')
			}
		})
	},
	beforeDestroy() {
		this.$$event.$off('customer:tab')
	}
}
</script>
<style lang="less">
.l-customer-view{
	._flex{display: flex; align-items: start;}
	._info{
		width: 250px; padding: 0.75rem; margin-right: 0.75rem;
		background: #fff; border: 1px solid #d8dce5; box-shadow: 0 2px 4px 0 rgba(0,0,0,.12), 0 0 6px 0 rgba(0,0,0,.04);
		img { display: block; margin: 0 auto 10px; width: 80px; height: 80px; border-radius: 50%;}
		dt, dd{ margin: 0; padding: 0; }
		dt{color: rgba(147, 159, 177, 0.6); margin-bottom: 5px;}
		dd{margin-bottom: 0.75rem; }
	}
	._tab{flex: 1;}
	.el-dialog__headerbtn{top: 10px; right: 10px;}
	.el-dialog{background-color: #efeff4;}
	.el-dialog__body{padding-top: 5px;}
	.l-table-info{
		._tit{width: 120px;}
	}
}
</style>