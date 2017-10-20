<template>
  <f7-page name="contacts">
    <f7-navbar title="通讯录" sliding></f7-navbar>
  </f7-page>
</template>

<script>
export default {
  data() {
    return {
      toolbar: {
        active: {
          title: ''
        },
        data: []
      }
    }
  },
  mounted() {
    this.$root.$on('app:tab', active => {
      this.toolbar.active = active
    })
  }
}
</script>