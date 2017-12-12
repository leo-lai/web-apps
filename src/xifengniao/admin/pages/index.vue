<template>
	<div class="l-main-body">
		<el-row :gutter="20">
			<el-col :span="16">
				<el-card class="l-index-store" style="height:190px;">
					<div class="l-flex-h">
						<img class="l-margin-r" width="150" height="150" :src="organization.imageArr[0]">
						<div class="l-rest">
							<h3>{{organization.shortName}}</h3>
							<p class="l-margin-tb-m l-text-gray">{{$$config.baseData.orgLevel[organization.orgLevel-1]}}</p>
							<p class="l-margin-tb-m l-text-gray">{{organization.address}}</p>
							<p><a class="l-text-link">更改基础设置</a></p>
						</div>
					</div>
				</el-card>
			</el-col>
			<el-col :span="8">
				<el-card style="height:190px;">
				  <div slot="header" class="clearfix">
				    <b>公告/通知</b>
				    <el-button class="l-fr" type="text">查看全部</el-button>
				  </div>
				  <ul class="l-list-text">
				  	<li>系统使用说明及操作文档下载</li>
				  </ul>
				</el-card>
			</el-col>
		</el-row>
		<el-row class="l-margin-t">
			<el-col :span="24">
				<el-card>
				  <div slot="header" class="clearfix">
				    <b>客户管理</b>
				    <el-button class="l-fr" type="text">查看全部</el-button>
				  </div>
				  <ul class="l-circle-step">
				  	<li class="_item">
				  		<p class="_circle"><b>落定</b></p>
				  		<p><b class="_num">5</b>个客户落定</p>
				  		<p><a class="l-text-link">查看</a></p>
				  	</li>
				  	<li class="_item">
				  		<p class="_circle"><b>车辆出库</b></p>
				  		<p><b class="_num">5</b>个客户车辆已出库</p>
				  		<p><a class="l-text-link">查看</a></p>
				  	</li>
				  	<li class="_item">
				  		<p class="_circle"><b>完款</b></p>
				  		<p><b class="_num">5</b>个客户已完款</p>
				  		<p><a class="l-text-link">查看</a></p>
				  	</li>
				  	<li class="_item">
				  		<p class="_circle"><b>加装/上牌</b></p>
				  		<p><b class="_num">5</b>台车正在加装/上牌</p>
				  		<p><a class="l-text-link">查看</a></p>
				  	</li>
				  	<li class="_item">
				  		<p class="_circle"><b>交车</b></p>
				  		<p><b class="_num">5</b>个客户可以交车</p>
				  		<p><a class="l-text-link">查看</a></p>
				  	</li>
				  	<li class="_item">
				  		<p class="_circle"><b>回访/跟踪</b></p>
				  		<p><b class="_num">5</b>个客户需要跟踪</p>
				  		<p><a class="l-text-link">查看</a></p>
				  	</li>
				  </ul>
				</el-card>
			</el-col>
		</el-row>
		<el-row class="l-margin-t">
			<el-col :span="24">
				<el-card>
				  <div slot="header" class="clearfix">
				    <b>订购车辆</b>
				    <el-button class="l-fr" type="text">查看全部</el-button>
				  </div>
				  <ul class="l-circle-step">
				  	<li class="_item">
				  		<p class="_circle"><b>待处理</b></p>
				  		<p><b class="_num">{{stockOrder.pending}}</b>个订单待处理</p>
				  		<p><a class="l-text-link">查看</a></p>
				  	</li>
				  	<li class="_item">
				  		<p class="_circle"><b>待付尾款</b></p>
				  		<p><b class="_num">{{stockOrder.waitFor}}</b>个订单已处理，待付尾款</p>
				  		<p><a class="l-text-link">查看</a></p>
				  	</li>
				  	<li class="_item">
				  		<p class="_circle"><b>待签收入库</b></p>
				  		<p><b class="_num">{{stockOrder.waitingForStorage}}</b>个订单已出库，待签收</p>
				  		<p><a class="l-text-link">查看</a></p>
				  	</li>
				  </ul>
				</el-card>
			</el-col>
		</el-row>
		<el-row class="l-margin-t">
			<el-col :span="24">
				<el-card>
				  <div slot="header" class="clearfix">
				    <b>生意参谋</b>
				    <el-button class="l-fr" type="text">查看全部</el-button>
				  </div>
				  <ul class="l-list-shengyi">
				  	<li class="_item">
				  		<p><h3>今日新增客户</h3></p>
				  		<p class="_num"><countTo :startVal="0" :endVal="5000" :duration='3000'></countTo></p>
				  		<p class="_old">比昨日<i>+8</i></p>
				  	</li>
				  	<li class="_item">
				  		<p><h3>今日预约到店客户</h3></p>
				  		<p class="_num"><countTo :startVal="0" :endVal="2000" :duration='3000'></countTo></p>
				  		<p class="_old">比昨日<i>-8</i></p>
				  	</li>
				  </ul>
				</el-card>
			</el-col>
		</el-row>
	</div>
</template>
<script>
import CountTo from 'vue-count-to'
export default {
	components: { CountTo },
	name: 'index',
	data() {
		return {
			organization: {
				imageArr: [],
			},
			stockOrder: {}
		}
	},
	mounted() {
		this.$$api.index.getCount().then(({data}) => {
			data.organization.imageArr = data.organization.imageUrl ? data.organization.imageUrl.split(',') : []
			this.organization = data.organization
			this.stockOrder = data.stockOrder
		})
	}
}
</script>
<style scoped lang="less">
ul,li{margin:0; padding: 0; list-style: none;}
.l-index-store{background:url('/static/20171108102839.jpg') no-repeat right 50%;background-size: 100% 100%;}
.l-list-text{
	li{margin: 3px 0;}
}
.l-circle-step{
	overflow: hidden; text-align: center; 
	._item{float: left; text-align: center; margin: 0.75rem 0.25rem; min-width: 178px;}
	._circle{
		border:10px solid #eff2f7; border-radius: 50%; position: relative; color: rgba(71, 86, 105, 0.8);
		width: 100px; height: 100px; margin: 0 auto 10px; font-size: 0.6rem;
		display: flex; align-items: center; justify-content: center;
	}
	._circle::before, ._circle::after{content: ''; border-top: 1px solid #eff2f7; width: 50%; position: absolute; top: 50%;}
	._circle::before{ left: -50%; }
	._circle::after{ right: -50%; }
	._num{font-size: 1rem; color: rgb(33, 160, 255); margin-right: 2px; font-weight: 600;}
	._item:first-child ._circle::before, ._item:last-child ._circle::after{visibility: hidden;}
}
.l-list-shengyi{
	overflow: hidden;
	._item{float: left; padding:0 3rem; margin: 0.75rem 0; border-right: 1px solid #c1ccda; }
	._item:last-child{border-right: none;}
	._num{font-size: 1.5rem; color: #21a0ff; margin: 0.75rem 0; }
	._old{
		color: #ccc;
		i{margin-left: 10px; color: #ff4949;}
	}
}
</style>