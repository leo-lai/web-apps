<template>
	<div class="l-main-body">
    <div class="l-tab-cont-none">
      <el-tabs v-model="tabActive" @tab-click="tabClick" type="border-card">
        <el-tab-pane label="全部" name="order-0">
        </el-tab-pane>
        <el-tab-pane label="待支付定金" name="order-1">
        </el-tab-pane>
        <el-tab-pane label="待支付尾款" name="order-2">
        </el-tab-pane>
      </el-tabs>
      <div class="l-padding">
        <order-list></order-list>
      </div>
    </div>
	</div>
</template>
<script>
import { mapGetters } from 'vuex'
import orderList from './order-list'
export default {
	name: 'order',
	components: {
		orderList
	},
	data() {
		return {
			tabActive: ''
		}
	},
  computed: {
  	...mapGetters([
  		'userInfo'
    ])
  },
	methods: {
		tabClick() {
			this.$$utils.history.replace('?tab=' + this.tabActive)
			this.$$event.$emit('order:tab', this.tabActive)
		}
	},
	mounted() {
		this.tabActive = this.$route.query.tab || 'order-0'
		this.tabClick()
	}
}
</script>
<style>
.l-tab-cont-none{background: #fff; border: 1px solid #dcdfe6; box-shadow: 0 2px 4px 0 rgba(0,0,0,.12), 0 0 6px 0 rgba(0,0,0,.04);}
.l-tab-cont-none .el-tabs--border-card{border: none; box-shadow: none;}
.l-tab-cont-none .el-tabs__content{display: none;}
</style>
