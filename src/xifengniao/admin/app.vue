<template>
	<transition name="fade" mode="out-in">
		<!-- <keep-alive> -->
			<router-view></router-view>
		<!-- </keep-alive> -->
	</transition>
</template>

<script>
export default {
	name: 'admin',
	data() {
		return {
			
		}
	},
	mounted() {

	}
}

</script>
<style lang="less">
@import '~element-ui/lib/theme-chalk/index.css';
@import '~nprogress/nprogress.css';
@import '~assets/css/base.less';
@import '~assets/css/xifengniao-elementui.less';
@import '~quill/dist/quill.core.css';
@import '~quill/dist/quill.snow.css';
@import '~quill/dist/quill.bubble.css';
</style>