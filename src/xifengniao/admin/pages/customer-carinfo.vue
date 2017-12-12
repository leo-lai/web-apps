<template>
	<div class="l-flex-v" style="height: 100%;">
		<div class="l-rest l-scroll">
			<table class="l-table-info">
	  		<caption>基本信息</caption>
				<tr>
					<td class="_tit">车辆型号</td>
					<td class="_cont">{{data.carsName}}</td>
					<td class="_tit">车辆颜色</td>
					<td class="_cont"></td>
				</tr>
				<tr>
					<td class="_tit">车架号</td>
					<td class="_cont"></td>
					<td class="_tit">发动机号</td>
					<td class="_cont"></td>
				</tr>
				<tr>
					<td class="_tit">车牌号</td>
					<td class="_cont">
						<input class="_ipt2" maxlength="50">
					</td>
					<td class="_tit">成交价格(元)</td></td>
				</tr>
				<tr>
					<td class="_tit">购车方案</td>
					<td class="_cont"></td>
					<td class="_tit">贷款方案</td>
					<td class="_cont"></td>
				</tr>
				<tr>
					<td class="_tit">赠送精品</td>
					<td class="_cont"></td>
					<td class="_tit">售后支持</td>
					<td class="_cont">
						<input class="_ipt2" maxlength="50">
					</td>
				</tr>
			</table>
			<table class="l-table-info l-margin-t">
	  		<caption>税收/保险/其他花费</caption>
				<tr>
					<td class="_tit">整车购置税</td>
					<td class="_cont">
						<input class="_ipt2" maxlength="50">
					</td>
					<td class="_tit">消费税</td>
					<td class="_cont">
						<input class="_ipt2" maxlength="50">
					</td>
				</tr>
				<tr>
					<td class="_tit">车船税</td>
					<td class="_cont">
						<input class="_ipt2" maxlength="50">
					</td>
					<td class="_tit">上牌费用</td>
					<td class="_cont">
						<input class="_ipt2" maxlength="50">
					</td>
				</tr>
				<tr>
					<td class="_tit">强制保险</td>
					<td class="_cont">
						<input class="_ipt2" maxlength="50">
					</td>
					<td class="_tit">第三方责任险</td>
					<td class="_cont">
						<input class="_ipt2" maxlength="50">
					</td>
				</tr>
				<tr>
					<td class="_tit">车辆损失险</td>
					<td class="_cont">
						<input class="_ipt2" maxlength="50">
					</td>
					<td class="_tit">玻璃单独破碎险</td>
					<td class="_cont">
						<input class="_ipt2" maxlength="50">
					</td>
				</tr>
				<tr>
					<td class="_tit">自然损失险</td>
					<td class="_cont">
						<input class="_ipt2" maxlength="50">
					</td>
					<td class="_tit">不计免赔特约险</td>
					<td class="_cont">
						<input class="_ipt2" maxlength="50">
					</td>
				</tr>
				<tr>
					<td class="_tit">无过责任险</td>
					<td class="_cont">
						<input class="_ipt2" maxlength="50">
					</td>
					<td class="_tit">车上人员责任险</td>
					<td class="_cont">
						<input class="_ipt2" maxlength="50">
					</td>
				</tr>
				<tr>
					<td class="_tit">车身刮痕险</td>
					<td class="_cont">
						<input class="_ipt2" maxlength="50">
					</td>
					<td class="_tit"></td>
					<td class="_cont"></td>
				</tr>
			</table>
			<table class="l-table-info l-margin-t">
	  		<caption>人车合照/车辆照片</caption>
	  	</table>
		</div>
		<div class="l-text-right l-margin-t">
			<el-button type="primary">保存修改</el-button>
		</div>
	</div>
</template>
<script>
export default {
	name: 'customer-carinfo',
	props: {
		data: {
			type: Object,
			default() {
				return {}
			}
		}
	},
	data() {
		return {
			loading: false
		}
	},
	methods: {
		submit() {
			this.loading = true
			this.$$api.customer.saveCarInfo(this.data).then(_ => {
				this.$message.success('保存车辆资料成功')
			}).finally(_ => {
				this.loading = false
			})
		}
	}
}
</script>