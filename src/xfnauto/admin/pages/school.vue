<template>
	<div class="l-main-body" style="width: 1300px;">
		<el-tabs v-model="tabActive" @tab-click="tabClick" type="border-card">
		  <el-tab-pane label="文章列表" name="list">
		  	<school-list></school-list>
		  </el-tab-pane>
      <el-tab-pane label="官网留言列表" name="msg">
        <msg-list></msg-list>
      </el-tab-pane>
		</el-tabs>
	</div>
</template>
<script>
import { mapGetters } from 'vuex'
import schoolList from './school-list'
import msgList from './msg-list'
import guideVideo from './guide-video'
export default {
	name: 'school',
	components: {
		schoolList,
		msgList,
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