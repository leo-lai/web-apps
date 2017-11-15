<template>
	<div class="l-main-body">
		<el-tabs type="border-card">
		  <el-tab-pane label="车辆库存">
		  	<el-row class="l-text-right">
			  	<el-form inline>
					  <el-form-item label="">
					    <el-select  placeholder="请输入门店/公司名称" value="">
					      <el-option label="门店名称1" value="1"></el-option>
					      <el-option label="门店名称2" value="2"></el-option>
					    </el-select>
					  </el-form-item>
					  <el-form-item label="">
					    <el-input placeholder="请输入车辆型号"></el-input>
					  </el-form-item>
					  <el-form-item>
					    <el-button type="primary">查询</el-button>
					  </el-form-item>
					</el-form>
		  	</el-row>
		  	<el-table :data="stock.list" border>
			    <el-table-column label="车辆型号"></el-table-column>
			    <el-table-column label="车身颜色"></el-table-column>
			    <el-table-column label="内饰"></el-table-column>
			    <el-table-column label="库存数量"></el-table-column>
			    <el-table-column label="指导价格"></el-table-column>
			    <el-table-column label="优惠"></el-table-column>
			    <el-table-column label="门店/公司名称"></el-table-column>
			    <el-table-column label="线上展示"></el-table-column>
			    <el-table-column label="操作">
			    	<template slot-scope="scope">
			        <el-button type="text" size="small">编辑</el-button>
			        <el-button type="text" size="small">查看</el-button>
			      </template>
			    </el-table-column>
			  </el-table>
			  <el-row class="l-text-center l-margin-t">
			  	<el-pagination layout="total, sizes, prev, pager, next, jumper"
			  	 	@size-change="pageSizeChange" 
			  	 	@current-change="pageCurrentChange" 
			  	 	:page-sizes="[100, 200, 300, 400]"
			  	 	:page-size="stock.rows"
			  	 	:current-page="stock.page"
			  	 	:total="stock.total">
    			</el-pagination>
			  </el-row>
		  </el-tab-pane>
		  <el-tab-pane label="车辆入库">车辆入库</el-tab-pane>
		  <el-tab-pane label="车辆出库">车辆出库</el-tab-pane>
		  <el-tab-pane label="订车">订车</el-tab-pane>
		</el-tabs>
	</div>
</template>
<script>
export default {
	name: 'stock',
	data() {
		return {
			stock: {
				page: 1,
				rows: 100,
				total: 0,
				list: []
			}
		}
	},
	methods: {
		pageSizeChange() {

		},
		pageCurrentChange() {

		}
	}
}
</script>
<style scoped lang="less">

</style>