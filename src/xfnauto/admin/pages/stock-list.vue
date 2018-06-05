<template>
	<div>
		<el-row>
  		<el-col :span="24" class="l-text-right">
  			<el-form inline ref="listFilter" :model="list.filter" :rules="list.rules" @submit.native.prevent @keyup.enter.native="search">
  				<el-form-item v-if="userInfo.orgLevel === 1" prop="orgId">
  					<el-select v-model="list.filter.orgId" placeholder="请选择公司/门店" @change="search()">
				      <el-option v-for="item in zuzhiList" :key="item.orgId" :label="item.shortName" :value="item.orgId"></el-option>
				    </el-select>
  				</el-form-item>
					<el-form-item prop="state">
  					<el-select v-model="list.filter.state" placeholder="请选择库存状态" @change="search()">
				      <el-option v-for="item in stateList" :key="item.value" :label="item.label" :value="item.value"></el-option>
				    </el-select>
  				</el-form-item>
					<el-form-item prop="frame_number">
				  	<el-input v-model="list.filter.frame_number" placeholder="请输入车架号"></el-input>
				  </el-form-item>
				  <el-form-item prop="cars_info">
				  	<el-input v-model="list.filter.cars_info" placeholder="请输入车辆型号"></el-input>
				  </el-form-item>
					<el-form-item prop="dateRange" style="width:360px;">
				  	<el-date-picker style="width: 100%;" type="daterange" value-format="yyyy-MM-dd"
				  		range-separator="到" start-placeholder="从入库时间" end-placeholder="入库时间"
				  		v-model="list.filter.dateRange" :picker-options="dateOptions" @change="filterDateChange"></el-date-picker>
				  </el-form-item>
				  <el-form-item>
				    <el-button type="primary" @click="search">查询</el-button>
				    <el-button type="danger" @click="clear">刷新</el-button>
				    <el-button :loading="exceling" type="plain" @click="toExcel">导出excel</el-button>
				  </el-form-item>
				</el-form>
  		</el-col>
  	</el-row>
  	<el-table class="l-table-hdbg" stripe element-loading-spinner="el-icon-loading" element-loading-text="拼命加载中" 
  		:data="list.data" v-loading="list.loading">
	    <el-table-column class-name="l-fs-xs" label="车辆型号" prop="carsName" width="300">
				<template slot-scope="scope">
					<p>{{scope.row.carsName}}</p>
					<p class="l-text-gray">
						<span class="l-margin-r">车身：{{scope.row.colourName}}</span>
						<span>内饰：{{scope.row.interiorName}}</span>
					</p>
	      </template>
			</el-table-column>
	    <el-table-column class-name="l-fs-xs" label="车架号" prop="frameNumber" align="center" width="140"></el-table-column>
			<el-table-column label="库存状态" prop="state" align="center" width="100"></el-table-column>
	    <el-table-column label="指导价" prop="guidingPrice" align="center" width="100"></el-table-column>
	    <el-table-column label="采购价" prop="unitPrice" align="center" width="100"></el-table-column>
	    <el-table-column label="运费/辆" prop="freight" align="center" width="100"></el-table-column>
	    <el-table-column label="其他费用" prop="othersFee" align="center" width="100"></el-table-column>
			<el-table-column class-name="l-fs-xs" label="所属门店" prop="orgName" align="center" width="120"></el-table-column>
	    <el-table-column label="仓位" prop="warehouseName" align="center" width="100"></el-table-column>
	    <el-table-column class-name="l-fs-xs" label="入库时间" prop="createDate" align="center" width="90"></el-table-column>
	    <el-table-column label="操作" align="center" fixed="right" width="140">
	    	<template slot-scope="scope">
					<el-button class="l-text-link" type="text" size="small" @click="showDialogInfo('edit', scope.row)">完善库存信息</el-button>
	    		<el-button class="l-text-link" type="text" size="small" @click="showDialogInfo('view', scope.row)">查看</el-button>
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

	  <!-- 车辆库存详情 -->
		<el-dialog :close-on-click-modal="false" :close-on-press-escape="false" :before-close="closeDialogInfo"
			:title="dialogInfo.title" :visible.sync="dialogInfo.visible" width="700px">
  		<el-form ref="infoForm" inline class="l-form1" label-width="100px" 
  			:model="dialogInfo.data" :rules="dialogInfo.rules" @keyup.enter.native="submitDialogInfo">
				<template v-if="dialogInfo.type == 'view'">
					<el-form-item class="_flex" label="车辆型号" style="width: 622px;">
						<el-input readonly :value="dialogInfo.data.carsName"></el-input>
					</el-form-item>
					<el-form-item label="车身颜色" >
						<el-input readonly :value="dialogInfo.data.colorName"></el-input>
					</el-form-item>
					<el-form-item label="内饰颜色" >
						<el-input readonly :value="dialogInfo.data.interiorName"></el-input>
					</el-form-item>
					<el-form-item label="车架号" >
						<el-input readonly :value="dialogInfo.data.frameNumber"></el-input>
					</el-form-item>
					<el-form-item label="发动机号" >
						<el-input readonly :value="dialogInfo.data.enginNumber"></el-input>
					</el-form-item>
					<el-form-item label="指导价" >
						<el-input readonly :value="dialogInfo.data.guidingPrice"></el-input>
					</el-form-item>
					<el-form-item label="采购价" >
						<el-input readonly :value="dialogInfo.data.unitPrice"></el-input>
					</el-form-item>
					<el-form-item label="运费/辆" >
						<el-input readonly :value="dialogInfo.data.freight"></el-input>
					</el-form-item>
					<el-form-item label="其他费用" >
						<el-input readonly :value="dialogInfo.data.othersFee"></el-input>
					</el-form-item>
					<el-form-item class="_flex" label="所属门店" style="width: 622px;">
						<el-input readonly :value="dialogInfo.data.orgName"></el-input>
					</el-form-item>
					<el-form-item label="仓位" >
						<el-input readonly :value="dialogInfo.data.warehouseName"></el-input>
					</el-form-item>
					<el-form-item label="入库时间" >
						<el-input readonly :value="dialogInfo.data.createTime"></el-input>
					</el-form-item>
					<el-form-item label="库存状态" >
						<el-input readonly :value="dialogInfo.data.state"></el-input>
					</el-form-item>
					<el-form-item label="出厂时间" >
						<el-input readonly :value="dialogInfo.data.factoryOut"></el-input>
					</el-form-item>
					<el-form-item label="公里数" >
						<el-input readonly :value="dialogInfo.data.mileage"></el-input>
					</el-form-item>
					<el-form-item label="是否带交强险" >
						<el-input readonly :value="dialogInfo.data.overStrongInsurance ? '是' : '否'"></el-input>
					</el-form-item>
					<el-form-item class="_flex" label="随车资料" style="width: 622px;">
						<el-input type="textarea" autosize readonly :value="dialogInfo.data.followInformation"></el-input>
					</el-form-item>
					<el-form-item class="_flex" label="验车照片" style="width: 622px;">
						<img style="margin: 10px 10px 0 0; width: 90px; height: 90px;" v-for="(item,index) in dialogInfo.data.imagesArr" :key="item.name" :src="item.thumb" @click="showCarImages(dialogInfo.data.imagesArr, index)">
					</el-form-item>
				</template>
				<template v-else>
					<el-form-item label="采购价" prop="unitPrice">
						<el-input :maxlength="10" v-model="dialogInfo.data.unitPrice"></el-input>
					</el-form-item>
					<el-form-item label="运费/辆" prop="freight">
						<el-input :maxlength="10" v-model="dialogInfo.data.freight"></el-input>
					</el-form-item>
					<el-form-item label="其他费用" prop="othersFee">
						<el-input :maxlength="10" v-model="dialogInfo.data.othersFee"></el-input>
					</el-form-item>
				</template>
			</el-form>
			<span v-if="dialogInfo.type == 'edit'" slot="footer" class="l-margin-r-m">
				<el-button @click="closeDialogInfo()">取消</el-button>
		    <el-button type="primary" :loading="dialogInfo.loading" @click="submitDialogInfo">确定提交</el-button>
		  </span>
		</el-dialog>

		<viewer-images ref="viewer"></viewer-images>
	</div>
