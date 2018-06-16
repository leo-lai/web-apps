<template>
	<div>
		<!-- <el-row>
			<el-col :span="4">
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
  	</el-row> -->
  	<el-table class="l-table-hdbg" stripe element-loading-spinner="el-icon-loading" element-loading-text="拼命加载中" 
  		:data="list.data" v-loading="list.loading">
	    <el-table-column label="姓名" prop="username"></el-table-column>
	    <el-table-column label="邮箱" prop="email"></el-table-column>
	    <el-table-column label="留言内容" prop="content" min-width="200"></el-table-column>
			<el-table-column label="留言时间" prop="createTime" align="center"></el-table-column>
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
 
	</div>
</template>
<script>
export default {
	name: 'msg-list',
	data() {
		return {
			list: {
				filter: {
				},
				rules: {
					
				},
				loading: false,
				page: 1,
				rows: 10,
				total: 0,
				data: []
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
			this.$$api.school.getMsgList(this.list.filter, page, rows || this.list.rows)
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
		}
	},
	mounted() {
		this.$$event.$on('school:tab', (activeName, that) => {
			if(activeName === 'msg' && this.list.data.length === 0) {
				this.getList()
			}
		})
	},
	beforeDestroy() {
		this.$$event.$off('school:tab')
	}
}
</script>