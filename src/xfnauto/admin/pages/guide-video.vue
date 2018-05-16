<template>
	<div>
		
	</div>
</template>
<script>
export default {
	name: 'guide-video',
	data() {
		return {
			
		}
	},
	methods: {
	},
	mounted() {
		this.$$event.$on('school:tab', (activeName, that) => {
			if(activeName === 'video') {

			}
		})
	}
}
</script>