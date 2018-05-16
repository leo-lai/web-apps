<template>
	<div class="l-main-body">
		<el-tabs v-model="tabActive" @tab-click="tabClick" type="border-card">
		  <el-tab-pane label="文章列表" name="list">
		  	<school-list></school-list>
		  </el-tab-pane>
      <el-tab-pane label="操作指南" name="video">
        <guide-video></guide-video>
      </el-tab-pane>
		</el-tabs>
	</div>
</template>
<script>
import { mapGetters } from 'vuex'
import schoolList from './school-list'
import guideVideo from './guide-video'
export default {
	name: 'school',
	components: {
		schoolList,
		guideVideo
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
			this.$$event.$emit('school:tab', this.tabActive)
		}
	},
	mounted() {
		this.tabActive = this.$route.query.tab || 'list'
		this.tabClick()
	}
}
</script>