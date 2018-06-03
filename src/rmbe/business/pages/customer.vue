<template>
  <f7-page name="customer">
    <f7-navbar title="消费者" back-link="返回" sliding></f7-navbar>
    <f7-list style="margin:0;">
		  <f7-list-item title="消费者列表" link="/customer/list/"></f7-list-item>
		  <f7-list-item title="消费者券列表" link="/customer/coupon/"></f7-list-item>
		</f7-list>
  </f7-page>
</template>

<script>
export default {
	data() {
		return {
		}
	},
	mounted() {
	}
}
</script>