</template>
<script>
import { mapGetters } from 'vuex'
import viewerImages from 'components/viewer-images'
export default {
	name: 'stock-list',
	components: {
		viewerImages
	},
	data() {
		return {
			exceling: false,
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
			stateList: [
				{ label: '新建', value: 0},
				{ label: '已入库', value: 1},
				{ label: '已锁定', value: 2},
				{ label: '已出库', value: 3},
			],
			list: {
				filter: {
					dateRange: [],
					cars_info: '',
					frame_number: '',
					orgId: '',
					state: '',
				},
				rules: {
					dateRange: [],
					cars_info: [],
					frame_number: [],
					orgId: [],
					state: [],
				},
				loading: false,
				page: 1,
				rows: 20,
				total: 0,
				data: []
			},
			dialogInfo: {
				type: 'view',
				title: '查看库存信息',
				visible: false,
				loading: false,
				rules: {
					unitPrice: [
						{ required: true, pattern: /^\d{1,9}(\.\d{1,2})?$/, message: '必填项，正确格式(如：10.24)', trigger: 'blur' }
					],
					freight: [
						{ required: false, pattern: /^\d{1,9}(\.\d{1,2})?$/, message: '必填项，正确格式(如：10.24)', trigger: 'blur' }
					],
					othersFee: [
						{ required: false, pattern: /^\d{1,9}(\.\d{1,2})?$/, message: '必填项，正确格式(如：10.24)', trigger: 'blur' }
					]
				},
				data: {
					id: '',
					unitPrice: '',
					freight: '',
					othersFee: '',
				}
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
		toExcel() {
			this.exceling = true
			this.$$api.stock.toExcel(this.list.filter).then(({data}) => {
				window.location.href = data.url
			}).finally(_ => {
				this.exceling = false
			})
		},
		filterDateChange(value) {
			if(value) {
				this.list.filter.startTime = value[0] || ''
				this.list.filter.endTime = value[1] || ''
			}else {
				this.list.filter.startTime = ''
				this.list.filter.endTime = ''
			}
			this.search()	
		},
		sizeChange(size = 100) {
			this.getList(1, size)
		},
		pageChange(page = 1) {
			this.getList(page)
		},
		getList(page = 1, rows) {
			this.list.loading = true
			this.$$api.stock.getList(this.list.filter, page, rows || this.list.rows)
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
			this.filterDateChange()
		},
		showDialogInfo(type = 'view', row) { // 查看库存详情
			this.dialogInfo.type = type
			const loading = this.$loading()
			this.$$api.stock.getInfo(row.id).then(({data}) => {
				data.imagesArr = data.stockCarImages ? data.stockCarImages.split(',').map(img => {
					return {
						url: this.$$utils.image.thumb(img, 150), 
						thumb: this.$$utils.image.thumb(img, 150), 
						src: img, 
						name: img, 
						status: 'success'
					}
				}) : []
				this.dialogInfo.data = type === 'edit' ? this.$$utils.copyObj(this.dialogInfo.data, data) : data
				this.dialogInfo.visible = true
			}).finally(_ => {
				loading.close()
			})
		},
		closeDialogInfo(done) {
			if(done) {
				done()
			}else{
				this.dialogInfo.visible = false	
			}
			this.$refs.infoForm && this.$refs.infoForm.resetFields()
			this.$$utils.copyObj(this.dialogInfo.data, '')
		},
		submitDialogInfo() { // 完善库存信息
			this.$refs.infoForm.validate(valid => {
        if (valid) {
          this.dialogInfo.loading = true
          this.$$api.stock.editInfo(this.dialogInfo.data).then(_ => {
            this.closeDialogInfo()
            this.$message({
							type: 'success',
							message: '完善库存信息成功'
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
		showCarImages(imagesArr = [], index = 0) { // 查看验车图片
			if(imagesArr && imagesArr.length > 0) {
				this.$refs.viewer.show(index, imagesArr)
			}else{
				this.$message.info('没有可查看图片')
			}
		}
	},
	mounted() {
		this.$$event.$on('stock:tab', (activeName, that) => {
			if(activeName === 'list' && this.list.data.length === 0) {
				this.$$parent = that
				this.getList()
				if(this.userInfo.orgLevel == 1) {
					this.$store.dispatch('getZuzhiList')
				}
			}
		})
	}
}
</script>