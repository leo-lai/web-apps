<template>
	<div class="l-main-body">
		<el-row>
  		<el-col :span="24" class="l-text-right">
  			<el-form inline ref="listFilter" :model="list.filter" :rules="list.rules" @submit.native.prevent>
  				<el-form-item prop="type" label="中奖类型">
				  	<el-select v-model="list.filter.type" placeholder="请选择" @change="search()">
				      <el-option label="特殊奖品" :value="1"></el-option>
				      <el-option label="实物奖品" :value="2"></el-option>
				      <el-option label="券奖品" :value="3"></el-option>
				    </el-select>
				  </el-form-item>
				  <el-form-item>
				    <el-button type="primary" @click="search">查询</el-button>
				    <el-button @click="clear">刷新</el-button>
				  </el-form-item>
				</el-form>
  		</el-col>
  	</el-row>
		<el-table class="l-table-hdbg" stripe element-loading-spinner="el-icon-loading" element-loading-text="拼命加载中" 
  		:data="list.data" v-loading="list.loading">
  		<el-table-column type="index" width="50"></el-table-column>
	    <el-table-column label="商家名称" prop="seller.seller_info.store_name"></el-table-column>
	    <el-table-column label="消费者头像" prop="customer.thumb" align="center">
	    	<template slot-scope="scope">
	    		<img width="50" height="50" :src="scope.row.customer.thumb" alt="">
	    	</template>
	    </el-table-column>
	    <el-table-column label="消费者昵称" prop="customer.nickname" align="center"></el-table-column>
	    <el-table-column label="奖品名称" prop="prize.prize_name"></el-table-column>
	    <el-table-column class-name="l-fs-xs" label="中奖时间" prop="created_at"></el-table-column>
	    <el-table-column class-name="l-fs-xs" label="领奖信息" prop="customer_info" min-width="150">
	    	<template v-if="scope.row.customer_info" slot-scope="scope">
	    		<p>中奖人姓名：{{scope.row.customer_info.name}}</p>
	    		<p>中奖人电话：{{scope.row.customer_info.tel}}</p>
	    		<p>店铺地址：{{scope.row.customer_info.store_address}}</p>
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
	</div>
</template>
<script>
import regionData from 'assets/js/region.data'
export default {
	name: 'finance',
	data() {
		return {
			regionData,
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
			list: {
				filter: {
					type: ''
				},
				rules: {
					type: [],
				},
				loading: false,
				page: 1,
				row: 100,
				total: 0,
				data: []
			}
		}
	},
	methods: {
		filterDateChange(value) {
			if(value) {
				this.list.filter.start_date = value[0] || ''
				this.list.filter.end_date = value[1] || ''
			} else {
				this.list.filter.start_date = ''
				this.list.filter.end_date = ''
			}
			this.search()
		},
		filterRegionChange(value) {
			this.list.filter.region_id1 = value[0] || ''
			this.list.filter.region_id2 = value[1] || ''
			this.list.filter.region_id3 = value[2] || ''
			this.search()			
		},
		sizeChange(size = 100) {
			this.getList(1, size)
		},
		pageChange(page = 1) {
			this.getList(page)
		},
		getList(page = 1, row) {
			this.list.loading = true
			this.$$api.prize.getList(this.list.filter, page, row || this.list.row)
			.then(({data}) => {
				this.list.total = data.count
        this.list.page = Number(data.page_number) + 1
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
			this.list.filter.start_date = ''
			this.list.filter.end_date = ''
			this.list.filter.region_id1 = ''
			this.list.filter.region_id2 = ''
			this.list.filter.region_id3 = ''
			this.getList()
		}
	},
	mounted() {
		this.getList()
	}
}
</script>
