<template>
  <f7-page with-subnavbar>
    <f7-navbar back-link="Back" title="Tab Routes" sliding>
      <f7-subnavbar sliding>
        <f7-buttons>
          <f7-button route-tab-link="#chat" href="/home/chat/">微信</f7-button>
          <f7-button route-tab-link="#contacts" href="/home/contacts/">通讯录</f7-button>
          <f7-button route-tab-link="#find" href="/home/find/">发现</f7-button>
          <f7-button route-tab-link="#me" href="/home/me/">我</f7-button>
        </f7-buttons>
      </f7-subnavbar>
    </f7-navbar>
    <f7-tabs>
      <f7-tab id="chat">chat</f7-tab>
      <f7-tab id="contacts">contacts</f7-tab>
      <f7-tab id="find">find</f7-tab>
      <f7-tab id="me">me</f7-tab>
    </f7-tabs>
  </f7-page>
</template>

<script>
export default {
	mounted() {
		// console.log(this.$route)
	},
  methods: {
    onRouteChange() {
    }  
  },
  
}
</script>