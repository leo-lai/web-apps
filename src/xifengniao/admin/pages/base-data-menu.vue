<template>
	<div>
		
	</div>
</template>
<script>
export default {
	name: 'base-data-menu',
	data() {
		return {
			list: {
				data: []
			}
		}
	},
	methods: {
		getList() {
			
		}
	},
	mounted() {
		this.$$event.$on('base-data:tab', activeName => {
			if(activeName === 'menu' && this.list.data.length === 0) {
				this.getList()
			}
		})
	}
}
</script>