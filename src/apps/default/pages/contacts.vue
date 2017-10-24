<template>
  <f7-page name="contacts">
    <f7-navbar title="通讯录" sliding></f7-navbar>
    <f7-searchbar cancel-link="取消" placeholder="搜索":clear="true"></f7-searchbar>
    <f7-list contacts style="margin-top:0;">
      <f7-list-group v-for="(group, key) in contacts" :key="key">
        <f7-list-item :title="key" group-title></f7-list-item>
        <f7-list-item v-for="(name, index) in group" :title="name" :key="index"></f7-list-item>
      </f7-list-group>
    </f7-list>

  </f7-page>
</template>
<script>
  export default {
    data: function () {
      return {
        contacts: {
          'A': [
            'Aaron',
            'Abbie',
            'Adam',
            'Adele',
            'Agatha',
            'Agnes',
            'Albert',
            'Alexander'
          ],
          'B': [
            'Bailey',
            'Barclay',
            'Bartolo',
            'Bellamy',
            'Belle',
            'Benjamin'
          ],
          'C': [
            'Caiden',
            'Calvin',
            'Candy',
            'Carl',
            'Cherilyn',
            'Chester',
            'Chloe'
          ],
          'V': [
            'Vladimir'
          ]
        }
      }
    }
  }
</script>